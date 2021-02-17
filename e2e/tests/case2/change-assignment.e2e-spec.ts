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
    it('[12179]:Verify that all the values are sorted for Company, Support Org, SG and Company Dropdown', async () => {
        await navigationPo.gotoCreateCase();
        await createCasePo.selectRequester('adam');
        await createCasePo.setSummary('Summary');
        expect(await changeAssignmentPage.isDropDownListSorted("Company")).toBeTruthy();
        expect(await changeAssignmentPage.isDropDownListSorted("SupportOrg")).toBeTruthy();
        expect(await changeAssignmentPage.isDropDownListSorted("AssignedGroup")).toBeTruthy();
        expect(await changeAssignmentPage.isDropDownListSorted("Assignee")).toBeTruthy();
    });

    //apurva
    it('[12180]:Verify the dropdown options contains Full name and hierarchy + Full Name for all the Assignment Field Dropdowns', async () => {
        await navigationPo.gotoCreateCase();
        await createCasePo.selectRequester('adam');
        await createCasePo.setSummary('Summary');
        expect(await changeAssignmentPage.getDropDownValue("Company")).toBe('Select');
        await changeAssignmentPage.setDropDownValue('SupportOrg', 'United States Support');
        expect(await changeAssignmentPage.isValuePresentInDropDown("SupportOrg", 'United States Support')).toBeTruthy('Support Org Name is not present');
        expect(await changeAssignmentPage.isFullHierarchyPresent("SupportOrg", "United States Support", 'Petramco > United States Support')).toBeTruthy('Support Org Full hierarchy is not present');
        expect(await changeAssignmentPage.isValuePresentInDropDown("AssignedGroup", 'Petramco > United States Support > US Support 3')).toBeTruthy('Assigned Group Name is not present');
        expect(await changeAssignmentPage.isFullHierarchyPresent("AssignedGroup", "US Support 3", 'Petramco > United States Support > US Support 3')).toBeTruthy('Assigned Group Full hierarchy is not present');
        await createCasePo.clickCancelButton();
        await utilityCommon.clickOnApplicationWarningYesNoButton("Yes");
        await navigationPo.gotoCreateCase();
        await createCasePo.selectRequester('adam');
        await createCasePo.setSummary('Summary');
        await changeAssignmentPage.setDropDownValue('SupportOrg', 'United States Support');
        await changeAssignmentPage.setDropDownValue('AssignedGroup', 'US Support 3');
        let newArray: string = nth(await changeAssignmentPage.getAllDropDownValues("Assignee"), 1);
        expect(await newArray.includes('Adam Pavlik')).toBeTruthy('Adam Palvik Name is not available in Assignee');
        expect(await newArray.includes('apavlik@petramco.com')).toBeTruthy('Adam Palvik Email is not available in Assignee');
        expect(await newArray.includes('Petramco > United States Support > US Support 3')).toBeTruthy('Adam Palvik Full hierarchy is not available in Assignee');
    });

    //apurva
    it('[4000003]:Verify on Case Creation, if Assignment fields are enabled only when Requester is selected', async () => {
        await navigationPo.gotoCreateCase();
        expect(await changeAssignmentPage.isFieldDisabled("Company")).toBeTruthy();
        expect(await changeAssignmentPage.isFieldDisabled("SupportOrg")).toBeTruthy();
        expect(await changeAssignmentPage.isFieldDisabled("AssignedGroup")).toBeTruthy();
        expect(await changeAssignmentPage.isFieldDisabled("Assignee")).toBeTruthy();
        await createCasePo.selectRequester('adam');
        await createCasePo.setSummary('Summary');
        expect(await changeAssignmentPage.isFieldDisabled("Company")).toBeFalsy();
        expect(await changeAssignmentPage.isFieldDisabled("SupportOrg")).toBeFalsy();
        expect(await changeAssignmentPage.isFieldDisabled("AssignedGroup")).toBeFalsy();
        expect(await changeAssignmentPage.isFieldDisabled("Assignee")).toBeFalsy();
    });

    //apurva
    describe('[12186]:[Adhoc Task] Verify all the Assignee fields are auto selected on the basis of Case', async () => {
        let randVal = [...Array(10)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        it('[12186]:[Adhoc Task] Verify all the Assignee fields are auto selected on the basis of Case', async () => {
            await navigationPo.gotoCreateCase();
            await createCasePo.selectRequester('adam');
            await createCasePo.setSummary('Summary');
            expect(await changeAssignmentPage.getDropDownValue("Company")).toBe('Petramco');
            await changeAssignmentPage.setDropDownValue('SupportOrg', 'United States Support');
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
            expect(await adhoctaskTemplate.getCompanyValue()).toBe('Petramco');
            expect(await adhoctaskTemplate.getAssigneeValue()).toBe('Adam Pavlik');
            await adhoctaskTemplate.clickSaveAdhoctask();
            await utilityCommon.closePopUpMessage();
            await manageTaskBladePo.clickCloseButton();
            await utilityCommon.closePopUpMessage();
            await navigationPo.gotoTaskConsole();
            await utilityGrid.searchRecord("AdHocSummary1" + randVal);
            expect(await utilityGrid.getFirstGridRecordColumnValue('Assigned Group')).toBe("US Support 3", "Assigned Group NOT displayed in Task console");
            expect(await utilityGrid.getFirstGridRecordColumnValue('Assignee')).toBe("Adam Pavlik", "Assigned Group NOT displayed in Task console");
        });
        it('[12186]:[Adhoc Task] Verify all the Assignee fields are auto selected on the basis of Case', async () => {
            await navigationPo.gotoCreateCase();
            await createCasePo.selectRequester('adam');
            await createCasePo.setSummary('Summary');
            expect(await changeAssignmentPage.getDropDownValue("Company")).toBe('Petramco');
            await createCasePo.clickSaveCaseButton();
            await previewCasePo.clickGoToCaseButton();
            await viewCasePo.clickAddTaskButton();
            await manageTaskBladePo.clickAddAdhocTaskButton();
            await adhoctaskTemplate.setSummary("AdHocSummary2" + randVal);
            await adhoctaskTemplate.setDescription("Description");
            expect(await adhoctaskTemplate.getAssignedGroupText()).toBe('Workforce Administration');
            expect(await adhoctaskTemplate.getCompanyValue()).toBe('Petramco');
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
    });

    //apurva
    describe('[4000005]:[Case Edit,Task Edit]Verify that all the values are sorted for Company, Support Org, SG and Company Dropdown', async () => {
        let randVal = [...Array(10)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        it('[4000005]:[Case Edit,Task Edit]Verify that all the values are sorted for Company, Support Org, SG and Company Dropdown', async () => {
            await navigationPo.gotoCreateCase();
            await createCasePo.selectRequester('adam');
            await createCasePo.setSummary('Summary');
            await createCasePo.clickAssignToMeButton();
            await createCasePo.clickSaveCaseButton();
            await previewCasePo.clickGoToCaseButton();
            await viewCasePo.clickEditCaseButton();
            expect(await changeAssignmentPage.isDropDownListSorted("Company")).toBeTruthy();
            expect(await changeAssignmentPage.isDropDownListSorted("SupportOrg")).toBeTruthy();
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
            expect(await adhoctaskTemplate.isDropDownListSorted("Company")).toBeTruthy();
            expect(await adhoctaskTemplate.isDropDownListSorted("SupportOrg")).toBeTruthy();
            expect(await adhoctaskTemplate.isDropDownListSorted("AssignedGroup")).toBeTruthy();
            expect(await adhoctaskTemplate.isDropDownListSorted("Assignee")).toBeTruthy();
            await adhoctaskTemplate.clickSaveAdhoctask();
            await utilityCommon.closePopUpMessage();
            await manageTaskBladePo.clickCloseButton();
            await utilityCommon.closePopUpMessage();
            await navigationPo.gotoTaskConsole();
            await utilityGrid.searchAndOpenHyperlink("AdHocSummary1" + randVal);
            await viewTaskPo.clickOnEditTask();
            expect(await changeAssignmentPage.isDropDownListSorted("Company")).toBeTruthy();
            expect(await changeAssignmentPage.isDropDownListSorted("SupportOrg")).toBeTruthy();
            expect(await changeAssignmentPage.isDropDownListSorted("AssignedGroup")).toBeTruthy();
            expect(await changeAssignmentPage.isDropDownListSorted("Assignee")).toBeTruthy();
            await editTaskPo.clickOnCancelButton();
            await utilityCommon.clickOnApplicationWarningYesNoButton("Yes");
        });
    });

    describe('[12182]:Verify if child field is selected, all the parent fields are Auto selected and parent fields are partially selected then remaining fields are Auto selected', async () => {
        it('[12182]:Verify if child field is selected, all the parent fields are Auto selected and parent fields are partially selected then remaining fields are Auto selected', async () => {
            await navigationPo.gotoCreateCase();
            await createCasePo.selectRequester('adam');
            await createCasePo.setSummary('Summary');
            expect(await changeAssignmentPage.getDropDownValue("Company")).toBe('None');
            await changeAssignmentPage.setDropDownValue("Assignee", 'Adam Pavlik');
            expect(await changeAssignmentPage.getDropDownValue("Company")).toBe('Petramco');
            expect(await changeAssignmentPage.getDropDownValue("SupportOrg")).toBe('United States Support');
            expect(await changeAssignmentPage.getDropDownValue("AssignedGroup")).toBe('US Support 3');
            expect(await changeAssignmentPage.getDropDownValue("Assignee")).toBe('Adam Pavlik');
        });
        it('[12182]:Verify if child field is selected, all the parent fields are Auto selected and parent fields are partially selected then remaining fields are Auto selected', async () => {
            await changeAssignmentPage.setDropDownValue('Company', 'None');
            await changeAssignmentPage.setDropDownValue('SupportOrg', 'United States Support');
            expect(await changeAssignmentPage.getDropDownValue("Company")).toBe('Petramco');
            expect(await changeAssignmentPage.getDropDownValue("SupportOrg")).toBe('United States Support');
            expect(await changeAssignmentPage.getDropDownValue("AssignedGroup")).toBe('Select');
            expect(await changeAssignmentPage.getDropDownValue("Assignee")).toBe('Select');
        });
        it('[12182]:Verify if child field is selected, all the parent fields are Auto selected and parent fields are partially selected then remaining fields are Auto selected', async () => {
            await changeAssignmentPage.setDropDownValue('Company', 'None');
            await changeAssignmentPage.setDropDownValue('AssignedGroup', 'US Support 3');
            expect(await changeAssignmentPage.getDropDownValue("Company")).toBe('Petramco');
            expect(await changeAssignmentPage.getDropDownValue("SupportOrg")).toBe('United States Support');
            expect(await changeAssignmentPage.getDropDownValue("AssignedGroup")).toBe('US Support 3');
            expect(await changeAssignmentPage.getDropDownValue("Assignee")).toBe('Select');
            await changeAssignmentPage.setDropDownValue('Company', 'Petramco');
            await changeAssignmentPage.setDropDownValue('Assignee', 'Adam Pavlik');
            expect(await changeAssignmentPage.getDropDownValue("Company")).toBe('Petramco');
            expect(await changeAssignmentPage.getDropDownValue("SupportOrg")).toBe('United States Support');
            expect(await changeAssignmentPage.getDropDownValue("AssignedGroup")).toBe('US Support 1');
            expect(await changeAssignmentPage.getDropDownValue("Assignee")).toBe('Adam Pavlik');
        });
        it('[12182]:Verify if child field is selected, all the parent fields are Auto selected and parent fields are partially selected then remaining fields are Auto selected', async () => {
            await changeAssignmentPage.setDropDownValue('Company', 'None');
            await changeAssignmentPage.setDropDownValue('Company', 'Petramco');
            await changeAssignmentPage.setDropDownValue('AssignedGroup', 'AU Support 1');
            expect(await changeAssignmentPage.getDropDownValue("Company")).toBe('Petramco');
            expect(await changeAssignmentPage.getDropDownValue("SupportOrg")).toBe('Australia Support');
            expect(await changeAssignmentPage.getDropDownValue("AssignedGroup")).toBe('AU Support 1');
            expect(await changeAssignmentPage.getDropDownValue("Assignee")).toBe('Select');
            await changeAssignmentPage.setDropDownValue('Company', 'None');
            await changeAssignmentPage.setDropDownValue('Company', 'Petramco');
            await changeAssignmentPage.setDropDownValue('SupportOrg', 'Australia Support');
            await changeAssignmentPage.setDropDownValue('Assignee', 'Qadim Katawazi');
            expect(await changeAssignmentPage.getDropDownValue("Company")).toBe('Petramco');
            expect(await changeAssignmentPage.getDropDownValue("SupportOrg")).toBe('Australia Support');
            expect(await changeAssignmentPage.getDropDownValue("AssignedGroup")).toBe('AU Support 1');
            expect(await changeAssignmentPage.getDropDownValue("Assignee")).toBe('Qadim Katawazi');
        });
    });

    describe('[4000006]:Verify on clearing or reselecting of any field should clear the Child fields but not the Parent field', async () => {
        it('[4000006]:Verify on clearing or reselecting of any field should clear the Child fields but not the Parent field', async () => {
            await navigationPo.signOut();
            await loginPo.login('qkatawazi'); //Require 2 company access user
            await navigationPo.gotoCreateCase();
            await createCasePo.selectRequester('adam');
            await createCasePo.setSummary('Summary');
            // When all the fields are filled 
            await changeAssignmentPage.setDropDownValue("Assignee", 'Adam Pavlik');
            expect(await changeAssignmentPage.getDropDownValue("Company")).toBe('Petramco');
            expect(await changeAssignmentPage.getDropDownValue("SupportOrg")).toBe('United States Support');
            expect(await changeAssignmentPage.getDropDownValue("AssignedGroup")).toBe('US Support 3');
            expect(await changeAssignmentPage.getDropDownValue("Assignee")).toBe('Adam Pavlik');
            await changeAssignmentPage.setDropDownValue("Assignee", 'Kyle Kohri');
            expect(await changeAssignmentPage.getDropDownValue("Company")).toBe('Petramco');
            expect(await changeAssignmentPage.getDropDownValue("SupportOrg")).toBe('United States Support');
            expect(await changeAssignmentPage.getDropDownValue("AssignedGroup")).toBe('US Support 3');
            expect(await changeAssignmentPage.getDropDownValue("Assignee")).toBe('Kyle Kohri');
            await changeAssignmentPage.setDropDownValue("Assignee", 'None');
            expect(await changeAssignmentPage.getDropDownValue("Company")).toBe('Petramco');
            expect(await changeAssignmentPage.getDropDownValue("SupportOrg")).toBe('United States Support');
            expect(await changeAssignmentPage.getDropDownValue("AssignedGroup")).toBe('US Support 3');
            expect(await changeAssignmentPage.getDropDownValue("Assignee")).toBe('Select');
            await changeAssignmentPage.setDropDownValue("SupportOrg", 'Australia Support');
            expect(await changeAssignmentPage.getDropDownValue("Company")).toBe('Petramco');
            expect(await changeAssignmentPage.getDropDownValue("SupportOrg")).toBe('Australia Support');
            expect(await changeAssignmentPage.getDropDownValue("AssignedGroup")).toBe('Select');
            expect(await changeAssignmentPage.getDropDownValue("Assignee")).toBe('Select');
            await changeAssignmentPage.setDropDownValue("Company", 'None');
            await changeAssignmentPage.clickAssignToMeBtn();
            await changeAssignmentPage.setDropDownValue("SupportOrg", 'None');
            expect(await changeAssignmentPage.getDropDownValue("Company")).toBe('Petramco');
            expect(await changeAssignmentPage.getDropDownValue("SupportOrg")).toBe('Select');
            expect(await changeAssignmentPage.getDropDownValue("AssignedGroup")).toBe('Select');
            expect(await changeAssignmentPage.getDropDownValue("Assignee")).toBe('Select');
            await changeAssignmentPage.setDropDownValue("Assignee", 'Adam Warlock');
            await changeAssignmentPage.setDropDownValue("AssignedGroup", 'AU Support 2');
            expect(await changeAssignmentPage.getDropDownValue("Company")).toBe('Petramco');
            expect(await changeAssignmentPage.getDropDownValue("SupportOrg")).toBe('Australia Support');
            expect(await changeAssignmentPage.getDropDownValue("AssignedGroup")).toBe('AU Support 2');
            expect(await changeAssignmentPage.getDropDownValue("Assignee")).toBe('Select');
            await changeAssignmentPage.setDropDownValue("Company", 'None');
            await changeAssignmentPage.clickAssignToMeBtn();
            await changeAssignmentPage.setDropDownValue("AssignedGroup", 'None');
            expect(await changeAssignmentPage.getDropDownValue("Company")).toBe('Petramco');
            expect(await changeAssignmentPage.getDropDownValue("SupportOrg")).toBe('United States Support');
            expect(await changeAssignmentPage.getDropDownValue("AssignedGroup")).toBe('Select');
            expect(await changeAssignmentPage.getDropDownValue("Assignee")).toBe('Select');
            await changeAssignmentPage.setDropDownValue("Company", 'None');
            await changeAssignmentPage.clickAssignToMeBtn();
            await changeAssignmentPage.setDropDownValue('Company', 'Psilon');
            expect(await changeAssignmentPage.getDropDownValue("Company")).toBe('Psilon');
            expect(await changeAssignmentPage.getDropDownValue("SupportOrg")).toBe('Select');
            expect(await changeAssignmentPage.getDropDownValue("AssignedGroup")).toBe('Select');
            expect(await changeAssignmentPage.getDropDownValue("Assignee")).toBe('Select');
            await changeAssignmentPage.setDropDownValue("Company", 'None');
            await changeAssignmentPage.clickAssignToMeBtn();
            await changeAssignmentPage.setDropDownValue('Company', 'None');
            expect(await changeAssignmentPage.getDropDownValue("Company")).toBe('Select');
            expect(await changeAssignmentPage.getDropDownValue("SupportOrg")).toBe('Select');
            expect(await changeAssignmentPage.getDropDownValue("AssignedGroup")).toBe('Select');
            expect(await changeAssignmentPage.getDropDownValue("Assignee")).toBe('Select');
        });
        it('[4000006]:Verify on clearing or reselecting of any field should clear the Child fields but not the Parent field', async () => {
            //When Assignee is blank 
            await changeAssignmentPage.setDropDownValue("Company", 'None');
            await changeAssignmentPage.clickAssignToMeBtn();
            await changeAssignmentPage.setDropDownValue("Assignee", 'None');
            expect(await changeAssignmentPage.getDropDownValue("Company")).toBe('Petramco');
            expect(await changeAssignmentPage.getDropDownValue("SupportOrg")).toBe('United States Support');
            expect(await changeAssignmentPage.getDropDownValue("AssignedGroup")).toBe('US Support 3');
            expect(await changeAssignmentPage.getDropDownValue("Assignee")).toBe('Select');
            await changeAssignmentPage.setDropDownValue("AssignedGroup", 'None');
            expect(await changeAssignmentPage.getDropDownValue("Company")).toBe('Petramco');
            expect(await changeAssignmentPage.getDropDownValue("SupportOrg")).toBe('United States Support');
            expect(await changeAssignmentPage.getDropDownValue("AssignedGroup")).toBe('Select');
            expect(await changeAssignmentPage.getDropDownValue("Assignee")).toBe('Select');
            await changeAssignmentPage.setDropDownValue("Company", 'None');
            await changeAssignmentPage.clickAssignToMeBtn();
            await changeAssignmentPage.setDropDownValue("SupportOrg", 'None');
            expect(await changeAssignmentPage.getDropDownValue("Company")).toBe('Petramco');
            expect(await changeAssignmentPage.getDropDownValue("SupportOrg")).toBe('Select');
            expect(await changeAssignmentPage.getDropDownValue("AssignedGroup")).toBe('Select');
            expect(await changeAssignmentPage.getDropDownValue("Assignee")).toBe('Select');
            await changeAssignmentPage.setDropDownValue("Company", 'None');
            await changeAssignmentPage.clickAssignToMeBtn();
            await changeAssignmentPage.setDropDownValue("Company", 'None');
            expect(await changeAssignmentPage.getDropDownValue("Company")).toBe('Select');
            expect(await changeAssignmentPage.getDropDownValue("SupportOrg")).toBe('Select');
            expect(await changeAssignmentPage.getDropDownValue("AssignedGroup")).toBe('Select');
            expect(await changeAssignmentPage.getDropDownValue("Assignee")).toBe('Select');
            await changeAssignmentPage.setDropDownValue("Company", 'None');
            await changeAssignmentPage.clickAssignToMeBtn();
            await changeAssignmentPage.setDropDownValue("Assignee", 'None');
            expect(await changeAssignmentPage.getDropDownValue("Company")).toBe('Petramco');
            expect(await changeAssignmentPage.getDropDownValue("SupportOrg")).toBe('United States Support');
            expect(await changeAssignmentPage.getDropDownValue("AssignedGroup")).toBe('US Support 3');
            expect(await changeAssignmentPage.getDropDownValue("Assignee")).toBe('Select');
            await changeAssignmentPage.setDropDownValue("AssignedGroup", 'US Support 1');
            expect(await changeAssignmentPage.getDropDownValue("Company")).toBe('Petramco');
            expect(await changeAssignmentPage.getDropDownValue("SupportOrg")).toBe('United States Support');
            expect(await changeAssignmentPage.getDropDownValue("AssignedGroup")).toBe('US Support 1');
            expect(await changeAssignmentPage.getDropDownValue("Assignee")).toBe('Select');
            await changeAssignmentPage.setDropDownValue("SupportOrg", 'Australia Support');
            expect(await changeAssignmentPage.getDropDownValue("Company")).toBe('Petramco');
            expect(await changeAssignmentPage.getDropDownValue("SupportOrg")).toBe('Australia Support');
            expect(await changeAssignmentPage.getDropDownValue("AssignedGroup")).toBe('Select');
            expect(await changeAssignmentPage.getDropDownValue("Assignee")).toBe('Select');
            await changeAssignmentPage.setDropDownValue("Company", 'None');
            await changeAssignmentPage.clickAssignToMeBtn();
            await changeAssignmentPage.setDropDownValue('Company', 'Psilon');
            expect(await changeAssignmentPage.getDropDownValue("Company")).toBe('Psilon');
            expect(await changeAssignmentPage.getDropDownValue("SupportOrg")).toBe('Select');
            expect(await changeAssignmentPage.getDropDownValue("AssignedGroup")).toBe('Select');
            expect(await changeAssignmentPage.getDropDownValue("Assignee")).toBe('Select');
        });
        it('[4000006]:Verify on clearing or reselecting of any field should clear the Child fields but not the Parent field', async () => {
            //When SG and Assignee are blank
            await changeAssignmentPage.setDropDownValue("Company", 'None');
            await changeAssignmentPage.clickAssignToMeBtn();
            await changeAssignmentPage.setDropDownValue("AssignedGroup", 'None');
            expect(await changeAssignmentPage.getDropDownValue("Company")).toBe('Petramco');
            expect(await changeAssignmentPage.getDropDownValue("SupportOrg")).toBe('United States Support');
            expect(await changeAssignmentPage.getDropDownValue("AssignedGroup")).toBe('Select');
            expect(await changeAssignmentPage.getDropDownValue("Assignee")).toBe('Select');
            await changeAssignmentPage.setDropDownValue("SupportOrg", 'None');
            expect(await changeAssignmentPage.getDropDownValue("Company")).toBe('Petramco');
            expect(await changeAssignmentPage.getDropDownValue("SupportOrg")).toBe('Select');
            expect(await changeAssignmentPage.getDropDownValue("AssignedGroup")).toBe('Select');
            expect(await changeAssignmentPage.getDropDownValue("Assignee")).toBe('Select');
            await changeAssignmentPage.setDropDownValue("Company", 'None');
            await changeAssignmentPage.clickAssignToMeBtn();
            await changeAssignmentPage.setDropDownValue('Company', 'None');
            expect(await changeAssignmentPage.getDropDownValue("Company")).toBe('Select');
            expect(await changeAssignmentPage.getDropDownValue("SupportOrg")).toBe('Select');
            expect(await changeAssignmentPage.getDropDownValue("AssignedGroup")).toBe('Select');
            expect(await changeAssignmentPage.getDropDownValue("Assignee")).toBe('Select');
            await changeAssignmentPage.setDropDownValue("Company", 'None');
            await changeAssignmentPage.clickAssignToMeBtn();
            await changeAssignmentPage.setDropDownValue("AssignedGroup", 'None');
            await changeAssignmentPage.setDropDownValue("SupportOrg", 'Australia Support');
            expect(await changeAssignmentPage.getDropDownValue("Company")).toBe('Petramco');
            expect(await changeAssignmentPage.getDropDownValue("SupportOrg")).toBe('Australia Support');
            expect(await changeAssignmentPage.getDropDownValue("AssignedGroup")).toBe('Select');
            expect(await changeAssignmentPage.getDropDownValue("Assignee")).toBe('Select');
            await changeAssignmentPage.setDropDownValue("Company", 'None');
            await changeAssignmentPage.clickAssignToMeBtn();
            await changeAssignmentPage.setDropDownValue('Company', 'Psilon');
            expect(await changeAssignmentPage.getDropDownValue("Company")).toBe('Psilon');
            expect(await changeAssignmentPage.getDropDownValue("SupportOrg")).toBe('Select');
            expect(await changeAssignmentPage.getDropDownValue("AssignedGroup")).toBe('Select');
            expect(await changeAssignmentPage.getDropDownValue("Assignee")).toBe('Select');
            //When user reselects Same Details --> All Children remain populated as it is
            await changeAssignmentPage.setDropDownValue("Company", 'None');
            await changeAssignmentPage.clickAssignToMeBtn();
            await changeAssignmentPage.setDropDownValue('Company', 'Petramco');
            expect(await changeAssignmentPage.getDropDownValue("Company")).toBe('Petramco');
            expect(await changeAssignmentPage.getDropDownValue("SupportOrg")).toBe('United States Support');
            expect(await changeAssignmentPage.getDropDownValue("AssignedGroup")).toBe('US Support 3');
            expect(await changeAssignmentPage.getDropDownValue("Assignee")).toBe('Qadim Katawazi');
            await changeAssignmentPage.setDropDownValue('AssignedGroup', 'US Support 3');
            expect(await changeAssignmentPage.getDropDownValue("Company")).toBe('Petramco');
            expect(await changeAssignmentPage.getDropDownValue("SupportOrg")).toBe('United States Support');
            expect(await changeAssignmentPage.getDropDownValue("AssignedGroup")).toBe('US Support 3');
            expect(await changeAssignmentPage.getDropDownValue("Assignee")).toBe('Qadim Katawazi');
            await changeAssignmentPage.setDropDownValue('SupportOrg', 'United States Support');
            expect(await changeAssignmentPage.getDropDownValue("Company")).toBe('Petramco');
            expect(await changeAssignmentPage.getDropDownValue("SupportOrg")).toBe('United States Support');
            expect(await changeAssignmentPage.getDropDownValue("AssignedGroup")).toBe('US Support 3');
            expect(await changeAssignmentPage.getDropDownValue("Assignee")).toBe('Qadim Katawazi');
            await changeAssignmentPage.setDropDownValue('Assignee', 'Qadim Katawazi');
            expect(await changeAssignmentPage.getDropDownValue("Company")).toBe('Petramco');
            expect(await changeAssignmentPage.getDropDownValue("SupportOrg")).toBe('United States Support');
            expect(await changeAssignmentPage.getDropDownValue("AssignedGroup")).toBe('US Support 3');
            expect(await changeAssignmentPage.getDropDownValue("Assignee")).toBe('Qadim Katawazi');
        });
    });

    describe('[4000007]:Verify that if Agent has only Read only access on Case/Task/Knowledge', async () => {
        let caseID, KADetails, taskData, articleData, randVal = [...Array(10)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        beforeAll(async () => {
            let caseData1 = {
                "Requester": "apavlik",
                "Summary": "Test case for inProgress task",
                "Assigned Company": "Petramco",
                "Business Unit": "United States Support",
                "Support Group": "US Support 3",
                "Assignee": "qkatawazi"
            }
            taskData = {
                "taskName": "Toggle False, task created without template" + "_" + randVal,
                "company": "Petramco",
                "priority": "Low",
                "businessUnit": "United States Support",
                "supportGroup": "US Support 3",
                "assignee": "qkatawazi",
            }
            await apiHelper.apiLogin('qkatawazi');
            let newCase = await apiHelper.createCase(caseData1);
            caseID = newCase.displayId;
            await apiHelper.createAdhocTask(newCase.id, taskData);
            articleData = {
                "knowledgeSet": "HR Knowledge Set",
                "title": 'knowledge' + randVal,
                "templateId": "AGGAA5V0HGVMIAOK2JE7O965BK1BJW",
                "assignedCompany": "Petramco",
                "assigneeBusinessUnit": "United States Support",
                "assigneeSupportGroup": "US Support 3",
                "assignee": "qkatawazi"
            }
            KADetails = await apiHelper.createKnowledgeArticle(articleData);
            //Read access to qtao
            let caseAccessDataQtao = {
                "operation": operation['addAccess'],
                "type": type['user'],
                "security": security['readAccess'],
                "username": 'qtao'
            }
            await apiHelper.updateCaseAccess(newCase.id, caseAccessDataQtao);
        });
        it('[4000007]:Verify that if Agent has only Read only access on Case/Task/Knowledge', async () => {
            await navigationPo.gotoCaseConsole();
            await utilityGrid.clearFilter();
            await utilityGrid.searchAndOpenHyperlink(caseID);
            expect(await viewCasePo.isEditAssignmenetDisabled()).toBeFalsy();
            expect(await viewCasePo.isAssignToMeDisabled()).toBeFalsy();
            await viewCasePo.clickEditCaseButton();
            expect(await changeAssignmentPage.isFieldDisabled("Company")).toBeFalsy();
            expect(await changeAssignmentPage.isFieldDisabled("SupportOrg")).toBeFalsy();
            expect(await changeAssignmentPage.isFieldDisabled("AssignedGroup")).toBeFalsy();
            expect(await changeAssignmentPage.isFieldDisabled("Assignee")).toBeFalsy();
            expect(await changeAssignmentPage.isFieldDisabled("AssignToMe")).toBeFalsy();
            await editCasePo.clickOnCancelCaseButton();
            await utilityCommon.clickOnApplicationWarningYesNoButton("Yes");
            await navigationPo.gotoTaskConsole();
            await utilityGrid.searchAndOpenHyperlink(taskData.taskName);
            expect(await viewTaskPo.isEditAssignmentDisabled()).toBeFalsy();
            expect(await viewTaskPo.isAssignToMeDisabled()).toBeFalsy();
            await viewTaskPo.clickOnEditTask();
            expect(await changeAssignmentPage.isFieldDisabled("Company")).toBeFalsy();
            expect(await changeAssignmentPage.isFieldDisabled("SupportOrg")).toBeFalsy();
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
            expect(await changeAssignmentPage.isFieldDisabled("Company")).toBeFalsy()
            expect(await changeAssignmentPage.isFieldDisabled("SupportOrg")).toBeFalsy();
            expect(await changeAssignmentPage.isFieldDisabled("AssignedGroup")).toBeFalsy();
            expect(await changeAssignmentPage.isFieldDisabled("Assignee")).toBeFalsy();
            expect(await changeAssignmentPage.isFieldDisabled("AssignToMe")).toBeFalsy();
            await apiHelper.apiLogin('qkatawazi');
            expect(await apiHelper.updateKnowledgeArticleStatus(KADetails.id, "Draft")).toBeTruthy("Article with Draft status not updated.");
            await editKnowledgePo.setKnowledgeStatusWithoutSave("SME Review");
            expect(await changeAssignmentPage.isFieldDisabled("Company")).toBeFalsy()
            expect(await changeAssignmentPage.isFieldDisabled("SupportOrg")).toBeFalsy();
            expect(await changeAssignmentPage.isFieldDisabled("AssignedGroup")).toBeFalsy();
            expect(await changeAssignmentPage.isFieldDisabled("Assignee")).toBeFalsy();
            expect(await changeAssignmentPage.isFieldDisabled("AssignToMe")).toBeFalsy();
            await editKnowledgePo.clickCancelStatusBtn();
        });
        it('[4000007]:Verify that if Agent has only Read only access on Case/Task/Knowledge', async () => {
            await navigationPo.signOut();
            await loginPo.login("qtao");
            await navigationPo.gotoTaskConsole();
            await utilityGrid.searchAndOpenHyperlink(taskData.taskName);
            expect(await viewTaskPo.isEditAssignmentDisabled()).toBeTruthy();
            expect(await viewTaskPo.isAssignToMeDisabled()).toBeTruthy();
            await viewTaskPo.clickOnEditTask();
            expect(await changeAssignmentPage.isFieldDisabled("Company")).toBeTruthy();
            expect(await changeAssignmentPage.isFieldDisabled("SupportOrg")).toBeTruthy();
            expect(await changeAssignmentPage.isFieldDisabled("AssignedGroup")).toBeTruthy();
            expect(await changeAssignmentPage.isFieldDisabled("Assignee")).toBeTruthy();
            expect(await changeAssignmentPage.isFieldDisabled("AssignToMe")).toBeTruthy();
            await editCasePo.clickOnCancelCaseButton();
            await utilityCommon.clickOnApplicationWarningYesNoButton("Yes");
            await navigationPo.gotoCaseConsole();
            await utilityGrid.clearFilter();
            await utilityGrid.searchAndOpenHyperlink(caseID);
            await viewCasePo.clickEditCaseButton();
            expect(await changeAssignmentPage.isFieldDisabled("Company")).toBeTruthy();
            expect(await changeAssignmentPage.isFieldDisabled("SupportOrg")).toBeTruthy();
            expect(await changeAssignmentPage.isFieldDisabled("AssignedGroup")).toBeTruthy();
            expect(await changeAssignmentPage.isFieldDisabled("Assignee")).toBeTruthy();
            expect(await changeAssignmentPage.isFieldDisabled("AssignToMe")).toBeTruthy();
            await editCasePo.clickOnCancelCaseButton();
            await utilityCommon.clickOnApplicationWarningYesNoButton("Yes");
            expect(await viewCasePo.isEditAssignmenetDisabled()).toBeTruthy();
            expect(await viewCasePo.isAssignToMeDisabled()).toBeTruthy();
            await navigationPo.gotoKnowledgeConsole();
            await utilityGrid.clearFilter();
            await utilityGrid.searchAndOpenHyperlink(articleData.title);
            await viewKnowledgeArticlePo.clickEditKnowledgeMedataData();
            expect(await changeAssignmentPage.isFieldDisabled("Company")).toBeTruthy()
            expect(await changeAssignmentPage.isFieldDisabled("SupportOrg")).toBeTruthy();
            expect(await changeAssignmentPage.isFieldDisabled("AssignedGroup")).toBeTruthy();
            expect(await changeAssignmentPage.isFieldDisabled("Assignee")).toBeTruthy();
            expect(await changeAssignmentPage.isFieldDisabled("AssignToMe")).toBeTruthy();
        });
        afterAll(async () => {
            await utilityCommon.closeAllBlades();
            await navigationPo.signOut();
            await loginPo.login('qkatawazi');
        });
    });

    it('[12301]:Verify Assignment Field Behaviour Accoriding to LOB Updation', async () => {
        await navigationPo.signOut();
        await loginPo.login("qyuan");
        await navigationPo.gotoCreateCase();
        await createCasePo.selectRequester('adam');
        await createCasePo.setSummary('Summary');
        expect(await createCasePo.getLineOfBusinessValue()).toBe('Human Resource');
        await changeAssignmentPage.setDropDownValue("Assignee", 'Adam Pavlik');
        expect(await changeAssignmentPage.getDropDownValue("Company")).toBe('Petramco');
        expect(await changeAssignmentPage.getDropDownValue("SupportOrg")).toBe('United States Support');
        expect(await changeAssignmentPage.getDropDownValue("AssignedGroup")).toBe('US Support 3');
        expect(await changeAssignmentPage.getDropDownValue("Assignee")).toBe('Adam Pavlik');
        expect(await changeAssignmentPage.isValuePresentInDropDown("SupportOrg", 'United States Support')).toBeTruthy();
        expect(await changeAssignmentPage.isValuePresentInDropDown("SupportOrg", 'Facilities Support')).toBeFalsy();
        await createCasePo.selectLineOfBusiness('Facilities');
        await changeAssignmentPage.setDropDownValue("Assignee", 'Fritz Schulz');
        expect(await changeAssignmentPage.getDropDownValue("Company")).toBe('Petramco');
        expect(await changeAssignmentPage.getDropDownValue("SupportOrg")).toBe('Facilities Support');
        expect(await changeAssignmentPage.getDropDownValue("AssignedGroup")).toBe('Facilities');
        expect(await changeAssignmentPage.getDropDownValue("Assignee")).toBe('Fritz Schulz');
        expect(await changeAssignmentPage.isValuePresentInDropDown("SupportOrg", 'Facilities Support')).toBeTruthy();
        expect(await changeAssignmentPage.isValuePresentInDropDown("SupportOrg", 'United States Support')).toBeFalsy();
    });

    //Raised Defect
    it('[12302]:Verify Assignee Behaviour After Change LOB Of Person', async () => {
        await navigationPo.signOut();
        await loginPo.login("qyuan");
        await navigationPo.gotoCreateCase();
        await createCasePo.selectRequester('adam');
        await createCasePo.setSummary('Summary');
        expect(await createCasePo.getLineOfBusinessValue()).toBe('Human Resource');
        await changeAssignmentPage.setDropDownValue("Assignee", 'Adam Pavlik');
        expect(await changeAssignmentPage.getDropDownValue("Company")).toBe('Petramco');
        expect(await changeAssignmentPage.getDropDownValue("SupportOrg")).toBe('United States Support');
        expect(await changeAssignmentPage.getDropDownValue("AssignedGroup")).toBe('US Support 3');
        expect(await changeAssignmentPage.getDropDownValue("Assignee")).toBe('Adam Pavlik');
        await createCasePo.selectLineOfBusiness('Facilities');
        expect(await changeAssignmentPage.getDropDownValue("Company")).toBe('None');
        expect(await changeAssignmentPage.getDropDownValue("SupportOrg")).toBe('None');
        expect(await changeAssignmentPage.getDropDownValue("AssignedGroup")).toBe('None');
        expect(await changeAssignmentPage.getDropDownValue("Assignee")).toBe('None');
    });
});