import searchPo from '../../pageobject/search/global-search.po';
import { browser } from "protractor";
import apiHelper from "../../api/api.helper";
import loginPage from "../../pageobject/common/login.po";
import navigationPage from "../../pageobject/common/navigation.po";
import { BWF_BASE_URL } from '../../utils/constants';
import utilityCommon from '../../utils/utility.common';
import viewCasetemplatePo from '../../pageobject/settings/case-management/view-casetemplate.po';
import casePreviewPo from '../../pageobject/case/case-preview.po';

export interface IIDs {
    id: string;
    displayId: string;
}
describe('Case Data Store', () => {
    let caseModule = "Case";
    let taskModule = "Task";
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
        let monthArr: string[] = ["Null", "Jan", "Feb", "Mar", "Apr", "May", "June", "July", "Aug", "Spet", "Oct", "Nov", "Dec"];
        month = monthArr[numMonth];

        let numDate: number = objDate.getUTCDate();
        let date1 = new Number(numDate);
        if (date1 <= 9) {
            date = '0' + date1.toString();
        } else {
            date = date1.toString();
        }
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
        let caseDisplayId3 = [];
        let caseId = [];

        beforeAll(async () => {
            await apiHelper.apiLogin('qtao');
            // Create Case with summary
            for (let a = 0; a < 5; a++) {
                let caseDetails = await createCase(summary);
                caseDisplayId1[a] = caseDetails.displayId;
                caseId[a] = caseDetails.id;
            }

            // Create Case For Description
            for (let b = 0; b < 5; b++) {
                let caseDetails = await createCase(summary, description);
                caseDisplayId2[b] = caseDetails.displayId;
            }
          
            // Non maching case
            await createCase(nonMatchingSummary, nonMatchingDescription);

            // Non access to case
            await apiHelper.apiLogin('qdu');
            for (let c = 0; c < 2; c++) {
                let caseDetails3 = await createCase(nonMatchingSummary, nonMatchingSummary);
                caseDisplayId3[c] = caseDetails3.displayId;
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
            expect(await searchPo.isRecordDisplayedOnLeftPannel(nonMatchingSummary, caseModule)).toBeFalsy(`FailureMsg51: ${nonMatchingSummary} case Summary is missing`);
            expect(await searchPo.isRecordDisplayedOnLeftPannel(nonMatchingDescription, caseModule)).toBeFalsy(`FailureMsg52: ${nonMatchingDescription} case Description is missing`);
            await searchPo.clickOnPaginationPageNo(caseModule, "2");
            expect(await searchPo.isRecordDisplayedOnLeftPannel(nonMatchingSummary, caseModule)).toBeFalsy(`FailureMsg53: ${nonMatchingSummary} case Summary is missing`);
            expect(await searchPo.isRecordDisplayedOnLeftPannel(nonMatchingDescription, caseModule)).toBeFalsy(`FailureMsg54: ${nonMatchingDescription} case Description is missing`);
            // Verify case summary and description who have not access of the case
            await searchPo.clickOnPaginationPageNo(caseModule, "1");
            await searchPo.searchRecord(summary);
            expect(await searchPo.isRecordDisplayedOnLeftPannel(caseDisplayId3[0], caseModule)).toBeFalsy(`FailureMsg55: ${caseDisplayId3[0]} case id  is displayed`);
            expect(await searchPo.isRecordDisplayedOnLeftPannel(caseDisplayId3[1], caseModule)).toBeFalsy(`FailureMsg56: ${caseDisplayId3[1]} case id  is displayed`);
            await searchPo.clickOnPaginationPageNo(caseModule, "2");
            expect(await searchPo.isRecordDisplayedOnLeftPannel(caseDisplayId3[0], caseModule)).toBeFalsy(`FailureMsg57: ${caseDisplayId3[0]} case id  is displayed`);
            expect(await searchPo.isRecordDisplayedOnLeftPannel(caseDisplayId3[1], caseModule)).toBeFalsy(`FailureMsg58: ${caseDisplayId3[1]} case id  is displayed`);
        });

         it('[DRDMV-16102]: Clear search and verify record displayed on left pannel ', async () => {
            await searchPo.searchRecord(summary);
            expect(await searchPo.isModuleTitleDisplayed(summary, 'Cases (10)', caseModule)).toBeTruthy('FailureMsg59: Case module title is missing');
            await searchPo.clickClearSearchButton();
            expect(await searchPo.isClearSearchButtonDisplayed()).toBeFalsy('FailureMsg60: Search box is cleared and cross button gets hide');
            expect(await searchPo.isRecordDisplayedOnLeftPannel(caseDisplayId1[0], caseModule)).toBeTruthy(`FailureMsg61: ${caseDisplayId3[0]} case id  is missing`);
        });

        it('[DRDMV-16102]: Verify search functionality with dummy text ', async () => {
            await searchPo.searchRecord(dummyDescription);
            expect(await searchPo.isRecordDisplayedOnLeftPannel(dummyDescription, caseModule)).toBeFalsy(`FailureMsg62: ${dummyDescription} dummyText  is displayed`);
            expect(await searchPo.isModuleTitleDisplayed(dummyDescription, 'Cases (0)', caseModule)).toBeTruthy('FailureMsg63: Case module title is missing');
            expect(await searchPo.isBlankRecordValidationDisplayedOnLeftPanel(caseModule)).toBeTruthy(`FailureMsg64: No result found validation is missing`);
        });
    });
});


