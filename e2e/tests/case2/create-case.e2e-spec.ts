import { $, browser } from "protractor";
import apiHelper from '../../api/api.helper';
import attachmentBladePage from "../../pageobject/attachment/attachment-blade.po";
import caseConsolePage from '../../pageobject/case/case-console.po';
import previewCasePo from '../../pageobject/case/case-preview.po';
import createCasePage from "../../pageobject/case/create-case.po";
import editCasePage from '../../pageobject/case/edit-case.po';
import selectCaseTemplateBlade from '../../pageobject/case/select-casetemplate-blade.po';
import viewCasePage from "../../pageobject/case/view-case.po";
import changeAssignmentPage from '../../pageobject/common/change-assignment-blade.po';
import changAssignmentOldPage from '../../pageobject/common/change-assignment-old-blade.po';
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
import selectTaskTemplate from "../../pageobject/settings/task-management/console-tasktemplate.po";
import createTaskTemplate from '../../pageobject/settings/task-management/create-tasktemplate.po';
import taskTemplatePreview from '../../pageobject/settings/task-management/preview-task-template.po';
import viewTasktemplatePage from '../../pageobject/settings/task-management/view-tasktemplate.po';
import activityTabPo from '../../pageobject/social/activity-tab.po';
import taskConsolepage from "../../pageobject/task/console-task.po";
import adhoctaskTemplate from "../../pageobject/task/create-adhoc-task.po";
import manageTask from "../../pageobject/task/manage-task-blade.po";
import { BWF_BASE_URL } from '../../utils/constants';
import utilCommon from '../../utils/util.common';
import utilGrid from '../../utils/util.grid';
import utilityCommon from '../../utils/utility.common';
import utilityGrid from '../../utils/utility.grid';
import viewTaskPo from '../../pageobject/task/view-task.po';
import manageTaskBladePo from '../../pageobject/task/manage-task-blade.po';
let randomStr = [...Array(10)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
describe("Create Case", () => {

    beforeAll(async () => {
        await browser.get(BWF_BASE_URL);
        await loginPage.login("qkatawazi");
    });

    afterAll(async () => {
        await utilityCommon.closeAllBlades();
        await navigationPage.signOut();
    });

    //kgaikwad
    it('[DRDMV-15253]: Verify Category Tier 4 Can be Populated After Tier 3 selection', async () => {
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

    //kgaikwad
    describe('[DRDMV-17653]: Check Resolution Code and Resolution Description fields added on Case View and Status Change blade', () => {
        let randVal = [...Array(10)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        let caseId: string = undefined;
        beforeAll(async () => {
            let caseData = {
                "Requester": "qtao",
                "Summary": "Test case for DRDMV-2530",
                "Assigned Company": "Petramco",
                "Business Unit": "United States Support",
                "Support Group": "US Support 3",
                "Assignee": "qkatawazi"
            }
            await apiHelper.apiLogin('qkatawazi');
            let newCase1 = await apiHelper.createCase(caseData);
            caseId = newCase1.displayId;
        });

        it('[DRDMV-17653]: Check Resolution Code and Resolution Description fields added on Case View and Status Change blade', async () => {
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Application Configuration--Menu Items', 'Menu Items - Business Workflows');
            await createMenuItems.clickOnMenuOptionLink();
            await createMenuItems.selectMenuNameDropDown('Resolution Code');
            await createMenuItems.clickOnLocalizeLink();
            await localizeValuePopPo.setLocalizeValue(randVal);
            await localizeValuePopPo.clickOnSaveButton();
            await createMenuItems.clickOnSaveButton();
            await utilGrid.searchRecord(randVal);
            await navigationPage.gotoCaseConsole();
            await caseConsolePage.searchAndOpenCase(caseId);
            expect(await $(viewCasePage.selectors.resolutionCodeText).isDisplayed()).toBeTruthy('Missing Resolution Text');
            expect(await $(viewCasePage.selectors.resolutionDescriptionLabel).isDisplayed()).toBeTruthy('Missing Resolution Description Text');
        });

        it('[DRDMV-17653]: Check Resolution Code and Resolution Description fields added on Case View and Status Change blade', async () => {
            await viewCasePage.clickEditCaseButton();
            await editCasePage.updateResolutionCode(randVal);
            await editCasePage.setResolutionDescription(randVal);
            await editCasePage.clickSaveCase();
            await utilityCommon.closePopUpMessage();
            expect(await viewCasePage.getResolutionCodeValue()).toBe(randVal);
            expect(await viewCasePage.getResolutionDescription()).toBe(randVal);
            await updateStatusBladePo.changeCaseStatus('Resolved');
            await updateStatusBladePo.setStatusReason('Customer Follow-Up Required');
            expect(await updateStatusBladePo.isResolutionDescriptionTextBoxEmpty()).toBeFalsy('Resolution Description Text Box is not empty');
            await updateStatusBladePo.clickSaveStatus();
            await utilityCommon.closePopUpMessage();
            expect(await viewCasePage.getTextOfStatus()).toBe('Resolved');
            await updateStatusBladePo.changeCaseStatus('Closed');
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

    //kgaikwad
    describe('[DRDMV-18031]: [UI]Resolution Code can be view on Case with respect to input in field "Available on UI"', () => {
        let randVal = [...Array(10)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        let caseId1, caseId2;
        beforeAll(async () => {
            let caseData1 = {
                "Requester": "qtao",
                "Summary": "Test case for DRDMV-2530",
                "Assigned Company": "Petramco",
                "Business Unit": "United States Support",
                "Support Group": "US Support 3",
                "Assignee": "qkatawazi"
            }

            let caseData2 = {
                "Requester": "qtao",
                "Summary": "Test case for DRDMV-2530",
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

        it('[DRDMV-18031]: [UI]Resolution Code can be view on Case with respect to input in field "Available on UI"', async () => {
            await navigationPage.signOut();
            await loginPage.login("qkatawazi");
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Application Configuration--Menu Items', 'Menu Items - Business Workflows');
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

        it('[DRDMV-18031]: [UI]Resolution Code can be view on Case with respect to input in field "Available on UI"', async () => {
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Application Configuration--Menu Items', 'Menu Items - Business Workflows');
            await menuItemConsole.searchAndEditMenuOption(randVal);
            await editMenuItemsConfigPo.selectAvailableOnUIToggleButton(false);
            await editMenuItemsConfigPo.clickOnSaveButton();
            await utilCommon.closePopUpMessage();
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

    //ankagraw
    it('[DRDMV-1191,DRDMV-1198]: [Case Creation] Case creation with/without mandatory fields populated ', async () => {
        let prioirtyValue: string[] = ["Critical", "High", "Medium", "Low"];
        const randomStr = [...Array(10)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        let caseSummary = 'Case Summary ' + randomStr;
        await navigationPage.gotoCreateCase();
        expect(await createCasePage.isSaveCaseButtonEnabled()).toBeFalsy("Save button is enabled");
        await createCasePage.selectRequester('adam');
        expect(await createCasePage.isSaveCaseButtonEnabled()).toBeFalsy();
        //expect(await utilCommon.isPopUpMessagePresent('Resolve the field validation errors and then try again.')).tobeTruthy; Save button wont enable unless summary is set
        //await utilCommon.closePopUpMessage();
        //await utilCommon.closePopUpMessage();
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

    //ankagraw
    describe('[DRDMV-1193,DRDMV-1190]: [Case Creation] Case Create view (UI verification) ', () => {
        const randomStr = [...Array(10)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        let caseSummary = 'Summary ' + randomStr;

        it('[DRDMV-1193,DRDMV-1190]: [Case Creation] Case Create view (UI verification) ', async () => {
            await navigationPage.signOut();
            await loginPage.login('qtao');
            await navigationPage.gotoCreateCase();
            expect(await createCasePage.isRequesterRequiredTextPresent()).toBeTruthy("required text absent in Request");
            expect(await createCasePage.isSummaryRequiredTextPresent()).toBeTruthy("required text absent in Summary");
            expect(await createCasePage.isPriorityRequiredTextPresent()).toBeTruthy("required text absent in Priority");
            expect(await createCasePage.isCompanyRequiredTextPresent()).toBeTruthy("required text absent in Assigned Company");
            expect(await createCasePage.isSelectCaseTemplateButtonEnabled()).toBeFalsy("Select Case template is Disabled");
            expect(await createCasePage.isClearTemplateButtonEnabled()).toBeFalsy("Clear Template is Disabled");
            expect(await createCasePage.isAutocategorizationEnabled()).toBeFalsy("Autocategorization is Disabled");
            expect(await createCasePage.isAssignedCompanyReadOnly()).toBeTruthy("Assigned Company read only");
            expect(await createCasePage.isBuisnessUnitReadOnly()).toBeTruthy("BuisnessUnit read only");
            expect(await createCasePage.isDepartmentReadOnly()).toBeTruthy("Department read only");
            expect(await createCasePage.isAssignedGroupReadOnly()).toBeTruthy("Assigned group read only");
            expect(await createCasePage.isAssigneeReadOnly()).toBeTruthy("Assignee read only");
            expect(await createCasePage.isAttachmentButtonDisplayed()).toBeTruthy("Attachment button not displayed");
            expect(await createCasePage.isSaveCaseButtonEnabled()).toBeFalsy("Save button is enables")
            await createCasePage.selectRequester('adam');
            await createCasePage.setSummary(caseSummary);
            await createCasePage.setDescription('Description');
            await createCasePage.setContactName('kye');
            await createCasePage.selectSite('Pune');
            await createCasePage.selectCategoryTier1('Applications');
            await createCasePage.selectCategoryTier2('Social');
            await createCasePage.selectCategoryTier3('Chatter');
            await createCasePage.addDescriptionAttachment(['../../data/ui/attachment/demo.txt']);
            await createCasePage.clickAssignToMeButton();
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

    //ankagraw
    it('[DRDMV-1237]: [Global navigation] Navigation to Workspaces and Create subitems in the Shell ', async () => {
        try {
            await navigationPage.gotoCaseConsole();
            await navigationPage.signOut();
            await loginPage.login('qtao');
            await expect((await caseConsolePage.getCaseTitle()).trim()).toBe('Cases', "Case title is not displayed in Case Console Page");
            await navigationPage.gotoTaskConsole();
            await expect((await taskConsolepage.getTaskTitle()).trim()).toBe('Tasks', "task title is not displayed in task Console Page");
            await navigationPage.gotoCaseConsole();
            await expect((await caseConsolePage.getCaseTitle()).trim()).toBe('Cases', "Case title is not displayed in Case Console Page");
            await navigationPage.gotoKnowledgeConsole();
            await expect((await KnowledgeConsolePage.getKnowledgeArticleTitle()).trim()).toBe('Knowledge Articles', "Knowledge title is not displayed in Knowledge Console Page");
            await navigationPage.gotoCreateCase();
            await expect((await createCasePage.getCreateCaseTitle()).trim()).toBe('Create Case', "Create Case title is not displayed in Create Case Page");
            await navigationPage.gotoCreateKnowledge();
            await expect((await createKnowledgePage.getCreateKnowledgeHeader()).trim()).toContain('Create Knowledge', "Create Knowledge title is not displayed in Create knowledge Page");
        } catch (e) { throw e; }
        finally {
            await navigationPage.signOut();
            await loginPage.login('qkatawazi');
        }
    });

    //ankagraw
    describe('[DRDMV-7027]: [Permissions] [Global navigation] Access to the shell menu items for different roles', () => {
        it('[DRDMV-7027]: [Permissions] [Global navigation] Access to the shell menu items for different roles', async () => {
            await expect(navigationPage.isCaseConsoleDisplayed()).toBeTruthy("Case Console is not displayed ");
            await expect(navigationPage.isTaskConsoleDisplayed()).toBeTruthy("task Console is not displayed ");
            await expect(navigationPage.isKnowledgeConsoleDisplayed()).toBeTruthy("Knowledge Console is not displayed ");
            await expect((await caseConsolePage.getCaseTitle()).trim()).toBe('Cases', "Case title is not displayed in Case Console Page");
            await expect(navigationPage.isCreateCaseDisplayed()).toBeTruthy("Create Case is not displayed ");
            await expect(navigationPage.isCreateKnowledgeDisplayed()).toBeTruthy("Create knowledge is not displayed ");
            await expect(navigationPage.isQuickCaseDisplayed()).toBeTruthy('Quick case is not displayed');

            await navigationPage.signOut();
            await loginPage.login('qtao');
            await expect((await caseConsolePage.getCaseTitle()).trim()).toBe('Cases', "Case title is not displayed in Case Console Page");
            await expect(navigationPage.isCaseConsoleDisplayed()).toBeTruthy("Case Console is not displayed ");
            await expect(navigationPage.isTaskConsoleDisplayed()).toBeTruthy("task Console is not displayed ");
            await expect(navigationPage.isKnowledgeConsoleDisplayed()).toBeTruthy("Knowledge Console is not displayed ");
            await expect(navigationPage.isCreateCaseDisplayed()).toBeTruthy("Create Case is not displayed ");
            await expect(navigationPage.isCreateKnowledgeDisplayed()).toBeTruthy("Create knowledge is not displayed ");
            await expect(navigationPage.isQuickCaseDisplayed()).toBeTruthy('Quick case is not displayed');
        });

        it('[DRDMV-7027]: [Permissions] [Global navigation] Access to the shell menu items for different roles', async () => {
            await navigationPage.signOut();
            await loginPage.login('qdu');
            await expect((await caseConsolePage.getCaseTitle()).trim()).toBe('Cases', "Case title is not displayed in Case Console Page");
            await expect(navigationPage.isCaseConsoleDisplayed()).toBeTruthy("Case Console is not displayed ");
            await expect(navigationPage.isTaskConsoleDisplayed()).toBeTruthy("task Console is not displayed ");
            await expect(navigationPage.isKnowledgeConsoleDisplayed()).toBeTruthy("Knowledge Console is not displayed ");
            await expect(navigationPage.isCreateCaseDisplayed()).toBeTruthy("Create Case is not displayed ");
            await expect(navigationPage.isCreateKnowledgeDisplayed()).toBeTruthy("Create knowledge is not displayed ");
            await expect(navigationPage.isQuickCaseDisplayed()).toBeTruthy('Quick case is not displayed');
        });

        afterAll(async () => {
            await navigationPage.signOut();
            await loginPage.login('qkatawazi');
        });
    });

    //ankagraw
    describe('[DRDMV-8868]: [Case Creation] [Template Selection] Case/Task Template preview from Case creation', () => {
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

        it('[DRDMV-8868]: [Case Creation] [Template Selection] Case/Task Template preview from Case creation', async () => {
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
            expect(await caseTemplatePreview.isCaseCategoryTier1TitleDisplayed('Case Category Tier 1')).toBeTruthy('Case Category Tier 1 is not getting displayed');
            expect(await caseTemplatePreview.isCaseCategoryTier2TitleDisplayed('Case Category Tier 2')).toBeTruthy('Case Category Tier 2 is not getting displayed');
            expect(await caseTemplatePreview.isCaseCategoryTier3TitleDisplayed('Case Category Tier 3')).toBeTruthy('Case Category Tier 3 is not getting displayed');
            expect(await caseTemplatePreview.isCaseCategoryTier4TitleDisplayed('Case Category Tier 4')).toBeTruthy('Case Category Tier 4 is not getting displayed');
            expect(await caseTemplatePreview.isFlowsetTitleDisplayed('Flowset')).toBeTruthy('Flowset is not getting displayed');
            expect(await caseTemplatePreview.isLabelTitleDisplayed('Label')).toBeTruthy('Label is not getting displayed');
            expect(await caseTemplatePreview.isCaseDescriptionTitleDisplayed('Case Description')).toBeTruthy('Case Description is not getting displayed');
            expect(await caseTemplatePreview.isSupportCompanyTitleDisplayed('Support Company')).toBeTruthy('Support Company is not getting displayed');
            expect(await caseTemplatePreview.isSupportGroupTitleDisplayed('Support Group')).toBeTruthy('Support Group is not getting displayed');
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
        });

        it('[DRDMV-8868]: [Case Creation] [Template Selection] Case/Task Template preview from Case creation', async () => {
            await viewCasePage.clickAddTaskButton();
            await manageTask.clickAddTaskFromTemplateButton();
            await manageTask.searchAndOpenTaskTemplate(templateData.templateName);
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

    //ankagraw
    describe('[DRDMV-5479,DRDMV-1192]: Verify case assignment on Create Case', () => {
        it('[DRDMV-5479,DRDMV-1192]: Verify case assignment on Create Case', async () => {
            await navigationPage.signOut();
            await loginPage.login('qfeng');
            await navigationPage.gotoCreateCase();
            expect(await createCasePage.isAssigneToMeEnabled()).toBeFalsy();
            expect(await createCasePage.isChangeAssignmentButtonEnabled()).toBeFalsy();
            await createCasePage.selectRequester('adam');
            await createCasePage.setSummary('Summary');
            expect(await createCasePage.getCompany()).toBe('Petramco');
            await createCasePage.clickChangeAssignmentButton();
            expect(await changeAssignmentPage.isAssignToMeCheckBoxSelected()).toBeFalsy();
            expect(await changeAssignmentPage.getCompanyDefaultValue()).toBe('Petramco');
            await changeAssignmentPage.selectBusinessUnit('United States Support')
            await changeAssignmentPage.selectSupportGroup('US Support 3');
            await changeAssignmentPage.selectAssignee('Qadim Katawazi');
            await changeAssignmentPage.clickOnAssignButton();
            await createCasePage.clickChangeAssignmentButton();
            await changeAssignmentPage.clickOnAssignToMeCheckBox();
            expect(await changeAssignmentPage.getAssigneeName()).toBe('Qiao Feng');
            await changeAssignmentPage.clickOnCancelButton();
            await createCasePage.clickChangeAssignmentButton();
            await changeAssignmentPage.selectBusinessUnit('United States Support')
            await changeAssignmentPage.selectSupportGroup('US Support 3');
            await changeAssignmentPage.selectAssignToSupportGroup();
            await changeAssignmentPage.clickOnAssignButton();
            await createCasePage.clickAssignToMeButton();
            await createCasePage.clickSaveCaseButton();
            await previewCasePo.clickGoToCaseButton();
            expect(await viewCasePage.getAssignedGroupText()).toBe('US Support 3');
            expect(await viewCasePage.getAssigneeText()).toBe('Qiao Feng');
        });

        afterAll(async () => {
            await navigationPage.signOut();
            await loginPage.login('qkatawazi');
        });

    });

    //ankagraw
    it('[DRDMV-1614]: [Case] Fields validation for case in New status ', async () => {
        try {
            const randomStr = [...Array(10)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
            let caseSummary = 'Case Summary ' + randomStr;
            await navigationPage.signOut();
            await loginPage.login("qtao");
            await navigationPage.gotoCreateCase();
            expect(await createCasePage.isRequesterRequiredTextPresent()).toBeTruthy("Requester Reqired text not present");
            expect(await createCasePage.isSummaryRequiredTextPresent()).toBeTruthy("Summary Reqired text not present");
            expect(await createCasePage.isSourceRequiredTextPresent()).toBeTruthy("Source Reqired text not present");
            expect(await createCasePage.isPriorityRequiredTextPresent()).toBeTruthy("Priority Reqired text not present");
            expect(await createCasePage.isCompanyRequiredTextPresent()).toBeTruthy("Assigned Company Reqired text not present");
            expect((await createCasePage.getCreateCaseTitle()).trim()).toBe('Create Case', "Create Case title is not displayed in Create Case Page");
            expect(await createCasePage.isSaveCaseButtonEnabled()).toBeFalsy("Save button is enabled");
            await createCasePage.selectRequester('adam');
            // await createCasePage.clickSaveCaseButtonWithoutMessageDisappear();
            // expect(await utilCommon.isPopUpMessagePresent('Resolve the field validation errors and then try again.').tobeTruthy();
            // await utilCommon.closePopUpMessage();
            await expect(createCasePage.isSaveCaseButtonEnabled()).toBeFalsy("Save button is Enabled");
            //await utilCommon.closePopUpMessage();
            await createCasePage.setSummary(caseSummary);
            await createCasePage.clickSaveCaseButton();
            await previewCasePo.clickGoToCaseButton();
            await expect(await viewCasePage.getCaseStatusValue()).toBe('New');
            await viewCasePage.clickEditCaseButton();
            expect(await editCasePage.isSummaryRequiredText()).toBeTruthy("Summary Required text not present");
            expect(await editCasePage.isPriorityRequiredText()).toBeTruthy("Priority Required text not present");
            expect(await editCasePage.isAssignedCompanyRequiredText()).toBeTruthy("Assigned Company Required text not present");
            expect(await editCasePage.isAssignedGroupRequiredText()).toBeTruthy("Assigned Group Required text not present");
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

    it('[DRDMV-1620]: [Case] Fields validation for case in Closed status ', async () => {
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
            await utilGrid.clearFilter();
            await caseConsolePage.searchAndOpenCase(closed);
            await viewCasePage.clickEditCaseButton();
            await editCasePage.updateCasePriority('Critical');
            await expect(editCasePage.isSaveCaseEnable()).toBeFalsy("Save button Visible");
        } catch (error) {
            throw error;
        } finally {
            await navigationPage.signOut();
            await loginPage.login("qkatawazi");
        }
    });

    //apdeshmu
    describe('[DRDMV-5325]:  Case Agent user able to see all activity records in activity feed for a Case created using template', () => {
        let randomStr = [...Array(4)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        let activityNoteText = [...Array(10)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        let filePath = '../../data/ui/attachment/bwfPdf.pdf';
        let caseTemplateName = "CaseTemplate" + randomStr;
        let petramcoStr = "Petramco";
        let aUsupportStr = "AU Support 1";
        let kasiaOstlunsStr = "Kasia Ostlun";
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

        it('[DRDMV-5325]:  Case Agent user able to see all activity records in activity feed for a Case created using template', async () => {
            await navigationPage.signOut();
            await loginPage.login("qtao");
            await navigationPage.gotoCreateCase();
            await createCasePage.selectRequester('adam');
            await createCasePage.setSummary('Summary' + randomStr);
            await createCasePage.clickSelectCaseTemplateButton();
            await selectCaseTemplateBlade.selectCaseTemplate(caseTemplateName);
            await createCasePage.clickAssignToMeButton();
            await createCasePage.clickSaveCaseButton();
            await previewCasePo.clickGoToCaseButton();
            await updateStatusBladePo.changeCaseStatus('In Progress');
            await updateStatusBladePo.clickSaveStatus();
            expect(await viewCasePage.getTextOfStatus()).toBe('In Progress');
            await viewCasePage.clickEditCaseButton();
            await editCasePage.clickChangeAssignmentButton();
            await changeAssignmentPage.setAssignee(petramcoStr, 'Australia Support', aUsupportStr, "RA3 Liu");
            await editCasePage.clickSaveCase();
            expect(await activityTabPo.isTextPresentInActivityLog("RA3 Liu")).toBeTruthy("Text is not present in activiy tab1");
            await activityTabPo.clickShowMoreLinkInActivity(1);
            expect(await activityTabPo.isTextPresentInActivityLog("changed the following case fields")).toBeTruthy("Text is not present in activiy tab2");
            expect(await activityTabPo.isTextPresentInActivityLog("Assignee")).toBeTruthy("Text is not present in activiy tab3");
            expect(await activityTabPo.isTextPresentInActivityLog("Assigned Group")).toBeTruthy("Text is not present in activiy tab4");
            expect(await activityTabPo.isTextPresentInActivityLog("AU Support 1")).toBeTruthy("Text is not present in activiy tab5");
        });

        it('[DRDMV-5325]:  Case Agent user able to see all activity records in activity feed for a Case created using template', async () => {
            await activityTabPo.addActivityNote(activityNoteText);
            await activityTabPo.addAttachment([filePath]);
            await activityTabPo.clickOnPostButton();
            await expect(activityTabPo.isTextPresentInActivityLog(activityNoteText)).toBeTruthy('Private Note is not Added');
            expect(await activityTabPo.isAttachmentInActivity('bwfPdf.pdf')).toBeTruthy('File is not present on activity');
            await activityTabPo.addActivityNote(randomStr);
            await activityTabPo.clickPublicCheckbox();
            await activityTabPo.clickOnPostButton();
            expect(await activityTabPo.isTextPresentInActivityLog(randomStr)).toBeTruthy('Public Note is not Added');
            await viewCasePage.clickAttachmentsLink();
            await attachmentBladePage.searchAndSelectCheckBox('bwfPdf');
            expect(await attachmentBladePage.isDownloadButtonEnabled()).toBeTruthy('Download button is disabled');
            await attachmentBladePage.clickDownloadButton();
            expect(await utilCommon.isFileDownloaded('bwfPdf.pdf')).toBeTruthy('File is not downloaded.');
            await utilityCommon.closeAllBlades();
        });

        afterAll(async () => {
            await navigationPage.signOut();
            await loginPage.login('qkatawazi');
        });
    });

    describe('[DRDMV-11700]: Verify  sort on all attachments grid', () => {
        let summary = 'Adhoc task' + Math.floor(Math.random() * 1000000);
        let activityNoteText = [...Array(10)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        let caseSummary = 'DRDMV-11700' + summary;

        it('[DRDMV-11700]: Verify  sort on all attachments grid', async () => {
            await navigationPage.gotoCreateCase();
            await createCasePage.selectRequester('adam');
            await createCasePage.setSummary(caseSummary);
            await createCasePage.addDescriptionAttachment(['../../data/ui/attachment/bwfPdf.pdf', '../../data/ui/attachment/bwfPdf1.pdf', '../../data/ui/attachment/bwfPdf2.pdf', '../../data/ui/attachment/bwfPdf3.pdf', '../../data/ui/attachment/bwfPdf4.pdf']);
            await createCasePage.clickSaveCaseButton();
            await previewCasePo.clickGoToCaseButton();
            await activityTabPo.addActivityNote(activityNoteText);
            let fileName1: string[] = ['bwfWord1.rtf', 'bwfWord2.rtf', 'demo.txt', 'bwfJson1.json', 'bwfJson2.json'];
            const filesToUpload1 = fileName1.map((file) => { return `../../data/ui/attachment/${file}` });
            await activityTabPo.addAttachment(filesToUpload1);
            await activityTabPo.clickOnPostButton();
        });

        it('[DRDMV-11700]: Verify  sort on all attachments grid', async () => {
            await viewCasePage.clickAddTaskButton();
            await manageTask.clickAddAdhocTaskButton();
            expect(await adhoctaskTemplate.isAttachmentButtonDisplayed()).toBeTruthy();
            await adhoctaskTemplate.setSummary(summary);
            await adhoctaskTemplate.setDescription("Description");
            expect(await adhoctaskTemplate.isAttachmentButtonEnabled()).toBeTruthy('Attachment button is disabled');
            let fileName2: string[] = ['bwfXsl.xsl', 'bwfXml.xml', 'bwfJson3.json', 'bwfJson4.json', 'bwfJson5.json'];
            const filesToUpload2 = fileName2.map((file) => { return `../../data/ui/attachment/${file}` });
            await adhoctaskTemplate.addAttachmentInDescription(filesToUpload2);
            await adhoctaskTemplate.clickSaveAdhoctask();
            await utilityCommon.closePopUpMessage();
            await manageTask.clickCloseButton();
            await utilCommon.closePopUpMessage();
            await viewCasePage.clickAttachmentsLink();
            expect(await utilityGrid.isGridColumnSorted('Attachments', 'desc')).toBeTruthy("Attachment Not Sorted Desecnding");
            expect(await utilityGrid.isGridColumnSorted('Attachments', 'asc')).toBeTruthy("Attachment Not Sorted Asecnding");
            expect(await utilityGrid.isGridColumnSorted('Media type', 'desc')).toBeTruthy("Media type Not Sorted Desecnding");
            expect(await utilityGrid.isGridColumnSorted('Media type', 'asc')).toBeTruthy("Media type Not Sorted Asecnding");
            expect(await utilityGrid.isGridColumnSorted('Created date', 'desc')).toBeTruthy("Created date Not Sorted Desecnding");
            expect(await utilityGrid.isGridColumnSorted('Created date', 'asc')).toBeTruthy("Created date Not Sorted Asecnding");
        });

        afterAll(async () => {
            await utilityCommon.closeAllBlades();
            await navigationPage.signOut();
            await loginPage.login('qkatawazi');
        });
    });

    it('[DRDMV-22772]:Assignment blade should list the agent names which are sorted alphabetically', async () => {
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
        await apiHelper.apiLogin('qkatawazi');
        await apiHelper.createCaseTemplate(CaseTemplateData);
        await navigationPage.gotoCreateCase();
        await createCasePage.selectRequester('adam');
        await createCasePage.setSummary('Summary' + randomStr);
        await createCasePage.clickSelectCaseTemplateButton();
        await selectCaseTemplateBlade.selectCaseTemplate(CaseTemplateData.templateName);
        await createCasePage.clickSaveCaseButton();
        await previewCasePo.clickGoToCaseButton();
        await viewCasePage.clickEditCaseButton();
        await editCasePage.clickChangeAssignmentButton();
        expect(await changeAssignmentPage.isAgentListSorted()).toBeTruthy("Agent List is Sorted");
    });

    describe('[DRDMV-22293,DRDMV-22292,DRDMV-22294]: User Should not allow to remove assignee when case is in "In Progress" Status', async () => {
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
            await apiHelper.createCaseTemplate(templateData1);
            newCaseTemplate = await apiHelper.createCaseTemplate(templateData2);
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
        it('[DRDMV-22293,DRDMV-22292,DRDMV-22294]: User Should not allow to remove assignee when case is in "In Progress" Status', async () => {
            await navigationPage.gotoCreateCase();
            await createCasePage.selectRequester('adam');
            await createCasePage.setSummary('Summary' + randomStr);
            await createCasePage.clickSaveCaseButton();
            await previewCasePo.clickGoToCaseButton();
            expect(await viewCasePage.getAssignedGroupText()).toBe('Workforce Administration');
            await updateStatusBladePo.changeCaseStatus('In Progress');       
            expect(await viewCasePage.getErrorMsgOfInprogressStatus()).toBe('Assignee is required for this case status.  Please select an assignee. ');
            await updateStatusBladePo.clickCancelButton();
        });
        it('[DRDMV-22293,DRDMV-22292,DRDMV-22294]: User Should not allow to remove assignee when case is in "In Progress" Status', async () => {
            await navigationPage.gotoCreateCase();
            await createCasePage.selectRequester('adam');
            await createCasePage.setSummary('Summary2' + randomStr);
            await createCasePage.clickSelectCaseTemplateButton();
            await selectCaseTemplateBlade.selectCaseTemplate(templateData1.templateName);
            await createCasePage.clickSaveCaseButton();
            await previewCasePo.clickGoToCaseButton();
            await updateStatusBladePo.changeCaseStatus('In Progress');
            expect(await viewCasePage.getErrorMsgOfInprogressStatus()).toBe('Assignee is required for this case status.  Please select an assignee. ');
            await updateStatusBladePo.clickCancelButton();
            await utilityCommon.clickOnApplicationWarningYesNoButton("Yes");
            await viewCasePage.clickEditCaseButton();
            await editCasePage.clickOnChangeCaseTemplate();
            await selectCaseTemplateBlade.selectCaseTemplate(templateData2.templateName);
            await editCasePage.clickSaveCase();
            await navigationPage.gotoCaseConsole();
            await utilityGrid.searchAndOpenHyperlink('Summary2' + randomStr);
            await updateStatusBladePo.changeCaseStatus('In Progress');
            expect(await viewCasePage.getErrorMsgOfInprogressStatus()).toBe('Assignee is required for this case status.  Please select an assignee. ');
            await updateStatusBladePo.clickCancelButton();
            await utilityCommon.clickOnApplicationWarningYesNoButton("Yes");
            await viewCasePage.clickEditCaseButton();
            await editCasePage.clickOnAssignToMe();
            await editCasePage.clickSaveCase();
            await updateStatusBladePo.changeCaseStatus('In Progress');
            await updateStatusBladePo.clickSaveStatus();
            await utilityCommon.closePopUpMessage();
            await viewCasePage.openTaskCard(1);
            await manageTaskBladePo.clickTaskLink(autoTaskTemplateData.templateName);
            expect(await viewTaskPo.getTaskStatusValue()).toBe('Completed');
        });
        afterAll(async () => {
            await utilityCommon.closeAllBlades();
            await navigationPage.signOut();
            await loginPage.login('qkatawazi');
        });
    });

    describe('[DRDMV-9052]: [Case] Source field on Case details/Case Workspace', async () => {
        let caseDataForEmail, caseDataForDwp, caseIdForEmail, caseIdForDWP
        beforeAll(async () => {
            caseDataForEmail = {
                "Description": "DRDMV-9181 Desc",
                "Requester": "qtao",
                "Summary": "DRDMV-9181-Summary",
                "Assigned Company": "Petramco",
                "Business Unit": "United States Support",
                "Support Group": "US Support 1",
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
        it('[DRDMV-9052]: [Case] Source field on Case details/Case Workspace', async () => {
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

    //ankagraw
    describe('[DRDMV-16081]: Verify allow case reopen tag in case template', () => {
        const randomStr = [...Array(10)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        let caseTemplate1 = 'Case Template 1' + randomStr;
        let caseTemplate2 = 'Case Template 2' + randomStr;
        let caseTemplateSummary1 = 'Summary 1' + randomStr;
        let caseTemplateSummary2 = 'Summary 2' + randomStr;

        it('[DRDMV-16081]: Verify allow case reopen tag in case template', async () => {
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Case Management--Templates', 'Case Templates - Business Workflows');
            //case template with reopen case
            await consoleCasetemplatePo.clickOnCreateCaseTemplateButton();
            await createCaseTemplate.setTemplateName(caseTemplate1);
            await createCaseTemplate.setCompanyName('Petramco');
            await createCaseTemplate.setCaseSummary(caseTemplateSummary1);
            await createCaseTemplate.setAllowCaseReopenValue('Yes');
            await createCaseTemplate.setTemplateStatusDropdownValue('Active');
            await createCaseTemplate.clickSaveCaseTemplate();
            await utilCommon.closePopUpMessage();
            //case template without reopen case
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Case Management--Templates', 'Case Templates - Business Workflows');
            await consoleCasetemplatePo.clickOnCreateCaseTemplateButton();
            await createCaseTemplate.setTemplateName(caseTemplate2);
            await createCaseTemplate.setCompanyName('Petramco');
            await createCaseTemplate.setCaseSummary(caseTemplateSummary2);
            await createCaseTemplate.setCaseStatusValue("Assigned");
            await createCaseTemplate.clickOnChangeAssignmentButton();
            await changAssignmentOldPage.setAssignee('Petramco', 'United States Support', 'US Support 3', 'Qadim Katawazi')
            await createCaseTemplate.setAllowCaseReopenValue('No');
            await createCaseTemplate.setTemplateStatusDropdownValue('Active');
            await createCaseTemplate.clickSaveCaseTemplate();
            await utilCommon.closePopUpMessage();
        });

        it('[DRDMV-16081]: Verify allow case reopen tag in case template', async () => {
            //create case
            await navigationPage.signOut();
            await loginPage.login('qtao');
            await navigationPage.gotoCreateCase();
            await createCasePage.selectRequester('adam');
            await createCasePage.setSummary('Summary');
            await createCasePage.clickSelectCaseTemplateButton();
            await selectCaseTemplateBlade.selectCaseTemplate(caseTemplate1);
            await createCasePage.clickAssignToMeButton();
            await createCasePage.clickSaveCaseButton();
            await previewCasePo.clickGoToCaseButton();
            await updateStatusBladePo.changeCaseStatus('In Progress');
            await updateStatusBladePo.clickSaveStatus();
            await updateStatusBladePo.changeCaseStatus('Resolved');
            await updateStatusBladePo.setStatusReason('Auto Resolved');
            await updateStatusBladePo.clickSaveStatus();
            await updateStatusBladePo.changeCaseStatus('Closed');
            await updateStatusBladePo.clickSaveStatus();
        });

        it('[DRDMV-16081]: Verify allow case reopen tag in case template', async () => {
            await viewCasePage.clickOnReopenCaseLink();
            //add second case template
            await viewCasePage.clickEditCaseButton();
            expect(await editCasePage.isChangeCaseTemplateButtonDisplayed()).toBeFalsy('change template button is Displayed');
            await editCasePage.clickOnCancelCaseButton();
            await updateStatusBladePo.changeCaseStatus('Resolved');
            await updateStatusBladePo.setStatusReason('Auto Resolved');
            await updateStatusBladePo.clickSaveStatus();
            await updateStatusBladePo.changeCaseStatus('Assigned');
            await updateStatusBladePo.clickSaveStatus('Assigned');
            await viewCasePage.clickEditCaseButton();
            await editCasePage.clickOnChangeCaseTemplate();
            await selectCaseTemplateBlade.selectCaseTemplate(caseTemplate2);
            await editCasePage.clickSaveCase();
            await updateStatusBladePo.changeCaseStatus('In Progress');
            await updateStatusBladePo.clickSaveStatus();
            await updateStatusBladePo.changeCaseStatus('Resolved');
            await updateStatusBladePo.setStatusReason('Auto Resolved');
            await updateStatusBladePo.clickSaveStatus();
            await updateStatusBladePo.changeCaseStatus('Closed');
            await updateStatusBladePo.clickSaveStatus();
            await expect(viewCasePage.isCaseReopenLinkPresent()).toBeFalsy();
        });

        afterAll(async () => {
            await utilityCommon.switchToDefaultWindowClosingOtherTabs();
            await navigationPage.signOut();
            await loginPage.login("qkatawazi");
        });
    });

    //ankagraw
    describe('[DRDMV-12061]: [ Task ] - Verify create case with Global task template having assignment', () => {
        const randomStr = [...Array(10)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        let globalCategName = 'Applications';
        let categName2 = 'Social';
        let categName3 = 'Chatter';
        let TaskTemplate = 'Manual task' + randomStr;
        let TaskSummary = 'Summary' + randomStr;

        it('[DRDMV-12061]: [ Task ] - Verify create case with Global task template having assignment', async () => {
            //manual Task template
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Task Management--Templates', 'Task Templates - Business Workflows');
            await selectTaskTemplate.clickOnManualTaskTemplateButton();
            await createTaskTemplate.setTemplateName(TaskTemplate);
            await createTaskTemplate.setTaskSummary(TaskSummary);
            await createTaskTemplate.setTaskDescription('Description');
            await createTaskTemplate.selectCompanyByName('Global');
            await createTaskTemplate.selectTaskCategoryTier1(globalCategName);
            await createTaskTemplate.selectTaskCategoryTier2(categName2);
            await createTaskTemplate.selectTaskCategoryTier3(categName3);
            await createTaskTemplate.selectTemplateStatus('Active');
            await createTaskTemplate.clickOnSaveTaskTemplate();
            await expect(viewTasktemplatePage.getOwnerCompanyValue()).toBe("Petramco");
            //await utilCommon.closePopUpMessage();
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
            await manageTask.clickAddTaskFromTemplateButton();
            await manageTask.setTaskSearchBoxValue(TaskSummary);
            await manageTask.clickFirstCheckBoxInTaskTemplateSearchGrid();
            await manageTask.clickTaskGridSaveButton();
            await manageTask.clickCloseButton();
        });

        it('[DRDMV-12061]: [ Task ] - Verify create case with Global task template having assignment', async () => {
            await apiHelper.apiLogin('tadmin');
            let userData = {
                "firstName": "Petramco",
                "lastName": "Psilon",
                "userId": "DRDMV-12061",
                "company": "Psilon",
                "userPermission": ["Case Business Analyst", "Human Resource"]
            }
            await apiHelper.createNewUser(userData);
            await apiHelper.associatePersonToCompany(userData.userId, "Psilon");
            await navigationPage.signOut();
            await loginPage.login(userData.userId + "@petramco.com", 'Password_1234');
            //Create Case
            let caseDataPsilon = {
                "Description": "DRDMV-16112 Psilon",
                "Requester": "gderuno",
                "Summary": "DRDMV-16112 Psilon",
                "Assigned Company": "Psilon",
                "Business Unit": "Psilon Support Org2",
                "Support Group": "Psilon Support Group2",
                "Assignee": "gwixillian"
            }
            await apiHelper.apiLogin(userData.userId + "@petramco.com", 'Password_1234');
            let psilonCaseResponse = await apiHelper.createCase(caseDataPsilon);
            await navigationPage.gotoCaseConsole();
            await caseConsolePage.searchAndOpenCase(psilonCaseResponse.displayId);
            await viewCasePage.clickAddTaskButton();
            await manageTask.clickAddTaskFromTemplateButton();
            await manageTask.setTaskSearchBoxValue(TaskSummary);
            await manageTask.clickFirstCheckBoxInTaskTemplateSearchGrid();
            await manageTask.clickTaskGridSaveButton();
            await manageTask.clickTaskLink(TaskSummary);
            expect(await viewTaskPo.getAssigneeText()).toBe('None', 'Assignee Should be blank');
        });

        afterAll(async () => {
            await navigationPage.signOut();
            await loginPage.login('qkatawazi');
        });
    });

    //ankagraw
    describe('[DRDMV-15974]: Verify the status transition Closed->New is available only when Closed case is Reopened', () => {
        const randomStr = [...Array(10)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        let caseTemplate = randomStr + 'CaseTemplate';
        let caseTemplateSummary1 = 'Summary 1' + randomStr;

        it('[DRDMV-15974]: Verify the status transition Closed->New is available only when Closed case is Reopened', async () => {
            await navigationPage.signOut();
            await loginPage.login('qkatawazi');
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Case Management--Templates', 'Case Templates - Business Workflows');
            //case template with reopen case
            await consoleCasetemplatePo.clickOnCreateCaseTemplateButton();
            await createCaseTemplate.setTemplateName(caseTemplate);
            await createCaseTemplate.setCompanyName('Petramco');
            await createCaseTemplate.setCaseSummary(caseTemplateSummary1);
            await createCaseTemplate.setAllowCaseReopenValue('Yes');
            await createCaseTemplate.setTemplateStatusDropdownValue('Active');
            await createCaseTemplate.setCaseStatusValue("Assigned");
            await createCaseTemplate.clickOnChangeAssignmentButton();
            await changAssignmentOldPage.setAssignee('Petramco', 'United States Support', 'US Support 3', 'Qadim Katawazi')
            await createCaseTemplate.clickSaveCaseTemplate();
        });

        it('[DRDMV-15974]: Verify the status transition Closed->New is available only when Closed case is Reopened', async () => {
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
            await updateStatusBladePo.changeCaseStatus('In Progress');
            await updateStatusBladePo.clickSaveStatus();
            expect(await viewCasePage.isCaseReopenLinkPresent()).toBeFalsy('Case Reopen Link is present');
            await updateStatusBladePo.changeCaseStatus('Pending');
            await updateStatusBladePo.setStatusReason('Error');
            await updateStatusBladePo.clickSaveStatus();
            expect(await viewCasePage.isCaseReopenLinkPresent()).toBeFalsy('Case Reopen Link is present');
            await updateStatusBladePo.changeCaseStatus('Canceled');
            await updateStatusBladePo.setStatusReason('Approval Rejected');
            await updateStatusBladePo.clickSaveStatus();
            expect(await viewCasePage.isCaseReopenLinkPresent()).toBeFalsy('Case Reopen Link is present');
        });

        it('[DRDMV-15974]: Verify the status transition Closed->New is available only when Closed case is Reopened', async () => {
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
            await updateStatusBladePo.changeCaseStatus('In Progress');
            await updateStatusBladePo.clickSaveStatus();
            expect(await viewCasePage.isCaseReopenLinkPresent()).toBeFalsy('Case Reopen Link is present');
            await updateStatusBladePo.changeCaseStatus('Pending');
            await updateStatusBladePo.setStatusReason('Error');
            await updateStatusBladePo.clickSaveStatus();
            expect(await viewCasePage.isCaseReopenLinkPresent()).toBeFalsy('Case Reopen Link is present');
            await updateStatusBladePo.changeCaseStatus('Resolved');
            await updateStatusBladePo.setStatusReason('Auto Resolved');
            await updateStatusBladePo.clickSaveStatus();
            expect(await viewCasePage.isCaseReopenLinkPresent()).toBeTruthy('Case Reopen Link is not present');
            await updateStatusBladePo.changeCaseStatus('Closed');
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

    //ankagraw
    describe('[DRDMV-11856]: [Case Creation] create case with Global case template without flowset ', () => {
        const randomStr = [...Array(10)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        let caseTemplate1 = 'Case Template 1' + randomStr;
        let caseTemplateSummary1 = 'Summary' + randomStr;

        it('[DRDMV-11856]: [Case Creation] create case with Global case template without flowset ', async () => {
            await navigationPage.signOut();
            await loginPage.login('qkatawazi');
            await navigationPage.gotoSettingsPage();
            expect(await navigationPage.gotoSettingsMenuItem('Case Management--Templates', 'Case Templates - Business Workflows')).toEqual('Case Templates - Business Workflows');
            //case template with reopen case
            await consoleCasetemplatePo.clickOnCreateCaseTemplateButton();
            await createCaseTemplate.setTemplateName(caseTemplate1);
            await createCaseTemplate.setCompanyName('Global');
            await createCaseTemplate.setCaseSummary(caseTemplateSummary1);
            await createCaseTemplate.setTemplateStatusDropdownValue('Active');
            await createCaseTemplate.clickSaveCaseTemplate();
            //create case
            await navigationPage.gotoCreateCase();
            await createCasePage.selectRequester('adam');
            await createCasePage.setSummary(caseTemplate1);
            await createCasePage.clickSelectCaseTemplateButton();
            await selectCaseTemplateBlade.selectCaseTemplate(caseTemplate1);
            await createCasePage.clickAssignToMeButton();
            await createCasePage.clickSaveCaseButton();
            await previewCasePo.clickGoToCaseButton();
            await expect(viewCasePage.getCaseSummary()).toBe(caseTemplate1);
        });

        afterAll(async () => {
            await navigationPage.signOut();
            await loginPage.login('qkatawazi');
        });
    });

    //ankagraw
    describe('[DRDMV-16076]: Reopen configurations available on Case Template Create screen ', () => {
        const randomStr = [...Array(10)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        let caseTemplate1 = 'Case Template 1' + randomStr;
        let caseTemplate2 = 'Case Template 2' + randomStr;
        let caseTemplateSummary1 = 'Summary 1' + randomStr;
        let caseTemplateSummary2 = 'Summary 2' + randomStr;

        it('[DRDMV-16076]: Reopen configurations available on Case Template Create screen ', async () => {
            await navigationPage.signOut();
            await loginPage.login('qkatawazi');
            await navigationPage.gotoSettingsPage();
            expect(await navigationPage.gotoSettingsMenuItem('Case Management--Templates', 'Case Templates - Business Workflows')).toEqual('Case Templates - Business Workflows');
            //case template with reopen case
            await consoleCasetemplatePo.clickOnCreateCaseTemplateButton();
            await createCaseTemplate.setTemplateName(caseTemplate1);
            await createCaseTemplate.setCompanyName('Petramco');
            await createCaseTemplate.setCaseSummary(caseTemplateSummary1);
            await createCaseTemplate.setAllowCaseReopenValue('Yes');
            await createCaseTemplate.setTemplateStatusDropdownValue('Active');
            await createCaseTemplate.clickSaveCaseTemplate();
            //case template with reopen case
            await navigationPage.gotoSettingsPage();
            expect(await navigationPage.gotoSettingsMenuItem('Case Management--Templates', 'Case Templates - Business Workflows')).toEqual('Case Templates - Business Workflows');
            await consoleCasetemplatePo.clickOnCreateCaseTemplateButton();
            await createCaseTemplate.setTemplateName(caseTemplate2);
            await createCaseTemplate.setCompanyName('Petramco');
            await createCaseTemplate.setCaseSummary(caseTemplateSummary2);
            await createCaseTemplate.setAllowCaseReopenValue('No');
            await createCaseTemplate.setTemplateStatusDropdownValue('Active');
            await createCaseTemplate.clickSaveCaseTemplate();
        });

        it('[DRDMV-16076]: Reopen configurations available on Case Template Create screen ', async () => {
            //create case
            await navigationPage.gotoCreateCase();
            await createCasePage.selectRequester('adam');
            await createCasePage.setSummary('Summary');
            await createCasePage.clickSelectCaseTemplateButton();
            await selectCaseTemplateBlade.selectCaseTemplate(caseTemplate1);
            await createCasePage.clickAssignToMeButton();
            await createCasePage.clickSaveCaseButton();
            await previewCasePo.clickGoToCaseButton();
            await updateStatusBladePo.changeCaseStatus('In Progress');
            await updateStatusBladePo.clickSaveStatus();
            await updateStatusBladePo.changeCaseStatus('Resolved');
            await updateStatusBladePo.setStatusReason('Auto Resolved');
            await updateStatusBladePo.clickSaveStatus();
            await updateStatusBladePo.changeCaseStatus('Closed');
            await updateStatusBladePo.clickSaveStatus();
            await expect(viewCasePage.isCaseReopenLinkPresent()).toBeTruthy();
        });

        it('[DRDMV-16076]: Reopen configurations available on Case Template Create screen ', async () => {
            //add second case template
            await navigationPage.gotoCreateCase();
            await createCasePage.selectRequester('adam');
            await createCasePage.setSummary('Summary 2');
            await createCasePage.clickSelectCaseTemplateButton();
            await selectCaseTemplateBlade.selectCaseTemplate(caseTemplate2);
            await createCasePage.clickAssignToMeButton();
            await createCasePage.clickSaveCaseButton();
            await previewCasePo.clickGoToCaseButton();
            await updateStatusBladePo.changeCaseStatus('In Progress');
            await updateStatusBladePo.clickSaveStatus();
            await updateStatusBladePo.changeCaseStatus('Resolved');
            await updateStatusBladePo.setStatusReason('Auto Resolved');
            await updateStatusBladePo.clickSaveStatus();
            await updateStatusBladePo.changeCaseStatus('Closed');
            await updateStatusBladePo.clickSaveStatus();
            await expect(viewCasePage.isCaseReopenLinkPresent()).toBeFalsy();
        });

        afterAll(async () => {
            await navigationPage.signOut();
            await loginPage.login('qkatawazi');
        });
    });

    describe('[DRDMV-21688,DRDMV-21689]:Create a Company specific Configuration for Resolution Code/Description and Check on Case', async () => {
        let randomStr = [...Array(4)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        beforeAll(async () => {
            await apiHelper.apiLogin('qkatawazi');
            await apiHelper.addCommonConfig('RESOLUTION_CODE_MANDATORY', [true], 'Petramco');
            await apiHelper.addCommonConfig('RESOLUTION_DESCRIPTION_MANDATORY', [true], 'Petramco');
            await apiHelper.addCommonConfig('RESOLUTION_CODE_MANDATORY', [true], '- Global -');
            await apiHelper.addCommonConfig('RESOLUTION_DESCRIPTION_MANDATORY', [true], '- Global -');
        });
        it('[DRDMV-21688,DRDMV-21689]:Create a Company specific Configuration for Resolution Code/Description and Check on Case', async () => {
            await navigationPage.gotoCreateCase();
            await createCasePage.selectRequester('adam');
            await createCasePage.setSummary('Summary' + randomStr);
            await createCasePage.clickAssignToMeButton();
            await createCasePage.clickSaveCaseButton();
            await previewCasePo.clickGoToCaseButton();
            await updateStatusBladePo.changeCaseStatus('In Progress');
            await updateStatusBladePo.clickSaveStatus();
            await updateStatusBladePo.changeCaseStatus('Resolved');
            expect(await updateStatusBladePo.isRequiredTagToResolutionCode()).toBeTruthy('FailureMsg: Required Tab for Resolution Code is missing');
            expect(await updateStatusBladePo.isRequiredTagToResolutionDescription()).toBeTruthy('FailureMsg: Required Tab for Resolution Code is missing');
            expect(await updateStatusBladePo.isSaveUpdateStatusButtonEnabled()).toBeFalsy('FailureMsg: Save button is not enabled');
            await updateStatusBladePo.clickCancelButton();
            await utilityCommon.clickOnApplicationWarningYesNoButton("Yes");
            await apiHelper.apiLogin('qkatawazi');
            await apiHelper.deleteCommonConfig('RESOLUTION_CODE_MANDATORY', 'Petramco');
            await apiHelper.deleteCommonConfig('RESOLUTION_DESCRIPTION_MANDATORY', 'Petramco');
            await updateStatusBladePo.changeCaseStatus('Resolved');
            expect(await updateStatusBladePo.isRequiredTagToResolutionCode()).toBeTruthy('FailureMsg: Required Tab for Resolution Code is missing');
            expect(await updateStatusBladePo.isRequiredTagToResolutionDescription()).toBeTruthy('FailureMsg: Required Tab for Resolution Code is missing');
            expect(await updateStatusBladePo.isSaveUpdateStatusButtonEnabled()).toBeFalsy('FailureMsg: Save button is not enabled');
            await updateStatusBladePo.setStatusReason('Auto Resolved');
            await updateStatusBladePo.selectResolutionCode('Report Delivered');
            await updateStatusBladePo.setResolutionDescription("CaseResolved" + randomStr);
            await updateStatusBladePo.clickSaveStatus();
            await utilityCommon.closePopUpMessage();
            expect(await viewCasePage.getTextOfStatus()).toBe('Resolved');
            expect(await viewCasePage.getResolutionCodeValue()).toBe('Report Delivered');
            expect(await viewCasePage.getResolutionDescription()).toBe("CaseResolved" + randomStr);
        });
        it('[DRDMV-21688,DRDMV-21689]:Create a Company specific Configuration for Resolution Code/Description and Check on Case', async () => {
            await navigationPage.gotoCreateCase();
            await createCasePage.selectRequester('adam');
            await createCasePage.setSummary('Summary2' + randomStr);
            await createCasePage.clickAssignToMeButton();
            await createCasePage.clickSaveCaseButton();
            await previewCasePo.clickGoToCaseButton();
            await updateStatusBladePo.changeCaseStatus('In Progress');
            await updateStatusBladePo.clickSaveStatus();
            await utilityCommon.closePopUpMessage();
            await updateStatusBladePo.changeCaseStatus('Resolved');
            await updateStatusBladePo.setStatusReason('Auto Resolved');
            expect(await updateStatusBladePo.isSaveUpdateStatusButtonEnabled()).toBeTruthy('FailureMsg: Save button is not enabled');
            await updateStatusBladePo.clickSaveStatus();
            await utilityCommon.closePopUpMessage();
            expect(await viewCasePage.getTextOfStatus()).toBe('Resolved');
        });
        afterAll(async () => {
            await apiHelper.apiLogin('qkatawazi');
            await apiHelper.deleteCommonConfig('RESOLUTION_CODE_MANDATORY', 'Petramco');
            await apiHelper.deleteCommonConfig('RESOLUTION_DESCRIPTION_MANDATORY', 'Petramco');
            await apiHelper.deleteCommonConfig('RESOLUTION_CODE_MANDATORY', '- Global -');
            await apiHelper.deleteCommonConfig('RESOLUTION_DESCRIPTION_MANDATORY', '- Global -');
            await utilityCommon.closeAllBlades();
            await navigationPage.signOut();
            await loginPage.login('qkatawazi');
        });
    });
});  
