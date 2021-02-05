import apiHelper from '../../api/api.helper';
import { MANDATORY_FIELD } from '../../data/ui/case/casetemplate.data.ui';
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
import { BWF_BASE_URL, BWF_PAGE_TITLES } from '../../utils/constants';
import utilityCommon from '../../utils/utility.common';
import utilityGrid from '../../utils/utility.grid';

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
        expect(await changeAssignmentPage.getDropDownValue("Company")).toBe('Petramco');
        await changeAssignmentPage.setDropDownValue('SupportOrg', 'United States Support');
        expect(await changeAssignmentPage.isValuePresentInDropDown("SupportOrg", 'United States Support\nPetramco > United States Support')).toBeTruthy();
        expect(await changeAssignmentPage.isValuePresentInDropDown("AssignedGroup", 'US Support 3\nPetramco > United States Support > US Support 3')).toBeTruthy();
        await createCasePo.clickCancelButton();
        await utilityCommon.clickOnApplicationWarningYesNoButton("Yes");
        await navigationPo.gotoCreateCase();
        await createCasePo.selectRequester('adam');
        await createCasePo.setSummary('Summary');
        await changeAssignmentPage.setDropDownValue('SupportOrg', 'United States Support');
        await changeAssignmentPage.setDropDownValue('AssignedGroup', 'US Support 3');
        let newArray: string = nth(await changeAssignmentPage.getAllDropDownValues("Assignee"), 1);
        expect(await newArray.includes('Adam Pavlik')).toBeTruthy();
        expect(await newArray.includes('apavlik@petramco.com')).toBeTruthy();
        expect(await newArray.includes('Petramco > United States Support > US Support 3')).toBeTruthy();
    });

    //apurva
    it('[4000003]:Verify on Case Creation, if Assignment fields are enabled only when Requester is selected', async () => {
        await navigationPo.gotoCreateCase();
        expect(await changeAssignmentPage.isDropDownDisabled("Company")).toBeTruthy();
        expect(await changeAssignmentPage.isDropDownDisabled("SupportOrg")).toBeTruthy();
        expect(await changeAssignmentPage.isDropDownDisabled("AssignedGroup")).toBeTruthy();
        expect(await changeAssignmentPage.isDropDownDisabled("Assignee")).toBeTruthy();
        await createCasePo.selectRequester('adam');
        await createCasePo.setSummary('Summary');
        expect(await changeAssignmentPage.isDropDownDisabled("Company")).toBeFalsy();
        expect(await changeAssignmentPage.isDropDownDisabled("SupportOrg")).toBeFalsy();
        expect(await changeAssignmentPage.isDropDownDisabled("AssignedGroup")).toBeFalsy();
        expect(await changeAssignmentPage.isDropDownDisabled("Assignee")).toBeFalsy();
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
            expect(await viewCasePo.getAssignedGroupText()).toContain('US Support 3');
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
});