import { browser } from "protractor";
import { BWF_BASE_URL, operation, security, type } from '../../utils/constants';
import apiHelper from "../../api/api.helper";
import casePreviewPo from '../../pageobject/case/case-preview.po';
import loginPage from "../../pageobject/common/login.po";
import navigationPage from "../../pageobject/common/navigation.po";
import editKnowledgePo from '../../pageobject/knowledge/edit-knowledge.po';
import knowledgeArticlePreview from '../../pageobject/knowledge/preview-knowledge.po';
import viewKnowledgeArticlePo from '../../pageobject/knowledge/view-knowledge-article.po';
import searchPo from '../../pageobject/search/global-search.po';
import viewCasetemplatePo from '../../pageobject/settings/case-management/view-casetemplate.po';
import taskPreviewPo from '../../pageobject/task/task-preview.po';
import viewTaskPo from '../../pageobject/task/view-task.po';
import utilityCommon from '../../utils/utility.common';
import utilityGrid from "../../utils/utility.grid";

let userData2 = undefined;

export interface IIDs {
    id: string;
    displayId: string;
}
describe('Global Search Category Validation', () => {
    let caseModule = "Case";
    let taskModule = "Task";
    let KAModule = "Knowledge Article";
    let updatedDate;

    beforeAll(async () => {
        await browser.get(BWF_BASE_URL);
        await loginPage.login('qtao');
        // Create Date
        let year: string;
        let month: string;
        let date: string;

        let objDate: Date = new Date();
        let numYear: number = objDate.getFullYear();
        year = new Number(numYear).toString();

        let numMonth: number = objDate.getMonth() + 1;
        let monthArr: string[] = ["Null", "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
        month = monthArr[numMonth];

        let numDate: number = objDate.getDate();
        let date1 = new Number(numDate);
        date = date1.toString();

        updatedDate = month + " " + date + ", " + year;

    });

    afterAll(async () => {
        await utilityCommon.closeAllBlades();
        await navigationPage.signOut();
    });

    async function createCase(caseSummary: string, caseDescription?: string): Promise<IIDs> {
        let caseData = {
            "Requester": "qkatawazi",
            "Summary": "caseSummary",
            "Description": "",
            "Assigned Company": "Petramco",
            "Business Unit": "India Support",
            "Support Group": "IN Support 3",
            "Assignee": "qcespedes"
        }

        caseData.Summary = caseSummary;
        caseData.Description = caseDescription;
        let getcaseId = await apiHelper.createCase(caseData);
        return {
            id: getcaseId.id,
            displayId: getcaseId.displayId
        };
    }

    async function createTask(taskName: string, caseIdTask: string, description?: string): Promise<string> {
        let taskData = {
            "requester":"qkatawazi",
            "taskName": "taskName",
            "description": "taskdescription",
            "company": "Petramco",
            "businessUnit": "Latin America Support",
            "supportGroup": "LA Support 2",
            "assignee": "qcolumbcille",
        }
        taskData.taskName = taskName;
        taskData.description = description;
        let getTaskId = await apiHelper.createAdhocTask(caseIdTask, taskData);
        return getTaskId.displayId;
    }

    async function createKnowledgeArticleWithDraft(knowledgeTitle: string): Promise<string> {
        let articleData = {
            "knowledgeSet": "HR",
            "title": "KATitle",
            "templateId": "AGGAA5V0HGVMIAOK2JE7O965BK1BJW",
            "assignedCompany": "Petramco",
            "keyword": "",
            "assigneeBusinessUnit": "Canada Support",
            "assigneeSupportGroup": "CA Support 1",
            "assignee": "qdu"
        }

        articleData.title = knowledgeTitle;
        let knowledgeArticleData = await apiHelper.createKnowledgeArticle(articleData);
        expect(await apiHelper.updateKnowledgeArticleStatus(knowledgeArticleData.id, 'Draft')).toBeTruthy('FailureMsg Status Not Set');
        return knowledgeArticleData.displayId;
    }

    async function createKnowledgeArticleWithPublish(knowledgeTitle: string, keyword?: string): Promise<string> {
        let articleData = {
            "knowledgeSet": "HR",
            "title": "KATitle",
            "templateId": "AGGAA5V0HGVMIAOK2JE7O965BK1BJW",
            "assignedCompany": "Petramco",
            "keyword": "",
            "assigneeBusinessUnit": "Canada Support",
            "assigneeSupportGroup": "CA Support 1",
            "assignee": "qdu"
        }

        articleData.title = knowledgeTitle;
        if (keyword) {
            articleData.keyword = keyword;
        }
        let knowledgeArticleData = await apiHelper.createKnowledgeArticle(articleData);
        expect(await apiHelper.updateKnowledgeArticleStatus(knowledgeArticleData.id, 'Draft')).toBeTruthy('FailureMsg Status Not Set');
        expect(await apiHelper.updateKnowledgeArticleStatus(knowledgeArticleData.id, 'PublishApproval', 'qdu', 'CA Support 1', 'Petramco')).toBeTruthy('FailureMsg Status Not Set');
        return knowledgeArticleData.displayId;
    }

    async function createKnowledgeArticleWithAttachment(knowledgeTitle: string, attachment: string): Promise<string> {
        let articleData = {
            "knowledgeSet": "HR",
            "title": "KATitle",
            "templateId": "AGGAA5V0HGVMIAOK2JE7O965BK1BJW",
            "assignedCompany": "Petramco",
            "assigneeBusinessUnit": "Canada Support",
            "assigneeSupportGroup": "CA Support 1",
            "assignee": "qdu"
        }
        articleData.title = knowledgeTitle;
        let knowledgeArticleData = await apiHelper.createKnowledgeArticle(articleData, attachment);
        expect(await apiHelper.updateKnowledgeArticleStatus(knowledgeArticleData.id, 'Draft')).toBeTruthy('FailureMsg Status Not Set');
        expect(await apiHelper.updateKnowledgeArticleStatus(knowledgeArticleData.id, 'PublishApproval', 'qdu', 'CA Support 1', 'Petramco')).toBeTruthy('FailureMsg Status Not Set');
        return knowledgeArticleData.displayId;
    }

    //kgaikwad
    describe('[4334]: Global search UI and availability of fields - cross verify with mockup', async () => {
        let randomStr = [...Array(4)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        let caseSummary = 'caseSummaryDRDMV16065' + randomStr;
        let caseId;
        beforeAll(async () => {
            await apiHelper.apiLogin('qtao');
            let caseDetails1 = await createCase(caseSummary);
            caseId = caseDetails1.displayId;
            await navigationPage.gotoSearch();
        });

        it('[4334]: Verify UI Fields', async () => {
            expect(await searchPo.isCategoryDropDownSelectedValueDisplayed('All')).toBeTruthy('FailureMsg1: Default value from catergory drop down is missing');
            expect(await searchPo.isSearchBoxLabelDisplayed()).toBeTruthy('FailureMsg2: Search Box Label is missing');
            await searchPo.searchRecordOnLeftPannel(caseSummary, caseModule);
            expect(await searchPo.isClearSearchButtonDisplayed()).toBeTruthy('FailureMsg3: Clear Search button is missing');
            await searchPo.clickOnLeftPannelRecord(caseId, caseModule);
            expect(await searchPo.isRecentSearchesButtonDisplayed()).toBeTruthy('FailureMsg4: Recent Searches button is missing');
            expect(await searchPo.isAdvanceFilterButtonDisplayed()).toBeTruthy('FailureMsg5: Advance Filter button is missing');
            expect(await searchPo.isLeftGlobalSearchPannelDisplayed()).toBeTruthy('FailureMsg6: Left Global Search is missing');
        });
        it('[4334]: Verify Case Preview Field Label', async () => {
            expect(await casePreviewPo.isFieldLabelDisplayed('Requester')).toBeTruthy('FailureMsg7: Requester label is missing');
            expect(await casePreviewPo.isFieldLabelDisplayed('Site')).toBeTruthy('FailureMsg8: Site label is missing');
            expect(await casePreviewPo.isFieldLabelDisplayed('Source')).toBeTruthy('FailureMsg9: Source label is missing');
            expect(await casePreviewPo.isFieldLabelDisplayed('Case Site')).toBeTruthy('FailureMsg10: Case Site label is missing');
            expect(await casePreviewPo.isFieldLabelDisplayed('Description')).toBeTruthy('FailureMsg11: Description label is missing');
            expect(await casePreviewPo.isFieldLabelDisplayed('Category Tier 1')).toBeTruthy('FailureMsg12: Category Tier 1 label is missing');
            expect(await casePreviewPo.isFieldLabelDisplayed('Category Tier 2')).toBeTruthy('FailureMsg13: Category Tier 2 label is missing');
            expect(await casePreviewPo.isFieldLabelDisplayed('Category Tier 3')).toBeTruthy('FailureMsg14: Category Tier 3 label is missing');
            expect(await casePreviewPo.isFieldLabelDisplayed('Category Tier 4')).toBeTruthy('FailureMsg15: Category Tier 4 label is missing');
            expect(await casePreviewPo.isFieldLabelDisplayed('Assignee')).toBeTruthy('FailureMsg16: Assignee label is missing');
            expect(await casePreviewPo.isFieldLabelDisplayed('Assigned Group')).toBeTruthy('FailureMsg30: Assigned Group label is missing');
            expect(await casePreviewPo.isFieldLabelDisplayed('Assigned Company')).toBeTruthy('FailureMsg18: Assigned Company label is missing');
        });
        it('[4334]: Verify Case Preview Field Values', async () => {
            expect(await casePreviewPo.isCaseSummaryDisplayed(caseSummary)).toBeTruthy('FailureMsg19: Case Summary label is missing');
            expect(await casePreviewPo.isGlobalSearchCaseIdDisplayed(caseId)).toBeTruthy('FailureMsg20: Case id is missing');
            expect(await casePreviewPo.isCaseStatusDisplayed('Assigned')).toBeTruthy('FailureMsg21: Case Status is missing');
            expect(await casePreviewPo.isPriorityDisplayed('Medium')).toBeTruthy('FailureMsg22: Case Priority is missing');
            expect(await casePreviewPo.isRequesterNameDisplayed('Qadim Katawazi')).toBeTruthy('FailureMsg23: Reqester Name missing');
            expect(await casePreviewPo.isRequesterCompanyDisplayed('Petramco')).toBeTruthy('FailureMsg24: Reqester Company is missing');
            expect(await casePreviewPo.isRequesterPhoneDisplayed('1 512 343-1923')).toBeTruthy('FailureMsg38: Reqester Phone is missing');
            expect(await casePreviewPo.isRequesterEmailIdDisplayed('qkatawazi@petramco.com')).toBeTruthy('FailureMsg26: Reqester Company is missing');
            expect(await casePreviewPo.isCaseSiteDisplayed('Austin')).toBeTruthy('FailureMsg27: Case Site Value is missing');
            expect(await casePreviewPo.isSourceDisplayed('External')).toBeTruthy('FailureMsg28: Source Value is missing');
            expect(await casePreviewPo.isRequesterSiteDisplayed('Austin\n10431 Morado Circle\nAvalon Building 5, Austin, Texas, 78759, United States ')).toBeTruthy('FailureMsg42: Reqester Site Value is missing');
            expect(await casePreviewPo.isAssigneeDisplayed('Quillan Cespedes')).toBeTruthy('FailureMsg43: Assignee Name is missing');
            expect(await casePreviewPo.getAssigneeDetails()).toContain('IN Support 3', 'FailureMsg44: Assigned Support Group Value is missing');
            expect(await casePreviewPo.getAssigneeDetails()).toContain('Petramco', 'FailureMsg32: Assigned Company Value is missing');
        });
        it('[4334]: Verify Modules Catergoy drop down ', async () => {
            let category: string[] = ['All', 'Case', 'Task', 'People', 'Knowledge', 'Document', 'Case Template', 'Task Template'];
            expect(await searchPo.isCategoryAllDropDownValuesMatches(category)).toBeTruthy('FailureMsg33: Category options mismatch');
        });
    });

    //kgaikwad
    describe('[4307]: Global search with only Case Category', async () => {
        let randomStr = [...Array(4)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        let summary = 'summaryDRDMV16102' + randomStr;
        let description = 'descriptionDRDMV16102' + randomStr;
        let nonMatchingSummary = 'NonMatchingSummaryDRDMV16102' + randomStr;
        let nonMatchingDescription = 'NonMatchingDescriptionDRDMV16102' + randomStr;
        let dummyDescription = 'DummayDRDMV16102' + randomStr;

        let caseDisplayId1 = [];
        let caseDisplayId2 = [];
        let caseDisplayId3;
        let caseDisplayId4 = [];

        beforeAll(async () => {
            await apiHelper.apiLogin('qtao');
            // Create Case with summary
            for (let a = 0; a < 2; a++) {
                await browser.sleep(1000);//Need this sleep becoz loop excecpt the records some time
                let caseDetails = await createCase(summary);
                caseDisplayId1[a] = caseDetails.displayId;
            }

            // Create Case For Description
            for (let b = 0; b < 2; b++) {
                await browser.sleep(1000);//Need this sleep becoz loop excecpt the records some time
                let caseDetails = await createCase(summary, description);
                caseDisplayId2[b] = caseDetails.displayId;
            }

            // Non maching case
            caseDisplayId3 = await createCase(nonMatchingSummary, nonMatchingDescription);

            // Non access to case
            await apiHelper.apiLogin('qcespedes');
            let caseDetails3 = await createCase(summary, description);
            caseDisplayId4[0] = caseDetails3.displayId;
        });

        it('[4307]: Verify Module Title & Pagination', async () => {
            await navigationPage.gotoSearch();
            expect(await searchPo.isCategoryDropDownSelectedValueDisplayed('All')).toBeTruthy('FailureMsg1: Default value from catergory drop down is missing');
            await searchPo.selectCategoryDropDownValue(caseModule);
            expect(await searchPo.isModuleTitleDisplayed(summary, 'Cases (4)', caseModule)).toBeTruthy('FailureMsg2: Case module title is missing');
            expect(await searchPo.isRecordDisplayedOnLeftPannel(caseDisplayId1[0], caseModule)).toBeTruthy(`FailureMsg4: ${caseDisplayId1[0]} case id  is missing`);
            expect(await searchPo.isRecordDisplayedOnLeftPannel(summary, caseModule)).toBeTruthy(`FailureMsg5: ${summary} case summary is missing`);
            expect(await searchPo.isRecordDisplayedOnLeftPannel(updatedDate, caseModule)).toBeTruthy(`${updatedDate} updatedDate is missing`);
            expect(await searchPo.isRecordDisplayedOnLeftPannel(caseDisplayId1[1], caseModule)).toBeTruthy(`FailureMsg6: ${caseDisplayId1[1]} case id  is missing`);
            expect(await searchPo.isRecordDisplayedOnLeftPannel(caseDisplayId2[0], caseModule)).toBeTruthy(`FailureMsg10: ${caseDisplayId2[0]} case id  is missing`);
            expect(await searchPo.isRecordDisplayedOnLeftPannel(caseDisplayId2[1], caseModule)).toBeTruthy(`FailureMsg11: ${caseDisplayId2[1]} case id  is missing`);
            await searchPo.clickOnLeftPannelRecord(caseDisplayId1[0], caseModule);
        });

        it('[4307]: Verify Case Preview Fields', async () => {
            expect(await casePreviewPo.isFieldLabelDisplayed('Requester')).toBeTruthy('FailureMsg20: Requester label is missing');
            expect(await casePreviewPo.isFieldLabelDisplayed('Site')).toBeTruthy('FailureMsg21: Site label is missing');
            expect(await casePreviewPo.isFieldLabelDisplayed('Source')).toBeTruthy('FailureMsg22: Source label is missing');
            expect(await casePreviewPo.isFieldLabelDisplayed('Case Site')).toBeTruthy('FailureMsg23: Case Site label is missing');
            expect(await casePreviewPo.isFieldLabelDisplayed('Description')).toBeTruthy('FailureMsg24: Description label is missing');
            expect(await casePreviewPo.isFieldLabelDisplayed('Category Tier 1')).toBeTruthy('FailureMsg25: Category Tier 1 label is missing');
            expect(await casePreviewPo.isFieldLabelDisplayed('Category Tier 2')).toBeTruthy('FailureMsg26: Category Tier 2 label is missing');
            expect(await casePreviewPo.isFieldLabelDisplayed('Category Tier 3')).toBeTruthy('FailureMsg27: Category Tier 3 label is missing');
            expect(await casePreviewPo.isFieldLabelDisplayed('Category Tier 4')).toBeTruthy('FailureMsg28: Category Tier 4 label is missing');
            expect(await casePreviewPo.isFieldLabelDisplayed('Assignee')).toBeTruthy('FailureMsg29: Assignee label is missing');
            expect(await casePreviewPo.isFieldLabelDisplayed('Assigned Group')).toBeTruthy('FailureMsg30: Assigned Group label is missing');
            expect(await casePreviewPo.isFieldLabelDisplayed('Assigned Company')).toBeTruthy('FailureMsg31: Assigned Company label is missing');

            expect(await casePreviewPo.isCaseSummaryDisplayed(summary)).toBeTruthy('FailureMsg20: Case Summary is missing');
            expect(await casePreviewPo.isGlobalSearchCaseIdDisplayed(caseDisplayId1[0])).toBeTruthy('FailureMsg33: Case id is missing');
            expect(await casePreviewPo.isCaseStatusDisplayed('Assigned')).toBeTruthy('FailureMsg34: Case Status is missing');
            expect(await casePreviewPo.isPriorityDisplayed('Medium')).toBeTruthy('FailureMsg35: Case Priority is missing');
            expect(await casePreviewPo.isRequesterNameDisplayed('Qadim Katawazi')).toBeTruthy('FailureMsg36: Reqester Name missing');
            expect(await casePreviewPo.isRequesterCompanyDisplayed('Petramco')).toBeTruthy('FailureMsg37: Reqester Company is missing');
            expect(await casePreviewPo.isRequesterPhoneDisplayed('1 512 343-1923')).toBeTruthy('FailureMsg38: Reqester Phone is missing');
            expect(await casePreviewPo.isRequesterEmailIdDisplayed('qkatawazi@petramco.com')).toBeTruthy('FailureMsg39: Reqester Company is missing');
            expect(await casePreviewPo.isCaseSiteDisplayed('Austin')).toBeTruthy('FailureMsg40: Case Site Value is missing');
            expect(await casePreviewPo.isSourceDisplayed('External')).toBeTruthy('FailureMsg41: Source Value is missing');
            expect(await casePreviewPo.isRequesterSiteDisplayed('Austin\n10431 Morado Circle\nAvalon Building 5, Austin, Texas, 78759, United States ')).toBeTruthy('FailureMsg42: Reqester Site Value is missing');
            expect(await casePreviewPo.isAssigneeDisplayed('Quillan Cespedes')).toBeTruthy('FailureMsg43: Assignee Name is missing');
            expect(await casePreviewPo.getAssigneeDetails()).toContain('IN Support 3', 'FailureMsg44: Assigned Support Group Value is missing');
            expect(await casePreviewPo.getAssigneeDetails()).toContain('Petramco');
            expect(await casePreviewPo.isDescriptionDisplayed(description)).toBeFalsy('FailureMsg46: case Description displayed');
            // Search Case with case description
            await searchPo.searchRecord(description);
            expect(await searchPo.isModuleTitleDisplayed(description, 'Cases (2)', caseModule)).toBeTruthy('FailureMsg47: Case module title is missing');
            browser.sleep(3000); //Wait until record display on left pannel
            await searchPo.clickOnLeftPannelRecord(caseDisplayId2[1], caseModule);
            expect(await casePreviewPo.isGlobalSearchCaseIdDisplayed(caseDisplayId2[1])).toBeTruthy('FailureMsg48: Case id is missing');
            expect(await casePreviewPo.isDescriptionDisplayed(description)).toBeTruthy('FailureMsg49: Case Description is missing');
        });

        it('[4307]: Click On Goto Case button and verify ', async () => {
            await casePreviewPo.clickGoToCaseButton();
            expect(await viewCasetemplatePo.getCaseTemplateId()).toBe(caseDisplayId2[1], 'FailureMsg50: Case id is missing on view case page');
        });

        it('[4307]: Verify Case with non matching Case summary and description Also Verify case summary and description who have not access of the case', async () => {
            await navigationPage.gotoSearch();
            await searchPo.searchRecord(summary);
            expect(await searchPo.isModuleTitleDisplayed(summary, 'Cases (4)', caseModule)).toBeTruthy('FailureMsg47: Case module title is missing');
            expect(await searchPo.isRecordDisplayedOnLeftPannel(nonMatchingSummary, caseModule)).toBeFalsy(`FailureMsg51: ${nonMatchingSummary} case Summary is missing`);
            expect(await searchPo.isRecordDisplayedOnLeftPannel(caseDisplayId3, caseModule)).toBeFalsy(`FailureMsg55: ${caseDisplayId3} case id  is displayed`);
            expect(await searchPo.isRecordDisplayedOnLeftPannel(caseDisplayId4[0], caseModule)).toBeFalsy(`FailureMsg55: ${caseDisplayId4[0]} case id  is displayed`);

            expect(await searchPo.isRecordDisplayedOnLeftPannel(nonMatchingSummary, caseModule)).toBeFalsy(`FailureMsg53: ${nonMatchingSummary} case Summary is missing`);
            expect(await searchPo.isRecordDisplayedOnLeftPannel(caseDisplayId3, caseModule)).toBeFalsy(`FailureMsg55: ${caseDisplayId3} case id  is displayed`);
            expect(await searchPo.isRecordDisplayedOnLeftPannel(caseDisplayId4[0], caseModule)).toBeFalsy(`FailureMsg57: ${caseDisplayId4[0]} case id  is displayed`);

            await searchPo.searchRecord(description);
            expect(await searchPo.isModuleTitleDisplayed(description, 'Cases (2)', caseModule)).toBeTruthy('FailureMsg59: Case module title is missing');
            expect(await searchPo.isRecordDisplayedOnLeftPannel(caseDisplayId3, caseModule)).toBeFalsy(`FailureMsg60: ${caseDisplayId3} case id  is displayed`);
        });

        it('[4307]: Clear search and verify record displayed on left pannel ', async () => {
            await searchPo.searchRecord(summary);
            expect(await searchPo.isModuleTitleDisplayed(summary, 'Cases (4)', caseModule)).toBeTruthy('FailureMsg61: Case module title is missing');
            await searchPo.clickClearSearchButton();
            expect(await searchPo.isClearSearchButtonDisplayed()).toBeFalsy('FailureMsg62: Search box is cleared and cross button gets hide');
            expect(await searchPo.isRecordDisplayedOnLeftPannel(caseDisplayId1[0], caseModule)).toBeTruthy(`FailureMsg63: ${caseDisplayId4[0]} case id  is missing`);
        });

        it('[4307]: Verify search functionality with dummy text ', async () => {
            await searchPo.searchRecord(dummyDescription);
            expect(await searchPo.isRecordDisplayedOnLeftPannel(dummyDescription, caseModule)).toBeFalsy(`FailureMsg64: ${dummyDescription} dummyText  is displayed`);
            expect(await searchPo.isModuleTitleDisplayed(dummyDescription, 'Cases (0)', caseModule)).toBeTruthy('FailureMsg65: Case module title is missing');
            expect(await searchPo.isBlankRecordValidationDisplayedOnLeftPanel(caseModule)).toBeTruthy(`FailureMsg66: No result found validation is missing`);
        });

        it('[4307]: Verify search case with Requester', async () => {
            await navigationPage.signOut();
            await loginPage.login('qkatawazi');
            await navigationPage.gotoSearch();

            await searchPo.searchRecord(nonMatchingSummary);
            expect(await searchPo.isModuleTitleDisplayed(nonMatchingSummary, 'Cases (0)', caseModule)).toBeTruthy('FailureMsg67: Case module title is missing');
            expect(await searchPo.isBlankRecordValidationDisplayedOnLeftPanel(caseModule)).toBeTruthy(`FailureMsg68: No result found validation is missing`);
            expect(await searchPo.isRecordDisplayedOnLeftPannel(caseDisplayId3, caseModule)).toBeFalsy(`FailureMsg69: ${caseDisplayId3} case id  is displayed`);

            await searchPo.searchRecord(nonMatchingDescription);
            expect(await searchPo.isModuleTitleDisplayed(nonMatchingDescription, 'Cases (0)', caseModule)).toBeTruthy('FailureMsg70: Case module title is missing');
            expect(await searchPo.isBlankRecordValidationDisplayedOnLeftPanel(caseModule)).toBeTruthy(`FailureMsg71: No result found validation is missing`);
            expect(await searchPo.isRecordDisplayedOnLeftPannel(caseDisplayId3, caseModule)).toBeFalsy(`FailureMsg72: ${caseDisplayId3} case id  is displayed`);


            await searchPo.searchRecord(summary);
            expect(await searchPo.isModuleTitleDisplayed(summary, 'Cases (0)', caseModule)).toBeTruthy('FailureMsg73: Case module title is missing');
            expect(await searchPo.isBlankRecordValidationDisplayedOnLeftPanel(caseModule)).toBeTruthy(`FailureMsg74: No result found validation is missing`);
            expect(await searchPo.isRecordDisplayedOnLeftPannel(caseDisplayId1[0], caseModule)).toBeFalsy(`FailureMsg75: ${caseDisplayId1[0]} case id  is displayed`);
            expect(await searchPo.isRecordDisplayedOnLeftPannel(caseDisplayId2[0], caseModule)).toBeFalsy(`FailureMsg76: ${caseDisplayId1[0]} case id  is displayed`);
            expect(await searchPo.isRecordDisplayedOnLeftPannel(caseDisplayId3, caseModule)).toBeFalsy(`FailureMsg77: ${caseDisplayId3} case id  is displayed`);
        });

        it('[4307]: Verify search case with assignee user', async () => {
            await navigationPage.signOut();
            await loginPage.login('qcespedes');
            await navigationPage.gotoSearch();
            await searchPo.searchRecord(summary);

            expect(await searchPo.isModuleTitleDisplayed(summary, 'Cases (5)', caseModule)).toBeTruthy('FailureMsg78: Case module title is missing');
            expect(await searchPo.isRecordDisplayedOnLeftPannel(summary, caseModule)).toBeTruthy(`FailureMsg79: ${summary} case Summary is missing`);

            expect(await searchPo.isRecordDisplayedOnLeftPannel(caseDisplayId1[0], caseModule)).toBeTruthy(`FailureMsg80: ${caseDisplayId1[0]} case id  is missing`);
            expect(await searchPo.isRecordDisplayedOnLeftPannel(caseDisplayId1[1], caseModule)).toBeTruthy(`FailureMsg81: ${caseDisplayId1[1]} case id  is missing`);
            expect(await searchPo.isRecordDisplayedOnLeftPannel(caseDisplayId2[0], caseModule)).toBeTruthy(`FailureMsg85: ${caseDisplayId2[0]} case id  is missing`);
            expect(await searchPo.isRecordDisplayedOnLeftPannel(caseDisplayId2[1], caseModule)).toBeTruthy(`FailureMsg86: ${caseDisplayId2[1]} case id  is missing`);
            expect(await searchPo.isRecordDisplayedOnLeftPannel(caseDisplayId4[0], caseModule)).toBeTruthy(`FailureMsg90: ${caseDisplayId4[0]} case id  is displayed`);
            await searchPo.searchRecord(description);
            expect(await searchPo.isModuleTitleDisplayed(description, 'Cases (3)', caseModule)).toBeTruthy('FailureMsg92: Case module title is missing');
            await browser.sleep(3000)//wait until record display
            expect(await searchPo.isRecordDisplayedOnLeftPannel(caseDisplayId2[0], caseModule)).toBeTruthy(`FailureMsg93: ${caseDisplayId2[0]} case id  is missing`);
            expect(await searchPo.isRecordDisplayedOnLeftPannel(caseDisplayId2[1], caseModule)).toBeTruthy(`FailureMsg94: ${caseDisplayId2[1]} case id  is missing`);

            expect(await searchPo.isRecordDisplayedOnLeftPannel(caseDisplayId4[0], caseModule)).toBeTruthy(`FailureMsg98: ${caseDisplayId4[0]} case id  is displayed`);
        });

        it('[4307]: Verify search case by other group user  ', async () => {
            await navigationPage.signOut();
            await loginPage.login('qheroux');
            await navigationPage.gotoSearch();
            await searchPo.searchRecord(summary);

            await searchPo.searchRecord(nonMatchingSummary);
            expect(await searchPo.isModuleTitleDisplayed(nonMatchingSummary, 'Cases (0)', caseModule)).toBeTruthy('FailureMsg100: Case module title is missing');
            expect(await searchPo.isBlankRecordValidationDisplayedOnLeftPanel(caseModule)).toBeTruthy(`FailureMsg101: No result found validation is missing`);
            expect(await searchPo.isRecordDisplayedOnLeftPannel(caseDisplayId3, caseModule)).toBeFalsy(`FailureMsg102: ${caseDisplayId3} case id  is displayed`);

            await searchPo.searchRecord(nonMatchingDescription);
            expect(await searchPo.isModuleTitleDisplayed(nonMatchingDescription, 'Cases (0)', caseModule)).toBeTruthy('FailureMsg63: Case module title is missing');
            expect(await searchPo.isBlankRecordValidationDisplayedOnLeftPanel(caseModule)).toBeTruthy(`FailureMsg103: No result found validation is missing`);
            expect(await searchPo.isRecordDisplayedOnLeftPannel(caseDisplayId3, caseModule)).toBeFalsy(`FailureMsg104: ${caseDisplayId3} case id  is displayed`);


            await searchPo.searchRecord(summary);
            expect(await searchPo.isModuleTitleDisplayed(summary, 'Cases (0)', caseModule)).toBeTruthy('FailureMsg105: Case module title is missing');
            expect(await searchPo.isBlankRecordValidationDisplayedOnLeftPanel(caseModule)).toBeTruthy(`FailureMsg106: No result found validation is missing`);
            expect(await searchPo.isRecordDisplayedOnLeftPannel(caseDisplayId1[0], caseModule)).toBeFalsy(`FailureMsg107: ${caseDisplayId1[0]} case id  is displayed`);
            expect(await searchPo.isRecordDisplayedOnLeftPannel(caseDisplayId2[0], caseModule)).toBeFalsy(`FailureMsg108: ${caseDisplayId1[0]} case id  is displayed`);
            expect(await searchPo.isRecordDisplayedOnLeftPannel(caseDisplayId3, caseModule)).toBeFalsy(`FailureMsg109: ${caseDisplayId3} case id  is displayed`);
        });

        it('[4307]: Verify Cases are accessible to other Line of business Case BA', async () => {
            await navigationPage.signOut();
            await loginPage.login('fritz');
            await navigationPage.gotoSearch();
            await searchPo.selectCategoryDropDownValue(caseModule);
            await searchPo.searchRecord(summary);
            expect(await searchPo.isModuleTitleDisplayed(summary, 'Cases (0)', caseModule)).toBeTruthy('FailureMsg105: Case module title is missing');
            expect(await searchPo.isBlankRecordValidationDisplayedOnLeftPanel(caseModule)).toBeTruthy(`FailureMsg106: No result found validation is missing`);
            expect(await searchPo.isRecordDisplayedOnLeftPannel(caseDisplayId1[0], caseModule)).toBeFalsy(`FailureMsg107: ${caseDisplayId1[0]} case id  is displayed`);
            expect(await searchPo.isRecordDisplayedOnLeftPannel(caseDisplayId2[0], caseModule)).toBeFalsy(`FailureMsg108: ${caseDisplayId1[0]} case id  is displayed`);
            expect(await searchPo.isRecordDisplayedOnLeftPannel(caseDisplayId3, caseModule)).toBeFalsy(`FailureMsg109: ${caseDisplayId3} case id  is displayed`);
        });

        it('[4307]: Verify Cases are accessible to other Line of business Case Manager', async () => {
            await navigationPage.signOut();
            await loginPage.login('frieda');
            await navigationPage.gotoSearch();
            await searchPo.selectCategoryDropDownValue(caseModule);
            await searchPo.searchRecord(summary);
            expect(await searchPo.isModuleTitleDisplayed(summary, 'Cases (0)', caseModule)).toBeTruthy('FailureMsg105: Case module title is missing');
            expect(await searchPo.isBlankRecordValidationDisplayedOnLeftPanel(caseModule)).toBeTruthy(`FailureMsg106: No result found validation is missing`);
            expect(await searchPo.isRecordDisplayedOnLeftPannel(caseDisplayId1[0], caseModule)).toBeFalsy(`FailureMsg107: ${caseDisplayId1[0]} case id  is displayed`);
            expect(await searchPo.isRecordDisplayedOnLeftPannel(caseDisplayId2[0], caseModule)).toBeFalsy(`FailureMsg108: ${caseDisplayId1[0]} case id  is displayed`);
            expect(await searchPo.isRecordDisplayedOnLeftPannel(caseDisplayId3, caseModule)).toBeFalsy(`FailureMsg109: ${caseDisplayId3} case id  is displayed`);
        });

        it('[4307]: Verify Cases are accessible to user belonging to multiple Line of business Case BA', async () => {
            await navigationPage.signOut();
            await loginPage.login('jbarnes');
            await utilityGrid.selectLineOfBusiness('Human Resource');
            await navigationPage.gotoSearch();
            await searchPo.selectCategoryDropDownValue(caseModule);
            await searchPo.searchRecord(summary);
            expect(await searchPo.isModuleTitleDisplayed(summary, 'Cases (5)', caseModule)).toBeTruthy('FailureMsg2: Case module title is missing');
            expect(await searchPo.isRecordDisplayedOnLeftPannel(caseDisplayId1[0], caseModule)).toBeTruthy(`FailureMsg4: ${caseDisplayId1[0]} case id  is missing`);
            expect(await searchPo.isRecordDisplayedOnLeftPannel(summary, caseModule)).toBeTruthy(`FailureMsg5: ${summary} case summary is missing`);
            expect(await searchPo.isRecordDisplayedOnLeftPannel(updatedDate, caseModule)).toBeTruthy(`${updatedDate} updatedDate is missing`);
            expect(await searchPo.isRecordDisplayedOnLeftPannel(caseDisplayId1[1], caseModule)).toBeTruthy(`FailureMsg6: ${caseDisplayId1[1]} case id  is missing`);
            expect(await searchPo.isRecordDisplayedOnLeftPannel(caseDisplayId2[0], caseModule)).toBeTruthy(`FailureMsg10: ${caseDisplayId2[0]} case id  is missing`);
            expect(await searchPo.isRecordDisplayedOnLeftPannel(caseDisplayId2[1], caseModule)).toBeTruthy(`FailureMsg11: ${caseDisplayId2[1]} case id  is missing`);
        });

        it('[4307]: Verify Cases are accessible to user belonging to multiple Line of business Case Manager', async () => {
            await navigationPage.signOut();
            await loginPage.login('qyuan');
            await utilityGrid.selectLineOfBusiness('Facilities');
            await navigationPage.gotoSearch();
            await searchPo.selectCategoryDropDownValue(caseModule);
            await searchPo.searchRecord(summary);
            expect(await searchPo.isModuleTitleDisplayed(summary, 'Cases (5)', caseModule)).toBeTruthy('FailureMsg2: Case module title is missing');
            expect(await searchPo.isRecordDisplayedOnLeftPannel(caseDisplayId1[0], caseModule)).toBeTruthy(`FailureMsg4: ${caseDisplayId1[0]} case id  is missing`);
            expect(await searchPo.isRecordDisplayedOnLeftPannel(summary, caseModule)).toBeTruthy(`FailureMsg5: ${summary} case summary is missing`);
            expect(await searchPo.isRecordDisplayedOnLeftPannel(updatedDate, caseModule)).toBeTruthy(`${updatedDate} updatedDate is missing`);
            expect(await searchPo.isRecordDisplayedOnLeftPannel(caseDisplayId1[1], caseModule)).toBeTruthy(`FailureMsg6: ${caseDisplayId1[1]} case id  is missing`);
            expect(await searchPo.isRecordDisplayedOnLeftPannel(caseDisplayId2[0], caseModule)).toBeTruthy(`FailureMsg10: ${caseDisplayId2[0]} case id  is missing`);
            expect(await searchPo.isRecordDisplayedOnLeftPannel(caseDisplayId2[1], caseModule)).toBeTruthy(`FailureMsg11: ${caseDisplayId2[1]} case id  is missing`);
        });

        afterAll(async () => {
            await navigationPage.signOut();
            await loginPage.login('qtao');
        });
    });

    //kgaikwad
    describe('[4296]:Global search with only Task Category', async () => {
        let randomStr = [...Array(4)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        let summary = 'summaryDRDMV16115' + randomStr;
        let summary2 = 'twoSummaryDRDMV16115' + randomStr;
        let description = 'taskDescriptionDRDMV16115' + randomStr;
        let nonMatchingSummary = 'NonMatchingSummaryDRDMV16115' + randomStr;
        let nonMatchingDescription = 'NonMatchingDescriptionDRDMV16115' + randomStr;
        let dummyDescription = 'DummayDRDMV16115' + randomStr;
        let taskDisplayId = [];
        let taskDisplayId2;
        let taskDisplayId3 = [];

        beforeAll(async () => {
            await apiHelper.apiLogin('qtao');
            let caseDetails1 = await createCase(summary);
            let caseGuid1 = caseDetails1.id;
            // Create Task
            for (let a = 0; a < 5; a++) {
                await browser.sleep(1000);//nEed this wait because loop except the record creation
                taskDisplayId[a] = await createTask(summary, caseGuid1, description);
            }

            // Non maching Task
            taskDisplayId2 = await createTask(nonMatchingSummary, caseGuid1, nonMatchingDescription);
            // Non access to Task
            await apiHelper.apiLogin('qcespedes');
            let caseDetails2 = await createCase(summary);
            let caseGuid2 = caseDetails2.id;

            for (let c = 0; c < 2; c++) {
                taskDisplayId3[c] = await createTask(summary2, caseGuid2, description);
            }
        });

        it('[4296]: Verify Module Title & Pagination', async () => {
            await navigationPage.gotoSearch();
            expect(await searchPo.isCategoryDropDownSelectedValueDisplayed('All')).toBeTruthy('FailureMsg1: Default value from catergory drop down is missing');
            await searchPo.selectCategoryDropDownValue(taskModule);
            expect(await searchPo.isModuleTitleDisplayed(summary, 'Tasks (5)', taskModule)).toBeTruthy('FailureMsg2: Task module title is missing');
            expect(await searchPo.isRecordDisplayedOnLeftPannel(taskDisplayId[0], taskModule)).toBeTruthy(`FailureMsg4: ${taskDisplayId[0]} task id  is missing`);

            expect(await searchPo.isRecordDisplayedOnLeftPannel(summary, taskModule)).toBeTruthy(`FailureMsg5: ${summary} Task summary is missing`);
            expect(await searchPo.isRecordDisplayedOnLeftPannel(updatedDate, taskModule)).toBeTruthy(`${updatedDate} updatedDate is missing`);
            expect(await searchPo.isRecordDisplayedOnLeftPannel(taskDisplayId[1], taskModule)).toBeTruthy(`FailureMsg6: ${taskDisplayId[1]} task id  is missing`);
            expect(await searchPo.isRecordDisplayedOnLeftPannel(taskDisplayId[2], taskModule)).toBeTruthy(`FailureMsg7: ${taskDisplayId[2]} task id  is missing`);
            expect(await searchPo.isRecordDisplayedOnLeftPannel(taskDisplayId[3], taskModule)).toBeTruthy(`FailureMsg8: ${taskDisplayId[3]} task id  is missing`);
            expect(await searchPo.isRecordDisplayedOnLeftPannel(taskDisplayId[4], taskModule)).toBeTruthy(`FailureMsg9: ${taskDisplayId[4]} task id  is missing`);

            await searchPo.clickOnLeftPannelRecord(taskDisplayId[0], taskModule);
        });

        it('[4296]: Verify Case Preview Field Label', async () => {
            expect(await taskPreviewPo.isFieldLabelDisplayed('Requester')).toBeTruthy('FailureMsg20: Requester label is missing');
            expect(await taskPreviewPo.isFieldLabelDisplayed('Site')).toBeTruthy('FailureMsg21: Site label is missing');
            expect(await taskPreviewPo.isFieldLabelDisplayed('Task Summary')).toBeTruthy('FailureMsg22: Task Summary is missing');
            expect(await taskPreviewPo.isFieldLabelDisplayed('Priority')).toBeTruthy('FailureMsg23: Priority is missing');
            expect(await taskPreviewPo.isFieldLabelDisplayed('Task Type')).toBeTruthy('FailureMsg24: Task Type label is missing');
            expect(await taskPreviewPo.isFieldLabelDisplayed('Category Tier 1')).toBeTruthy('FailureMsg25: Category Tier 1 label is missing');
            expect(await taskPreviewPo.isFieldLabelDisplayed('Category Tier 2')).toBeTruthy('FailureMsg26: Category Tier 2 label is missing');
            expect(await taskPreviewPo.isFieldLabelDisplayed('Category Tier 3')).toBeTruthy('FailureMsg27: Category Tier 3 label is missing');
            expect(await taskPreviewPo.isFieldLabelDisplayed('Category Tier 4')).toBeTruthy('FailureMsg28: Category Tier 4 label is missing');
            expect(await taskPreviewPo.isFieldLabelDisplayed('Assignee')).toBeTruthy('FailureMsg29: Assignee label is missing');
            expect(await taskPreviewPo.isFieldLabelDisplayed('Assigned Group')).toBeTruthy('FailureMsg30: Assigned Group label is missing');
            expect(await taskPreviewPo.isFieldLabelDisplayed('Assigned Company')).toBeTruthy('FailureMsg31: Assigned Company label is missing');
            expect(await taskPreviewPo.isFieldLabelDisplayed('Label')).toBeTruthy('FailureMsg32: Label is missing');
            expect(await taskPreviewPo.isFieldLabelDisplayed('Description')).toBeTruthy('FailureMsg33: Description label is missing');

            expect(await taskPreviewPo.isTaskTitleDisplayed(summary)).toBeTruthy('FailureMsg34: Task Title Displayed is missing');
            expect(await taskPreviewPo.isTaskIdDisplayed(taskDisplayId[0])).toBeTruthy('FailureMsg35: Task id is missing');
            expect(await taskPreviewPo.isTaskStatusDisplayed('Staged')).toBeTruthy('FailureMsg36: Task Status is missing');
            expect(await taskPreviewPo.isTaskPriorityLabelDisplayed('Medium')).toBeTruthy('FailureMsg37: Task Priority is missing');
            expect(await taskPreviewPo.isPriorityValueDisplayed('Medium')).toBeTruthy('FailureMsg38: Task Priority field value is missing');
            expect(await taskPreviewPo.isAssigneeNameDisplayed('Quies Columbcille')).toBeTruthy('FailureMsg39: Assignee Name is missing');
            expect(await taskPreviewPo.isAassignedGroupValueDisplayed('LA Support 2')).toBeTruthy('FailureMsg40: Assigned Support Group Value is missing');
            expect(await taskPreviewPo.isTaskDescriptionDisplayed(description)).toBeTruthy('FailureMsg41: Task Description value is missing');
        });

        it('[4296]: Search Task with description', async () => {
            await searchPo.searchRecord(description);
            expect(await searchPo.isModuleTitleDisplayed(description, 'Tasks (5)', taskModule)).toBeTruthy('FailureMsg42: Task module title is missing');
            await browser.sleep(3000); //Wait until record display on left pannel
            await searchPo.clickOnLeftPannelRecord(taskDisplayId[1], taskModule);
            expect(await taskPreviewPo.isTaskIdDisplayed(taskDisplayId[1])).toBeTruthy('FailureMsg43: Task id is missing');
            expect(await taskPreviewPo.isTaskDescriptionDisplayed(description)).toBeTruthy('FailureMsg44: Task Description is missing');
        });

        it('[4296]: Click On Goto Task button and verify ', async () => {
            await taskPreviewPo.clickGotoTaskButton();
            expect(await viewTaskPo.getTaskID()).toBe(taskDisplayId[1], 'FailureMsg45: Task id is missing on view task page');
        });

        it('[4296]: Verify Task with non matching Task summary and description Also Verify Task summary and description who have not access of the task', async () => {
            await navigationPage.gotoSearch();
            await searchPo.searchRecord(summary);
            expect(await searchPo.isModuleTitleDisplayed(summary, 'Tasks (5)', taskModule)).toBeTruthy('FailureMsg54: Task module title is missing');
            expect(await searchPo.isRecordDisplayedOnLeftPannel(nonMatchingSummary, taskModule)).toBeFalsy(`FailureMsg46: ${nonMatchingSummary} task Summary is missing`);
            expect(await searchPo.isRecordDisplayedOnLeftPannel(taskDisplayId3[0], taskModule)).toBeFalsy(`FailureMsg48: ${taskDisplayId3[0]} task id  is displayed`);
            expect(await searchPo.isRecordDisplayedOnLeftPannel(taskDisplayId3[1], taskModule)).toBeFalsy(`FailureMsg49: ${taskDisplayId3[1]} task id  is displayed`);

            await searchPo.searchRecord(summary2);
            expect(await searchPo.isModuleTitleDisplayed(summary2, 'Tasks (0)', taskModule)).toBeTruthy('FailureMsg54: Task module title is missing');
            expect(await searchPo.isRecordDisplayedOnLeftPannel(taskDisplayId3[0], taskModule)).toBeFalsy(`FailureMsg48: ${taskDisplayId3[0]} task id  is displayed`);
            expect(await searchPo.isRecordDisplayedOnLeftPannel(taskDisplayId3[1], taskModule)).toBeFalsy(`FailureMsg49: ${taskDisplayId3[1]} task id  is displayed`);
        });

        it('[4296]: Clear search and verify record displayed on left pannel ', async () => {
            await searchPo.searchRecord(summary);
            expect(await searchPo.isModuleTitleDisplayed(summary, 'Tasks (5)', taskModule)).toBeTruthy('FailureMsg54: Task module title is missing');
            await searchPo.clickClearSearchButton();
            expect(await searchPo.isClearSearchButtonDisplayed()).toBeFalsy('FailureMsg55: Search box is cleared and cross button gets hide');
            expect(await searchPo.isRecordDisplayedOnLeftPannel(taskDisplayId[0], taskModule)).toBeTruthy(`FailureMsg56: ${taskDisplayId3[0]} task id  is missing`);
        });

        it('[4296]: Verify search functionality with dummy text ', async () => {
            await searchPo.searchRecord(dummyDescription);
            expect(await searchPo.isRecordDisplayedOnLeftPannel(dummyDescription, taskModule)).toBeFalsy(`FailureMsg57: ${dummyDescription} dummyText  is displayed`);
            expect(await searchPo.isModuleTitleDisplayed(dummyDescription, 'Tasks (0)', taskModule)).toBeTruthy('FailureMsg58: Task module title is missing');
            expect(await searchPo.isBlankRecordValidationDisplayedOnLeftPanel(taskModule)).toBeTruthy(`FailureMsg59: No result found validation is missing`);
        });

        it('[4296]: Verify search Task with case reqester', async () => {
            await navigationPage.signOut();
            await loginPage.login('qkatawazi');
            await navigationPage.gotoSearch();
            await searchPo.searchRecord(nonMatchingSummary);
            expect(await searchPo.isModuleTitleDisplayed(nonMatchingSummary, 'Tasks (0)', taskModule)).toBeTruthy('FailureMsg58: Task module title is missing');
            expect(await searchPo.isBlankRecordValidationDisplayedOnLeftPanel(taskModule)).toBeTruthy(`FailureMsg59: No result found validation missing`);
            expect(await searchPo.isRecordDisplayedOnLeftPannel(taskDisplayId2, taskModule)).toBeFalsy(`FailureMsg48: ${taskDisplayId2} task id  is displayed`);
            await searchPo.searchRecord(nonMatchingDescription);
            expect(await searchPo.isModuleTitleDisplayed(nonMatchingSummary, 'Tasks (0)', taskModule)).toBeTruthy('FailureMsg58: Task module title is missing');
            expect(await searchPo.isBlankRecordValidationDisplayedOnLeftPanel(taskModule)).toBeTruthy(`FailureMsg59: No result found validation is missing`);
            expect(await searchPo.isRecordDisplayedOnLeftPannel(taskDisplayId2, taskModule)).toBeFalsy(`FailureMsg48: ${taskDisplayId2} task id  is displayed`);

            await searchPo.searchRecord(summary);
            expect(await searchPo.isModuleTitleDisplayed(summary, 'Tasks (0)', taskModule)).toBeTruthy('FailureMsg58: Task module title is missing');
            expect(await searchPo.isBlankRecordValidationDisplayedOnLeftPanel(taskModule)).toBeTruthy(`FailureMsg59: No result found validation is missing`);
            expect(await searchPo.isRecordDisplayedOnLeftPannel(taskDisplayId[0], taskModule)).toBeFalsy(`FailureMsg48: ${taskDisplayId[0]} task id  is displayed`);
        });

        it('[4296]: Verify search Task with assignee user ', async () => {
            await navigationPage.signOut();
            await loginPage.login('qcolumbcille');
            await navigationPage.gotoSearch();
            await searchPo.searchRecord(summary);
            expect(await searchPo.isModuleTitleDisplayed(summary, 'Tasks (5)', taskModule)).toBeTruthy('FailureMsg42: Task module title is missing');
            expect(await searchPo.isRecordDisplayedOnLeftPannel(taskDisplayId[0], taskModule)).toBeTruthy(`FailureMsg6: ${taskDisplayId[0]} task id  is missing`);
            expect(await searchPo.isRecordDisplayedOnLeftPannel(taskDisplayId[1], taskModule)).toBeTruthy(`FailureMsg6: ${taskDisplayId[1]} task id  is missing`);
            expect(await searchPo.isRecordDisplayedOnLeftPannel(taskDisplayId[2], taskModule)).toBeTruthy(`FailureMsg7: ${taskDisplayId[2]} task id  is missing`);
            expect(await searchPo.isRecordDisplayedOnLeftPannel(taskDisplayId[3], taskModule)).toBeTruthy(`FailureMsg8: ${taskDisplayId[3]} task id  is missing`);
            expect(await searchPo.isRecordDisplayedOnLeftPannel(taskDisplayId[4], taskModule)).toBeTruthy(`FailureMsg9: ${taskDisplayId[4]} task id  is missing`);

            await searchPo.searchRecord(summary2);
            expect(await searchPo.isModuleTitleDisplayed(summary2, 'Tasks (2)', taskModule)).toBeTruthy('FailureMsg43: Task module title is missing');
            expect(await searchPo.isRecordDisplayedOnLeftPannel(taskDisplayId3[0], taskModule)).toBeTruthy(`FailureMsg10: ${taskDisplayId3[0]} task id  is missing`);
            expect(await searchPo.isRecordDisplayedOnLeftPannel(taskDisplayId3[1], taskModule)).toBeTruthy(`FailureMsg11: ${taskDisplayId3[2]} task id  is missing`);

            await searchPo.searchRecord(nonMatchingSummary);
            expect(await searchPo.isModuleTitleDisplayed(summary, 'Tasks (1)', taskModule)).toBeTruthy('FailureMsg42: Task module title is missing');
            expect(await searchPo.isRecordDisplayedOnLeftPannel(taskDisplayId2, taskModule)).toBeTruthy(`FailureMsg48: ${taskDisplayId2} task id  is missing`);
        });

        it('[4296]: Verify search task with other group user', async () => {
            await navigationPage.signOut();
            await loginPage.login('qheroux');
            await navigationPage.gotoSearch();
            await searchPo.searchRecord(nonMatchingSummary);
            expect(await searchPo.isModuleTitleDisplayed(nonMatchingSummary, 'Tasks (0)', taskModule)).toBeTruthy('FailureMsg58: Task module title is missing');
            expect(await searchPo.isBlankRecordValidationDisplayedOnLeftPanel(taskModule)).toBeTruthy(`FailureMsg59: No result found validation missing`);
            expect(await searchPo.isRecordDisplayedOnLeftPannel(taskDisplayId2, taskModule)).toBeFalsy(`FailureMsg48: ${taskDisplayId2} task id  is displayed`);

            await searchPo.searchRecord(nonMatchingDescription);
            expect(await searchPo.isModuleTitleDisplayed(nonMatchingSummary, 'Tasks (0)', taskModule)).toBeTruthy('FailureMsg58: Task module title is missing');
            expect(await searchPo.isBlankRecordValidationDisplayedOnLeftPanel(taskModule)).toBeTruthy(`FailureMsg59: No result found validation is missing`);
            expect(await searchPo.isRecordDisplayedOnLeftPannel(taskDisplayId2, taskModule)).toBeFalsy(`FailureMsg48: ${taskDisplayId2} task id  is displayed`);

            await searchPo.searchRecord(summary);
            expect(await searchPo.isModuleTitleDisplayed(summary, 'Tasks (0)', taskModule)).toBeTruthy('FailureMsg58: Task module title is missing');
            expect(await searchPo.isBlankRecordValidationDisplayedOnLeftPanel(taskModule)).toBeTruthy(`FailureMsg59: No result found validation is missing`);
            expect(await searchPo.isRecordDisplayedOnLeftPannel(taskDisplayId[0], taskModule)).toBeFalsy(`FailureMsg48: ${taskDisplayId[0]} task id  is displayed`);
        });

        it('[4296]: Verify search Task with case assignee user ', async () => {
            await navigationPage.signOut();
            await loginPage.login('qcespedes');
            await navigationPage.gotoSearch();
            await searchPo.selectCategoryDropDownValue(taskModule);

            await searchPo.searchRecord(summary);
            expect(await searchPo.isModuleTitleDisplayed(summary, 'Tasks (5)', taskModule)).toBeTruthy('FailureMsg42: Task module title is missing');
            expect(await searchPo.isRecordDisplayedOnLeftPannel(taskDisplayId[0], taskModule)).toBeTruthy(`FailureMsg6: ${taskDisplayId[0]} task id  is missing`);
            expect(await searchPo.isRecordDisplayedOnLeftPannel(taskDisplayId[1], taskModule)).toBeTruthy(`FailureMsg6: ${taskDisplayId[1]} task id  is missing`);
            expect(await searchPo.isRecordDisplayedOnLeftPannel(taskDisplayId[2], taskModule)).toBeTruthy(`FailureMsg7: ${taskDisplayId[2]} task id  is missing`);
            expect(await searchPo.isRecordDisplayedOnLeftPannel(taskDisplayId[3], taskModule)).toBeTruthy(`FailureMsg8: ${taskDisplayId[3]} task id  is missing`);
            expect(await searchPo.isRecordDisplayedOnLeftPannel(taskDisplayId[4], taskModule)).toBeTruthy(`FailureMsg9: ${taskDisplayId[4]} task id  is missing`);
        });

        it('[4296]: Verify Tasks are accessible to other Line of business Case BA', async () => {
            await navigationPage.signOut();
            await loginPage.login('fritz');
            await navigationPage.gotoSearch();
            await searchPo.selectCategoryDropDownValue(taskModule);
            await searchPo.searchRecord(summary);
            expect(await searchPo.isModuleTitleDisplayed(summary, 'Tasks (0)', taskModule)).toBeTruthy('FailureMsg58: Task module title is missing');
            expect(await searchPo.isBlankRecordValidationDisplayedOnLeftPanel(taskModule)).toBeTruthy(`FailureMsg59: No result found validation is missing`);
            expect(await searchPo.isRecordDisplayedOnLeftPannel(taskDisplayId[0], taskModule)).toBeFalsy(`FailureMsg48: ${taskDisplayId[0]} task id  is displayed`);
        });

        it('[4296]: Verify Tasks are accessible to other Line of business Case Manager', async () => {
            await navigationPage.signOut();
            await loginPage.login('frieda');
            await navigationPage.gotoSearch();
            await searchPo.selectCategoryDropDownValue(taskModule);
            await searchPo.searchRecord(summary);
            expect(await searchPo.isModuleTitleDisplayed(summary, 'Tasks (0)', taskModule)).toBeTruthy('FailureMsg58: Task module title is missing');
            expect(await searchPo.isBlankRecordValidationDisplayedOnLeftPanel(taskModule)).toBeTruthy(`FailureMsg59: No result found validation is missing`);
            expect(await searchPo.isRecordDisplayedOnLeftPannel(taskDisplayId[0], taskModule)).toBeFalsy(`FailureMsg48: ${taskDisplayId[0]} task id  is displayed`);
        });

        it('[4296]: Verify Tasks are accessible to user belonging to multiple Line of business Case BA', async () => {
            await navigationPage.signOut();
            await loginPage.login('jbarnes');
            await navigationPage.gotoSearch();
            await searchPo.selectCategoryDropDownValue(taskModule);
            await searchPo.searchRecord(summary);
            expect(await searchPo.isModuleTitleDisplayed(summary, 'Tasks (5)', taskModule)).toBeTruthy('FailureMsg42: Task module title is missing');
            expect(await searchPo.isRecordDisplayedOnLeftPannel(taskDisplayId[0], taskModule)).toBeTruthy(`FailureMsg6: ${taskDisplayId[0]} task id  is missing`);
            expect(await searchPo.isRecordDisplayedOnLeftPannel(taskDisplayId[1], taskModule)).toBeTruthy(`FailureMsg6: ${taskDisplayId[1]} task id  is missing`);
            expect(await searchPo.isRecordDisplayedOnLeftPannel(taskDisplayId[2], taskModule)).toBeTruthy(`FailureMsg7: ${taskDisplayId[2]} task id  is missing`);
            expect(await searchPo.isRecordDisplayedOnLeftPannel(taskDisplayId[3], taskModule)).toBeTruthy(`FailureMsg8: ${taskDisplayId[3]} task id  is missing`);
            expect(await searchPo.isRecordDisplayedOnLeftPannel(taskDisplayId[4], taskModule)).toBeTruthy(`FailureMsg9: ${taskDisplayId[4]} task id  is missing`);
        });

        it('[4296]: Verify Tasks are accessible to user belonging to multiple Line of business Case Manager', async () => {
            await navigationPage.signOut();
            await loginPage.login('qyuan');
            await navigationPage.gotoSearch();
            await searchPo.selectCategoryDropDownValue(taskModule);
            await searchPo.searchRecord(summary);
            expect(await searchPo.isModuleTitleDisplayed(summary, 'Tasks (5)', taskModule)).toBeTruthy('FailureMsg42: Task module title is missing');
            expect(await searchPo.isRecordDisplayedOnLeftPannel(taskDisplayId[0], taskModule)).toBeTruthy(`FailureMsg6: ${taskDisplayId[0]} task id  is missing`);
            expect(await searchPo.isRecordDisplayedOnLeftPannel(taskDisplayId[1], taskModule)).toBeTruthy(`FailureMsg6: ${taskDisplayId[1]} task id  is missing`);
            expect(await searchPo.isRecordDisplayedOnLeftPannel(taskDisplayId[2], taskModule)).toBeTruthy(`FailureMsg7: ${taskDisplayId[2]} task id  is missing`);
            expect(await searchPo.isRecordDisplayedOnLeftPannel(taskDisplayId[3], taskModule)).toBeTruthy(`FailureMsg8: ${taskDisplayId[3]} task id  is missing`);
            expect(await searchPo.isRecordDisplayedOnLeftPannel(taskDisplayId[4], taskModule)).toBeTruthy(`FailureMsg9: ${taskDisplayId[4]} task id  is missing`);
        });

        afterAll(async () => {
            await navigationPage.signOut();
            await loginPage.login('qtao');
        });
    });

    //kgaikwad
    describe('[4297]: Global search with only Knowledge Articles Category', async () => {
        let randomStr = [...Array(4)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        let attachmentFilePath = 'e2e/data/ui/search/globalsearch2.json';
        let summary1 = '1summaryDRDMV16114' + randomStr;
        let summary2 = '2summaryDRDMV16114' + randomStr;
        let summary3 = '3summaryDRDMV16114' + randomStr;
        let summary4 = '4summaryDRDMV16114' + randomStr;
        let summary5 = '5summaryDRDMV16114' + randomStr;
        let keywordStr = 'keywordDRDMV16114' + randomStr;
        let dummyText = 'DummayDRDMV16114' + randomStr;
        let nonMatchingSummary = 'NonMatchingSummaryDRDMV16114' + randomStr;
        let actualDate;
        let expectedVersion1;
        let expectedVersion2;

        let kaDisplayId1 = [];
        let kaDisplayId2 = [];
        let kaDisplayId3;
        let kaDisplayId4;
        let kaDisplayId5 = [];
        let kaDisplayId6;

        beforeAll(async () => {
            actualDate = await viewKnowledgeArticlePo.formatDate();
            expectedVersion1 = "Version " + "1" + " - " + actualDate;
            expectedVersion2 = "Version " + "2" + " - " + actualDate;

            await apiHelper.apiLogin('qtao');
            // Create KA 
            for (let a = 0; a < 5; a++) {
                await browser.sleep(1000); //Need this sleep create record with correct count and avoid skip the record from loop
                kaDisplayId1[a] = await createKnowledgeArticleWithPublish(summary1);
            }

            // Create KA with Keyword
            for (let b = 0; b < 5; b++) {
                await browser.sleep(1000); //Need this sleep create record with correct count and avoid skip the record from loop
                kaDisplayId2[b] = await createKnowledgeArticleWithPublish(summary2, keywordStr);
            }

            // Create KA with attachment
            kaDisplayId3 = await createKnowledgeArticleWithAttachment(summary3, attachmentFilePath);

            // Non maching Knowledge Article
            kaDisplayId4 = await createKnowledgeArticleWithPublish(nonMatchingSummary);

            //  Create KA with Draft
            await createKnowledgeArticleWithDraft(summary4);

            // Create KA for Version
            kaDisplayId6 = await createKnowledgeArticleWithPublish(summary5);

            // Non access to Knowledge Article
            await apiHelper.apiLogin('qstrong');
            for (let d = 0; d < 2; d++) {
                await browser.sleep(1000); //Need this sleep create record with correct count and avoid skip the record from loop.
                kaDisplayId5[d] = await createKnowledgeArticleWithPublish(nonMatchingSummary);
            }

        });

        it('[4297]: Create KA version 2 also verify version 1 with publish status and also verify KA as Draft status', async () => {
            await navigationPage.gotoSearch();
            await searchPo.searchRecord(summary5);
            expect(await searchPo.isModuleTitleDisplayed(summary5, 'Knowledge Articles (1)', KAModule)).toBeTruthy('FailureMsg47: KA module title is missing');
            await searchPo.clickOnLeftPannelRecord(kaDisplayId6, KAModule);
            expect(await knowledgeArticlePreview.getArticleVersion()).toBe(expectedVersion1, 'FailureMsg23: version 1 is missing on KA preview');
            await knowledgeArticlePreview.clickGoToArticleButton();

            await viewKnowledgeArticlePo.clickOnEditLink();
            await editKnowledgePo.selectArticleEditOption('Major Edit');
            await editKnowledgePo.clickArticleMajorEditSaveButton();
            expect(await viewKnowledgeArticlePo.isEditLinkDisplayedOnKA()).toBeTruthy('KA edit link is missing');
            expect(await viewKnowledgeArticlePo.getArticleVersion()).toBe(expectedVersion2, 'version missing on view KA page');
            await editKnowledgePo.setKnowledgeStatus('Publish Approval');
            await browser.sleep(4000);//Need this sleep till status gets change from Publish Approval to Published
            await utilityCommon.refresh(); // Need this refresh status gets change from Publish Approval to Published

            expect(await viewKnowledgeArticlePo.getStatusValue()).toBe('Published', 'FailureMsg25: On view knowledge article status value is missing');

            // Verify with draft status
            await navigationPage.gotoSearch();
            await searchPo.searchRecord(summary4);
            expect(await searchPo.isModuleTitleDisplayed(summary4, 'Knowledge Articles (0)', KAModule)).toBeTruthy('FailureMsg58: KA module title is missing');
            expect(await searchPo.isBlankRecordValidationDisplayedOnLeftPanel(KAModule)).toBeTruthy(`FailureMsg59: No result found validation is missing`);
        });

        it('[4297]: Verify Module Title & Pagination', async () => {
            await navigationPage.gotoSearch();
            expect(await searchPo.isCategoryDropDownSelectedValueDisplayed('All')).toBeTruthy('FailureMsg1: Default value from catergory drop down is missing');
            await searchPo.selectCategoryDropDownValue('Knowledge');
            expect(await searchPo.isModuleTitleDisplayed(summary1, 'Knowledge Articles (5)', KAModule)).toBeTruthy('FailureMsg2: KA module title is missing');
            expect(await searchPo.isRecordDisplayedOnLeftPannel(kaDisplayId1[0], KAModule)).toBeTruthy(`FailureMsg4: ${kaDisplayId1[0]} Knowledge Article id  is missing`);
            expect(await searchPo.isRecordDisplayedOnLeftPannel(summary1, KAModule)).toBeTruthy(`FailureMsg5: ${summary1} Knowledge Article summary is missing`);
            expect(await searchPo.isRecordDisplayedOnLeftPannel(updatedDate, KAModule)).toBeTruthy(`${updatedDate} updatedDate is missing`);
            expect(await searchPo.isRecordDisplayedOnLeftPannel(kaDisplayId1[1], KAModule)).toBeTruthy(`FailureMsg6: ${kaDisplayId1[1]} Knowledge Article id  is missing`);
            expect(await searchPo.isRecordDisplayedOnLeftPannel(kaDisplayId1[2], KAModule)).toBeTruthy(`FailureMsg7: ${kaDisplayId1[2]} Knowledge Article id  is missing`);
            expect(await searchPo.isRecordDisplayedOnLeftPannel(kaDisplayId1[3], KAModule)).toBeTruthy(`FailureMsg8: ${kaDisplayId1[3]} Knowledge Article id  is missing`);
            expect(await searchPo.isRecordDisplayedOnLeftPannel(kaDisplayId1[4], KAModule)).toBeTruthy(`FailureMsg9: ${kaDisplayId1[4]} Knowledge Article id  is missing`);

            await searchPo.searchRecord(summary2);
            expect(await searchPo.isModuleTitleDisplayed(summary2, 'Knowledge Articles (5)', KAModule)).toBeTruthy('FailureMsg2: KA module title is missing');
            expect(await searchPo.isRecordDisplayedOnLeftPannel(kaDisplayId2[0], KAModule)).toBeTruthy(`FailureMsg10: ${kaDisplayId2[0]} Knowledge Article id  is missing`);
            expect(await searchPo.isRecordDisplayedOnLeftPannel(kaDisplayId2[1], KAModule)).toBeTruthy(`FailureMsg11: ${kaDisplayId2[1]} Knowledge Article id  is missing`);
            expect(await searchPo.isRecordDisplayedOnLeftPannel(kaDisplayId2[2], KAModule)).toBeTruthy(`FailureMsg12: ${kaDisplayId2[2]} Knowledge Article id  is missing`);
            expect(await searchPo.isRecordDisplayedOnLeftPannel(kaDisplayId2[3], KAModule)).toBeTruthy(`FailureMsg13: ${kaDisplayId2[3]} Knowledge Article id  is missing`);
            expect(await searchPo.isRecordDisplayedOnLeftPannel(kaDisplayId2[4], KAModule)).toBeTruthy(`FailureMsg14: ${kaDisplayId2[4]} Knowledge Article id  is missing`);

            expect(await searchPo.isModuleTitleDisplayed(summary3, 'Knowledge Articles (1)', KAModule)).toBeTruthy('FailureMsg2: KA module title is missing');
            expect(await searchPo.isRecordDisplayedOnLeftPannel(kaDisplayId3, KAModule)).toBeTruthy(`FailureMsg101: ${kaDisplayId3[0]} Knowledge Article id  is missing`);

            await searchPo.searchRecord(summary1);
            await searchPo.clickOnLeftPannelRecord(kaDisplayId1[0], KAModule);
        });

        it('[4297]: Verify KA Preview Fields', async () => {
            expect(await knowledgeArticlePreview.isFieldLabelDisplayed('Question')).toBeTruthy('FailureMsg22: field label displayed');
            expect(await knowledgeArticlePreview.isFieldLabelDisplayed('Answer')).toBeTruthy('FailureMsg22: field label displayed');
            expect(await knowledgeArticlePreview.isFieldLabelDisplayed('Technical Notes')).toBeTruthy('FailureMsg22: field label displayed');
            expect(await knowledgeArticlePreview.getArticleVersion()).toBe(expectedVersion1, 'FailureMsg23: version 1 is missing on KA preview')

            expect(await knowledgeArticlePreview.getKnowledgeArticleTitle()).toBe(summary1, 'FailureMsg20: knowledge article title');
            expect(await knowledgeArticlePreview.getKnowledgeArticleID()).toContain(kaDisplayId1[0], 'FailureMsg21: get knowledge Article id');
            expect(await knowledgeArticlePreview.isStatusOfKADisplay()).toBeTruthy('FailureMsg22: Status KA Displayed');
            expect(await knowledgeArticlePreview.getKnowledgeArticleSection()).toBe('article versioning test description', 'FailureMsg23: description is missing');

            // Verify Search KA keyword
            await searchPo.searchRecord(keywordStr);
            expect(await searchPo.isModuleTitleDisplayed(keywordStr, 'Knowledge Articles (5)', KAModule)).toBeTruthy('FailureMsg47: KA module title is missing');
            await searchPo.clickOnLeftPannelRecord(kaDisplayId2[0], KAModule);
            expect(await knowledgeArticlePreview.isKnowledgeArticleID()).toBeTruthy('FailureMsg48: KA id is missing');

            //Verify  Search KA attachment
            await searchPo.searchRecord('globalsearch2.json');
            expect(await searchPo.isModuleTitleDisplayed('globalsearch2.json', 'Knowledge Articles (1)', KAModule)).toBeTruthy('FailureMsg47: Knowledge Articles module title is missing');
            await searchPo.clickOnLeftPannelRecord(kaDisplayId3, KAModule);
            expect(await knowledgeArticlePreview.isKnowledgeArticleID()).toBeTruthy('FailureMsg48: KA id is missing');
        });

        it('[4297]: Click On Goto KA button and verify ', async () => {
            await knowledgeArticlePreview.clickGoToArticleButton();
            expect(await viewKnowledgeArticlePo.isKnowledgeArticleIdDisplayed(kaDisplayId3)).toBeTruthy('FailureMsg50: KA id is missing on view case page');
        });

        it('[4297]: Verify vesion 2 with publish status ', async () => {
            await navigationPage.gotoSearch();
            await searchPo.searchRecord(summary5);
            expect(await searchPo.isModuleTitleDisplayed(summary5, 'Knowledge Articles (1)', KAModule)).toBeTruthy('FailureMsg47: KA module title is missing');
            await searchPo.clickOnLeftPannelRecord(kaDisplayId6, KAModule);
            expect(await knowledgeArticlePreview.getArticleVersion()).not.toBe(expectedVersion1, 'FailureMsg24: version 1 is displayed');
            expect(await knowledgeArticlePreview.getArticleVersion()).toBe(expectedVersion2, 'FailureMsg24: version 2 is missing on KA preview');
            expect(await knowledgeArticlePreview.getStatusOfKA()).toBe('Published', 'FailureMsg26: version 2 is missing on KA preview');
        });

        it('[4297]: Verify KA with non matching KA summary Also Verify case summary  who have not access of the case', async () => {
            await searchPo.searchRecord(summary1);
            expect(await searchPo.isModuleTitleDisplayed(summary1, 'Knowledge Articles (5)', KAModule)).toBeTruthy('FailureMsg47: KA module title is missing');
            expect(await searchPo.isRecordDisplayedOnLeftPannel(nonMatchingSummary, KAModule)).toBeFalsy(`FailureMsg51: ${nonMatchingSummary} KA non matching is missing`);
            expect(await searchPo.isRecordDisplayedOnLeftPannel(kaDisplayId4, KAModule)).toBeFalsy(`FailureMsg55: ${kaDisplayId4} KA id  is displayed`);
            expect(await searchPo.isRecordDisplayedOnLeftPannel(kaDisplayId5[0], KAModule)).toBeFalsy(`FailureMsg56: ${kaDisplayId5[0]} KA id  is displayed`);
            expect(await searchPo.isRecordDisplayedOnLeftPannel(kaDisplayId5[1], KAModule)).toBeFalsy(`FailureMsg57: ${kaDisplayId5[1]} KA id  is displayed`);
        });

        it('[4297]: Clear search and verify record displayed on left pannel ', async () => {
            await searchPo.searchRecord(summary1);
            expect(await searchPo.isModuleTitleDisplayed(summary1, 'Knowledge Articles (5)', KAModule)).toBeTruthy('FailureMsg59: KA module title is missing');
            await searchPo.clickClearSearchButton();
            expect(await searchPo.isClearSearchButtonDisplayed()).toBeFalsy('FailureMsg60: Search box is cleared and cross button gets hide');
            expect(await searchPo.isRecordDisplayedOnLeftPannel(kaDisplayId1[0], KAModule)).toBeTruthy(`FailureMsg61: ${kaDisplayId1[0]} KA id  is missing`);
        });

        it('[4297]: Verify search functionality with dummy text ', async () => {
            await searchPo.searchRecord(dummyText);
            expect(await searchPo.isRecordDisplayedOnLeftPannel(dummyText, KAModule)).toBeFalsy(`FailureMsg62: ${dummyText} dummyText  is displayed`);
            expect(await searchPo.isModuleTitleDisplayed(dummyText, 'Knowledge Articles (0)', KAModule)).toBeTruthy('FailureMsg63: KA module title is missing');
            expect(await searchPo.isBlankRecordValidationDisplayedOnLeftPanel(KAModule)).toBeTruthy(`FailureMsg64: No result found validation is missing`);
        });

        it('[4297]: Verify search KA with assignee user ', async () => {
            await navigationPage.signOut();
            await loginPage.login('qdu');
            await navigationPage.gotoSearch();

            await searchPo.searchRecord(summary1);
            expect(await searchPo.isModuleTitleDisplayed(summary1, 'Knowledge Articles (5)', KAModule)).toBeTruthy('FailureMsg42: Task module title is missing');
            expect(await searchPo.isRecordDisplayedOnLeftPannel(kaDisplayId1[0], KAModule)).toBeTruthy(`FailureMsg6: ${kaDisplayId1[0]} KA id  is missing`);
            expect(await searchPo.isRecordDisplayedOnLeftPannel(kaDisplayId1[1], KAModule)).toBeTruthy(`FailureMsg6: ${kaDisplayId1[1]} KA id  is missing`);
            expect(await searchPo.isRecordDisplayedOnLeftPannel(kaDisplayId1[2], KAModule)).toBeTruthy(`FailureMsg7: ${kaDisplayId1[2]} KA id  is missing`);
            expect(await searchPo.isRecordDisplayedOnLeftPannel(kaDisplayId1[3], KAModule)).toBeTruthy(`FailureMsg8: ${kaDisplayId1[3]} KA id  is missing`);
            expect(await searchPo.isRecordDisplayedOnLeftPannel(kaDisplayId1[4], KAModule)).toBeTruthy(`FailureMsg9: ${kaDisplayId1[4]} KA id  is missing`);

            await searchPo.searchRecord(nonMatchingSummary);
            expect(await searchPo.isModuleTitleDisplayed(nonMatchingSummary, 'Knowledge Articles (3)', KAModule)).toBeTruthy('FailureMsg42: KA module title is missing');
            expect(await searchPo.isRecordDisplayedOnLeftPannel(kaDisplayId4, KAModule)).toBeTruthy(`FailureMsg55: ${kaDisplayId4} KA id  is displayed`);
            expect(await searchPo.isRecordDisplayedOnLeftPannel(kaDisplayId5[0], KAModule)).toBeTruthy(`FailureMsg49: ${kaDisplayId5[0]} KA id  is missing`);
            expect(await searchPo.isRecordDisplayedOnLeftPannel(kaDisplayId5[1], KAModule)).toBeTruthy(`FailureMsg50: ${kaDisplayId5[1]} KA id  is missing`);
        });

        it('[4297]: Verify saerch KA with other group user', async () => {
            await navigationPage.signOut();
            await loginPage.login('qheroux');
            await navigationPage.gotoSearch();
            await searchPo.searchRecord(summary1);
            expect(await searchPo.isModuleTitleDisplayed(summary1, 'Knowledge Articles (5)', KAModule)).toBeTruthy('FailureMsg1: KA module title is missing');
            expect(await searchPo.isRecordDisplayedOnLeftPannel(kaDisplayId1[0], KAModule)).toBeTruthy(`FailureMsg2: ${kaDisplayId1[0]} KA id  is displayed`);

            await searchPo.searchRecord(keywordStr);
            expect(await searchPo.isModuleTitleDisplayed(keywordStr, 'Knowledge Articles (5)', KAModule)).toBeTruthy('FailureMsg3: KA module title is missing');
            expect(await searchPo.isRecordDisplayedOnLeftPannel(kaDisplayId2[0], KAModule)).toBeTruthy(`FailureMsg4: ${kaDisplayId2} KA id  is displayed`);

            await searchPo.searchRecord('globalsearch2.json');
            expect(await searchPo.isModuleTitleDisplayed('globalsearch2.json', 'Knowledge Articles (1)', KAModule)).toBeTruthy('FailureMsg5: KA module title is missing');
            expect(await searchPo.isRecordDisplayedOnLeftPannel(kaDisplayId3, KAModule)).toBeTruthy(`FailureMsg6: ${kaDisplayId3} KA id  is displayed`);

            await searchPo.searchRecord(nonMatchingSummary);
            expect(await searchPo.isModuleTitleDisplayed(nonMatchingSummary, 'Knowledge Articles (3)', KAModule)).toBeTruthy('FailureMsg7: KA module title is missing');
            expect(await searchPo.isRecordDisplayedOnLeftPannel(kaDisplayId4, KAModule)).toBeTruthy(`FailureMsg8: ${kaDisplayId4} KA id  is displayed`);
        });

        it('[4297]: Verify saerch KA with other company user', async () => {
            await navigationPage.signOut();
            await loginPage.login('werusha');

            await navigationPage.gotoSearch();
            await searchPo.searchRecord(summary1);
            expect(await searchPo.isModuleTitleDisplayed(summary1, 'Knowledge Articles (0)', KAModule)).toBeTruthy('FailureMsg1: KA module title is missing');
            expect(await searchPo.isBlankRecordValidationDisplayedOnLeftPanel(KAModule)).toBeTruthy(`FailureMsg2: No result found validation is missing`);
            expect(await searchPo.isRecordDisplayedOnLeftPannel(kaDisplayId1[0], KAModule)).toBeFalsy(`FailureMsg3: ${kaDisplayId1[0]} KA id  is displayed`);

            await searchPo.searchRecord(keywordStr);
            expect(await searchPo.isModuleTitleDisplayed(keywordStr, 'Knowledge Articles (0)', KAModule)).toBeTruthy('FailureMsg4: KA module title is missing');
            expect(await searchPo.isBlankRecordValidationDisplayedOnLeftPanel(KAModule)).toBeTruthy(`FailureMsg5: No result found validation is missing`);
            expect(await searchPo.isRecordDisplayedOnLeftPannel(kaDisplayId2[0], KAModule)).toBeFalsy(`FailureMsg6: ${kaDisplayId2} KA id  is displayed`);

            await searchPo.searchRecord('globalsearch2.json');
            expect(await searchPo.isModuleTitleDisplayed('globalsearch2.json', 'Knowledge Articles (0)', KAModule)).toBeTruthy('FailureMsg7: KA module title is missing');
            expect(await searchPo.isBlankRecordValidationDisplayedOnLeftPanel(KAModule)).toBeTruthy(`FailureMsg8: No result found validation is missing`);
            expect(await searchPo.isRecordDisplayedOnLeftPannel(kaDisplayId3, KAModule)).toBeFalsy(`FailureMsg9: ${kaDisplayId3} KA id  is displayed`);

            await searchPo.searchRecord(nonMatchingSummary);
            expect(await searchPo.isModuleTitleDisplayed(nonMatchingSummary, 'Knowledge Articles (0)', KAModule)).toBeTruthy('FailureMsg9: KA module title is missing');
            expect(await searchPo.isBlankRecordValidationDisplayedOnLeftPanel(KAModule)).toBeTruthy(`FailureMsg10: No result found validation missing`);
            expect(await searchPo.isRecordDisplayedOnLeftPannel(kaDisplayId4, KAModule)).toBeFalsy(`FailureMsg11: ${kaDisplayId4} KA id  is displayed`);
        });

        it('[4297]: Verify article search with different LOB case manager', async () => {
            await navigationPage.signOut();
            await loginPage.login('frieda');
            await navigationPage.gotoSearch();

            await searchPo.searchRecord(summary1);
            expect(await searchPo.isModuleTitleDisplayed(summary1, 'Knowledge Articles (5)', KAModule)).toBeTruthy('FailureMsg42: Task module title is missing');
            expect(await searchPo.isRecordDisplayedOnLeftPannel(kaDisplayId1[0], KAModule)).toBeTruthy(`FailureMsg6: ${kaDisplayId1[0]} KA id  is missing`);
            expect(await searchPo.isRecordDisplayedOnLeftPannel(kaDisplayId1[1], KAModule)).toBeTruthy(`FailureMsg6: ${kaDisplayId1[1]} KA id  is missing`);
            expect(await searchPo.isRecordDisplayedOnLeftPannel(kaDisplayId1[2], KAModule)).toBeTruthy(`FailureMsg7: ${kaDisplayId1[2]} KA id  is missing`);
            expect(await searchPo.isRecordDisplayedOnLeftPannel(kaDisplayId1[3], KAModule)).toBeTruthy(`FailureMsg8: ${kaDisplayId1[3]} KA id  is missing`);
            expect(await searchPo.isRecordDisplayedOnLeftPannel(kaDisplayId1[4], KAModule)).toBeTruthy(`FailureMsg9: ${kaDisplayId1[4]} KA id  is missing`);
        });

        it('[4297]: Verify article search with different LOB case BA', async () => {
            await navigationPage.signOut();
            await loginPage.login('fritz');
            await navigationPage.gotoSearch();

            await searchPo.searchRecord(summary1);
            expect(await searchPo.isModuleTitleDisplayed(summary1, 'Knowledge Articles (5)', KAModule)).toBeTruthy('FailureMsg42: Task module title is missing');
            expect(await searchPo.isRecordDisplayedOnLeftPannel(kaDisplayId1[0], KAModule)).toBeTruthy(`FailureMsg6: ${kaDisplayId1[0]} KA id  is missing`);
            expect(await searchPo.isRecordDisplayedOnLeftPannel(kaDisplayId1[1], KAModule)).toBeTruthy(`FailureMsg6: ${kaDisplayId1[1]} KA id  is missing`);
            expect(await searchPo.isRecordDisplayedOnLeftPannel(kaDisplayId1[2], KAModule)).toBeTruthy(`FailureMsg7: ${kaDisplayId1[2]} KA id  is missing`);
            expect(await searchPo.isRecordDisplayedOnLeftPannel(kaDisplayId1[3], KAModule)).toBeTruthy(`FailureMsg8: ${kaDisplayId1[3]} KA id  is missing`);
            expect(await searchPo.isRecordDisplayedOnLeftPannel(kaDisplayId1[4], KAModule)).toBeTruthy(`FailureMsg9: ${kaDisplayId1[4]} KA id  is missing`);
        });
    });
});


