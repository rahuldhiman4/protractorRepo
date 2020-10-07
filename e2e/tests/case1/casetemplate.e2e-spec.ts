import { browser } from "protractor";
import apiHelper from '../../api/api.helper';
import { ALL_FIELD, MANDATORY_FIELD } from '../../data/ui/case/casetemplate.data.ui';
import caseConsolePo from '../../pageobject/case/case-console.po';
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
import activityTabPo from '../../pageobject/social/activity-tab.po';
import manageTaskBladePo from '../../pageobject/task/manage-task-blade.po';
import viewTaskPo from '../../pageobject/task/view-task.po';
import { BWF_BASE_URL } from '../../utils/constants';
import utilCommon from '../../utils/util.common';
import utilGrid from '../../utils/util.grid';
import utilityCommon from '../../utils/utility.common';
import utilityGrid from '../../utils/utility.grid';
import { flowsetMandatoryFields, flowsetGlobalFields } from '../../data/ui/flowset/flowset.ui';
import { cloneDeep } from 'lodash';

describe('Case Template', () => {
    let userData = undefined;
    beforeAll(async () => {
        await browser.get(BWF_BASE_URL);
        await loginPage.login("qkatawazi");
        await apiHelper.apiLogin('tadmin');
        userData = {
            "firstName": "Multiple",
            "lastName": "Company",
            "userId": "nosg",
            "emailId": "nosg@petramco.com",
            "userPermission": ["Case Agent","Foundation Read","Document Manager","Case Business Analyst"]
        }
        await apiHelper.createNewUser(userData);
        await apiHelper.associatePersonToCompany(userData.userId, "Petramco");
        await apiHelper.associatePersonToCompany(userData.userId, "Psilon");
        await apiHelper.associatePersonToCompany(userData.userId, "Phylum");
    });

    afterAll(async () => {
        await utilityCommon.closeAllBlades();
        await navigationPage.signOut();
    });

    //ptidke
    it('[DRDMV-10477,DRDMV-10483]: Case Template creation with Template validation as OPTIONAL using BA login', async () => {
        await navigationPage.gotoSettingsPage();
        await navigationPage.gotoSettingsMenuItem('Case Management--Templates', 'Case Templates - Business Workflows');
        ALL_FIELD.templateName = ALL_FIELD.templateName + Math.floor(Math.random() * 100000);
        await consoleCasetemplatePo.clickOnCreateCaseTemplateButton();
        await createCaseTemplate.setTemplateName(ALL_FIELD.templateName);
        await createCaseTemplate.setCompanyName(ALL_FIELD.company);
        await createCaseTemplate.setCaseSummary(ALL_FIELD.templateSummary);
        await createCaseTemplate.setPriorityValue(ALL_FIELD.casePriority);
        await createCaseTemplate.setBusinessUnitDropdownValue(ALL_FIELD.ownerBusinessUnit);
        await createCaseTemplate.setOwnerGroupDropdownValue(ALL_FIELD.ownerGroup);
        await createCaseTemplate.setTemplateStatusDropdownValue(ALL_FIELD.templateStatus)
        await createCaseTemplate.setIdentityValidationValue(ALL_FIELD.identityValidation)
        await createCaseTemplate.clickSaveCaseTemplate();
        expect(await viewCaseTemplate.getCaseTemplateNameValue()).toContain(ALL_FIELD.templateName);
        expect(await viewCaseTemplate.getIdentityValdationValue()).toContain(ALL_FIELD.identityValidation);
    });

    //ptidke
    it('[DRDMV-10487]: Case Template update with Template validation as ENFORCED', async () => {
        await navigationPage.gotoSettingsPage();
        await navigationPage.gotoSettingsMenuItem('Case Management--Templates', 'Case Templates - Business Workflows');
        ALL_FIELD.templateName = ALL_FIELD.templateName + Math.floor(Math.random() * 100000);
        await consoleCasetemplatePo.clickOnCreateCaseTemplateButton();
        await createCaseTemplate.setTemplateName(ALL_FIELD.templateName);
        await createCaseTemplate.setCompanyName(ALL_FIELD.company);
        await createCaseTemplate.setCaseSummary(ALL_FIELD.templateSummary);
        await createCaseTemplate.setPriorityValue(ALL_FIELD.casePriority);
        await createCaseTemplate.setBusinessUnitDropdownValue(ALL_FIELD.ownerBusinessUnit);
        await createCaseTemplate.setOwnerGroupDropdownValue(ALL_FIELD.ownerGroup);
        await createCaseTemplate.setTemplateStatusDropdownValue(ALL_FIELD.templateStatus)
        await createCaseTemplate.setIdentityValidationValue(ALL_FIELD.identityValidation)
        await createCaseTemplate.clickSaveCaseTemplate();
        expect(await viewCaseTemplate.getCaseTemplateNameValue()).toContain(ALL_FIELD.templateName);
        expect(await viewCaseTemplate.getIdentityValdationValue()).toContain(ALL_FIELD.identityValidation);
        await editCasetemplatePo.clickOnEditCaseTemplateMetadata();
        await editCasetemplatePo.changeTemplateStatusDropdownValue('Draft');
        await editCasetemplatePo.clickOnSaveCaseTemplateMetadata();
        await editCasetemplatePo.clickEditCaseTemplate();
        await editCasetemplatePo.changeIdentityValidationValue('Enforced');
        await editCasetemplatePo.clickSaveCaseTemplate();
        expect(await viewCaseTemplate.getIdentityValdationValue()).toContain('Enforced');
    });

    //ptidke
    it('[DRDMV-10469]: Case Template creation with Template validation as ENFORCED', async () => {
        await navigationPage.gotoSettingsPage();
        await navigationPage.gotoSettingsMenuItem('Case Management--Templates', 'Case Templates - Business Workflows');
        ALL_FIELD.templateName = ALL_FIELD.templateName + Math.floor(Math.random() * 100000);
        await consoleCasetemplatePo.clickOnCreateCaseTemplateButton();
        await createCaseTemplate.setTemplateName(ALL_FIELD.templateName);
        await createCaseTemplate.setCompanyName(ALL_FIELD.company);
        await createCaseTemplate.setCaseSummary(ALL_FIELD.templateSummary);
        await createCaseTemplate.setPriorityValue(ALL_FIELD.casePriority);
        await createCaseTemplate.setBusinessUnitDropdownValue(ALL_FIELD.ownerBusinessUnit);
        await createCaseTemplate.setOwnerGroupDropdownValue(ALL_FIELD.ownerGroup);
        await createCaseTemplate.setTemplateStatusDropdownValue(ALL_FIELD.templateStatus)
        await createCaseTemplate.setIdentityValidationValue('Enforced')
        await createCaseTemplate.clickSaveCaseTemplate();
        expect(await viewCaseTemplate.getCaseTemplateNameValue()).toContain(ALL_FIELD.templateName);
        expect(await viewCaseTemplate.getIdentityValdationValue()).toContain('Enforced');
    });

    //ptidke
    it('[DRDMV-10481]: Case Template creation with Template validation as NONE', async () => {
        await navigationPage.gotoSettingsPage();
        await navigationPage.gotoSettingsMenuItem('Case Management--Templates', 'Case Templates - Business Workflows');
        ALL_FIELD.templateName = ALL_FIELD.templateName + Math.floor(Math.random() * 100000);
        await consoleCasetemplatePo.clickOnCreateCaseTemplateButton();
        await createCaseTemplate.setTemplateName(ALL_FIELD.templateName);
        await createCaseTemplate.setCompanyName(ALL_FIELD.company);
        await createCaseTemplate.setCaseSummary(ALL_FIELD.templateSummary);
        await createCaseTemplate.setPriorityValue(ALL_FIELD.casePriority);
        await createCaseTemplate.setBusinessUnitDropdownValue(ALL_FIELD.ownerBusinessUnit);
        await createCaseTemplate.setOwnerGroupDropdownValue(ALL_FIELD.ownerGroup);
        await createCaseTemplate.setTemplateStatusDropdownValue(ALL_FIELD.templateStatus)
        await createCaseTemplate.setIdentityValidationValue('None')
        await createCaseTemplate.clickSaveCaseTemplate();
        expect(await viewCaseTemplate.getCaseTemplateNameValue()).toContain(ALL_FIELD.templateName);
        expect(await viewCaseTemplate.getIdentityValdationValue()).toContain('None');
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
        ALL_FIELD.templateName = ALL_FIELD.templateName + Math.floor(Math.random() * 100000);
        await consoleCasetemplatePo.clickOnCreateCaseTemplateButton();
        await createCaseTemplate.setTemplateName(ALL_FIELD.templateName);
        await createCaseTemplate.setCompanyName(ALL_FIELD.company);
        await createCaseTemplate.setCaseSummary(ALL_FIELD.templateSummary);
        await createCaseTemplate.setPriorityValue(ALL_FIELD.casePriority);
        await createCaseTemplate.setAssignmentMethodValue('None');
        expect(await copyCasetemplatePo.getValueOfAssignementMethod()).toContain('None');
        await createCaseTemplate.setBusinessUnitDropdownValue(ALL_FIELD.ownerBusinessUnit);
        await createCaseTemplate.setOwnerGroupDropdownValue(ALL_FIELD.ownerGroup);
        await createCaseTemplate.setAssignmentMethodValue(ALL_FIELD.assignmentMethod);
        expect(await copyCasetemplatePo.getValueOfAssignementMethod()).toContain(ALL_FIELD.assignmentMethod);
        await createCaseTemplate.setTemplateStatusDropdownValue('Draft')
        await createCaseTemplate.clickSaveCaseTemplate();
        await editCasetemplatePo.clickEditCaseTemplate();
        await editCasetemplatePo.changeAssignmentMethodValue('None');
        expect(await editCasetemplatePo.getValueOfAssignmentMethod()).toContain('None');
        await editCasetemplatePo.changeAssignmentMethodValue(ALL_FIELD.assignmentMethod);
        expect(await editCasetemplatePo.getValueOfAssignmentMethod()).toContain(ALL_FIELD.assignmentMethod);
        await editCasetemplatePo.clickSaveCaseTemplate();
    });

    //ptidke
    it('[DRDMV-14880]: Verify Case assignment method is set to None by default in a New/already existing Case template', async () => {
        await navigationPage.gotoSettingsPage();
        await navigationPage.gotoSettingsMenuItem('Case Management--Templates', 'Case Templates - Business Workflows');
        ALL_FIELD.templateName = ALL_FIELD.templateName + Math.floor(Math.random() * 100000);
        await consoleCasetemplatePo.clickOnCreateCaseTemplateButton();
        await createCaseTemplate.setTemplateName(ALL_FIELD.templateName);
        await createCaseTemplate.setCompanyName(ALL_FIELD.company);
        await createCaseTemplate.setCaseSummary(ALL_FIELD.templateSummary);
        await createCaseTemplate.setPriorityValue(ALL_FIELD.casePriority);
        expect(await copyCasetemplatePo.getValueOfAssignementMethod()).toContain('None');
        await createCaseTemplate.setBusinessUnitDropdownValue(ALL_FIELD.ownerBusinessUnit);
        await createCaseTemplate.setOwnerGroupDropdownValue(ALL_FIELD.ownerGroup);
        await createCaseTemplate.setTemplateStatusDropdownValue('Draft')
        await createCaseTemplate.clickSaveCaseTemplate();
        await editCasetemplatePo.clickEditCaseTemplate();
        expect(await editCasetemplatePo.getValueOfAssignmentMethod()).toContain('None');
        await editCasetemplatePo.clickSaveCaseTemplate();
    });

    //ptidke 
    it('[DRDMV-1231]: [Edit Case Template] Template metadata edit', async () => {
        await navigationPage.gotoSettingsPage();
        await navigationPage.gotoSettingsMenuItem('Case Management--Templates', 'Case Templates - Business Workflows');
        const randomStr = Math.floor(Math.random() * 100000);
        let templateData = {
            "templateName": MANDATORY_FIELD.templateName + randomStr,
            "templateSummary": MANDATORY_FIELD.templateSummary + randomStr,
            "caseStatus": "InProgress",
            "templateStatus": "Active",
            "company": "Petramco",
            "businessUnit": "Facilities Support",
            "supportGroup": "Facilities",
            "assignee": "Fritz",
            "ownerBU": 'Facilities Support',
            "ownerGroup": "Facilities",
        }
        await apiHelper.apiLogin('qkatawazi');
        await apiHelper.createCaseTemplate(templateData);
        await navigationPage.gotoSettingsPage();
        await navigationPage.gotoSettingsMenuItem('Case Management--Templates', 'Case Templates - Business Workflows');
        await utilGrid.searchAndOpenHyperlink(templateData.templateName);
        await editCasetemplatePo.clickOnEditCaseTemplateMetadata();
        await editCasetemplatePo.changeBusinessUnitDropdownValue(MANDATORY_FIELD.ownerBusinessUnit);
        await editCasetemplatePo.changeOwnerGroupDropdownValue(MANDATORY_FIELD.ownerGroup);
        await editCasetemplatePo.changeTemplateStatusDropdownValue('Draft');
        await editCasetemplatePo.clickOnSaveCaseTemplateMetadata();
        await editCasetemplatePo.clickEditCaseTemplate();
        await editCasetemplatePo.clearCaseSummary();
        await editCasetemplatePo.clickSaveCaseTemplate();
        expect(await utilCommon.isPopUpMessagePresent('Resolve the field validation errors and then try again.')).toBeTruthy();
        await editCasetemplatePo.changeCaseSummary('Updated Summary');
        await editCasetemplatePo.clickSaveCaseTemplate();
        await editCasetemplatePo.clickOnEditCaseTemplateMetadata();
        await editCasetemplatePo.changeTemplateStatusDropdownValue('Active');
        await editCasetemplatePo.clickOnSaveCaseTemplateMetadata();
        await utilCommon.closePopUpMessage();
        await navigationPage.gotoSettingsPage();
        await navigationPage.gotoSettingsMenuItem('Case Management--Templates', 'Case Templates - Business Workflows');
        await utilGrid.searchAndOpenHyperlink(templateData.templateName);
        expect(await viewCaseTemplate.getOwnerGroupValue()).toContain(MANDATORY_FIELD.ownerGroup);
        expect(await viewCaseTemplate.getOwnerCompanyValue()).toContain('Petramco');
        expect(await viewCaseTemplate.getTemplateStatusValue()).toContain(MANDATORY_FIELD.templateStatus);
    });

    //ptidke 
    it('[DRDMV-1229]: [Case Template Console] Search by Summary and Display ID on the Case Template Console', async () => {
        await navigationPage.gotoSettingsPage();
        await navigationPage.gotoSettingsMenuItem('Case Management--Templates', 'Case Templates - Business Workflows');
        let randomStr = [...Array(5)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        let templateData = {
            "templateName": 'caseTemplateName' + randomStr,
            "templateSummary": 'CaseSummaryName' + randomStr,
            "templateStatus": "Active",
            "ownerCompany": "Petramco",
            "ownerBU": "Facilities Support",
            "ownerGroup": "Facilities",
        }
        await apiHelper.apiLogin('fritz');
        let newCaseTemplate = await apiHelper.createCaseTemplate(templateData);
        let column1: string[] = ["Display ID"];
        await consoleCasetemplatePo.addColumnOnGrid(column1);
        await utilGrid.searchRecord(newCaseTemplate.displayId);
        expect(await consoleCasetemplatePo.getFirstRecordValue("Display ID")).toContain(newCaseTemplate.displayId);
        await consoleCasetemplatePo.clickOnClearSearchIcon();
        expect(await consoleCasetemplatePo.moreRecordsArePresentAfterClear()).toBeGreaterThan(7);
        await utilGrid.searchRecord(templateData.templateName);
        expect(await consoleCasetemplatePo.getFirstRecordValue("Template Name")).toContain(templateData.templateName);
        await consoleCasetemplatePo.clickOnClearSearchIcon();
        expect(await consoleCasetemplatePo.moreRecordsArePresentAfterClear()).toBeGreaterThan(7);
        await utilGrid.searchRecord('xyzsdasdlkdasd');
        expect(await consoleCasetemplatePo.moreRecordsArePresentAfterClear()).toBeLessThanOrEqual(0);
        await consoleCasetemplatePo.removeColumnFromGrid(column1);
    });

    //ptidke
    it('[DRDMV-12560]: Case Agent from owner company can create a case using the template', async () => {
        try {
            let randomStr = [...Array(5)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
            let templateData = {
                "templateName": 'QuickCaseTemplate' + randomStr,
                "templateSummary": 'QuickCaseSummaryTemplate' + randomStr,
                "caseStatus": "InProgress",
                "templateStatus": "Active",
                "company": "Petramco",
                "businessUnit": "Facilities Support",
                "supportGroup": "Facilities",
                "assignee": "Fritz",
                "ownerBU": 'Facilities Support',
                "ownerGroup": "Facilities",
                "description": 'description' + randomStr
            }
            await apiHelper.apiLogin('qkatawazi');
            await apiHelper.createCaseTemplate(templateData);
            await navigationPage.signOut();
            await loginPage.login('qtao');
            await navigationPage.gotoCreateCase();
            await createCasePo.selectRequester('fritz');
            await createCasePo.setSummary('Summary');
            await createCasePo.clickSelectCaseTemplateButton();
            await selectCasetemplateBladePo.selectCaseTemplate(templateData.templateSummary);
            await createCasePo.clickAssignToMeButton();
            await createCasePo.clickSaveCaseButton();
            await previewCasePo.clickGoToCaseButton();
            expect(await viewCasePo.isEditLinkDisplay()).toBeTruthy();
            await navigationPage.gotoQuickCase();
            await quickCasePo.selectRequesterName('fritz');
            await quickCasePo.selectCaseTemplate(templateData.templateName);
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
        let templateData = {
            "templateName": 'caseTemplateName' + randomStr,
            "templateSummary": 'caseTemplateName' + randomStr,
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
        await utilGrid.searchAndOpenHyperlink(templateData.templateName);
        await viewCaseTemplate.clickOnEditCaseTemplateButton();
        expect(await editCasetemplatePo.isCaseSummaryReadOnly()).toBeTruthy();
        await editCasetemplatePo.clickOnEditCaseTemplateMetadata();
        expect(await editCasetemplatePo.isSaveButtonOnMetaDataIsDisabled()).toBeTruthy();
    });

    //ptidke
    it('[DRDMV-19734]:[RESOLVE_CASE_ON_LAST_TASK_COMPLETION] - Case Template view Look & Feel after adding new configuration field', async () => {
        try {
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Case Management--Templates', 'Case Templates - Business Workflows');
            ALL_FIELD.templateName = ALL_FIELD.templateName + Math.floor(Math.random() * 100000);
            await consoleCasetemplatePo.clickOnCreateCaseTemplateButton();
            await createCaseTemplate.setTemplateName(ALL_FIELD.templateName);
            await createCaseTemplate.setCompanyName(ALL_FIELD.company);
            await createCaseTemplate.setCaseSummary(ALL_FIELD.templateSummary);
            await createCaseTemplate.setPriorityValue(ALL_FIELD.casePriority);
            await createCaseTemplate.isResolveCaseOnLastTaskCompletion(true);
            await createCaseTemplate.setPriorityValue(ALL_FIELD.casePriority);
            await createCaseTemplate.isResolveCaseOnLastTaskCompletion(true);
            await createCaseTemplate.clickSaveCaseTemplate();
            expect(await viewCaseTemplate.getResolveCaseOnLastTaskCompletionValue()).toContain('Yes');
            await editCasetemplatePo.clickEditCaseTemplate();
            await editCasetemplatePo.isResolveCaseOnLastTaskCompletion(false);
            await editCasetemplatePo.clickSaveCaseTemplate();
            expect(await viewCaseTemplate.getResolveCaseOnLastTaskCompletionValue()).toContain('No');
        } catch (e) {
            throw e;
        }
        finally {
            await navigationPage.signOut();
            await loginPage.login('qkatawazi');
        }
    });

    //ptidke
    describe('[DRDMV-9003]: [Negative Testing]-Checking change case template button disabled/hidden for different case status.', async () => {
        let randomStr = [...Array(5)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        let templateData;
        beforeAll(async () => {
            templateData = {
                "templateName": 'caseTemplateName' + randomStr,
                "templateSummary": 'caseTemplateSummary' + randomStr,
                "resolveCaseonLastTaskCompletion": "1",
                "templateStatus": "Active",
                "company": "Petramco",
                "businessUnit": "Facilities Support",
                "supportGroup": "Facilities",
                "assignee": "Fritz",
                "ownerBU": 'Facilities Support',
                "ownerGroup": "Facilities",
                "caseStatus": "Assigned",
                "description": 'description' + randomStr,
            }
            await apiHelper.apiLogin('fritz');
            await apiHelper.createCaseTemplate(templateData);
        });
        it('[DRDMV-9003]: Checking change case template button for In Progress', async () => {
            await navigationPage.gotoCreateCase();
            await createCasePo.selectRequester('fritz');
            await createCasePo.clickSelectCaseTemplateButton();
            await selectCasetemplateBladePo.selectCaseTemplate(templateData.templateName);
            await createCasePo.clickSaveCaseButton();
            await previewCasePo.clickGoToCaseButton();
            await viewCasePo.isEditLinkDisplay();
            await updateStatusBladePo.changeCaseStatus('In Progress');
            await updateStatusBladePo.clickSaveStatus('In Progress');
            await viewCasePo.clickEditCaseButton();
            await editCasePo.waitForEditCasePageToBeDisplayed();
            expect(await editCasePo.isChangeCaseTemplateButtonDisplayed()).toBeFalsy('change template button not Displayed');
            await editCasePo.clickOnCancelCaseButton();
            await utilityCommon.clickOnApplicationWarningYesNoButton("Yes");
        });
        it('[DRDMV-9003]: Checking change case template button for Resolved', async () => {
            await updateStatusBladePo.changeCaseStatus('Resolved');
            await updateStatusBladePo.setStatusReason('Auto Resolved');
            await updateStatusBladePo.clickSaveStatus('Resolved');
            await viewCasePo.clickEditCaseButton();
            await editCasePo.waitForEditCasePageToBeDisplayed();
            expect(await editCasePo.isChangeCaseTemplateButtonDisplayed()).toBeFalsy('change template button not Displayed');
            await editCasePo.clickOnCancelCaseButton();
            await utilityCommon.clickOnApplicationWarningYesNoButton("Yes");
        });
        it('[DRDMV-9003]: Checking change case template button for Closed', async () => {
            await updateStatusBladePo.changeCaseStatus('Closed');
            await updateStatusBladePo.clickSaveStatus('Closed');
            await viewCasePo.clickEditCaseButton();
            await editCasePo.waitForEditCasePageToBeDisplayed();
            expect(await editCasePo.isChangeCaseTemplateButtonDisplayed()).toBeFalsy('change template button not Displayed');
            await editCasePo.clickOnCancelCaseButton();
            await utilityCommon.clickOnApplicationWarningYesNoButton("Yes");
        });
        it('[DRDMV-9003]: Checking change case template button for Pending', async () => {
            await navigationPage.gotoCreateCase();
            await createCasePo.selectRequester('fritz');
            await createCasePo.clickSelectCaseTemplateButton();
            await selectCasetemplateBladePo.selectCaseTemplate(templateData.templateName);
            await createCasePo.clickSaveCaseButton();
            await previewCasePo.clickGoToCaseButton();
            await viewCasePo.isEditLinkDisplay();
            await updateStatusBladePo.changeCaseStatus('Pending');
            await updateStatusBladePo.setStatusReason('Customer Response');
            await updateStatusBladePo.clickSaveStatus('Pending');
            await viewCasePo.clickEditCaseButton();
            await editCasePo.waitForEditCasePageToBeDisplayed();
            expect(await editCasePo.isChangeCaseTemplateButtonDisplayed()).toBeFalsy('change template button not Displayed');
            await editCasePo.clickOnCancelCaseButton();
            await utilityCommon.clickOnApplicationWarningYesNoButton("Yes");
        });
        it('[DRDMV-9003]: Checking change case template button disabled/hidden for different case status.', async () => {
            await updateStatusBladePo.changeCaseStatus('Canceled');
            await updateStatusBladePo.setStatusReason('Customer Canceled');
            await updateStatusBladePo.clickSaveStatus('Canceled');
            await viewCasePo.clickEditCaseButton();
            await editCasePo.waitForEditCasePageToBeDisplayed();
            expect(await editCasePo.isChangeCaseTemplateButtonDisplayed()).toBeFalsy('change template button not Displayed');
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
        let casetemplatePetramco, casetemplatePsilon;
        beforeAll(async () => {
            casetemplatePetramco = {
                "templateName": 'caseTemplateName' + randomStr,
                "templateSummary": 'caseTemplateSummary' + randomStr,
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
                "description": 'description' + randomStr,
            }
            await apiHelper.apiLogin('fritz');
            await apiHelper.createCaseTemplate(casetemplatePetramco);
            casetemplatePsilon = {
                "templateName": randomStr + 'caseTemplatePsilonDRDMV773',
                "templateSummary": randomStr + 'caseTemplateSummaryPsilonDRDMV773',
                "caseStatus": "InProgress",
                "templateStatus": "Active",
                "company": "Psilon",
                "businessUnit": "Psilon Support Org1",
                "supportGroup": "Psilon Support Group1",
                "assignee": "gderuno",
                "description": 'description' + randomStr,
            }
            await apiHelper.apiLogin('gderuno');
            await apiHelper.createCaseTemplate(casetemplatePsilon);
        });
        it('[DRDMV-769]: Applying a Template to a Case with Franz', async () => {
            await navigationPage.gotoCreateCase();
            await createCasePo.selectRequester('Franz');
            await createCasePo.setSummary(casetemplatePetramco.templateName);
            await createCasePo.clickSelectCaseTemplateButton();
            await selectCasetemplateBladePo.selectCaseTemplate(casetemplatePetramco.templateName);
            await createCasePo.clickSaveCaseButton();
            await previewCasePo.clickGoToCaseButton();
            expect(await viewCasePo.getPriorityValue()).toBe('Low');
            expect(await viewCasePo.getCategoryTier1Value()).toBe('Purchasing Card');
            expect(await viewCasePo.getCategoryTier2Value()).toBe('Policies');
            expect(await viewCasePo.getCategoryTier3Value()).toBe('Card Issuance');
            expect(await viewCasePo.getAssignedCompanyText()).toBe('Petramco');
        });
        it('[DRDMV-769]: Applying a Template to a Case with qdu', async () => {
            await navigationPage.gotoCreateCase();
            await createCasePo.selectRequester('qdu');
            await createCasePo.setSummary(casetemplatePsilon.templateName);
            await createCasePo.clickSelectCaseTemplateButton();
            expect(await createCasePo.isTemplateNamePresent(casetemplatePsilon.templateName)).toBeFalsy();
            await selectCasetemplateBladePo.clickOnCancelButton();
        });
        it('[DRDMV-769]: [Case Creation] [Template Selection] Applying a Template to a Case', async () => {
            await navigationPage.signOut();
            await loginPage.login('gderuno');
            await navigationPage.gotoCreateCase();
            await createCasePo.selectRequester('Glit');
            await createCasePo.clickSelectCaseTemplateButton();
            await selectCasetemplateBladePo.selectCaseTemplate(casetemplatePsilon.templateName);
            await createCasePo.clickAssignToMeButton();
            await createCasePo.clickSaveCaseButton();
            await utilityCommon.closePopUpMessage();
            expect(await previewCasePo.isCaseTemplateDisplayed(casetemplatePsilon.templateName)).toBeTruthy("Template is not selected");
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
            let casetemplateData = {
                "templateName": 'caseTemplateName' + randomStr,
                "templateSummary": 'caseTemplateSummaryName' + randomStr,
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
            await createCasePo.setSummary(casetemplateData.templateSummary);
            await createCasePo.clickSelectCaseTemplateButton();
            await selectCasetemplateBladePo.selectCaseTemplate(casetemplateData.templateName);
            await createCasePo.clickSaveCaseButton();
            await previewCasePo.clickGoToCaseButton();
            expect(await viewCasePo.getCaseSummary()).toBe(casetemplateData.templateSummary);
            await navigationPage.signOut();
            await loginPage.login('gderuno');
            await navigationPage.gotoCreateCase();
            await createCasePo.selectRequester('Glit');
            await createCasePo.setSummary(casetemplateData.templateSummary);
            await createCasePo.clickSelectCaseTemplateButton();
            expect(await createCasePo.isTemplateNamePresent(casetemplateData.templateName)).toBeFalsy();
            await selectCasetemplateBladePo.clickOnCancelButton();
        } catch (e) {
            throw e;
        } finally {
            await navigationPage.signOut();
            await loginPage.login('qkatawazi');
        }
    });

    describe('[DRDMV-1216]: [Case Template] Create Case Template with all fields data populated', async () => {
        let casetemplatePetramco, randomStr = [...Array(5)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        beforeAll(async () => {
            casetemplatePetramco = {
                "templateName": 'caseTemplateName' + randomStr,
                "templateSummary": 'caseTemplateSummaryName' + randomStr,
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
                "description": 'description' + randomStr,
            }
            await apiHelper.apiLogin('fritz');
            await apiHelper.createCaseTemplate(casetemplatePetramco);
        });
        it('[DRDMV-1216]: Create Case Template with all fields', async () => {
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Case Management--Templates', 'Case Templates - Business Workflows');
            await utilGrid.searchAndOpenHyperlink(casetemplatePetramco.templateName);
            expect(await viewCaseTemplate.getAssigneeText()).toBe("Fritz Schulz");
            expect(await viewCaseTemplate.getCaseCompanyValue()).toBe("Petramco");
            expect(await viewCaseTemplate.getCaseTemplateNameValue()).toBe(casetemplatePetramco.templateName);
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
            await createCasePo.setSummary(casetemplatePetramco.templateName);
            await createCasePo.clickSelectCaseTemplateButton();
            await selectCasetemplateBladePo.selectCaseTemplate(casetemplatePetramco.templateName);
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
        it('[DRDMV-1215]: Checking change case template button for In Progress', async () => {
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
            expect(await editCasetemplatePo.allStatusOptionsPresent(statuses)).toBeTruthy('Status in dropdown does not match');
            await editCasetemplatePo.clickOnEditCaseTemplateMetadata();
            let templateStatuses: string[] = ["Draft", "Active", "Inactive"];
            expect(await editCasetemplatePo.allTemplateStatusOptionsPresent(templateStatuses)).toBeTruthy('Template Statuses does not match');
            await editCasetemplatePo.clickOnCancelTemplateMetaData();
            let priority: string[] = ["Critical", "High", "Medium", "Low"];
            expect(await editCasetemplatePo.allPriorityOptionsPresent(priority)).toBeTruthy('Priorities does not match');
            await editCasetemplatePo.changeCaseSummary('Updated Summary');
            await editCasetemplatePo.clickSaveCaseTemplate();
            await utilCommon.closePopUpMessage();
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
            let casetemplatePetramco = {
                "templateName": 'caseTemplateName' + randomStr,
                "templateSummary": 'caseTemplateSummaryName' + randomStr,
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
                "description": 'description' + randomStr,
            }
            await apiHelper.apiLogin('fritz');
            await apiHelper.createCaseTemplate(casetemplatePetramco);
            casetemplatePetramco.templateName = updatedCaseTemplateName;
            await apiHelper.createCaseTemplate(casetemplatePetramco);
        });
        it('[DRDMV-8965,DRDMV-8990]: Changing case template for new case status', async () => {
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
            await utilityCommon.closePopUpMessage();
            await utilityCommon.closePopUpMessage();
            expect(await viewCasePo.getPriorityValue()).toBe('Low');
            expect(await viewCasePo.getCaseStatusValue()).toContain('New');
            expect(await viewCasePo.getCategoryTier1Value()).toBe('Purchasing Card');
            expect(await viewCasePo.getCategoryTier2Value()).toBe('Policies');
            expect(await viewCasePo.getCategoryTier3Value()).toBe('Card Issuance');
            expect(await viewCasePo.getAssignedCompanyText()).toBe('Petramco');
            await viewCasePo.clickOnTab('Activity');
            await activityTabPo.clickOnRefreshButton();
            expect(await activityTabPo.isTextPresentInActivityLog(updatedCaseTemplateName)).toBeTruthy('TemplateText is not available');
            expect(await activityTabPo.isTextPresentInActivityLog('applied the template')).toBeTruthy('Applied Template text is not present');
            await navigationPage.gotoPersonProfile();
            expect(await activityTabPo.isTextPresentInActivityLog(updatedCaseTemplateName)).toBeTruthy("Template is not avilable on profile");
        });
    });

    describe('[DRDMV-9019]: [Case] [Template Selection] Changing case template for the case in Assigned Status', async () => {
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
                "description": 'description' + randomStr,
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
                "description": 'description' + randomStr,
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
        it('[DRDMV-9019]: Changing case template for the case in Assigned Status', async () => {
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
            expect(await viewCasePo.isCoreTaskPresent(taskTemplateName)).toBeTruthy('Core task is not present');
        });
        it('[DRDMV-9019]: [Case] [Template Selection] Changing case template for the case in Assigned Status', async () => {
            await viewCasePo.clickEditCaseButton();
            await editCasePo.clickOnChangeCaseTemplate();
            await selectCasetemplateBladePo.selectCaseTemplate(updatedCaseTemplateName);
            await editCasePo.clickSaveCase();
            await utilityCommon.closePopUpMessage();
            await utilityCommon.closePopUpMessage();
            expect(await viewCasePo.getPriorityValue()).toBe('Low');
            expect(await viewCasePo.getCaseStatusValue()).toContain('Assigned');
            expect(await viewCasePo.getCategoryTier1Value()).toBe('Purchasing Card');
            expect(await viewCasePo.getCategoryTier2Value()).toBe('Policies');
            expect(await viewCasePo.getCategoryTier3Value()).toBe('Card Issuance');
            expect(await viewCasePo.getAssignedCompanyText()).toBe('Petramco');
            expect(await viewCasePo.getAssigneeText()).toBe('Fritz Schulz');
            expect(await viewCasePo.getAssignedGroupText()).toBe('Facilities');
            await viewCasePo.clickOnTab('Activity');
            await activityTabPo.clickOnRefreshButton();
            expect(await activityTabPo.isTextPresentInActivityLog(updatedCaseTemplateName)).toBeTruthy('TemplateText is not available');
            expect(await activityTabPo.isTextPresentInActivityLog('applied the template')).toBeTruthy('Applied Template text is not present');
        });
        afterAll(async () => {
            await navigationPage.signOut();
            await loginPage.login('qkatawazi');
        });
    });

    describe('[DRDMV-9129]: [Negative Testing] - Verify permission for Case Agent from a different support group to edit case template.', async () => {
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
                "description": 'description' + randomStr,
            }
            await apiHelper.apiLogin('franz');
            await apiHelper.createCaseTemplate(casetemplatePetramco);
        });
        it('[DRDMV-9129]: Creating the Case with case template', async () => {
            await navigationPage.signOut();
            await loginPage.login('franz');
            await navigationPage.gotoCreateCase();
            await createCasePo.selectRequester('adam');
            await createCasePo.setSummary(caseTemplateName);
            await createCasePo.clickSelectCaseTemplateButton();
            await selectCasetemplateBladePo.selectCaseTemplate(caseTemplateName);
            await createCasePo.clickAssignToMeButton();
            await createCasePo.clickSaveCaseButton();
            await previewCasePo.clickGoToCaseButton();
            expect(await viewCasePo.getCaseSummary()).toBe(caseTemplateName);
        });
        it('[DRDMV-9129]: Login to CM with diffrent support group', async () => {
            await navigationPage.signOut();
            await loginPage.login('qdu');
            await navigationPage.gotoCaseConsole();
            await utilityGrid.clearFilter();
            await caseConsolePo.searchCase(caseTemplateName);
            expect(await caseConsolePo.isCaseSummaryPresent(caseTemplateName)).toBeFalsy("Case is present for diffrent company");
        });
        it('[DRDMV-9129]: [Negative Testing] - Verify permission for Case Agent from a different support group to edit case template.', async () => {
            await navigationPage.signOut();
            await loginPage.login('rrovnitov');
            await navigationPage.gotoCaseConsole();
            await utilityGrid.clearFilter();
            await caseConsolePo.searchCase(caseTemplateName);
            expect(await caseConsolePo.isCaseSummaryPresent(caseTemplateName)).toBeFalsy("Case is present for diffrent company");
        });
        afterAll(async () => {
            await navigationPage.signOut();
            await loginPage.login('qkatawazi');
        });
    });

    describe('[DRDMV-12581,DRDMV-12554]: Case Template access when owner group from different company is applied', async () => {
        let caseTemplateName: string = "TemplateName" + Math.floor(Math.random() * 100000);
        it('[DRDMV-12581,DRDMV-12554]: Checking change case template button for In Progress', async () => {
            await navigationPage.signOut();
            await loginPage.login(userData.userId+"@petramco.com", 'Password_1234');
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
        it('[DRDMV-12581,DRDMV-12554]: Checking change case template button for Resolved', async () => {
            await editCasetemplatePo.clickOnEditCaseTemplateMetadata();
            await editCasetemplatePo.changeOwnerCompanyValue('Psilon');
            await editCasetemplatePo.changeBusinessUnitDropdownValue("Psilon Support Org1");
            await editCasetemplatePo.changeOwnerGroupDropdownValue("Psilon Support Group1");
            await editCasetemplatePo.clickOnSaveCaseTemplateMetadata();
            expect(await viewCaseTemplate.getBuisnessUnitValue()).toContain("Psilon Support Org1");
            expect(await viewCaseTemplate.getOwnerGroupValue()).toContain("Psilon Support Group1");
            expect(await viewCaseTemplate.getOwnerCompanyValue()).toContain('Psilon');
        });
        it('[DRDMV-12581,DRDMV-12554]: Case Template access when owner group from different company is applied', async () => {
            await navigationPage.signOut();
            await loginPage.login('fritz');
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Case Management--Templates', 'Case Templates - Business Workflows');
            await utilGrid.searchAndOpenHyperlink(caseTemplateName);
            await viewCaseTemplate.clickOnEditCaseTemplateButton();
            expect(await editCasetemplatePo.isCaseSummaryReadOnly()).toBeTruthy('Case Summary is editable');
            expect(await editCasetemplatePo.isCaseCompanyDisabled()).toBeTruthy('Case Company is enabled');
        });
        afterAll(async () => {
            await navigationPage.signOut();
            await loginPage.login('fritz');
        });
    });

    describe('[DRDMV-1245]: [Case Template] Template status lifecycle', async () => {
        let templateDataDraft,randomStr = [...Array(5)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        let caseTemplateName = randomStr + 'Draft';
        beforeAll(async () => {
            templateDataDraft = {
                "templateName": caseTemplateName,
                "templateSummary": caseTemplateName,
                "templateStatus": "Active",
                "company": "Petramco",
                "businessUnit": "Facilities Support",
                "supportGroup": "Facilities",
                "assignee": "Fritz",
                "ownerBU": "Facilities Support",
                "ownerGroup": "Facilities",
                "categoryTier1": "Purchasing Card",
                "categoryTier2": "Policies",
                "categoryTier3": "Card Issuance",
                "casePriority": "Low",
                "caseStatus": "Assigned",
                "description": 'description' + randomStr,
            }
            await apiHelper.apiLogin('fritz');
            await apiHelper.createCaseTemplate(templateDataDraft);
        });
        it('[DRDMV-1245]: Case Agent checks for Active template & Consume it', async () => {
            await navigationPage.signOut();
            await loginPage.login('fritz');
            await navigationPage.gotoQuickCase();
            await quickCasePo.selectRequesterName('adam');
            await quickCasePo.selectCaseTemplate(templateDataDraft.templateName);
            await quickCasePo.createCaseButton();
            await quickCasePo.gotoCaseButton();
            expect(await viewCasePo.getCaseTemplateText()).toBe(templateDataDraft.templateName);
        });
        it('[DRDMV-1245]: [Case Template] Template status lifecycle', async () => {
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Case Management--Templates', 'Case Templates - Business Workflows');
            await utilGrid.searchAndOpenHyperlink(caseTemplateName);
            await viewCaseTemplate.clickOnEditCaseTemplateButton();
            expect(await editCasetemplatePo.isCaseCompanyDisabled()).toBeTruthy();
            expect(await editCasetemplatePo.isCaseSummaryReadOnly()).toBeTruthy();
            await viewCaseTemplate.clickEditTemplateMetaData();
            await editCasetemplatePo.changeTemplateStatusDropdownValue('Inactive');
            await editCasetemplatePo.clickOnSaveCaseTemplateMetadata();
            expect(await viewCaseTemplate.getTemplateStatusValue()).toBe('Inactive');
            await navigationPage.gotoQuickCase();
            await quickCasePo.selectRequesterName('adam');
            expect(await quickCasePo.selectCaseTemplate(caseTemplateName)).toBeFalsy('Inactive template is present');
        });
        it('[DRDMV-1245]: Case Agent checks for Draft template', async () => {
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Case Management--Templates', 'Case Templates - Business Workflows');
            await utilGrid.searchAndOpenHyperlink(caseTemplateName);
            await viewCaseTemplate.clickEditTemplateMetaData();
            await editCasetemplatePo.changeTemplateStatusDropdownValue('Draft');
            await editCasetemplatePo.clickOnSaveCaseTemplateMetadata();
            expect(await viewCaseTemplate.getTemplateStatusValue()).toBe('Draft');
            await navigationPage.gotoQuickCase();
            await quickCasePo.selectRequesterName('adam');
            expect(await quickCasePo.selectCaseTemplate(caseTemplateName)).toBeFalsy('Draft template is present');
        });
        afterAll(async () => {
            await navigationPage.signOut();
            await loginPage.login('qkatawazi');
        });
    })

    describe('[DRDMV-9130,DRDMV-9127]: [Negative Testing] - Verify permission for Case Manager from a different/same support group to edit case template.', async () => {
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
                "description": 'description' + randomStr,
            }
            await apiHelper.apiLogin('franz');
            await apiHelper.createCaseTemplate(casetemplatePetramco);
        });
        it('[DRDMV-9130,DRDMV-9127]: Creating the Case with case template', async () => {
            await navigationPage.signOut();
            await loginPage.login('franz');
            await navigationPage.gotoCreateCase();
            await createCasePo.selectRequester('adam');
            await createCasePo.setSummary(caseTemplateName);
            await createCasePo.clickSelectCaseTemplateButton();
            await selectCasetemplateBladePo.selectCaseTemplate(caseTemplateName);
            await createCasePo.clickAssignToMeButton();
            await createCasePo.clickSaveCaseButton();
            await previewCasePo.clickGoToCaseButton(); //popup 
            expect(await viewCasePo.getCaseSummary()).toBe(caseTemplateName);
        });
        it('[DRDMV-9130,DRDMV-9127]: Login to CA with diffrent support group', async () => {
            await navigationPage.signOut();
            await loginPage.login('qtao');
            await navigationPage.gotoCaseConsole();
            await utilityGrid.clearFilter();
            await caseConsolePo.searchCase(caseTemplateName);
            expect(await caseConsolePo.isCaseSummaryPresent(caseTemplateName)).toBeFalsy("Case is present for diffrent company");
        });
        it('[DRDMV-9130,DRDMV-9127]: Login to CA with diffrent company', async () => {
            await navigationPage.signOut();
            await loginPage.login('werusha');
            await navigationPage.gotoCaseConsole();
            await utilityGrid.clearFilter();
            await caseConsolePo.searchCase(caseTemplateName);
            expect(await caseConsolePo.isCaseSummaryPresent(caseTemplateName)).toBeFalsy("Case is present for diffrent company");
        });
        it('[DRDMV-9130,DRDMV-9127]: [Negative Testing] - Verify permission for Case Manager from a different/same support group to edit case template.', async () => {
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
        try {
            await navigationPage.signOut();
            await loginPage.login(userData.userId+"@petramco.com", 'Password_1234');
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
            expect(await viewCaseTemplate.getBuisnessUnitValue()).toContain("Psilon Support Org1");
            expect(await viewCaseTemplate.getOwnerGroupValue()).toContain("Psilon Support Group1");
            expect(await viewCaseTemplate.getOwnerCompanyValue()).toContain('Psilon');
        }
        catch (ex) { throw ex; }
        finally {
            await navigationPage.signOut();
            await loginPage.login('qkatawazi');
        }
    });

    it('[DRDMV-11979]:[Negative Testing] - Global as well as company specific flowset will list if we select specific company while creating case template.', async () => {
        await apiHelper.apiLogin('qkatawazi');
        let randomStr = [...Array(4)].map(i => (~~(Math.random() * 36)).toString(36)).join('');

        let flowsetMandatoryFieldsData = cloneDeep(flowsetMandatoryFields);
        flowsetMandatoryFieldsData.flowsetName = flowsetMandatoryFieldsData.flowsetName + randomStr;
        await apiHelper.createNewFlowset(flowsetMandatoryFieldsData);

        let flowsetGlobalFieldsData = cloneDeep(flowsetGlobalFields);
        flowsetGlobalFieldsData.flowsetName = flowsetGlobalFieldsData.flowsetName + randomStr;
        await apiHelper.createNewFlowset(flowsetGlobalFieldsData);

        await navigationPage.gotoSettingsPage();
        await navigationPage.gotoSettingsMenuItem('Case Management--Templates', 'Case Templates - Business Workflows');
        let caseTemplateName: string = MANDATORY_FIELD.templateName + Math.floor(Math.random() * 100000);
        MANDATORY_FIELD.templateName = caseTemplateName;
        await consoleCasetemplatePo.clickOnCreateCaseTemplateButton();
        await createCaseTemplate.setTemplateName(caseTemplateName);
        await createCaseTemplate.setCompanyName(ALL_FIELD.company);
        await createCaseTemplate.setCaseSummary(ALL_FIELD.templateSummary);
        await createCaseTemplate.setPriorityValue(ALL_FIELD.casePriority);
        await createCaseTemplate.setFlowsetValue(flowsetMandatoryFieldsData.flowsetName);
        await createCaseTemplate.clickSaveCaseTemplate();
        expect(await viewCaseTemplate.getFlowsetValue()).toBe(flowsetMandatoryFieldsData.flowsetName);
        await viewCaseTemplate.clickOnEditCaseTemplateButton();
        await editCasetemplatePo.changeFlowsetValue(flowsetGlobalFieldsData.flowsetName);
        await editCasetemplatePo.clickSaveCaseTemplate();
        expect(await viewCaseTemplate.getFlowsetValue()).toBe(flowsetGlobalFieldsData.flowsetName);
    });

    describe('[DRDMV-15245]: Verify case assignment method is not applicable if user changes the case template', async () => {
        let randomStr = [...Array(5)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        let caseTemplateName1 = 'caseTemplateNameCase1' + randomStr;
        let caseTemplateName2 = 'caseTemplateNameCase2' + randomStr;
        let caseTemplateName3 = 'caseTemplateNameCase3' + randomStr;
        let caseName = 'caseName' + randomStr;
        let newCase1, newCase2, newCase3, newCase4;
        beforeAll(async () => {
            let casetemplatePetramco1 = {
                "templateName": caseTemplateName1,
                "templateSummary": caseTemplateName1,
                "templateStatus": "Draft",
                "categoryTier1": "Purchasing Card",
                "categoryTier2": "Policies",
                "categoryTier3": "Card Issuance",
                "casePriority": "Low",
                "caseStatus": "New",
                "company": "Petramco",
                "businessUnit": "Facilities Support",
                "supportGroup": "Facilities",
                "ownerBU": "Facilities Support",
                "ownerGroup": "Facilities",
                "description": 'description' + randomStr,
            }
            let casetemplatePetramco2 = {
                "templateName": caseTemplateName2,
                "templateSummary": caseTemplateName2,
                "templateStatus": "Draft",
                "categoryTier1": "Purchasing Card",
                "categoryTier2": "Policies",
                "categoryTier3": "Card Issuance",
                "casePriority": "Low",
                "caseStatus": "New",
                "company": "Petramco",
                "businessUnit": "HR Support",
                "supportGroup": "Workforce Administration",
                "ownerBU": "Facilities Support",
                "ownerGroup": "Facilities",
                "description": 'description' + randomStr,
            }
            let casetemplatePetramco3 = {
                "templateName": caseTemplateName3,
                "templateSummary": caseTemplateName3,
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
                "description": 'description' + randomStr,
            }
            let caseData =
            {
                "Requester": "qtao",
                "Summary": caseName,
                "categoryTier1": "Purchasing Card",
                "categoryTier2": "Policies",
                "categoryTier3": "Card Issuance",
                "Assigned Company": "Petramco",
                "Business Unit": "United States Support",
                "Support Group": "US Support 3",
                "Assignee": "qkatawazi"
            }
            await apiHelper.apiLogin('qkatawazi');
            await apiHelper.createCaseTemplate(casetemplatePetramco1);
            await apiHelper.createCaseTemplate(casetemplatePetramco2);
            await apiHelper.createCaseTemplate(casetemplatePetramco3);
            newCase1 = await apiHelper.createCase(caseData);
            newCase2 = await apiHelper.createCase(caseData);
            newCase3 = await apiHelper.createCase(caseData);
            newCase4 = await apiHelper.createCase(caseData);
        });
        it('[DRDMV-15245]: Adding methods to case template', async () => {
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Case Management--Templates', 'Case Templates - Business Workflows');
            await utilGrid.searchAndOpenHyperlink(caseTemplateName1);
            await viewCaseTemplate.clickOnEditCaseTemplateButton();
            await editCasetemplatePo.changeAssignmentMethodValue('Round Robin');
            await editCasetemplatePo.clickSaveCaseTemplate();
            await viewCaseTemplate.clickEditTemplateMetaData();
            await editCasetemplatePo.changeTemplateStatusDropdownValue('Active');
            await editCasetemplatePo.clickOnSaveCaseTemplateMetadata();
            await utilCommon.clickOnBackArrow();
            await utilGrid.searchAndOpenHyperlink(caseTemplateName2);
            await viewCaseTemplate.clickOnEditCaseTemplateButton();
            await editCasetemplatePo.changeAssignmentMethodValue('Round Robin');
            await editCasetemplatePo.clickSaveCaseTemplate();
            await viewCaseTemplate.clickEditTemplateMetaData();
            await editCasetemplatePo.changeTemplateStatusDropdownValue('Active');
            await editCasetemplatePo.clickOnSaveCaseTemplateMetadata();
        });
        it('[DRDMV-15245]: Verify case assignment method is not applicable if user changes the case template', async () => {
            await navigationPage.gotoCaseConsole();
            await caseConsolePo.searchAndOpenCase(newCase1.displayId);
            expect(await viewCasePo.getAssigneeText()).toBe("Qadim Katawazi");
            await viewCasePo.clickEditCaseButton();
            await editCasePo.clickOnSelectCaseTemplate();
            await selectCasetemplateBladePo.selectCaseTemplate(caseTemplateName1);
            await editCasePo.clickSaveCase();
            await utilityCommon.closePopUpMessage();
            // verify support Group w.r.t template1 should be applied any assignee, as round robin assignement method
            expect(await viewCasePo.isAssigneeNameDisplayed()).toBeTruthy();
            expect(await viewCasePo.getAssignedGroupText()).toBe('Facilities');
            expect(await viewCasePo.getBusinessUnitText()).toBe('Facilities Support');
        });
        it('[DRDMV-15245]: Verify case assignment method is not applicable if user changes the case template', async () => {
            await navigationPage.gotoCaseConsole();
            await caseConsolePo.searchAndOpenCase(newCase2.displayId);
            expect(await viewCasePo.getAssigneeText()).toBe("Qadim Katawazi");
            await viewCasePo.clickEditCaseButton();
            await editCasePo.clickOnSelectCaseTemplate();
            await selectCasetemplateBladePo.selectCaseTemplate(caseTemplateName1);
            await editCasePo.clickSaveCase();
            expect(await viewCasePo.isAssigneeNameDisplayed()).toBeTruthy();
            expect(await viewCasePo.getAssignedGroupText()).toBe('Facilities');
            expect(await viewCasePo.getBusinessUnitText()).toBe('Facilities Support');
            await viewCasePo.clickEditCaseButton();
            await editCasePo.clickOnChangeCaseTemplate();
            await selectCasetemplateBladePo.selectCaseTemplate(caseTemplateName2);
            await editCasePo.clickSaveCase();
            await utilityCommon.closePopUpMessage();
            // verify support Group w.r.t template2 should be applied any assignee, as round robin assignement method
            expect(await viewCasePo.isAssigneeNameDisplayed()).toBeTruthy();
            expect(await viewCasePo.getAssignedGroupText()).toBe('Workforce Administration');
            expect(await viewCasePo.getBusinessUnitText()).toBe('HR Support');
        });
        it('[DRDMV-15245]: Verify case assignment method is not applicable if user changes the case template', async () => {
            await navigationPage.gotoCaseConsole();
            await caseConsolePo.searchAndOpenCase(newCase3.displayId);
            expect(await viewCasePo.getAssigneeText()).toBe("Qadim Katawazi");
            await viewCasePo.clickEditCaseButton();
            await editCasePo.clickOnSelectCaseTemplate();
            await selectCasetemplateBladePo.selectCaseTemplate(caseTemplateName2);
            await editCasePo.clickSaveCase();
            expect(await viewCasePo.isAssigneeNameDisplayed()).toBeTruthy();
            expect(await viewCasePo.getAssignedGroupText()).toBe('Workforce Administration');
            expect(await viewCasePo.getBusinessUnitText()).toBe('HR Support');
            await viewCasePo.clickEditCaseButton();
            await editCasePo.clickOnChangeCaseTemplate();
            await selectCasetemplateBladePo.selectCaseTemplate(caseTemplateName3);
            await editCasePo.clickSaveCase();
            await utilityCommon.closePopUpMessage();
            // verify support Group w.r.t template3 should be applied assignee, as none assignement method
            expect(await viewCasePo.getAssigneeText()).toBe('Fritz Schulz');
            expect(await viewCasePo.getAssignedGroupText()).toBe('Facilities');
            expect(await viewCasePo.getBusinessUnitText()).toBe('Facilities Support');
        });
        it('[DRDMV-15245]: Verify case assignment method is not applicable if user changes the case template', async () => {
            await navigationPage.gotoCaseConsole();
            await caseConsolePo.searchAndOpenCase(newCase4.displayId);
            expect(await viewCasePo.getAssigneeText()).toBe("Qadim Katawazi");
            await viewCasePo.clickEditCaseButton();
            await editCasePo.clickOnSelectCaseTemplate();
            await selectCasetemplateBladePo.selectCaseTemplate(caseTemplateName3);
            await editCasePo.clickSaveCase();
            expect(await viewCasePo.getAssigneeText()).toBe('Fritz Schulz');
            expect(await viewCasePo.getAssignedGroupText()).toBe('Facilities');
            expect(await viewCasePo.getBusinessUnitText()).toBe('Facilities Support');
            await viewCasePo.clickEditCaseButton();
            await editCasePo.clickOnChangeCaseTemplate();
            await selectCasetemplateBladePo.selectCaseTemplate(caseTemplateName2);
            await editCasePo.clickSaveCase();
            await utilityCommon.closePopUpMessage();
            // verify support Group w.r.t template2 should be applied any assignee, as round robin assignement method
            expect(await viewCasePo.isAssigneeNameDisplayed()).toBeTruthy();
            expect(await viewCasePo.getAssignedGroupText()).toBe('Workforce Administration');
            expect(await viewCasePo.getBusinessUnitText()).toBe('HR Support');
        });
        afterAll(async () => {
            await utilityCommon.closeAllBlades();
            await navigationPage.signOut();
            await loginPage.login('fritz');
        });
    });

    describe('[DRDMV-19741]: [RESOLVE_CASE_ON_LAST_TASK_COMPLETION] - Case behavior when Case Template is changed', async () => {
        let caseId,caseId1, randomStr = [...Array(5)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        let caseTemplateName = 'caseTemplateName' + randomStr;
        let casTemplateSummary = 'CaseSummaryName' + randomStr;
        let caseTemplateNameWithNoValue = 'caseTemplateWithNoResolve' + randomStr;
        let caseTemplateSummaryNoValue = 'CaseSummaryNoResolved' + randomStr;
        let manualTask = 'ManualTaskTemp' + randomStr;
        let ManualTaskTempSummary = 'ManualTaskSumm' + randomStr;
        beforeAll(async () => {
            let templateDataSetYes = {
                "templateName": `${caseTemplateName}`,
                "templateSummary": `${casTemplateSummary}`,
                "templateStatus": "Active",
                "company": "Petramco",
                "resolveCaseonLastTaskCompletion": "1",
                "businessUnit": "Facilities Support",
                "supportGroup": "Facilities",
                "assignee": "Fritz",
                "ownerBusinessUnit": "Facilities Support",
                "ownerGroup": "Facilities"
            }
            let templateDataSetNO = {
                "templateName": `${caseTemplateNameWithNoValue}`,
                "templateSummary": `${caseTemplateSummaryNoValue}`,
                "templateStatus": "Active",
                "company": "Petramco",
                "resolveCaseonLastTaskCompletion": "0",
                "businessUnit": "Facilities Support",
                "supportGroup": "Facilities",
                "assignee": "Fritz",
                "ownerBusinessUnit": "Facilities Support",
                "ownerGroup": "Facilities"
            }
            let taskTemplateData = {
                "templateName": `${manualTask}`,
                "templateSummary": `${ManualTaskTempSummary}`,
                "templateStatus": "Active",
                "taskCompany": "Petramco",
                "ownerCompany": "Petramco",
                "ownerBusinessUnit": "Facilities Support",
                "ownerGroup": "Facilities",
                "supportGroup": "Facilities",
                "assignee": "Fritz"
            }
            await apiHelper.apiLogin('fritz');
            let manualTaskTemplateOne = await apiHelper.createManualTaskTemplate(taskTemplateData);

            let newCaseTemplate1 = await apiHelper.createCaseTemplate(templateDataSetYes);
            let newCaseTemplate2 = await apiHelper.createCaseTemplate(templateDataSetNO);
            await apiHelper.associateCaseTemplateWithOneTaskTemplate(newCaseTemplate1.displayId, manualTaskTemplateOne.displayId);
            await apiHelper.associateCaseTemplateWithOneTaskTemplate(newCaseTemplate2.displayId, manualTaskTemplateOne.displayId);

            let caseData = {
                "Requester": "qkatawazi",
                "Summary": "All Categories selected",
                "Origin": "Agent",
                "Case Template ID": newCaseTemplate1.displayId,
            }
            let caseData1 = {
                "Requester": "qkatawazi",
                "Summary": "All Categories selected",
                "Origin": "Agent",
                "Case Template ID": newCaseTemplate2.displayId,
            }
           caseId= await apiHelper.createCase(caseData);
           caseId1= await apiHelper.createCase(caseData1);
        });
        it('[DRDMV-19741]: Case behavior when Case Template is changed', async () => {
            await navigationPage.gotoCaseConsole();
            await utilityGrid.searchAndOpenHyperlink(caseId1.displayId);
            await updateStatusBladePo.changeCaseStatus('In Progress');
            await updateStatusBladePo.clickSaveStatus('In Progress');
        });
        it('[DRDMV-19741]: Case behavior when Case Template is changed', async () => {
            await viewCasePo.openTaskCard(1);
            await manageTaskBladePo.clickTaskLink(ManualTaskTempSummary);
            await viewTaskPo.clickOnChangeStatus();
            await viewTaskPo.changeTaskStatus('Completed');
            await updateStatusBladePo.setStatusReason('Successful');
            await updateStatusBladePo.clickSaveStatus();
            await utilityCommon.closePopUpMessage();
            await viewTaskPo.clickOnViewCase();
            expect(await viewCasePo.getCaseStatusValue()).toContain('In Progress');
        });
        it('[DRDMV-19741]: Case behavior when Case Template is changed', async () => {
            await navigationPage.gotoCaseConsole();
            await utilityGrid.searchAndOpenHyperlink(caseId.displayId);
            await updateStatusBladePo.changeCaseStatus('In Progress');
            await updateStatusBladePo.clickSaveStatus('In Progress');
        });
        it('[DRDMV-19741]: [RESOLVE_CASE_ON_LAST_TASK_COMPLETION] - Case behavior when Case Template is changed', async () => {
            await viewCasePo.openTaskCard(1);
            await manageTaskBladePo.clickTaskLink(ManualTaskTempSummary);
            await viewTaskPo.clickOnChangeStatus();
            await viewTaskPo.changeTaskStatus('Completed');
            await updateStatusBladePo.setStatusReason('Successful');
            await updateStatusBladePo.clickSaveStatus();
            await utilityCommon.closePopUpMessage();
            await viewTaskPo.clickOnViewCase();
            expect(await viewCasePo.getCaseStatusValue()).toContain('Resolved');
        });
    });
});
