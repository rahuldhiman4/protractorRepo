import { $, browser, protractor } from "protractor";
import apiHelper from "../../api/api.helper";
import casePreviewPo from '../../pageobject/case/case-preview.po';
import loginPage from "../../pageobject/common/login.po";
import navigationPage from "../../pageobject/common/navigation.po";
import personProfilePo from '../../pageobject/common/person-profile.po';
import knowledgeArticlePreview from '../../pageobject/knowledge/preview-knowledge.po';
import viewKnowledgeArticlePo from '../../pageobject/knowledge/view-knowledge-article.po';
import searchPo from '../../pageobject/search/global-search.po';
import caseTemplatePreviewPo from '../../pageobject/settings/case-management/preview-case-template.po';
import dateTimeSelectorPo from '../../pageobject/settings/common/date-time-selector.po';
import previewDocumentLibraryPo from '../../pageobject/settings/document-management/doc-lib-preview.po';
import previewTaskTemplatePo from '../../pageobject/settings/task-management/preview-task-template.po';
import taskPreviewPo from '../../pageobject/task/task-preview.po';
import { BWF_BASE_URL } from '../../utils/constants';
import utilityCommon from '../../utils/utility.common';
import utilityGrid from '../../utils/utility.grid';

export interface IIDs {
    id: string;
    displayId: string;
}

describe('Global Search All Category', () => {
    let caseModule = "Case";
    let taskModule = "Task";
    let KAModule = "Knowledge Article";
    let caseTemplateModule = "Case Templates";
    let taskTemplateModule = "Task Templates";
    let documentModule = "Documents";
    let peopleModule = "People";
    let year: string;
    let month: string;
    let date: string;
    let updatedDate;

    beforeAll(async () => {
        await browser.get(BWF_BASE_URL);
        await loginPage.login('elizabeth');

        // Create Date
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

    //kgaikwad
    describe('[4333]: Global search with All Category', async () => {
        let randomStr = [...Array(4)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        let attachmentFilePath = 'e2e/data/ui/search/globalsearch4.pdf';
        let attachmentFileName = 'globalsearch4.pdf';

        let commonSearchForAll = '1summaryDRDMV16066' + randomStr;
        let templateName = 'summaryDRDMV16066' + randomStr;
        let activeStatus = 'Active';
        let firstName = 'Elizabeth';
        let lastName1 = 'Jeffries';
        let lastName2 = 'Peters';
        let loginId = 'ejeffries';
        let emailId = 'ejeffries@petramco.com';

        let caseGuid1;
        let caseDisplayId1 = [];
        let taskDisplayId = [];
        let kaDisplayId1 = [];
        let caseTemplateDisplayId1 = [];
        let taskTemplateDisplayId2 = [];
        let expectedVersion;
        let actualDate;


        beforeAll(async () => {
            actualDate = await viewKnowledgeArticlePo.formatDate();
            expectedVersion = "Version " + "1" + " - " + actualDate;
            await apiHelper.apiLogin('elizabeth');
        });

        it('[4333]: Create Case', async () => {
            for (let a = 0; a < 5; a++) {
                let caseDetails = await createCase(commonSearchForAll);
                caseDisplayId1[a] = caseDetails.displayId;
                caseGuid1 = caseDetails.id;
            }
        });

        it('[4333]: Create Task', async () => {
            for (let a = 0; a < 5; a++) {
                taskDisplayId[a] = await createTask(commonSearchForAll, caseGuid1);
            }
        });

        it('[4333]: Create Knowledge Article', async () => {
            await apiHelper.apiLogin('elizabeth');
            for (let a = 0; a < 5; a++) {
                await browser.sleep(1000); //Need this sleep create record with correct count and avoid skip the record from loop
                kaDisplayId1[a] = await createKnowledgeArticleWithPublish(commonSearchForAll);
            }
        });

        it('[4333]: Create Case template', async () => {
            for (let a = 1; a < 4; a++) {
                caseTemplateDisplayId1[a] = await createCaseTemplate(templateName + a, commonSearchForAll, activeStatus, 'Petramco');
            }
        });

        it('[4333]: Create Task template', async () => {
            await apiHelper.apiLogin('elizabeth');
            for (let b = 4; b < 7; b++) {
                taskTemplateDisplayId2[b] = await createTaskTemplate(templateName + b, activeStatus, 'Petramco', commonSearchForAll);
            }
        });

        it('[4333]: Create Document', async () => {
            for (let a = 1; a < 6; a++) {
                await createPublishDocumentLibrary(commonSearchForAll, attachmentFilePath);
            }
        });

        it('[4333]: Verify Case On Left Pannel', async () => {
            await navigationPage.gotoSearch();
            await searchPo.searchRecord(commonSearchForAll);
            expect(await searchPo.isCategoryDropDownSelectedValueDisplayed('All')).toBeTruthy('FailureMsg1: Default value from catergory drop down is missing');
            expect(await searchPo.isModuleTitleDisplayed(commonSearchForAll, 'Cases (5)', caseModule)).toBeTruthy('FailureMsg2: Case module title is missing');
            expect(await searchPo.isRecordDisplayedOnLeftPannel(caseDisplayId1[0], caseModule)).toBeTruthy(`FailureMsg4: ${caseDisplayId1[0]} case id  is missing`);
            expect(await searchPo.isRecordDisplayedOnLeftPannel(commonSearchForAll, caseModule)).toBeTruthy(`FailureMsg5: ${commonSearchForAll} case summary is missing`);
            expect(await searchPo.isRecordDisplayedOnLeftPannel(updatedDate, caseModule)).toBeTruthy(`${updatedDate} updatedDate is missing`);
            expect(await searchPo.isRecordDisplayedOnLeftPannel(caseDisplayId1[1], caseModule)).toBeTruthy(`FailureMsg6: ${caseDisplayId1[1]} case id  is missing`);
            expect(await searchPo.isRecordDisplayedOnLeftPannel(caseDisplayId1[2], caseModule)).toBeTruthy(`FailureMsg7: ${caseDisplayId1[2]} case id  is missing`);
            expect(await searchPo.isRecordDisplayedOnLeftPannel(caseDisplayId1[3], caseModule)).toBeTruthy(`FailureMsg8: ${caseDisplayId1[3]} case id  is missing`);
            expect(await searchPo.isRecordDisplayedOnLeftPannel(caseDisplayId1[4], caseModule)).toBeTruthy(`FailureMsg9: ${caseDisplayId1[4]} case id  is missing`);

            await searchPo.clickOnLeftPannelRecord(caseDisplayId1[0], caseModule);
        });

        it('[4333]: Verify Case Preview Fields', async () => {
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

            expect(await casePreviewPo.isCaseSummaryDisplayed(commonSearchForAll)).toBeTruthy('FailureMsg20: Case Summary is missing');
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
            expect(await casePreviewPo.isAssigneeDisplayed('Qiang Du')).toBeTruthy('FailureMsg43: Assignee Name is missing');
            expect(await casePreviewPo.getAssigneeDetails()).toContain('CA Support 1', 'FailureMsg44: Assigned Support Group Value is missing');
            expect(await casePreviewPo.getAssigneeDetails()).toContain('Petramco', 'FailureMsg45: Assigned Company Value is missing');
        });

        it('[4333]: Verify Task On Left Pannel', async () => {
            expect(await searchPo.isModuleTitleDisplayed(commonSearchForAll, 'Tasks (5)', taskModule)).toBeTruthy('FailureMsg2: Task module title is missing');
            expect(await searchPo.isRecordDisplayedOnLeftPannel(commonSearchForAll, taskModule)).toBeTruthy(`FailureMsg5: ${commonSearchForAll} Task summary is missing`);
            expect(await searchPo.isRecordDisplayedOnLeftPannel(updatedDate, taskModule)).toBeTruthy(`${updatedDate} updatedDate is missing`);
            expect(await searchPo.isRecordDisplayedOnLeftPannel(taskDisplayId[0], taskModule)).toBeTruthy(`FailureMsg4: ${taskDisplayId[0]} task id  is missing`);
            expect(await searchPo.isRecordDisplayedOnLeftPannel(taskDisplayId[1], taskModule)).toBeTruthy(`FailureMsg6: ${taskDisplayId[1]} task id  is missing`);
            expect(await searchPo.isRecordDisplayedOnLeftPannel(taskDisplayId[2], taskModule)).toBeTruthy(`FailureMsg7: ${taskDisplayId[2]} task id  is missing`);
            expect(await searchPo.isRecordDisplayedOnLeftPannel(taskDisplayId[3], taskModule)).toBeTruthy(`FailureMsg8: ${taskDisplayId[3]} task id  is missing`);
            expect(await searchPo.isRecordDisplayedOnLeftPannel(taskDisplayId[4], taskModule)).toBeTruthy(`FailureMsg9: ${taskDisplayId[4]} task id  is missing`);

            await searchPo.clickOnLeftPannelRecord(taskDisplayId[0], taskModule);
        });

        it('[4333]: Verify Task Preview Field Label', async () => {
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

            expect(await taskPreviewPo.isTaskTitleDisplayed(commonSearchForAll)).toBeTruthy('FailureMsg34: Task Title Displayed is missing');
            expect(await taskPreviewPo.isTaskIdDisplayed(taskDisplayId[0])).toBeTruthy('FailureMsg35: Task id is missing');
            expect(await taskPreviewPo.isTaskStatusDisplayed('Staged')).toBeTruthy('FailureMsg36: Task Status is missing');
            expect(await taskPreviewPo.isTaskPriorityLabelDisplayed('Medium')).toBeTruthy('FailureMsg37: Task Priority is missing');
            expect(await taskPreviewPo.isPriorityValueDisplayed('Medium')).toBeTruthy('FailureMsg38: Task Priority field value is missing');
            expect(await taskPreviewPo.isAssigneeNameDisplayed('Quies Columbcille')).toBeTruthy('FailureMsg39: Assignee Name is missing');
            expect(await taskPreviewPo.isAassignedGroupValueDisplayed('LA Support 2')).toBeTruthy('FailureMsg40: Assigned Support Group Value is missing');
        });

        it('[4333]: Verify Knowledge Article On Left Pannel', async () => {
            expect(await searchPo.isModuleTitleDisplayed(commonSearchForAll, 'Knowledge Articles (5)', KAModule)).toBeTruthy('FailureMsg2: KA module title is missing');
            expect(await searchPo.isRecordDisplayedOnLeftPannel(commonSearchForAll, KAModule)).toBeTruthy(`FailureMsg5: ${commonSearchForAll} Knowledge Article summary is missing`);
            expect(await searchPo.isRecordDisplayedOnLeftPannel(updatedDate, KAModule)).toBeTruthy(`${updatedDate} updatedDate is missing`);
            expect(await searchPo.isRecordDisplayedOnLeftPannel(kaDisplayId1[0], KAModule)).toBeTruthy(`FailureMsg4: ${kaDisplayId1[0]} Knowledge Article id  is missing`);
            expect(await searchPo.isRecordDisplayedOnLeftPannel(kaDisplayId1[1], KAModule)).toBeTruthy(`FailureMsg6: ${kaDisplayId1[1]} Knowledge Article id  is missing`);
            expect(await searchPo.isRecordDisplayedOnLeftPannel(kaDisplayId1[2], KAModule)).toBeTruthy(`FailureMsg7: ${kaDisplayId1[2]} Knowledge Article id  is missing`);
            expect(await searchPo.isRecordDisplayedOnLeftPannel(kaDisplayId1[3], KAModule)).toBeTruthy(`FailureMsg8: ${kaDisplayId1[3]} Knowledge Article id  is missing`);
            expect(await searchPo.isRecordDisplayedOnLeftPannel(kaDisplayId1[4], KAModule)).toBeTruthy(`FailureMsg9: ${kaDisplayId1[4]} Knowledge Article id  is missing`);

            await searchPo.clickOnLeftPannelRecord(kaDisplayId1[0], KAModule);
        });

        it('[4333]: Verify Knowledge Article Preview Fields', async () => {
            expect(await knowledgeArticlePreview.isFieldLabelDisplayed('Question')).toBeTruthy('FailureMsg22: field label displayed');
            expect(await knowledgeArticlePreview.isFieldLabelDisplayed('Answer')).toBeTruthy('FailureMsg22: field label displayed');
            expect(await knowledgeArticlePreview.isFieldLabelDisplayed('Technical Notes')).toBeTruthy('FailureMsg22: field label displayed');
            expect(await knowledgeArticlePreview.getArticleVersion()).toBe(expectedVersion, 'FailureMsg23: version 1 is missing on KA preview')

            expect(await knowledgeArticlePreview.getKnowledgeArticleTitle()).toBe(commonSearchForAll, 'FailureMsg20: knowledge article title');
            expect(await knowledgeArticlePreview.getKnowledgeArticleID()).toContain(kaDisplayId1[0], 'FailureMsg21: get knowledge Article id');
            expect(await knowledgeArticlePreview.isStatusOfKADisplay()).toBeTruthy('FailureMsg22: Status KA Displayed');
            expect(await knowledgeArticlePreview.getKnowledgeArticleSection()).toBe('article versioning test description', 'FailureMsg23: description is missing');
        });

        it('[4333]: Verify Case Template On Left Pannel', async () => {
            expect(await searchPo.isModuleTitleDisplayed(commonSearchForAll, 'Case Templates (3)', caseTemplateModule)).toBeTruthy('FailureMsg2: Case module title is missing');
            expect(await searchPo.isRecordDisplayedOnLeftPannel(caseTemplateDisplayId1[1], caseTemplateModule)).toBeTruthy(`FailureMsg4: ${caseTemplateDisplayId1[0]} case id  is missing`);
            expect(await searchPo.isRecordDisplayedOnLeftPannel(templateName + '1', caseTemplateModule)).toBeTruthy(`FailureMsg5: ${templateName + '1'} case title summary is missing`);
            expect(await searchPo.isRecordDisplayedOnLeftPannel(updatedDate, caseTemplateModule)).toBeTruthy(`${updatedDate} updatedDate is missing`);
            expect(await searchPo.isRecordDisplayedOnLeftPannel(caseTemplateDisplayId1[2], caseTemplateModule)).toBeTruthy(`FailureMsg6: ${caseTemplateDisplayId1[1]} case id  is missing`);
            expect(await searchPo.isRecordDisplayedOnLeftPannel(caseTemplateDisplayId1[3], caseTemplateModule)).toBeTruthy(`FailureMsg7: ${caseTemplateDisplayId1[2]} case id  is missing`);

            await searchPo.clickOnLeftPannelRecord(caseTemplateDisplayId1[1], caseTemplateModule);
        });

        it('[4333]: Verify Case Template Preview Fields', async () => {
            expect(await caseTemplatePreviewPo.isCaseSummaryHeaderDisplayed('Case Summary')).toBeTruthy('FailureMsg20: Case Summary label is missing');
            expect(await caseTemplatePreviewPo.isCaseStatusTitleDisplayed('Case Status')).toBeTruthy('FailureMsg21: Case Status label is missing');
            expect(await caseTemplatePreviewPo.isCasePriorityTitleDisplayed('Case Priority')).toBeTruthy('FailureMsg22: Case Priority label is missing');
            expect(await caseTemplatePreviewPo.isFlowsetTitleDisplayed('Flowset')).toBeTruthy('FailureMsg23: Flowset label is missing');
            expect(await caseTemplatePreviewPo.isLabelTitleDisplayed('Label')).toBeTruthy('FailureMsg24: Label field label is missing');
            expect(await caseTemplatePreviewPo.isCaseCompanyTitleDisplayed('Case Company')).toBeTruthy('FailureMsg25: Case Company label is missing');
            expect(await caseTemplatePreviewPo.isCaseCategoryTier1TitleDisplayed('Category Tier 1')).toBeTruthy('Category Tier 1 is not getting displayed');
            expect(await caseTemplatePreviewPo.isCaseCategoryTier2TitleDisplayed('Category Tier 2')).toBeTruthy('Category Tier 2 is not getting displayed');
            expect(await caseTemplatePreviewPo.isCaseCategoryTier3TitleDisplayed('Category Tier 3')).toBeTruthy('Category Tier 3 is not getting displayed');
            expect(await caseTemplatePreviewPo.isCaseCategoryTier4TitleDisplayed('Category Tier 4')).toBeTruthy('Category Tier 4 is not getting displayed');
            expect(await caseTemplatePreviewPo.isCaseDescriptionTitleDisplayed('Case Description')).toBeTruthy('FailureMsg29: Case Description label is missing');
            expect(await caseTemplatePreviewPo.isAssigneeTitleDisplayed()).toBeTruthy('FailureMsg29: Assignee label is missing');
            expect(await caseTemplatePreviewPo.isSupportGroupTitleDisplayed('Support Company > Support Organization > Support Group')).toBeTruthy('FailureMsg30: Support Company > Support Organization > Support Group label is missing');
            expect(await caseTemplatePreviewPo.getCaseTemplateName()).toBe(templateName + 1, 'FailureMsg20: Case template title is missing');
            expect(await caseTemplatePreviewPo.getCaseSummary()).toBe(commonSearchForAll, 'FailureMsg20: Case Summary is missing');
            expect(await caseTemplatePreviewPo.getCasePriority()).toBe('Low', 'FailureMsg33: Case priority is missing');
            expect(await caseTemplatePreviewPo.getCaseCompanyValue()).toBe('Petramco', 'FailureMsg34: Case company is missing');
            expect(await caseTemplatePreviewPo.isCaseCategoryTier1ValueDisplayed('Applications')).toBeTruthy('FailureMsg35: catergoy tier 1 is missing');
            expect(await caseTemplatePreviewPo.isCaseCategoryTier2ValueDisplayed('Social')).toBeTruthy('FailureMsg36: catergoy tier 2 missing');
            expect(await caseTemplatePreviewPo.isCaseCategoryTier3ValueDisplayed('Chatter')).toBeTruthy('FailureMsg37: catergoy tier 3 is missing');
            expect(await caseTemplatePreviewPo.isAssigneeNameDisplayed('Qiang Du')).toBeTruthy('FailureMsg39: Assignee is missing');
            expect(await caseTemplatePreviewPo.isSupportGroupNameDisplayed('CA Support 1')).toBeTruthy('FailureMsg40: support group is missing');
            expect(await caseTemplatePreviewPo.isSupportCompanyNameDisplayed('Petramco')).toBeTruthy('FailureMsg41: Source Value is missing');
        });

        it('[4333]: Verify Task Template On Left Pannel', async () => {
            expect(await searchPo.isModuleTitleDisplayed(commonSearchForAll, 'Task Templates (3)', taskTemplateModule)).toBeTruthy('FailureMsg2: Task module title is missing');
            expect(await searchPo.isRecordDisplayedOnLeftPannel(taskTemplateDisplayId2[4], taskTemplateModule)).toBeTruthy(`FailureMsg4: ${taskTemplateDisplayId2[4]} task id  is missing`);
            expect(await searchPo.isRecordDisplayedOnLeftPannel(templateName + 4, taskTemplateModule)).toBeTruthy(`FailureMsg5: ${templateName + 4} task Template2 summary is missing`);
            expect(await searchPo.isRecordDisplayedOnLeftPannel(templateName + 5, taskTemplateModule)).toBeTruthy(`FailureMsg5: ${templateName + 5} task Template2 summary is missing`);
            expect(await searchPo.isRecordDisplayedOnLeftPannel(templateName + 6, taskTemplateModule)).toBeTruthy(`FailureMsg5: ${templateName + 6} task Template2 summary is missing`);
            expect(await searchPo.isRecordDisplayedOnLeftPannel(updatedDate, taskTemplateModule)).toBeTruthy(`${updatedDate} updatedDate is missing`);
            expect(await searchPo.isRecordDisplayedOnLeftPannel(taskTemplateDisplayId2[5], taskTemplateModule)).toBeTruthy(`FailureMsg6: ${taskTemplateDisplayId2[5]} task id  is missing`);
            expect(await searchPo.isRecordDisplayedOnLeftPannel(taskTemplateDisplayId2[6], taskTemplateModule)).toBeTruthy(`FailureMsg7: ${taskTemplateDisplayId2[6]} task id  is missing`);

            await searchPo.clickOnLeftPannelRecord(taskTemplateDisplayId2[4], taskTemplateModule);
        });

        it('[4333]: Verify Task Template Preview Fields', async () => {
            expect(await previewTaskTemplatePo.isTaskSummaryTitleDisplayed('Task Summary')).toBeTruthy('FailureMsg20: Task Summary label is missing');
            expect(await previewTaskTemplatePo.isTaskTypeTitleDisplayed('Task Type')).toBeTruthy('FailureMsg21: Task Type label is missing');
            expect(await previewTaskTemplatePo.isTaskPriorityTitleDisplayed('Task Priority')).toBeTruthy('FailureMsg22: Task Priority label is missing');
            expect(await previewTaskTemplatePo.isLabelTitleDisplayed('Label')).toBeTruthy('FailureMsg24: Label field label is missing');
            expect(await previewTaskTemplatePo.isTaskCompanyTitleDisplayed('Task Company')).toBeTruthy('FailureMsg25: Task Company label is missing');
            expect(await previewTaskTemplatePo.isTaskCategoryTier1TitleDisplayed('Task Category Tier 1')).toBeTruthy('FailureMsg28: Category Tier 1 label is missing');
            expect(await previewTaskTemplatePo.isTaskCategoryTier2TitleDisplayed('Task Category Tier 2')).toBeTruthy('FailureMsg26: Category Tier 2 label is missing');
            expect(await previewTaskTemplatePo.isTaskCategoryTier3TitleDisplayed('Task Category Tier 3')).toBeTruthy('FailureMsg27: Category Tier 3 label is missing');
            expect(await previewTaskTemplatePo.isTaskCategoryTier4TitleDisplayed('Task Category Tier 4')).toBeTruthy('FailureMsg27: Category Tier 3 label is missing');
            expect(await previewTaskTemplatePo.isTaskDescriptionTitleDisplayed()).toBeTruthy('FailureMsg29: Task Description label is missing');
            expect(await previewTaskTemplatePo.isAssigneeTitleDisplayed('Assignee')).toBeTruthy('FailureMsg29: Assignee label is missing');
            expect(await previewTaskTemplatePo.isSupportGroupTitleDisplayed('Support Company > Support Organization > Support Group')).toBeTruthy('FailureMsg31: Support Company > Support Organization > Support Group label is missing');


            expect(await previewTaskTemplatePo.getTaskTemplateName()).toBe(templateName + 4, 'FailureMsg20: Task template title is missing');
            expect(await previewTaskTemplatePo.getTaskSummary()).toBe('TemplateSummary', 'FailureMsg20: Task Summary is missing');
            expect(await previewTaskTemplatePo.getTaskPriority()).toBe('Medium', 'FailureMsg33: Task priority is missing');
            expect(await previewTaskTemplatePo.getTaskCompany()).toBe('Petramco', 'FailureMsg34: Task company is missing');
            expect(await previewTaskTemplatePo.getAssigneeText()).toBe('Qiang Du', 'FailureMsg39: Assignee is missing');
            expect(await previewTaskTemplatePo.getSupportGroup()).toBe('Petramco > Canada Support > CA Support 1', 'FailureMsg40: support group is missing');
        });

        it('[4333]: Verify Document On Left Pannel ', async () => {
            await 
            expect(await searchPo.isModuleTitleDisplayed(commonSearchForAll, 'Documents (5)', documentModule)).toBeTruthy('FailureMsg2: Document module title is missing');
            expect(await searchPo.isRecordDisplayedOnLeftPannel(updatedDate, documentModule)).toBeTruthy(`${updatedDate} updatedDate is missing`);
            expect(await searchPo.isRecordDisplayedOnLeftPannel(attachmentFileName, documentModule)).toBeTruthy(`${attachmentFileName} attachment File Name is missing`);
            expect(await searchPo.isRecordDisplayedOnLeftPannel(commonSearchForAll, documentModule, 1)).toBeTruthy(`FailureMsg4: ${commonSearchForAll} 1 Document is missing`);
            expect(await searchPo.isRecordDisplayedOnLeftPannel(commonSearchForAll, documentModule, 2)).toBeTruthy(`FailureMsg4: ${commonSearchForAll} 2 Document is missing`);
            expect(await searchPo.isRecordDisplayedOnLeftPannel(commonSearchForAll, documentModule, 3)).toBeTruthy(`FailureMsg5: ${commonSearchForAll} 3 Document is missing`);
            expect(await searchPo.isRecordDisplayedOnLeftPannel(commonSearchForAll, documentModule, 4)).toBeTruthy(`FailureMsg6: ${commonSearchForAll} 4 Document is missing`);
            expect(await searchPo.isRecordDisplayedOnLeftPannel(commonSearchForAll, documentModule, 5)).toBeTruthy(`FailureMsg7: ${commonSearchForAll} 5 Document is missing`);

            await searchPo.clickOnLeftPannelRecord(commonSearchForAll, documentModule);
        });

        it('[4333]: Verify Document Preview', async () => {
            expect(await previewDocumentLibraryPo.isFieldLabelDisplayed('Company')).toBeTruthy('FailureMsg22: field label displayed');
            expect(await previewDocumentLibraryPo.isFieldLabelDisplayed('Support Organization')).toBeTruthy('FailureMsg22: field label displayed');
            expect(await previewDocumentLibraryPo.isFieldLabelDisplayed('Owner Group')).toBeTruthy('FailureMsg22: field label displayed');
            expect(await previewDocumentLibraryPo.isFieldLabelDisplayed('Share Externally')).toBeTruthy('FailureMsg22: field label displayed');
            expect(await previewDocumentLibraryPo.isFieldLabelDisplayed('Keywords')).toBeTruthy('FailureMsg22: field label displayed');
            expect(await previewDocumentLibraryPo.isFieldLabelDisplayed('Tier 1')).toBeTruthy('FailureMsg22: field label displayed');
            expect(await previewDocumentLibraryPo.isFieldLabelDisplayed('Tier 2')).toBeTruthy('FailureMsg22: field label displayed');
            expect(await previewDocumentLibraryPo.isFieldLabelDisplayed('Tier 3')).toBeTruthy('FailureMsg22: field label displayed');
            expect(await previewDocumentLibraryPo.isFieldLabelDisplayed('Tier 4')).toBeTruthy('FailureMsg22: field label displayed');
            expect(await previewDocumentLibraryPo.isFieldLabelDisplayed('Region')).toBeTruthy('FailureMsg22: field label displayed');
            expect(await previewDocumentLibraryPo.isFieldLabelDisplayed('Site')).toBeTruthy('FailureMsg22: field label displayed');
            expect(await previewDocumentLibraryPo.isDataDisplayed('OperationalCategory', 'Operational Category')).toBeTruthy('FailureMsg22: field label displayed');
            expect(await previewDocumentLibraryPo.isDataDisplayed('Location', 'Location')).toBeTruthy('FailureMsg22: field label displayed');

            expect(await previewDocumentLibraryPo.isDataDisplayed('DocumentName', commonSearchForAll)).toBeTruthy('FailureMsg23: summary1 Displayed');
            expect(await previewDocumentLibraryPo.isDataDisplayed('Attachment', attachmentFileName)).toBeTruthy('FailureMsg24: attachment file name missing');
            expect(await previewDocumentLibraryPo.isDataDisplayed('DocumentStatus', 'Published')).toBeTruthy('FailureMsg25: Doc status missing');
            expect(await previewDocumentLibraryPo.isDataDisplayed('Company', 'Petramco')).toBeTruthy('FailureMsg26: Company Value missing');
            expect(await previewDocumentLibraryPo.isDataDisplayed('ShareExternally', 'False')).toBeTruthy('FailureMsg27: Share External Value is missing');
            expect(await previewDocumentLibraryPo.isDataDisplayed('SupportOrganization', 'Canada Support')).toBeTruthy('FailureMsg28: Status KA Displayed');
            expect(await previewDocumentLibraryPo.isDataDisplayed('OwnerGroup', 'CA Support 1')).toBeTruthy('FailureMsg29: Status KA Displayed');
        });

        it('[4333]: Verify People On Left Pannel', async () => {
            await searchPo.searchRecord(firstName);
            expect(await searchPo.isModuleTitleDisplayed(firstName, 'People (2)', peopleModule)).toBeTruthy('FailureMsg2: People module title is missing');
            expect (await searchPo.getDateFormateOnLeftPannel('People',1)).toContain(year);
            expect(await searchPo.isRecordDisplayedOnLeftPannel(emailId, peopleModule, 1)).toBeTruthy(`${emailId} emailId is missing`);
            expect(await searchPo.isRecordDisplayedOnLeftPannel(`${firstName} ${lastName1}`, peopleModule)).toBeTruthy(`FailureMsg4: ${firstName} ${lastName1} 1 Person Name is missing`);
            expect(await searchPo.isRecordDisplayedOnLeftPannel(`${firstName} ${lastName2}`, peopleModule)).toBeTruthy(`FailureMsg5: ${firstName} ${lastName2} 2 Person Name is missing`);

            await searchPo.clickOnLeftPannelRecord(`${firstName} ${lastName1}`, peopleModule);
        });

        it('[4333]: Verify People Preview Fields', async () => {
            expect(await personProfilePo.isFieldLabelDisplayed('Employee')).toBeTruthy('FailureMsg22: field label displayed');
            expect(await personProfilePo.isFieldLabelDisplayed('Job Title')).toBeTruthy('FailureMsg22: field label displayed');
            expect(await personProfilePo.isFieldLabelDisplayed('Corporate ID')).toBeTruthy('FailureMsg22: field label displayed');
            expect(await personProfilePo.isFieldLabelDisplayed('Client Type')).toBeTruthy('FailureMsg22: field label displayed');
            expect(await personProfilePo.isFieldLabelDisplayed('Login ID')).toBeTruthy('FailureMsg22: field label displayed');
            expect(await personProfilePo.isFieldLabelDisplayed('Functional Roles')).toBeTruthy('FailureMsg22: field label displayed');
            expect(await personProfilePo.isFieldLabelDisplayed('Site')).toBeTruthy('FailureMsg22: field label displayed');

            expect(await personProfilePo.getPersonName()).toBe(`${firstName} ${lastName1}`, 'FailureMsg22: first Name is missing');
            expect(await personProfilePo.getCompany()).toBe('Petramco', 'FailureMsg22: company name is missing');
            expect(await personProfilePo.getLoginID()).toContain(loginId, 'FailureMsg22: Login id is missing');
            expect(await personProfilePo.getEmail()).toBe(emailId, 'FailureMsg22: emailId is missing');
            await personProfilePo.clickOnTab('Related Persons');
            await personProfilePo.clickOnTab('Requested Cases');
            await personProfilePo.clickOnTab('Assigned Cases');
            await personProfilePo.clickOnTab('Support Groups');
            await personProfilePo.clickOnTab('Related Cases');

            await searchPo.searchRecord(lastName1);
            expect(await searchPo.isModuleTitleDisplayed(firstName, 'People (2)', peopleModule)).toBeTruthy('FailureMsg2: People module title is missing');
            expect (await searchPo.getDateFormateOnLeftPannel('People',1)).toContain(year);
            expect(await searchPo.isRecordDisplayedOnLeftPannel(emailId, peopleModule, 1)).toBeTruthy(`${emailId} emailId is missing`);
            expect(await searchPo.isRecordDisplayedOnLeftPannel(`${firstName} ${lastName1}`, peopleModule)).toBeTruthy(`FailureMsg4: ${firstName} ${lastName1} 1 Person Name is missing`);
        });
    });

    //kgaikwad
    describe('[4147]: Search filters on Global search', async () => {
        let randomStr = [...Array(4)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        let attachmentFilePath = 'e2e/data/ui/search/globalsearch1.pdf';
        let caseSummary = '1caseSummaryDRDMV16881' + randomStr;
        let caseDescription = 'caseDescriptionDRDMV16881' + randomStr;
        let taskSummary = '1taskSummaryDRDMV16881' + randomStr;
        let taskDescription = 'taskDescriptionDRDMV16881' + randomStr;
        let caseTemplateName = 'caseTemplateDRDMV16881' + randomStr;
        let caseTemplateSummary = 'caseTemplateSummaryDRDMV16881' + randomStr;
        let taskTemplateName = 'taskTemplateDRDMV16881' + randomStr;
        let knowledgeTitle = 'knowledgeTitleDRDMV16881' + randomStr;
        let documentName = 'documentNameDRDMV16881' + randomStr;
        let firstName = 'Qadim';
        let lastName = 'Katawazi';
        let caseDisplayId;
        let taskDisplayId;
        let caseTemplateDisplayId;
        let taskTemplateDisplayId;
        let kaDisplayId;
        let caseDetails;
        let currentfinalDate;
        let createdDate;
        let modifiedDate;
        beforeAll(async () => {

            let year: string, month: string, date: string, finalDate;
            let objDate: Date = new Date();
            let numYear: number = objDate.getFullYear();
            year = new Number(numYear).toString();
            let numMonth: number = objDate.getMonth() + 1;
            let month1 = new Number(numMonth);
            if (month1 <= 9) month = '0' + month1.toString();
            else month = month1.toString();
            let numDate: number = objDate.getDate();
            let date1 = new Number(numDate);
            if (date1 <= 9) date = '0' + date1.toString();
            else date = date1.toString();
            currentfinalDate = date + '/' + month + '/' + year;
            createdDate = `Created Date: ${currentfinalDate} 12:10:00 AM - ${currentfinalDate} 11:50:00 PM`;
            modifiedDate = `Modified Date: ${currentfinalDate} 12:10:00 AM - ${currentfinalDate} 11:50:00 PM`;

            await apiHelper.apiLogin('elizabeth');
            // Create Case
            caseDetails = await createCase(caseSummary, caseDescription);
            caseDisplayId = caseDetails.displayId;

            // Create Task
            taskDisplayId = await createTask(taskSummary, caseDetails.id, taskDescription);

            // Create Case Template
            caseTemplateDisplayId = await createCaseTemplate(caseTemplateName, caseTemplateSummary, 'Active', 'Petramco');

            // Create Task Template
            taskTemplateDisplayId = await createTaskTemplate(taskTemplateName, 'Active', 'Petramco');

            // Create Knowledge Article
            kaDisplayId = await createKnowledgeArticleWithPublish(knowledgeTitle);

            // Create Document Library
            await createPublishDocumentLibrary(documentName, attachmentFilePath);
        });

        it('[4147]: Verify Recent With Case Summary And Descripiton And Check Is Duplicates Case Summary', async () => {
            await navigationPage.gotoSearch();
            expect(await searchPo.isCategoryDropDownSelectedValueDisplayed('All')).toBeTruthy('FailureMsg1: Default value from catergory drop down is missing');
            await utilityGrid.clickFilterField("Created Date");
            await dateTimeSelectorPo.selectTimeToggle();

            await dateTimeSelectorPo.setHour('12');
            await dateTimeSelectorPo.setMinute(1);
            await dateTimeSelectorPo.clickMeridianValue("AM");

            await dateTimeSelectorPo.clickEndDateTab();
            await dateTimeSelectorPo.setHour('11');
            await dateTimeSelectorPo.setMinute(59);
            await dateTimeSelectorPo.clickMeridianValue("PM");
            await $('body').sendKeys(protractor.Key.ESCAPE);

            expect(await searchPo.getDate()).toBe(createdDate, 'Created Date is missing');
        });

        it('[4147]: Verify Modules With Created Date', async () => {
            // Verify Case
            await searchPo.searchRecord(caseSummary);
            expect(await searchPo.isModuleTitleDisplayed(caseSummary, 'Cases (1)', caseModule)).toBeTruthy('FailureMsg2: Cases module title is missing');
            expect(await searchPo.isRecordDisplayedOnLeftPannel(caseDisplayId, caseModule)).toBeTruthy(`FailureMsg6: ${caseDisplayId[1]} case id  is missing`);

            // Verify Task
            await searchPo.searchRecord(taskSummary);
            expect(await searchPo.isModuleTitleDisplayed(taskSummary, 'Tasks (1)', taskModule)).toBeTruthy('FailureMsg2: Task module title is missing');
            expect(await searchPo.isRecordDisplayedOnLeftPannel(taskSummary, taskModule)).toBeTruthy(`FailureMsg5: ${taskSummary} Task summary is missing`);
            expect(await searchPo.isRecordDisplayedOnLeftPannel(taskDisplayId, taskModule)).toBeTruthy(`FailureMsg6: ${taskDisplayId[1]} task id  is missing`);

            // Verify Case Template Name
            await searchPo.searchRecord(caseTemplateName);
            expect(await searchPo.isModuleTitleDisplayed(caseTemplateName, 'Case Templates (1)', caseTemplateModule)).toBeTruthy('FailureMsg2: Case module title is missing');
            expect(await searchPo.isRecordDisplayedOnLeftPannel(caseTemplateDisplayId, caseTemplateModule)).toBeTruthy(`FailureMsg4: ${caseTemplateDisplayId} caseTemplateDisplayId  is missing`);

            // Verify Task Template Name
            await searchPo.searchRecord(taskTemplateName);
            expect(await searchPo.isModuleTitleDisplayed(taskTemplateName, 'Task Templates (1)', taskTemplateModule)).toBeTruthy('FailureMsg2: Case module title is missing');
            expect(await searchPo.isRecordDisplayedOnLeftPannel(taskTemplateDisplayId, taskTemplateModule)).toBeTruthy(`FailureMsg4: ${taskTemplateDisplayId} taskTemplateDisplayId  is missing`);

            // Verify Knowledge Article
            await searchPo.searchRecord(knowledgeTitle);
            expect(await searchPo.isModuleTitleDisplayed(knowledgeTitle, 'Knowledge Articles (1)', KAModule)).toBeTruthy('FailureMsg2: KA module title is missing');
            expect(await searchPo.isRecordDisplayedOnLeftPannel(kaDisplayId, KAModule)).toBeTruthy(`FailureMsg4: ${kaDisplayId} Knowledge Article id  is missing`);

            // Verify Document Stored
            await searchPo.searchRecord(documentName);
            expect(await searchPo.isModuleTitleDisplayed(documentName, 'Documents (1)', documentModule)).toBeTruthy('FailureMsg2: Document module title is missing');
            expect(await searchPo.isRecordDisplayedOnLeftPannel(documentName, documentModule, 1)).toBeTruthy(`FailureMsg4: ${documentName} 1 Document is missing`);

            await searchPo.closeFilterDateLabel();
            // Verify People With FirstName
            await searchPo.searchRecord(firstName);
            expect(await searchPo.isModuleTitleDisplayed(firstName, 'People (1)', peopleModule)).toBeTruthy('FailureMsg2: People module title is missing');
            expect(await searchPo.isRecordDisplayedOnLeftPannel(`${firstName} ${lastName}`, peopleModule)).toBeTruthy(`FailureMsg4: ${firstName} ${lastName} 1 Person Name is missing`);
        });

        it('[4147]: Verify Modules With Change to Modified Date', async () => {
            await utilityGrid.clickFilterField("Modified Date");
            await dateTimeSelectorPo.selectTimeToggle();
            await dateTimeSelectorPo.setHour('12');
            await dateTimeSelectorPo.setMinute(1);
            await dateTimeSelectorPo.clickMeridianValue("AM");

            await dateTimeSelectorPo.clickEndDateTab();
            await dateTimeSelectorPo.setHour('11');
            await dateTimeSelectorPo.setMinute(59);
            await dateTimeSelectorPo.clickMeridianValue("PM");
            await $('body').sendKeys(protractor.Key.ESCAPE);
            expect(await searchPo.getDate()).toBe(modifiedDate, 'Modified Date is missing');

            // Verify Case
            await searchPo.searchRecord(caseSummary);
            expect(await searchPo.isModuleTitleDisplayed(caseSummary, 'Cases (1)', caseModule)).toBeTruthy('FailureMsg2: Cases module title is missing');
            expect(await searchPo.isRecordDisplayedOnLeftPannel(caseDisplayId, caseModule)).toBeTruthy(`FailureMsg6: ${caseDisplayId[1]} case id  is missing`);

            // Verify Task
            await searchPo.searchRecord(taskSummary);
            expect(await searchPo.isModuleTitleDisplayed(taskSummary, 'Tasks (1)', taskModule)).toBeTruthy('FailureMsg2: Task module title is missing');
            expect(await searchPo.isRecordDisplayedOnLeftPannel(taskSummary, taskModule)).toBeTruthy(`FailureMsg5: ${taskSummary} Task summary is missing`);
            expect(await searchPo.isRecordDisplayedOnLeftPannel(taskDisplayId, taskModule)).toBeTruthy(`FailureMsg6: ${taskDisplayId[1]} task id  is missing`);

            // Verify Case Template Name
            await searchPo.searchRecord(caseTemplateName);
            expect(await searchPo.isModuleTitleDisplayed(caseTemplateName, 'Case Templates (1)', caseTemplateModule)).toBeTruthy('FailureMsg2: Case module title is missing');
            expect(await searchPo.isRecordDisplayedOnLeftPannel(caseTemplateDisplayId, caseTemplateModule)).toBeTruthy(`FailureMsg4: ${caseTemplateDisplayId} caseTemplateDisplayId  is missing`);

            // Verify Task Template Name
            await searchPo.searchRecord(taskTemplateName);
            expect(await searchPo.isModuleTitleDisplayed(taskTemplateName, 'Task Templates (1)', taskTemplateModule)).toBeTruthy('FailureMsg2: Case module title is missing');
            expect(await searchPo.isRecordDisplayedOnLeftPannel(taskTemplateDisplayId, taskTemplateModule)).toBeTruthy(`FailureMsg4: ${taskTemplateDisplayId} taskTemplateDisplayId  is missing`);

            // Verify Knowledge Article
            await searchPo.searchRecord(knowledgeTitle);
            expect(await searchPo.isModuleTitleDisplayed(knowledgeTitle, 'Knowledge Articles (1)', KAModule)).toBeTruthy('FailureMsg2: KA module title is missing');
            expect(await searchPo.isRecordDisplayedOnLeftPannel(kaDisplayId, KAModule)).toBeTruthy(`FailureMsg4: ${kaDisplayId} Knowledge Article id  is missing`);

            // Verify Document Stored
            await searchPo.searchRecord(documentName);
            expect(await searchPo.isModuleTitleDisplayed(documentName, 'Documents (1)', documentModule)).toBeTruthy('FailureMsg2: Document module title is missing');
            expect(await searchPo.isRecordDisplayedOnLeftPannel(documentName, documentModule, 1)).toBeTruthy(`FailureMsg4: ${documentName} 1 Document is missing`);

            // Verify People With FirstName
            await searchPo.closeFilterDateLabel();
            await searchPo.searchRecord(firstName);
            expect(await searchPo.isModuleTitleDisplayed(firstName, 'People (1)', peopleModule)).toBeTruthy('FailureMsg2: People module title is missing');
            expect(await searchPo.isRecordDisplayedOnLeftPannel(`${firstName} ${lastName}`, peopleModule)).toBeTruthy(`FailureMsg4: ${firstName} ${lastName} 1 Person Name is missing`);
        });
    });
});
