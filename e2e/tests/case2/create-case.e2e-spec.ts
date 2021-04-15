import { $, browser } from "protractor";
import apiHelper from '../../api/api.helper';
import attachmentBladePage from "../../pageobject/attachment/attachment-blade.po";
import caseConsolePage from '../../pageobject/case/case-console.po';
import previewCasePo from '../../pageobject/case/case-preview.po';
import createCasePage from "../../pageobject/case/create-case.po";
import editCasePage from '../../pageobject/case/edit-case.po';
import selectCaseTemplateBlade from '../../pageobject/case/select-casetemplate-blade.po';
import viewCasePage from "../../pageobject/case/view-case.po";
import changeAssignmentPage from '../../pageobject/common/change-assignment.po';
import localizeValuePopPo from '../../pageobject/common/localize-value-pop.po';
import loginPage from "../../pageobject/common/login.po";
import navigationPage from "../../pageobject/common/navigation.po";
import updateStatusBladePo from '../../pageobject/common/update.status.blade.po';
import createKnowledgePage from "../../pageobject/knowledge/create-knowlege.po";
import KnowledgeConsolePage from "../../pageobject/knowledge/knowledge-articles-console.po";
import createMenuItems from '../../pageobject/settings/application-config/create-menu-items-blade.po';
import editMenuItemsConfigPo from '../../pageobject/settings/application-config/edit-menu-items-config.po';
import menuItemConsole from '../../pageobject/settings/application-config/menu-items-config-console.po';
import consoleCasetemplatePo from '../../pageobject/settings/case-management/console-casetemplate.po';
import createCaseTemplate from '../../pageobject/settings/case-management/create-casetemplate.po';
import caseTemplatePreview from '../../pageobject/settings/case-management/preview-case-template.po';
import viewCasetemplatePo from "../../pageobject/settings/case-management/view-casetemplate.po";
import selectTaskTemplate from "../../pageobject/settings/task-management/console-tasktemplate.po";
import createTaskTemplate from '../../pageobject/settings/task-management/create-tasktemplate.po';
import taskTemplatePreview from '../../pageobject/settings/task-management/preview-task-template.po';
import viewTasktemplatePage from '../../pageobject/settings/task-management/view-tasktemplate.po';
import activityTabPo from '../../pageobject/social/activity-tab.po';
import taskConsolepage from "../../pageobject/task/console-task.po";
import adhoctaskTemplate from "../../pageobject/task/create-adhoc-task.po";
import manageTaskBladePo from "../../pageobject/task/manage-task-blade.po";
import viewTaskPo from '../../pageobject/task/view-task.po';
import { BWF_BASE_URL, BWF_PAGE_TITLES } from '../../utils/constants';
import utilityCommon from '../../utils/utility.common';
import utilityGrid from '../../utils/utility.grid';

describe("Create Case", () => {
    beforeAll(async () => {
        await browser.get(BWF_BASE_URL);
        await loginPage.login("qkatawazi");
    });

    afterAll(async () => {
        await utilityCommon.closeAllBlades();
        await navigationPage.signOut();
    });

    // passed
    it('[4427]: Verify Category Tier 4 Can be Populated After Tier 3 selection', async () => {
        try {
            await navigationPage.signOut();
            await loginPage.login('qtao')
            await navigationPage.gotoCreateCase();
            await createCasePage.selectRequester('adam');
            await createCasePage.setSummary('set summary');
            await createCasePage.selectCategoryTier1("Employee Relations");
            await createCasePage.selectCategoryTier2("Compensation");
            await createCasePage.selectCategoryTier3("Bonus");
            await createCasePage.selectCategoryTier4("Retention Bonus");
        } catch (error) {
            throw error;
        } finally {
            await navigationPage.signOut();
            await loginPage.login("qkatawazi");
        }
    });

    // passed
    describe('[4082]: Check Resolution Code and Resolution Description fields added on Case View and Status Change blade', () => {
        let randVal = [...Array(10)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        let caseId: string = undefined;
        beforeAll(async () => {
            let caseData = {
                "Requester": "qtao",
                "Summary": "Test case for 5981",
                "Assigned Company": "Petramco",
                "Business Unit": "United States Support",
                "Support Group": "US Support 3",
                "Assignee": "qkatawazi"
            }
            await apiHelper.apiLogin('qkatawazi');
            let newCase1 = await apiHelper.createCase(caseData);
            caseId = newCase1.displayId;
        });

        it('[4082]: Check Resolution Code and Resolution Description fields added on Case View and Status Change blade', async () => {
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Application Configuration--Menu Items', BWF_PAGE_TITLES.APPLICATION_CONFIGURATIONS.MENU_ITEMS);
            await createMenuItems.clickOnMenuOptionLink();
            await createMenuItems.selectMenuNameDropDown('Resolution Code');
            await createMenuItems.clickOnLocalizeLink();
            await localizeValuePopPo.setLocalizeValue(randVal);
            await localizeValuePopPo.clickOnSaveButton();
            await createMenuItems.clickOnSaveButton();
            await utilityCommon.closePopUpMessage();
            await utilityGrid.searchRecord(randVal);
            await navigationPage.gotoCaseConsole();
            await utilityGrid.searchAndOpenHyperlink(caseId);
            expect(await $(viewCasePage.selectors.resolutionCodeText).isDisplayed()).toBeTruthy('Missing Resolution Text');
            expect(await $(viewCasePage.selectors.resolutionDescriptionLabel).isDisplayed()).toBeTruthy('Missing Resolution Description Text');
        });

        it('[4082]: Check Resolution Code and Resolution Description fields added on Case View and Status Change blade', async () => {
            await viewCasePage.clickEditCaseButton();
            await editCasePage.updateResolutionCode(randVal);
            await editCasePage.setResolutionDescription(randVal);
            await editCasePage.clickSaveCase();
            await utilityCommon.closePopUpMessage();
            expect(await viewCasePage.getResolutionCodeValue()).toBe(randVal);
            expect(await viewCasePage.getResolutionDescription()).toBe(randVal);
            await updateStatusBladePo.changeStatus('Resolved');
            await updateStatusBladePo.selectStatusReason('Customer Follow-Up Required');
            expect(await updateStatusBladePo.isResolutionDescriptionTextBoxEmpty()).toBeFalsy('Resolution Description Text Box is not empty');
            await updateStatusBladePo.clickSaveStatus();
            await utilityCommon.closePopUpMessage();
            expect(await viewCasePage.getTextOfStatus()).toBe('Resolved');
            await updateStatusBladePo.changeStatus('Closed');
            expect(await updateStatusBladePo.isResolutionDescriptionTextBoxEmpty()).toBeFalsy('Resolution Description Text Box is not empty');
            await updateStatusBladePo.clickSaveStatus();
            await utilityCommon.closePopUpMessage();
            expect(await viewCasePage.getTextOfStatus()).toBe('Closed');
        });
        afterAll(async () => {
            await utilityCommon.closeAllBlades();
            await navigationPage.signOut();
            await loginPage.login("qkatawazi");
        });
    });

    // passed
    describe('[4022]: [UI]Resolution Code can be view on Case with respect to input in field "Available on UI"', () => {
        let randVal = [...Array(10)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        let caseId1, caseId2;
        beforeAll(async () => {
            let caseData1 = {
                "Requester": "qtao",
                "Summary": "Test case for 5981",
                "Assigned Company": "Petramco",
                "Business Unit": "United States Support",
                "Support Group": "US Support 3",
                "Assignee": "qkatawazi"
            }

            let caseData2 = {
                "Requester": "qtao",
                "Summary": "Test case for 5981",
                "Assigned Company": "Petramco",
                "Business Unit": "United States Support",
                "Support Group": "US Support 3",
                "Assignee": "qkatawazi"
            }
            await apiHelper.apiLogin("qkatawazi");
            let newCase1 = await apiHelper.createCase(caseData1);
            caseId1 = newCase1.displayId;
            let newCase2 = await apiHelper.createCase(caseData2);
            caseId2 = newCase2.displayId;
        });

        //passed
        it('[4022]: [UI]Resolution Code can be view on Case with respect to input in field "Available on UI"', async () => {
            await navigationPage.signOut();
            await loginPage.login("qkatawazi");
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Application Configuration--Menu Items', BWF_PAGE_TITLES.APPLICATION_CONFIGURATIONS.MENU_ITEMS);
            await createMenuItems.clickOnMenuOptionLink();
            await createMenuItems.selectMenuNameDropDown('Resolution Code');
            await createMenuItems.clickOnLocalizeLink();
            await localizeValuePopPo.setLocalizeValue(randVal);
            await localizeValuePopPo.clickOnSaveButton();
            await createMenuItems.selectStatusDropDown('Active');
            await createMenuItems.selectAvailableOnUiToggleButton(true);
            await createMenuItems.clickOnSaveButton();
            await navigationPage.gotoCaseConsole();
            await caseConsolePage.searchAndOpenCase(caseId1);
            await viewCasePage.clickEditCaseButton();
            await editCasePage.updateResolutionCode(randVal);
            await editCasePage.setCaseSummary('Updated Summary');
            await editCasePage.clickSaveCase();
            await utilityCommon.closePopUpMessage();
        });

        // passed
        it('[4022]: [UI]Resolution Code can be view on Case with respect to input in field "Available on UI"', async () => {
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Application Configuration--Menu Items', BWF_PAGE_TITLES.APPLICATION_CONFIGURATIONS.MENU_ITEMS);
            await menuItemConsole.searchAndEditMenuOption(randVal);
            await editMenuItemsConfigPo.selectAvailableOnUIToggleButton(false);
            await editMenuItemsConfigPo.clickOnSaveButton();
            await utilityCommon.closePopUpMessage();
            await navigationPage.gotoCaseConsole();
            await caseConsolePage.searchAndOpenCase(caseId2);
            await viewCasePage.clickEditCaseButton();
            expect(await editCasePage.isValuePresentInResolutionCode(randVal)).toBeFalsy('RandomCode is missing');
            await editCasePage.clickOnCancelCaseButton();
            await navigationPage.gotoCaseConsole();
            await caseConsolePage.searchAndOpenCase(caseId1);
            await viewCasePage.clickEditCaseButton();
            expect(await editCasePage.isValuePresentInResolutionCode(randVal)).toBeFalsy('RandomCode is missing');
        });
    });

    // passed
    it('[6338,6331]: [Case Creation] Case creation with/without mandatory fields populated ', async () => {
        let prioirtyValue: string[] = ["Critical", "High", "Medium", "Low"];
        const randomStr = [...Array(10)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        let caseSummary = 'Case Summary ' + randomStr;
        await navigationPage.gotoCreateCase();
        expect(await createCasePage.isSaveCaseButtonEnabled()).toBeFalsy("Save button is enabled");
        await createCasePage.selectRequester('adam');
        expect(await createCasePage.isSaveCaseButtonEnabled()).toBeFalsy();
        //expect(await utilityCommon.isPopUpMessagePresent('Resolve the field validation errors and then try again.')).tobeTruthy; Save button wont enable unless summary is set
        //await utilityCommon.closePopUpMessage();
        //await utilityCommon.closePopUpMessage();
        await createCasePage.setSummary(caseSummary);
        expect(await createCasePage.allPriorityOptionsPresent(prioirtyValue)).toBeTruthy('Priority is not present');
        await createCasePage.clickAssignToMeButton();
        await createCasePage.clickSaveCaseButton();
        await previewCasePo.clickGoToCaseButton();
        expect(await viewCasePage.getPriorityValue()).toBe('Medium');
        await navigationPage.gotoCaseConsole();
        await caseConsolePage.setCaseSearchBoxValue(caseSummary);
        expect(await caseConsolePage.isCaseIdHyperlinked()).toBeTruthy('Unable to find the created case');
    });

    // failed (priority required text issue)
    describe('[6336,6339]: [Case Creation] Case Create view (UI verification) ', () => {
        const randomStr = [...Array(10)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        let caseSummary = 'Summary ' + randomStr;

        it('[6336,6339]: [Case Creation] Case Create view (UI verification) ', async () => {
            await navigationPage.signOut();
            await loginPage.login('qtao');
            await navigationPage.gotoCreateCase();
            expect(await createCasePage.isRequesterRequiredTextPresent()).toBeTruthy("required text absent in Request");
            expect(await createCasePage.isSummaryRequiredTextPresent()).toBeTruthy("required text absent in Summary");
            expect(await createCasePage.isCompanyRequiredTextPresent()).toBeTruthy("required text absent in Assigned Company");
            expect(await createCasePage.isSelectCaseTemplateButtonEnabled()).toBeFalsy("Select Case template is Disabled");
            expect(await createCasePage.isClearTemplateButtonEnabled()).toBeFalsy("Clear Template is Disabled");
            expect(await createCasePage.isAutocategorizationEnabled()).toBeFalsy("Autocategorization is Disabled");
            expect(await changeAssignmentPage.isFieldDisabled('AssignedGroup')).toBeTruthy("Assigned group read only");
            expect(await changeAssignmentPage.isFieldDisabled('Assignee')).toBeTruthy("Assignee read only");
            expect(await createCasePage.isAttachmentButtonDisplayed()).toBeTruthy("Attachment button not displayed");
            expect(await createCasePage.isSaveCaseButtonEnabled()).toBeFalsy("Save button is enables");
            expect(await createCasePage.isPriorityRequiredTextPresent()).toBeTruthy("required text absent in Priority"); // defect
            await createCasePage.selectRequester('adam');
            await createCasePage.setSummary(caseSummary);
            await createCasePage.setDescription('Description');
            await createCasePage.setContactName('kye');
            await createCasePage.selectSite('Pune');
            await createCasePage.selectCategoryTier1('Applications');
            await createCasePage.selectCategoryTier2('Social');
            await createCasePage.selectCategoryTier3('Chatter');
            await createCasePage.addDescriptionAttachment(['../../data/ui/attachment/demo.txt']);
            await changeAssignmentPage.setAssignee("US Support 1", "Qianru Tao");
            await createCasePage.clickSaveCaseButton();
            await previewCasePo.clickGoToCaseButton();
            expect(await viewCasePage.getCaseSummary()).toBe(caseSummary);
            expect(await viewCasePage.getCategoryTier1Value()).toBe('Applications');
            expect(await viewCasePage.getCategoryTier2Value()).toBe('Social');
            expect(await viewCasePage.getCategoryTier3Value()).toBe('Chatter');
            await navigationPage.gotoCaseConsole();
            await caseConsolePage.setCaseSearchBoxValue(caseSummary);
            expect(await caseConsolePage.isCaseIdHyperlinked()).toBeTruthy('Unable to find the created case');
        });

        afterAll(async () => {
            await navigationPage.signOut();
            await loginPage.login("qkatawazi");
        });
    });

    // passed
    it('[6297]: [Global navigation] Navigation to Workspaces and Create subitems in the Shell ', async () => {
        try {
            await navigationPage.gotoCaseConsole();
            await navigationPage.signOut();
            await loginPage.login('qtao');
            expect((await caseConsolePage.getCaseTitle()).trim()).toBe('Cases', "Case title is not displayed in Case Console Page");
            await navigationPage.gotoTaskConsole();
            expect((await taskConsolepage.getTaskTitle()).trim()).toBe('Tasks', "task title is not displayed in task Console Page");
            await navigationPage.gotoCaseConsole();
            expect((await caseConsolePage.getCaseTitle()).trim()).toBe('Cases', "Case title is not displayed in Case Console Page");
            await navigationPage.gotoKnowledgeConsole();
            expect((await KnowledgeConsolePage.getKnowledgeArticleTitle()).trim()).toBe('Knowledge Articles', "Knowledge title is not displayed in Knowledge Console Page");
            await navigationPage.gotoCreateCase();
            expect((await createCasePage.getCreateCaseTitle()).trim()).toBe('Create Case', "Create Case title is not displayed in Create Case Page");
            await navigationPage.gotoCreateKnowledge();
            expect((await createKnowledgePage.getCreateKnowledgeHeader()).trim()).toContain('Create Knowledge', "Create Knowledge title is not displayed in Create knowledge Page");
        } catch (e) { throw e; }
        finally {
            await navigationPage.signOut();
            await loginPage.login('qkatawazi');
        }
    });

    // passed
    describe('[5591]: [Permissions] [Global navigation] Access to the shell menu items for different roles', () => {
        it('[5591]: [Permissions] [Global navigation] Access to the shell menu items for different roles', async () => {
            expect((await caseConsolePage.getCaseTitle()).trim()).toBe('Cases', "Case title is not displayed in Case Console Page");// this validates case console displayed
            await navigationPage.gotoTaskConsole(); // task console displayed
            await navigationPage.gotoKnowledgeConsole(); // knowledge console displayed
            await navigationPage.gotoCreateCase(); // Create Case displayed
            await navigationPage.gotoCreateKnowledge(); // Create knowledge displayed
            await navigationPage.gotoQuickCase(); // Quick Case displayed

            await navigationPage.signOut();
            await loginPage.login('qtao');
            expect((await caseConsolePage.getCaseTitle()).trim()).toBe('Cases', "Case title is not displayed in Case Console Page");// this validates case console displayed
            await navigationPage.gotoTaskConsole(); // task console displayed
            await navigationPage.gotoKnowledgeConsole(); // knowledge console displayed
            await navigationPage.gotoCreateCase(); // Create Case displayed
            await navigationPage.gotoCreateKnowledge(); // Create knowledge displayed
            await navigationPage.gotoQuickCase(); // Quick Case displayed
        });

        it('[5591]: [Permissions] [Global navigation] Access to the shell menu items for different roles', async () => {
            await navigationPage.signOut();
            await loginPage.login('qdu');
            expect((await caseConsolePage.getCaseTitle()).trim()).toBe('Cases', "Case title is not displayed in Case Console Page");// this validates case console displayed
            await navigationPage.gotoTaskConsole(); // task console displayed
            await navigationPage.gotoKnowledgeConsole(); // knowledge console displayed
            await navigationPage.gotoCreateCase(); // Create Case displayed
            await navigationPage.gotoCreateKnowledge(); // Create knowledge displayed
            await navigationPage.gotoQuickCase(); // Quick Case displayed
        });

        afterAll(async () => {
            await navigationPage.signOut();
            await loginPage.login('qkatawazi');
        });
    });

    // passed
    describe('[5454]: [Case Creation] [Template Selection] Case/Task Template preview from Case creation', () => {
        const randomStr = [...Array(10)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        let templateData, caseTemplateData;
        beforeAll(async () => {
            templateData = {
                "templateName": `manualTaskTemplateActive ${randomStr}`,
                "templateSummary": `manualTaskTemplateActive ${randomStr}`,
                "templateStatus": "Active",
                "taskCompany": "Petramco",
                "ownerCompany": "Petramco",
                "ownerBusinessUnit": "United States Support",
                "ownerGroup": "US Support 3"
            }

            caseTemplateData = {
                "templateName": `Case template ${randomStr}`,
                "templateStatus": "Active",
                "templateSummary": `Summary ${randomStr}`,
                "caseStatus": "New",
                "casePriority": "Medium",
                "ownerBU": "United States Support",
                "ownerGroup": "US Support 3"
            }
            await apiHelper.apiLogin('qkatawazi');
            await apiHelper.createManualTaskTemplate(templateData);
            await apiHelper.createCaseTemplate(caseTemplateData);
        });

        it('[5454]: [Case Creation] [Template Selection] Case/Task Template preview from Case creation', async () => {
            await navigationPage.signOut();
            await loginPage.login("qtao");
            await navigationPage.gotoCreateCase();
            await createCasePage.selectRequester('adam');
            await createCasePage.setSummary('Summary' + randomStr);
            await createCasePage.clickSelectCaseTemplateButton();
            await selectCaseTemplateBlade.searchAndOpenCaseTemplate(caseTemplateData.templateName);
            expect(await caseTemplatePreview.isCaseSummaryHeaderDisplayed('Case Summary')).toBeTruthy('Case Summary is not getting displayed');
            expect(await caseTemplatePreview.isCaseCompanyTitleDisplayed('Case Company')).toBeTruthy('Case Company is not getting displayed');
            expect(await caseTemplatePreview.isCaseStatusTitleDisplayed('Case Status')).toBeTruthy('Case Status is not getting displayed');
            expect(await caseTemplatePreview.isCasePriorityTitleDisplayed('Case Priority')).toBeTruthy('Case Priority is not getting displayed');
            expect(await caseTemplatePreview.isCaseCategoryTier1TitleDisplayed('Category Tier 1')).toBeTruthy('Case Category Tier 1 is not getting displayed');
            expect(await caseTemplatePreview.isCaseCategoryTier2TitleDisplayed('Category Tier 2')).toBeTruthy('Case Category Tier 2 is not getting displayed');
            expect(await caseTemplatePreview.isCaseCategoryTier3TitleDisplayed('Category Tier 3')).toBeTruthy('Case Category Tier 3 is not getting displayed');
            expect(await caseTemplatePreview.isCaseCategoryTier4TitleDisplayed('Category Tier 4')).toBeTruthy('Case Category Tier 4 is not getting displayed');
            expect(await caseTemplatePreview.isFlowsetTitleDisplayed('Flowset')).toBeTruthy('Flowset is not getting displayed');
            expect(await caseTemplatePreview.isLabelTitleDisplayed('Label')).toBeTruthy('Label is not getting displayed');
            expect(await caseTemplatePreview.isCaseDescriptionTitleDisplayed('Case Description')).toBeTruthy('Case Description is not getting displayed');
            expect(await caseTemplatePreview.isAssigneeTitleDisplayed()).toBeTruthy('Assignee is not getting displayed');
            expect(await caseTemplatePreview.getCaseTemplateName()).toBe(caseTemplateData.templateName);
            expect(await caseTemplatePreview.getCaseSummary()).toBe(caseTemplateData.templateSummary);
            expect(await caseTemplatePreview.getCaseCompanyValue()).toBe('Petramco');
            expect(await caseTemplatePreview.getCasePriority()).toBe('Medium');
            expect(await caseTemplatePreview.getCaseStatus()).toBe('New');
            await utilityCommon.closeAllBlades();
            await createCasePage.clickAssignToMeButton();
            await createCasePage.clickSaveCaseButton();
            await previewCasePo.clickGoToCaseButton();
            await utilityCommon.closePopUpMessage();
        });

        it('[5454]: [Case Creation] [Template Selection] Case/Task Template preview from Case creation', async () => {
            await viewCasePage.clickAddTaskButton();
            await manageTaskBladePo.clickAddTaskFromTemplateButton();
            await manageTaskBladePo.searchAndOpenTaskTemplate(templateData.templateName);
            expect(await taskTemplatePreview.isTaskSummaryTitleDisplayed('Task Summary')).toBeTruthy('Task Summary is not getting displayed');
            expect(await taskTemplatePreview.isTaskCompanyTitleDisplayed('Task Company')).toBeTruthy('Task Company is not getting displayed');
            expect(await taskTemplatePreview.isTaskPriorityTitleDisplayed('Task Priority')).toBeTruthy('Task Priority is not getting displayed');
            expect(await taskTemplatePreview.isTaskCategoryTier1TitleDisplayed('Task Category Tier 1')).toBeTruthy('Task Category Tier 1 is not getting displayed');
            expect(await taskTemplatePreview.isTaskCategoryTier2TitleDisplayed('Task Category Tier 2')).toBeTruthy('Task Category Tier 2 is not getting displayed');
            expect(await taskTemplatePreview.isTaskCategoryTier3TitleDisplayed('Task Category Tier 3')).toBeTruthy('Task Category Tier 3 is not getting displayed');
            expect(await taskTemplatePreview.isTaskCategoryTier4TitleDisplayed('Task Category Tier 4')).toBeTruthy('Task Category Tier 4 is not getting displayed');
            expect(await taskTemplatePreview.isTaskTypeTitleDisplayed('Task Type')).toBeTruthy('Task Type is not getting displayed');
            expect(await taskTemplatePreview.isLabelTitleDisplayed('Label')).toBeTruthy('Label is not getting displayed');
            expect(await taskTemplatePreview.isTaskDescriptionTitleDisplayed()).toBeTruthy('Task Description is not getting displayed');
            expect(await taskTemplatePreview.getTaskTemplateName()).toBe(templateData.templateName);
            expect(await taskTemplatePreview.getTaskSummary()).toBe(templateData.templateSummary);
            expect(await taskTemplatePreview.getTaskCompany()).toBe("Petramco");
            expect(await taskTemplatePreview.getTaskPriority()).toBe('Medium');
            expect(await taskTemplatePreview.getTaskType()).toBe('Manual');
            await taskTemplatePreview.clickOnBackButton();
        });

        afterAll(async () => {
            await utilityCommon.closeAllBlades();
            await navigationPage.signOut();
            await loginPage.login('qkatawazi');
        });
    });

    // passed
    describe('[5659,6337]: Verify case assignment on Create Case', () => {
        it('[5659,6337]: Verify case assignment on Create Case', async () => {
            await navigationPage.signOut();
            await loginPage.login('qfeng');
            await navigationPage.gotoCreateCase();
            expect(await createCasePage.isAssigneToMeEnabled()).toBeFalsy();
            await createCasePage.selectRequester('adam');
            await createCasePage.setSummary('Summary');
            expect(await createCasePage.getCompany()).toBe('Petramco');
            await changeAssignmentPage.setDropDownValue('AssignedGroup', 'US Support 3');
            await changeAssignmentPage.setDropDownValue('Assignee', 'Kyle Kohri');
            await changeAssignmentPage.clickAssignToMeBtn();
            expect(await changeAssignmentPage.getDropDownValue("Assignee")).toContain('Qiao Feng');
            await changeAssignmentPage.setDropDownValue('AssignedGroup', 'US Support 3');
            await createCasePage.clickAssignToMeButton();
            await createCasePage.clickSaveCaseButton();
            await previewCasePo.clickGoToCaseButton();
            expect(await viewCasePage.getAssignedGroupValue()).toBe('US Support 3');
            expect(await viewCasePage.getAssigneeText()).toContain('Qiao Feng');
        });

        afterAll(async () => {
            await navigationPage.signOut();
            await loginPage.login('qkatawazi');
        });

    });

    // passed
    it('[6084]: [Case] Fields validation for case in New status ', async () => {
        try {
            const randomStr = [...Array(10)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
            let caseSummary = 'Case Summary ' + randomStr;
            await navigationPage.signOut();
            await loginPage.login("qtao");
            await navigationPage.gotoCreateCase();
            await createCasePage.setPriority('Low');
            expect(await createCasePage.isRequesterRequiredTextPresent()).toBeTruthy("Requester Reqired text not present");
            expect(await createCasePage.isSummaryRequiredTextPresent()).toBeTruthy("Summary Reqired text not present");
            expect(await createCasePage.isSourceRequiredTextPresent()).toBeTruthy("Source Reqired text not present");
            expect(await createCasePage.isPriorityRequiredTextPresent()).toBeTruthy("Priority Reqired text not present");
            expect((await createCasePage.getCreateCaseTitle()).trim()).toBe('Create Case', "Create Case title is not displayed in Create Case Page");
            expect(await createCasePage.isSaveCaseButtonEnabled()).toBeFalsy("Save button is enabled");
            await createCasePage.selectRequester('adam');
            // await createCasePage.clickSaveCaseButtonWithoutMessageDisappear();
            // expect(await utilityCommon.isPopUpMessagePresent('Resolve the field validation errors and then try again.').tobeTruthy();
            // await utilityCommon.closePopUpMessage();
            expect(await createCasePage.isSaveCaseButtonEnabled()).toBeFalsy("Save button is Enabled");
            //await utilityCommon.closePopUpMessage();
            await createCasePage.setSummary(caseSummary);
            await changeAssignmentPage.setAssignee("US Support 1", "Qianru Tao");
            await createCasePage.clickSaveCaseButton();
            await previewCasePo.clickGoToCaseButton();
            expect(await viewCasePage.getCaseStatusValue()).toBe('Assigned');
            await viewCasePage.clickEditCaseButton();
            await editCasePage.updateCasePriority('Low');
            expect(await editCasePage.isSummaryRequiredText()).toBeTruthy("Summary Required text not present");
            expect(await editCasePage.isPriorityRequiredText()).toBeTruthy("Priority Required text not present");
            await editCasePage.clearCaseSummary();
            await editCasePage.clickSaveCase();
            expect(await utilityCommon.isPopUpMessagePresent('Resolve the field validation errors and then try again.')).toBeTruthy();
        } catch (error) {
            throw error;
        } finally {
            await navigationPage.signOut();
            await loginPage.login("qkatawazi");
        }
    });

    // passed
    it('[6078]: [Case] Fields validation for case in Closed status ', async () => {
        try {
            const randomStr = [...Array(10)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
            let caseWithClosedStatus = {
                "Status": "7000",
                "Assigned Company": "Petramco",
                "Description": "This case was created by java integration tests",
                "Requester": "qkatawazi",
                "Summary": "create case is in Closed Status" + randomStr,
                "Business Unit": "HR Support",
                "Support Group": "Compensation and Benefits",
                "Assignee": "Elizabeth"
            }
            await apiHelper.apiLogin('qtao');
            let closedCase = await apiHelper.createCase(caseWithClosedStatus);
            let closed: string = closedCase.displayId;
            await navigationPage.signOut();
            await loginPage.login('qtao');
            await navigationPage.gotoCaseConsole();
            await utilityGrid.clearFilter();
            await caseConsolePage.searchAndOpenCase(closed);
            await viewCasePage.clickEditCaseButton();
            await editCasePage.updateCasePriority('Critical');
            expect(await editCasePage.isSaveCaseEnable()).toBeFalsy("Save button Visible");
        } catch (error) {
            throw error;
        } finally {
            await navigationPage.signOut();
            await loginPage.login("qkatawazi");
        }
    });

    // passed
    describe('[5670]:  Case Agent user able to see all activity records in activity feed for a Case created using template', () => {
        let randomStr = [...Array(4)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        let activityNoteText = [...Array(10)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        let filePath = '../../data/ui/attachment/bwfPdf.pdf';
        let caseTemplateName = "CaseTemplate" + randomStr;
        let petramcoStr = "Petramco";
        let CaseTemplateData = {
            "templateName": caseTemplateName,
            "templateSummary": caseTemplateName,
            "templateStatus": "Active",
            "company": "Petramco",
            "category1": "Employee Relations",
            "category2": "Compensation",
            "category3": "Bonus",
            "priority": "Low",
            "ownerBU": "United States Support",
            "ownerGroup": "US Support 3"
        }

        beforeAll(async () => {
            await apiHelper.apiLogin('qkatawazi');
            await apiHelper.createCaseTemplate(CaseTemplateData);
        });

        it('[5670]:  Case Agent user able to see all activity records in activity feed for a Case created using template', async () => {
            await navigationPage.signOut();
            await loginPage.login("qtao");
            await navigationPage.gotoCreateCase();
            await createCasePage.selectRequester('adam');
            await createCasePage.setSummary('Summary' + randomStr);
            await createCasePage.clickSelectCaseTemplateButton();
            await selectCaseTemplateBlade.selectCaseTemplate(caseTemplateName);
            await changeAssignmentPage.setAssignee("US Support 1", "Qianru Tao");
            await createCasePage.clickSaveCaseButton();
            await previewCasePo.clickGoToCaseButton();
            let caseId = await viewCasePage.getCaseID();
            await updateStatusBladePo.changeStatus('In Progress');
            await updateStatusBladePo.clickSaveStatus();
            expect(await viewCasePage.getTextOfStatus()).toBe('In Progress');
            await viewCasePage.clickEditCaseButton();
            await changeAssignmentPage.setDropDownValue('AssignedGroup', "AU");
            await changeAssignmentPage.setDropDownValue('Assignee', "Qiwei");
            await editCasePage.clickSaveCase();
            await navigationPage.signOut();
            await loginPage.login('qliu');
            await caseConsolePage.searchAndOpenCase(caseId);
            expect(await activityTabPo.isTextPresentInActivityLog("Qianru Tao")).toBeTruthy("Text is not present in activiy tab1");
            await activityTabPo.clickOnShowMore();
            expect(await activityTabPo.isTextPresentInActivityLog("changed the following case fields")).toBeTruthy("Text is not present in activiy tab2");
            expect(await activityTabPo.isTextPresentInActivityLog("Assignee")).toBeTruthy("Text is not present in activiy tab3");
            expect(await activityTabPo.isTextPresentInActivityLog("Assigned Group")).toBeTruthy("Text is not present in activiy tab4");
            expect(await activityTabPo.isTextPresentInActivityLog("AU Support 1")).toBeTruthy("Text is not present in activiy tab5");
        });

        it('[5670]:  Case Agent user able to see all activity records in activity feed for a Case created using template', async () => {
            await activityTabPo.addActivityNote(activityNoteText);
            await activityTabPo.addAttachment([filePath]);
            await activityTabPo.clickOnPostButton();
            expect(await activityTabPo.isTextPresentInActivityLog(activityNoteText)).toBeTruthy('Private Note is not Added');
            expect(await activityTabPo.isAttachmentInActivity('bwfPdf.pdf')).toBeTruthy('File is not present on activity');
            await activityTabPo.addActivityNote(randomStr);
            await activityTabPo.clickPublicCheckbox();
            await activityTabPo.clickOnPostButton();
            expect(await activityTabPo.isTextPresentInActivityLog(randomStr)).toBeTruthy('Public Note is not Added');
            await viewCasePage.clickAttachmentsLink();
            await attachmentBladePage.searchAndSelectCheckBox('bwfPdf');
            expect(await attachmentBladePage.isDownloadButtonEnabled()).toBeTruthy('Download button is disabled');
            await attachmentBladePage.clickDownloadButton();
            expect(await utilityCommon.isFileDownloaded('bwfPdf.pdf')).toBeTruthy('File is not downloaded.');
            await utilityCommon.closeAllBlades();
        });

        afterAll(async () => {
            await navigationPage.signOut();
            await loginPage.login('qkatawazi');
        });
    });

    // passed
    describe('[5075]: Verify  sort on all attachments grid', () => {
        let summary = 'Adhoc task' + Math.floor(Math.random() * 1000000);
        let activityNoteText = [...Array(10)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        let caseSummary = '5075' + summary;

        it('[5075]: Verify  sort on all attachments grid', async () => {
            await navigationPage.gotoCreateCase();
            await createCasePage.selectRequester('adam');
            await createCasePage.setSummary(caseSummary);
            await createCasePage.addDescriptionAttachment(['../../data/ui/attachment/bwfPdf1.pdf', '../../data/ui/attachment/bwfPdf2.pdf', '../../data/ui/attachment/bwfPdf3.pdf', '../../data/ui/attachment/bwfPdf4.pdf']);
            await createCasePage.clickAssignToMeButton();
            await createCasePage.clickSaveCaseButton();
            await previewCasePo.clickGoToCaseButton();
            await activityTabPo.addActivityNote(activityNoteText);
            let fileName1: string[] = ['bwfWord1.rtf', 'bwfWord2.rtf', 'demo.txt', 'bwfJson1.json', 'bwfJson2.json'];
            const filesToUpload1 = fileName1.map((file) => { return `../../data/ui/attachment/${file}` });
            await activityTabPo.addAttachment(filesToUpload1);
            await activityTabPo.clickOnPostButton();
        });

        it('[5075]: Verify  sort on all attachments grid', async () => {
            await viewCasePage.clickAddTaskButton();
            await manageTaskBladePo.clickAddAdhocTaskButton();
            expect(await adhoctaskTemplate.isAttachmentButtonDisplayed()).toBeTruthy();
            await adhoctaskTemplate.setSummary(summary);
            await adhoctaskTemplate.setDescription("Description");
            expect(await adhoctaskTemplate.isAttachmentButtonEnabled()).toBeTruthy('Attachment button is disabled');
            let fileName2: string[] = ['bwfXsl.xsl', 'bwfXml.xml', 'bwfJson3.json', 'bwfJson4.json', 'bwfJson5.json'];
            const filesToUpload2 = fileName2.map((file) => { return `../../data/ui/attachment/${file}` });
            await adhoctaskTemplate.addAttachmentInDescription(filesToUpload2);
            await adhoctaskTemplate.clickSaveAdhoctask();
            await utilityCommon.closePopUpMessage();
            await manageTaskBladePo.clickCloseButton();
            await utilityCommon.closePopUpMessage();
            await viewCasePage.clickAttachmentsLink();
            await utilityGrid.isGridColumnSorted('Attached to', 'descending');
            await utilityGrid.isGridColumnSorted('Attached to', 'ascending');
            expect(await utilityGrid.isGridColumnSorted('Attachments', 'descending')).toBeTruthy("Attachment Not Sorted Desecnding");
            expect(await utilityGrid.isGridColumnSorted('Attachments', 'ascending')).toBeTruthy("Attachment Not Sorted Asecnding");
            expect(await utilityGrid.isGridColumnSorted('Media type', 'descending')).toBeTruthy("Media type Not Sorted Desecnding");
            expect(await utilityGrid.isGridColumnSorted('Media type', 'ascending')).toBeTruthy("Media type Not Sorted Asecnding");
            expect(await utilityGrid.isGridColumnSorted('Created date', 'descending')).toBeTruthy("Created date Not Sorted Desecnding");
            expect(await utilityGrid.isGridColumnSorted('Created date', 'ascending')).toBeTruthy("Created date Not Sorted Asecnding");
        });

        afterAll(async () => {
            await utilityCommon.closeAllBlades();
            await navigationPage.signOut();
            await loginPage.login('qkatawazi');
        });
    });

    // passed
    describe('[3429]:Assignment blade should list the agent names which are sorted alphabetically', async () => {
        let randomStr = [...Array(4)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        let CaseTemplateData = {
            "templateName": "CaseTemplate" + randomStr,
            "templateSummary": "CaseTemplate" + randomStr,
            "templateStatus": "Active",
            "company": "Petramco",
            "category1": "Employee Relations",
            "category2": "Compensation",
            "category3": "Bonus",
            "priority": "Low",
            "businessUnit": "United States Support",
            "supportGroup": "US Support 3",
            "assignee": "qkatawazi",
            "ownerBU": "United States Support",
            "ownerGroup": "US Support 3"
        }
        beforeAll(async () => {
            await apiHelper.apiLogin('qkatawazi');
            await apiHelper.createCaseTemplate(CaseTemplateData);
        });
        it('[3429]:Assignment blade should list the agent names which are sorted alphabetically', async () => {
            await navigationPage.gotoCreateCase();
            await createCasePage.selectRequester('adam');
            await createCasePage.setSummary('Summary' + randomStr);
            await createCasePage.clickSelectCaseTemplateButton();
            await selectCaseTemplateBlade.selectCaseTemplate(CaseTemplateData.templateName);
            await createCasePage.clickSaveCaseButton();
            await previewCasePo.clickGoToCaseButton();
            await viewCasePage.clickEditCaseButton();
            expect(await changeAssignmentPage.isDropDownListSorted("Assignee")).toBeTruthy("Agent List is Sorted");
        });
        afterAll(async () => {
            await utilityCommon.closeAllBlades();
            await navigationPage.signOut();
            await loginPage.login('qkatawazi');
        });
    });

    // passed
    describe('[3496,3497,3495]: User Should not allow to remove assignee when case is in "In Progress" Status', async () => {
        let randomStr = [...Array(5)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        let templateData1, templateData2, newCaseTemplate, autoTaskTemplateData;
        beforeAll(async () => {
            templateData1 = {
                "templateName": randomStr + "CaseTemplate1",
                "templateSummary": randomStr + "Summary1",
                "templateStatus": "Active",
                "company": "Petramco",
                "ownerBusinessUnit": "United States Support",
                "ownerGroup": "US Support 3"
            }
            templateData2 = {
                "templateName": randomStr + "CaseTemplate2",
                "templateSummary": randomStr + "Summary2",
                "templateStatus": "Active",
                "company": "Petramco",
                "ownerBusinessUnit": "United States Support",
                "ownerGroup": "US Support 3"
            }
            await apiHelper.apiLogin('qkatawazi');
            await apiHelper.createCaseTemplate(templateData2);
            newCaseTemplate = await apiHelper.createCaseTemplate(templateData1);
            autoTaskTemplateData = {
                "templateName": "autoTask" + randomStr,
                "templateSummary": "autoTask" + randomStr,
                "templateStatus": "Active",
                "processBundle": "com.bmc.dsm.case-lib",
                "processName": "Case Process " + randomStr,
                "taskCompany": "Petramco",
                "ownerCompany": "Petramco",
                "ownerBusinessUnit": "United States Support",
                "ownerGroup": "US Support 3"
            }
            let autoTaskTemplate = await apiHelper.createAutomatedTaskTemplate(autoTaskTemplateData);
            await apiHelper.associateCaseTemplateWithOneTaskTemplate(newCaseTemplate.displayId, autoTaskTemplate.displayId);
        });
        // passed
        it('[3496,3497,3495]: User Should not allow to remove assignee when case is in "In Progress" Status', async () => {
            await navigationPage.gotoCreateCase();
            await createCasePage.selectRequester('adam');
            await createCasePage.setSummary('Summary' + randomStr);
            await createCasePage.clickSaveCaseButton();
            await previewCasePo.clickGoToCaseButton();
            expect(await viewCasePage.getAssignedGroupValue()).toBe('Workforce Administration'); // default Assigned Group
            await updateStatusBladePo.changeStatus('In Progress');
            expect(await viewCasePage.getErrorMsgOfInprogressStatus()).toBe('Assignee is required for this case status.  Please select an assignee. ');
            await updateStatusBladePo.clickCancelButton();
        });
        // passed
        it('[3496,3497,3495]: User Should not allow to remove assignee when case is in "In Progress" Status', async () => {
            await navigationPage.gotoCreateCase();
            await createCasePage.selectRequester('adam');
            await createCasePage.setSummary('Summary2' + randomStr);
            await createCasePage.clickSelectCaseTemplateButton();
            await selectCaseTemplateBlade.selectCaseTemplate(templateData1.templateName);
            await createCasePage.clickSaveCaseButton();
            await previewCasePo.clickGoToCaseButton();
            await updateStatusBladePo.changeStatus('In Progress');
            expect(await viewCasePage.getErrorMsgOfInprogressStatus()).toBe('Assignee is required for this case status.  Please select an assignee. ');
            await updateStatusBladePo.clickCancelButton();
            await utilityCommon.clickOnApplicationWarningYesNoButton("Yes");
        });
        // passed
        it('[3496,3497,3495]: User Should not allow to remove assignee when case is in "In Progress" Status', async () => {
            await viewCasePage.clickEditCaseButton();
            await editCasePage.clickOnChangeCaseTemplate();
            await selectCaseTemplateBlade.selectCaseTemplate(templateData2.templateName);//Defect 1: Cannot read property 'resourceType' of undefined
            await editCasePage.clickSaveCase();//Defect 2: Cannot read property 'resourceType' of undefined
            await navigationPage.gotoCaseConsole();
            await utilityGrid.searchAndOpenHyperlink('Summary2' + randomStr);
            await updateStatusBladePo.changeStatus('In Progress');
            expect(await viewCasePage.getErrorMsgOfInprogressStatus()).toBe('Assignee is required for this case status.  Please select an assignee. ');
            await updateStatusBladePo.clickCancelButton();
            await utilityCommon.clickOnApplicationWarningYesNoButton("Yes");
            await viewCasePage.clickEditCaseButton();
            await changeAssignmentPage.setDropDownValue('AssignedGroup', 'US Support 3');
            await changeAssignmentPage.setDropDownValue('Assignee', 'qkatawazi');
            // await editCasePage.clickOnAssignToMe();
            await editCasePage.clickSaveCase();
            await updateStatusBladePo.changeStatus('In Progress');
            await updateStatusBladePo.clickSaveStatus();
            await utilityCommon.closePopUpMessage();
            await navigationPage.gotoTaskConsole();
            await utilityGrid.searchAndOpenHyperlink(autoTaskTemplateData.templateName);
            expect(await viewTaskPo.getTaskStatusValue()).toBe('Completed');
        });
        afterAll(async () => {
            await utilityCommon.closeAllBlades();
            await navigationPage.signOut();
            await loginPage.login('qkatawazi');
        });
    });

    // passed
    describe('[5375]: [Case] Source field on Case details/Case Workspace', async () => {
        let caseDataForEmail, caseDataForDwp, caseIdForEmail, caseIdForDWP
        beforeAll(async () => {
            caseDataForEmail = {
                "Description": "5356 Desc",
                "Requester": "qtao",
                "Summary": "5356-Summary",
                "Assigned Company": "Petramco",
                "Business Unit": "United States Support",
                "Support Group": "US Support 3",
                "Assignee": "qkatawazi",
                "Origin": "Email"
            }
            caseDataForDwp =
                {
                    "requester": "qtao",
                    "summary": "Testing case creation with minimal input data"
                }
            await apiHelper.apiLogin('qkatawazi');
            caseIdForEmail = await apiHelper.createCase(caseDataForEmail);
            caseIdForDWP = await apiHelper.createCaseFromDwp(caseDataForDwp);
        });
        it('[5375]: [Case] Source field on Case details/Case Workspace', async () => {
            let column: string[] = ["Source"];
            await navigationPage.gotoCaseConsole();
            await caseConsolePage.addColumns(column);
            await utilityGrid.clearFilter();
            await utilityGrid.addFilter("Source", "Digital Workplace", "text");
            expect(await utilityGrid.isGridRecordPresent(caseIdForDWP.displayId)).toBeTruthy();
            await utilityGrid.clearFilter();
            await utilityGrid.addFilter("Source", "Email", "text");
            expect(await utilityGrid.isGridRecordPresent(caseIdForEmail.displayId)).toBeTruthy();
        });
    });

    // passed
    describe('[4325]: Verify allow case reopen tag in case template', () => {
        const randomStr = [...Array(10)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        let caseTemplate1 = 'Case Template 1' + randomStr;
        let caseTemplate2 = 'Case Template 2' + randomStr;
        let caseTemplateSummary1 = 'Summary 1' + randomStr;
        let caseTemplateSummary2 = 'Summary 2' + randomStr;

        it('[4325]: Verify allow case reopen tag in case template', async () => {
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Case Management--Templates', BWF_PAGE_TITLES.CASE_MANAGEMENT.TEMPLATES);
            //case template with reopen case
            await consoleCasetemplatePo.clickOnCreateCaseTemplateButton();
            await createCaseTemplate.setTemplateName(caseTemplate1);
            await createCaseTemplate.setCompanyName('Petramco');
            await createCaseTemplate.setCaseSummary(caseTemplateSummary1);
            await createCaseTemplate.setAllowCaseReopenValue('Yes');
            await createCaseTemplate.setTemplateStatusDropdownValue('Active');
            await createCaseTemplate.setOwnerCompanyValue("Petramco");
            await createCaseTemplate.setOwnerOrgDropdownValue("United States Support");
            await createCaseTemplate.setOwnerGroupDropdownValue("US Support 3");
            await createCaseTemplate.clickSaveCaseTemplate();
            await utilityCommon.closePopUpMessage();
            await viewCasetemplatePo.clickBackArrowBtn();
            await navigationPage.gotoCaseConsole();
            //case template without reopen case
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Case Management--Templates', BWF_PAGE_TITLES.CASE_MANAGEMENT.TEMPLATES);
            await consoleCasetemplatePo.clickOnCreateCaseTemplateButton();
            await createCaseTemplate.setTemplateName(caseTemplate2);
            await createCaseTemplate.setCompanyName('Petramco');
            await createCaseTemplate.setCaseSummary(caseTemplateSummary2);
            await createCaseTemplate.setCaseStatusValue("Assigned");
            await changeAssignmentPage.setDropDownValue('AssignedGroup', 'US Support 3');
            await changeAssignmentPage.setDropDownValue('Assignee', 'Qadim Katawazi');
            await createCaseTemplate.setAllowCaseReopenValue('No');
            await createCaseTemplate.setTemplateStatusDropdownValue('Active');
            await createCaseTemplate.clickSaveCaseTemplate();
            await utilityCommon.closePopUpMessage();
        });

        it('[4325]: Verify allow case reopen tag in case template', async () => {
            //create case
            await navigationPage.signOut();
            await loginPage.login('qtao');
            await navigationPage.gotoCreateCase();
            await createCasePage.selectRequester('adam');
            await createCasePage.setSummary('Summary');
            await createCasePage.clickSelectCaseTemplateButton();
            await selectCaseTemplateBlade.selectCaseTemplate(caseTemplate1);
            await changeAssignmentPage.setAssignee("US Support 1", "Qianru Tao");
            await createCasePage.clickSaveCaseButton();
            await previewCasePo.clickGoToCaseButton();
            await updateStatusBladePo.changeStatus('In Progress');
            await updateStatusBladePo.clickSaveStatus();
            await updateStatusBladePo.changeStatus('Resolved');
            await updateStatusBladePo.selectStatusReason('Auto Resolved');
            await updateStatusBladePo.clickSaveStatus();
            await updateStatusBladePo.changeStatus('Closed');
            await updateStatusBladePo.clickSaveStatus();
            await utilityCommon.closePopUpMessage();
        });

        it('[4325]: Verify allow case reopen tag in case template', async () => {
            await viewCasePage.clickOnReopenCaseLink();
            //add second case template
            await viewCasePage.clickEditCaseButton();
            expect(await editCasePage.isChangeCaseTemplateButtonDisplayed()).toBeFalsy('change template button is Displayed');
            await editCasePage.clickOnCancelCaseButton();
            await updateStatusBladePo.changeStatus('Resolved');
            await updateStatusBladePo.selectStatusReason('Auto Resolved');
            await updateStatusBladePo.clickSaveStatus();
            await updateStatusBladePo.changeStatus('Assigned');
            await updateStatusBladePo.clickSaveStatus('Assigned');
            await viewCasePage.clickEditCaseButton();
            await editCasePage.clickOnChangeCaseTemplate();
            await selectCaseTemplateBlade.selectCaseTemplate(caseTemplate2);
            await editCasePage.clickSaveCase();
            await updateStatusBladePo.changeStatus('In Progress');
            await updateStatusBladePo.clickSaveStatus();
            await updateStatusBladePo.changeStatus('Resolved');
            await updateStatusBladePo.selectStatusReason('Auto Resolved');
            await updateStatusBladePo.clickSaveStatus();
            await updateStatusBladePo.changeStatus('Closed');
            await updateStatusBladePo.clickSaveStatus();
            expect(await viewCasePage.isCaseReopenLinkPresent()).toBeFalsy();
        });

        afterAll(async () => {
            await utilityCommon.switchToDefaultWindowClosingOtherTabs();
            await utilityCommon.closeAllBlades();
            await navigationPage.signOut();
            await loginPage.login("qkatawazi");
        });
    });

    // passed
    describe('[5010]: [ Task ] - Verify create case with Global task template having assignment', () => {
        const randomStr = [...Array(10)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        let globalCategName = 'Applications';
        let categName2 = 'Social';
        let categName3 = 'Chatter';
        let TaskTemplate = 'Manual task' + randomStr;
        let TaskSummary = 'Summary' + randomStr;

        // passed
        it('[5010]: [ Task ] - Verify create case with Global task template having assignment', async () => {
            //manual Task template
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Task Management--Templates', BWF_PAGE_TITLES.TASK_MANAGEMENT.TEMPLATES);
            await selectTaskTemplate.clickOnManualTaskTemplateButton();
            await createTaskTemplate.setTemplateName(TaskTemplate);
            await createTaskTemplate.setTaskSummary(TaskSummary);
            await createTaskTemplate.setTaskDescription('Description');
            await createTaskTemplate.selectCompanyByName('Global');
            await createTaskTemplate.selectTaskCategoryTier1(globalCategName);
            await createTaskTemplate.selectTaskCategoryTier2(categName2);
            await createTaskTemplate.selectTaskCategoryTier3(categName3);
            await createTaskTemplate.selectOwnerCompany('Petramco');
            await createTaskTemplate.selectBuisnessUnit('United States Support');
            await createTaskTemplate.selectOwnerGroup('US Support 3');
            await createTaskTemplate.selectTemplateStatus('Active');
            await createTaskTemplate.clickOnSaveTaskTemplate();
            expect(await viewTasktemplatePage.getOwnerCompanyValue()).toBe("Petramco");
            //await utilityCommon.closePopUpMessage();
            //Create Case
            await navigationPage.signOut();
            await loginPage.login('qtao');
            await navigationPage.gotoCreateCase();
            await createCasePage.selectRequester('adam');
            await createCasePage.setSummary('Summary1212');
            await createCasePage.clickAssignToMeButton();
            await createCasePage.clickSaveCaseButton();
            await previewCasePo.clickGoToCaseButton();
            await viewCasePage.clickAddTaskButton();
            await manageTaskBladePo.clickAddTaskFromTemplateButton();
            await manageTaskBladePo.setTaskSearchBoxValue(TaskSummary);
            await manageTaskBladePo.clickFirstCheckBoxInTaskTemplateSearchGrid();
            await manageTaskBladePo.clickTaskGridSaveButton();
            await manageTaskBladePo.clickCloseButton();
        });

        // 
        it('[5010]: [ Task ] - Verify create case with Global task template having assignment', async () => {
            await navigationPage.signOut();
            await loginPage.login('gwixillian');
            //Create Case
            let caseDataPsilon = {
                "Description": "4298 Psilon",
                "Requester": "gderuno",
                "Summary": "4298 Psilon",
                "Assigned Company": "Psilon",
                "Business Unit": "Psilon Support Org2",
                "Support Group": "Psilon Support Group2",
                "Assignee": "gwixillian"
            }
            await apiHelper.apiLogin('gwixillian');
            let psilonCaseResponse = await apiHelper.createCase(caseDataPsilon);
            await navigationPage.gotoCaseConsole();
            await caseConsolePage.searchAndOpenCase(psilonCaseResponse.displayId);
            await viewCasePage.clickAddTaskButton();
            await manageTaskBladePo.clickAddTaskFromTemplateButton();
            await manageTaskBladePo.setTaskSearchBoxValue(TaskSummary);
            await manageTaskBladePo.clickFirstCheckBoxInTaskTemplateSearchGrid();
            await manageTaskBladePo.clickTaskGridSaveButton();
            await manageTaskBladePo.clickTaskLink(TaskSummary);
            expect(await viewTaskPo.getAssigneeText()).toBe('None', 'Assignee Should be blank');
        });

        afterAll(async () => {
            await utilityCommon.closeAllBlades();
            await navigationPage.signOut();
            await loginPage.login('qkatawazi');
        });
    });

    // passed
    describe('[4393]: Verify the status transition Closed->New is available only when Closed case is Reopened', () => {
        const randomStr = [...Array(10)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        let caseTemplate = randomStr + 'CaseTemplate';
        let caseTemplateSummary1 = 'Summary 1' + randomStr;

        it('[4393]: Verify the status transition Closed->New is available only when Closed case is Reopened', async () => {
            await navigationPage.signOut();
            await loginPage.login('qkatawazi');
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Case Management--Templates', BWF_PAGE_TITLES.CASE_MANAGEMENT.TEMPLATES);
            //case template with reopen case
            await consoleCasetemplatePo.clickOnCreateCaseTemplateButton();
            await createCaseTemplate.setTemplateName(caseTemplate);
            await createCaseTemplate.setCompanyName('Petramco');
            await createCaseTemplate.setCaseSummary(caseTemplateSummary1);
            await createCaseTemplate.setAllowCaseReopenValue('Yes');
            await createCaseTemplate.setTemplateStatusDropdownValue('Active');
            await createCaseTemplate.setCaseStatusValue("Assigned");
            await changeAssignmentPage.setDropDownValue('AssignedGroup', 'US Support 3');
            await changeAssignmentPage.setDropDownValue('Assignee', 'Qadim Katawazi');
            await createCaseTemplate.clickSaveCaseTemplate();
            await viewCasetemplatePo.clickBackArrowBtn();
            await navigationPage.gotoCaseConsole();
        });

        it('[4393]: Verify the status transition Closed->New is available only when Closed case is Reopened', async () => {
            //add first case 
            await navigationPage.gotoCreateCase();
            await createCasePage.selectRequester('adam');
            await createCasePage.setSummary('Summary 2');
            await createCasePage.clickSelectCaseTemplateButton();
            await selectCaseTemplateBlade.selectCaseTemplate(caseTemplate);
            await createCasePage.clickAssignToMeButton();
            await createCasePage.clickSaveCaseButton();
            await previewCasePo.clickGoToCaseButton();
            expect(await viewCasePage.isCaseReopenLinkPresent()).toBeFalsy('Case Reopen Link is present');
            await updateStatusBladePo.changeStatus('In Progress');
            await updateStatusBladePo.clickSaveStatus();
            expect(await viewCasePage.isCaseReopenLinkPresent()).toBeFalsy('Case Reopen Link is present');
            await updateStatusBladePo.changeStatus('Pending');
            await updateStatusBladePo.selectStatusReason('Error');
            await updateStatusBladePo.clickSaveStatus();
            expect(await viewCasePage.isCaseReopenLinkPresent()).toBeFalsy('Case Reopen Link is present');
            await updateStatusBladePo.changeStatus('Canceled');
            await updateStatusBladePo.selectStatusReason('Approval Rejected');
            await updateStatusBladePo.clickSaveStatus();
            expect(await viewCasePage.isCaseReopenLinkPresent()).toBeFalsy('Case Reopen Link is present');
        });

        it('[4393]: Verify the status transition Closed->New is available only when Closed case is Reopened', async () => {
            //create case
            await navigationPage.gotoCreateCase();
            await createCasePage.selectRequester('adam');
            await createCasePage.setSummary('Summary');
            await createCasePage.clickSelectCaseTemplateButton();
            await selectCaseTemplateBlade.selectCaseTemplate(caseTemplate);
            await createCasePage.clickAssignToMeButton();
            await createCasePage.clickSaveCaseButton();
            await previewCasePo.clickGoToCaseButton();
            await utilityCommon.closePopUpMessage();
            await updateStatusBladePo.changeStatus('In Progress');
            await updateStatusBladePo.clickSaveStatus();
            expect(await viewCasePage.isCaseReopenLinkPresent()).toBeFalsy('Case Reopen Link is present');
            await updateStatusBladePo.changeStatus('Pending');
            await updateStatusBladePo.selectStatusReason('Error');
            await updateStatusBladePo.clickSaveStatus();
            expect(await viewCasePage.isCaseReopenLinkPresent()).toBeFalsy('Case Reopen Link is present');
            await updateStatusBladePo.changeStatus('Resolved');
            await updateStatusBladePo.selectStatusReason('Auto Resolved');
            await updateStatusBladePo.clickSaveStatus();
            expect(await viewCasePage.isCaseReopenLinkPresent()).toBeTruthy('Case Reopen Link is not present');
            await updateStatusBladePo.changeStatus('Closed');
            await updateStatusBladePo.clickSaveStatus();
            expect(await viewCasePage.isCaseReopenLinkPresent()).toBeTruthy('Case Reopen Link is not present');
            await viewCasePage.clickOnReopenCaseLink();
            await utilityCommon.closePopUpMessage();
            expect(await viewCasePage.getTextOfStatus()).toBe('In Progress');
        });

        afterAll(async () => {
            await utilityCommon.closeAllBlades();
            await navigationPage.signOut();
            await loginPage.login('qkatawazi');
        });
    });

    // passed
    describe('[5038]: [Case Creation] create case with Global case template without flowset ', () => {
        const randomStr = [...Array(10)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        let caseTemplate1 = 'Case Template 1' + randomStr;
        let caseTemplateSummary1 = 'Summary' + randomStr;

        it('[5038]: [Case Creation] create case with Global case template without flowset ', async () => {
            await navigationPage.signOut();
            await loginPage.login('qkatawazi');
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Case Management--Templates', BWF_PAGE_TITLES.CASE_MANAGEMENT.TEMPLATES);
            //case template with reopen case
            await consoleCasetemplatePo.clickOnCreateCaseTemplateButton();
            await createCaseTemplate.setTemplateName(caseTemplate1);
            await createCaseTemplate.setCompanyName('Global');
            await createCaseTemplate.setCaseSummary(caseTemplateSummary1);
            await createCaseTemplate.setTemplateStatusDropdownValue('Active');
            await createCaseTemplate.clickSaveCaseTemplate();
            await viewCasetemplatePo.clickBackArrowBtn();
            //create case
            await navigationPage.gotoCreateCase();
            await createCasePage.selectRequester('adam');
            await createCasePage.setSummary(caseTemplate1);
            await createCasePage.clickSelectCaseTemplateButton();
            await selectCaseTemplateBlade.selectCaseTemplate(caseTemplate1);
            await createCasePage.clickAssignToMeButton();
            await createCasePage.clickSaveCaseButton();
            await previewCasePo.clickGoToCaseButton();
            expect(await viewCasePage.getCaseSummary()).toBe(caseTemplate1);
        });

        afterAll(async () => {
            await navigationPage.signOut();
            await loginPage.login('qkatawazi');
        });
    });

    // passed
    describe('[4330]: Reopen configurations available on Case Template Create screen ', () => {
        const randomStr = [...Array(10)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        let caseTemplate1 = 'Case Template 1' + randomStr;
        let caseTemplate2 = 'Case Template 2' + randomStr;
        let caseTemplateSummary1 = 'Summary 1' + randomStr;
        let caseTemplateSummary2 = 'Summary 2' + randomStr;
        // passed
        it('[4330]: Reopen configurations available on Case Template Create screen ', async () => {
            await navigationPage.signOut();
            await loginPage.login('qkatawazi');
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Case Management--Templates', BWF_PAGE_TITLES.CASE_MANAGEMENT.TEMPLATES);
            //case template with reopen case
            await consoleCasetemplatePo.clickOnCreateCaseTemplateButton();
            await createCaseTemplate.setTemplateName(caseTemplate1);
            await createCaseTemplate.setCompanyName('Petramco');
            await createCaseTemplate.setCaseSummary(caseTemplateSummary1);
            await createCaseTemplate.setAllowCaseReopenValue('Yes');
            await createCaseTemplate.setTemplateStatusDropdownValue('Active');
            await createCaseTemplate.clickSaveCaseTemplate();
            await viewCasetemplatePo.clickBackArrowBtn();
            await navigationPage.gotoCaseConsole();
            //case template with reopen case
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Case Management--Templates', BWF_PAGE_TITLES.CASE_MANAGEMENT.TEMPLATES);
            await consoleCasetemplatePo.clickOnCreateCaseTemplateButton();
            await createCaseTemplate.setTemplateName(caseTemplate2);
            await createCaseTemplate.setCompanyName('Petramco');
            await createCaseTemplate.setCaseSummary(caseTemplateSummary2);
            await createCaseTemplate.setAllowCaseReopenValue('No');
            await createCaseTemplate.setTemplateStatusDropdownValue('Active');
            await createCaseTemplate.clickSaveCaseTemplate();
            await viewCasetemplatePo.clickBackArrowBtn();
        });

        // passed
        it('[4330]: Reopen configurations available on Case Template Create screen ', async () => {
            //create case
            await navigationPage.gotoCreateCase();
            await createCasePage.selectRequester('adam');
            await createCasePage.setSummary('Summary');
            await createCasePage.clickSelectCaseTemplateButton();
            await selectCaseTemplateBlade.selectCaseTemplate(caseTemplate1);
            await changeAssignmentPage.setAssignee("US Support 3", "Qadim Katawazi");
            await createCasePage.clickSaveCaseButton();
            await previewCasePo.clickGoToCaseButton();
            await updateStatusBladePo.changeStatus('In Progress');
            await updateStatusBladePo.clickSaveStatus();
            await updateStatusBladePo.changeStatus('Resolved');
            await updateStatusBladePo.selectStatusReason('Auto Resolved');
            await updateStatusBladePo.clickSaveStatus();
            await updateStatusBladePo.changeStatus('Closed');
            await updateStatusBladePo.clickSaveStatus();
            expect(await viewCasePage.isCaseReopenLinkPresent()).toBeTruthy();
        });

        // passed
        it('[4330]: Reopen configurations available on Case Template Create screen ', async () => {
            //add second case template
            await navigationPage.gotoCreateCase();
            await createCasePage.selectRequester('adam');
            await createCasePage.setSummary('Summary 2');
            await createCasePage.clickSelectCaseTemplateButton();
            await selectCaseTemplateBlade.selectCaseTemplate(caseTemplate2);
            await createCasePage.clickAssignToMeButton();
            await createCasePage.clickSaveCaseButton();
            await previewCasePo.clickGoToCaseButton();
            await updateStatusBladePo.changeStatus('In Progress');
            await updateStatusBladePo.clickSaveStatus();
            await updateStatusBladePo.changeStatus('Resolved');
            await updateStatusBladePo.selectStatusReason('Auto Resolved');
            await updateStatusBladePo.clickSaveStatus();
            await updateStatusBladePo.changeStatus('Closed');
            await updateStatusBladePo.clickSaveStatus();
            expect(await viewCasePage.isCaseReopenLinkPresent()).toBeFalsy();
        });

        afterAll(async () => {
            await navigationPage.signOut();
            await loginPage.login('qkatawazi');
        });
    });

    // passed
    xdescribe('[3570,3569]:Create a Company specific Configuration for Resolution Code/Description and Check on Case', async () => {
        let randomStr = [...Array(4)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        beforeAll(async () => {
            await apiHelper.apiLogin('tadmin');
            await apiHelper.addCommonConfig('RESOLUTION_CODE_MANDATORY', '1');
            await apiHelper.addCommonConfig('RESOLUTION_DESCRIPTION_MANDATORY', '1');
            await apiHelper.addCommonConfig('RESOLUTION_CODE_MANDATORY', '1', 'Facilities');
            await apiHelper.addCommonConfig('RESOLUTION_DESCRIPTION_MANDATORY', '1', 'Facilities');
        });
        // passed
        it('[3570,3569]:Create a Company specific Configuration for Resolution Code/Description and Check on Case', async () => {
            await navigationPage.gotoCreateCase();
            await createCasePage.selectRequester('adam');
            await createCasePage.setSummary('Summary' + randomStr);
            await createCasePage.clickAssignToMeButton();
            await createCasePage.clickSaveCaseButton();
            await previewCasePo.clickGoToCaseButton();
            await updateStatusBladePo.changeStatus('In Progress');
            await updateStatusBladePo.clickSaveStatus();
            await updateStatusBladePo.changeStatus('Resolved');
            expect(await updateStatusBladePo.isRequiredTagToResolutionCode()).toBeTruthy('FailureMsg: Required Tab for Resolution Code is missing');
            expect(await updateStatusBladePo.isRequiredTagToResolutionDescription()).toBeTruthy('FailureMsg: Required Tab for Resolution Code is missing');
            expect(await updateStatusBladePo.isSaveUpdateStatusButtonEnabled()).toBeFalsy('FailureMsg: Save button is not enabled');
            await updateStatusBladePo.clickCancelButton();
            await utilityCommon.clickOnApplicationWarningYesNoButton("Yes");
            await apiHelper.apiLogin('tadmin');
            await apiHelper.addCommonConfig('RESOLUTION_CODE_MANDATORY', '0');
            await apiHelper.addCommonConfig('RESOLUTION_DESCRIPTION_MANDATORY', '0');
            await navigationPage.signOut();
            await loginPage.login('fritz');
            await navigationPage.gotoCreateCase();
            await createCasePage.selectRequester('adam');
            await createCasePage.setSummary('Summary' + randomStr);
            await createCasePage.clickAssignToMeButton();
            await createCasePage.clickSaveCaseButton();
            await previewCasePo.clickGoToCaseButton();
            await updateStatusBladePo.changeStatus('In Progress');
            await updateStatusBladePo.clickSaveStatus();
            await updateStatusBladePo.changeStatus('Resolved');
            expect(await updateStatusBladePo.isRequiredTagToResolutionCode()).toBeTruthy('FailureMsg: Required Tab for Resolution Code is missing');
            expect(await updateStatusBladePo.isRequiredTagToResolutionDescription()).toBeTruthy('FailureMsg: Required Tab for Resolution Code is missing');
            expect(await updateStatusBladePo.isSaveUpdateStatusButtonEnabled()).toBeFalsy('FailureMsg: Save button is not enabled');
            await updateStatusBladePo.clickCancelButton();
            await utilityCommon.clickOnApplicationWarningYesNoButton("Yes");
        });
        // passed
        it('[3570,3569]:Create a Company specific Configuration for Resolution Code/Description and Check on Case', async () => {
            await navigationPage.signOut();
            await loginPage.login('qkatawazi');
            await navigationPage.gotoCreateCase();
            await createCasePage.selectRequester('adam');
            await createCasePage.setSummary('Summary2' + randomStr);
            await createCasePage.clickAssignToMeButton();
            await createCasePage.clickSaveCaseButton();
            await previewCasePo.clickGoToCaseButton();
            await updateStatusBladePo.changeStatus('In Progress');
            await updateStatusBladePo.clickSaveStatus();
            await utilityCommon.closePopUpMessage();
            await updateStatusBladePo.changeStatus('Resolved');
            await updateStatusBladePo.selectStatusReason('Auto Resolved');
            expect(await updateStatusBladePo.isSaveUpdateStatusButtonEnabled()).toBeTruthy('FailureMsg: Save button is not enabled');
            await updateStatusBladePo.clickSaveStatus();
            await utilityCommon.closePopUpMessage();
            expect(await viewCasePage.getTextOfStatus()).toBe('Resolved');
        });
        afterAll(async () => {
            await apiHelper.apiLogin('tadmin');
            await apiHelper.addCommonConfig('RESOLUTION_CODE_MANDATORY', '0');
            await apiHelper.addCommonConfig('RESOLUTION_DESCRIPTION_MANDATORY', '0');
            await apiHelper.addCommonConfig('RESOLUTION_CODE_MANDATORY', '0', 'Facilities');
            await apiHelper.addCommonConfig('RESOLUTION_DESCRIPTION_MANDATORY', '0', 'Facilities');
            await utilityCommon.closeAllBlades();
            await navigationPage.signOut();
            await loginPage.login('qkatawazi');
        });
    });
});  
