import { browser } from "protractor";
import apiHelper from "../../api/api.helper";
import loginPage from "../../pageobject/common/login.po";
import navigationPage from "../../pageobject/common/navigation.po";
import searchPo from '../../pageobject/search/global-search.po';
import caseTemplatePreviewPo from '../../pageobject/settings/case-management/preview-case-template.po';
import previewDocumentLibraryPo from '../../pageobject/settings/document-management/doc-lib-preview.po';
import previewTaskTemplatePo from '../../pageobject/settings/task-management/preview-task-template.po';
import { BWF_BASE_URL } from '../../utils/constants';
import utilityCommon from '../../utils/utility.common';
import utilityGrid from "../../utils/utility.grid";

export interface IIDs {
    id: string;
    displayId: string;
}

describe('Global Search Template', () => {
    let caseTemplateModule = "Case Templates";
    let taskTemplateModule = "Task Templates";
    let documentModule = "Documents";
    let updatedDate;

    beforeAll(async () => {
        await browser.get(BWF_BASE_URL);
        await loginPage.login('qkatawazi');
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
    describe('[4295]: Global search with only Case Template Category', async () => {
        let randomStr = [...Array(4)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        let templateName = 'summaryDRDMV16116' + randomStr;
        let description = 'descriptionDRDMV16116' + randomStr;
        let summary1 = '1summaryDRDMV16116' + randomStr;
        let summary2 = '2summaryDRDMV16116' + randomStr;
        let summary3 = '3summaryDRDMV16116' + randomStr;
        let summary4 = '4summaryDRDMV16116' + randomStr;
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

        it('[4295]: Verify Module Title, Summary & Description', async () => {
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
            expect(await searchPo.isRecordDisplayedOnLeftPannel(updatedDate, caseTemplateModule)).toBeTruthy(`${updatedDate} updatedDate is missing`);
            expect(await searchPo.isRecordDisplayedOnLeftPannel(caseTemplateDisplayId1[2], caseTemplateModule)).toBeTruthy(`FailureMsg6: ${caseTemplateDisplayId1[1]} case id  is missing`);
            expect(await searchPo.isRecordDisplayedOnLeftPannel(caseTemplateDisplayId1[3], caseTemplateModule)).toBeTruthy(`FailureMsg7: ${caseTemplateDisplayId1[2]} case id  is missing`);

            // // Verify with case template desscription
            await searchPo.searchRecord(description);
            expect(await searchPo.isModuleTitleDisplayed(description, 'Case Templates (3)', caseTemplateModule)).toBeTruthy('FailureMsg2: Case module title is missing');
            expect(await searchPo.isRecordDisplayedOnLeftPannel(caseTemplateDisplayId2[4], caseTemplateModule)).toBeTruthy(`FailureMsg4: ${caseTemplateDisplayId1[0]} case id  is missing`);
            expect(await searchPo.isRecordDisplayedOnLeftPannel(templateName + 4, caseTemplateModule)).toBeTruthy(`FailureMsg5: ${summary2} case Template2 summary is missing`);
            expect(await searchPo.isRecordDisplayedOnLeftPannel(templateName + 5, caseTemplateModule)).toBeTruthy(`FailureMsg5: ${summary2} case Template2 summary is missing`);
            expect(await searchPo.isRecordDisplayedOnLeftPannel(templateName + 6, caseTemplateModule)).toBeTruthy(`FailureMsg5: ${summary2} case Template2 summary is missing`);
            expect(await searchPo.isRecordDisplayedOnLeftPannel(updatedDate, caseTemplateModule)).toBeTruthy(`${updatedDate} updatedDate is missing`);
            expect(await searchPo.isRecordDisplayedOnLeftPannel(caseTemplateDisplayId2[5], caseTemplateModule)).toBeTruthy(`FailureMsg6: ${caseTemplateDisplayId1[1]} case id  is missing`);
            expect(await searchPo.isRecordDisplayedOnLeftPannel(caseTemplateDisplayId2[6], caseTemplateModule)).toBeTruthy(`FailureMsg7: ${caseTemplateDisplayId1[2]} case id  is missing`);

            await searchPo.clickOnLeftPannelRecord(caseTemplateDisplayId2[4], caseTemplateModule);
        });

        it('[4295]: Verify Case Preview Fields', async () => {
            expect(await caseTemplatePreviewPo.isCaseSummaryHeaderDisplayed('Case Summary')).toBeTruthy('FailureMsg20: Case Summary label is missing');
            expect(await caseTemplatePreviewPo.isCaseStatusTitleDisplayed('Case Status')).toBeTruthy('FailureMsg21: Case Status label is missing');
            expect(await caseTemplatePreviewPo.isCasePriorityTitleDisplayed('Case Priority')).toBeTruthy('FailureMsg22: Case Priority label is missing');
            expect(await caseTemplatePreviewPo.isFlowsetTitleDisplayed('Flowset')).toBeTruthy('FailureMsg23: Flowset label is missing');
            expect(await caseTemplatePreviewPo.isLabelTitleDisplayed('Label')).toBeTruthy('FailureMsg24: Label field label is missing');
            expect(await caseTemplatePreviewPo.isCaseCompanyTitleDisplayed('Case Company')).toBeTruthy('FailureMsg25: Case Company label is missing');
            expect(await caseTemplatePreviewPo.isCaseCategoryTier1TitleDisplayed('Category Tier 1')).toBeTruthy('Case Category Tier 1 is not getting displayed');
            expect(await caseTemplatePreviewPo.isCaseCategoryTier2TitleDisplayed('Category Tier 2')).toBeTruthy('Case Category Tier 2 is not getting displayed');
            expect(await caseTemplatePreviewPo.isCaseCategoryTier3TitleDisplayed('Category Tier 3')).toBeTruthy('Case Category Tier 3 is not getting displayed');
            expect(await caseTemplatePreviewPo.isCaseCategoryTier4TitleDisplayed('Category Tier 4')).toBeTruthy('Case Category Tier 4 is not getting displayed');
            expect(await caseTemplatePreviewPo.isCaseDescriptionTitleDisplayed('Case Description')).toBeTruthy('FailureMsg29: Case Description label is missing');
            expect(await caseTemplatePreviewPo.isAssigneeTitleDisplayed()).toBeTruthy('FailureMsg29: Assignee label is missing');
            expect(await caseTemplatePreviewPo.isSupportGroupTitleDisplayed('Support Company > Support Organization > Support Group')).toBeTruthy('FailureMsg30: Support Company > Support Organization > Support Group label is missing');
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

        it('[4295]: Verify Template with Inactive Case Template ', async () => {
            await searchPo.searchRecord(summary3);
            expect(await searchPo.isModuleTitleDisplayed(summary3, 'Case Templates (0)', caseTemplateModule)).toBeTruthy('FailureMsg2: Case module title is missing');
            expect(await searchPo.isRecordDisplayedOnLeftPannel(caseTemplateDisplayId3, caseTemplateModule)).toBeFalsy(`FailureMsg4: ${caseTemplateDisplayId3} case template id  is display`);
        });

        it('[4295]: Verify Case with non matching Case summary and description Also Verify case summary and description who have not access of the case', async () => {
            await searchPo.searchRecord(summary1);
            expect(await searchPo.isModuleTitleDisplayed(summary1, 'Case Templates (3)', caseTemplateModule)).toBeTruthy('FailureMsg2: Case module title is missing');
            expect(await searchPo.isRecordDisplayedOnLeftPannel(caseTemplateDisplayId4, caseTemplateModule)).toBeFalsy(`FailureMsg51: ${nonMatchingSummary} non mathing template id is missing`);

            // Verify Case Template With Non Matching Summary
            await searchPo.searchRecord(summary1);
            expect(await searchPo.isModuleTitleDisplayed(summary1, 'Case Templates (3)', caseTemplateModule)).toBeTruthy('FailureMsg2: Case module title is missing');
            expect(await searchPo.isRecordDisplayedOnLeftPannel(caseTemplateDisplayId4, caseTemplateModule)).toBeFalsy(`FailureMsg51: ${nonMatchingSummary} non mathing template id is missing`);
        });

        it('[4295]: Clear search and verify record displayed on left pannel ', async () => {
            await searchPo.searchRecord(summary1);
            expect(await searchPo.isModuleTitleDisplayed(summary1, 'Case Templates (3)', caseTemplateModule)).toBeTruthy('FailureMsg2: Case module title is missing');
            await searchPo.clickClearSearchButton();
            expect(await searchPo.isClearSearchButtonDisplayed()).toBeFalsy('FailureMsg62: Search box is cleared and cross button gets hide');
            expect(await searchPo.isRecordDisplayedOnLeftPannel(caseTemplateDisplayId1[1], caseTemplateModule)).toBeTruthy(`FailureMsg4: ${caseTemplateDisplayId1[1]} case template id  is missing`);
        });

        it('[4295]: Verify search functionality with dummy text ', async () => {
            await searchPo.searchRecord(dummyDescription);
            expect(await searchPo.isRecordDisplayedOnLeftPannel(dummyDescription, caseTemplateModule)).toBeFalsy(`FailureMsg64: ${dummyDescription} dummyText  is displayed`);
            expect(await searchPo.isModuleTitleDisplayed(summary1, 'Case Templates (0)', caseTemplateModule)).toBeTruthy('FailureMsg2: Case module title is missing');
            expect(await searchPo.isBlankRecordValidationDisplayedOnLeftPanel(caseTemplateModule)).toBeTruthy(`FailureMsg66: No result found validation is missing`);
        });

        it('[4295]: Verify search case with assignee user', async () => {
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
            expect(await searchPo.isRecordDisplayedOnLeftPannel(updatedDate, caseTemplateModule)).toBeTruthy(`${updatedDate} updatedDate is missing`);
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
            expect(await searchPo.isRecordDisplayedOnLeftPannel(updatedDate, caseTemplateModule)).toBeTruthy(`${updatedDate} updatedDate is missing`);
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

        it('[4295]: Verify search case by other group user  ', async () => {
            await navigationPage.signOut();
            await loginPage.login('qheroux');
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
            expect(await searchPo.isRecordDisplayedOnLeftPannel(updatedDate, caseTemplateModule)).toBeTruthy(`${updatedDate} updatedDate is missing`);
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
            expect(await searchPo.isRecordDisplayedOnLeftPannel(updatedDate, caseTemplateModule)).toBeTruthy(`${updatedDate} updatedDate is missing`);
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

        it('[4295]: Verify non acess case Template with petramco and global company', async () => {
            await navigationPage.signOut();
            await loginPage.login('gwixillian');

            await navigationPage.gotoSearch();
            await searchPo.searchRecord(summary1);
            expect(await searchPo.isModuleTitleDisplayed(summary1, 'Case Templates (3)', caseTemplateModule)).toBeTruthy('FailureMsg2: Case module title is displayed');
            expect(await searchPo.isRecordDisplayedOnLeftPannel(caseTemplateDisplayId1[1], caseTemplateModule)).toBeTruthy(`FailureMsg4: ${caseTemplateDisplayId1[0]} case id  is missing`);

            // Verify Global Template
            await searchPo.searchRecord(summary4);
            expect(await searchPo.isModuleTitleDisplayed(summary4, 'Case Templates (1)', caseTemplateModule)).toBeTruthy('FailureMsg2: Case module title is missing');
            expect(await searchPo.isRecordDisplayedOnLeftPannel(caseTemplateDisplayId5, caseTemplateModule)).toBeTruthy(`FailureMsg4: ${caseTemplateDisplayId5} case id  is missing`);
        });

        it('[4295]: Verify case template record is accessible to other Line of business Case BA', async () => {
            await navigationPage.signOut();
            await loginPage.login('fritz');
            await navigationPage.gotoSearch();
            expect(await searchPo.isCategoryDropDownSelectedValueDisplayed('All')).toBeTruthy('FailureMsg1: Default value from catergory drop down is missing');
            await searchPo.selectCategoryDropDownValue('Case Template');

            // Verify Global Template
            await searchPo.searchRecord(summary4);
            expect(await searchPo.isModuleTitleDisplayed(summary4, 'Case Templates (0)', caseTemplateModule)).toBeTruthy('FailureMsg2: Case module title is missing');
            expect(await searchPo.isRecordDisplayedOnLeftPannel(caseTemplateDisplayId5, caseTemplateModule)).toBeFalsy(`FailureMsg4: ${caseTemplateDisplayId5} case template is displayed for different line of business.`);

            // Verify with case template title
            await searchPo.searchRecord(templateName + '1');
            expect(await searchPo.isModuleTitleDisplayed(templateName + '1', 'Case Templates (0)', caseTemplateModule)).toBeTruthy('FailureMsg2: Case module title is missing');
            expect(await searchPo.isRecordDisplayedOnLeftPannel(caseTemplateDisplayId1[1], caseTemplateModule)).toBeFalsy(`FailureMsg4: ${caseTemplateDisplayId1[0]} case template is displayed for different line of business.`);
        });

        it('[4295]: Verify case template record is accessible to other Line of business Case Manager', async () => {
            await navigationPage.signOut();
            await loginPage.login('frieda');
            await navigationPage.gotoSearch();
            expect(await searchPo.isCategoryDropDownSelectedValueDisplayed('All')).toBeTruthy('FailureMsg1: Default value from catergory drop down is missing');
            await searchPo.selectCategoryDropDownValue('Case Template');

            // Verify Global Template
            await searchPo.searchRecord(summary4);
            expect(await searchPo.isModuleTitleDisplayed(summary4, 'Case Templates (0)', caseTemplateModule)).toBeTruthy('FailureMsg2: Case module title is missing');
            expect(await searchPo.isRecordDisplayedOnLeftPannel(caseTemplateDisplayId5, caseTemplateModule)).toBeFalsy(`FailureMsg4: ${caseTemplateDisplayId5} case template is displayed for different line of business.`);

            // Verify with case template title
            await searchPo.searchRecord(templateName + '1');
            expect(await searchPo.isModuleTitleDisplayed(templateName + '1', 'Case Templates (0)', caseTemplateModule)).toBeTruthy('FailureMsg2: Case module title is missing');
            expect(await searchPo.isRecordDisplayedOnLeftPannel(caseTemplateDisplayId1[1], caseTemplateModule)).toBeFalsy(`FailureMsg4: ${caseTemplateDisplayId1[0]} case template is displayed for different line of business.`);
        });

        it('[4295]: Verify case template record is accessible to other Line of business Case Agent', async () => {
            await navigationPage.signOut();
            await loginPage.login('franz');
            await navigationPage.gotoSearch();
            expect(await searchPo.isCategoryDropDownSelectedValueDisplayed('All')).toBeTruthy('FailureMsg1: Default value from catergory drop down is missing');
            await searchPo.selectCategoryDropDownValue('Case Template');

            // Verify Global Template
            await searchPo.searchRecord(summary4);
            expect(await searchPo.isModuleTitleDisplayed(summary4, 'Case Templates (0)', caseTemplateModule)).toBeTruthy('FailureMsg2: Case module title is missing');
            expect(await searchPo.isRecordDisplayedOnLeftPannel(caseTemplateDisplayId5, caseTemplateModule)).toBeFalsy(`FailureMsg4: ${caseTemplateDisplayId5} case template is displayed for different line of business.`);

            // Verify with case template title
            await searchPo.searchRecord(templateName + '1');
            expect(await searchPo.isModuleTitleDisplayed(templateName + '1', 'Case Templates (0)', caseTemplateModule)).toBeTruthy('FailureMsg2: Case module title is missing');
            expect(await searchPo.isRecordDisplayedOnLeftPannel(caseTemplateDisplayId1[1], caseTemplateModule)).toBeFalsy(`FailureMsg4: ${caseTemplateDisplayId1[0]} case template is displayed for different line of business.`);
        });

        it('[4295]: Verify case template record are accessible to Case Manager user who has access to multiple (HR,Facilities) LOBs', async () => {
            await navigationPage.signOut();
            await loginPage.login('qyuan');
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
        });

        it('[4295]: Verify case template record are accessible to Case BA user who has access to multiple (HR,Facilities) LOBs', async () => {
            await navigationPage.signOut();
            await loginPage.login('jbarnes');
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
        });


        afterAll(async () => {
            await navigationPage.signOut();
            await loginPage.login('qkatawazi')
        });
    });

    //kgaikwad
    describe('[4294]:Global search with only Task Template Category', async () => {
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

        it('[4294]: Verify Module Title, Description', async () => {
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
            expect(await searchPo.isRecordDisplayedOnLeftPannel(updatedDate, taskTemplateModule)).toBeTruthy(`${updatedDate} updatedDate is missing`);
            expect(await searchPo.isRecordDisplayedOnLeftPannel(taskTemplateDisplayId2[5], taskTemplateModule)).toBeTruthy(`FailureMsg6: ${taskTemplateDisplayId1[1]} task id  is missing`);
            expect(await searchPo.isRecordDisplayedOnLeftPannel(taskTemplateDisplayId2[6], taskTemplateModule)).toBeTruthy(`FailureMsg7: ${taskTemplateDisplayId1[2]} task id  is missing`);

            await searchPo.clickOnLeftPannelRecord(taskTemplateDisplayId2[4], taskTemplateModule);
        });

        it('[4294]: Verify Task Preview Fields', async () => {
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
            expect(await previewTaskTemplatePo.getDescription()).toBe(description, 'FailureMsg38: description is missing');
            expect(await previewTaskTemplatePo.getAssigneeText()).toBe('Qiang Du', 'FailureMsg39: Assignee is missing');
            expect(await previewTaskTemplatePo.getSupportGroup()).toBe('Petramco > Canada Support > CA Support 1', 'FailureMsg40: Petramco > Canada Support > CA Support 1 is missing');
        });

        it('[4294]: Verify Template with Inactive Task Template ', async () => {
            await searchPo.searchRecord(templateName + 7);
            expect(await searchPo.isModuleTitleDisplayed(templateName + 7, 'Task Templates (0)', taskTemplateModule)).toBeTruthy('FailureMsg2: Task module title is missing');
            expect(await searchPo.isRecordDisplayedOnLeftPannel(taskTemplateDisplayId3, taskTemplateModule)).toBeFalsy(`FailureMsg4: ${taskTemplateDisplayId3} task template id  is display`);
        });

        it('[4294]: Verify Task Template With Non Matching template description', async () => {
            await searchPo.searchRecord(description);
            expect(await searchPo.isModuleTitleDisplayed(description, 'Task Templates (3)', taskTemplateModule)).toBeTruthy('FailureMsg2: Task module title is missing');
            expect(await searchPo.isRecordDisplayedOnLeftPannel(taskTemplateDisplayId4, taskTemplateModule)).toBeFalsy(`FailureMsg51: ${taskTemplateDisplayId4} non mathing template id is displayed`);
        });

        it('[4294]: Clear search and verify record displayed on left pannel ', async () => {
            await searchPo.searchRecord(description);
            expect(await searchPo.isModuleTitleDisplayed(description, 'Task Templates (3)', taskTemplateModule)).toBeTruthy('FailureMsg2: Task module title is missing');
            await searchPo.clickClearSearchButton();
            expect(await searchPo.isClearSearchButtonDisplayed()).toBeFalsy('FailureMsg62: Search box is cleared and cross button gets hide');
            expect(await searchPo.isRecordDisplayedOnLeftPannel(taskTemplateDisplayId2[4], taskTemplateModule)).toBeTruthy(`FailureMsg4: ${taskTemplateDisplayId1[1]} task template id  is missing`);
        });

        it('[4294]: Verify search functionality with dummy text ', async () => {
            await searchPo.searchRecord(dummyDescription);
            expect(await searchPo.isRecordDisplayedOnLeftPannel(dummyDescription, taskTemplateModule)).toBeFalsy(`FailureMsg64: ${dummyDescription} dummyText  is displayed`);
            expect(await searchPo.isModuleTitleDisplayed(dummyDescription, 'Task Templates (0)', taskTemplateModule)).toBeTruthy('FailureMsg2: Task module title is missing');
            expect(await searchPo.isBlankRecordValidationDisplayedOnLeftPanel(taskTemplateModule)).toBeTruthy(`FailureMsg66: No result found validation is missing`);
        });

        it('[4294]: Verify search task with assignee user', async () => {
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
            expect(await searchPo.isRecordDisplayedOnLeftPannel(updatedDate, taskTemplateModule)).toBeTruthy(`${updatedDate} updatedDate is missing`);
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

        it('[4294]: Verify search task by other group user  ', async () => {
            await navigationPage.signOut();
            await loginPage.login('qheroux')
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
            expect(await searchPo.isRecordDisplayedOnLeftPannel(updatedDate, taskTemplateModule)).toBeTruthy(`${updatedDate} updatedDate is missing`);
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

        it('[4294]: Verify non acess task Template with petramco and global company', async () => {
            await navigationPage.signOut();
            await loginPage.login('gwixillian');

            await navigationPage.gotoSearch();
            await searchPo.searchRecord(templateName + '1');
            expect(await searchPo.isModuleTitleDisplayed(templateName + '1', 'Task Templates (1)', taskTemplateModule)).toBeTruthy('FailureMsg2: Task module title is missing');
            expect(await searchPo.isRecordDisplayedOnLeftPannel(taskTemplateDisplayId1[1], taskTemplateModule)).toBeTruthy(`FailureMsg4: ${taskTemplateDisplayId1[0]} task id  is missing`);

            // Verify Global Template
            await searchPo.searchRecord(templateName + 9);
            expect(await searchPo.isModuleTitleDisplayed(templateName + 9, 'Task Templates (1)', taskTemplateModule)).toBeTruthy('FailureMsg5: Task module title is missing');
            expect(await searchPo.isRecordDisplayedOnLeftPannel(taskTemplateDisplayId5, taskTemplateModule)).toBeTruthy(`FailureMsg6: ${taskTemplateDisplayId5} task id  is missing`);
        });

        it('[4294]: Verify task template record is accessible to other Line of business Case BA', async () => {
            await navigationPage.signOut();
            await loginPage.login('fritz');
            await navigationPage.gotoSearch();
            expect(await searchPo.isCategoryDropDownSelectedValueDisplayed('All')).toBeTruthy('FailureMsg1: Default value from catergory drop down is missing');
            await searchPo.selectCategoryDropDownValue('Task Template');

            // Verify Global Template
            await searchPo.searchRecord(templateName + 9);
            expect(await searchPo.isModuleTitleDisplayed(templateName + 9, 'Task Templates (0)', taskTemplateModule)).toBeTruthy('FailureMsg2: Task Template module title is missing');
            expect(await searchPo.isRecordDisplayedOnLeftPannel(taskTemplateDisplayId5, taskTemplateModule)).toBeFalsy(`FailureMsg4: ${taskTemplateDisplayId5} task template is displayed for different line of business`);

            // Verify with task template title
            await searchPo.searchRecord(templateName + '1');
            expect(await searchPo.isModuleTitleDisplayed(templateName + '1', 'Task Templates (0)', taskTemplateModule)).toBeTruthy('FailureMsg2: Task module title is missing');
            expect(await searchPo.isRecordDisplayedOnLeftPannel(taskTemplateDisplayId1[1], taskTemplateModule)).toBeFalsy(`FailureMsg4: ${taskTemplateDisplayId1[0]} task template is displayed for different line of business`);
        });

        it('[4294]: Verify task template record is accessible to other Line of business Case Manager', async () => {
            await navigationPage.signOut();
            await loginPage.login('frieda');
            await navigationPage.gotoSearch();
            expect(await searchPo.isCategoryDropDownSelectedValueDisplayed('All')).toBeTruthy('FailureMsg1: Default value from catergory drop down is missing');
            await searchPo.selectCategoryDropDownValue('Task Template');

            // Verify Global Template
            await searchPo.searchRecord(templateName + 9);
            expect(await searchPo.isModuleTitleDisplayed(templateName + 9, 'Task Templates (0)', taskTemplateModule)).toBeTruthy('FailureMsg2: Task Template module title is missing');
            expect(await searchPo.isRecordDisplayedOnLeftPannel(taskTemplateDisplayId5, taskTemplateModule)).toBeFalsy(`FailureMsg4: ${taskTemplateDisplayId5} task template is displayed for different line of business`);

            // Verify with task template title
            await searchPo.searchRecord(templateName + '1');
            expect(await searchPo.isModuleTitleDisplayed(templateName + '1', 'Task Templates (0)', taskTemplateModule)).toBeTruthy('FailureMsg2: Task module title is missing');
            expect(await searchPo.isRecordDisplayedOnLeftPannel(taskTemplateDisplayId1[1], taskTemplateModule)).toBeFalsy(`FailureMsg4: ${taskTemplateDisplayId1[0]} task template is displayed for different line of business`);
        });

        it('[4294]: Verify task template record is accessible to other Line of business Case Agent', async () => {
            await navigationPage.signOut();
            await loginPage.login('franz');
            await navigationPage.gotoSearch();
            expect(await searchPo.isCategoryDropDownSelectedValueDisplayed('All')).toBeTruthy('FailureMsg1: Default value from catergory drop down is missing');
            await searchPo.selectCategoryDropDownValue('Task Template');

            // Verify Global Template
            await searchPo.searchRecord(templateName + 9);
            expect(await searchPo.isModuleTitleDisplayed(templateName + 9, 'Task Templates (0)', taskTemplateModule)).toBeTruthy('FailureMsg2: Task Template module title is missing');
            expect(await searchPo.isRecordDisplayedOnLeftPannel(taskTemplateDisplayId5, taskTemplateModule)).toBeFalsy(`FailureMsg4: ${taskTemplateDisplayId5} task template is displayed for different line of business`);

            // Verify with task template title
            await searchPo.searchRecord(templateName + '1');
            expect(await searchPo.isModuleTitleDisplayed(templateName + '1', 'Task Templates (0)', taskTemplateModule)).toBeTruthy('FailureMsg2: Task module title is missing');
            expect(await searchPo.isRecordDisplayedOnLeftPannel(taskTemplateDisplayId1[1], taskTemplateModule)).toBeFalsy(`FailureMsg4: ${taskTemplateDisplayId1[0]} task template is displayed for different line of business`);
        });

        it('[4294]: Verify task template record are accessible to Case Manager user who has access to multiple (HR,Facilities) LOBs', async () => {
            await navigationPage.signOut();
            await loginPage.login('qyuan');
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
        });

        it('[4294]: Verify task template record are accessible to Case BA user who has access to multiple (HR,Facilities) LOBs', async () => {
            await navigationPage.signOut();
            await loginPage.login('jbarnes');
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
        });

        afterAll(async () => {
            await utilityCommon.closeAllBlades();
            await navigationPage.signOut();
            await loginPage.login('qkatawazi')
        });
    });

    //kgaikwad
    describe('[4293]: Global search with only Document Category', async () => {
        let randomStr = [...Array(4)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        let attachmentFilePath = 'e2e/data/ui/search/globalsearch3.jpg';
        let attachmentFilePath2 = 'e2e/data/ui/search/globalsearch5.json';

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
            await createPublishDocumentLibrary(nonMatchingDocName, attachmentFilePath2, nonMatchingKeyword);

            // Non access Document
            await apiHelper.apiLogin('elizabeth');
            await createPublishDocumentLibrary(nonAccessDocName, attachmentFilePath2);
        });

        it('[4293]: Verify Document Name, Keyword, Attachment', async () => {
            await navigationPage.gotoSearch();
            expect(await searchPo.isCategoryDropDownSelectedValueDisplayed('All')).toBeTruthy('FailureMsg1: Default value from catergory drop down is missing');
            await searchPo.selectCategoryDropDownValue('Document');
            await searchPo.searchRecord(docName1);
            expect(await searchPo.isModuleTitleDisplayed(docName1, 'Documents (5)', documentModule)).toBeTruthy('FailureMsg2: Document module title is missing');
            expect(await searchPo.isRecordDisplayedOnLeftPannel(updatedDate, documentModule)).toBeTruthy(`${updatedDate} updatedDate is missing`);
            expect(await searchPo.isRecordDisplayedOnLeftPannel('globalsearch3.jpg', documentModule)).toBeTruthy(`${'globalsearch3.jpg'} attachment File Name is missing`);
            expect(await searchPo.isRecordDisplayedOnLeftPannel(docName1, documentModule, 1)).toBeTruthy(`FailureMsg4: ${docName1} 1 Document is missing`);
            expect(await searchPo.isRecordDisplayedOnLeftPannel(docName1, documentModule, 2)).toBeTruthy(`FailureMsg4: ${docName1} 2 Document is missing`);
            expect(await searchPo.isRecordDisplayedOnLeftPannel(docName1, documentModule, 3)).toBeTruthy(`FailureMsg5: ${docName1} 3 Document is missing`);
            expect(await searchPo.isRecordDisplayedOnLeftPannel(docName1, documentModule, 4)).toBeTruthy(`FailureMsg6: ${docName1} 4 Document is missing`);
            expect(await searchPo.isRecordDisplayedOnLeftPannel(docName1, documentModule, 5)).toBeTruthy(`FailureMsg7: ${docName1} 5 Document is missing`);

            await searchPo.searchRecord(keywordStr);
            expect(await searchPo.isModuleTitleDisplayed(docName1, 'Documents (5)', documentModule)).toBeTruthy('FailureMsg2: Document module title is missing');
            await browser.sleep(3000); // waiting for result fetch on left pannel
            expect(await searchPo.isRecordDisplayedOnLeftPannel(updatedDate, documentModule)).toBeTruthy(`${updatedDate} updatedDate is missing`);
            expect(await searchPo.isRecordDisplayedOnLeftPannel('globalsearch3.jpg', documentModule)).toBeTruthy(`${'globalsearch3.jpg'} attachment File Name is missing`);
            expect(await searchPo.isRecordDisplayedOnLeftPannel(docName1, documentModule, 1)).toBeTruthy(`FailureMsg4: ${docName1} 1 Document is missing`);
            expect(await searchPo.isRecordDisplayedOnLeftPannel(docName1, documentModule, 2)).toBeTruthy(`FailureMsg4: ${docName1} 2 Document is missing`);
            expect(await searchPo.isRecordDisplayedOnLeftPannel(docName1, documentModule, 3)).toBeTruthy(`FailureMsg5: ${docName1} 3 Document is missing`);
            expect(await searchPo.isRecordDisplayedOnLeftPannel(docName1, documentModule, 4)).toBeTruthy(`FailureMsg6: ${docName1} 4 Document is missing`);
            expect(await searchPo.isRecordDisplayedOnLeftPannel(docName1, documentModule, 5)).toBeTruthy(`FailureMsg7: ${docName1} 5 Document is missing`);
            
            await searchPo.searchRecord('globalsearch5.json');
            expect(await searchPo.isModuleTitleDisplayed('globalsearch5.json', 'Documents (2)', documentModule)).toBeTruthy('FailureMsg2: Document module title is missing');
            expect(await searchPo.isRecordDisplayedOnLeftPannel('globalsearch5.json', documentModule)).toBeTruthy(`${'globalsearch5.json'} attachment File Name is missing`);
            expect(await searchPo.isRecordDisplayedOnLeftPannel(nonMatchingDocName, documentModule, 1)).toBeTruthy(`FailureMsg4: ${nonMatchingDocName} 1 Document is missing`);

            await searchPo.searchRecord('globalsearch3.jpg');
            expect(await searchPo.isModuleTitleDisplayed(docName1, 'Documents (5)', documentModule)).toBeTruthy('FailureMsg2: Document module title is missing');
            expect(await searchPo.isRecordDisplayedOnLeftPannel(updatedDate, documentModule)).toBeTruthy(`${updatedDate} updatedDate is missing`);
            expect(await searchPo.isRecordDisplayedOnLeftPannel('globalsearch3.jpg', documentModule)).toBeTruthy(`${'globalsearch3.jpg'} attachment File Name is missing`);
            expect(await searchPo.isRecordDisplayedOnLeftPannel(docName1, documentModule, 1)).toBeTruthy(`FailureMsg4: ${docName1} 1 Document is missing`);
            expect(await searchPo.isRecordDisplayedOnLeftPannel(docName1, documentModule, 2)).toBeTruthy(`FailureMsg4: ${docName1} 2 Document is missing`);
            expect(await searchPo.isRecordDisplayedOnLeftPannel(docName1, documentModule, 3)).toBeTruthy(`FailureMsg5: ${docName1} 3 Document is missing`);
            expect(await searchPo.isRecordDisplayedOnLeftPannel(docName1, documentModule, 4)).toBeTruthy(`FailureMsg6: ${docName1} 4 Document is missing`);
            expect(await searchPo.isRecordDisplayedOnLeftPannel(docName1, documentModule, 5)).toBeTruthy(`FailureMsg7: ${docName1} 5 Document is missing`);

            await searchPo.clickOnLeftPannelRecord(docName1, documentModule);
        });

        it('[4293]: Verify Document Preview Fields', async () => {
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

            expect(await previewDocumentLibraryPo.isDataDisplayed('DocumentName', docName1)).toBeTruthy('FailureMsg23: docName1 Displayed');
            expect(await previewDocumentLibraryPo.isDataDisplayed('Attachment', 'globalsearch3.jpg')).toBeTruthy('FailureMsg24: attachment file name missing');
            expect(await previewDocumentLibraryPo.isDataDisplayed('DocumentStatus', 'Published')).toBeTruthy('FailureMsg25: Doc status missing');
            expect(await previewDocumentLibraryPo.isDataDisplayed('Company', 'Petramco')).toBeTruthy('FailureMsg26: Company Value missing');
            expect(await previewDocumentLibraryPo.isDataDisplayed('ShareExternally', 'False')).toBeTruthy('FailureMsg27: Share External Value is missing');
            expect(await previewDocumentLibraryPo.isDataDisplayed('SupportOrganization', 'Canada Support')).toBeTruthy('FailureMsg28: BussinessUnit is missing');
            expect(await previewDocumentLibraryPo.isDataDisplayed('OwnerGroup', 'CA Support 1')).toBeTruthy('FailureMsg29: OwnerGroup is missing');
            expect(await previewDocumentLibraryPo.isDataDisplayed('Keyword', 'keyword')).toBeTruthy('FailureMsg30: Keywords is missing');
        });

        it('[4293]: Verify Document with non matching Document summary Also Verify case summary  who have not access of the case', async () => {
            await searchPo.searchRecord(docName1);
            expect(await searchPo.isModuleTitleDisplayed(docName1, 'Documents (5)', documentModule)).toBeTruthy('FailureMsg47: Document module title is missing');
            expect(await searchPo.isRecordDisplayedOnLeftPannel(nonMatchingDocName, documentModule)).toBeFalsy(`FailureMsg51: ${nonMatchingDocName} Document non matching is displayed`);
            expect(await searchPo.isRecordDisplayedOnLeftPannel(nonMatchingKeyword, documentModule)).toBeFalsy(`FailureMsg51: ${nonMatchingKeyword} non Matching Keyword is displayed`);
            expect(await searchPo.isRecordDisplayedOnLeftPannel(nonAccessDocName, documentModule)).toBeFalsy(`FailureMsg55: ${nonAccessDocName} non access Document is displayed`);
        });

        it('[4293]: Clear search and verify record displayed on left pannel ', async () => {
            await searchPo.searchRecord(docName1);
            expect(await searchPo.isModuleTitleDisplayed(docName1, 'Documents (5)', documentModule)).toBeTruthy('FailureMsg59: Document module title is missing');
            await searchPo.clickClearSearchButton();
            expect(await searchPo.isClearSearchButtonDisplayed()).toBeFalsy('FailureMsg60: Search box is cleared and cross button gets hide');
            expect(await searchPo.isRecordDisplayedOnLeftPannel(docName1, documentModule)).toBeTruthy(`FailureMsg7: ${docName1} 5 Document is missing`);
        });

        it('[4293]: Verify search functionality with dummy text ', async () => {
            await searchPo.searchRecord(dummyText);
            expect(await searchPo.isRecordDisplayedOnLeftPannel(dummyText, documentModule)).toBeFalsy(`FailureMsg62: ${dummyText} dummyText  is displayed`);
            expect(await searchPo.isModuleTitleDisplayed(dummyText, 'Documents (0)', documentModule)).toBeTruthy('FailureMsg63: Document module title is missing');
            expect(await searchPo.isBlankRecordValidationDisplayedOnLeftPanel(documentModule)).toBeTruthy(`FailureMsg64: No result found validation is missing`);
        });

        it('[4293]: Verify search Document with assignee group ', async () => {
            await navigationPage.signOut();
            await loginPage.login('qdu');
            await navigationPage.gotoSearch();

            await searchPo.searchRecord(docName1);
            expect(await searchPo.isModuleTitleDisplayed(docName1, 'Documents (5)', documentModule)).toBeTruthy('FailureMsg2: Document module title is missing');
            expect(await searchPo.isRecordDisplayedOnLeftPannel(updatedDate, documentModule)).toBeTruthy(`${updatedDate} updatedDate is missing`);
            expect(await searchPo.isRecordDisplayedOnLeftPannel('globalsearch3.jpg', documentModule)).toBeTruthy(`${'globalsearch3.jpg'} attachment File Name is missing`);
            expect(await searchPo.isRecordDisplayedOnLeftPannel(docName1, documentModule, 1)).toBeTruthy(`FailureMsg4: ${docName1} 1 Document is missing`);
            expect(await searchPo.isRecordDisplayedOnLeftPannel(docName1, documentModule, 2)).toBeTruthy(`FailureMsg4: ${docName1} 2 Document is missing`);
            expect(await searchPo.isRecordDisplayedOnLeftPannel(docName1, documentModule, 3)).toBeTruthy(`FailureMsg5: ${docName1} 3 Document is missing`);
            expect(await searchPo.isRecordDisplayedOnLeftPannel(docName1, documentModule, 4)).toBeTruthy(`FailureMsg6: ${docName1} 4 Document is missing`);
            expect(await searchPo.isRecordDisplayedOnLeftPannel(docName1, documentModule, 5)).toBeTruthy(`FailureMsg7: ${docName1} 5 Document is missing`);
            expect(await searchPo.isRecordDisplayedOnLeftPannel(nonMatchingDocName, documentModule)).toBeFalsy(`FailureMsg4: ${nonMatchingDocName} 1 non Matching Doc Name is missing`);

            await searchPo.searchRecord(keywordStr);
            expect(await searchPo.isModuleTitleDisplayed(docName1, 'Documents (5)', documentModule)).toBeTruthy('FailureMsg2: Document module title is missing');
            expect(await searchPo.isRecordDisplayedOnLeftPannel(updatedDate, documentModule)).toBeTruthy(`${updatedDate} updatedDate is missing`);
            expect(await searchPo.isRecordDisplayedOnLeftPannel('globalsearch3.jpg', documentModule)).toBeTruthy(`${'globalsearch3.jpg'} attachment File Name is missing`);
            expect(await searchPo.isRecordDisplayedOnLeftPannel(docName1, documentModule, 1)).toBeTruthy(`FailureMsg4: ${docName1} 1 Document is missing`);
            expect(await searchPo.isRecordDisplayedOnLeftPannel(docName1, documentModule, 2)).toBeTruthy(`FailureMsg4: ${docName1} 2 Document is missing`);
            expect(await searchPo.isRecordDisplayedOnLeftPannel(docName1, documentModule, 3)).toBeTruthy(`FailureMsg5: ${docName1} 3 Document is missing`);
            expect(await searchPo.isRecordDisplayedOnLeftPannel(docName1, documentModule, 4)).toBeTruthy(`FailureMsg6: ${docName1} 4 Document is missing`);
            expect(await searchPo.isRecordDisplayedOnLeftPannel(docName1, documentModule, 5)).toBeTruthy(`FailureMsg7: ${docName1} 5 Document is missing`);

            await searchPo.searchRecord('globalsearch3.jpg');
            expect(await searchPo.isModuleTitleDisplayed('globalsearch3.jpg', 'Documents (5)', documentModule)).toBeTruthy('FailureMsg2: Document module title is missing');
            expect(await searchPo.isRecordDisplayedOnLeftPannel(updatedDate, documentModule)).toBeTruthy(`${updatedDate} updatedDate is missing`);
            expect(await searchPo.isRecordDisplayedOnLeftPannel('globalsearch3.jpg', documentModule)).toBeTruthy(`${'globalsearch3.jpg'} attachment File Name is missing`);
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

        it('[4293]: Verify search Document with other group user', async () => {
            await navigationPage.signOut();
            await loginPage.login('qheroux');
            await navigationPage.gotoSearch();
            await searchPo.searchRecord(docName1);
            expect(await searchPo.isModuleTitleDisplayed(docName1, 'Documents (5)', documentModule)).toBeTruthy('FailureMsg63: Document module title is missing');
            expect(await searchPo.isRecordDisplayedOnLeftPannel(docName1, documentModule, 1)).toBeTruthy(`FailureMsg64: ${docName1} 1 Document is missing`);

            await searchPo.searchRecord(keywordStr);
            expect(await searchPo.isModuleTitleDisplayed(docName1, 'Documents (5)', documentModule)).toBeTruthy('FailureMsg2: Document module title is missing');
            expect(await searchPo.isRecordDisplayedOnLeftPannel(docName1, documentModule, 1)).toBeTruthy(`FailureMsg4: ${docName1} 1 Document is missing`);

            await searchPo.searchRecord('globalsearch3.jpg');
            expect(await searchPo.isModuleTitleDisplayed('globalsearch3.jpg', 'Documents (5)', documentModule)).toBeTruthy('FailureMsg2: Document globalsearch3.jpg is missing');
            expect(await searchPo.isRecordDisplayedOnLeftPannel(docName1, documentModule, 1)).toBeTruthy(`FailureMsg4: globalsearch3.jpg Document is missing`);

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

        it('[4293]: Verify search Document with other company user', async () => {
            await navigationPage.signOut();
            await loginPage.login('gderuno')
            await navigationPage.gotoSearch();
            await searchPo.searchRecord(docName1);
            expect(await searchPo.isModuleTitleDisplayed(docName1, 'Documents (5)', documentModule)).toBeTruthy('FailureMsg63: Document module title is missing');
            expect(await searchPo.isRecordDisplayedOnLeftPannel(docName1, documentModule, 1)).toBeTruthy(`FailureMsg64: ${docName1} 1 Document is missing`);

            await searchPo.searchRecord(keywordStr);
            expect(await searchPo.isModuleTitleDisplayed(docName1, 'Documents (5)', documentModule)).toBeTruthy('FailureMsg2: Document module title is missing');
            expect(await searchPo.isRecordDisplayedOnLeftPannel(docName1, documentModule, 1)).toBeTruthy(`FailureMsg4: ${docName1} 1 Document is missing`);

            await searchPo.searchRecord('globalsearch3.jpg');
            expect(await searchPo.isModuleTitleDisplayed('globalsearch3.jpg', 'Documents (5)', documentModule)).toBeTruthy('FailureMsg2: Document globalsearch3.jpg is missing');
            expect(await searchPo.isRecordDisplayedOnLeftPannel(docName1, documentModule, 1)).toBeTruthy(`FailureMsg4: globalsearch3.jpg Document is missing`);

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

        it('[4293]: Verify document library record is accessible to other Line of business Case BA', async () => {
            await navigationPage.signOut();
            await loginPage.login('fritz');
            await navigationPage.gotoSearch();
            expect(await searchPo.isCategoryDropDownSelectedValueDisplayed('All')).toBeTruthy('FailureMsg1: Default value from catergory drop down is missing');
            await searchPo.selectCategoryDropDownValue('Document');
            await searchPo.searchRecord(docName1);
            expect(await searchPo.isModuleTitleDisplayed(docName1, 'Documents (0)', documentModule)).toBeTruthy('FailureMsg2: Document module title is missing');
            expect(await searchPo.isRecordDisplayedOnLeftPannel(docName1, documentModule, 1)).toBeFalsy(`FailureMsg4: ${docName1} 1 Document is searched for different Line of business.`);
        });

        it('[4293]: Verify document library record is accessible to other Line of business Case Manager', async () => {
            await navigationPage.signOut();
            await loginPage.login('frieda');
            await navigationPage.gotoSearch();
            expect(await searchPo.isCategoryDropDownSelectedValueDisplayed('All')).toBeTruthy('FailureMsg1: Default value from catergory drop down is missing');
            await searchPo.selectCategoryDropDownValue('Document');
            await searchPo.searchRecord(docName1);
            expect(await searchPo.isModuleTitleDisplayed(docName1, 'Documents (0)', documentModule)).toBeTruthy('FailureMsg2: Document module title is missing');
            expect(await searchPo.isRecordDisplayedOnLeftPannel(docName1, documentModule, 1)).toBeFalsy(`FailureMsg4: ${docName1} 1 Document is searched for different Line of business.`);
        });

        it('[4293]: Verify document library record is accessible to other Line of business Case Agent', async () => {
            await navigationPage.signOut();
            await loginPage.login('franz');
            await navigationPage.gotoSearch();
            expect(await searchPo.isCategoryDropDownSelectedValueDisplayed('All')).toBeTruthy('FailureMsg1: Default value from catergory drop down is missing');
            await searchPo.selectCategoryDropDownValue('Document');
            await searchPo.searchRecord(docName1);
            expect(await searchPo.isModuleTitleDisplayed(docName1, 'Documents (0)', documentModule)).toBeTruthy('FailureMsg2: Document module title is missing');
            expect(await searchPo.isRecordDisplayedOnLeftPannel(docName1, documentModule, 1)).toBeFalsy(`FailureMsg4: ${docName1} 1 Document is searched for different Line of business.`);
        });

        it('[4293]: Verify document library record are accessible to Case Manager user who has access to multiple (HR,Facilities) LOBs', async () => {
            await navigationPage.signOut();
            await loginPage.login('qyuan');
            await utilityGrid.selectLineOfBusiness('Facilities');
            await navigationPage.gotoSearch();
            expect(await searchPo.isCategoryDropDownSelectedValueDisplayed('All')).toBeTruthy('FailureMsg1: Default value from catergory drop down is missing');
            await searchPo.selectCategoryDropDownValue('Document');
            await searchPo.searchRecord(docName1);
            expect(await searchPo.isModuleTitleDisplayed(docName1, 'Documents (0)', documentModule)).toBeTruthy('FailureMsg2: Document module title is missing');
            expect(await searchPo.isRecordDisplayedOnLeftPannel(docName1, documentModule, 1)).toBeFalsy(`FailureMsg4: ${docName1} 1 Document is searched for different Line of business.`);
        });

        it('[4293]: Verify document library record are accessible to Case BA user who has access to multiple (HR,Facilities) LOBs', async () => {
            await navigationPage.signOut();
            await loginPage.login('jbarnes');
            await utilityGrid.selectLineOfBusiness('Facilities');
            await navigationPage.gotoSearch();
            expect(await searchPo.isCategoryDropDownSelectedValueDisplayed('All')).toBeTruthy('FailureMsg1: Default value from catergory drop down is missing');
            await searchPo.selectCategoryDropDownValue('Document');
            await searchPo.searchRecord(docName1);
            expect(await searchPo.isModuleTitleDisplayed(docName1, 'Documents (0)', documentModule)).toBeTruthy('FailureMsg2: Document module title is missing');
            expect(await searchPo.isRecordDisplayedOnLeftPannel(docName1, documentModule, 1)).toBeFalsy(`FailureMsg4: ${docName1} 1 Document is searched for different Line of business.`);
        });
    });
});
