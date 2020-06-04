import { browser } from "protractor";
import apiHelper from '../../api/api.helper';
import { ALL_FIELD, MANDATORY_FIELD } from '../../data/ui/case/casetemplate.data.ui';
import previewCasePo from '../../pageobject/case/case-preview.po';
import createCasePo from '../../pageobject/case/create-case.po';
import editCasePo from '../../pageobject/case/edit-case.po';
import quickCasePo from '../../pageobject/case/quick-case.po';
import selectCasetemplateBladePo from '../../pageobject/case/select-casetemplate-blade.po';
import viewCasePo from '../../pageobject/case/view-case.po';
import loginPage from "../../pageobject/common/login.po";
import navigationPage from "../../pageobject/common/navigation.po";
import updateStatusBladePo from '../../pageobject/common/update.status.blade.po';
import consoleCasetemplatePo from '../../pageobject/settings/case-management/console-casetemplate.po';
import copyCasetemplatePo from '../../pageobject/settings/case-management/copy-casetemplate.po';
import createCaseTemplate from "../../pageobject/settings/case-management/create-casetemplate.po";
import editCasetemplatePo from "../../pageobject/settings/case-management/edit-casetemplate.po";
import viewCaseTemplate from "../../pageobject/settings/case-management/view-casetemplate.po";
import viewTaskPo from '../../pageobject/task/view-task.po';
import { BWF_BASE_URL } from '../../utils/constants';
import utilGrid from '../../utils/util.grid';
import utilityCommon from '../../utils/utility.common';
import utilCommon from '../../utils/util.common';
import manageTaskBladePo from '../../pageobject/task/manage-task-blade.po';
import activityTabPo from '../../pageobject/social/activity-tab.po';
import caseConsolePo from '../../pageobject/case/case-console.po';
import utilityGrid from '../../utils/utility.grid';

let caseTemplateAllFields = ALL_FIELD;
let caseTemplateRequiredFields = MANDATORY_FIELD;
let userData;

describe('Case Template', () => {
    beforeAll(async () => {
        await browser.get(BWF_BASE_URL);
        await loginPage.login("qkatawazi");
        userData = {
            "firstName": "Petramco",
            "lastName": "withoutSG",
            "userId": "DRDMV-12581",
        }
        await apiHelper.apiLogin('tadmin');
        await apiHelper.createNewUser(userData);
        await apiHelper.associatePersonToCompany(userData.userId, "Psilon");
        await apiHelper.associatePersonToCompany(userData.userId, "Petramco");
        await apiHelper.associatePersonToCompany(userData.userId, "Phylum");
    });

    afterAll(async () => {
        await navigationPage.signOut();
    });

    //ptidke
    it('[DRDMV-10477,DRDMV-10483]: Case Template creation with Template validation as OPTIONAL using BA login', async () => {
        await navigationPage.gotoSettingsPage();
        await navigationPage.gotoSettingsMenuItem('Case Management--Templates', 'Case Templates - Business Workflows');
        let caseTemplateName: string = caseTemplateAllFields.templateName + Math.floor(Math.random() * 100000);
        caseTemplateAllFields.templateName = caseTemplateName;
        await consoleCasetemplatePo.clickOnCreateCaseTemplateButton();
        await createCaseTemplate.setTemplateName(caseTemplateName);
        await createCaseTemplate.setCompanyName(caseTemplateAllFields.company);
        await createCaseTemplate.setCaseSummary(caseTemplateAllFields.templateSummary);
        await createCaseTemplate.setPriorityValue(caseTemplateAllFields.casePriority);
        await createCaseTemplate.setBusinessUnitDropdownValue(caseTemplateAllFields.ownerBusinessUnit);
        await createCaseTemplate.setOwnerGroupDropdownValue(caseTemplateAllFields.ownerGroup);
        await createCaseTemplate.setTemplateStatusDropdownValue(caseTemplateAllFields.templateStatus)
        await createCaseTemplate.setIdentityValidationValue(caseTemplateAllFields.identityValidation)
        await createCaseTemplate.clickSaveCaseTemplate();
        await expect(await viewCaseTemplate.getCaseTemplateNameValue()).toContain(caseTemplateName);
        await expect(await viewCaseTemplate.getIdentityValdationValue()).toContain(caseTemplateAllFields.identityValidation);
    });

    //ptidke
    it('[DRDMV-10487]: Case Template update with Template validation as ENFORCED', async () => {
        await navigationPage.gotoSettingsPage();
        await navigationPage.gotoSettingsMenuItem('Case Management--Templates', 'Case Templates - Business Workflows');
        let caseTemplateName: string = caseTemplateAllFields.templateName + Math.floor(Math.random() * 100000);
        caseTemplateAllFields.templateName = caseTemplateName;
        await consoleCasetemplatePo.clickOnCreateCaseTemplateButton();
        await createCaseTemplate.setTemplateName(caseTemplateName);
        await createCaseTemplate.setCompanyName(caseTemplateAllFields.company);
        await createCaseTemplate.setCaseSummary(caseTemplateAllFields.templateSummary);
        await createCaseTemplate.setPriorityValue(caseTemplateAllFields.casePriority);
        await createCaseTemplate.setBusinessUnitDropdownValue(caseTemplateAllFields.ownerBusinessUnit);
        await createCaseTemplate.setOwnerGroupDropdownValue(caseTemplateAllFields.ownerGroup);
        await createCaseTemplate.setTemplateStatusDropdownValue(caseTemplateAllFields.templateStatus)
        await createCaseTemplate.setIdentityValidationValue(caseTemplateAllFields.identityValidation)
        await createCaseTemplate.clickSaveCaseTemplate();
        await expect(await viewCaseTemplate.getCaseTemplateNameValue()).toContain(caseTemplateName);
        await expect(await viewCaseTemplate.getIdentityValdationValue()).toContain(caseTemplateAllFields.identityValidation);
        await editCasetemplatePo.clickOnEditCaseTemplateMetadata();
        await editCasetemplatePo.changeTemplateStatusDropdownValue('Draft');
        await editCasetemplatePo.clickOnSaveCaseTemplateMetadata();
        await editCasetemplatePo.clickEditCaseTemplate();
        await editCasetemplatePo.changeIdentityValidationValue('Enforced');
        await editCasetemplatePo.clickSaveCaseTemplate();
        await expect(await viewCaseTemplate.getIdentityValdationValue()).toContain('Enforced');
    });

    //ptidke
    it('[DRDMV-10469]: Case Template creation with Template validation as ENFORCED', async () => {
        await navigationPage.gotoSettingsPage();
        await navigationPage.gotoSettingsMenuItem('Case Management--Templates', 'Case Templates - Business Workflows');
        let caseTemplateName: string = await caseTemplateAllFields.templateName + Math.floor(Math.random() * 100000);
        caseTemplateAllFields.templateName = caseTemplateName;
        await consoleCasetemplatePo.clickOnCreateCaseTemplateButton();
        await createCaseTemplate.setTemplateName(caseTemplateName);
        await createCaseTemplate.setCompanyName(caseTemplateAllFields.company);
        await createCaseTemplate.setCaseSummary(caseTemplateAllFields.templateSummary);
        await createCaseTemplate.setPriorityValue(caseTemplateAllFields.casePriority);
        await createCaseTemplate.setBusinessUnitDropdownValue(caseTemplateAllFields.ownerBusinessUnit);
        await createCaseTemplate.setOwnerGroupDropdownValue(caseTemplateAllFields.ownerGroup);
        await createCaseTemplate.setTemplateStatusDropdownValue(caseTemplateAllFields.templateStatus)
        await createCaseTemplate.setIdentityValidationValue('Enforced')
        await createCaseTemplate.clickSaveCaseTemplate();
        await expect(await viewCaseTemplate.getCaseTemplateNameValue()).toContain(caseTemplateName);
        await expect(await viewCaseTemplate.getIdentityValdationValue()).toContain('Enforced');
    });

    //ptidke
    it('[DRDMV-10481]: Case Template creation with Template validation as NONE', async () => {
        await navigationPage.gotoSettingsPage();
        await navigationPage.gotoSettingsMenuItem('Case Management--Templates', 'Case Templates - Business Workflows');
        let caseTemplateName: string = await caseTemplateAllFields.templateName + Math.floor(Math.random() * 100000);
        caseTemplateAllFields.templateName = caseTemplateName;
        await consoleCasetemplatePo.clickOnCreateCaseTemplateButton();
        await createCaseTemplate.setTemplateName(caseTemplateName);
        await createCaseTemplate.setCompanyName(caseTemplateAllFields.company);
        await createCaseTemplate.setCaseSummary(caseTemplateAllFields.templateSummary);
        await createCaseTemplate.setPriorityValue(caseTemplateAllFields.casePriority);
        await createCaseTemplate.setBusinessUnitDropdownValue(caseTemplateAllFields.ownerBusinessUnit);
        await createCaseTemplate.setOwnerGroupDropdownValue(caseTemplateAllFields.ownerGroup);
        await createCaseTemplate.setTemplateStatusDropdownValue(caseTemplateAllFields.templateStatus)
        await createCaseTemplate.setIdentityValidationValue('None')
        await createCaseTemplate.clickSaveCaseTemplate();
        await expect(await viewCaseTemplate.getCaseTemplateNameValue()).toContain(caseTemplateName);
        await expect(await viewCaseTemplate.getIdentityValdationValue()).toContain('None');
    });

    //ptidke
    it('[DRDMV-10479]: Case Template NOT created with Template validation as OPTIONAL using Case Agent login', async () => {
        try {
            await navigationPage.signOut();
            await loginPage.login('franz');
            await navigationPage.gotoSettingsPage();
            expect(await navigationPage.isSettingPanelTextMatches("Configuration options not created for these settings.")).toBeTruthy();
        } catch (e) {
            throw e;
        } finally {
            await navigationPage.signOut();
            await loginPage.login('qkatawazi');
        }
    });

    //ptidke
    it('[DRDMV-14874]: Verify the values present in the Case assignment method dropdownlist-Round Robin and None', async () => {
        await navigationPage.gotoSettingsPage();
        await navigationPage.gotoSettingsMenuItem('Case Management--Templates', 'Case Templates - Business Workflows');
        let caseTemplateName: string = caseTemplateAllFields.templateName + Math.floor(Math.random() * 100000);
        caseTemplateAllFields.templateName = caseTemplateName;
        await consoleCasetemplatePo.clickOnCreateCaseTemplateButton();
        await createCaseTemplate.setTemplateName(caseTemplateName);
        await createCaseTemplate.setCompanyName(caseTemplateAllFields.company);
        await createCaseTemplate.setCaseSummary(caseTemplateAllFields.templateSummary);
        await createCaseTemplate.setPriorityValue(caseTemplateAllFields.casePriority);
        await createCaseTemplate.setAssignmentMethodValue('None');
        await expect(await copyCasetemplatePo.getValueOfAssignementMethod()).toContain('None');
        await createCaseTemplate.setBusinessUnitDropdownValue(caseTemplateAllFields.ownerBusinessUnit);
        await createCaseTemplate.setOwnerGroupDropdownValue(caseTemplateAllFields.ownerGroup);
        await createCaseTemplate.setAssignmentMethodValue(caseTemplateAllFields.assignmentMethod);
        await expect(await copyCasetemplatePo.getValueOfAssignementMethod()).toContain(caseTemplateAllFields.assignmentMethod);
        await createCaseTemplate.setTemplateStatusDropdownValue('Draft')
        await createCaseTemplate.clickSaveCaseTemplate();
        await editCasetemplatePo.clickEditCaseTemplate();
        await editCasetemplatePo.changeAssignmentMethodValue('None');
        await expect(await editCasetemplatePo.getValueOfAssignmentMethod()).toContain('None');
        await editCasetemplatePo.changeAssignmentMethodValue(caseTemplateAllFields.assignmentMethod);
        await expect(await editCasetemplatePo.getValueOfAssignmentMethod()).toContain(caseTemplateAllFields.assignmentMethod);
        await editCasetemplatePo.clickSaveCaseTemplate();
    });

    //ptidke
    it('[DRDMV-14880]: Verify Case assignment method is set to None by default in a New/already existing Case template', async () => {
        await navigationPage.gotoSettingsPage();
        await navigationPage.gotoSettingsMenuItem('Case Management--Templates', 'Case Templates - Business Workflows');
        let caseTemplateName: string = await caseTemplateAllFields.templateName + Math.floor(Math.random() * 100000);
        caseTemplateAllFields.templateName = caseTemplateName;
        await consoleCasetemplatePo.clickOnCreateCaseTemplateButton();
        await createCaseTemplate.setTemplateName(caseTemplateName);
        await createCaseTemplate.setCompanyName(caseTemplateAllFields.company);
        await createCaseTemplate.setCaseSummary(caseTemplateAllFields.templateSummary);
        await createCaseTemplate.setPriorityValue(caseTemplateAllFields.casePriority);
        await expect(await copyCasetemplatePo.getValueOfAssignementMethod()).toContain('None');
        await createCaseTemplate.setBusinessUnitDropdownValue(caseTemplateAllFields.ownerBusinessUnit);
        await createCaseTemplate.setOwnerGroupDropdownValue(caseTemplateAllFields.ownerGroup);
        await createCaseTemplate.setTemplateStatusDropdownValue('Draft')
        await createCaseTemplate.clickSaveCaseTemplate();
        await editCasetemplatePo.clickEditCaseTemplate();
        await expect(editCasetemplatePo.getValueOfAssignmentMethod()).toContain('None');
        await editCasetemplatePo.clickSaveCaseTemplate();
    });

    //ptidke 
    it('[DRDMV-1231]: [Edit Case Template] Template metadata edit', async () => {
        await navigationPage.gotoSettingsPage();
        await navigationPage.gotoSettingsMenuItem('Case Management--Templates', 'Case Templates - Business Workflows');
        let caseTemplateName: string = caseTemplateRequiredFields.templateName + Math.floor(Math.random() * 100000);
        let templateData = {
            "templateName": caseTemplateName,
            "templateSummary": caseTemplateName,
            "caseStatus": "InProgress",
            "templateStatus": "Active",
            "company": "Petramco",
            "businessUnit": "Facilities Support",
            "supportGroup": "Facilities",
            "assignee": "Fritz",
            "ownerBU": 'Facilities Support',
            "ownerGroup": "Facilities"
        }
        await apiHelper.apiLogin('qkatawazi');
        await apiHelper.createCaseTemplate(templateData);
        await navigationPage.gotoSettingsPage();
        await navigationPage.gotoSettingsMenuItem('Case Management--Templates', 'Case Templates - Business Workflows');
        await utilGrid.searchAndOpenHyperlink(caseTemplateName);
        await editCasetemplatePo.clickOnEditCaseTemplateMetadata();
        await editCasetemplatePo.changeBusinessUnitDropdownValue(caseTemplateRequiredFields.ownerBusinessUnit);
        await editCasetemplatePo.changeOwnerGroupDropdownValue(caseTemplateRequiredFields.ownerGroup);
        await editCasetemplatePo.changeTemplateStatusDropdownValue('Draft');
        await editCasetemplatePo.clickOnSaveCaseTemplateMetadata();
        await editCasetemplatePo.clickEditCaseTemplate();
        await editCasetemplatePo.clearCaseSummary();
        await editCasetemplatePo.clickSaveCaseTemplate();
        await expect(await utilCommon.isPopUpMessagePresent('Resolve the field validation errors and then try again.')).toBeTruthy();
        await editCasetemplatePo.changeCaseSummary('Updated Summary');
        await editCasetemplatePo.clickSaveCaseTemplate();
        await editCasetemplatePo.clickOnEditCaseTemplateMetadata();
        await editCasetemplatePo.changeTemplateStatusDropdownValue('Active');
        await editCasetemplatePo.clickOnSaveCaseTemplateMetadata();
        await utilCommon.waitUntilPopUpDisappear();
        await navigationPage.gotoSettingsPage();
        await navigationPage.gotoSettingsMenuItem('Case Management--Templates', 'Case Templates - Business Workflows');
        await utilGrid.searchAndOpenHyperlink(caseTemplateName);
        await expect(await viewCaseTemplate.getOwnerGroupValue()).toContain(caseTemplateRequiredFields.ownerGroup);
        await expect(await viewCaseTemplate.getOwnerCompanyValue()).toContain('Petramco');
        await expect(await viewCaseTemplate.getTemplateStatusValue()).toContain(caseTemplateRequiredFields.templateStatus);
    });

    //ptidke 
    it('[DRDMV-1229]: [Case Template Console] Search by Summary and Display ID on the Case Template Console', async () => {
        await navigationPage.gotoSettingsPage();
        await navigationPage.gotoSettingsMenuItem('Case Management--Templates', 'Case Templates - Business Workflows');
        let randomStr = [...Array(5)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        let caseTemplateName = 'caseTemplateName' + randomStr;
        let casTemplateSummary = 'CaseSummaryName' + randomStr;
        let templateData = {
            "templateName": `${caseTemplateName}`,
            "templateSummary": `${casTemplateSummary}`,
            "templateStatus": "Active",
            "ownerCompany": "Petramco",
            "ownerBU": "Facilities Support",
            "ownerGroup": "Facilities",
        }
        await apiHelper.apiLogin('fritz');
        let newCaseTemplate = await apiHelper.createCaseTemplate(templateData);
        console.log("active case Template is created===", newCaseTemplate.id);
        console.log("active case Template is created===", newCaseTemplate.displayId);
        let column1: string[] = ["Display ID"];
        await consoleCasetemplatePo.addColumnOnGrid(column1);
        await utilGrid.searchRecord(newCaseTemplate.displayId);
        await expect(await consoleCasetemplatePo.isValueDisplayed("Display ID")).toContain(newCaseTemplate.displayId);
        await consoleCasetemplatePo.clickOnClearSearchIcon();
        await expect(await consoleCasetemplatePo.moreRecordsArePresentAfterClear()).toBeGreaterThan(7);
        await utilGrid.searchRecord(caseTemplateName);
        await expect(await consoleCasetemplatePo.isValueDisplayed("Template Name")).toContain(caseTemplateName);
        await consoleCasetemplatePo.clickOnClearSearchIcon();
        await expect(await consoleCasetemplatePo.moreRecordsArePresentAfterClear()).toBeGreaterThan(7);
        await utilGrid.searchRecord('xyzsdasdlkdasd');
        await expect(await consoleCasetemplatePo.moreRecordsArePresentAfterClear()).toBeLessThanOrEqual(0);
        await consoleCasetemplatePo.removeColumnFromGrid(column1);
    });

    //ptidke
    it('[DRDMV-12560]: Case Agent from owner company can create a case using the template', async () => {
        try {
            let randomStr = [...Array(5)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
            let caseTemplateName = 'QucikCaseTemplate' + randomStr;
            let templateData = {
                "templateName": caseTemplateName,
                "templateSummary": caseTemplateName,
                "caseStatus": "InProgress",
                "templateStatus": "Active",
                "company": "Petramco",
                "businessUnit": "Facilities Support",
                "supportGroup": "Facilities",
                "assignee": "Fritz",
                "ownerBU": 'Facilities Support',
                "ownerGroup": "Facilities"
            }
            await apiHelper.apiLogin('qkatawazi');
            await apiHelper.createCaseTemplate(templateData);
            await navigationPage.signOut();
            await loginPage.login('qtao');
            await navigationPage.gotoCreateCase();
            await createCasePo.selectRequester('fritz');
            await createCasePo.setSummary('Summary');
            await createCasePo.clickSelectCaseTemplateButton();
            await selectCasetemplateBladePo.selectCaseTemplate(caseTemplateName);
            await createCasePo.clickAssignToMeButton();
            await createCasePo.clickSaveCaseButton();
            await previewCasePo.clickGoToCaseButton();
            expect(await viewCasePo.isEditLinkDisplay()).toBeTruthy();
            await navigationPage.gotoQuickCase();
            await quickCasePo.selectRequesterName('fritz');
            await quickCasePo.selectCaseTemplate(caseTemplateName);
            await quickCasePo.saveCase();
            await previewCasePo.clickGoToCaseButton();
            expect(await viewCasePo.isEditLinkDisplay()).toBeTruthy();
        } catch (e) {
            throw e;
        }
        finally {
            await navigationPage.signOut();
            await loginPage.login('qkatawazi');
        }
    });

    //ptidke
    it('[DRDMV-12578]:Case BA from other than case template owner group can NOT update the template', async () => {
        let randomStr = [...Array(5)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        let caseTemplateName = 'caseTemplateName' + randomStr;
        let templateData = {
            "templateName": caseTemplateName,
            "templateSummary": caseTemplateName,
            "resolveCaseonLastTaskCompletion": "1",
            "templateStatus": "Draft",
            "company": "Petramco",
            "businessUnit": "Facilities Support",
            "supportGroup": "Facilities",
            "assignee": "Fritz",
            "ownerBU": 'Facilities Support',
            "ownerGroup": "Facilities"
        }
        await apiHelper.apiLogin('fritz');
        await apiHelper.createCaseTemplate(templateData);
        await navigationPage.gotoSettingsPage();
        await navigationPage.gotoSettingsMenuItem('Case Management--Templates', 'Case Templates - Business Workflows');
        await utilGrid.searchAndOpenHyperlink(caseTemplateName);
        await viewCaseTemplate.clickOnEditCaseTemplateButton();
        await expect(await editCasetemplatePo.isCaseSummaryReadOnly()).toBeTruthy();
        await editCasetemplatePo.clickOnEditCaseTemplateMetadata();
        await expect(await editCasetemplatePo.isSaveButtonOnMetaDataIsDisabled()).toBeTruthy();
    });

    //ptidke
    it('[DRDMV-19734]:[RESOLVE_CASE_ON_LAST_TASK_COMPLETION] - Case Template view Look & Feel after adding new configuration field', async () => {
        try {
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Case Management--Templates', 'Case Templates - Business Workflows');
            let caseTemplateName: string = await caseTemplateAllFields.templateName + Math.floor(Math.random() * 100000);
            caseTemplateAllFields.templateName = caseTemplateName;
            await consoleCasetemplatePo.clickOnCreateCaseTemplateButton();
            await createCaseTemplate.setTemplateName(caseTemplateName);
            await createCaseTemplate.setCompanyName(caseTemplateAllFields.company);
            await createCaseTemplate.setCaseSummary(caseTemplateAllFields.templateSummary);
            await createCaseTemplate.setPriorityValue(caseTemplateAllFields.casePriority);
            await createCaseTemplate.isResolveCaseOnLastTaskCompletion(true);
            await createCaseTemplate.setPriorityValue(caseTemplateAllFields.casePriority);
            await createCaseTemplate.isResolveCaseOnLastTaskCompletion(true);
            await createCaseTemplate.clickSaveCaseTemplate();
            await expect(await viewCaseTemplate.getResolveCaseOnLastTaskCompletionValue()).toContain('Yes');
            await editCasetemplatePo.clickEditCaseTemplate();
            await editCasetemplatePo.isResolveCaseOnLastTaskCompletion(false);
            await editCasetemplatePo.clickSaveCaseTemplate();
            await expect(await viewCaseTemplate.getResolveCaseOnLastTaskCompletionValue()).toContain('No');
        } catch (e) {
            throw e;
        }
        finally {
            await navigationPage.signOut();
            await loginPage.login('qkatawazi');
        }
    });

    //ptidke
    describe('[DRDMV-9003]:[Negative Testing]-Checking change case template button disabled/hidden for different case status.', async () => {
        let randomStr = [...Array(5)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        let caseTemplateName = 'caseTemplateName' + randomStr;
        beforeAll(async () => {
            let templateData = {
                "templateName": caseTemplateName,
                "templateSummary": caseTemplateName,
                "resolveCaseonLastTaskCompletion": "1",
                "templateStatus": "Active",
                "company": "Petramco",
                "businessUnit": "Facilities Support",
                "supportGroup": "Facilities",
                "assignee": "Fritz",
                "ownerBU": 'Facilities Support',
                "ownerGroup": "Facilities",
            }
            await apiHelper.apiLogin('fritz');
            await apiHelper.createCaseTemplate(templateData);
        });
        it('Checking change case template button for In Progress', async () => {
            await navigationPage.gotoCreateCase();
            await createCasePo.selectRequester('fritz');
            await createCasePo.clickSelectCaseTemplateButton();
            await selectCasetemplateBladePo.selectCaseTemplate(caseTemplateName);
            await createCasePo.clickSaveCaseButton();
            await previewCasePo.clickGoToCaseButton();
            await viewCasePo.isEditLinkDisplay();
            await updateStatusBladePo.changeCaseStatus('In Progress');
            await updateStatusBladePo.clickSaveStatus();
            await viewCasePo.clickEditCaseButton();
            await editCasePo.waitForEditCasePageToBeDisplayed();
            await expect(await editCasePo.isChangeCaseTemplateButtonDisplayed()).toBeFalsy('change template button not Displayed');
            await editCasePo.clickOnCancelCaseButton();
            await utilityCommon.clickOnApplicationWarningYesNoButton("Yes");
        });
        it('Checking change case template button for Resolved', async () => {
            await updateStatusBladePo.changeCaseStatus('Resolved');
            await updateStatusBladePo.setStatusReason('Auto Resolved');
            await updateStatusBladePo.clickSaveStatus('Resolved');
            await viewCasePo.clickEditCaseButton();
            await editCasePo.waitForEditCasePageToBeDisplayed();
            await expect(await editCasePo.isChangeCaseTemplateButtonDisplayed()).toBeFalsy('change template button not Displayed');
            await editCasePo.clickOnCancelCaseButton();
            await utilityCommon.clickOnApplicationWarningYesNoButton("Yes");
        });
        it('Checking change case template button for Closed', async () => {
            await updateStatusBladePo.changeCaseStatus('Closed');
            await updateStatusBladePo.clickSaveStatus('Closed');
            await viewCasePo.clickEditCaseButton();
            await editCasePo.waitForEditCasePageToBeDisplayed();
            await expect(await editCasePo.isChangeCaseTemplateButtonDisplayed()).toBeFalsy('change template button not Displayed');
            await editCasePo.clickOnCancelCaseButton();
            await utilityCommon.clickOnApplicationWarningYesNoButton("Yes");
        });
        it('Checking change case template button for Pending', async () => {
            await navigationPage.gotoCreateCase();
            await createCasePo.selectRequester('fritz');
            await createCasePo.clickSelectCaseTemplateButton();
            await selectCasetemplateBladePo.selectCaseTemplate(caseTemplateName);
            await createCasePo.clickSaveCaseButton();
            await previewCasePo.clickGoToCaseButton();
            await viewCasePo.isEditLinkDisplay();
            await updateStatusBladePo.changeCaseStatus('Pending');
            await updateStatusBladePo.setStatusReason('Customer Response');
            await updateStatusBladePo.clickSaveStatus('Pending');
            await viewCasePo.clickEditCaseButton();
            await editCasePo.waitForEditCasePageToBeDisplayed();
            await expect(await editCasePo.isChangeCaseTemplateButtonDisplayed()).toBeFalsy('change template button not Displayed');
            await editCasePo.clickOnCancelCaseButton();
            await utilityCommon.clickOnApplicationWarningYesNoButton("Yes");
        });
        it('[DRDMV-9003]:Checking change case template button disabled/hidden for different case status.', async () => {
            await updateStatusBladePo.changeCaseStatus('Canceled');
            await updateStatusBladePo.setStatusReason('Customer Canceled');
            await updateStatusBladePo.clickSaveStatus();
            await viewCasePo.clickEditCaseButton();
            await editCasePo.waitForEditCasePageToBeDisplayed();
            await expect(await editCasePo.isChangeCaseTemplateButtonDisplayed()).toBeFalsy('change template button not Displayed');
            await editCasePo.clickOnCancelCaseButton();
            await utilityCommon.clickOnApplicationWarningYesNoButton("Yes");
        });
        afterAll(async () => {
            await navigationPage.signOut();
            await loginPage.login('fritz');
        });
    });

    describe('[DRDMV-769]: [Case Creation] [Template Selection] Applying a Template to a Case', async () => {
        let randomStr = [...Array(5)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        let caseTemplateNamePetramco = 'caseTemplateName' + randomStr;
        let caseTemplateNamePsilon = randomStr + 'caseTemplatePsilonDRDMV773';
        beforeAll(async () => {
            let casetemplatePetramco = {
                "templateName": caseTemplateNamePetramco,
                "templateSummary": caseTemplateNamePetramco,
                "templateStatus": "Active",
                "categoryTier1": "Purchasing Card",
                "categoryTier2": "Policies",
                "categoryTier3": "Card Issuance",
                "casePriority": "Low",
                "caseStatus": "New",
                "company": "Petramco",
                "businessUnit": "Facilities Support",
                "supportGroup": "Facilities",
                "assignee": "Fritz",
                "ownerBU": "Facilities Support",
                "ownerGroup": "Facilities",
            }
            await apiHelper.apiLogin('fritz');
            await apiHelper.createCaseTemplate(casetemplatePetramco);
            let casetemplatePsilon = {
                "templateName": caseTemplateNamePsilon,
                "templateSummary": caseTemplateNamePsilon,
                "caseStatus": "InProgress",
                "templateStatus": "Active",
                "company": "Psilon",
                "businessUnit": "Psilon Support Org1",
                "supportGroup": "Psilon Support Group1",
                "assignee": "gderuno",
            }
            await apiHelper.apiLogin('gderuno');
            await apiHelper.createCaseTemplate(casetemplatePsilon);
        });
        it('Applying a Template to a Case with Franz', async () => {
            await navigationPage.gotoCreateCase();
            await createCasePo.selectRequester('Franz');
            await createCasePo.setSummary(caseTemplateNamePetramco);
            await createCasePo.clickSelectCaseTemplateButton();
            await selectCasetemplateBladePo.selectCaseTemplate(caseTemplateNamePetramco);
            await createCasePo.clickSaveCaseButton();
            await previewCasePo.clickGoToCaseButton();
            expect(await viewCasePo.getPriorityValue()).toBe('Low');
            expect(await viewCasePo.getCategoryTier1Value()).toBe('Purchasing Card');
            expect(await viewCasePo.getCategoryTier2Value()).toBe('Policies');
            expect(await viewCasePo.getCategoryTier3Value()).toBe('Card Issuance');
            expect(await viewCasePo.getAssignedCompanyText()).toBe('Petramco');
        });
        it('Applying a Template to a Case with qdu', async () => {
            await navigationPage.gotoCreateCase();
            await createCasePo.selectRequester('qdu');
            await createCasePo.setSummary(caseTemplateNamePsilon);
            await createCasePo.clickSelectCaseTemplateButton();
            expect(await createCasePo.isTemplateNamePresent(caseTemplateNamePsilon)).toBeFalsy();
            await selectCasetemplateBladePo.clickOnCancelButton();
        });
        it('[DRDMV-769]: [Case Creation] [Template Selection] Applying a Template to a Case', async () => {
            await navigationPage.signOut();
            await loginPage.login('gderuno');
            await navigationPage.gotoCreateCase();
            await createCasePo.selectRequester('Glit');
            await createCasePo.clickSelectCaseTemplateButton();
            await selectCasetemplateBladePo.selectCaseTemplate(caseTemplateNamePsilon);
            await createCasePo.clickAssignToMeButton();
            await createCasePo.clickSaveCaseButton();
            await utilityCommon.closePopUpMessage();
            expect(await previewCasePo.isCaseTemplateDisplayed(caseTemplateNamePsilon)).toBeTruthy("Template is not selected");
            await previewCasePo.clickGoToCaseButton();
        });
        afterAll(async () => {
            await navigationPage.signOut();
            await loginPage.login('fritz');
        });
    });

    //apdeshmu 
    it('[DRDMV-1223]: [Case Template] Template visibility', async () => {
        try {
            let randomStr = [...Array(5)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
            let caseTemplateName = 'caseTemplateName' + randomStr;
            let casetemplateData = {
                "templateName": caseTemplateName,
                "templateSummary": caseTemplateName,
                "resolveCaseonLastTaskCompletion": "1",
                "templateStatus": "Active",
                "company": "Petramco",
                "businessUnit": "Facilities Support",
                "supportGroup": "Facilities",
                "assignee": "Fritz",
                "ownerBU": 'Facilities Support',
                "ownerGroup": "Facilities",
            }
            await apiHelper.apiLogin('fritz');
            await apiHelper.createCaseTemplate(casetemplateData);
            await navigationPage.signOut();
            await loginPage.login('elizabeth');
            await navigationPage.gotoCreateCase();
            await createCasePo.selectRequester('fritz');
            await createCasePo.setSummary(caseTemplateName);
            await createCasePo.clickSelectCaseTemplateButton();
            await selectCasetemplateBladePo.selectCaseTemplate(caseTemplateName);
            await createCasePo.clickSaveCaseButton();
            await previewCasePo.clickGoToCaseButton();
            expect(await viewCasePo.getCaseSummary()).toBe(caseTemplateName);
            await navigationPage.signOut();
            await loginPage.login('gderuno');
            await navigationPage.gotoCreateCase();
            await createCasePo.selectRequester('Glit');
            await createCasePo.setSummary(caseTemplateName);
            await createCasePo.clickSelectCaseTemplateButton();
            expect(await createCasePo.isTemplateNamePresent(caseTemplateName)).toBeFalsy();
            await selectCasetemplateBladePo.clickOnCancelButton();
        } catch (e) {
            throw e;
        } finally {
            await navigationPage.signOut();
            await loginPage.login('qkatawazi');
        }
    });

    describe('[DRDMV-1216]: [Case Template] Create Case Template with all fields data populated', async () => {
        let randomStr = [...Array(5)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        let caseTemplateName = 'caseTemplateName' + randomStr;
        beforeAll(async () => {
            let casetemplatePetramco = {
                "templateName": caseTemplateName,
                "templateSummary": caseTemplateName,
                "templateStatus": "Active",
                "categoryTier1": "Purchasing Card",
                "categoryTier2": "Policies",
                "categoryTier3": "Card Issuance",
                "casePriority": "Low",
                "caseStatus": "New",
                "company": "Petramco",
                "businessUnit": "Facilities Support",
                "supportGroup": "Facilities",
                "assignee": "Fritz",
                "ownerBU": "Facilities Support",
                "ownerGroup": "Facilities",
            }
            await apiHelper.apiLogin('fritz');
            await apiHelper.createCaseTemplate(casetemplatePetramco);
        });
        it('Create Case Template with all fields', async () => {
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Case Management--Templates', 'Case Templates - Business Workflows');
            await utilGrid.searchAndOpenHyperlink(caseTemplateName);
            expect(await viewCaseTemplate.getAssigneeText()).toBe("Fritz Schulz");
            expect(await viewCaseTemplate.getCaseCompanyValue()).toBe("Petramco");
            expect(await viewCaseTemplate.getCaseTemplateNameValue()).toBe(caseTemplateName);
            expect(await viewCaseTemplate.getPriorityValue()).toBe("Low");
            expect(await viewCaseTemplate.getTemplateStatusValue()).toBe("Active");
            expect(await viewCaseTemplate.getOwnerGroupValue()).toBe("Facilities");
            expect(await viewCaseTemplate.getCategoryTier2()).toBe("Policies");
            expect(await viewCaseTemplate.getCategoryTier3()).toBe("Card Issuance");
            expect(await viewCaseTemplate.getCategoryTier1()).toBe("Purchasing Card");
            expect(await viewCaseTemplate.getOwnerCompanyValue()).toBe("Petramco");
        });
        it('[DRDMV-1216]: [Case Template] Create Case Template with all fields data populated', async () => {
            await navigationPage.gotoCreateCase();
            await createCasePo.selectRequester('fritz');
            await createCasePo.setSummary(caseTemplateName);
            await createCasePo.clickSelectCaseTemplateButton();
            await selectCasetemplateBladePo.selectCaseTemplate(caseTemplateName);
            await createCasePo.clickSaveCaseButton();
            await previewCasePo.clickGoToCaseButton();
            expect(await viewCasePo.getPriorityValue()).toBe('Low');
            expect(await viewCasePo.getCategoryTier1Value()).toBe('Purchasing Card');
            expect(await viewCasePo.getCategoryTier2Value()).toBe('Policies');
            expect(await viewCasePo.getCategoryTier3Value()).toBe('Card Issuance');
            expect(await viewCasePo.getAssignedCompanyText()).toBe('Petramco');
        });
        afterAll(async () => {
            await navigationPage.signOut();
            await loginPage.login('fritz');
        });
    });

    describe('[DRDMV-1215]: [Case Template] Case Status, Template status, Priority, Case Company, Owner population', async () => {
        let randomStr = [...Array(5)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        let caseTemplateName = 'caseTemplateName' + randomStr;
        beforeAll(async () => {
            let casetemplatePetramco = {
                "templateName": caseTemplateName,
                "templateSummary": caseTemplateName,
                "templateStatus": "Draft",
                "company": "Petramco",
                "resolveCaseonLastTaskCompletion": "1",
                "ownerCompany": "Petramco",
                "ownerBU": "Facilities Support",
                "ownerGroup": "Facilities",
                "buisnessUnit": "Facilities Support",
                "supportGroup": "Facilities",
                "assignee": "Fritz",
                "categoryTier1": "Purchasing Card",
                "categoryTier2": "Policies",
                "categoryTier3": "Card Issuance",
                "casePriority": "Low",
                "caseStatus": "New",
            }
            await apiHelper.apiLogin('fritz');
            await apiHelper.createCaseTemplate(casetemplatePetramco);
        });
        it('Checking change case template button for In Progress', async () => {
            await navigationPage.signOut();
            await loginPage.login('fritz');
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Case Management--Templates', 'Case Templates - Business Workflows');
            await utilGrid.searchAndOpenHyperlink(caseTemplateName);
            await viewCaseTemplate.clickEditTemplateMetaData();
            await editCasetemplatePo.changeBusinessUnitDropdownValue('Australia Support');
            await editCasetemplatePo.changeOwnerGroupDropdownValue('AU Support 1');
            await editCasetemplatePo.clickOnSaveCaseTemplateMetadata();
            await editCasetemplatePo.clickEditCaseTemplate();
            let statuses: string[] = ["New", "Assigned", "In Progress", "Resolved", "Closed", "Approval Rejected"];
            expect(await editCasetemplatePo.allStatusOptionsPresent(statuses)).toBeTruthy();
            await editCasetemplatePo.clickOnEditCaseTemplateMetadata();
            let templateStatuses: string[] = ["Draft", "Active", "Inactive"];
            expect(await editCasetemplatePo.allTemplateStatusOptionsPresent(templateStatuses)).toBeTruthy();
            await editCasetemplatePo.clickOnCancelTemplateMetaData();
            let priority: string[] = ["Critical", "High", "Medium", "Low"];
            expect(await editCasetemplatePo.allPriorityOptionsPresent(priority)).toBeTruthy();
            await editCasetemplatePo.clickSaveCaseTemplate();
        });
        it('[DRDMV-1215]: [Case Template] Case Status, Template status, Priority, Case Company, Owner population', async () => {
            expect(await viewCaseTemplate.getCaseTemplateNameValue()).toContain(caseTemplateName);
            expect(await viewCaseTemplate.getCategoryTier1()).toContain("Purchasing Card");
            expect(await viewCaseTemplate.getCategoryTier2()).toContain("Policies");
            expect(await viewCaseTemplate.getCategoryTier3()).toContain("Card Issuance");
            expect(await viewCaseTemplate.getCaseCompanyValue()).toContain("Petramco");
            expect(await viewCaseTemplate.getTemplateStatusValue()).toContain("Draft");
            expect(await viewCaseTemplate.getAssigneeText()).toContain('Fritz Schulz');
            expect(await viewCaseTemplate.getOwnerGroupValue()).toContain('AU Support 1');
        });
        afterAll(async () => {
            await navigationPage.signOut();
            await loginPage.login('fritz');
        });
    });

    describe('[DRDMV-8965,DRDMV-8990]: Changing case template for new case status.', async () => {
        let randomStr = [...Array(5)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        let caseTemplateName = 'caseTemplateName' + randomStr;
        let updatedCaseTemplateName = 'updatedCaseTemplateName' + randomStr;
        beforeAll(async () => {
            let casetemplatePetramco1 = {
                "templateName": caseTemplateName,
                "templateSummary": caseTemplateName,
                "templateStatus": "Active",
                "categoryTier1": "Purchasing Card",
                "categoryTier2": "Policies",
                "categoryTier3": "Card Issuance",
                "casePriority": "Low",
                "caseStatus": "New",
                "company": "Petramco",
                "businessUnit": "Facilities Support",
                "supportGroup": "Facilities",
                "assignee": "Fritz",
                "ownerBU": "Facilities Support",
                "ownerGroup": "Facilities",
            }
            let casetemplatePetramco2 = {
                "templateName": updatedCaseTemplateName,
                "templateSummary": updatedCaseTemplateName,
                "templateStatus": "Active",
                "categoryTier1": "Purchasing Card",
                "categoryTier2": "Policies",
                "categoryTier3": "Card Issuance",
                "casePriority": "Low",
                "caseStatus": "New",
                "company": "Petramco",
                "businessUnit": "Facilities Support",
                "supportGroup": "Facilities",
                "assignee": "Fritz",
                "ownerBU": "Facilities Support",
                "ownerGroup": "Facilities",
            }
            await apiHelper.apiLogin('fritz');
            await apiHelper.createCaseTemplate(casetemplatePetramco1);
            await apiHelper.createCaseTemplate(casetemplatePetramco2);
        });
        it('Changing case template for new case status', async () => {
            // await navigationPage.signOut();
            // await loginPage.login('fritz');
            await navigationPage.gotoCreateCase();
            await createCasePo.selectRequester('Franz');
            await createCasePo.setSummary(caseTemplateName);
            await createCasePo.clickSelectCaseTemplateButton();
            await selectCasetemplateBladePo.selectCaseTemplate(caseTemplateName);
            await createCasePo.clickSaveCaseButton();
            await previewCasePo.clickGoToCaseButton();
            expect(await viewCasePo.getCaseSummary()).toBe(caseTemplateName);
        });
        it('[DRDMV-8965,DRDMV-8990]: Changing case template for new case status.', async () => {
            await viewCasePo.clickEditCaseButton();
            await editCasePo.clickOnChangeCaseTemplate();
            await selectCasetemplateBladePo.selectCaseTemplate(updatedCaseTemplateName);
            await editCasePo.clickSaveCase();
            expect(await viewCasePo.getPriorityValue()).toBe('Low');
            expect(await viewCasePo.getCaseStatusValue()).toContain('New');
            expect(await viewCasePo.getCategoryTier1Value()).toBe('Purchasing Card');
            expect(await viewCasePo.getCategoryTier2Value()).toBe('Policies');
            expect(await viewCasePo.getCategoryTier3Value()).toBe('Card Issuance');
            expect(await viewCasePo.getAssignedCompanyText()).toBe('Petramco');
            expect(await activityTabPo.isTextPresentInActivityLog(updatedCaseTemplateName)).toBeTruthy('TemplateText is not available');
            expect(await activityTabPo.isTextPresentInActivityLog('applied the template')).toBeTruthy();
            await navigationPage.gotoPersonProfile();
            expect(await activityTabPo.isTextPresentInActivityLog(updatedCaseTemplateName)).toBeTruthy("Template is not avilable on profile");
        });
        afterAll(async () => {
            await navigationPage.signOut();
            await loginPage.login('fritz');
        });
    });

    describe('[DRDMV-9019]:[Case] [Template Selection] Changing case template for the case in Assigned Status', async () => {
        let randomStr = [...Array(5)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        let caseTemplateName = 'caseTemplateName' + randomStr;
        let updatedCaseTemplateName = 'updatedCaseTemplateName' + randomStr;
        let taskTemplateName = 'taskTemplateName' + randomStr;
        beforeAll(async () => {
            let casetemplatePetramco1 = {
                "templateName": caseTemplateName,
                "templateSummary": caseTemplateName,
                "templateStatus": "Active",
                "categoryTier1": "Purchasing Card",
                "categoryTier2": "Policies",
                "categoryTier3": "Card Issuance",
                "casePriority": "Low",
                "caseStatus": "Assigned",
                "company": "Petramco",
                "businessUnit": "Facilities Support",
                "supportGroup": "Facilities",
                "assignee": "Fritz",
                "ownerBU": "Facilities Support",
                "ownerGroup": "Facilities",
            }

            let casetemplatePetramco2 = {
                "templateName": updatedCaseTemplateName,
                "templateSummary": updatedCaseTemplateName,
                "templateStatus": "Active",
                "categoryTier1": "Purchasing Card",
                "categoryTier2": "Policies",
                "categoryTier3": "Card Issuance",
                "casePriority": "Low",
                "caseStatus": "Assigned",
                "company": "Petramco",
                "businessUnit": "Facilities Support",
                "supportGroup": "Facilities",
                "assignee": "Fritz",
                "ownerBU": "Facilities Support",
                "ownerGroup": "Facilities",
            }
            let taskTemplateDataSet = {
                "templateName": taskTemplateName,
                "templateSummary": taskTemplateName,
                "templateStatus": "Active",
                "taskCompany": "Petramco",
                "buisnessUnit": "Facilities Support",
                "supportGroup": "Facilities",
                "assignee": "Fritz",
                "ownerCompany": "Petramco",
                "ownerBusinessUnit": "Facilities Support",
                "ownerGroup": "Facilities"
            }
            await apiHelper.apiLogin('fritz');
            let newCaseTemplate1 = await apiHelper.createCaseTemplate(casetemplatePetramco1);
            let newCaseTemplate2 = await apiHelper.createCaseTemplate(casetemplatePetramco2);
            let manualTaskTemplate = await apiHelper.createManualTaskTemplate(taskTemplateDataSet);
            await apiHelper.associateCaseTemplateWithOneTaskTemplate(newCaseTemplate1.displayId, manualTaskTemplate.displayId);
            await apiHelper.associateCaseTemplateWithOneTaskTemplate(newCaseTemplate2.displayId, manualTaskTemplate.displayId);
        });
        it('Changing case template for the case in Assigned Status', async () => {
            // await navigationPage.signOut();
            // await loginPage.login('fritz');
            await navigationPage.gotoCreateCase();
            await createCasePo.selectRequester('Franz');
            await createCasePo.setSummary(caseTemplateName);
            await createCasePo.clickSelectCaseTemplateButton();
            await selectCasetemplateBladePo.selectCaseTemplate(caseTemplateName);
            await createCasePo.clickAssignToMeButton();
            await createCasePo.clickSaveCaseButton();
            await previewCasePo.clickGoToCaseButton();
            expect(await viewCasePo.getCaseSummary()).toBe(caseTemplateName);
            await expect(await viewCasePo.isCoreTaskPresent(taskTemplateName)).toBeTruthy();
        });
        it('[DRDMV-9019]:[Case] [Template Selection] Changing case template for the case in Assigned Status', async () => {
            await viewCasePo.clickEditCaseButton();
            await editCasePo.clickOnChangeCaseTemplate();
            await selectCasetemplateBladePo.selectCaseTemplate(updatedCaseTemplateName);
            await editCasePo.clickSaveCase();
            expect(await viewCasePo.getPriorityValue()).toBe('Low');
            expect(await viewCasePo.getCaseStatusValue()).toContain('Assigned');
            expect(await viewCasePo.getCategoryTier1Value()).toBe('Purchasing Card');
            expect(await viewCasePo.getCategoryTier2Value()).toBe('Policies');
            expect(await viewCasePo.getCategoryTier3Value()).toBe('Card Issuance');
            expect(await viewCasePo.getAssignedCompanyText()).toBe('Petramco');
            expect(await viewCasePo.getAssigneeText()).toBe('Fritz Schulz');
            expect(await viewCasePo.getAssignedGroupText()).toBe('Facilities');
            expect(await activityTabPo.isTextPresentInActivityLog(updatedCaseTemplateName)).toBeTruthy('TemplateText is not available');
            expect(await activityTabPo.isTextPresentInActivityLog('applied the template')).toBeTruthy();
        });
        afterAll(async () => {
            await navigationPage.signOut();
            await loginPage.login('fritz');
        });
    });

    describe('[DRDMV-9129]:[Negative Testing] - Verify permission for Case Agent from a different support group to edit case template.', async () => {
        let randomStr = [...Array(5)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        let caseTemplateName = 'caseTemplateName' + randomStr;
        beforeAll(async () => {
            let casetemplatePetramco = {
                "templateName": caseTemplateName,
                "templateSummary": caseTemplateName,
                "templateStatus": "Active",
                "company": "Petramco",
                "resolveCaseonLastTaskCompletion": "1",
                "ownerCompany": "Petramco",
                "ownerBU": "Facilities Support",
                "ownerGroup": "Facilities",
                "buisnessUnit": "Facilities Support",
                "supportGroup": "Facilities",
                "assignee": "Fritz",
                "categoryTier1": "Purchasing Card",
                "categoryTier2": "Policies",
                "categoryTier3": "Card Issuance",
                "casePriority": "Low",
                "caseStatus": "Assigned",
            }
            await apiHelper.apiLogin('frieda');
            await apiHelper.createCaseTemplate(casetemplatePetramco);
        });
        it('Creating the Case with case template', async () => {
            await navigationPage.signOut();
            await loginPage.login('frieda');
            await navigationPage.gotoCreateCase();
            await createCasePo.selectRequester('adam');
            await createCasePo.setSummary(caseTemplateName);
            await createCasePo.clickSelectCaseTemplateButton();
            await selectCasetemplateBladePo.selectCaseTemplate(caseTemplateName);
            await createCasePo.clickSaveCaseButton();
            await previewCasePo.clickGoToCaseButton();
            expect(await viewCasePo.getCaseSummary()).toBe(caseTemplateName);
        });
        it('Login to CM with diffrent support group', async () => {
            await navigationPage.signOut();
            await loginPage.login('qdu');
            await navigationPage.gotoCaseConsole();
            await utilityGrid.clearFilter();
            await caseConsolePo.searchCase(caseTemplateName);
            expect(await caseConsolePo.isCaseSummaryPresent(caseTemplateName)).toBeFalsy("Case is present for diffrent company");
        });
        it('[DRDMV-9129]:[Negative Testing] - Verify permission for Case Agent from a different support group to edit case template.', async () => {
            await navigationPage.signOut();
            await loginPage.login('rrovnitov');
            await navigationPage.gotoCaseConsole();
            await utilityGrid.clearFilter();
            await caseConsolePo.searchCase(caseTemplateName);
            expect(await caseConsolePo.isCaseSummaryPresent(caseTemplateName)).toBeFalsy("Case is present for diffrent company");
        });
        afterAll(async () => {
            await navigationPage.signOut();
            await loginPage.login('fritz');
        });
    });

    describe('[DRDMV-12581,DRDMV-12554]:Case Template access when owner group from different company is applied', async () => {
        let caseTemplateName: string = "TemplateName" + Math.floor(Math.random() * 100000);
        it('Checking change case template button for In Progress', async () => {
            await navigationPage.signOut();
            await loginPage.login(userData.userId + "@petramco.com", 'Password_1234');
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Case Management--Templates', 'Case Templates - Business Workflows');
            await consoleCasetemplatePo.clickOnCreateCaseTemplateButton();
            await createCaseTemplate.setTemplateName(caseTemplateName);
            await createCaseTemplate.setCaseSummary(caseTemplateName);
            await createCaseTemplate.setCompanyName('Petramco');
            await createCaseTemplate.setPriorityValue('Low');
            await createCaseTemplate.setOwnerCompanyValue('Petramco');
            await createCaseTemplate.setBusinessUnitDropdownValue('Facilities Support');
            await createCaseTemplate.setOwnerGroupDropdownValue('Facilities');
            await createCaseTemplate.setTemplateStatusDropdownValue('Draft');
            await createCaseTemplate.clickSaveCaseTemplate();
        });
        it('Checking change case template button for Resolved', async () => {
            await editCasetemplatePo.clickOnEditCaseTemplateMetadata();
            await editCasetemplatePo.changeOwnerCompanyValue('Psilon');
            await editCasetemplatePo.changeBusinessUnitDropdownValue("Psilon Support Org1");
            await editCasetemplatePo.changeOwnerGroupDropdownValue("Psilon Support Group1");
            await editCasetemplatePo.clickOnSaveCaseTemplateMetadata();
            await expect(await viewCaseTemplate.getBuisnessUnitValue()).toContain("Psilon Support Org1");
            await expect(await viewCaseTemplate.getOwnerGroupValue()).toContain("Psilon Support Group1");
            await expect(await viewCaseTemplate.getOwnerCompanyValue()).toContain('Psilon');
        });
        it('[DRDMV-12581,DRDMV-12554]:Case Template access when owner group from different company is applied', async () => {
            await navigationPage.signOut();
            await loginPage.login('fritz');
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Case Management--Templates', 'Case Templates - Business Workflows');
            await utilGrid.searchAndOpenHyperlink(caseTemplateName);
            await viewCaseTemplate.clickOnEditCaseTemplateButton();
            expect(await editCasetemplatePo.isCaseSummaryReadOnly()).toBeTruthy();
            expect(await editCasetemplatePo.isCaseCompanyDisabled()).toBeTruthy();
        });
        afterAll(async () => {
            await navigationPage.signOut();
            await loginPage.login('qkatawazi');
        });
    });

    describe('[DRDMV-1245]:[Case Template] Template status lifecycle', async () => {
        let randomStr = [...Array(5)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        let caseTemplateName = randomStr + 'Draft';
        beforeAll(async () => {
            let templateDataDraft = {
                "templateName": caseTemplateName,
                "templateSummary": caseTemplateName,
                "templateStatus": "Draft",
                "company": "Petramco",
                "businessUnit": "Facilities Support",
                "supportGroup": "Facilities",
                "assignee": "Fritz",
            }
            await apiHelper.apiLogin('fritz');
            await apiHelper.createCaseTemplate(templateDataDraft);
        });
        it('Case Agent checks for Draft template', async () => {
            await navigationPage.signOut();
            await loginPage.login('fritz');
            await navigationPage.gotoQuickCase();
            await quickCasePo.selectRequesterName('adam');
            expect(await quickCasePo.selectCaseTemplate(caseTemplateName)).toBeFalsy('Draft template is present');
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Case Management--Templates', 'Case Templates - Business Workflows');
            await utilGrid.searchAndOpenHyperlink(caseTemplateName);
            await viewCaseTemplate.clickOnEditCaseTemplateButton();
            expect(await editCasetemplatePo.isCaseSummaryReadOnly()).toBeTruthy();
            expect(await editCasetemplatePo.isCaseCompanyDisabled()).toBeTruthy();
            await viewCaseTemplate.clickEditTemplateMetaData();
            await editCasetemplatePo.changeTemplateStatusDropdownValue('Active');
            await editCasetemplatePo.clickOnSaveCaseTemplateMetadata();
            expect(await viewCaseTemplate.getTemplateStatusValue()).toBe('Active');
        });
        it('Case Agent checks for Active template & Consume it', async () => {
            await navigationPage.gotoQuickCase();
            await quickCasePo.selectRequesterName('adam');
            await quickCasePo.selectCaseTemplate(caseTemplateName);
            await quickCasePo.setCaseSummary('ActiveTemplateCase');
            await quickCasePo.createCaseButton();
            await quickCasePo.gotoCaseButton();
            expect(await viewCasePo.getCaseTemplateText()).toBe(caseTemplateName);
        });
        it('[DRDMV-1245]:[Case Template] Template status lifecycle', async () => {
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Case Management--Templates', 'Case Templates - Business Workflows');
            await utilGrid.searchAndOpenHyperlink(caseTemplateName);
            await viewCaseTemplate.clickEditTemplateMetaData();
            await editCasetemplatePo.changeTemplateStatusDropdownValue('Inactive');
            await editCasetemplatePo.clickOnSaveCaseTemplateMetadata();
            expect(await viewCaseTemplate.getTemplateStatusValue()).toBe('Inactive');
            await navigationPage.gotoQuickCase();
            await quickCasePo.selectRequesterName('adam');
            expect(await quickCasePo.selectCaseTemplate(caseTemplateName)).toBeFalsy('Inactive template is present');
        });
        afterAll(async () => {
            await navigationPage.signOut();
            await loginPage.login('qkatawazi');
        });
    })

    describe('[DRDMV-9130,DRDMV-9127]:[Negative Testing] - Verify permission for Case Manager from a different/same support group to edit case template.', async () => {
        let randomStr = [...Array(5)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        let caseTemplateName = 'caseTemplateName' + randomStr;
        beforeAll(async () => {
            let casetemplatePetramco = {
                "templateName": caseTemplateName,
                "templateSummary": caseTemplateName,
                "templateStatus": "Active",
                "company": "Petramco",
                "resolveCaseonLastTaskCompletion": "1",
                "ownerCompany": "Petramco",
                "ownerBU": "Facilities Support",
                "ownerGroup": "Facilities",
                "buisnessUnit": "Facilities Support",
                "supportGroup": "Facilities",
                "assignee": "Fritz",
                "categoryTier1": "Purchasing Card",
                "categoryTier2": "Policies",
                "categoryTier3": "Card Issuance",
                "casePriority": "Low",
                "caseStatus": "Assigned",
            }
            await apiHelper.apiLogin('frieda');
            await apiHelper.createCaseTemplate(casetemplatePetramco);
        });
        it('Creating the Case with case template', async () => {
            await navigationPage.signOut();
            await loginPage.login('frieda');
            await navigationPage.gotoCreateCase();
            await createCasePo.selectRequester('adam');
            await createCasePo.setSummary(caseTemplateName);
            await createCasePo.clickSelectCaseTemplateButton();
            await selectCasetemplateBladePo.selectCaseTemplate(caseTemplateName);
            await createCasePo.clickSaveCaseButton();
            await previewCasePo.clickGoToCaseButton();
            expect(await viewCasePo.getCaseSummary()).toBe(caseTemplateName);
        });
        it('Login to CA with diffrent support group', async () => {
            await navigationPage.signOut();
            await loginPage.login('qtao');
            await navigationPage.gotoCaseConsole();
            await utilityGrid.clearFilter();
            await caseConsolePo.searchCase(caseTemplateName);
            expect(await caseConsolePo.isCaseSummaryPresent(caseTemplateName)).toBeFalsy("Case is present for diffrent company");
        });
        it('Login to CA with diffrent company', async () => {
            await navigationPage.signOut();
            await loginPage.login('werusha');
            await navigationPage.gotoCaseConsole();
            await utilityGrid.clearFilter();
            await caseConsolePo.searchCase(caseTemplateName);
            expect(await caseConsolePo.isCaseSummaryPresent(caseTemplateName)).toBeFalsy("Case is present for diffrent company");
        });
        it('[DRDMV-9130,DRDMV-9127]:[Negative Testing] - Verify permission for Case Manager from a different/same support group to edit case template.', async () => {
            await navigationPage.signOut();
            await loginPage.login('fritz');
            await navigationPage.gotoCaseConsole();
            await utilityGrid.clearFilter();
            await caseConsolePo.searchAndOpenCase(caseTemplateName);
            expect(await viewCasePo.getCaseSummary()).toBe(caseTemplateName);
        });
        afterAll(async () => {
            await navigationPage.signOut();
            await loginPage.login('qkatawazi');
        });
    });

    it('[DRDMV-12556]:Case Template submitter from different company than owner group company can edit the template', async () => {
        await navigationPage.signOut();
        await loginPage.login(userData.userId + "@petramco.com", 'Password_1234');
        await navigationPage.gotoSettingsPage();
        await navigationPage.gotoSettingsMenuItem('Case Management--Templates', 'Case Templates - Business Workflows');
        let caseTemplateName: string = "TemplateName" + Math.floor(Math.random() * 100000);
        await consoleCasetemplatePo.clickOnCreateCaseTemplateButton();
        await createCaseTemplate.setTemplateName(caseTemplateName);
        await createCaseTemplate.setCaseSummary(caseTemplateName);
        await createCaseTemplate.setCompanyName('Psilon');
        await createCaseTemplate.setPriorityValue('Low');
        await createCaseTemplate.setOwnerCompanyValue('Phylum');
        await createCaseTemplate.setBusinessUnitDropdownValue('Phylum Support Org1');
        await createCaseTemplate.setOwnerGroupDropdownValue('Phylum Support Group1');
        await createCaseTemplate.setTemplateStatusDropdownValue('Draft')
        await createCaseTemplate.clickSaveCaseTemplate();
        await navigationPage.gotoSettingsPage();
        await navigationPage.gotoSettingsMenuItem('Case Management--Templates', 'Case Templates - Business Workflows');
        await utilGrid.searchAndOpenHyperlink(caseTemplateName);
        await editCasetemplatePo.clickOnEditCaseTemplateMetadata();
        await editCasetemplatePo.changeOwnerCompanyValue('Psilon');
        await editCasetemplatePo.changeBusinessUnitDropdownValue("Psilon Support Org1");
        await editCasetemplatePo.changeOwnerGroupDropdownValue("Psilon Support Group1");
        await editCasetemplatePo.clickOnSaveCaseTemplateMetadata();
        await expect(await viewCaseTemplate.getBuisnessUnitValue()).toContain("Psilon Support Org1");
        await expect(await viewCaseTemplate.getOwnerGroupValue()).toContain("Psilon Support Group1");
        await expect(await viewCaseTemplate.getOwnerCompanyValue()).toContain('Psilon');
    });

    it('[DRDMV-11979]:[Negative Testing] - Global as well as company specific flowset will list if we select specific company while creating case template.', async () => {
        await apiHelper.apiLogin('qkatawazi');
        let randomStr = [...Array(4)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        let flowsetData = require('../../data/ui/case/flowset.ui.json');
        let flowsetPetramcoName: string = await flowsetData['flowsetMandatoryFields'].flowsetName + randomStr;
        flowsetData['flowsetMandatoryFields'].flowsetName = flowsetPetramcoName;
        await apiHelper.createNewFlowset(flowsetData['flowsetMandatoryFields']);
        let flowsetGlobalName: string = await flowsetData['flowsetGlobalFields'].flowsetName + randomStr;
        flowsetData['flowsetGlobalFields'].flowsetName = flowsetGlobalName;
        await apiHelper.createNewFlowset(flowsetData['flowsetGlobalFields']);

        await navigationPage.gotoSettingsPage();
        await navigationPage.gotoSettingsMenuItem('Case Management--Templates', 'Case Templates - Business Workflows');
        let caseTemplateName: string = caseTemplateRequiredFields.templateName + Math.floor(Math.random() * 100000);
        caseTemplateRequiredFields.templateName = caseTemplateName;
        await consoleCasetemplatePo.clickOnCreateCaseTemplateButton();
        await createCaseTemplate.setTemplateName(caseTemplateName);
        await createCaseTemplate.setCompanyName(caseTemplateAllFields.company);
        await createCaseTemplate.setCaseSummary(caseTemplateAllFields.templateSummary);
        await createCaseTemplate.setPriorityValue(caseTemplateAllFields.casePriority);
        await createCaseTemplate.setFlowsetValue(flowsetPetramcoName);
        await createCaseTemplate.clickSaveCaseTemplate();
        expect(await viewCaseTemplate.getFlowsetValue()).toBe(flowsetPetramcoName);
        await viewCaseTemplate.clickOnEditCaseTemplateButton();
        await editCasetemplatePo.changeFlowsetValue(flowsetGlobalName);
        await editCasetemplatePo.clickSaveCaseTemplate();
        expect(await viewCaseTemplate.getFlowsetValue()).toBe(flowsetGlobalName);
    });

    describe('[DRDMV-19741]:[RESOLVE_CASE_ON_LAST_TASK_COMPLETION] - Case behavior when Case Template is changed', async () => {
        let randomStr = [...Array(5)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        let caseTemplateName = 'caseTemplateName' + randomStr;
        let casTemplateSummary = 'CaseSummaryName' + randomStr;
        let caseTemplateNameWithNoValue = 'caseTemplateWithNoResolve' + randomStr;
        let caseTemplateSummaryNoValue = 'CaseSummaryNoResolved' + randomStr;
        let taskTemplateNameWithYesValue = 'taskTemplateWithYesResolve' + randomStr;
        let taskTemplateSummaryYesValue = 'taskYesResolved' + randomStr;
        let manualTask = 'ManualTaskTemp' + randomStr;
        let ManualTaskTempSummary = 'ManualTaskSumm' + randomStr;
        beforeAll(async () => {
            let templateData = {
                "templateName": `${caseTemplateName}`,
                "templateSummary": `${casTemplateSummary}`,
                "templateStatus": "Active",
                "company": "Petramco",
                "resolveCaseonLastTaskCompletion": "1",
                "assignee": "Fritz",
                "supportGroup": "Facilities",
                "caseStatus": "Assigned",
            }
            await apiHelper.apiLogin('fritz');
            let newCaseTemplate = await apiHelper.createCaseTemplate(templateData);
            let taskTemplateDataSet = {
                "templateName": `${taskTemplateNameWithYesValue}`,
                "templateSummary": `${taskTemplateSummaryYesValue}`,
                "templateStatus": "Active",
                "assignee": "Fritz",
                "taskCompany": "Petramco",
                "ownerCompany": "Petramco",
                "ownerBusinessUnit": "Facilities Support",
                "ownerGroup": "Facilities"
            }
            let manualTaskTemplate = await apiHelper.createManualTaskTemplate(taskTemplateDataSet);
            await apiHelper.associateCaseTemplateWithOneTaskTemplate(newCaseTemplate.displayId, manualTaskTemplate.displayId);
            let templateDataSet = {
                "templateName": `${caseTemplateNameWithNoValue}`,
                "templateSummary": `${caseTemplateSummaryNoValue}`,
                "templateStatus": "Active",
                "company": "Petramco",
                "resolveCaseonLastTaskCompletion": "0",
                "assignee": "Fritz",
                "supportGroup": "Facilities"
            }
            let newCaseTemplateOne = await apiHelper.createCaseTemplate(templateDataSet);
            let taskTemplateData = {
                "templateName": `${manualTask}`,
                "templateSummary": `${ManualTaskTempSummary}`,
                "templateStatus": "Active",
                "taskCompany": "Petramco",
                "ownerCompany": "Petramco",
                "ownerBusinessUnit": "Facilities Support",
                "ownerGroup": "Facilities"
            }
            let manualTaskTemplateOne = await apiHelper.createManualTaskTemplate(taskTemplateData);
            await apiHelper.associateCaseTemplateWithOneTaskTemplate(newCaseTemplateOne.displayId, manualTaskTemplateOne.displayId);
        });
        it('Case behavior when Case Template is changed', async () => {
            await navigationPage.gotoCreateCase();
            await createCasePo.selectRequester('fritz');
            await createCasePo.setSummary('Summary');
            await createCasePo.clickSelectCaseTemplateButton();
            await selectCasetemplateBladePo.selectCaseTemplate(caseTemplateName);
            await createCasePo.clickAssignToMeButton();
            await createCasePo.clickSaveCaseButton();
            await previewCasePo.clickGoToCaseButton();
            await viewCasePo.isEditLinkDisplay();
            await expect(await viewCasePo.isCoreTaskPresent(taskTemplateSummaryYesValue)).toBeTruthy();
            await viewCasePo.clickEditCaseButton();
            await editCasePo.clickOnChangeCaseTemplate();
            await selectCasetemplateBladePo.selectCaseTemplate(caseTemplateNameWithNoValue);
            await editCasePo.clickSaveCase();
        });
        it('Case behavior when Case Template is changed', async () => {
            await utilCommon.closePopUpMessage();
            await updateStatusBladePo.changeCaseStatus('In Progress');
            await updateStatusBladePo.clickSaveStatus();
            await viewCasePo.openTaskCard(1);
            await manageTaskBladePo.clickTaskLink(ManualTaskTempSummary);
            await viewTaskPo.clickOnChangeStatus();
            await viewTaskPo.changeTaskStatus('Completed');
            await updateStatusBladePo.setStatusReason('Successful');
            await viewTaskPo.clickOnSaveStatus();
            await viewTaskPo.clickOnViewCase();
            await expect(await viewCasePo.getCaseStatusValue()).toContain('In Progress');
        });
        it('Case behavior when Case Template is changed', async () => {
            await navigationPage.gotoCreateCase();
            await createCasePo.selectRequester('fritz');
            await createCasePo.setSummary('Summary');
            await createCasePo.clickSelectCaseTemplateButton();
            await selectCasetemplateBladePo.selectCaseTemplate(caseTemplateName);
            await createCasePo.clickAssignToMeButton();
            await createCasePo.clickSaveCaseButton();
            await previewCasePo.clickGoToCaseButton();
            await viewCasePo.isEditLinkDisplay();
            await expect(await viewCasePo.isCoreTaskPresent(taskTemplateSummaryYesValue)).toBeTruthy();
        });
        it('[DRDMV-19741]:[RESOLVE_CASE_ON_LAST_TASK_COMPLETION] - Case behavior when Case Template is changed', async () => {
            await updateStatusBladePo.changeCaseStatus('In Progress');
            await updateStatusBladePo.clickSaveStatus();
            await viewCasePo.openTaskCard(1);
            await manageTaskBladePo.clickTaskLink(taskTemplateSummaryYesValue);
            await viewTaskPo.clickOnChangeStatus();
            await viewTaskPo.changeTaskStatus('Completed');
            await updateStatusBladePo.setStatusReason('Successful');
            await viewTaskPo.clickOnSaveStatus();
            await viewTaskPo.clickOnViewCase();
            await expect(await viewCasePo.getCaseStatusValue()).toContain('Resolved');
        });
        afterAll(async () => {
            await navigationPage.signOut();
            await loginPage.login('fritz');
        });
    });
});   