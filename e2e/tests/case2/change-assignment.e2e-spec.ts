import apiHelper from '../../api/api.helper';
import { nth } from 'lodash';
import { browser } from "protractor";
import previewCasePo from '../../pageobject/case/case-preview.po';
import createCasePo from '../../pageobject/case/create-case.po';
import editCasePo from '../../pageobject/case/edit-case.po';
import viewCasePo from '../../pageobject/case/view-case.po';
import changeAssignmentPage from '../../pageobject/common/change-assignment.po';
import loginPo from "../../pageobject/common/login.po";
import navigationPo from "../../pageobject/common/navigation.po";
import adhoctaskTemplate from "../../pageobject/task/create-adhoc-task.po";
import editTaskPo from '../../pageobject/task/edit-task.po';
import manageTaskBladePo from "../../pageobject/task/manage-task-blade.po";
import viewTaskPo from '../../pageobject/task/view-task.po';
import { BWF_BASE_URL, BWF_PAGE_TITLES, operation, security, type } from '../../utils/constants';
import utilityCommon from '../../utils/utility.common';
import utilityGrid from '../../utils/utility.grid';
import accessTabPo from '../../pageobject/common/access-tab.po';
import viewKnowledgeArticlePo from '../../pageobject/knowledge/view-knowledge-article.po';
import editKnowledgePo from '../../pageobject/knowledge/edit-knowledge.po';
import statusBladeKnowledgeArticlePo from '../../pageobject/knowledge/status-blade-knowledge-article.po';
import changeAssignmentPo from '../../pageobject/common/change-assignment.po';

describe("Change Assignment", () => {

    beforeAll(async () => {
        await browser.get(BWF_BASE_URL);
        await loginPo.login("qkatawazi");
    });

    afterAll(async () => {
        await utilityCommon.closeAllBlades();
        await navigationPo.signOut();
    });

    //apurva
    it('[12179]:Verify Assignement Drop Down Values With Ascending Order', async () => {
        await navigationPo.gotoCreateCase();
        await createCasePo.selectRequester('adam');
        await createCasePo.setSummary('Summary');
        expect(await changeAssignmentPage.isDropDownListSorted("AssignedGroup")).toBeTruthy();
        expect(await changeAssignmentPage.isDropDownListSorted("Assignee")).toBeTruthy();
    });

    //apurva
    it('[12180]:Verify the dropdown options contains Full name and hierarchy + Full Name for all the Assignment Field Dropdowns', async () => {
        await navigationPo.gotoCreateCase();
        await createCasePo.selectRequester('adam');
        await createCasePo.setSummary('Summary');
        expect(await changeAssignmentPage.isValuePresentInDropDown("AssignedGroup", 'US Support 3')).toBeTruthy('Assigned Group Name is not present');
        await createCasePo.clickCancelButton();
        await utilityCommon.clickOnApplicationWarningYesNoButton("Yes");
        await navigationPo.gotoCreateCase();
        await createCasePo.selectRequester('adam');
        await createCasePo.setSummary('Summary');
        expect(await changeAssignmentPage.isFullHierarchyPresent("AssignedGroup", "US Support 3", 'Petramco > United States Support')).toBeTruthy('Assigned Group Full hierarchy is not present');
        await createCasePo.clickCancelButton();
        await utilityCommon.clickOnApplicationWarningYesNoButton("Yes");
        await navigationPo.gotoCreateCase();
        await createCasePo.selectRequester('adam');
        await createCasePo.setSummary('Summary');
        await changeAssignmentPage.setDropDownValue('AssignedGroup', 'US Support 3');
        let newArray: string = nth(await changeAssignmentPage.getAllDropDownValues("Assignee"), 1);
        expect(await newArray.includes('Adam Pavlik')).toBeTruthy('Adam Palvik Name is not available in Assignee');
        expect(await newArray.includes('apavlik@petramco.com')).toBeTruthy('Adam Palvik Email is not available in Assignee');
    });

    //apurva
    it('[12300]:Verify on Case Creation, if Assignment fields are enabled only when Requester is selected', async () => {
       await navigationPo.gotoCaseConsole();
        await navigationPo.gotoCreateCase();
        expect(await changeAssignmentPage.isFieldDisabled("AssignedGroup")).toBeTruthy('Failure1');
        expect(await changeAssignmentPage.isFieldDisabled("Assignee")).toBeTruthy('Failure2');
        await createCasePo.selectRequester('adam');
        await createCasePo.setSummary('Summary');
        expect(await changeAssignmentPage.isFieldDisabled("AssignedGroup")).toBeFalsy('Failure3');
        expect(await changeAssignmentPage.isFieldDisabled("Assignee")).toBeTruthy('Failure4');
    });

    //apurva
    describe('[12186]:[Adhoc Task] Verify all the Assignee fields are auto selected on the basis of Case', async () => {
        let randVal = [...Array(10)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        it('[12186]:[Adhoc Task] Verify all the Assignee fields are auto selected on the basis of Case', async () => {
            await navigationPo.gotoCreateCase();
            await createCasePo.selectRequester('adam');
            await createCasePo.setSummary('Summary');
            await changeAssignmentPage.setDropDownValue('AssignedGroup', 'US Support 3');
            await changeAssignmentPage.setDropDownValue('Assignee', 'Adam Pavlik');
            await createCasePo.clickSaveCaseButton();
            await previewCasePo.clickGoToCaseButton();
            expect(await viewCasePo.getAssignedGroupValue()).toBe('US Support 3');
            expect(await viewCasePo.getAssigneeText()).toBe('Adam Pavlik');
            await viewCasePo.clickAddTaskButton();
            await manageTaskBladePo.clickAddAdhocTaskButton();
            await adhoctaskTemplate.setSummary("AdHocSummary" + randVal);
            await adhoctaskTemplate.setDescription("Description");
            expect(await adhoctaskTemplate.getAssignedGroupText()).toBe('US Support 3');
            expect(await adhoctaskTemplate.getAssigneeValue()).toBe('Adam Pavlik');
            await adhoctaskTemplate.clickSaveAdhoctask();
            await utilityCommon.closePopUpMessage();
            await manageTaskBladePo.clickCloseButton();
            await utilityCommon.closePopUpMessage();
            await navigationPo.gotoTaskConsole();
            await utilityGrid.searchRecord("AdHocSummary" + randVal);
            expect(await utilityGrid.getFirstGridRecordColumnValue('Assigned Group')).toBe("US Support 3", "Assigned Group NOT displayed in Task console");
            expect(await utilityGrid.getFirstGridRecordColumnValue('Assignee')).toBe("Adam Pavlik", "Assigned Group NOT displayed in Task console");
        });
        it('[12186]:[Adhoc Task] Verify all the Assignee fields are auto selected on the basis of Case', async () => {
            await navigationPo.gotoCreateCase();
            await createCasePo.selectRequester('adam');
            await createCasePo.setSummary('Summary');
            await createCasePo.clickSaveCaseButton();
            await previewCasePo.clickGoToCaseButton();
            await viewCasePo.clickAddTaskButton();
            await manageTaskBladePo.clickAddAdhocTaskButton();
            await adhoctaskTemplate.setSummary("AdHocSummary2" + randVal);
            await adhoctaskTemplate.setDescription("Description");
            expect(await adhoctaskTemplate.getAssignedGroupText()).toBe('Workforce Administration');
            expect(await adhoctaskTemplate.getAssigneeValue()).toBe('Select');
            await adhoctaskTemplate.clickSaveAdhoctask();
            await utilityCommon.closePopUpMessage();
            await manageTaskBladePo.clickCloseButton();
            await utilityCommon.closePopUpMessage();
            await navigationPo.gotoTaskConsole();
            await utilityGrid.searchRecord("AdHocSummary2" + randVal);
            expect(await utilityGrid.getFirstGridRecordColumnValue('Assigned Group')).toBe("Workforce Administration", "Assigned Group NOT displayed in Task console");
            expect(await utilityGrid.getFirstGridRecordColumnValue('Assignee')).toBe("", "Assigned Group NOT displayed in Task console");
        });
        afterAll(async () => {
            await navigationPo.signOut();
            await loginPo.login('qkatawazi');
        });
    });

    //apurva
    describe('[4000005]:[Case Edit,Task Edit]Verify that all the values are sorted for Company, Support Org, SG and Company Dropdown', async () => {
        let randVal = [...Array(10)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        it('[4000005]:[Case Edit,Task Edit]Verify that all the values are sorted for Company, Support Org, SG and Company Dropdown', async () => {
            await navigationPo.gotoCreateCase();
            await createCasePo.selectRequester('adam');
            await createCasePo.setSummary('Summary');
            await changeAssignmentPo.setDropDownValue("AssignedGroup", "US Support 3");
            await changeAssignmentPo.setDropDownValue("Assignee", "Qadim Katawazi");
            await createCasePo.clickSaveCaseButton();
            await previewCasePo.clickGoToCaseButton();
            await viewCasePo.clickEditCaseButton();
            expect(await changeAssignmentPage.isDropDownListSorted("AssignedGroup")).toBeTruthy();
            expect(await changeAssignmentPage.isDropDownListSorted("Assignee")).toBeTruthy();
            await editCasePo.clickOnCancelCaseButton();
            await utilityCommon.clickOnApplicationWarningYesNoButton("Yes");
        });
        it('[4000005]:[Case Edit,Task Edit]Verify that all the values are sorted for Company, Support Org, SG and Company Dropdown', async () => {
            await viewCasePo.clickAddTaskButton();
            await manageTaskBladePo.clickAddAdhocTaskButton();
            await adhoctaskTemplate.setSummary("AdHocSummary1" + randVal);
            await adhoctaskTemplate.setDescription("Description");
            expect(await adhoctaskTemplate.isDropDownListSorted("AssignedGroup")).toBeTruthy();
            expect(await adhoctaskTemplate.isDropDownListSorted("Assignee")).toBeTruthy();
            await adhoctaskTemplate.clickSaveAdhoctask();
            await utilityCommon.closePopUpMessage();
            await manageTaskBladePo.clickCloseButton();
            await utilityCommon.closePopUpMessage();
            await navigationPo.gotoTaskConsole();
            await utilityGrid.searchAndOpenHyperlink("AdHocSummary1" + randVal);
            await viewTaskPo.clickOnEditTask();
            expect(await changeAssignmentPage.isDropDownListSorted("AssignedGroup")).toBeTruthy();
            expect(await changeAssignmentPage.isDropDownListSorted("Assignee")).toBeTruthy();
            await editTaskPo.clickOnCancelButton();
            await utilityCommon.clickOnApplicationWarningYesNoButton("Yes");
        });
        afterAll(async () => {
            await navigationPo.signOut();
            await loginPo.login('qkatawazi');
        });
    });

    it('[12301]:Verify Assignment Field Behaviour Accoriding to LOB Updation', async () => {
        await navigationPo.signOut();
        await loginPo.login("qyuan");
        await navigationPo.gotoCreateCase();
        await createCasePo.selectRequester('adam');
        expect(await createCasePo.getLineOfBusinessValue()).toBe('Human Resource');
        await createCasePo.clickCancelButton();
        await utilityCommon.clickOnApplicationWarningYesNoButton("Yes");
        await navigationPo.gotoCreateCase();
        await createCasePo.selectRequester('adam');
        expect(await changeAssignmentPage.isFieldDisabled("Assignee")).toBeTruthy('Failure1');
        await changeAssignmentPage.setDropDownValue("AssignedGroup", 'US Support 3');
        await changeAssignmentPage.setDropDownValue("Assignee", 'Adam Pavlik');
        expect(await changeAssignmentPage.getDropDownValue("AssignedGroup")).toBe('US Support 3');
        expect(await changeAssignmentPage.getDropDownValue("Assignee")).toBe('Adam Pavlik');
        await createCasePo.selectLineOfBusiness('Facilities');
        await createCasePo.clickCancelButton();
        await utilityCommon.clickOnApplicationWarningYesNoButton("Yes");
        await navigationPo.gotoCreateCase();
        await createCasePo.selectRequester('adam');
        await createCasePo.setSummary('Summary');
        await createCasePo.selectLineOfBusiness('Facilities');
        expect(await changeAssignmentPage.isFieldDisabled("Assignee")).toBeTruthy('Failure2');
        await changeAssignmentPage.setDropDownValue("AssignedGroup", 'Facilities');
        await changeAssignmentPage.setDropDownValue("Assignee", 'Fritz Schulz');
        expect(await changeAssignmentPage.getDropDownValue("AssignedGroup")).toBe('Facilities');
        expect(await changeAssignmentPage.getDropDownValue("Assignee")).toBe('Fritz Schulz');
    });
    
    it('[12302]:Verify Assignee Behaviour After Change LOB Of Person', async () => {
        await navigationPo.signOut();
        await loginPo.login("qyuan");
        await navigationPo.gotoCreateCase();
        await createCasePo.selectRequester('adam');
        await createCasePo.setSummary('Summary');
        expect(await createCasePo.getLineOfBusinessValue()).toBe('Human Resource');
        await changeAssignmentPage.setDropDownValue("AssignedGroup", 'US Support 3');
        await changeAssignmentPage.setDropDownValue("Assignee", 'Adam Pavlik');
        expect(await changeAssignmentPage.getDropDownValue("AssignedGroup")).toBe('US Support 3');
        expect(await changeAssignmentPage.getDropDownValue("Assignee")).toBe('Adam Pavlik');
        await createCasePo.selectLineOfBusiness('Facilities');
        expect(await changeAssignmentPage.getDropDownValue("AssignedGroup")).toBe('Select');
        expect(await changeAssignmentPage.getDropDownValue("Assignee")).toBe('Select');
    });

    describe('[4000006]:Verify on clearing or reselecting of any field should clear the Child fields but not the Parent field', async () => {
        it('[4000006]:Verify on clearing or reselecting of any field should clear the Child fields but not the Parent field', async () => {
            await navigationPo.signOut();
            await loginPo.login('morwenna'); //Require 2 company access user
            await navigationPo.gotoCreateCase();
            await createCasePo.selectRequester('adam');
            await createCasePo.setSummary('Summary');
            // When all the fields are filled 
            await changeAssignmentPage.setDropDownValue("AssignedGroup", 'Budgeting & Forecasting');
            await changeAssignmentPage.setDropDownValue("Assignee", 'Monika Andrade');
            expect(await changeAssignmentPage.getDropDownValue("AssignedGroup")).toBe('Budgeting & Forecasting');
            expect(await changeAssignmentPage.getDropDownValue("Assignee")).toBe('Monika Andrade');
            await changeAssignmentPage.setDropDownValue("AssignedGroup", 'Budgeting & Forecasting');
            await changeAssignmentPage.setDropDownValue("Assignee", 'Moses Werner');
            expect(await changeAssignmentPage.getDropDownValue("AssignedGroup")).toBe('Budgeting & Forecasting');
            expect(await changeAssignmentPage.getDropDownValue("Assignee")).toBe('Moses Werner');
            await changeAssignmentPage.setDropDownValue("Assignee", 'None');
            expect(await changeAssignmentPage.getDropDownValue("AssignedGroup")).toBe('Budgeting & Forecasting');
            expect(await changeAssignmentPage.getDropDownValue("Assignee")).toBe('Select');
            await changeAssignmentPage.clickAssignToMeBtn();
            expect(await changeAssignmentPage.getDropDownValue("AssignedGroup")).toBe('Budgeting & Forecasting');
            expect(await changeAssignmentPage.getDropDownValue("Assignee")).toBe('Morwenna Rosales');
            
            await changeAssignmentPage.setDropDownValue("AssignedGroup", 'Accounts Receivable (AR)');
            await changeAssignmentPage.setDropDownValue("Assignee", 'Moses Werner');
            
            expect(await changeAssignmentPage.getDropDownValue("AssignedGroup")).toBe('Accounts Receivable (AR)');
            expect(await changeAssignmentPage.getDropDownValue("Assignee")).toBe('Moses Werner');
            await changeAssignmentPage.clickAssignToMeBtn();
            await changeAssignmentPage.setDropDownValue("AssignedGroup", 'None');
            expect(await changeAssignmentPage.getDropDownValue("AssignedGroup")).toBe('Select');
            expect(await changeAssignmentPage.getDropDownValue("Assignee")).toBe('Select');
            await changeAssignmentPage.clickAssignToMeBtn();
            expect(await changeAssignmentPage.getDropDownValue("AssignedGroup")).toBe('Accounting & Reporting (Controller Group)');
            expect(await changeAssignmentPage.getDropDownValue("Assignee")).toBe('Morwenna Rosales');
        });
        it('[4000006]:Verify on clearing or reselecting of any field should clear the Child fields but not the Parent field', async () => {
            //When Assignee is blank 
            await changeAssignmentPage.clickAssignToMeBtn();
            await changeAssignmentPage.setDropDownValue("Assignee", 'None');
            expect(await changeAssignmentPage.getDropDownValue("AssignedGroup")).toBe('Accounting & Reporting (Controller Group)');
            expect(await changeAssignmentPage.getDropDownValue("Assignee")).toBe('Select');
            await changeAssignmentPage.setDropDownValue("AssignedGroup", 'None');
            expect(await changeAssignmentPage.getDropDownValue("AssignedGroup")).toBe('Select');
            expect(await changeAssignmentPage.getDropDownValue("Assignee")).toBe('Select');
            await changeAssignmentPage.clickAssignToMeBtn();
            expect(await changeAssignmentPage.getDropDownValue("AssignedGroup")).toBe('Accounting & Reporting (Controller Group)');
            expect(await changeAssignmentPage.getDropDownValue("Assignee")).toBe('Morwenna Rosales');
            await changeAssignmentPage.clickAssignToMeBtn();
            await changeAssignmentPage.setDropDownValue("Assignee", 'None');
            expect(await changeAssignmentPage.getDropDownValue("AssignedGroup")).toBe('Accounting & Reporting (Controller Group)');
            expect(await changeAssignmentPage.getDropDownValue("Assignee")).toBe('Select');
            await changeAssignmentPage.setDropDownValue("AssignedGroup", 'Accounts Receivable (AR)');
            expect(await changeAssignmentPage.getDropDownValue("AssignedGroup")).toBe('Accounts Receivable (AR)');
            expect(await changeAssignmentPage.getDropDownValue("Assignee")).toBe('Select');
            await changeAssignmentPage.clickAssignToMeBtn();
            expect(await changeAssignmentPage.getDropDownValue("AssignedGroup")).toBe('Accounts Receivable (AR)');
            expect(await changeAssignmentPage.getDropDownValue("Assignee")).toBe('Morwenna Rosales');
        });
        it('[4000006]:Verify on clearing or reselecting of any field should clear the Child fields but not the Parent field', async () => {
            //When SG and Assignee are blank
            await changeAssignmentPage.clickAssignToMeBtn();
            await changeAssignmentPage.setDropDownValue("AssignedGroup", 'None');
            expect(await changeAssignmentPage.getDropDownValue("AssignedGroup")).toBe('Select');
            expect(await changeAssignmentPage.getDropDownValue("Assignee")).toBe('Select');
            await changeAssignmentPage.clickAssignToMeBtn();
            expect(await changeAssignmentPage.getDropDownValue("AssignedGroup")).toBe('Accounting & Reporting (Controller Group)');
            expect(await changeAssignmentPage.getDropDownValue("Assignee")).toBe('Morwenna Rosales');
            await changeAssignmentPage.clickAssignToMeBtn();
            await changeAssignmentPage.setDropDownValue("AssignedGroup", 'None');
            expect(await changeAssignmentPage.getDropDownValue("AssignedGroup")).toBe('Select');
            expect(await changeAssignmentPage.getDropDownValue("Assignee")).toBe('Select');
            await changeAssignmentPage.clickAssignToMeBtn();
            expect(await changeAssignmentPage.getDropDownValue("AssignedGroup")).toBe('Accounting & Reporting (Controller Group)');
            expect(await changeAssignmentPage.getDropDownValue("Assignee")).toBe('Morwenna Rosales');
            //When user reselects Same Details --> All Children remain populated as it is
            
            await changeAssignmentPage.setDropDownValue('AssignedGroup', 'Phylum Support Group2');
            await changeAssignmentPage.setDropDownValue("Assignee", 'Morwenna Rosales');
            expect(await changeAssignmentPage.getDropDownValue("AssignedGroup")).toBe('Phylum Support Group2');
            expect(await changeAssignmentPage.getDropDownValue("Assignee")).toBe('Morwenna Rosales');
            
            await changeAssignmentPage.setDropDownValue('AssignedGroup', 'DE Support 3');
            await changeAssignmentPage.setDropDownValue('Assignee', 'Alexei Stukov');
            expect(await changeAssignmentPage.getDropDownValue("AssignedGroup")).toBe('DE Support 3');
            expect(await changeAssignmentPage.getDropDownValue("Assignee")).toBe('Alexei Stukov');
        });
        afterAll(async () => {
            await navigationPo.signOut();
            await loginPo.login('qkatawazi');
        });

    });

    //Raised defect: DRDMV-25147
    describe('[4000007]:Verify that if Agent has only Read only access on Case/Task/Knowledge', async () => {
        let caseID, KADetails, articleData, randVal = [...Array(10)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        beforeAll(async () => {
            await apiHelper.apiLogin('qkatawazi');
            articleData = {
                "knowledgeSet": "HR",
                "title": 'knowledge' + randVal,
                "templateId": "AGGAA5V0HGVMIAOK2JE7O965BK1BJW",
                "assignedCompany": "Petramco",
                "assigneeBusinessUnit": "United States Support",
                "assigneeSupportGroup": "US Support 3",
                "assignee": "qkatawazi"
            }
            KADetails = await apiHelper.createKnowledgeArticle(articleData);
        });

        it('[4000007]:Create case and add task', async () => {
            await navigationPo.gotoCreateCase();
            await createCasePo.selectRequester('apavlik');
            await createCasePo.setSummary('Test case for inProgress task');
            await changeAssignmentPage.setAssignee("US Support 3", "qkatawazi");
            await createCasePo.clickSaveCaseButton();
            await previewCasePo.clickGoToCaseButton();
            caseID = await viewCasePo.getCaseID();

            await viewCasePo.clickOnTab('Case Access');
            await accessTabPo.clickToExpandAccessEntitiySearch('Agent Access', 'Case');
            await accessTabPo.selectAgent('qtao', 'Agent');
            await accessTabPo.clickAccessEntitiyAddButton('Agent');

            await viewCasePo.clickOnTab('Tasks');
            await viewCasePo.clickAddTaskButton();
            await manageTaskBladePo.clickAddAdhocTaskButton();
            await adhoctaskTemplate.setSummary(randVal + "manualTask");
            await adhoctaskTemplate.selectPriority('Low');
            await adhoctaskTemplate.clickSaveAdhoctask();
            await utilityCommon.closePopUpMessage();
            await manageTaskBladePo.clickCloseButton(); 
        });

        it('[4000007]:Verify that if Agent has only Read only access on Case/Task/Knowledge', async () => {
            await navigationPo.gotoCaseConsole();
            await utilityGrid.clearFilter();
            await utilityGrid.searchAndOpenHyperlink(caseID);
            expect(await viewCasePo.isEditAssignmenetDisabled()).toBeFalsy();
            expect(await viewCasePo.isAssignToMeDisabled()).toBeFalsy();
            await viewCasePo.clickEditCaseButton();
            expect(await changeAssignmentPage.isFieldDisabled("AssignedGroup")).toBeFalsy();
            expect(await changeAssignmentPage.isFieldDisabled("Assignee")).toBeFalsy();
            expect(await changeAssignmentPage.isFieldDisabled("AssignToMe")).toBeFalsy();
            await editCasePo.clickOnCancelCaseButton();
            await utilityCommon.clickOnApplicationWarningYesNoButton("Yes");
            await navigationPo.gotoTaskConsole();
            await utilityGrid.searchAndOpenHyperlink(randVal + "manualTask");
            expect(await viewTaskPo.isEditAssignmentDisabled()).toBeFalsy();
            expect(await viewTaskPo.isAssignToMeDisabled()).toBeFalsy();
            await viewTaskPo.clickOnEditTask();
            expect(await changeAssignmentPage.isFieldDisabled("AssignedGroup")).toBeFalsy();
            expect(await changeAssignmentPage.isFieldDisabled("Assignee")).toBeFalsy();
            expect(await changeAssignmentPage.isFieldDisabled("AssignToMe")).toBeFalsy();
            await editTaskPo.clickOnCancelButton();
            await utilityCommon.clickOnApplicationWarningYesNoButton("Yes");
            await navigationPo.gotoKnowledgeConsole();
            await utilityGrid.clearFilter();
            await utilityGrid.searchAndOpenHyperlink(articleData.title);
            await viewKnowledgeArticlePo.clickEditKnowledgeAccess();
            await accessTabPo.clickToExpandAccessEntitiySearch('Agent Access', 'Knowledge');
            await accessTabPo.selectAgent('qtao', 'Agent');
            await accessTabPo.clickAccessEntitiyAddButton('Agent');
            await accessTabPo.clickCloseKnowledgeAccessBlade();
            await viewKnowledgeArticlePo.clickEditKnowledgeMedataData();
            expect(await changeAssignmentPage.isFieldDisabled("AssignedGroup")).toBeFalsy();
            expect(await changeAssignmentPage.isFieldDisabled("Assignee")).toBeFalsy();
            expect(await changeAssignmentPage.isFieldDisabled("AssignToMe")).toBeFalsy();
            await apiHelper.apiLogin('qkatawazi');
            expect(await apiHelper.updateKnowledgeArticleStatus(KADetails.id, "Draft")).toBeTruthy("Article with Draft status not updated.");
            await editKnowledgePo.setKnowledgeStatusWithoutSave("SME Review");
            expect(await changeAssignmentPage.isFieldDisabled("AssignedGroup")).toBeFalsy();
            expect(await changeAssignmentPage.isFieldDisabled("Assignee")).toBeFalsy();
            expect(await changeAssignmentPage.isFieldDisabled("AssignToMe")).toBeFalsy();
            await editKnowledgePo.clickCancelStatusBtn();
            await utilityCommon.clickOnApplicationWarningYesNoButton("Yes");
        });

        it('[4000007]:Verify that if Agent has only Read only access on Case/Task/Knowledge', async () => {
            await navigationPo.signOut();
            await loginPo.login("qtao");
            await navigationPo.gotoCaseConsole();
            await utilityGrid.clearFilter();
            await utilityGrid.searchAndOpenHyperlink(caseID);
            await viewCasePo.clickOnTaskLink(randVal + "manualTask");
            expect(await viewTaskPo.isEditAssignmentDisplayed()).toBeFalsy();
            expect(await viewTaskPo.isAssignToMeDisabled()).toBeTruthy();
            await viewTaskPo.clickOnEditTask();
            expect(await changeAssignmentPage.isFieldDisabled("AssignedGroup")).toBeTruthy();
            expect(await changeAssignmentPage.isFieldDisabled("Assignee")).toBeTruthy();
            expect(await changeAssignmentPage.isFieldDisabled("AssignToMe")).toBeTruthy();
            await editTaskPo.clickOnCancelButton();
            await utilityCommon.clickOnApplicationWarningYesNoButton("Yes");
            await viewTaskPo.clickOnViewCase();
            await viewCasePo.clickEditCaseButton();
            expect(await changeAssignmentPage.isFieldDisabled("AssignedGroup")).toBeTruthy();
            expect(await changeAssignmentPage.isFieldDisabled("Assignee")).toBeTruthy();
            expect(await changeAssignmentPage.isFieldDisabled("AssignToMe")).toBeTruthy();
            await editCasePo.clickOnCancelCaseButton();
            await utilityCommon.clickOnApplicationWarningYesNoButton("Yes");
            expect(await viewCasePo.isEditAssignmentDisplayed()).toBeFalsy();

            expect(await viewCasePo.isAssignToMeDisabled()).toBeTruthy();
            await navigationPo.gotoKnowledgeConsole();
            await utilityGrid.clearFilter();
            await utilityGrid.searchAndOpenHyperlink(articleData.title);
            await viewKnowledgeArticlePo.clickEditKnowledgeMedataData();
            expect(await changeAssignmentPage.isFieldDisabled("AssignedGroup")).toBeTruthy();
            expect(await changeAssignmentPage.isFieldDisabled("Assignee")).toBeTruthy();
            expect(await changeAssignmentPage.isFieldDisabled("AssignToMe")).toBeTruthy();
        });
    });

    it('[12181,12297]:Verify Assignement Drop Down Values Displayed According to Parent Drop Down', async () => {
        await navigationPo.gotoCaseConsole();
        await navigationPo.gotoCreateCase();
        await createCasePo.selectRequester('adam');
        await createCasePo.setSummary('Summary');
        await changeAssignmentPage.setDropDownValue('AssignedGroup', 'US Support 3');
        expect(await changeAssignmentPage.isValuePresentInDropDown("Assignee", 'Qadim Katawazi')).toBeTruthy('Assignee is not present');
        expect(await changeAssignmentPage.isValuePresentInDropDown("Assignee", 'Qianru Tao')).toBeFalsy('Assignee is present');
        expect(await changeAssignmentPage.isValuePresentInDropDown("Assignee", 'Qadim')).toBeTruthy('Assignee is not searchable with First Name');
        expect(await changeAssignmentPage.isValuePresentInDropDown("Assignee", 'Katawazi')).toBeTruthy('Assignee is not searchable with Last Name');
        expect(await changeAssignmentPage.isValuePresentInDropDown("Assignee", 'qkatawazi')).toBeTruthy('Assignee is not searchable with login id');
        expect(await changeAssignmentPage.isValuePresentInDropDown("Assignee", 'qkatawazi@petramco.com')).toBeTruthy('Assignee is not searchable with email');
        expect(await changeAssignmentPage.isValuePresentInDropDown("Assignee", 'adim')).toBeTruthy('Assignee is not searchable with Last 4 characters of Name');
        expect(await changeAssignmentPage.isValuePresentInDropDown("Assignee", 'Qad')).toBeTruthy('Assignee is not searchable with first 3 characters of Name');
        expect(await changeAssignmentPage.isValuePresentInDropDown("Assignee", 'tawaz')).toBeTruthy('Assignee is not searchable with middle characters');
        expect(await changeAssignmentPage.isValuePresentInDropDown("Assignee", 'Qadima')).toBeFalsy('Assignee is searchable with Wrong name');
        await changeAssignmentPage.setDropDownValue('AssignedGroup', 'None');
        expect(await changeAssignmentPage.isValuePresentInDropDown("AssignedGroup", 'US Support 1')).toBeTruthy('Assigned Group is not searchable with name');
        expect(await changeAssignmentPage.isValuePresentInDropDown("AssignedGroup", 'US')).toBeTruthy('Assigned Group is not searchable with first characters');
        expect(await changeAssignmentPage.isValuePresentInDropDown("AssignedGroup", 'Support')).toBeTruthy('Assigned Group is not searchable with middle word');
        expect(await changeAssignmentPage.isValuePresentInDropDown("AssignedGroup", 'upport 1')).toBeTruthy('Assigned Group is not searchable with last characters');
        expect(await changeAssignmentPage.isValuePresentInDropDown("AssignedGroup", '1')).toBeTruthy('Assigned Group is not searchable with last word');
        expect(await changeAssignmentPage.isValuePresentInDropDown("AssignedGroup", 'port')).toBeTruthy('Assigned Group is not searchable with middle characters');
    });

    it('[12303]:Verify User behaviour With Assignment and Associated Configuration', async () => {
        await navigationPo.gotoCaseConsole();
        await navigationPo.gotoCreateCase();
        await createCasePo.selectRequester('adam');
        await createCasePo.setSummary('Summary');

        //Validating the Agent is not available if Assignment Availability is set as NO for that Agent
        await changeAssignmentPage.setDropDownValue('AssignedGroup', 'Risk Management');
        expect(await changeAssignmentPage.isValuePresentInDropDown("Assignee", 'Polar White')).toBeFalsy('Assignee is searchable');

        //Validating the Agent is not available if Assignment Availability of Agent is set to Yes but for SG, Assignment Availability of Agent is set to NO
        await changeAssignmentPage.setDropDownValue('AssignedGroup', 'Risk Management');
        expect(await changeAssignmentPage.isValuePresentInDropDown("Assignee", 'Quin Strong')).toBeFalsy('Assignee is searchable');
    });
    
});