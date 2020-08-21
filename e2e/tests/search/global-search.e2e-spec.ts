import searchPo from '../../pageobject/search/global-search.po';
import { browser } from "protractor";
import apiHelper from "../../api/api.helper";
import loginPage from "../../pageobject/common/login.po";
import navigationPage from "../../pageobject/common/navigation.po";
import { BWF_BASE_URL } from '../../utils/constants';
import utilityCommon from '../../utils/utility.common';
import viewCasetemplatePo from '../../pageobject/settings/case-management/view-casetemplate.po';
import casePreviewPo from '../../pageobject/case/case-preview.po';
import taskPreviewPo from '../../pageobject/task/task-preview.po';
import viewTaskPo from '../../pageobject/task/view-task.po';
import knowledgeArticlePreview from '../../pageobject/knowledge/preview-knowledge.po'
import viewKnowledgeArticlePo from '../../pageobject/knowledge/view-knowledge-article.po';
import editKnowledgePo from '../../pageobject/knowledge/edit-knowledge.po';
import caseTemplatePreviewPo from '../../pageobject/settings/case-management/preview-case-template.po';
import previewDocumentLibraryPo from '../../pageobject/settings/document-management/doc-lib-preview.po';
import previewTaskTemplatePo from '../../pageobject/settings/task-management/preview-task-template.po';

export interface IIDs {
    id: string;
    displayId: string;
}
describe('Global Search', () => {
    let caseModule = "Case";
    let taskModule = "Task";
    let KAModule = "Knowledge Article";
    let caseTemplateModule = "Case Templates";
    let taskTemplateModule = "Task Templates";
    let documentModule = "Documents";
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

        let numMonth: number = objDate.getUTCMonth() + 1;
        let monthArr: string[] = ["Null", "Jan", "Feb", "Mar", "Apr", "May", "June", "July", "August", "September", "October", "November", "December"];
        month = monthArr[numMonth];

        let numDate: number = objDate.getUTCDate();
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
            "Business Unit": "Canada Support",
            "Support Group": "CA Support 1",
            "Assignee": "qdu"
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

    async function createCaseTemplate(templateName: string, templateSummary: string, templateStatus: string, company: string, description?: string): Promise<string> {
        let caseTemplateDisplayId
        let caseTemplateData = {
            "templateName": "caseTemplateName",
            "templateSummary": "caseTemplateSummary",
            "categoryTier1": 'Applications',
            "categoryTier2": 'Social',
            "categoryTier3": 'Chatter',
            "casePriority": "Low",
            "templateStatus": "",
            "company": "",
            "description": "",
            "businessUnit": "Canada Support",
            "supportGroup": "CA Support 1",
            "assignee": "qdu",
            "ownerBU": "United States Support",
            "ownerGroup": "US Support 1"
        }

        if (description) {
            caseTemplateData.description = description;
        }
        caseTemplateData.templateName = templateName;
        caseTemplateData.templateSummary = templateSummary;
        caseTemplateData.templateStatus = templateStatus;
        caseTemplateData.company = company;
        let caseTemplateResponse = await apiHelper.createCaseTemplate(caseTemplateData);
        return caseTemplateDisplayId = caseTemplateResponse.displayId;

    }

    async function createTaskTemplate(templateName: string, templateStatus: string, taskCompany: string, description?: string): Promise<string> {
        let taskDetails;
        let taskDisplayId;
        let manualTaskTemplateData = {
            "templateName": "manualTemplateName",
            "templateSummary": "TemplateSummary",
            "templateStatus": "",
            "taskCompany": "",
            "description": "",
            "businessUnit": "Canada Support",
            "supportGroup": "CA Support 1",
            "assignee": "qdu",
            "ownerCompany": "Petramco",
            "ownerBusinessUnit": "United States Support",
            "ownerGroup": "US Support 3"
        }

        if (description) {
            manualTaskTemplateData.description = description;
        }
        manualTaskTemplateData.templateName = templateName;
        manualTaskTemplateData.templateStatus = templateStatus;
        manualTaskTemplateData.taskCompany = taskCompany;
        taskDetails = await apiHelper.createManualTaskTemplate(manualTaskTemplateData);
        return taskDisplayId = taskDetails.displayId;
    }

    async function createPublishDocumentLibrary(docLibTitle: string, attachment: string, keywordTag?: string): Promise<string> {
        let publishDocData = {
            docLibTitle: docLibTitle,
            company: 'Petramco',
            businessUnit: 'Canada Support',
            ownerGroup: 'CA Support 1',
            keywordTag: ""
        }

        if (keywordTag) {
            publishDocData.keywordTag = keywordTag;
        }
        let docLib = await apiHelper.createDocumentLibrary(publishDocData, attachment);
        await apiHelper.publishDocumentLibrary(docLib);
        return docLib.displayId;

    }

    async function createDraftDocumentLibrary(docLibTitle: string, attachment: string): Promise<string> {
        let publishDocData = {
            docLibTitle: docLibTitle,
            company: 'Petramco',
            businessUnit: 'Canada Support',
            ownerGroup: 'CA Support 1'
        }
        let docLib = await apiHelper.createDocumentLibrary(publishDocData, attachment);
        return docLib.displayId;
    }

    //kgaikwad
    describe('[DRDMV-16065]: Global search UI and availability of fields - cross verify with mockup', async () => {
        let randomStr = [...Array(4)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        let caseSummary = 'caseSummaryDRDMV16065' + randomStr;
        let caseId;
        beforeAll(async () => {
            await apiHelper.apiLogin('qtao');
            let caseDetails1 = await createCase(caseSummary);
            caseId = caseDetails1.displayId;
            await navigationPage.gotoSearch();
        });

        it('[DRDMV-16065]: Verify UI Fields', async () => {
            expect(await searchPo.isCategoryDropDownSelectedValueDisplayed('All')).toBeTruthy('FailureMsg1: Default value from catergory drop down is missing');
            expect(await searchPo.isSearchBoxLabelDisplayed()).toBeTruthy('FailureMsg2: Search Box Label is missing');
            await searchPo.searchRecordOnLeftPannel(caseSummary, caseModule);
            expect(await searchPo.isClearSearchButtonDisplayed()).toBeTruthy('FailureMsg3: Clear Search button is missing');
            await searchPo.clickOnLeftPannelRecord(caseId, caseModule);
            expect(await searchPo.isRecentSearchesButtonDisplayed()).toBeTruthy('FailureMsg4: Recent Searches button is missing');
            expect(await searchPo.isAdvanceFilterButtonDisplayed()).toBeTruthy('FailureMsg5: Advance Filter button is missing');
            expect(await searchPo.isLeftGlobalSearchPannelDisplayed()).toBeTruthy('FailureMsg6: Left Global Search is missing');
        });
        it('[DRDMV-16065]: Verify Case Preview Field Label', async () => {
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
            expect(await casePreviewPo.isFieldLabelDisplayed('Assigned Group')).toBeTruthy('FailureMsg17: Assigned Group label is missing');
            expect(await casePreviewPo.isFieldLabelDisplayed('Assigned Company')).toBeTruthy('FailureMsg18: Assigned Company label is missing');
        });
        it('[DRDMV-16065]: Verify Case Preview Field Values', async () => {
            expect(await casePreviewPo.isCaseSummaryDisplayed(caseSummary)).toBeTruthy('FailureMsg19: Case Summary label is missing');
            expect(await casePreviewPo.isGlobalSearchCaseIdDisplayed(caseId)).toBeTruthy('FailureMsg20: Case id is missing');
            expect(await casePreviewPo.isCaseStatusDisplayed('Assigned')).toBeTruthy('FailureMsg21: Case Status is missing');
            expect(await casePreviewPo.isPriorityDisplayed('Medium')).toBeTruthy('FailureMsg22: Case Priority is missing');
            expect(await casePreviewPo.isRequesterNameDisplayed('Qadim Katawazi')).toBeTruthy('FailureMsg23: Reqester Name missing');
            expect(await casePreviewPo.isRequesterCompanyDisplayed('Petramco')).toBeTruthy('FailureMsg24: Reqester Company is missing');
            expect(await casePreviewPo.isRequesterPhoneDisplayed('+15123431923')).toBeTruthy('FailureMsg25: Reqester Phone is missing');
            expect(await casePreviewPo.isRequesterEmailIdDisplayed('qkatawazi@petramco.com')).toBeTruthy('FailureMsg26: Reqester Company is missing');
            expect(await casePreviewPo.isCaseSiteDisplayed('Austin')).toBeTruthy('FailureMsg27: Case Site Value is missing');
            expect(await casePreviewPo.isSourceDisplayed('External')).toBeTruthy('FailureMsg28: Source Value is missing');
            expect(await casePreviewPo.isRequesterSiteDisplayed('Austin\n' + '10431 Morado Circle\n' + 'Avalon Building 5, Austin, Texas, 78759, United States ')).toBeTruthy('FailureMsg29: Reqester Site Value is missing');
            expect(await casePreviewPo.isAssigneeDisplayed('Qiang Du')).toBeTruthy('FailureMsg30: Assignee Name is missing');
            expect(await casePreviewPo.isAssignedGroupDisplayed('CA Support 1')).toBeTruthy('FailureMsg31: Assigned Support Group Value is missing');
            expect(await casePreviewPo.isAssignedCompanyDisplayed('Petramco')).toBeTruthy('FailureMsg32: Assigned Company Value is missing');
        });
        it('[DRDMV-16065]: Verify Modules Catergoy drop down ', async () => {
            let category: string[] = ['All', 'Case', 'Task', 'People', 'Knowledge', 'Document', 'Case Template', 'Task Template'];
            expect(await searchPo.isCategoryAllDropDownValuesMatches(category)).toBeTruthy('FailureMsg33: Category options mismatch');
        });
    });

    //kgaikwad
    describe('[DRDMV-16102]: Global search with only Case Category', async () => {
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
            for (let a = 0; a < 5; a++) {
                let caseDetails = await createCase(summary);
                caseDisplayId1[a] = caseDetails.displayId;
            }

            // Create Case For Description
            for (let b = 0; b < 5; b++) {
                let caseDetails = await createCase(summary, description);
                caseDisplayId2[b] = caseDetails.displayId;
            }

            // Non maching case
            caseDisplayId3 = await createCase(nonMatchingSummary, nonMatchingDescription);

            // Non access to case
            await apiHelper.apiLogin('qdu');
            for (let c = 0; c < 2; c++) {
                let caseDetails3 = await createCase(summary, description);
                caseDisplayId4[c] = caseDetails3.displayId;
            }
        });

        it('[DRDMV-16102]: Verify Module Title & Pagination', async () => {
            await navigationPage.gotoSearch();
            expect(await searchPo.isCategoryDropDownSelectedValueDisplayed('All')).toBeTruthy('FailureMsg1: Default value from catergory drop down is missing');
            await searchPo.selectCategoryDropDownValue(caseModule);
            expect(await searchPo.isModuleTitleDisplayed(summary, 'Cases (10)', caseModule)).toBeTruthy('FailureMsg2: Case module title is missing');
            expect(await searchPo.isPaginationDisplayed(caseModule)).toBeTruthy('FailureMsg3: Pagination is missing for CaseModule');
            expect(await searchPo.isRecordDisplayedOnLeftPannel(caseDisplayId1[0], caseModule)).toBeTruthy(`FailureMsg4: ${caseDisplayId1[0]} case id  is missing`);
            expect(await searchPo.isRecordDisplayedOnLeftPannel(summary, caseModule)).toBeTruthy(`FailureMsg5: ${summary} case summary is missing`);
            expect(await searchPo.isRecordDisplayedOnLeftPannel(updatedDate, caseModule,)).toBeTruthy(`${updatedDate} updatedDate is missing`);
            expect(await searchPo.isRecordDisplayedOnLeftPannel(caseDisplayId1[1], caseModule)).toBeTruthy(`FailureMsg6: ${caseDisplayId1[1]} case id  is missing`);
            expect(await searchPo.isRecordDisplayedOnLeftPannel(caseDisplayId1[2], caseModule)).toBeTruthy(`FailureMsg7: ${caseDisplayId1[2]} case id  is missing`);
            expect(await searchPo.isRecordDisplayedOnLeftPannel(caseDisplayId1[3], caseModule)).toBeTruthy(`FailureMsg8: ${caseDisplayId1[3]} case id  is missing`);
            expect(await searchPo.isRecordDisplayedOnLeftPannel(caseDisplayId1[4], caseModule)).toBeTruthy(`FailureMsg9: ${caseDisplayId1[4]} case id  is missing`);

            await searchPo.clickOnPaginationPageNo(caseModule, "2");
            expect(await searchPo.isRecordDisplayedOnLeftPannel(caseDisplayId2[0], caseModule)).toBeTruthy(`FailureMsg10: ${caseDisplayId2[0]} case id  is missing`);
            expect(await searchPo.isRecordDisplayedOnLeftPannel(caseDisplayId2[1], caseModule)).toBeTruthy(`FailureMsg11: ${caseDisplayId2[1]} case id  is missing`);
            expect(await searchPo.isRecordDisplayedOnLeftPannel(caseDisplayId2[2], caseModule)).toBeTruthy(`FailureMsg12: ${caseDisplayId2[2]} case id  is missing`);
            expect(await searchPo.isRecordDisplayedOnLeftPannel(caseDisplayId2[3], caseModule)).toBeTruthy(`FailureMsg13: ${caseDisplayId2[3]} case id  is missing`);
            expect(await searchPo.isRecordDisplayedOnLeftPannel(caseDisplayId2[4], caseModule)).toBeTruthy(`FailureMsg14: ${caseDisplayId2[4]} case id  is missing`);

            await searchPo.clickOnPaginationPageNo(caseModule, "1");
            expect(await searchPo.isRecordDisplayedOnLeftPannel(caseDisplayId1[0], caseModule)).toBeTruthy(`FailureMsg15: ${caseDisplayId1[0]} case id  is missing`);
            expect(await searchPo.isRecordDisplayedOnLeftPannel(caseDisplayId1[1], caseModule)).toBeTruthy(`FailureMsg16: ${caseDisplayId1[1]} case id  is missing`);
            expect(await searchPo.isRecordDisplayedOnLeftPannel(caseDisplayId1[2], caseModule)).toBeTruthy(`FailureMsg17: ${caseDisplayId1[2]} case id  is missing`);
            expect(await searchPo.isRecordDisplayedOnLeftPannel(caseDisplayId1[3], caseModule)).toBeTruthy(`FailureMsg18: ${caseDisplayId1[3]} case id  is missing`);
            expect(await searchPo.isRecordDisplayedOnLeftPannel(caseDisplayId1[4], caseModule)).toBeTruthy(`FailureMsg19: ${caseDisplayId1[4]} case id  is missing`);

            await searchPo.clickOnLeftPannelRecord(caseDisplayId1[0], caseModule);
        });

        it('[DRDMV-16102]: Verify Case Preview Fields', async () => {
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
            expect(await casePreviewPo.isRequesterPhoneDisplayed('+15123431923')).toBeTruthy('FailureMsg38: Reqester Phone is missing');
            expect(await casePreviewPo.isRequesterEmailIdDisplayed('qkatawazi@petramco.com')).toBeTruthy('FailureMsg39: Reqester Company is missing');
            expect(await casePreviewPo.isCaseSiteDisplayed('Austin')).toBeTruthy('FailureMsg40: Case Site Value is missing');
            expect(await casePreviewPo.isSourceDisplayed('External')).toBeTruthy('FailureMsg41: Source Value is missing');
            expect(await casePreviewPo.isRequesterSiteDisplayed('Austin\n' + '10431 Morado Circle\n' + 'Avalon Building 5, Austin, Texas, 78759, United States ')).toBeTruthy('FailureMsg42: Reqester Site Value is missing');
            expect(await casePreviewPo.isAssigneeDisplayed('Qiang Du')).toBeTruthy('FailureMsg43: Assignee Name is missing');
            expect(await casePreviewPo.isAssignedGroupDisplayed('CA Support 1')).toBeTruthy('FailureMsg44: Assigned Support Group Value is missing');
            expect(await casePreviewPo.isAssignedCompanyDisplayed('Petramco')).toBeTruthy('FailureMsg45: Assigned Company Value is missing');
            expect(await casePreviewPo.isDescriptionDisplayed(description)).toBeFalsy('FailureMsg46: case Description displayed');
            // Search Case with case description
            await searchPo.searchRecord(description);
            expect(await searchPo.isModuleTitleDisplayed(description, 'Cases (5)', caseModule)).toBeTruthy('FailureMsg47: Case module title is missing');
            await searchPo.clickOnLeftPannelRecord(caseDisplayId2[0], caseModule);
            expect(await casePreviewPo.isGlobalSearchCaseIdDisplayed(caseDisplayId2[0])).toBeTruthy('FailureMsg48: Case id is missing');
            expect(await casePreviewPo.isDescriptionDisplayed(description)).toBeTruthy('FailureMsg49: Case Description is missing');
        });

        it('[DRDMV-16102]: Click On Goto Case button and verify ', async () => {
            await casePreviewPo.clickGoToCaseButton();
            expect(await viewCasetemplatePo.getCaseTemplateId()).toBe(caseDisplayId2[0], 'FailureMsg50: Case id is missing on view case page');
        });

        it('[DRDMV-16065]: Verify Case with non matching Case summary and description Also Verify case summary and description who have not access of the case', async () => {
            await navigationPage.gotoSearch();
            await searchPo.searchRecord(summary);
            expect(await searchPo.isModuleTitleDisplayed(summary, 'Cases (10)', caseModule)).toBeTruthy('FailureMsg47: Case module title is missing');
            expect(await searchPo.isRecordDisplayedOnLeftPannel(nonMatchingSummary, caseModule)).toBeFalsy(`FailureMsg51: ${nonMatchingSummary} case Summary is missing`);
            expect(await searchPo.isRecordDisplayedOnLeftPannel(caseDisplayId3, caseModule)).toBeFalsy(`FailureMsg55: ${caseDisplayId3} case id  is displayed`);
            expect(await searchPo.isRecordDisplayedOnLeftPannel(caseDisplayId4[0], caseModule)).toBeFalsy(`FailureMsg55: ${caseDisplayId4[0]} case id  is displayed`);
            expect(await searchPo.isRecordDisplayedOnLeftPannel(caseDisplayId4[1], caseModule)).toBeFalsy(`FailureMsg56: ${caseDisplayId4[1]} case id  is displayed`);

            await searchPo.clickOnPaginationPageNo(caseModule, "2");
            expect(await searchPo.isRecordDisplayedOnLeftPannel(nonMatchingSummary, caseModule)).toBeFalsy(`FailureMsg53: ${nonMatchingSummary} case Summary is missing`);
            expect(await searchPo.isRecordDisplayedOnLeftPannel(caseDisplayId3, caseModule)).toBeFalsy(`FailureMsg55: ${caseDisplayId3} case id  is displayed`);
            expect(await searchPo.isRecordDisplayedOnLeftPannel(caseDisplayId4[0], caseModule)).toBeFalsy(`FailureMsg57: ${caseDisplayId4[0]} case id  is displayed`);
            expect(await searchPo.isRecordDisplayedOnLeftPannel(caseDisplayId4[1], caseModule)).toBeFalsy(`FailureMsg58: ${caseDisplayId4[1]} case id  is displayed`);

            await searchPo.searchRecord(description);
            expect(await searchPo.isModuleTitleDisplayed(description, 'Cases (5)', caseModule)).toBeTruthy('FailureMsg59: Case module title is missing');
            expect(await searchPo.isRecordDisplayedOnLeftPannel(caseDisplayId3, caseModule)).toBeFalsy(`FailureMsg60: ${caseDisplayId3} case id  is displayed`);
        });

        it('[DRDMV-16102]: Clear search and verify record displayed on left pannel ', async () => {
            await searchPo.searchRecord(summary);
            expect(await searchPo.isModuleTitleDisplayed(summary, 'Cases (10)', caseModule)).toBeTruthy('FailureMsg61: Case module title is missing');
            await searchPo.clickClearSearchButton();
            expect(await searchPo.isClearSearchButtonDisplayed()).toBeFalsy('FailureMsg62: Search box is cleared and cross button gets hide');
            expect(await searchPo.isRecordDisplayedOnLeftPannel(caseDisplayId1[0], caseModule)).toBeTruthy(`FailureMsg63: ${caseDisplayId4[0]} case id  is missing`);
        });

        it('[DRDMV-16102]: Verify search functionality with dummy text ', async () => {
            await searchPo.searchRecord(dummyDescription);
            expect(await searchPo.isRecordDisplayedOnLeftPannel(dummyDescription, caseModule)).toBeFalsy(`FailureMsg64: ${dummyDescription} dummyText  is displayed`);
            expect(await searchPo.isModuleTitleDisplayed(dummyDescription, 'Cases (0)', caseModule)).toBeTruthy('FailureMsg65: Case module title is missing');
            expect(await searchPo.isBlankRecordValidationDisplayedOnLeftPanel(caseModule)).toBeTruthy(`FailureMsg66: No result found validation is missing`);
        });

        it('[DRDMV-16102]: Verify search case with Requester', async () => {
            await navigationPage.signOut();
            await loginPage.login('qkatawazi')
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

        it('[DRDMV-16102]: Verify search case with assignee user', async () => {
            await navigationPage.signOut();
            await loginPage.login('qdu');
            await navigationPage.gotoSearch();
            await searchPo.searchRecord(summary);

            expect(await searchPo.isModuleTitleDisplayed(summary, 'Cases (12)', caseModule)).toBeTruthy('FailureMsg78: Case module title is missing');
            expect(await searchPo.isRecordDisplayedOnLeftPannel(summary, caseModule)).toBeTruthy(`FailureMsg79: ${summary} case Summary is missing`);

            expect(await searchPo.isRecordDisplayedOnLeftPannel(caseDisplayId1[0], caseModule)).toBeTruthy(`FailureMsg80: ${caseDisplayId1[0]} case id  is missing`);
            expect(await searchPo.isRecordDisplayedOnLeftPannel(caseDisplayId1[1], caseModule)).toBeTruthy(`FailureMsg81: ${caseDisplayId1[1]} case id  is missing`);
            expect(await searchPo.isRecordDisplayedOnLeftPannel(caseDisplayId1[2], caseModule)).toBeTruthy(`FailureMsg82: ${caseDisplayId1[2]} case id  is missing`);
            expect(await searchPo.isRecordDisplayedOnLeftPannel(caseDisplayId1[3], caseModule)).toBeTruthy(`FailureMsg83: ${caseDisplayId1[3]} case id  is missing`);
            expect(await searchPo.isRecordDisplayedOnLeftPannel(caseDisplayId1[4], caseModule)).toBeTruthy(`FailureMsg84: ${caseDisplayId1[4]} case id  is missing`);

            await searchPo.clickOnPaginationPageNo(caseModule, "2");
            expect(await searchPo.isRecordDisplayedOnLeftPannel(caseDisplayId2[0], caseModule)).toBeTruthy(`FailureMsg85: ${caseDisplayId2[0]} case id  is missing`);
            expect(await searchPo.isRecordDisplayedOnLeftPannel(caseDisplayId2[1], caseModule)).toBeTruthy(`FailureMsg86: ${caseDisplayId2[1]} case id  is missing`);
            expect(await searchPo.isRecordDisplayedOnLeftPannel(caseDisplayId2[2], caseModule)).toBeTruthy(`FailureMsg87: ${caseDisplayId2[2]} case id  is missing`);
            expect(await searchPo.isRecordDisplayedOnLeftPannel(caseDisplayId2[3], caseModule)).toBeTruthy(`FailureMsg88: ${caseDisplayId2[3]} case id  is missing`);
            expect(await searchPo.isRecordDisplayedOnLeftPannel(caseDisplayId2[4], caseModule)).toBeTruthy(`FailureMsg89: ${caseDisplayId2[4]} case id  is missing`);

            await searchPo.clickOnPaginationPageNo(caseModule, "3");
            expect(await searchPo.isRecordDisplayedOnLeftPannel(caseDisplayId4[0], caseModule)).toBeTruthy(`FailureMsg90: ${caseDisplayId4[0]} case id  is displayed`);
            expect(await searchPo.isRecordDisplayedOnLeftPannel(caseDisplayId4[1], caseModule)).toBeTruthy(`FailureMsg91: ${caseDisplayId4[1]} case id  is displayed`);

            await searchPo.searchRecord(description);
            expect(await searchPo.isModuleTitleDisplayed(description, 'Cases (7)', caseModule)).toBeTruthy('FailureMsg92: Case module title is missing');

            expect(await searchPo.isRecordDisplayedOnLeftPannel(caseDisplayId2[0], caseModule)).toBeTruthy(`FailureMsg93: ${caseDisplayId2[0]} case id  is missing`);
            expect(await searchPo.isRecordDisplayedOnLeftPannel(caseDisplayId2[1], caseModule)).toBeTruthy(`FailureMsg94: ${caseDisplayId2[1]} case id  is missing`);
            expect(await searchPo.isRecordDisplayedOnLeftPannel(caseDisplayId2[2], caseModule)).toBeTruthy(`FailureMsg95: ${caseDisplayId2[2]} case id  is missing`);
            expect(await searchPo.isRecordDisplayedOnLeftPannel(caseDisplayId2[3], caseModule)).toBeTruthy(`FailureMsg96: ${caseDisplayId2[3]} case id  is missing`);
            expect(await searchPo.isRecordDisplayedOnLeftPannel(caseDisplayId2[4], caseModule)).toBeTruthy(`FailureMsg97: ${caseDisplayId2[4]} case id  is missing`);

            await searchPo.clickOnPaginationPageNo(caseModule, "2");
            expect(await searchPo.isRecordDisplayedOnLeftPannel(caseDisplayId4[0], caseModule)).toBeTruthy(`FailureMsg98: ${caseDisplayId4[0]} case id  is displayed`);
            expect(await searchPo.isRecordDisplayedOnLeftPannel(caseDisplayId4[1], caseModule)).toBeTruthy(`FailureMsg99: ${caseDisplayId4[0]} case id  is displayed`);
        });

        it('[DRDMV-16102]: Verify search case by other group user  ', async () => {
            await navigationPage.signOut();
            await loginPage.login('fritz')
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

        afterAll(async () => {
            await navigationPage.signOut();
            await loginPage.login('qtao')
        });
    });

    //kgaikwad
    describe('[DRDMV-16115]:Global search with only Task Category', async () => {
        let randomStr = [...Array(4)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        let summary = 'summaryDRDMV16115' + randomStr;
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
            for (let a = 0; a < 10; a++) {
                taskDisplayId[a] = await createTask(summary, caseGuid1, description);
            }

            // Non maching Task
            taskDisplayId2 = await createTask(nonMatchingSummary, caseGuid1, nonMatchingDescription);

            // Non access to Task
            await apiHelper.apiLogin('qdu');
            let caseDetails2 = await createCase(summary);
            let caseGuid2 = caseDetails2.id;

            for (let c = 0; c < 2; c++) {
                taskDisplayId3[c] = await createTask(summary, caseGuid2, description);
            }
        });

        it('[DRDMV-16115]: Verify Module Title & Pagination', async () => {
            await navigationPage.gotoSearch();
            expect(await searchPo.isCategoryDropDownSelectedValueDisplayed('All')).toBeTruthy('FailureMsg1: Default value from catergory drop down is missing');
            await searchPo.selectCategoryDropDownValue(taskModule);
            expect(await searchPo.isModuleTitleDisplayed(summary, 'Tasks (10)', taskModule)).toBeTruthy('FailureMsg2: Task module title is missing');
            expect(await searchPo.isPaginationDisplayed(taskModule)).toBeTruthy('FailureMsg3: Pagination is missing for TaskModule');
            expect(await searchPo.isRecordDisplayedOnLeftPannel(taskDisplayId[0], taskModule)).toBeTruthy(`FailureMsg4: ${taskDisplayId[0]} task id  is missing`);

            expect(await searchPo.isRecordDisplayedOnLeftPannel(summary, taskModule)).toBeTruthy(`FailureMsg5: ${summary} Task summary is missing`);
            expect(await searchPo.isRecordDisplayedOnLeftPannel(updatedDate, taskModule,)).toBeTruthy(`${updatedDate} updatedDate is missing`);
            expect(await searchPo.isRecordDisplayedOnLeftPannel(taskDisplayId[1], taskModule)).toBeTruthy(`FailureMsg6: ${taskDisplayId[1]} task id  is missing`);
            expect(await searchPo.isRecordDisplayedOnLeftPannel(taskDisplayId[2], taskModule)).toBeTruthy(`FailureMsg7: ${taskDisplayId[2]} task id  is missing`);
            expect(await searchPo.isRecordDisplayedOnLeftPannel(taskDisplayId[3], taskModule)).toBeTruthy(`FailureMsg8: ${taskDisplayId[3]} task id  is missing`);
            expect(await searchPo.isRecordDisplayedOnLeftPannel(taskDisplayId[4], taskModule)).toBeTruthy(`FailureMsg9: ${taskDisplayId[4]} task id  is missing`);

            await searchPo.clickOnPaginationPageNo(taskModule, "2");
            expect(await searchPo.isRecordDisplayedOnLeftPannel(taskDisplayId[5], taskModule)).toBeTruthy(`FailureMsg10: ${taskDisplayId[5]} task id  is missing`);
            expect(await searchPo.isRecordDisplayedOnLeftPannel(taskDisplayId[6], taskModule)).toBeTruthy(`FailureMsg11: ${taskDisplayId[6]} task id  is missing`);
            expect(await searchPo.isRecordDisplayedOnLeftPannel(taskDisplayId[7], taskModule)).toBeTruthy(`FailureMsg12: ${taskDisplayId[7]} task id  is missing`);
            expect(await searchPo.isRecordDisplayedOnLeftPannel(taskDisplayId[8], taskModule)).toBeTruthy(`FailureMsg13: ${taskDisplayId[8]} task id  is missing`);
            expect(await searchPo.isRecordDisplayedOnLeftPannel(taskDisplayId[9], taskModule)).toBeTruthy(`FailureMsg14: ${taskDisplayId[9]} task id  is missing`);

            await searchPo.clickOnPaginationPageNo(taskModule, "1");
            expect(await searchPo.isRecordDisplayedOnLeftPannel(taskDisplayId[0], taskModule)).toBeTruthy(`FailureMsg15: ${taskDisplayId[0]} task id  is missing`);
            expect(await searchPo.isRecordDisplayedOnLeftPannel(taskDisplayId[1], taskModule)).toBeTruthy(`FailureMsg16: ${taskDisplayId[1]} task id  is missing`);
            expect(await searchPo.isRecordDisplayedOnLeftPannel(taskDisplayId[2], taskModule)).toBeTruthy(`FailureMsg17: ${taskDisplayId[2]} task id  is missing`);
            expect(await searchPo.isRecordDisplayedOnLeftPannel(taskDisplayId[3], taskModule)).toBeTruthy(`FailureMsg18: ${taskDisplayId[3]} task id  is missing`);
            expect(await searchPo.isRecordDisplayedOnLeftPannel(taskDisplayId[4], taskModule)).toBeTruthy(`FailureMsg19: ${taskDisplayId[4]} task id  is missing`);

            await searchPo.clickOnLeftPannelRecord(taskDisplayId[0], taskModule);
        });

        it('[DRDMV-16115]: Verify Case Preview Field Label', async () => {
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

            // Search Task with description
            await searchPo.searchRecord(description);
            expect(await searchPo.isModuleTitleDisplayed(description, 'Tasks (10)', taskModule)).toBeTruthy('FailureMsg42: Task module title is missing');
            await searchPo.clickOnLeftPannelRecord(taskDisplayId[0], taskModule);
            expect(await taskPreviewPo.isTaskIdDisplayed(taskDisplayId[0])).toBeTruthy('FailureMsg43: Task id is missing');
            expect(await taskPreviewPo.isTaskDescriptionDisplayed(description)).toBeTruthy('FailureMsg44: Task Description is missing');
        });

        it('[DRDMV-16115]: Click On Goto Task button and verify ', async () => {
            await taskPreviewPo.clickGotoTaskButton();
            expect(await viewTaskPo.getTaskID()).toBe(taskDisplayId[0], 'FailureMsg45: Task id is missing on view task page');
        });

        it('[DRDMV-16115]: Verify Task with non matching Task summary and description Also Verify Task summary and description who have not access of the task', async () => {
            await navigationPage.gotoSearch();
            await searchPo.searchRecord(summary);
            expect(await searchPo.isModuleTitleDisplayed(summary, 'Tasks (10)', taskModule)).toBeTruthy('FailureMsg54: Task module title is missing');
            expect(await searchPo.isRecordDisplayedOnLeftPannel(nonMatchingSummary, taskModule)).toBeFalsy(`FailureMsg46: ${nonMatchingSummary} task Summary is missing`);
            expect(await searchPo.isRecordDisplayedOnLeftPannel(taskDisplayId3[0], taskModule)).toBeFalsy(`FailureMsg48: ${taskDisplayId3[0]} task id  is displayed`);
            expect(await searchPo.isRecordDisplayedOnLeftPannel(taskDisplayId3[1], taskModule)).toBeFalsy(`FailureMsg49: ${taskDisplayId3[1]} task id  is displayed`);

            await searchPo.clickOnPaginationPageNo(taskModule, "2");
            expect(await searchPo.isRecordDisplayedOnLeftPannel(nonMatchingSummary, taskModule)).toBeFalsy(`FailureMsg50: ${nonMatchingSummary} task Summary is missing`);
            expect(await searchPo.isRecordDisplayedOnLeftPannel(taskDisplayId3[0], taskModule)).toBeFalsy(`FailureMsg52: ${taskDisplayId3[0]} task id  is displayed`);
            expect(await searchPo.isRecordDisplayedOnLeftPannel(taskDisplayId3[1], taskModule)).toBeFalsy(`FailureMsg53: ${taskDisplayId3[1]} task id  is displayed`);

        });

        it('[DRDMV-16115]: Clear search and verify record displayed on left pannel ', async () => {
            await searchPo.searchRecord(summary);
            expect(await searchPo.isModuleTitleDisplayed(summary, 'Tasks (10)', taskModule)).toBeTruthy('FailureMsg54: Task module title is missing');
            await searchPo.clickClearSearchButton();
            expect(await searchPo.isClearSearchButtonDisplayed()).toBeFalsy('FailureMsg55: Search box is cleared and cross button gets hide');
            expect(await searchPo.isRecordDisplayedOnLeftPannel(taskDisplayId[0], taskModule)).toBeTruthy(`FailureMsg56: ${taskDisplayId3[0]} task id  is missing`);
        });

        it('[DRDMV-16115]: Verify search functionality with dummy text ', async () => {
            await searchPo.searchRecord(dummyDescription);
            expect(await searchPo.isRecordDisplayedOnLeftPannel(dummyDescription, taskModule)).toBeFalsy(`FailureMsg57: ${dummyDescription} dummyText  is displayed`);
            expect(await searchPo.isModuleTitleDisplayed(dummyDescription, 'Tasks (0)', taskModule)).toBeTruthy('FailureMsg58: Task module title is missing');
            expect(await searchPo.isBlankRecordValidationDisplayedOnLeftPanel(taskModule)).toBeTruthy(`FailureMsg59: No result found validation is missing`);
        });

        it('[DRDMV-16115]: Verify search Task with case reqester', async () => {
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

        it('[DRDMV-16115]: Verify search Task with assignee user ', async () => {
            await navigationPage.signOut();
            await loginPage.login('qcolumbcille')
            await navigationPage.gotoSearch();

            await searchPo.searchRecord(summary);
            expect(await searchPo.isModuleTitleDisplayed(summary, 'Tasks (12)', taskModule)).toBeTruthy('FailureMsg42: Task module title is missing');
            expect(await searchPo.isRecordDisplayedOnLeftPannel(taskDisplayId[0], taskModule)).toBeTruthy(`FailureMsg6: ${taskDisplayId[0]} task id  is missing`);
            expect(await searchPo.isRecordDisplayedOnLeftPannel(taskDisplayId[1], taskModule)).toBeTruthy(`FailureMsg6: ${taskDisplayId[1]} task id  is missing`);
            expect(await searchPo.isRecordDisplayedOnLeftPannel(taskDisplayId[2], taskModule)).toBeTruthy(`FailureMsg7: ${taskDisplayId[2]} task id  is missing`);
            expect(await searchPo.isRecordDisplayedOnLeftPannel(taskDisplayId[3], taskModule)).toBeTruthy(`FailureMsg8: ${taskDisplayId[3]} task id  is missing`);
            expect(await searchPo.isRecordDisplayedOnLeftPannel(taskDisplayId[4], taskModule)).toBeTruthy(`FailureMsg9: ${taskDisplayId[4]} task id  is missing`);

            await searchPo.clickOnPaginationPageNo(taskModule, "2");
            expect(await searchPo.isRecordDisplayedOnLeftPannel(taskDisplayId[5], taskModule)).toBeTruthy(`FailureMsg10: ${taskDisplayId[5]} task id  is missing`);
            expect(await searchPo.isRecordDisplayedOnLeftPannel(taskDisplayId[6], taskModule)).toBeTruthy(`FailureMsg11: ${taskDisplayId[6]} task id  is missing`);
            expect(await searchPo.isRecordDisplayedOnLeftPannel(taskDisplayId[7], taskModule)).toBeTruthy(`FailureMsg12: ${taskDisplayId[7]} task id  is missing`);
            expect(await searchPo.isRecordDisplayedOnLeftPannel(taskDisplayId[8], taskModule)).toBeTruthy(`FailureMsg13: ${taskDisplayId[8]} task id  is missing`);
            expect(await searchPo.isRecordDisplayedOnLeftPannel(taskDisplayId[9], taskModule)).toBeTruthy(`FailureMsg14: ${taskDisplayId[9]} task id  is missing`);

            await searchPo.clickOnPaginationPageNo(taskModule, "3");
            expect(await searchPo.isRecordDisplayedOnLeftPannel(taskDisplayId3[0], taskModule)).toBeTruthy(`FailureMsg10: ${taskDisplayId3[0]} task id  is missing`);
            expect(await searchPo.isRecordDisplayedOnLeftPannel(taskDisplayId3[1], taskModule)).toBeTruthy(`FailureMsg10: ${taskDisplayId3[2]} task id  is missing`);

            await searchPo.searchRecord(nonMatchingSummary);
            expect(await searchPo.isModuleTitleDisplayed(summary, 'Tasks (1)', taskModule)).toBeTruthy('FailureMsg42: Task module title is missing');
            expect(await searchPo.isRecordDisplayedOnLeftPannel(taskDisplayId2, taskModule)).toBeTruthy(`FailureMsg48: ${taskDisplayId2} task id  is missing`);
        });

        it('[DRDMV-16115]: Verify saerch task with other group user', async () => {
            await navigationPage.signOut();
            await loginPage.login('fritz')
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

        afterAll(async () => {
            await navigationPage.signOut();
            await loginPage.login('qtao');
        });
    });

    //kgaikwad
    describe('[DRDMV-16114]: Global search with only Knowledge Articles Category', async () => {
        let randomStr = [...Array(4)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        let attachmentFilePath = 'e2e/data/ui/attachment/globalsearch1.pdf';
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
                kaDisplayId1[a] = await createKnowledgeArticleWithPublish(summary1);
            }

            // Create KA with Keyword
            for (let b = 0; b < 5; b++) {
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
                kaDisplayId5[d] = await createKnowledgeArticleWithPublish(nonMatchingSummary);
            }
        });

        it('[DRDMV-16114]: Create KA version 2 also verify version 1 with publish status and also verify KA as Draft status', async () => {
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
            expect(await viewKnowledgeArticlePo.getStatusValue()).toBe('Published', 'FailureMsg25: On view knowledge article status value is missing');

            // Verify with draft status
            await navigationPage.gotoSearch();
            await searchPo.searchRecord(summary4);
            expect(await searchPo.isModuleTitleDisplayed(summary4, 'Knowledge Articles (0)', KAModule)).toBeTruthy('FailureMsg58: KA module title is missing');
            expect(await searchPo.isBlankRecordValidationDisplayedOnLeftPanel(KAModule)).toBeTruthy(`FailureMsg59: No result found validation is missing`);
        });

        it('[DRDMV-16114]: Verify Module Title & Pagination', async () => {
            await navigationPage.gotoSearch();
            expect(await searchPo.isCategoryDropDownSelectedValueDisplayed('All')).toBeTruthy('FailureMsg1: Default value from catergory drop down is missing');
            await searchPo.selectCategoryDropDownValue('Knowledge');
            expect(await searchPo.isModuleTitleDisplayed(summary1, 'Knowledge Articles (5)', KAModule)).toBeTruthy('FailureMsg2: KA module title is missing');
            expect(await searchPo.isRecordDisplayedOnLeftPannel(kaDisplayId1[0], KAModule)).toBeTruthy(`FailureMsg4: ${kaDisplayId1[0]} Knowledge Article id  is missing`);
            expect(await searchPo.isRecordDisplayedOnLeftPannel(summary1, KAModule)).toBeTruthy(`FailureMsg5: ${summary1} Knowledge Article summary is missing`);
            expect(await searchPo.isRecordDisplayedOnLeftPannel(updatedDate, KAModule,)).toBeTruthy(`${updatedDate} updatedDate is missing`);
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

        it('[DRDMV-16114]: Verify KA Preview Fields', async () => {
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
            await searchPo.searchRecord('globalsearch1.pdf');
            expect(await searchPo.isModuleTitleDisplayed('globalsearch1.pdf', 'Knowledge Articles (1)', KAModule)).toBeTruthy('FailureMsg47: Knowledge Articles module title is missing');
            await searchPo.clickOnLeftPannelRecord(kaDisplayId3, KAModule);
            expect(await knowledgeArticlePreview.isKnowledgeArticleID()).toBeTruthy('FailureMsg48: KA id is missing');
        });

        it('[DRDMV-16114]: Click On Goto KA button and verify ', async () => {
            await knowledgeArticlePreview.clickGoToArticleButton();
            expect(await viewKnowledgeArticlePo.isKnowledgeArticleIdDisplayed(kaDisplayId3)).toBeTruthy('FailureMsg50: KA id is missing on view case page');
        });

        it('[DRDMV-16114]: Verify vesion 2 with publish status ', async () => {
            await navigationPage.gotoSearch();
            await searchPo.searchRecord(summary5);
            expect(await searchPo.isModuleTitleDisplayed(summary5, 'Knowledge Articles (1)', KAModule)).toBeTruthy('FailureMsg47: KA module title is missing');
            await searchPo.clickOnLeftPannelRecord(kaDisplayId6, KAModule);

            expect(await knowledgeArticlePreview.getArticleVersion()).not.toBe(expectedVersion1, 'FailureMsg24: version 1 is displayed');
            expect(await knowledgeArticlePreview.getArticleVersion()).toBe(expectedVersion2, 'FailureMsg24: version 2 is missing on KA preview');
            expect(await knowledgeArticlePreview.getStatusOfKA()).toBe('Published', 'FailureMsg26: version 2 is missing on KA preview');
        });

        it('[DRDMV-16114]: Verify KA with non matching KA summary Also Verify case summary  who have not access of the case', async () => {
            await searchPo.searchRecord(summary1);
            expect(await searchPo.isModuleTitleDisplayed(summary1, 'Knowledge Articles (5)', KAModule)).toBeTruthy('FailureMsg47: KA module title is missing');
            expect(await searchPo.isRecordDisplayedOnLeftPannel(nonMatchingSummary, KAModule)).toBeFalsy(`FailureMsg51: ${nonMatchingSummary} KA non matching is missing`);
            expect(await searchPo.isRecordDisplayedOnLeftPannel(kaDisplayId4, KAModule)).toBeFalsy(`FailureMsg55: ${kaDisplayId4} KA id  is displayed`);
            expect(await searchPo.isRecordDisplayedOnLeftPannel(kaDisplayId5[0], KAModule)).toBeFalsy(`FailureMsg56: ${kaDisplayId5[0]} KA id  is displayed`);
            expect(await searchPo.isRecordDisplayedOnLeftPannel(kaDisplayId5[1], KAModule)).toBeFalsy(`FailureMsg57: ${kaDisplayId5[1]} KA id  is displayed`);
        });

        it('[DRDMV-16114]: Clear search and verify record displayed on left pannel ', async () => {
            await searchPo.searchRecord(summary1);
            expect(await searchPo.isModuleTitleDisplayed(summary1, 'Knowledge Articles (5)', KAModule)).toBeTruthy('FailureMsg59: KA module title is missing');
            await searchPo.clickClearSearchButton();
            expect(await searchPo.isClearSearchButtonDisplayed()).toBeFalsy('FailureMsg60: Search box is cleared and cross button gets hide');
            expect(await searchPo.isRecordDisplayedOnLeftPannel(kaDisplayId1[0], KAModule)).toBeTruthy(`FailureMsg61: ${kaDisplayId1[0]} KA id  is missing`);
        });

        it('[DRDMV-16114]: Verify search functionality with dummy text ', async () => {
            await searchPo.searchRecord(dummyText);
            expect(await searchPo.isRecordDisplayedOnLeftPannel(dummyText, KAModule)).toBeFalsy(`FailureMsg62: ${dummyText} dummyText  is displayed`);
            expect(await searchPo.isModuleTitleDisplayed(dummyText, 'Knowledge Articles (0)', KAModule)).toBeTruthy('FailureMsg63: KA module title is missing');
            expect(await searchPo.isBlankRecordValidationDisplayedOnLeftPanel(KAModule)).toBeTruthy(`FailureMsg64: No result found validation is missing`);
        });

        it('[DRDMV-16114]: Verify search KA with assignee user ', async () => {
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

        it('[DRDMV-16114]: Verify saerch KA with other group user', async () => {
            await navigationPage.signOut();
            await loginPage.login('fritz')
            await navigationPage.gotoSearch();
            await searchPo.searchRecord(summary1);
            expect(await searchPo.isModuleTitleDisplayed(summary1, 'Knowledge Articles (5)', KAModule)).toBeTruthy('FailureMsg58: KA module title is missing');
            expect(await searchPo.isRecordDisplayedOnLeftPannel(kaDisplayId1[0], KAModule)).toBeTruthy(`FailureMsg48: ${kaDisplayId1[0]} KA id  is displayed`);

            await searchPo.searchRecord(keywordStr);
            expect(await searchPo.isModuleTitleDisplayed(keywordStr, 'Knowledge Articles (5)', KAModule)).toBeTruthy('FailureMsg58: KA module title is missing');
            expect(await searchPo.isRecordDisplayedOnLeftPannel(kaDisplayId2[0], KAModule)).toBeTruthy(`FailureMsg48: ${kaDisplayId2} KA id  is displayed`);

            await searchPo.searchRecord('globalsearch1.pdf');
            expect(await searchPo.isModuleTitleDisplayed(nonMatchingSummary, 'Knowledge Articles (1)', KAModule)).toBeTruthy('FailureMsg58: KA module title is missing');
            expect(await searchPo.isRecordDisplayedOnLeftPannel(kaDisplayId3, KAModule)).toBeTruthy(`FailureMsg48: ${kaDisplayId3} KA id  is displayed`);

            await searchPo.searchRecord(nonMatchingSummary);
            expect(await searchPo.isModuleTitleDisplayed(nonMatchingSummary, 'Knowledge Articles (3)', KAModule)).toBeTruthy('FailureMsg58: KA module title is missing');
            expect(await searchPo.isRecordDisplayedOnLeftPannel(kaDisplayId4, KAModule)).toBeTruthy(`FailureMsg48: ${kaDisplayId4} KA id  is displayed`);
        });

        it('[DRDMV-16114]: Verify saerch KA with other company user', async () => {
            await navigationPage.signOut();
            await loginPage.login('gderuno')
            await navigationPage.gotoSearch();
            await searchPo.searchRecord(summary1);
            expect(await searchPo.isModuleTitleDisplayed(summary1, 'Knowledge Articles (0)', KAModule)).toBeTruthy('FailureMsg58: KA module title is missing');
            expect(await searchPo.isBlankRecordValidationDisplayedOnLeftPanel(KAModule)).toBeTruthy(`FailureMsg59: No result found validation is missing`);
            expect(await searchPo.isRecordDisplayedOnLeftPannel(kaDisplayId1[0], KAModule)).toBeFalsy(`FailureMsg48: ${kaDisplayId1[0]} KA id  is displayed`);

            await searchPo.searchRecord(keywordStr);
            expect(await searchPo.isModuleTitleDisplayed(nonMatchingSummary, 'Knowledge Articles (0)', KAModule)).toBeTruthy('FailureMsg58: KA module title is missing');
            expect(await searchPo.isBlankRecordValidationDisplayedOnLeftPanel(KAModule)).toBeTruthy(`FailureMsg59: No result found validation is missing`);
            expect(await searchPo.isRecordDisplayedOnLeftPannel(kaDisplayId2[0], KAModule)).toBeFalsy(`FailureMsg48: ${kaDisplayId2} KA id  is displayed`);

            await searchPo.searchRecord('globalsearch1.pdf');
            expect(await searchPo.isModuleTitleDisplayed(nonMatchingSummary, 'Knowledge Articles (0)', KAModule)).toBeTruthy('FailureMsg58: KA module title is missing');
            expect(await searchPo.isBlankRecordValidationDisplayedOnLeftPanel(KAModule)).toBeTruthy(`FailureMsg59: No result found validation is missing`);
            expect(await searchPo.isRecordDisplayedOnLeftPannel(kaDisplayId3[0], KAModule)).toBeFalsy(`FailureMsg48: ${kaDisplayId3} KA id  is displayed`);

            await searchPo.searchRecord(nonMatchingSummary);
            expect(await searchPo.isModuleTitleDisplayed(nonMatchingSummary, 'Knowledge Articles (0)', KAModule)).toBeTruthy('FailureMsg58: KA module title is missing');
            expect(await searchPo.isBlankRecordValidationDisplayedOnLeftPanel(KAModule)).toBeTruthy(`FailureMsg59: No result found validation missing`);
            expect(await searchPo.isRecordDisplayedOnLeftPannel(kaDisplayId4, KAModule)).toBeFalsy(`FailureMsg48: ${kaDisplayId4} KA id  is displayed`);
        });

        afterAll(async () => {
            await navigationPage.signOut();
            await loginPage.login('qtao');
        });
    });

    //kgaikwad
    describe('[DRDMV-16116]: Global search with only Case Template Category', async () => {
        let randomStr = [...Array(4)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        let templateName = 'summaryDRDMV16116' + randomStr;
        let description = 'descriptionDRDMV16116' + randomStr;
        let summary1 = '1summaryDRDMV16114' + randomStr;
        let summary2 = '2summaryDRDMV16114' + randomStr;
        let summary3 = '3summaryDRDMV16114' + randomStr;
        let summary4 = '4summaryDRDMV16114' + randomStr;
        let activeStatus = 'Active';
        let inactiveStatus = 'Inactive'
        let nonMatchingSummary = 'NonMatchingSummaryDRDMV16116' + randomStr;
        let dummyDescription = 'DummayDRDMV16116' + randomStr;

        let caseTemplateDisplayId1 = [];
        let caseTemplateDisplayId2 = [];
        let caseTemplateDisplayId3;
        let caseTemplateDisplayId4;
        let caseTemplateDisplayId5;

        beforeAll(async () => {
            await apiHelper.apiLogin('qkatawazi');
            // Global Template
            caseTemplateDisplayId5 = await createCaseTemplate(templateName + 9, summary4, activeStatus, '- Global -');

            // Create Case template with name & summary 
            for (let a = 1; a < 4; a++) {
                caseTemplateDisplayId1[a] = await createCaseTemplate(templateName + a, summary1, activeStatus, 'Petramco');
            }

            // Create Case template For Description
            for (let b = 4; b < 7; b++) {
                caseTemplateDisplayId2[b] = await createCaseTemplate(templateName + b, summary2, activeStatus, 'Petramco', description);
            }

            // Create Case template For Inactive
            caseTemplateDisplayId3 = await createCaseTemplate(templateName + 7, summary3, inactiveStatus, 'Petramco');

            // Non maching Case template
            caseTemplateDisplayId4 = await createCaseTemplate(templateName + 8, nonMatchingSummary, activeStatus, 'Petramco');
        });

        it('[DRDMV-16116]: Verify Module Title, Summary & Description', async () => {
            // Got Serch and select Case Template Module.
            await navigationPage.gotoSearch();
            expect(await searchPo.isCategoryDropDownSelectedValueDisplayed('All')).toBeTruthy('FailureMsg1: Default value from catergory drop down is missing');
            await searchPo.selectCategoryDropDownValue('Case Template');

            // Verify Global Template
            await searchPo.searchRecord(summary4);
            expect(await searchPo.isModuleTitleDisplayed(summary4, 'Case Templates (1)', caseTemplateModule)).toBeTruthy('FailureMsg2: Case module title is missing');
            expect(await searchPo.isRecordDisplayedOnLeftPannel(caseTemplateDisplayId5, caseTemplateModule)).toBeTruthy(`FailureMsg4: ${caseTemplateDisplayId5} case id  is missing`);

            // Verify with case template title
            await searchPo.searchRecord(templateName + '1');
            expect(await searchPo.isModuleTitleDisplayed(templateName + '1', 'Case Templates (1)', caseTemplateModule)).toBeTruthy('FailureMsg2: Case module title is missing');
            expect(await searchPo.isRecordDisplayedOnLeftPannel(caseTemplateDisplayId1[1], caseTemplateModule)).toBeTruthy(`FailureMsg4: ${caseTemplateDisplayId1[0]} case id  is missing`);

            await searchPo.searchRecord(templateName + '2');
            expect(await searchPo.isModuleTitleDisplayed(templateName + '2', 'Case Templates (1)', caseTemplateModule)).toBeTruthy('FailureMsg2: Case module title is missing');
            expect(await searchPo.isRecordDisplayedOnLeftPannel(caseTemplateDisplayId1[2], caseTemplateModule)).toBeTruthy(`FailureMsg4: ${caseTemplateDisplayId1[0]} case id  is missing`);

            await searchPo.searchRecord(templateName + '3');
            expect(await searchPo.isModuleTitleDisplayed(templateName + '3', 'Case Templates (1)', caseTemplateModule)).toBeTruthy('FailureMsg2: Case module title is missing');
            expect(await searchPo.isRecordDisplayedOnLeftPannel(caseTemplateDisplayId1[3], caseTemplateModule)).toBeTruthy(`FailureMsg4: ${caseTemplateDisplayId1[0]} case id  is missing`);

            // Verify with case template Summary
            await searchPo.searchRecord(summary1);
            expect(await searchPo.isModuleTitleDisplayed(summary1, 'Case Templates (3)', caseTemplateModule)).toBeTruthy('FailureMsg2: Case module title is missing');
            expect(await searchPo.isRecordDisplayedOnLeftPannel(caseTemplateDisplayId1[1], caseTemplateModule)).toBeTruthy(`FailureMsg4: ${caseTemplateDisplayId1[0]} case id  is missing`);
            expect(await searchPo.isRecordDisplayedOnLeftPannel(templateName + '1', caseTemplateModule)).toBeTruthy(`FailureMsg5: ${templateName + '1'} case title summary is missing`);
            expect(await searchPo.isRecordDisplayedOnLeftPannel(updatedDate, caseTemplateModule,)).toBeTruthy(`${updatedDate} updatedDate is missing`);
            expect(await searchPo.isRecordDisplayedOnLeftPannel(caseTemplateDisplayId1[2], caseTemplateModule)).toBeTruthy(`FailureMsg6: ${caseTemplateDisplayId1[1]} case id  is missing`);
            expect(await searchPo.isRecordDisplayedOnLeftPannel(caseTemplateDisplayId1[3], caseTemplateModule)).toBeTruthy(`FailureMsg7: ${caseTemplateDisplayId1[2]} case id  is missing`);

            // // Verify with case template desscription
            await searchPo.searchRecord(description);
            expect(await searchPo.isModuleTitleDisplayed(description, 'Case Templates (3)', caseTemplateModule)).toBeTruthy('FailureMsg2: Case module title is missing');
            expect(await searchPo.isRecordDisplayedOnLeftPannel(caseTemplateDisplayId2[4], caseTemplateModule)).toBeTruthy(`FailureMsg4: ${caseTemplateDisplayId1[0]} case id  is missing`);
            expect(await searchPo.isRecordDisplayedOnLeftPannel(templateName + 4, caseTemplateModule)).toBeTruthy(`FailureMsg5: ${summary2} case Template2 summary is missing`);
            expect(await searchPo.isRecordDisplayedOnLeftPannel(templateName + 5, caseTemplateModule)).toBeTruthy(`FailureMsg5: ${summary2} case Template2 summary is missing`);
            expect(await searchPo.isRecordDisplayedOnLeftPannel(templateName + 6, caseTemplateModule)).toBeTruthy(`FailureMsg5: ${summary2} case Template2 summary is missing`);
            expect(await searchPo.isRecordDisplayedOnLeftPannel(updatedDate, caseTemplateModule,)).toBeTruthy(`${updatedDate} updatedDate is missing`);
            expect(await searchPo.isRecordDisplayedOnLeftPannel(caseTemplateDisplayId2[5], caseTemplateModule)).toBeTruthy(`FailureMsg6: ${caseTemplateDisplayId1[1]} case id  is missing`);
            expect(await searchPo.isRecordDisplayedOnLeftPannel(caseTemplateDisplayId2[6], caseTemplateModule)).toBeTruthy(`FailureMsg7: ${caseTemplateDisplayId1[2]} case id  is missing`);

            await searchPo.clickOnLeftPannelRecord(caseTemplateDisplayId2[4], caseTemplateModule);
        });

        it('[DRDMV-16116]: Verify Case Preview Fields', async () => {
            expect(await caseTemplatePreviewPo.isCaseSummaryHeaderDisplayed('Case Summary')).toBeTruthy('FailureMsg20: Case Summary label is missing');
            expect(await caseTemplatePreviewPo.isCaseStatusTitleDisplayed('Case Status')).toBeTruthy('FailureMsg21: Case Status label is missing');
            expect(await caseTemplatePreviewPo.isCasePriorityTitleDisplayed('Case Priority')).toBeTruthy('FailureMsg22: Case Priority label is missing');
            expect(await caseTemplatePreviewPo.isFlowsetTitleDisplayed('Flowset')).toBeTruthy('FailureMsg23: Flowset label is missing');
            expect(await caseTemplatePreviewPo.isLabelTitleDisplayed('Label')).toBeTruthy('FailureMsg24: Label field label is missing');
            expect(await caseTemplatePreviewPo.isCaseCompanyTitleDisplayed('Case Company')).toBeTruthy('FailureMsg25: Case Company label is missing');
            expect(await caseTemplatePreviewPo.isCaseCategoryTier1TitleDisplayed('Case Category Tier 1')).toBeTruthy('Case Category Tier 1 is not getting displayed');
            expect(await caseTemplatePreviewPo.isCaseCategoryTier2TitleDisplayed('Case Category Tier 2')).toBeTruthy('Case Category Tier 2 is not getting displayed');
            expect(await caseTemplatePreviewPo.isCaseCategoryTier3TitleDisplayed('Case Category Tier 3')).toBeTruthy('Case Category Tier 3 is not getting displayed');
            expect(await caseTemplatePreviewPo.isCaseCategoryTier4TitleDisplayed('Case Category Tier 4')).toBeTruthy('Case Category Tier 4 is not getting displayed');
            expect(await caseTemplatePreviewPo.isCaseDescriptionTitleDisplayed('Case Description')).toBeTruthy('FailureMsg29: Case Description label is missing');
            expect(await caseTemplatePreviewPo.isAssigneeTitleDisplayed()).toBeTruthy('FailureMsg29: Assignee label is missing');
            expect(await caseTemplatePreviewPo.isSupportGroupTitleDisplayed('Support Group')).toBeTruthy('FailureMsg30: Support Group label is missing');
            expect(await caseTemplatePreviewPo.isSupportCompanyTitleDisplayed('Support Company')).toBeTruthy('FailureMsg31: Support Company label is missing');
            expect(await caseTemplatePreviewPo.getCaseTemplateName()).toBe(templateName + 4, 'FailureMsg20: Case template title is missing');
            expect(await caseTemplatePreviewPo.getCaseSummary()).toBe(summary2, 'FailureMsg20: Case Summary is missing');
            expect(await caseTemplatePreviewPo.getCasePriority()).toBe('Low', 'FailureMsg33: Case priority is missing');
            expect(await caseTemplatePreviewPo.getCaseCompanyValue()).toBe('Petramco', 'FailureMsg34: Case company is missing');
            expect(await caseTemplatePreviewPo.isCaseCategoryTier1ValueDisplayed('Applications')).toBeTruthy('FailureMsg35: catergoy tier 1 is missing');
            expect(await caseTemplatePreviewPo.isCaseCategoryTier2ValueDisplayed('Social')).toBeTruthy('FailureMsg36: catergoy tier 2 missing');
            expect(await caseTemplatePreviewPo.isCaseCategoryTier3ValueDisplayed('Chatter')).toBeTruthy('FailureMsg37: catergoy tier 3 is missing');
            expect(await caseTemplatePreviewPo.isCaseDescriptionValueDisplayed(description)).toBeTruthy('FailureMsg38: description is missing');
            expect(await caseTemplatePreviewPo.isAssigneeNameDisplayed('Qiang Du')).toBeTruthy('FailureMsg39: Assignee is missing');
            expect(await caseTemplatePreviewPo.isSupportGroupNameDisplayed('CA Support 1')).toBeTruthy('FailureMsg40: support group is missing');
            expect(await caseTemplatePreviewPo.isSupportCompanyNameDisplayed('Petramco')).toBeTruthy('FailureMsg41: Source Value is missing');
        });

        it('[DRDMV-16116]: Verify Template with Inactive Case Template ', async () => {
            await searchPo.searchRecord(summary3);
            expect(await searchPo.isModuleTitleDisplayed(summary3, 'Case Templates (0)', caseTemplateModule)).toBeTruthy('FailureMsg2: Case module title is missing');
            expect(await searchPo.isRecordDisplayedOnLeftPannel(caseTemplateDisplayId3, caseTemplateModule)).toBeFalsy(`FailureMsg4: ${caseTemplateDisplayId3} case template id  is display`);
        });

        it('[DRDMV-16116]: Verify Case with non matching Case summary and description Also Verify case summary and description who have not access of the case', async () => {
            await searchPo.searchRecord(summary1);
            expect(await searchPo.isModuleTitleDisplayed(summary1, 'Case Templates (3)', caseTemplateModule)).toBeTruthy('FailureMsg2: Case module title is missing');
            expect(await searchPo.isRecordDisplayedOnLeftPannel(caseTemplateDisplayId4, caseTemplateModule)).toBeFalsy(`FailureMsg51: ${nonMatchingSummary} non mathing template id is missing`);

            // Verify Case Template With Non Matching Summary
            await searchPo.searchRecord(summary1);
            expect(await searchPo.isModuleTitleDisplayed(summary1, 'Case Templates (3)', caseTemplateModule)).toBeTruthy('FailureMsg2: Case module title is missing');
            expect(await searchPo.isRecordDisplayedOnLeftPannel(caseTemplateDisplayId4, caseTemplateModule)).toBeFalsy(`FailureMsg51: ${nonMatchingSummary} non mathing template id is missing`);
        });

        it('[DRDMV-16116]: Clear search and verify record displayed on left pannel ', async () => {
            await searchPo.searchRecord(summary1);
            expect(await searchPo.isModuleTitleDisplayed(summary1, 'Case Templates (3)', caseTemplateModule)).toBeTruthy('FailureMsg2: Case module title is missing');
            await searchPo.clickClearSearchButton();
            expect(await searchPo.isClearSearchButtonDisplayed()).toBeFalsy('FailureMsg62: Search box is cleared and cross button gets hide');
            expect(await searchPo.isRecordDisplayedOnLeftPannel(caseTemplateDisplayId1[1], caseTemplateModule)).toBeTruthy(`FailureMsg4: ${caseTemplateDisplayId1[1]} case template id  is missing`);
        });

        it('[DRDMV-16116]: Verify search functionality with dummy text ', async () => {
            await searchPo.searchRecord(dummyDescription);
            expect(await searchPo.isRecordDisplayedOnLeftPannel(dummyDescription, caseTemplateModule)).toBeFalsy(`FailureMsg64: ${dummyDescription} dummyText  is displayed`);
            expect(await searchPo.isModuleTitleDisplayed(summary1, 'Case Templates (0)', caseTemplateModule)).toBeTruthy('FailureMsg2: Case module title is missing');
            expect(await searchPo.isBlankRecordValidationDisplayedOnLeftPanel(caseTemplateModule)).toBeTruthy(`FailureMsg66: No result found validation is missing`);
        });


        it('[DRDMV-16116]: Verify search case with assignee user', async () => {
            await navigationPage.signOut();
            await loginPage.login('qdu');
            await navigationPage.gotoSearch();
            // Verify with case template title
            await searchPo.searchRecord(templateName + '1');
            expect(await searchPo.isModuleTitleDisplayed(templateName + '1', 'Case Templates (1)', caseTemplateModule)).toBeTruthy('FailureMsg2: Case module title is missing');
            expect(await searchPo.isRecordDisplayedOnLeftPannel(caseTemplateDisplayId1[1], caseTemplateModule)).toBeTruthy(`FailureMsg4: ${caseTemplateDisplayId1[0]} case id  is missing`);

            await searchPo.searchRecord(templateName + '2');
            expect(await searchPo.isModuleTitleDisplayed(templateName + '2', 'Case Templates (1)', caseTemplateModule)).toBeTruthy('FailureMsg2: Case module title is missing');
            expect(await searchPo.isRecordDisplayedOnLeftPannel(caseTemplateDisplayId1[2], caseTemplateModule)).toBeTruthy(`FailureMsg4: ${caseTemplateDisplayId1[0]} case id  is missing`);

            await searchPo.searchRecord(templateName + '3');
            expect(await searchPo.isModuleTitleDisplayed(templateName + '3', 'Case Templates (1)', caseTemplateModule)).toBeTruthy('FailureMsg2: Case module title is missing');
            expect(await searchPo.isRecordDisplayedOnLeftPannel(caseTemplateDisplayId1[3], caseTemplateModule)).toBeTruthy(`FailureMsg4: ${caseTemplateDisplayId1[0]} case id  is missing`);

            // Verify with case template Summary
            await searchPo.searchRecord(summary1);
            expect(await searchPo.isModuleTitleDisplayed(summary1, 'Case Templates (3)', caseTemplateModule)).toBeTruthy('FailureMsg2: Case module title is missing');
            expect(await searchPo.isRecordDisplayedOnLeftPannel(caseTemplateDisplayId1[1], caseTemplateModule)).toBeTruthy(`FailureMsg4: ${caseTemplateDisplayId1[0]} case id  is missing`);
            expect(await searchPo.isRecordDisplayedOnLeftPannel(templateName + '1', caseTemplateModule)).toBeTruthy(`FailureMsg5: ${templateName + '1'} case title summary is missing`);
            expect(await searchPo.isRecordDisplayedOnLeftPannel(updatedDate, caseTemplateModule,)).toBeTruthy(`${updatedDate} updatedDate is missing`);
            expect(await searchPo.isRecordDisplayedOnLeftPannel(caseTemplateDisplayId1[2], caseTemplateModule)).toBeTruthy(`FailureMsg6: ${caseTemplateDisplayId1[1]} case id  is missing`);
            expect(await searchPo.isRecordDisplayedOnLeftPannel(caseTemplateDisplayId1[3], caseTemplateModule)).toBeTruthy(`FailureMsg7: ${caseTemplateDisplayId1[2]} case id  is missing`);

            // Verify Case Template With Non Matching Summary
            expect(await searchPo.isRecordDisplayedOnLeftPannel(caseTemplateDisplayId4, caseTemplateModule)).toBeFalsy(`FailureMsg51: ${nonMatchingSummary} non mathing template id is missing`);

            // Verify with case template desscription
            await searchPo.searchRecord(description);
            expect(await searchPo.isModuleTitleDisplayed(description, 'Case Templates (3)', caseTemplateModule)).toBeTruthy('FailureMsg2: Case module title is missing');
            expect(await searchPo.isRecordDisplayedOnLeftPannel(caseTemplateDisplayId2[4], caseTemplateModule)).toBeTruthy(`FailureMsg4: ${caseTemplateDisplayId1[0]} case id  is missing`);
            expect(await searchPo.isRecordDisplayedOnLeftPannel(templateName + 4, caseTemplateModule)).toBeTruthy(`FailureMsg5: ${summary2} case Template2 summary is missing`);
            expect(await searchPo.isRecordDisplayedOnLeftPannel(templateName + 5, caseTemplateModule)).toBeTruthy(`FailureMsg5: ${summary2} case Template2 summary is missing`);
            expect(await searchPo.isRecordDisplayedOnLeftPannel(templateName + 6, caseTemplateModule)).toBeTruthy(`FailureMsg5: ${summary2} case Template2 summary is missing`);
            expect(await searchPo.isRecordDisplayedOnLeftPannel(updatedDate, caseTemplateModule,)).toBeTruthy(`${updatedDate} updatedDate is missing`);
            expect(await searchPo.isRecordDisplayedOnLeftPannel(caseTemplateDisplayId2[5], caseTemplateModule)).toBeTruthy(`FailureMsg6: ${caseTemplateDisplayId1[1]} case id  is missing`);
            expect(await searchPo.isRecordDisplayedOnLeftPannel(caseTemplateDisplayId2[6], caseTemplateModule)).toBeTruthy(`FailureMsg7: ${caseTemplateDisplayId1[2]} case id  is missing`);

            // Verify Inactive Case Template
            await searchPo.searchRecord(summary3);
            expect(await searchPo.isModuleTitleDisplayed(summary3, 'Case Templates (0)', caseTemplateModule)).toBeTruthy('FailureMsg2: Case module title is missing');
            expect(await searchPo.isRecordDisplayedOnLeftPannel(caseTemplateDisplayId3, caseTemplateModule)).toBeFalsy(`FailureMsg4: ${caseTemplateDisplayId3} case template id  is display`);

            // Verify Global Template
            await searchPo.searchRecord(summary4);
            expect(await searchPo.isModuleTitleDisplayed(summary4, 'Case Templates (1)', caseTemplateModule)).toBeTruthy('FailureMsg2: Case module title is missing');
            expect(await searchPo.isRecordDisplayedOnLeftPannel(caseTemplateDisplayId5, caseTemplateModule)).toBeTruthy(`FailureMsg4: ${caseTemplateDisplayId5} case id  is missing`);
        });

        it('[DRDMV-16116]: Verify search case by other group user  ', async () => {
            await navigationPage.signOut();
            await loginPage.login('fritz')
            await navigationPage.gotoSearch();
            // Verify with case template title
            await searchPo.searchRecord(templateName + '1');
            expect(await searchPo.isModuleTitleDisplayed(templateName + '1', 'Case Templates (1)', caseTemplateModule)).toBeTruthy('FailureMsg2: Case module title is missing');
            expect(await searchPo.isRecordDisplayedOnLeftPannel(caseTemplateDisplayId1[1], caseTemplateModule)).toBeTruthy(`FailureMsg4: ${caseTemplateDisplayId1[0]} case id  is missing`);

            await searchPo.searchRecord(templateName + '2');
            expect(await searchPo.isModuleTitleDisplayed(templateName + '2', 'Case Templates (1)', caseTemplateModule)).toBeTruthy('FailureMsg2: Case module title is missing');
            expect(await searchPo.isRecordDisplayedOnLeftPannel(caseTemplateDisplayId1[2], caseTemplateModule)).toBeTruthy(`FailureMsg4: ${caseTemplateDisplayId1[0]} case id  is missing`);

            await searchPo.searchRecord(templateName + '3');
            expect(await searchPo.isModuleTitleDisplayed(templateName + '3', 'Case Templates (1)', caseTemplateModule)).toBeTruthy('FailureMsg2: Case module title is missing');
            expect(await searchPo.isRecordDisplayedOnLeftPannel(caseTemplateDisplayId1[3], caseTemplateModule)).toBeTruthy(`FailureMsg4: ${caseTemplateDisplayId1[0]} case id  is missing`);

            // Verify with case template Summary
            await searchPo.searchRecord(summary1);
            expect(await searchPo.isModuleTitleDisplayed(summary1, 'Case Templates (3)', caseTemplateModule)).toBeTruthy('FailureMsg2: Case module title is missing');
            expect(await searchPo.isRecordDisplayedOnLeftPannel(caseTemplateDisplayId1[1], caseTemplateModule)).toBeTruthy(`FailureMsg4: ${caseTemplateDisplayId1[0]} case id  is missing`);
            expect(await searchPo.isRecordDisplayedOnLeftPannel(templateName + '1', caseTemplateModule)).toBeTruthy(`FailtoBeTruthyureMsg5: ${templateName + '1'} case title summary is missing`);
            expect(await searchPo.isRecordDisplayedOnLeftPannel(updatedDate, caseTemplateModule,)).toBeTruthy(`${updatedDate} updatedDate is missing`);
            expect(await searchPo.isRecordDisplayedOnLeftPannel(caseTemplateDisplayId1[2], caseTemplateModule)).toBeTruthy(`FailureMsg6: ${caseTemplateDisplayId1[1]} case id  is missing`);
            expect(await searchPo.isRecordDisplayedOnLeftPannel(caseTemplateDisplayId1[3], caseTemplateModule)).toBeTruthy(`FailureMsg7: ${caseTemplateDisplayId1[2]} case id  is missing`);

            // Verify Case Template With Non Matching Summary
            expect(await searchPo.isRecordDisplayedOnLeftPannel(caseTemplateDisplayId4, caseTemplateModule)).toBeFalsy(`FailureMsg51: ${nonMatchingSummary} non mathing template id is missing`);

            // Verify with case template desscription
            await searchPo.searchRecord(description);
            expect(await searchPo.isModuleTitleDisplayed(description, 'Case Templates (3)', caseTemplateModule)).toBeTruthy('FailureMsg2: Case module title is missing');
            expect(await searchPo.isRecordDisplayedOnLeftPannel(caseTemplateDisplayId2[4], caseTemplateModule)).toBeTruthy(`FailureMsg4: ${caseTemplateDisplayId1[0]} case id  is missing`);
            expect(await searchPo.isRecordDisplayedOnLeftPannel(templateName + 4, caseTemplateModule)).toBeTruthy(`FailureMsg5: ${summary2} case Template2 summary is missing`);
            expect(await searchPo.isRecordDisplayedOnLeftPannel(templateName + 5, caseTemplateModule)).toBeTruthy(`FailureMsg5: ${summary2} case Template2 summary is missing`);
            expect(await searchPo.isRecordDisplayedOnLeftPannel(templateName + 6, caseTemplateModule)).toBeTruthy(`FailureMsg5: ${summary2} case Template2 summary is missing`);
            expect(await searchPo.isRecordDisplayedOnLeftPannel(updatedDate, caseTemplateModule,)).toBeTruthy(`${updatedDate} updatedDate is missing`);
            expect(await searchPo.isRecordDisplayedOnLeftPannel(caseTemplateDisplayId2[5], caseTemplateModule)).toBeTruthy(`FailureMsg6: ${caseTemplateDisplayId1[1]} case id  is missing`);
            expect(await searchPo.isRecordDisplayedOnLeftPannel(caseTemplateDisplayId2[6], caseTemplateModule)).toBeTruthy(`FailureMsg7: ${caseTemplateDisplayId1[2]} case id  is missing`);

            // Verify Inactive Case Template
            await searchPo.searchRecord(summary3);
            expect(await searchPo.isModuleTitleDisplayed(summary3, 'Case Templates (0)', caseTemplateModule)).toBeTruthy('FailureMsg2: Case module title is missing');
            expect(await searchPo.isRecordDisplayedOnLeftPannel(caseTemplateDisplayId3, caseTemplateModule)).toBeFalsy(`FailureMsg4: ${caseTemplateDisplayId3} case template id  is display`);

            // Verify Global Template
            await searchPo.searchRecord(summary4);
            expect(await searchPo.isModuleTitleDisplayed(summary4, 'Case Templates (1)', caseTemplateModule)).toBeTruthy('FailureMsg2: Case module title is missing');
            expect(await searchPo.isRecordDisplayedOnLeftPannel(caseTemplateDisplayId5, caseTemplateModule)).toBeTruthy(`FailureMsg4: ${caseTemplateDisplayId5} case id  is missing`);
        });

        it('[DRDMV-16116]: Verify non acess case Template with petramco and global company', async () => {
            await navigationPage.signOut();
            await loginPage.login('gwixillian');

            await navigationPage.gotoSearch();
            await searchPo.searchRecord(summary1);
            expect(await searchPo.isModuleTitleDisplayed(summary1, 'Case Templates (0)', caseTemplateModule)).toBeTruthy('FailureMsg2: Case module title is displayed');
            expect(await searchPo.isBlankRecordValidationDisplayedOnLeftPanel(caseTemplateModule)).toBeTruthy(`FailureMsg66: No result found validation is missing`);

            // Verify Global Template
            await searchPo.searchRecord(summary4);
            expect(await searchPo.isModuleTitleDisplayed(summary4, 'Case Templates (1)', caseTemplateModule)).toBeTruthy('FailureMsg2: Case module title is missing');
            expect(await searchPo.isRecordDisplayedOnLeftPannel(caseTemplateDisplayId5, caseTemplateModule)).toBeTruthy(`FailureMsg4: ${caseTemplateDisplayId5} case id  is missing`);
        });

        afterAll(async () => {
            await navigationPage.signOut();
            await loginPage.login('qtao')
        });
    });

    //kgaikwad
    describe('[DRDMV-16118]:Global search with only Task Template Category', async () => {
        let randomStr = [...Array(4)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        let templateName = 'templatenameDRDMV16118' + randomStr;
        let description = 'descriptionDRDMV16118' + randomStr;
        let activeStatus = 'Active';
        let inactiveStatus = 'Inactive'
        let nonMatchingTemplate = 'NonMatchingSummaryDRDMV16118' + randomStr;
        let dummyDescription = 'DummayDRDMV16118' + randomStr;

        let taskTemplateDisplayId1 = [];
        let taskTemplateDisplayId2 = [];
        let taskTemplateDisplayId3;
        let taskTemplateDisplayId4;
        let taskTemplateDisplayId5;


        beforeAll(async () => {
            await apiHelper.apiLogin('qkatawazi');
            // Global Template
            taskTemplateDisplayId5 = await createTaskTemplate(templateName + 9, activeStatus, '- Global -');

            // Create Task template with name 
            for (let a = 1; a < 4; a++) {
                taskTemplateDisplayId1[a] = await createTaskTemplate(templateName + a, activeStatus, 'Petramco');
            }

            // Create Task template For Description
            for (let b = 4; b < 7; b++) {
                taskTemplateDisplayId2[b] = await createTaskTemplate(templateName + b, activeStatus, 'Petramco', description);
            }

            // Create Task template For Inactive
            taskTemplateDisplayId3 = await createTaskTemplate(templateName + 7, inactiveStatus, 'Petramco');

            // Non maching Task template
            taskTemplateDisplayId4 = await createTaskTemplate(nonMatchingTemplate, activeStatus, 'Petramco');
        });

        it('[DRDMV-16118]: Verify Module Title, Description', async () => {
            // Got Serch and select Task Template Module.
            await navigationPage.gotoSearch();
            expect(await searchPo.isCategoryDropDownSelectedValueDisplayed('All')).toBeTruthy('FailureMsg1: Default value from catergory drop down is missing');
            await searchPo.selectCategoryDropDownValue('Task Template');

            // Verify Global Template
            await searchPo.searchRecord(templateName + 9);
            expect(await searchPo.isModuleTitleDisplayed(templateName + 9, 'Task Templates (1)', taskTemplateModule)).toBeTruthy('FailureMsg2: Task Template module title is missing');
            expect(await searchPo.isRecordDisplayedOnLeftPannel(taskTemplateDisplayId5, taskTemplateModule)).toBeTruthy(`FailureMsg4: ${taskTemplateDisplayId5} task id  is missing`);

            // Verify with task template title
            await searchPo.searchRecord(templateName + '1');
            expect(await searchPo.isModuleTitleDisplayed(templateName + '1', 'Task Templates (1)', taskTemplateModule)).toBeTruthy('FailureMsg2: Task module title is missing');
            expect(await searchPo.isRecordDisplayedOnLeftPannel(taskTemplateDisplayId1[1], taskTemplateModule)).toBeTruthy(`FailureMsg4: ${taskTemplateDisplayId1[0]} task id  is missing`);

            await searchPo.searchRecord(templateName + '2');
            expect(await searchPo.isModuleTitleDisplayed(templateName + '2', 'Task Templates (1)', taskTemplateModule)).toBeTruthy('FailureMsg2: Task module title is missing');
            expect(await searchPo.isRecordDisplayedOnLeftPannel(taskTemplateDisplayId1[2], taskTemplateModule)).toBeTruthy(`FailureMsg4: ${taskTemplateDisplayId1[0]} task id  is missing`);

            await searchPo.searchRecord(templateName + '3');
            expect(await searchPo.isModuleTitleDisplayed(templateName + '3', 'Task Templates (1)', taskTemplateModule)).toBeTruthy('FailureMsg2: Task module title is missing');
            expect(await searchPo.isRecordDisplayedOnLeftPannel(taskTemplateDisplayId1[3], taskTemplateModule)).toBeTruthy(`FailureMsg4: ${taskTemplateDisplayId1[0]} task id  is missing`);

            // Verify with task template desscription
            await searchPo.searchRecord(description);
            expect(await searchPo.isModuleTitleDisplayed(description, 'Task Templates (3)', taskTemplateModule)).toBeTruthy('FailureMsg2: Task module title is missing');
            expect(await searchPo.isRecordDisplayedOnLeftPannel(taskTemplateDisplayId2[4], taskTemplateModule)).toBeTruthy(`FailureMsg4: ${taskTemplateDisplayId1[0]} task id  is missing`);
            expect(await searchPo.isRecordDisplayedOnLeftPannel(templateName + 4, taskTemplateModule)).toBeTruthy(`FailureMsg5: ${templateName + 4} task Template2 summary is missing`);
            expect(await searchPo.isRecordDisplayedOnLeftPannel(templateName + 5, taskTemplateModule)).toBeTruthy(`FailureMsg5: ${templateName + 5} task Template2 summary is missing`);
            expect(await searchPo.isRecordDisplayedOnLeftPannel(templateName + 6, taskTemplateModule)).toBeTruthy(`FailureMsg5: ${templateName + 6} task Template2 summary is missing`);
            expect(await searchPo.isRecordDisplayedOnLeftPannel(updatedDate, taskTemplateModule,)).toBeTruthy(`${updatedDate} updatedDate is missing`);
            expect(await searchPo.isRecordDisplayedOnLeftPannel(taskTemplateDisplayId2[5], taskTemplateModule)).toBeTruthy(`FailureMsg6: ${taskTemplateDisplayId1[1]} task id  is missing`);
            expect(await searchPo.isRecordDisplayedOnLeftPannel(taskTemplateDisplayId2[6], taskTemplateModule)).toBeTruthy(`FailureMsg7: ${taskTemplateDisplayId1[2]} task id  is missing`);

            await searchPo.clickOnLeftPannelRecord(taskTemplateDisplayId2[4], taskTemplateModule);
        });

        it('[DRDMV-16118]: Verify Task Preview Fields', async () => {
            expect(await previewTaskTemplatePo.isTaskSummaryTitleDisplayed('Task Summary')).toBeTruthy('FailureMsg20: Task Summary label is missing');
            expect(await previewTaskTemplatePo.isTaskTypeTitleDisplayed('Task Type')).toBeTruthy('FailureMsg21: Task Type label is missing');
            expect(await previewTaskTemplatePo.isTaskPriorityTitleDisplayed('Task Priority')).toBeTruthy('FailureMsg22: Task Priority label is missing');
            expect(await previewTaskTemplatePo.isLabelTitleDisplayed('Label')).toBeTruthy('FailureMsg24: Label field label is missing');
            expect(await previewTaskTemplatePo.isTaskCompanyTitleDisplayed('Task Company')).toBeTruthy('FailureMsg25: Task Company label is missing');
            expect(await previewTaskTemplatePo.isTaskCategoryTier1TitleDisplayed('Task Category Tier 1')).toBeTruthy('FailureMsg28: Category Tier 1 label is missing');
            expect(await previewTaskTemplatePo.isTaskCategoryTier2TitleDisplayed('Task Category Tier 2')).toBeTruthy('FailureMsg26: Category Tier 2 label is missing');
            expect(await previewTaskTemplatePo.isTaskCategoryTier3TitleDisplayed('Task Category Tier 3')).toBeTruthy('FailureMsg27: Category Tier 3 label is missing');
            expect(await previewTaskTemplatePo.isTaskCategoryTier4TitleDisplayed('Task Category Tier 4')).toBeTruthy('FailureMsg27: Category Tier 3 label is missing');
            expect(await previewTaskTemplatePo.isTaskDescriptionTitleDisplayed('Task Description')).toBeTruthy('FailureMsg29: Task Description label is missing');
            expect(await previewTaskTemplatePo.isAssigneeTitleDisplayed('Assignee')).toBeTruthy('FailureMsg29: Assignee label is missing');
            expect(await previewTaskTemplatePo.isSupportGroupTitleDisplayed('Support Group')).toBeTruthy('FailureMsg30: Support Group label is missing');
            expect(await previewTaskTemplatePo.isTaskCompanyTitleDisplayed('Support Company')).toBeTruthy('FailureMsg31: Support Company label is missing');

            expect(await previewTaskTemplatePo.getTaskTemplateName()).toBe(templateName + 4, 'FailureMsg20: Task template title is missing');
            expect(await previewTaskTemplatePo.getTaskSummary()).toBe('TemplateSummary', 'FailureMsg20: Task Summary is missing');
            expect(await previewTaskTemplatePo.getTaskPriority()).toBe('Medium', 'FailureMsg33: Task priority is missing');
            expect(await previewTaskTemplatePo.getTaskCompany()).toBe('Petramco', 'FailureMsg34: Task company is missing');
            expect(await previewTaskTemplatePo.getDescription()).toBe(description, 'FailureMsg38: description is missing');
            expect(await previewTaskTemplatePo.getAssigneeText()).toBe('Qiang Du','FailureMsg39: Assignee is missing');
            expect(await previewTaskTemplatePo.getSupportGroup()).toBe('CA Support 1', 'FailureMsg40: support group is missing');
            expect(await previewTaskTemplatePo.getSupportCompany()).toBe('Petramco', 'FailureMsg41: Company Value is missing');
        });

        it('[DRDMV-16118]: Verify Template with Inactive Task Template ', async () => {
            await searchPo.searchRecord(templateName + 7);
            expect(await searchPo.isModuleTitleDisplayed(templateName + 7, 'Task Templates (0)', taskTemplateModule)).toBeTruthy('FailureMsg2: Task module title is missing');
            expect(await searchPo.isRecordDisplayedOnLeftPannel(taskTemplateDisplayId3, taskTemplateModule)).toBeFalsy(`FailureMsg4: ${taskTemplateDisplayId3} task template id  is display`);
        });

        it('[DRDMV-16118]: Verify Task Template With Non Matching template description', async () => {
            await searchPo.searchRecord(description);
            expect(await searchPo.isModuleTitleDisplayed(description, 'Task Templates (3)', taskTemplateModule)).toBeTruthy('FailureMsg2: Task module title is missing');
            expect(await searchPo.isRecordDisplayedOnLeftPannel(taskTemplateDisplayId4, taskTemplateModule)).toBeFalsy(`FailureMsg51: ${taskTemplateDisplayId4} non mathing template id is displayed`);
        });

        it('[DRDMV-16118]: Clear search and verify record displayed on left pannel ', async () => {
            await searchPo.searchRecord(description);
            expect(await searchPo.isModuleTitleDisplayed(description, 'Task Templates (3)', taskTemplateModule)).toBeTruthy('FailureMsg2: Task module title is missing');
            await searchPo.clickClearSearchButton();
            expect(await searchPo.isClearSearchButtonDisplayed()).toBeFalsy('FailureMsg62: Search box is cleared and cross button gets hide');
            expect(await searchPo.isRecordDisplayedOnLeftPannel(taskTemplateDisplayId2[4], taskTemplateModule)).toBeTruthy(`FailureMsg4: ${taskTemplateDisplayId1[1]} task template id  is missing`);
        });

        it('[DRDMV-16118]: Verify search functionality with dummy text ', async () => {
            await searchPo.searchRecord(dummyDescription);
            expect(await searchPo.isRecordDisplayedOnLeftPannel(dummyDescription, taskTemplateModule)).toBeFalsy(`FailureMsg64: ${dummyDescription} dummyText  is displayed`);
            expect(await searchPo.isModuleTitleDisplayed(dummyDescription, 'Task Templates (0)', taskTemplateModule)).toBeTruthy('FailureMsg2: Task module title is missing');
            expect(await searchPo.isBlankRecordValidationDisplayedOnLeftPanel(taskTemplateModule)).toBeTruthy(`FailureMsg66: No result found validation is missing`);
        });


        it('[DRDMV-16118]: Verify search task with assignee user', async () => {
            await navigationPage.signOut();
            await loginPage.login('qdu');
            await navigationPage.gotoSearch();
            // Verify with task template title
            await searchPo.searchRecord(templateName + '1');
            expect(await searchPo.isModuleTitleDisplayed(templateName + '1', 'Task Templates (1)', taskTemplateModule)).toBeTruthy('FailureMsg2: Task module title is missing');
            expect(await searchPo.isRecordDisplayedOnLeftPannel(taskTemplateDisplayId1[1], taskTemplateModule)).toBeTruthy(`FailureMsg4: ${taskTemplateDisplayId1[0]} task id  is missing`);

            await searchPo.searchRecord(templateName + '2');
            expect(await searchPo.isModuleTitleDisplayed(templateName + '2', 'Task Templates (1)', taskTemplateModule)).toBeTruthy('FailureMsg2: Task module title is missing');
            expect(await searchPo.isRecordDisplayedOnLeftPannel(taskTemplateDisplayId1[2], taskTemplateModule)).toBeTruthy(`FailureMsg4: ${taskTemplateDisplayId1[0]} task id  is missing`);

            await searchPo.searchRecord(templateName + '3');
            expect(await searchPo.isModuleTitleDisplayed(templateName + '3', 'Task Templates (1)', taskTemplateModule)).toBeTruthy('FailureMsg2: Task module title is missing');
            expect(await searchPo.isRecordDisplayedOnLeftPannel(taskTemplateDisplayId1[3], taskTemplateModule)).toBeTruthy(`FailureMsg4: ${taskTemplateDisplayId1[0]} task id  is missing`);

            // Verify with task template desscription
            await searchPo.searchRecord(description);
            expect(await searchPo.isModuleTitleDisplayed(description, 'Task Templates (3)', taskTemplateModule)).toBeTruthy('FailureMsg2: Task module title is missing');
            expect(await searchPo.isRecordDisplayedOnLeftPannel(taskTemplateDisplayId2[4], taskTemplateModule)).toBeTruthy(`FailureMsg4: ${taskTemplateDisplayId1[0]} task id  is missing`);
            expect(await searchPo.isRecordDisplayedOnLeftPannel(templateName + 4, taskTemplateModule)).toBeTruthy(`FailureMsg5: ${templateName + 4} task Template2 summary is missing`);
            expect(await searchPo.isRecordDisplayedOnLeftPannel(templateName + 5, taskTemplateModule)).toBeTruthy(`FailureMsg5: ${templateName + 5} task Template2 summary is missing`);
            expect(await searchPo.isRecordDisplayedOnLeftPannel(templateName + 6, taskTemplateModule)).toBeTruthy(`FailureMsg5: ${templateName + 6} task Template2 summary is missing`);
            expect(await searchPo.isRecordDisplayedOnLeftPannel(updatedDate, taskTemplateModule,)).toBeTruthy(`${updatedDate} updatedDate is missing`);
            expect(await searchPo.isRecordDisplayedOnLeftPannel(taskTemplateDisplayId2[5], taskTemplateModule)).toBeTruthy(`FailureMsg6: ${taskTemplateDisplayId1[1]} task id  is missing`);
            expect(await searchPo.isRecordDisplayedOnLeftPannel(taskTemplateDisplayId2[6], taskTemplateModule)).toBeTruthy(`FailureMsg7: ${taskTemplateDisplayId1[2]} task id  is missing`);

            // Verify Inactive Task Template
            await searchPo.searchRecord(templateName + 7);
            expect(await searchPo.isModuleTitleDisplayed(templateName + 7, 'Task Templates (0)', taskTemplateModule)).toBeTruthy('FailureMsg2: Task module title is missing');
            expect(await searchPo.isRecordDisplayedOnLeftPannel(taskTemplateDisplayId3, taskTemplateModule)).toBeFalsy(`FailureMsg4: ${taskTemplateDisplayId3} task template id  is display`);

            // Verify Global Template
            await searchPo.searchRecord(templateName + 9);
            expect(await searchPo.isModuleTitleDisplayed(templateName + 9, 'Task Templates (1)', taskTemplateModule)).toBeTruthy('FailureMsg2: Task module title is missing');
            expect(await searchPo.isRecordDisplayedOnLeftPannel(taskTemplateDisplayId5, taskTemplateModule)).toBeTruthy(`FailureMsg4: ${taskTemplateDisplayId5} task id  is missing`);
        });

        it('[DRDMV-16118]: Verify search task by other group user  ', async () => {
            await navigationPage.signOut();
            await loginPage.login('fritz')
            await navigationPage.gotoSearch();
            // Verify with task template title
            await searchPo.searchRecord(templateName + '1');
            expect(await searchPo.isModuleTitleDisplayed(templateName + '1', 'Task Templates (1)', taskTemplateModule)).toBeTruthy('FailureMsg2: Task module title is missing');
            expect(await searchPo.isRecordDisplayedOnLeftPannel(taskTemplateDisplayId1[1], taskTemplateModule)).toBeTruthy(`FailureMsg4: ${taskTemplateDisplayId1[0]} task id  is missing`);

            await searchPo.searchRecord(templateName + '2');
            expect(await searchPo.isModuleTitleDisplayed(templateName + '2', 'Task Templates (1)', taskTemplateModule)).toBeTruthy('FailureMsg2: Task module title is missing');
            expect(await searchPo.isRecordDisplayedOnLeftPannel(taskTemplateDisplayId1[2], taskTemplateModule)).toBeTruthy(`FailureMsg4: ${taskTemplateDisplayId1[0]} task id  is missing`);

            await searchPo.searchRecord(templateName + '3');
            expect(await searchPo.isModuleTitleDisplayed(templateName + '3', 'Task Templates (1)', taskTemplateModule)).toBeTruthy('FailureMsg2: Task module title is missing');
            expect(await searchPo.isRecordDisplayedOnLeftPannel(taskTemplateDisplayId1[3], taskTemplateModule)).toBeTruthy(`FailureMsg4: ${taskTemplateDisplayId1[0]} task id  is missing`);

            // Verify with task template desscription
            await searchPo.searchRecord(description);
            expect(await searchPo.isModuleTitleDisplayed(description, 'Task Templates (3)', taskTemplateModule)).toBeTruthy('FailureMsg2: Task module title is missing');
            expect(await searchPo.isRecordDisplayedOnLeftPannel(taskTemplateDisplayId2[4], taskTemplateModule)).toBeTruthy(`FailureMsg4: ${taskTemplateDisplayId1[0]} task id  is missing`);
            expect(await searchPo.isRecordDisplayedOnLeftPannel(templateName + 4, taskTemplateModule)).toBeTruthy(`FailureMsg5: ${templateName + 4} task Template2 summary is missing`);
            expect(await searchPo.isRecordDisplayedOnLeftPannel(templateName + 5, taskTemplateModule)).toBeTruthy(`FailureMsg5: ${templateName + 5} task Template2 summary is missing`);
            expect(await searchPo.isRecordDisplayedOnLeftPannel(templateName + 6, taskTemplateModule)).toBeTruthy(`FailureMsg5: ${templateName + 6} task Template2 summary is missing`);
            expect(await searchPo.isRecordDisplayedOnLeftPannel(updatedDate, taskTemplateModule,)).toBeTruthy(`${updatedDate} updatedDate is missing`);
            expect(await searchPo.isRecordDisplayedOnLeftPannel(taskTemplateDisplayId2[5], taskTemplateModule)).toBeTruthy(`FailureMsg6: ${taskTemplateDisplayId1[1]} task id  is missing`);
            expect(await searchPo.isRecordDisplayedOnLeftPannel(taskTemplateDisplayId2[6], taskTemplateModule)).toBeTruthy(`FailureMsg7: ${taskTemplateDisplayId1[2]} task id  is missing`);

            // Verify Inactive Task Template
            await searchPo.searchRecord(templateName + 7);
            expect(await searchPo.isModuleTitleDisplayed(templateName + 7, 'Task Templates (0)', taskTemplateModule)).toBeTruthy('FailureMsg2: Task module title is missing');
            expect(await searchPo.isRecordDisplayedOnLeftPannel(taskTemplateDisplayId3, taskTemplateModule)).toBeFalsy(`FailureMsg4: ${taskTemplateDisplayId3} task template id  is display`);

            // Verify Global Template
            await searchPo.searchRecord(templateName + 9);
            expect(await searchPo.isModuleTitleDisplayed(templateName + 9, 'Task Templates (1)', taskTemplateModule)).toBeTruthy('FailureMsg2: Task module title is missing');
            expect(await searchPo.isRecordDisplayedOnLeftPannel(taskTemplateDisplayId5, taskTemplateModule)).toBeTruthy(`FailureMsg4: ${taskTemplateDisplayId5} task id  is missing`);
        });

        it('[DRDMV-16118]: Verify non acess task Template with petramco and global company', async () => {
            await navigationPage.signOut();
            await loginPage.login('gwixillian');

            await navigationPage.gotoSearch();
            await searchPo.searchRecord(templateName + 1);
            expect(await searchPo.isModuleTitleDisplayed(templateName + 1, 'Task Templates (0)', taskTemplateModule)).toBeTruthy('FailureMsg2: Task module title is displayed');
            expect(await searchPo.isBlankRecordValidationDisplayedOnLeftPanel(taskTemplateModule)).toBeTruthy(`FailureMsg66: No result found validation is missing`);

            // Verify Global Template
            await searchPo.searchRecord(templateName + 9);
            expect(await searchPo.isModuleTitleDisplayed(templateName + 9, 'Task Templates (1)', taskTemplateModule)).toBeTruthy('FailureMsg2: Task module title is missing');
            expect(await searchPo.isRecordDisplayedOnLeftPannel(taskTemplateDisplayId5, taskTemplateModule)).toBeTruthy(`FailureMsg4: ${taskTemplateDisplayId5} task id  is missing`);
        });

        afterAll(async () => {
            await navigationPage.signOut();
            await loginPage.login('qtao')
        });
    });

    //kgaikwad
    describe('[DRDMV-16123]: Global search with only Document Category', async () => {
        let randomStr = [...Array(4)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        let attachmentFilePath = 'e2e/data/ui/attachment/globalsearch1.pdf';
        let attachmentFileName = 'globalsearch1.pdf';
        let docName1 = '1docNameDRDMV16123' + randomStr;
        let docName2 = '2docNameDRDMV16123' + randomStr;
        let keywordStr = '1keywordDRDMV16123' + randomStr;
        let nonMatchingKeyword = '2keywordDRDMV16123' + randomStr;
        let dummyText = 'DummayDRDMV16123' + randomStr;
        let nonMatchingDocName = 'nonMatchingSummaryDRDMV16123' + randomStr;
        let nonAccessDocName = 'nonMatchingDocNameDRDMV16123' + randomStr;

        beforeAll(async () => {

            await apiHelper.apiLogin('qkatawazi');
            // Create Document Name & Attachment & Attachment
            for (let a = 1; a < 6; a++) {
                await createPublishDocumentLibrary(docName1, attachmentFilePath, keywordStr);
            }

            //  Create Document with Draft
            await createDraftDocumentLibrary(docName2, attachmentFilePath);

            // Non maching Document 
            let nonMatchingKeyword = '2keywordDRDMV16123' + randomStr;
            await createPublishDocumentLibrary(nonMatchingDocName, attachmentFilePath, nonMatchingKeyword);

            // Non access Document
            await apiHelper.apiLogin('elizabeth');
            await createPublishDocumentLibrary(nonAccessDocName, attachmentFilePath);
        });

        it('[DRDMV-16123]: Verify Document Name, Keyword, Attachment', async () => {
            await navigationPage.signOut();
            await loginPage.login('qkatawazi');
            await navigationPage.gotoSearch();
            expect(await searchPo.isCategoryDropDownSelectedValueDisplayed('All')).toBeTruthy('FailureMsg1: Default value from catergory drop down is missing');
            await searchPo.selectCategoryDropDownValue('Document');
            await searchPo.searchRecord(docName1);
            expect(await searchPo.isModuleTitleDisplayed(docName1, 'Documents (5)', documentModule)).toBeTruthy('FailureMsg2: Document module title is missing');
            expect(await searchPo.isRecordDisplayedOnLeftPannel(updatedDate, documentModule)).toBeTruthy(`${updatedDate} updatedDate is missing`);
            expect(await searchPo.isRecordDisplayedOnLeftPannel(attachmentFileName, documentModule)).toBeTruthy(`${attachmentFileName} attachment File Name is missing`);
            expect(await searchPo.isRecordDisplayedOnLeftPannel(docName1, documentModule, 1)).toBeTruthy(`FailureMsg4: ${docName1} 1 Document is missing`);
            expect(await searchPo.isRecordDisplayedOnLeftPannel(docName1, documentModule, 2)).toBeTruthy(`FailureMsg4: ${docName1} 2 Document is missing`);
            expect(await searchPo.isRecordDisplayedOnLeftPannel(docName1, documentModule, 3)).toBeTruthy(`FailureMsg5: ${docName1} 3 Document is missing`);
            expect(await searchPo.isRecordDisplayedOnLeftPannel(docName1, documentModule, 4)).toBeTruthy(`FailureMsg6: ${docName1} 4 Document is missing`);
            expect(await searchPo.isRecordDisplayedOnLeftPannel(docName1, documentModule, 5)).toBeTruthy(`FailureMsg7: ${docName1} 5 Document is missing`);

            await searchPo.searchRecord(keywordStr);
            expect(await searchPo.isModuleTitleDisplayed(docName1, 'Documents (5)', documentModule)).toBeTruthy('FailureMsg2: Document module title is missing');
            expect(await searchPo.isRecordDisplayedOnLeftPannel(updatedDate, documentModule)).toBeTruthy(`${updatedDate} updatedDate is missing`);
            expect(await searchPo.isRecordDisplayedOnLeftPannel(attachmentFileName, documentModule)).toBeTruthy(`${attachmentFileName} attachment File Name is missing`);
            expect(await searchPo.isRecordDisplayedOnLeftPannel(docName1, documentModule, 1)).toBeTruthy(`FailureMsg4: ${docName1} 1 Document is missing`);
            expect(await searchPo.isRecordDisplayedOnLeftPannel(docName1, documentModule, 2)).toBeTruthy(`FailureMsg4: ${docName1} 2 Document is missing`);
            expect(await searchPo.isRecordDisplayedOnLeftPannel(docName1, documentModule, 3)).toBeTruthy(`FailureMsg5: ${docName1} 3 Document is missing`);
            expect(await searchPo.isRecordDisplayedOnLeftPannel(docName1, documentModule, 4)).toBeTruthy(`FailureMsg6: ${docName1} 4 Document is missing`);
            expect(await searchPo.isRecordDisplayedOnLeftPannel(docName1, documentModule, 5)).toBeTruthy(`FailureMsg7: ${docName1} 5 Document is missing`);

            await searchPo.searchRecord(attachmentFileName);
            expect(await searchPo.isModuleTitleDisplayed(docName1, 'Documents (6)', documentModule)).toBeTruthy('FailureMsg2: Document module title is missing');
            expect(await searchPo.isRecordDisplayedOnLeftPannel(updatedDate, documentModule)).toBeTruthy(`${updatedDate} updatedDate is missing`);
            expect(await searchPo.isRecordDisplayedOnLeftPannel(attachmentFileName, documentModule)).toBeTruthy(`${attachmentFileName} attachment File Name is missing`);
            expect(await searchPo.isRecordDisplayedOnLeftPannel(docName1, documentModule, 1)).toBeTruthy(`FailureMsg4: ${docName1} 1 Document is missing`);
            expect(await searchPo.isRecordDisplayedOnLeftPannel(docName1, documentModule, 2)).toBeTruthy(`FailureMsg4: ${docName1} 2 Document is missing`);
            expect(await searchPo.isRecordDisplayedOnLeftPannel(docName1, documentModule, 3)).toBeTruthy(`FailureMsg5: ${docName1} 3 Document is missing`);
            expect(await searchPo.isRecordDisplayedOnLeftPannel(docName1, documentModule, 4)).toBeTruthy(`FailureMsg6: ${docName1} 4 Document is missing`);
            expect(await searchPo.isRecordDisplayedOnLeftPannel(docName1, documentModule, 5)).toBeTruthy(`FailureMsg7: ${docName1} 5 Document is missing`);

            await searchPo.clickOnLeftPannelRecord(docName1, documentModule);
        });

        it('[DRDMV-16123]: Verify Document Preview Fields', async () => {
            expect(await previewDocumentLibraryPo.isFieldLabelDisplayed('Company')).toBeTruthy('FailureMsg22: field label displayed');
            expect(await previewDocumentLibraryPo.isFieldLabelDisplayed('Business Unit')).toBeTruthy('FailureMsg22: field label displayed');
            expect(await previewDocumentLibraryPo.isFieldLabelDisplayed('Department')).toBeTruthy('FailureMsg22: field label displayed');
            expect(await previewDocumentLibraryPo.isFieldLabelDisplayed('Owner Group')).toBeTruthy('FailureMsg22: field label displayed');
            expect(await previewDocumentLibraryPo.isFieldLabelDisplayed('Share Externally')).toBeTruthy('FailureMsg22: field label displayed');
            expect(await previewDocumentLibraryPo.isFieldLabelDisplayed('Keywords')).toBeTruthy('FailureMsg22: field label displayed');
            expect(await previewDocumentLibraryPo.isFieldLabelDisplayed('Tier 1')).toBeTruthy('FailureMsg22: field label displayed');
            expect(await previewDocumentLibraryPo.isFieldLabelDisplayed('Tier 2')).toBeTruthy('FailureMsg22: field label displayed');
            expect(await previewDocumentLibraryPo.isFieldLabelDisplayed('Tier 3')).toBeTruthy('FailureMsg22: field label displayed');
            expect(await previewDocumentLibraryPo.isFieldLabelDisplayed('Tier 4')).toBeTruthy('FailureMsg22: field label displayed');
            expect(await previewDocumentLibraryPo.isFieldLabelDisplayed('Region')).toBeTruthy('FailureMsg22: field label displayed');
            expect(await previewDocumentLibraryPo.isFieldLabelDisplayed('Site')).toBeTruthy('FailureMsg22: field label displayed');
            expect(await previewDocumentLibraryPo.isOperationalCategoryOrLocationFieldHeaderDisplayed('Operational Category')).toBeTruthy('FailureMsg22: field label displayed');
            expect(await previewDocumentLibraryPo.isOperationalCategoryOrLocationFieldHeaderDisplayed('Location')).toBeTruthy('FailureMsg22: field label displayed');

            expect(await previewDocumentLibraryPo.istdocNameDisplayed(docName1)).toBeTruthy('FailureMsg22: docName1 Displayed');
            expect(await previewDocumentLibraryPo.isattachmentDisplayed(attachmentFileName)).toBeTruthy('FailureMsg22: attachment file name missing');
            expect(await previewDocumentLibraryPo.isdocStatusDisplayed('Published')).toBeTruthy('FailureMsg22: Doc status missing');
            expect(await previewDocumentLibraryPo.isCompanyValueDisplayed('Petramco')).toBeTruthy('FailureMsg22: Company Value missing');
            expect(await previewDocumentLibraryPo.isShareExternallyDisplayed('False')).toBeTruthy('FailureMsg22: Share External Value is missing');
            expect(await previewDocumentLibraryPo.isBussinessUnitValueDisplayed('Canada Support')).toBeTruthy('FailureMsg22: Status KA Displayed');
            expect(await previewDocumentLibraryPo.isKeywordsDisplayed(keywordStr)).toBeTruthy('FailureMsg22: Keywords is missing');
        });

        it('[DRDMV-16123]: Verify Document with non matching Document summary Also Verify case summary  who have not access of the case', async () => {
            await searchPo.searchRecord(docName1);
            expect(await searchPo.isModuleTitleDisplayed(docName1, 'Documents (5)', documentModule)).toBeTruthy('FailureMsg47: Document module title is missing');
            expect(await searchPo.isRecordDisplayedOnLeftPannel(nonMatchingDocName, documentModule)).toBeFalsy(`FailureMsg51: ${nonMatchingDocName} Document non matching is displayed`);
            expect(await searchPo.isRecordDisplayedOnLeftPannel(nonMatchingKeyword, documentModule)).toBeFalsy(`FailureMsg51: ${nonMatchingKeyword} non Matching Keyword is displayed`);
            expect(await searchPo.isRecordDisplayedOnLeftPannel(nonAccessDocName, documentModule)).toBeFalsy(`FailureMsg55: ${nonAccessDocName} non access Document is displayed`);
        });

        it('[DRDMV-16123]: Clear search and verify record displayed on left pannel ', async () => {
            await searchPo.searchRecord(docName1);
            expect(await searchPo.isModuleTitleDisplayed(docName1, 'Documents (5)', documentModule)).toBeTruthy('FailureMsg59: Document module title is missing');
            await searchPo.clickClearSearchButton();
            expect(await searchPo.isClearSearchButtonDisplayed()).toBeFalsy('FailureMsg60: Search box is cleared and cross button gets hide');
            expect(await searchPo.isRecordDisplayedOnLeftPannel(docName1, documentModule)).toBeTruthy(`FailureMsg7: ${docName1} 5 Document is missing`);
        });

        it('[DRDMV-16123]: Verify search functionality with dummy text ', async () => {
            await searchPo.searchRecord(dummyText);
            expect(await searchPo.isRecordDisplayedOnLeftPannel(dummyText, documentModule)).toBeFalsy(`FailureMsg62: ${dummyText} dummyText  is displayed`);
            expect(await searchPo.isModuleTitleDisplayed(dummyText, 'Documents (0)', documentModule)).toBeTruthy('FailureMsg63: Document module title is missing');
            expect(await searchPo.isBlankRecordValidationDisplayedOnLeftPanel(documentModule)).toBeTruthy(`FailureMsg64: No result found validation is missing`);
        });

        it('[DRDMV-16123]: Verify search Document with assignee group ', async () => {
            await navigationPage.signOut();
            await loginPage.login('qdu');
            await navigationPage.gotoSearch();

            await searchPo.searchRecord(docName1);
            expect(await searchPo.isModuleTitleDisplayed(docName1, 'Documents (5)', documentModule)).toBeTruthy('FailureMsg2: Document module title is missing');
            expect(await searchPo.isRecordDisplayedOnLeftPannel(updatedDate, documentModule)).toBeTruthy(`${updatedDate} updatedDate is missing`);
            expect(await searchPo.isRecordDisplayedOnLeftPannel(attachmentFileName, documentModule)).toBeTruthy(`${attachmentFileName} attachment File Name is missing`);
            expect(await searchPo.isRecordDisplayedOnLeftPannel(docName1, documentModule, 1)).toBeTruthy(`FailureMsg4: ${docName1} 1 Document is missing`);
            expect(await searchPo.isRecordDisplayedOnLeftPannel(docName1, documentModule, 2)).toBeTruthy(`FailureMsg4: ${docName1} 2 Document is missing`);
            expect(await searchPo.isRecordDisplayedOnLeftPannel(docName1, documentModule, 3)).toBeTruthy(`FailureMsg5: ${docName1} 3 Document is missing`);
            expect(await searchPo.isRecordDisplayedOnLeftPannel(docName1, documentModule, 4)).toBeTruthy(`FailureMsg6: ${docName1} 4 Document is missing`);
            expect(await searchPo.isRecordDisplayedOnLeftPannel(docName1, documentModule, 5)).toBeTruthy(`FailureMsg7: ${docName1} 5 Document is missing`);
            expect(await searchPo.isRecordDisplayedOnLeftPannel(nonMatchingDocName, documentModule)).toBeFalsy(`FailureMsg4: ${nonMatchingDocName} 1 non Matching Doc Name is missing`);

            await searchPo.searchRecord(keywordStr);
            expect(await searchPo.isModuleTitleDisplayed(docName1, 'Documents (5)', documentModule)).toBeTruthy('FailureMsg2: Document module title is missing');
            expect(await searchPo.isRecordDisplayedOnLeftPannel(updatedDate, documentModule)).toBeTruthy(`${updatedDate} updatedDate is missing`);
            expect(await searchPo.isRecordDisplayedOnLeftPannel(attachmentFileName, documentModule)).toBeTruthy(`${attachmentFileName} attachment File Name is missing`);
            expect(await searchPo.isRecordDisplayedOnLeftPannel(docName1, documentModule, 1)).toBeTruthy(`FailureMsg4: ${docName1} 1 Document is missing`);
            expect(await searchPo.isRecordDisplayedOnLeftPannel(docName1, documentModule, 2)).toBeTruthy(`FailureMsg4: ${docName1} 2 Document is missing`);
            expect(await searchPo.isRecordDisplayedOnLeftPannel(docName1, documentModule, 3)).toBeTruthy(`FailureMsg5: ${docName1} 3 Document is missing`);
            expect(await searchPo.isRecordDisplayedOnLeftPannel(docName1, documentModule, 4)).toBeTruthy(`FailureMsg6: ${docName1} 4 Document is missing`);
            expect(await searchPo.isRecordDisplayedOnLeftPannel(docName1, documentModule, 5)).toBeTruthy(`FailureMsg7: ${docName1} 5 Document is missing`);

            await searchPo.searchRecord(attachmentFileName);
            expect(await searchPo.isModuleTitleDisplayed(attachmentFileName, 'Documents (7)', documentModule)).toBeTruthy('FailureMsg2: Document module title is missing');
            expect(await searchPo.isRecordDisplayedOnLeftPannel(updatedDate, documentModule)).toBeTruthy(`${updatedDate} updatedDate is missing`);
            expect(await searchPo.isRecordDisplayedOnLeftPannel(attachmentFileName, documentModule)).toBeTruthy(`${attachmentFileName} attachment File Name is missing`);
            expect(await searchPo.isRecordDisplayedOnLeftPannel(docName1, documentModule, 1)).toBeTruthy(`FailureMsg4: ${docName1} 1 Document is missing`);

            await searchPo.searchRecord(nonMatchingDocName);
            expect(await searchPo.isModuleTitleDisplayed(docName1, 'Documents (1)', documentModule)).toBeTruthy('FailureMsg2: Document module title is missing');
            expect(await searchPo.isRecordDisplayedOnLeftPannel(nonMatchingDocName, documentModule)).toBeTruthy(`FailureMsg4: ${nonMatchingDocName} 1 non Matching Doc Name is missing`);

            await searchPo.searchRecord(nonMatchingKeyword);
            expect(await searchPo.isModuleTitleDisplayed(nonMatchingKeyword, 'Documents (1)', documentModule)).toBeTruthy('FailureMsg2: Document module title is missing');
            expect(await searchPo.isRecordDisplayedOnLeftPannel(nonMatchingDocName, documentModule)).toBeTruthy(`FailureMsg4: ${nonMatchingDocName} 1 non Matching Doc Name is missing`);

            await searchPo.searchRecord(nonAccessDocName);
            expect(await searchPo.isModuleTitleDisplayed(nonAccessDocName, 'Documents (1)', documentModule)).toBeTruthy('FailureMsg2: Document module title is missing');
            expect(await searchPo.isRecordDisplayedOnLeftPannel(nonAccessDocName, documentModule)).toBeTruthy(`FailureMsg4: ${nonAccessDocName} 1 non access Doc Name is missing`);
        });

        it('[DRDMV-16123]: Verify saerch Document with other group user', async () => {
            await navigationPage.signOut();
            await loginPage.login('fritz')
            await navigationPage.gotoSearch();
            await searchPo.searchRecord(docName1);
            expect(await searchPo.isModuleTitleDisplayed(docName1, 'Documents (0)', documentModule)).toBeTruthy('FailureMsg63: Document module title is missing');
            expect(await searchPo.isBlankRecordValidationDisplayedOnLeftPanel(documentModule)).toBeTruthy(`FailureMsg64: No result found validation is missing`);

            await searchPo.searchRecord(keywordStr);
            expect(await searchPo.isModuleTitleDisplayed(keywordStr, 'Documents (0)', documentModule)).toBeTruthy('FailureMsg63: Document module title is missing');
            expect(await searchPo.isBlankRecordValidationDisplayedOnLeftPanel(documentModule)).toBeTruthy(`FailureMsg64: No result found validation is missing`);

            await searchPo.searchRecord(attachmentFileName);
            expect(await searchPo.isModuleTitleDisplayed(attachmentFileName, 'Documents (0)', documentModule)).toBeTruthy('FailureMsg63: Document module title is missing');
            expect(await searchPo.isBlankRecordValidationDisplayedOnLeftPanel(documentModule)).toBeTruthy(`FailureMsg64: No result found validation is missing`);

            await searchPo.searchRecord(nonMatchingDocName);
            expect(await searchPo.isModuleTitleDisplayed(nonMatchingDocName, 'Documents (0)', documentModule)).toBeTruthy('FailureMsg63: Document module title is missing');
            expect(await searchPo.isBlankRecordValidationDisplayedOnLeftPanel(documentModule)).toBeTruthy(`FailureMsg64: No result found validation is missing`);

            await searchPo.searchRecord(nonMatchingKeyword);
            expect(await searchPo.isModuleTitleDisplayed(nonMatchingKeyword, 'Documents (0)', documentModule)).toBeTruthy('FailureMsg63: Document module title is missing');
            expect(await searchPo.isBlankRecordValidationDisplayedOnLeftPanel(documentModule)).toBeTruthy(`FailureMsg64: No result found validation is missing`);

            await searchPo.searchRecord(nonAccessDocName);
            expect(await searchPo.isModuleTitleDisplayed(nonAccessDocName, 'Documents (0)', documentModule)).toBeTruthy('FailureMsg63: Document module title is missing');
            expect(await searchPo.isBlankRecordValidationDisplayedOnLeftPanel(documentModule)).toBeTruthy(`FailureMsg64: No result found validation is missing`);
        });

        it('[DRDMV-16123]: Verify saerch KA with other company user', async () => {
            await navigationPage.signOut();
            await loginPage.login('gderuno')
            await navigationPage.gotoSearch();
            await searchPo.searchRecord(docName1);
            expect(await searchPo.isModuleTitleDisplayed(docName1, 'Documents (0)', documentModule)).toBeTruthy('FailureMsg63: Document module title is missing');
            expect(await searchPo.isBlankRecordValidationDisplayedOnLeftPanel(documentModule)).toBeTruthy(`FailureMsg64: No result found validation is missing`);

            await searchPo.searchRecord(keywordStr);
            expect(await searchPo.isModuleTitleDisplayed(keywordStr, 'Documents (0)', documentModule)).toBeTruthy('FailureMsg63: Document module title is missing');
            expect(await searchPo.isBlankRecordValidationDisplayedOnLeftPanel(documentModule)).toBeTruthy(`FailureMsg64: No result found validation is missing`);

            await searchPo.searchRecord(attachmentFileName);
            expect(await searchPo.isModuleTitleDisplayed(attachmentFileName, 'Documents (0)', documentModule)).toBeTruthy('FailureMsg63: Document module title is missing');
            expect(await searchPo.isBlankRecordValidationDisplayedOnLeftPanel(documentModule)).toBeTruthy(`FailureMsg64: No result found validation is missing`);

            await searchPo.searchRecord(nonMatchingDocName);
            expect(await searchPo.isModuleTitleDisplayed(nonMatchingDocName, 'Documents (0)', documentModule)).toBeTruthy('FailureMsg63: Document module title is missing');
            expect(await searchPo.isBlankRecordValidationDisplayedOnLeftPanel(documentModule)).toBeTruthy(`FailureMsg64: No result found validation is missing`);

            await searchPo.searchRecord(nonMatchingKeyword);
            expect(await searchPo.isModuleTitleDisplayed(nonMatchingKeyword, 'Documents (0)', documentModule)).toBeTruthy('FailureMsg63: Document module title is missing');
            expect(await searchPo.isBlankRecordValidationDisplayedOnLeftPanel(documentModule)).toBeTruthy(`FailureMsg64: No result found validation is missing`);

            await searchPo.searchRecord(nonAccessDocName);
            expect(await searchPo.isModuleTitleDisplayed(nonAccessDocName, 'Documents (0)', documentModule)).toBeTruthy('FailureMsg63: Document module title is missing');
            expect(await searchPo.isBlankRecordValidationDisplayedOnLeftPanel(documentModule)).toBeTruthy(`FailureMsg64: No result found validation is missing`);
        });

        afterAll(async () => {
            await navigationPage.signOut();
            await loginPage.login('qtao');
        });
    });
});


