import changeAssignmentPo from '../../pageobject/common/change-assignment.po';
import { cloneDeep } from 'lodash';
import { browser } from "protractor";
import apiHelper from '../../api/api.helper';
import { ALL_FIELD, MANDATORY_FIELD } from '../../data/ui/case/casetemplate.data.ui';
import { flowsetGlobalFields, flowsetMandatoryFields } from '../../data/ui/flowset/flowset.ui';
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
import { BWF_BASE_URL, BWF_PAGE_TITLES } from '../../utils/constants';
import utilityCommon from '../../utils/utility.common';
import utilityGrid from '../../utils/utility.grid';
import casePreviewPo from '../../pageobject/case/case-preview.po';

describe('Case Template', () => {
    beforeAll(async () => {
        await browser.get(BWF_BASE_URL);
        await loginPage.login("qkatawazi");
    });

    afterAll(async () => {
        await utilityCommon.closeAllBlades();
        await navigationPage.signOut();
    });

    //ptidke
    describe('[5245,5242]: Case Template creation with Template validation as OPTIONAL using BA login', async () => {
        it('[5245,5242]: Case Template creation with Template validation as OPTIONAL using BA login', async () => {
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Case Management--Templates', BWF_PAGE_TITLES.CASE_MANAGEMENT.TEMPLATES);
            ALL_FIELD.templateName = ALL_FIELD.templateName + Math.floor(Math.random() * 100000);
            await consoleCasetemplatePo.clickOnCreateCaseTemplateButton();
            await createCaseTemplate.setTemplateName(ALL_FIELD.templateName);
            await createCaseTemplate.setCompanyName(ALL_FIELD.company);
            await createCaseTemplate.setCaseSummary(ALL_FIELD.templateSummary);
            await createCaseTemplate.setPriorityValue(ALL_FIELD.casePriority);
            await createCaseTemplate.setOwnerCompanyValue('Petramco');
            await createCaseTemplate.setOwnerOrgDropdownValue(ALL_FIELD.ownerBusinessUnit);
            await createCaseTemplate.setOwnerGroupDropdownValue(ALL_FIELD.ownerGroup);
            await createCaseTemplate.setTemplateStatusDropdownValue(ALL_FIELD.templateStatus);
            await createCaseTemplate.setIdentityValidationValue(ALL_FIELD.identityValidation);
            await createCaseTemplate.clickSaveCaseTemplate();
            expect(await viewCaseTemplate.getCaseTemplateNameValue()).toContain(ALL_FIELD.templateName);
            expect(await viewCaseTemplate.getIdentityValdationValue()).toContain(ALL_FIELD.identityValidation);
        });
        afterAll(async () => {
            await viewCaseTemplate.clickBackArrowBtn();
        });
    });

    //ptidke
    it('[5240]: Case Template update with Template validation as ENFORCED', async () => {
        await navigationPage.gotoSettingsPage();
        await navigationPage.gotoSettingsMenuItem('Case Management--Templates', BWF_PAGE_TITLES.CASE_MANAGEMENT.TEMPLATES);
        ALL_FIELD.templateName = ALL_FIELD.templateName + Math.floor(Math.random() * 100000);
        await consoleCasetemplatePo.clickOnCreateCaseTemplateButton();
        await createCaseTemplate.setTemplateName(ALL_FIELD.templateName);
        await createCaseTemplate.setCompanyName(ALL_FIELD.company);
        await createCaseTemplate.setCaseSummary(ALL_FIELD.templateSummary);
        await createCaseTemplate.setPriorityValue(ALL_FIELD.casePriority);
        await createCaseTemplate.setOwnerOrgDropdownValue(ALL_FIELD.ownerBusinessUnit);
        await createCaseTemplate.setOwnerGroupDropdownValue(ALL_FIELD.ownerGroup);
        await createCaseTemplate.setTemplateStatusDropdownValue(ALL_FIELD.templateStatus);
        await createCaseTemplate.setIdentityValidationValue(ALL_FIELD.identityValidation);
        await createCaseTemplate.clickSaveCaseTemplate();
        expect(await viewCaseTemplate.getCaseTemplateNameValue()).toContain(ALL_FIELD.templateName);
        expect(await viewCaseTemplate.getIdentityValdationValue()).toContain(ALL_FIELD.identityValidation);
        await editCasetemplatePo.clickOnEditCaseTemplateMetadata();
        await editCasetemplatePo.changeTemplateStatusDropdownValue('Draft');
        await editCasetemplatePo.clickOnSaveCaseTemplateMetadata();
        await utilityCommon.closePopUpMessage();
        await editCasetemplatePo.clickEditCaseTemplate();
        await editCasetemplatePo.changeIdentityValidationValue('Enforced');
        await editCasetemplatePo.clickSaveCaseTemplate();
        expect(await viewCaseTemplate.getIdentityValdationValue()).toContain('Enforced');
        await viewCaseTemplate.clickBackArrowBtn();
    });

    //ptidke-Facilities support value not getting selected-temp fix defect -DRDMV-25256
    describe('[5247]: Case Template creation with Template validation as ENFORCED', async () => {
        it('[5247]: Case Template creation with Template validation as ENFORCED', async () => {
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Case Management--Templates', BWF_PAGE_TITLES.CASE_MANAGEMENT.TEMPLATES);
            ALL_FIELD.templateName = ALL_FIELD.templateName + Math.floor(Math.random() * 100000);
            await consoleCasetemplatePo.clickOnCreateCaseTemplateButton();
            await createCaseTemplate.setTemplateName(ALL_FIELD.templateName);
            await createCaseTemplate.setCompanyName(ALL_FIELD.company);
            await createCaseTemplate.setCaseSummary(ALL_FIELD.templateSummary);
            await createCaseTemplate.setPriorityValue(ALL_FIELD.casePriority);
            await createCaseTemplate.setOwnerCompanyValue('Petramco');
            await createCaseTemplate.setOwnerOrgDropdownValue(ALL_FIELD.ownerBusinessUnit);
            await createCaseTemplate.setOwnerGroupDropdownValue(ALL_FIELD.ownerGroup);
            await createCaseTemplate.setTemplateStatusDropdownValue(ALL_FIELD.templateStatus);
            await createCaseTemplate.setIdentityValidationValue('Enforced');
            await createCaseTemplate.clickSaveCaseTemplate();
            expect(await viewCaseTemplate.getCaseTemplateNameValue()).toContain(ALL_FIELD.templateName);
            expect(await viewCaseTemplate.getIdentityValdationValue()).toContain('Enforced');
            await viewCaseTemplate.clickBackArrowBtn();
        });
        it('[5247]: create same name record in same LOB', async () => {
            //create same name record in same LOB
            await navigationPage.signOut();
            await loginPage.login('jbarnes');
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Case Management--Templates', BWF_PAGE_TITLES.CASE_MANAGEMENT.TEMPLATES);
            await utilityGrid.selectLineOfBusiness('Human Resource');
            await consoleCasetemplatePo.clickOnCreateCaseTemplateButton();
            await createCaseTemplate.setTemplateName(ALL_FIELD.templateName);
            await createCaseTemplate.setCompanyName(ALL_FIELD.company);
            await createCaseTemplate.setCaseSummary(ALL_FIELD.templateSummary);
            await createCaseTemplate.clickSaveCaseTemplate();
            expect(await utilityCommon.isPopUpMessagePresent('The Template Name already exists. Please select a different name.')).toBeTruthy("Error message absent");
            await createCaseTemplate.clickOnCancelButton();
            await utilityCommon.clickOnApplicationWarningYesNoButton("Yes");
            await utilityCommon.closePopUpMessage();
        });
        it('[5247]: create same name record in different LOB', async () => {
            //create same name record in different LOB
            await utilityGrid.selectLineOfBusiness('Facilities');
            await consoleCasetemplatePo.clickOnCreateCaseTemplateButton();
            await createCaseTemplate.setTemplateName(ALL_FIELD.templateName);
            await createCaseTemplate.setCaseSummary(ALL_FIELD.templateSummary);
            await createCaseTemplate.setCompanyName(ALL_FIELD.company);
            // verify categ1, BU and SG as per LOB
            await utilityCommon.isAllDropDownValuesMatches(createCaseTemplate.selectors.caseCategoryTier1Guid, ['Applications', 'Facilities', 'Fixed Assets', 'Phones', 'Projectors', 'Purchasing Card']);
            await createCaseTemplate.setOwnerCompanyValue(ALL_FIELD.ownerCompany);
            await utilityCommon.isAllDropDownValuesMatches(createCaseTemplate.selectors.ownerOrgDropdown, ['Facilities', 'Facilities Support']);
            await createCaseTemplate.setOwnerCompanyValue(ALL_FIELD.ownerCompany);
            await createCaseTemplate.setOwnerOrgDropdownValue('Facilities'); //temp fix
            await utilityCommon.isAllDropDownValuesMatches(createCaseTemplate.selectors.ownerGroupDropdown, ['Facilities', 'Pantry Service']);
            await createCaseTemplate.setOwnerOrgDropdownValue('Facilities');  //temp fix
            await createCaseTemplate.setOwnerGroupDropdownValue('Facilities'); 
            await changeAssignmentPo.isAllValuePresentInDropDown('AssignedGroup', ['Facilities', 'Pantry Service']);
            await changeAssignmentPo.setDropDownValue('AssignedGroup', 'Facilities');
            // verify LOB is there
            expect(await createCaseTemplate.getLobValue()).toBe("Facilities");
            await createCaseTemplate.clickSaveCaseTemplate();
            expect(await utilityCommon.isPopUpMessagePresent('Saved successfully.')).toBeTruthy("Success message absent");
            // open the record and verify LOB is on edit screen
            await viewCaseTemplate.clickBackArrowBtn();
            await consoleCasetemplatePo.searchAndClickOnCaseTemplate(ALL_FIELD.templateName);
            expect(await viewCaseTemplate.getLobValue()).toBe("Facilities");
            await viewCaseTemplate.clickBackArrowBtn();
            await utilityGrid.selectLineOfBusiness('Human Resource');
        });
        afterAll(async () => {
            await utilityCommon.closeAllBlades();
            await navigationPage.signOut();
            await loginPage.login("qkatawazi");
        });
    });

    //ptidke
    it('[5243]: Case Template creation with Template validation as NONE', async () => {
        await navigationPage.gotoSettingsPage();
        await navigationPage.gotoSettingsMenuItem('Case Management--Templates', BWF_PAGE_TITLES.CASE_MANAGEMENT.TEMPLATES);
        ALL_FIELD.templateName = ALL_FIELD.templateName + Math.floor(Math.random() * 100000);
        await consoleCasetemplatePo.clickOnCreateCaseTemplateButton();
        await createCaseTemplate.setTemplateName(ALL_FIELD.templateName);
        await createCaseTemplate.setCompanyName(ALL_FIELD.company);
        await createCaseTemplate.setCaseSummary(ALL_FIELD.templateSummary);
        await createCaseTemplate.setPriorityValue(ALL_FIELD.casePriority);
        await createCaseTemplate.setOwnerCompanyValue('Petramco');
        await createCaseTemplate.setOwnerOrgDropdownValue(ALL_FIELD.ownerBusinessUnit);
        await createCaseTemplate.setOwnerGroupDropdownValue(ALL_FIELD.ownerGroup);
        await createCaseTemplate.setTemplateStatusDropdownValue(ALL_FIELD.templateStatus);
        await createCaseTemplate.setIdentityValidationValue('None');
        await createCaseTemplate.clickSaveCaseTemplate();
        expect(await viewCaseTemplate.getCaseTemplateNameValue()).toContain(ALL_FIELD.templateName);
        expect(await viewCaseTemplate.getIdentityValdationValue()).toContain('None');
        await viewCaseTemplate.clickBackArrowBtn();
    });

    //ptidke
    it('[5244]: Case Template NOT created with Template validation as OPTIONAL using Case Agent login', async () => {
        try {
            await navigationPage.signOut();
            await loginPage.login('franz');
            await navigationPage.gotoSettingsPage();
            expect(await navigationPage.isSettingPanelTextMatches(" No matches found ")).toBeTruthy();
        } catch (e) {
            throw e;
        } finally {
            await navigationPage.signOut();
            await loginPage.login('qkatawazi');
        }
    });

    //ptidke
    it('[4549]: Verify the values present in the Case assignment method dropdownlist-Round Robin and None', async () => {
        await navigationPage.gotoSettingsPage();
        await navigationPage.gotoSettingsMenuItem('Case Management--Templates', BWF_PAGE_TITLES.CASE_MANAGEMENT.TEMPLATES);
        ALL_FIELD.templateName = ALL_FIELD.templateName + Math.floor(Math.random() * 100000);
        await consoleCasetemplatePo.clickOnCreateCaseTemplateButton();
        await createCaseTemplate.setTemplateName(ALL_FIELD.templateName);
        await createCaseTemplate.setCompanyName(ALL_FIELD.company);
        await createCaseTemplate.setCaseSummary(ALL_FIELD.templateSummary);
        await createCaseTemplate.setPriorityValue(ALL_FIELD.casePriority);
        expect(await copyCasetemplatePo.getValueOfAssignementMethod()).toContain('None');
        await createCaseTemplate.setOwnerCompanyValue('Petramco');
        await createCaseTemplate.setOwnerOrgDropdownValue(ALL_FIELD.ownerBusinessUnit);
        await createCaseTemplate.setOwnerGroupDropdownValue(ALL_FIELD.ownerGroup);
        await createCaseTemplate.setAssignmentMethodValue("Round");
        expect(await copyCasetemplatePo.getValueOfAssignementMethod()).toContain("Round Robin");
        await createCaseTemplate.setTemplateStatusDropdownValue('Draft')
        await createCaseTemplate.clickSaveCaseTemplate();
        await editCasetemplatePo.clickEditCaseTemplate();
        await editCasetemplatePo.changeAssignmentMethodValue('None');
        expect(await editCasetemplatePo.getValueOfAssignmentMethod()).toContain('None');
        await editCasetemplatePo.changeAssignmentMethodValue("Round");
        expect(await editCasetemplatePo.getValueOfAssignmentMethod()).toContain("Round Robin");
        await editCasetemplatePo.clickSaveCaseTemplate();
        await viewCaseTemplate.clickBackArrowBtn();
    });

    //ptidke
    it('[4548]: Verify Case assignment method is set to None by default in a New/already existing Case template', async () => {
        await navigationPage.gotoSettingsPage();
        await navigationPage.gotoSettingsMenuItem('Case Management--Templates', BWF_PAGE_TITLES.CASE_MANAGEMENT.TEMPLATES);
        ALL_FIELD.templateName = ALL_FIELD.templateName + Math.floor(Math.random() * 100000);
        await consoleCasetemplatePo.clickOnCreateCaseTemplateButton();
        await createCaseTemplate.setTemplateName(ALL_FIELD.templateName);
        await createCaseTemplate.setCompanyName(ALL_FIELD.company);
        await createCaseTemplate.setCaseSummary(ALL_FIELD.templateSummary);
        await createCaseTemplate.setPriorityValue(ALL_FIELD.casePriority);
        expect(await copyCasetemplatePo.getValueOfAssignementMethod()).toContain('None');
        await createCaseTemplate.setOwnerCompanyValue('Petramco');
        await createCaseTemplate.setOwnerOrgDropdownValue(ALL_FIELD.ownerBusinessUnit);
        await createCaseTemplate.setOwnerGroupDropdownValue(ALL_FIELD.ownerGroup);
        await createCaseTemplate.setTemplateStatusDropdownValue('Draft')
        await createCaseTemplate.clickSaveCaseTemplate();
        await editCasetemplatePo.clickEditCaseTemplate();
        expect(await editCasetemplatePo.getValueOfAssignmentMethod()).toContain('None');
        await editCasetemplatePo.clickSaveCaseTemplate();
        await viewCaseTemplate.clickBackArrowBtn();
    });

    //ptidke-issue-clear 
    describe('[6303]: [Edit Case Template] Template metadata edit', async () => {
        let templateData;
        beforeAll(async () => {
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Case Management--Templates', BWF_PAGE_TITLES.CASE_MANAGEMENT.TEMPLATES);
            const randomStr = Math.floor(Math.random() * 100000);
            templateData = {
                "templateName": MANDATORY_FIELD.templateName + randomStr,
                "templateSummary": MANDATORY_FIELD.templateSummary + randomStr,
                "caseStatus": "InProgress",
                "templateStatus": "Active",
                "company": "Petramco",
                "ownerBU": 'United States Support',
                "ownerGroup": "US Support 3",
            }
            await apiHelper.apiLogin('qkatawazi');
            await apiHelper.createCaseTemplate(templateData);
        });
        it('[6303]: [Edit Case Template] Template metadata edit', async () => {
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Case Management--Templates', BWF_PAGE_TITLES.CASE_MANAGEMENT.TEMPLATES);
            await utilityGrid.searchAndOpenHyperlink(templateData.templateName);
            await editCasetemplatePo.clickOnEditCaseTemplateMetadata();
            await editCasetemplatePo.changeBusinessUnitDropdownValue(MANDATORY_FIELD.ownerBusinessUnit);
            await editCasetemplatePo.changeOwnerGroupDropdownValue(MANDATORY_FIELD.ownerGroup);
            await editCasetemplatePo.changeTemplateStatusDropdownValue('Draft');
            await editCasetemplatePo.clickOnSaveCaseTemplateMetadata();
            await viewCaseTemplate.clickBackArrowBtn();
        });
        it('[6303]: [Edit Case Template] Template metadata edit', async () => {
            await consoleCasetemplatePo.clickOnCreateCaseTemplateButton();
            await createCaseTemplate.clickSaveCaseTemplate();
            expect(await utilityCommon.isPopUpMessagePresent('Resolve the field validation errors and then try again.')).toBeTruthy();
            await createCaseTemplate.clickOnCancelButton();
            await utilityCommon.clickOnApplicationWarningYesNoButton("Yes");
            await utilityGrid.searchAndOpenHyperlink(templateData.templateName);
            await viewCaseTemplate.clickOnEditCaseTemplateButton();
            await editCasetemplatePo.changeCaseSummary('Updated Summary');
            await editCasetemplatePo.clickSaveCaseTemplate();
            await editCasetemplatePo.clickOnEditCaseTemplateMetadata();
            await editCasetemplatePo.changeTemplateStatusDropdownValue('Active');
            await editCasetemplatePo.clickOnSaveCaseTemplateMetadata();
            await utilityCommon.closePopUpMessage();
            await viewCaseTemplate.clickBackArrowBtn();
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Case Management--Templates', BWF_PAGE_TITLES.CASE_MANAGEMENT.TEMPLATES);
            await utilityGrid.searchAndOpenHyperlink(templateData.templateName);
            expect(await viewCaseTemplate.getOwnerGroupValue()).toContain(MANDATORY_FIELD.ownerGroup);
            expect(await viewCaseTemplate.getOwnerCompanyValue()).toContain('Petramco');
            expect(await viewCaseTemplate.getTemplateStatusValue()).toContain(MANDATORY_FIELD.templateStatus);
        });
        afterAll(async () => {
            await viewCaseTemplate.clickBackArrowBtn();
            await utilityCommon.closeAllBlades();
        });
    });

    //ptidke
    it('[6305]: [Case Template Console] Search by Summary and Display ID on the Case Template Console', async () => {
        await navigationPage.gotoSettingsPage();
        await navigationPage.gotoSettingsMenuItem('Case Management--Templates', BWF_PAGE_TITLES.CASE_MANAGEMENT.TEMPLATES);
        let randomStr = [...Array(5)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        let templateData = {
            "templateName": 'caseTemplateName' + randomStr,
            "templateSummary": 'CaseSummaryName' + randomStr,
            "caseStatus": "InProgress",
            "templateStatus": "Active",
            "company": "Petramco",
            "businessUnit": "United States Support",
            "supportGroup": "US Support 3",
            "assignee": "qkatawazi",
            "ownerBU": 'United States Support',
            "ownerGroup": "US Support 3",
        }
        await apiHelper.apiLogin('qkatawazi');
        let newCaseTemplate = await apiHelper.createCaseTemplate(templateData);
        let column1: string[] = ["Display ID"];
        await consoleCasetemplatePo.addColumnOnGrid(column1);
        await utilityGrid.searchRecord(newCaseTemplate.displayId);
        expect(await consoleCasetemplatePo.getFirstRecordValue("Display ID")).toContain(newCaseTemplate.displayId);
        await consoleCasetemplatePo.clickOnClearSearchIcon();
        expect(await consoleCasetemplatePo.moreRecordsArePresentAfterClear()).toBeGreaterThan(7);
        await utilityGrid.searchRecord(templateData.templateName);
        expect(await consoleCasetemplatePo.getFirstRecordValue("Template Name")).toContain(templateData.templateName);
        await consoleCasetemplatePo.clickOnClearSearchIcon();
        expect(await consoleCasetemplatePo.moreRecordsArePresentAfterClear()).toBeGreaterThan(7);
        await utilityGrid.searchRecord('xyzsdasdlkdasd');
        expect(await consoleCasetemplatePo.moreRecordsArePresentAfterClear()).toBeLessThanOrEqual(0);
        await consoleCasetemplatePo.removeColumnFromGrid(column1);
    });

    //ptidke-check-quick case issue-passing on CICD
    it('[4940]: Case Agent from owner company can create a case using the template', async () => {
        try {
            let randomStr = [...Array(5)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
            let templateData = {
                "templateName": 'QuickCaseTemplate' + randomStr,
                "templateSummary": 'QuickCaseSummaryTemplate' + randomStr,
                "caseStatus": "InProgress",
                "templateStatus": "Active",
                "company": "Petramco",
                "businessUnit": "United States Support",
                "supportGroup": "US Support 3",
                "assignee": "qkatawazi",
                "ownerCompany": "Petramco",
                "ownerBU": "United States Support",
                "ownerGroup": "US Support 3",
                "description": 'description' + randomStr
            }
            await apiHelper.apiLogin('qkatawazi');
            await apiHelper.createCaseTemplate(templateData);
            await navigationPage.signOut();
            await loginPage.login('qtao');
            await navigationPage.gotoCreateCase();
            await createCasePo.selectRequester('qkatawazi');
            await createCasePo.setSummary('Summary');
            await createCasePo.clickSelectCaseTemplateButton();
            await selectCasetemplateBladePo.selectCaseTemplate(templateData.templateSummary);
            await createCasePo.clickAssignToMeButton();
            await createCasePo.clickSaveCaseButton();
            await previewCasePo.clickGoToCaseButton();
            expect(await viewCasePo.isEditLinkDisplay()).toBeTruthy();
            await navigationPage.gotoQuickCase();
            await quickCasePo.selectRequesterName('qkatawazi');
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
    it('[4937]:Case BA from other than case template owner group can NOT update the template', async () => {
        let randomStr = [...Array(5)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        let templateData = {
            "templateName": 'caseTemplateName' + randomStr,
            "templateSummary": 'caseTemplateName' + randomStr,
            "resolveCaseonLastTaskCompletion": "1",
            "templateStatus": "Draft",
            "company": "Petramco",
            "businessUnit": "United States Support",
            "supportGroup": "US Support 3",
            "assignee": 'qkatawazi',
            "ownerBU": "United States Support",
            "ownerGroup": "US Support 3"
        }
        await apiHelper.apiLogin('qkatawazi');
        await apiHelper.createCaseTemplate(templateData);
        await navigationPage.signOut();
        await loginPage.login('elizabeth');
        await navigationPage.gotoSettingsPage();
        await navigationPage.gotoSettingsMenuItem('Case Management--Templates', BWF_PAGE_TITLES.CASE_MANAGEMENT.TEMPLATES);
        await utilityGrid.searchAndOpenHyperlink(templateData.templateName);
        await viewCaseTemplate.clickOnEditCaseTemplateButton();
        expect(await editCasetemplatePo.isCaseSummaryReadOnly()).toBeTruthy();
        await editCasetemplatePo.clickOnEditCaseTemplateMetadata();
        expect(await editCasetemplatePo.isSaveButtonOnMetaDataIsDisabled()).toBeTruthy();
        await editCasetemplatePo.clickOnCancelTemplateMetaData();
        await editCasetemplatePo.clickOnCancelButton();
        await utilityCommon.clickOnApplicationWarningYesNoButton('Yes');
        await viewCaseTemplate.clickBackArrowBtn();
    });

    //ptidke
    it('[3804]:[RESOLVE_CASE_ON_LAST_TASK_COMPLETION] - Case Template view Look & Feel after adding new configuration field', async () => {
        try {
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Case Management--Templates', BWF_PAGE_TITLES.CASE_MANAGEMENT.TEMPLATES);
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
            await viewCaseTemplate.clickBackArrowBtn();
            await navigationPage.signOut();
            await loginPage.login('qkatawazi');
        }
    });

    //ptidke
    describe('[5398]: [Negative Testing]-Checking change case template button disabled/hidden for different case status.', async () => {
        let randomStr = [...Array(5)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        let templateData;
        beforeAll(async () => {
            templateData = {
                "templateName": 'caseTemplateName' + randomStr,
                "templateSummary": 'caseTemplateSummary' + randomStr,
                "resolveCaseonLastTaskCompletion": "1",
                "templateStatus": "Active",
                "company": "Petramco",
                "businessUnit": "United States Support",
                "supportGroup": "US Support 3",
                "assignee": 'qkatawazi',
                "ownerBU": "United States Support",
                "ownerGroup": "US Support 3",
                "caseStatus": "Assigned",
                "description": 'description' + randomStr,
            }
            await apiHelper.apiLogin('qkatawazi');
            await apiHelper.createCaseTemplate(templateData);
        });
        it('[5398]: Checking change case template button for In Progress', async () => {
            await navigationPage.gotoCreateCase();
            await createCasePo.selectRequester('qkatawazi');
            await createCasePo.clickSelectCaseTemplateButton();
            await selectCasetemplateBladePo.selectCaseTemplate(templateData.templateName);
            await createCasePo.clickSaveCaseButton();
            await previewCasePo.clickGoToCaseButton();
            await viewCasePo.isEditLinkDisplay();
            await updateStatusBladePo.changeStatus('In Progress');
            await updateStatusBladePo.clickSaveStatus('In Progress');
            await viewCasePo.clickEditCaseButton();
            await editCasePo.waitForEditCasePageToBeDisplayed();
            expect(await editCasePo.isChangeCaseTemplateButtonDisplayed()).toBeFalsy('change template button not Displayed');
            await editCasePo.clickOnCancelCaseButton();
            await utilityCommon.clickOnApplicationWarningYesNoButton("Yes");
        });
        it('[5398]: Checking change case template button for Resolved', async () => {
            await updateStatusBladePo.changeStatus('Resolved');
            await updateStatusBladePo.selectStatusReason('Auto Resolved');
            await updateStatusBladePo.clickSaveStatus('Resolved');
            await viewCasePo.clickEditCaseButton();
            await editCasePo.waitForEditCasePageToBeDisplayed();
            expect(await editCasePo.isChangeCaseTemplateButtonDisplayed()).toBeFalsy('change template button not Displayed');
            await editCasePo.clickOnCancelCaseButton();
            await utilityCommon.clickOnApplicationWarningYesNoButton("Yes");
        });
        it('[5398]: Checking change case template button for Closed', async () => {
            await updateStatusBladePo.changeStatus('Closed');
            await updateStatusBladePo.clickSaveStatus('Closed');
            await viewCasePo.clickEditCaseButton();
            await editCasePo.waitForEditCasePageToBeDisplayed();
            expect(await editCasePo.isChangeCaseTemplateButtonDisplayed()).toBeFalsy('change template button not Displayed');
            await editCasePo.clickOnCancelCaseButton();
            await utilityCommon.clickOnApplicationWarningYesNoButton("Yes");
        });
        it('[5398]: Checking change case template button for Pending', async () => {
            await navigationPage.gotoCreateCase();
            await createCasePo.selectRequester('qkatawazi');
            await createCasePo.clickSelectCaseTemplateButton();
            await selectCasetemplateBladePo.selectCaseTemplate(templateData.templateName);
            await createCasePo.clickSaveCaseButton();
            await previewCasePo.clickGoToCaseButton();
            await viewCasePo.isEditLinkDisplay();
            await updateStatusBladePo.changeStatus('Pending');
            await updateStatusBladePo.selectStatusReason('Customer Response');
            await updateStatusBladePo.clickSaveStatus('Pending');
            await viewCasePo.clickEditCaseButton();
            await editCasePo.waitForEditCasePageToBeDisplayed();
            expect(await editCasePo.isChangeCaseTemplateButtonDisplayed()).toBeFalsy('change template button not Displayed');
            await editCasePo.clickOnCancelCaseButton();
            await utilityCommon.clickOnApplicationWarningYesNoButton("Yes");
        });
        it('[5398]: Checking change case template button disabled/hidden for different case status.', async () => {
            await updateStatusBladePo.changeStatus('Canceled');
            await updateStatusBladePo.selectStatusReason('Customer Canceled');
            await updateStatusBladePo.clickSaveStatus('Canceled');
            await viewCasePo.clickEditCaseButton();
            await editCasePo.waitForEditCasePageToBeDisplayed();
            expect(await editCasePo.isChangeCaseTemplateButtonDisplayed()).toBeFalsy('change template button not Displayed');
            await editCasePo.clickOnCancelCaseButton();
            await utilityCommon.clickOnApplicationWarningYesNoButton("Yes");
        });
        afterAll(async () => {
            await navigationPage.signOut();
            await loginPage.login('qkatawazi');
        });
    });

    describe('[6405]: [Case Creation] [Template Selection] Applying a Template to a Case', async () => {
        let randomStr = [...Array(5)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        let casetemplatePetramco, casetemplatePsilon;
        beforeAll(async () => {
            casetemplatePetramco = {
                "templateName": 'caseTemplateName' + randomStr,
                "templateSummary": 'caseTemplateSummary' + randomStr,
                "templateStatus": "Active",
                "categoryTier1": "Employee Relations",
                "categoryTier2": "Compensation",
                "categoryTier3": "Bonus",
                "casePriority": "Low",
                "caseStatus": "New",
                "company": "Petramco",
                "businessUnit": "United States Support",
                "supportGroup": "US Support 3",
                "assignee": 'qkatawazi',
                "ownerBU": "United States Support",
                "ownerGroup": "US Support 3",
                "description": 'description' + randomStr,
            }
            await apiHelper.apiLogin('qkatawazi');
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
                "ownerBU": "Psilon Support Org1",
                "ownerGroup": "Psilon Support Group1",
            }
            await apiHelper.apiLogin('gderuno');
            await apiHelper.createCaseTemplate(casetemplatePsilon);
        });
        it('[6405]: Applying a Template to a Case with qkatawazi', async () => {
            await navigationPage.gotoCreateCase();
            await createCasePo.selectRequester('qkatawazi');
            await createCasePo.setSummary(casetemplatePetramco.templateName);
            await createCasePo.clickSelectCaseTemplateButton();
            await selectCasetemplateBladePo.selectCaseTemplate(casetemplatePetramco.templateName);
            await createCasePo.clickSaveCaseButton();
            await previewCasePo.clickGoToCaseButton();
            expect(await viewCasePo.getPriorityValue()).toBe('Low');
            expect(await viewCasePo.getCategoryTier1Value()).toBe("Employee Relations");
            expect(await viewCasePo.getCategoryTier2Value()).toBe("Compensation");
            expect(await viewCasePo.getCategoryTier3Value()).toBe("Bonus");
            expect(await viewCasePo.getAssignedCompanyValue()).toBe('Petramco');
        });
        it('[6405]: Applying a Template to a Case with qdu', async () => {
            await navigationPage.gotoCreateCase();
            await createCasePo.selectRequester('qdu');
            await createCasePo.setSummary(casetemplatePsilon.templateName);
            await createCasePo.clickSelectCaseTemplateButton();
            expect(await createCasePo.isTemplateNamePresent(casetemplatePsilon.templateName)).toBeFalsy();
            await selectCasetemplateBladePo.clickOnCancelButton();
        });
        it('[6405]: [Case Creation] [Template Selection] Applying a Template to a Case', async () => {
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
            await loginPage.login('qkatawazi');
        });
    });

    //apdeshmu 
    it('[6310]: [Case Template] Template visibility', async () => {
        try {
            let randomStr = [...Array(5)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
            let casetemplateData = {
                "templateName": 'caseTemplateName' + randomStr,
                "templateSummary": 'caseTemplateSummaryName' + randomStr,
                "resolveCaseonLastTaskCompletion": "1",
                "templateStatus": "Active",
                "company": "Petramco",
                "businessUnit": "United States Support",
                "supportGroup": "US Support 3",
                "assignee": 'qkatawazi',
                "ownerBU": "United States Support",
                "ownerGroup": "US Support 3",
            }
            await apiHelper.apiLogin('qkatawazi');
            await apiHelper.createCaseTemplate(casetemplateData);
            await navigationPage.signOut();
            await loginPage.login('elizabeth');
            await navigationPage.gotoCreateCase();
            await createCasePo.selectRequester('qkatawazi');
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
    
    describe('[6315]: [Case Template] Create Case Template with all fields data populated', async () => {
        let casetemplatePetramco, randomStr = [...Array(5)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        let caseTemplateGlobal = "CaseTempateHRGlobal_" + randomStr;
        let caseTemplateCompany = "CaseTempateHRCompany_" + randomStr;

        beforeAll(async () => {
            casetemplatePetramco = {
                "templateName": 'caseTemplateName' + randomStr,
                "templateSummary": 'caseTemplateSummaryName' + randomStr,
                "templateStatus": "Active",
                "categoryTier1": "Employee Relations",
                "categoryTier2": "Compensation",
                "categoryTier3": "Bonus",
                "casePriority": "Low",
                "caseStatus": "New",
                "company": "Petramco",
                "businessUnit": "United States Support",
                "supportGroup": "US Support 3",
                "assignee": 'qkatawazi',
                "ownerBU": "United States Support",
                "ownerGroup": "US Support 3",
                "description": 'description' + randomStr,
            }
            await apiHelper.apiLogin('qkatawazi');
            await apiHelper.createCaseTemplate(casetemplatePetramco);
        });
        it('[6315]: Create Case Template with all fields', async () => {
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Case Management--Templates', BWF_PAGE_TITLES.CASE_MANAGEMENT.TEMPLATES);
            await utilityGrid.searchAndOpenHyperlink(casetemplatePetramco.templateName);
            expect(await viewCaseTemplate.getAssigneeText()).toBe('Qadim Katawazi');
            expect(await viewCaseTemplate.getCaseCompanyValue()).toBe("Petramco");
            expect(await viewCaseTemplate.getCaseTemplateNameValue()).toBe(casetemplatePetramco.templateName);
            expect(await viewCaseTemplate.getPriorityValue()).toBe("Low");
            expect(await viewCaseTemplate.getTemplateStatusValue()).toBe("Active");
            expect(await viewCaseTemplate.getOwnerGroupValue()).toBe("US Support 3");
            expect(await viewCaseTemplate.getCategoryTier2()).toBe("Compensation");
            expect(await viewCaseTemplate.getCategoryTier3()).toBe("Bonus");
            expect(await viewCaseTemplate.getCategoryTier1()).toBe("Employee Relations");
            expect(await viewCaseTemplate.getOwnerCompanyValue()).toBe("Petramco");
            await viewCaseTemplate.clickBackArrowBtn();
        });

        it('[6315]: [Case Template] Create Case Template with all fields data populated', async () => {
            await navigationPage.gotoCreateCase();
            await createCasePo.selectRequester('qkatawazi');
            await createCasePo.setSummary(casetemplatePetramco.templateName);
            await createCasePo.clickSelectCaseTemplateButton();
            await selectCasetemplateBladePo.selectCaseTemplate(casetemplatePetramco.templateName);
            await createCasePo.clickSaveCaseButton();
            await previewCasePo.clickGoToCaseButton();
            expect(await viewCasePo.getPriorityValue()).toBe('Low');
            expect(await viewCasePo.getCategoryTier1Value()).toBe("Employee Relations");
            expect(await viewCasePo.getCategoryTier2Value()).toBe("Compensation");
            expect(await viewCasePo.getCategoryTier3Value()).toBe("Bonus");
            expect(await viewCasePo.getAssignedCompanyValue()).toBe('Petramco');
        });

        it('[6315]: [Case Template] Configuring an Assignment Mapping for Human Resource Line of Business', async () => {
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Case Management--Templates', BWF_PAGE_TITLES.CASE_MANAGEMENT.TEMPLATES);
            await consoleCasetemplatePo.clickOnCreateCaseTemplateButton();
            await createCaseTemplate.setTemplateName(caseTemplateCompany);
            await createCaseTemplate.setCompanyName('Petramco');
            await createCaseTemplate.setCaseSummary(caseTemplateCompany + ' summary');
            await createCaseTemplate.setPriorityValue('High');
            await createCaseTemplate.isResolveCaseOnLastTaskCompletion(true);
            await createCaseTemplate.setOwnerOrgDropdownValue('India Support');
            await createCaseTemplate.setOwnerGroupDropdownValue('IN Support 3');
            await createCaseTemplate.setTemplateStatusDropdownValue('Draft')
            await createCaseTemplate.clickSaveCaseTemplate();
            expect(await utilityCommon.isPopUpMessagePresent('Saved successfully.')).toBeTruthy('Record saved successfully confirmation message not displayed.');
            await viewCaseTemplate.clickBackArrowBtn();

            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Case Management--Templates', BWF_PAGE_TITLES.CASE_MANAGEMENT.TEMPLATES);
            await consoleCasetemplatePo.clickOnCreateCaseTemplateButton();
            await createCaseTemplate.setTemplateName(caseTemplateGlobal);
            await createCaseTemplate.setCompanyName('Petramco');
            await createCaseTemplate.setCaseSummary(caseTemplateGlobal + ' summary');
            await createCaseTemplate.setPriorityValue('Low');
            await createCaseTemplate.isResolveCaseOnLastTaskCompletion(true);
            await createCaseTemplate.setOwnerOrgDropdownValue('United States Support');
            await createCaseTemplate.setOwnerGroupDropdownValue('US Support 3');
            await createCaseTemplate.setTemplateStatusDropdownValue('Active')
            await createCaseTemplate.clickSaveCaseTemplate();
            expect(await utilityCommon.isPopUpMessagePresent('Saved successfully.')).toBeTruthy('Record saved successfully confirmation message not displayed.');
            await viewCaseTemplate.clickBackArrowBtn();
        });

        it('[6315]: Verify if case template is accessible to same LOB Case Manager', async () => {
            await navigationPage.signOut();
            await loginPage.login('qdu');
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Case Management--Templates', BWF_PAGE_TITLES.CASE_MANAGEMENT.TEMPLATES);
            expect(await utilityGrid.isGridRecordPresent(caseTemplateGlobal)).toBeTruthy('Case Template is not displayed to same LOB Case manager.');
            expect(await utilityGrid.isGridRecordPresent(caseTemplateCompany)).toBeTruthy('Case Template is not displayed to same LOB Case manager.');
        });

        it('[6315]: Verify if case template is accessible to different LOB Case BA', async () => {
            await navigationPage.signOut();
            await loginPage.login('fritz');
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Case Management--Templates', BWF_PAGE_TITLES.CASE_MANAGEMENT.TEMPLATES);
            expect(await utilityGrid.isGridRecordPresent(caseTemplateGlobal)).toBeFalsy('Case Template is not displayed to different LOB Case BA.');
            expect(await utilityGrid.isGridRecordPresent(caseTemplateCompany)).toBeFalsy('Case Template is not displayed to different LOB Case BA.');
        });

        it('[6315]: Verify if case template is accessible to different LOB Case Manager', async () => {
            await navigationPage.signOut();
            await loginPage.login('frieda');
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Case Management--Templates', BWF_PAGE_TITLES.CASE_MANAGEMENT.TEMPLATES);
            expect(await utilityGrid.isGridRecordPresent(caseTemplateGlobal)).toBeFalsy('Case Template is not displayed to different LOB Case manager.');
            expect(await utilityGrid.isGridRecordPresent(caseTemplateCompany)).toBeFalsy('Case Template is not displayed to different LOB Case manager.');
        });

        it('[6315]: Verify if case template is accessible to Case BA belonging to different company with same LOB', async () => {
            await navigationPage.signOut();
            await loginPage.login('gwixillian');
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Case Management--Templates', BWF_PAGE_TITLES.CASE_MANAGEMENT.TEMPLATES);
            expect(await utilityGrid.isGridRecordPresent(caseTemplateGlobal)).toBeTruthy('Case Template is not displayed to same LOB and different company Case BA.');
            expect(await utilityGrid.isGridRecordPresent(caseTemplateCompany)).toBeTruthy('Case Template is not displayed to same LOB and different company Case BA.');
        });

        it('[6315]: Verify if case template is accessible to Case Manager user having access to multiple LOB', async () => {
            await navigationPage.signOut();
            await loginPage.login('qyuan');
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Case Management--Templates', BWF_PAGE_TITLES.CASE_MANAGEMENT.TEMPLATES);
            await utilityGrid.selectLineOfBusiness('Human Resource');
            expect(await utilityGrid.isGridRecordPresent(caseTemplateGlobal)).toBeTruthy('Case Template is not displayed to Case BA having access to multiple LOBs.');
            expect(await utilityGrid.isGridRecordPresent(caseTemplateCompany)).toBeTruthy('Case Template is not displayed to Case BA having access to multiple LOBs');
            await utilityGrid.selectLineOfBusiness('Facilities');
            expect(await utilityGrid.isGridRecordPresent(caseTemplateGlobal)).toBeFalsy('Case Template is displayed to Case BA having access to multiple LOBs.');
            expect(await utilityGrid.isGridRecordPresent(caseTemplateCompany)).toBeFalsy('Case Template is displayed to Case BA having access to multiple LOBs');
        });

        it('[6315]: Verify if case template is accessible to Case BA user having access to multiple LOB', async () => {
            await navigationPage.signOut();
            await loginPage.login('jbarnes');
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Case Management--Templates', BWF_PAGE_TITLES.CASE_MANAGEMENT.TEMPLATES);
            await utilityGrid.selectLineOfBusiness('Facilities');
            expect(await utilityGrid.isGridRecordPresent(caseTemplateGlobal)).toBeFalsy('Case Template is displayed to Case BA having access to multiple LOBs.');
            expect(await utilityGrid.isGridRecordPresent(caseTemplateCompany)).toBeFalsy('Case Template is displayed to Case BA having access to multiple LOBs');

            await utilityGrid.selectLineOfBusiness('Human Resource');
            expect(await utilityGrid.isGridRecordPresent(caseTemplateGlobal)).toBeTruthy('Case Template is not displayed to Case BA having access to multiple LOBs.');
            expect(await utilityGrid.isGridRecordPresent(caseTemplateCompany)).toBeTruthy('Case Template is not displayed to Case BA having access to multiple LOBs');

            await utilityGrid.searchAndOpenHyperlink(caseTemplateCompany);
            await editCasetemplatePo.clickEditCaseTemplate();
            await editCasetemplatePo.changeCaseSummary('Updated Summary');
            await editCasetemplatePo.clickSaveCaseTemplate();
            expect(await utilityCommon.isPopUpMessagePresent('Saved successfully.')).toBeTruthy('Record saved successfully confirmation message not displayed.');
            await utilityCommon.closePopUpMessage();
            await viewCaseTemplate.clickBackArrowBtn();
        });

        afterAll(async () => {
            await utilityCommon.closeAllBlades();
            await navigationPage.signOut();
            await loginPage.login('qkatawazi');
        });
    });

    describe('[6316]: [Case Template] Case Status, Template status, Priority, Case Company, Owner population', async () => {
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
                "ownerBU": "United States Support",
                "ownerGroup": "US Support 3",
                "buisnessUnit": "United States Support",
                "supportGroup": "US Support 3",
                "assignee": 'qkatawazi',
                "categoryTier1": "Employee Relations",
                "categoryTier2": "Compensation",
                "categoryTier3": "Bonus",
                "casePriority": "Low",
                "caseStatus": "New",
            }
            await apiHelper.apiLogin('qkatawazi');
            await apiHelper.createCaseTemplate(casetemplatePetramco);
        });
        it('[6316]: Checking change case template button for In Progress', async () => {
            await navigationPage.signOut();
            await loginPage.login('qkatawazi');
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Case Management--Templates', BWF_PAGE_TITLES.CASE_MANAGEMENT.TEMPLATES);
            await utilityGrid.searchAndOpenHyperlink(caseTemplateName);
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
            await utilityCommon.closePopUpMessage();
        });
        it('[6316]: [Case Template] Case Status, Template status, Priority, Case Company, Owner population', async () => {
            expect(await viewCaseTemplate.getCaseTemplateNameValue()).toContain(caseTemplateName);
            expect(await viewCaseTemplate.getCategoryTier1()).toContain("Employee Relations");
            expect(await viewCaseTemplate.getCategoryTier2()).toContain("Compensation");
            expect(await viewCaseTemplate.getCategoryTier3()).toContain("Bonus");
            expect(await viewCaseTemplate.getCaseCompanyValue()).toContain("Petramco");
            expect(await viewCaseTemplate.getTemplateStatusValue()).toContain("Draft");
            expect(await viewCaseTemplate.getAssigneeText()).toContain('Qadim Katawazi');
            expect(await viewCaseTemplate.getOwnerGroupValue()).toContain('AU Support 1');
        });
        afterAll(async () => {
            await navigationPage.signOut();
            await loginPage.login('qkatawazi');
        });
    });

    describe('[5419,5403]: Changing case template for new case status.', async () => {
        let randomStr = [...Array(5)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        let caseTemplateName = 'caseTemplateName' + randomStr;
        let updatedCaseTemplateName = 'updatedCaseTemplateName' + randomStr;
        beforeAll(async () => {
            let casetemplatePetramco = {
                "templateName": 'caseTemplateName' + randomStr,
                "templateSummary": 'caseTemplateSummaryName' + randomStr,
                "templateStatus": "Active",
                "categoryTier1": "Employee Relations",
                "categoryTier2": "Compensation",
                "categoryTier3": "Bonus",
                "casePriority": "Low",
                "caseStatus": "New",
                "company": "Petramco",
                "businessUnit": "United States Support",
                "supportGroup": "US Support 3",
                "assignee": 'qkatawazi',
                "ownerBU": "United States Support",
                "ownerGroup": "US Support 3",
                "description": 'description' + randomStr,
            }
            await apiHelper.apiLogin('qkatawazi');
            await apiHelper.createCaseTemplate(casetemplatePetramco);
            casetemplatePetramco.templateName = updatedCaseTemplateName;
            await apiHelper.createCaseTemplate(casetemplatePetramco);
        });
        it('[5419,5403]: Changing case template for new case status', async () => {
            await navigationPage.gotoCreateCase();
            await createCasePo.selectRequester('qkatawazi');
            await createCasePo.setSummary(caseTemplateName);
            await createCasePo.clickSelectCaseTemplateButton();
            await selectCasetemplateBladePo.selectCaseTemplate(caseTemplateName);
            await createCasePo.clickSaveCaseButton();
            await previewCasePo.clickGoToCaseButton();
            expect(await viewCasePo.getCaseSummary()).toBe(caseTemplateName);
            await utilityCommon.closePopUpMessage();
        });
        it('[5419,5403]: Changing case template for new case status.', async () => {
            await viewCasePo.clickEditCaseButton();
            await editCasePo.clickOnChangeCaseTemplate();
            await selectCasetemplateBladePo.selectCaseTemplate(updatedCaseTemplateName);
            await editCasePo.clickSaveCase();
            await utilityCommon.closePopUpMessage();
            await utilityCommon.closePopUpMessage();
            await navigationPage.gotoCaseConsole();
            await utilityGrid.searchAndOpenHyperlink(caseTemplateName);
            expect(await viewCasePo.getPriorityValue()).toBe('Low');
            expect(await viewCasePo.getCaseStatusValue()).toContain('New');
            expect(await viewCasePo.getCategoryTier1Value()).toBe("Employee Relations");
            expect(await viewCasePo.getCategoryTier2Value()).toBe("Compensation");
            expect(await viewCasePo.getCategoryTier3Value()).toBe("Bonus");
            expect(await viewCasePo.getAssignedCompanyValue()).toBe('Petramco');
            await utilityCommon.closePopUpMessage(); //waning message is displayed
            await viewCasePo.clickOnTab('Activity');
            await activityTabPo.clickOnRefreshButton();
            expect(await activityTabPo.isTextPresentInActivityLog(updatedCaseTemplateName)).toBeTruthy('TemplateText is not available');
            expect(await activityTabPo.isTextPresentInActivityLog('applied the template')).toBeTruthy('Applied Template text is not present');
            await navigationPage.gotoPersonProfile();
            await utilityCommon.closePopUpMessage(); //waning message is displayed
            expect(await activityTabPo.isTextPresentInActivityLog(updatedCaseTemplateName)).toBeTruthy("Template is not avilable on profile");
        });
    });

    describe('[5393]: [Case] [Template Selection] Changing case template for the case in Assigned Status', async () => {
        let randomStr = [...Array(5)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        let caseTemplateName = 'caseTemplateName' + randomStr;
        let updatedCaseTemplateName = 'updatedCaseTemplateName' + randomStr;
        let taskTemplateName = 'taskTemplateName' + randomStr;
        beforeAll(async () => {
            let casetemplatePetramco1 = {
                "templateName": caseTemplateName,
                "templateSummary": caseTemplateName,
                "templateStatus": "Active",
                "categoryTier1": "Employee Relations",
                "categoryTier2": "Compensation",
                "categoryTier3": "Bonus",
                "casePriority": "Low",
                "caseStatus": "Assigned",
                "company": "Petramco",
                "businessUnit": "United States Support",
                "supportGroup": "US Support 3",
                "assignee": 'qkatawazi',
                "ownerBU": "United States Support",
                "ownerGroup": "US Support 3",
                "description": 'description' + randomStr,
            }
            let casetemplatePetramco2 = {
                "templateName": updatedCaseTemplateName,
                "templateSummary": updatedCaseTemplateName,
                "templateStatus": "Active",
                "categoryTier1": "Employee Relations",
                "categoryTier2": "Compensation",
                "categoryTier3": "Bonus",
                "casePriority": "Low",
                "caseStatus": "Assigned",
                "company": "Petramco",
                "businessUnit": "United States Support",
                "supportGroup": "US Support 3",
                "assignee": 'qkatawazi',
                "ownerBU": "United States Support",
                "ownerGroup": "US Support 3",
                "description": 'description' + randomStr,
            }
            let taskTemplateDataSet = {
                "templateName": taskTemplateName,
                "templateSummary": taskTemplateName,
                "templateStatus": "Active",
                "taskCompany": "Petramco",
                "buisnessUnit": "United States Support",
                "supportGroup": "US Support 3",
                "assignee": 'qkatawazi',
                "ownerCompany": "Petramco",
                "ownerBusinessUnit": "United States Support",
                "ownerGroup": "US Support 3"
            }
            await apiHelper.apiLogin('qkatawazi');
            let newCaseTemplate1 = await apiHelper.createCaseTemplate(casetemplatePetramco1);
            let newCaseTemplate2 = await apiHelper.createCaseTemplate(casetemplatePetramco2);
            let manualTaskTemplate = await apiHelper.createManualTaskTemplate(taskTemplateDataSet);
            await apiHelper.associateCaseTemplateWithOneTaskTemplate(newCaseTemplate1.displayId, manualTaskTemplate.displayId);
            await apiHelper.associateCaseTemplateWithOneTaskTemplate(newCaseTemplate2.displayId, manualTaskTemplate.displayId);
        });
        it('[5393]: Changing case template for the case in Assigned Status', async () => {
            await navigationPage.gotoCreateCase();
            await createCasePo.selectRequester('qkatawazi');
            await createCasePo.setSummary(caseTemplateName);
            await createCasePo.clickSelectCaseTemplateButton();
            await selectCasetemplateBladePo.selectCaseTemplate(caseTemplateName);
            await createCasePo.clickAssignToMeButton();
            await createCasePo.clickSaveCaseButton();
            await previewCasePo.clickGoToCaseButton();
            expect(await viewCasePo.getCaseSummary()).toBe(caseTemplateName);
            expect(await viewCasePo.isCoreTaskPresent(taskTemplateName)).toBeTruthy('Core task is not present');
        });
        it('[5393]: [Case] [Template Selection] Changing case template for the case in Assigned Status', async () => {
            await viewCasePo.clickEditCaseButton();
            await editCasePo.clickOnChangeCaseTemplate();
            await selectCasetemplateBladePo.selectCaseTemplate(updatedCaseTemplateName);
            await editCasePo.clickSaveCase();
            await utilityCommon.closePopUpMessage();
            await utilityCommon.closePopUpMessage();
            await navigationPage.gotoCaseConsole();
            await utilityGrid.searchAndOpenHyperlink(caseTemplateName);
            expect(await viewCasePo.getPriorityValue()).toBe('Low');
            expect(await viewCasePo.getCaseStatusValue()).toContain('Assigned');
            expect(await viewCasePo.getCategoryTier1Value()).toBe("Employee Relations");
            expect(await viewCasePo.getCategoryTier2Value()).toBe("Compensation");
            expect(await viewCasePo.getCategoryTier3Value()).toBe("Bonus");
            expect(await viewCasePo.getAssignedCompanyValue()).toBe('Petramco');
            expect(await viewCasePo.getAssigneeText()).toBe('Qadim Katawazi');
            expect(await viewCasePo.getAssignedGroupValue()).toBe('US Support 3');
            await utilityCommon.closePopUpMessage(); //warning message displayed
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

    describe('[5359]: [Negative Testing] - Verify permission for Case Agent from a different support group to edit case template.', async () => {
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
                "ownerBU": "United States Support",
                "ownerGroup": "US Support 3",
                "buisnessUnit": "United States Support",
                "supportGroup": "US Support 3",
                "assignee": 'qkatawazi',
                "categoryTier1": "Employee Relations",
                "categoryTier2": "Compensation",
                "categoryTier3": "Bonus",
                "casePriority": "Low",
                "caseStatus": "Assigned",
                "description": 'description' + randomStr,
            }
            await apiHelper.apiLogin('qkatawazi');
            await apiHelper.createCaseTemplate(casetemplatePetramco);
        });
        it('[5359]: Creating the Case with case template', async () => {
            await navigationPage.signOut();
            await loginPage.login('qkatawazi');
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
        it('[5359]: Login to CM with diffrent support group', async () => {
            await navigationPage.signOut();
            await loginPage.login('franz');
            await navigationPage.gotoCaseConsole();
            await caseConsolePo.searchCase(caseTemplateName);
            expect(await caseConsolePo.isCaseSummaryPresent(caseTemplateName)).toBeFalsy("Case is present for diffrent company");
        });
        it('[5359]: [Negative Testing] - Verify permission for Case Agent from a different support group to edit case template.', async () => {
            await navigationPage.signOut();
            await loginPage.login('rrovnitov');
            await navigationPage.gotoCaseConsole();
            await caseConsolePo.searchCase(caseTemplateName);
            expect(await caseConsolePo.isCaseSummaryPresent(caseTemplateName)).toBeFalsy("Case is present for diffrent company");
        });
        afterAll(async () => {
            await navigationPage.signOut();
            await loginPage.login('qkatawazi');
        });
    });

    describe('[4936,4944]: Case Template access when owner group from different company is applied', async () => {
        let caseTemplateName: string = "TemplateName" + Math.floor(Math.random() * 100000);
        it('[4936,4944]: Checking change case template button for In Progress', async () => {
            await navigationPage.signOut();
            await loginPage.login('qheroux');
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Case Management--Templates', BWF_PAGE_TITLES.CASE_MANAGEMENT.TEMPLATES);
            await consoleCasetemplatePo.clickOnCreateCaseTemplateButton();
            await createCaseTemplate.setTemplateName(caseTemplateName);
            await createCaseTemplate.setCaseSummary(caseTemplateName);
            await createCaseTemplate.setCompanyName('Petramco');
            await createCaseTemplate.setPriorityValue('Low');
            await createCaseTemplate.setOwnerCompanyValue('Petramco');
            await createCaseTemplate.setOwnerOrgDropdownValue("United States Support");
            await createCaseTemplate.setOwnerGroupDropdownValue("US Support 3");
            await createCaseTemplate.setTemplateStatusDropdownValue('Draft');
            await createCaseTemplate.clickSaveCaseTemplate();
        });
        it('[4936,4944]: Checking change case template button for Resolved', async () => {
            await editCasetemplatePo.clickOnEditCaseTemplateMetadata();
            await editCasetemplatePo.changeOwnerCompanyValue('Psilon');
            await editCasetemplatePo.changeBusinessUnitDropdownValue("Psilon Support Org1");
            await editCasetemplatePo.changeOwnerGroupDropdownValue("Psilon Support Group1");
            await editCasetemplatePo.clickOnSaveCaseTemplateMetadata();
            expect(await viewCaseTemplate.getBuisnessUnitValue()).toContain("Psilon Support Org1");
            expect(await viewCaseTemplate.getOwnerGroupValue()).toContain("Psilon Support Group1");
            expect(await viewCaseTemplate.getOwnerCompanyValue()).toContain('Psilon');
            await viewCaseTemplate.clickBackArrowBtn();
        });
        it('[4936,4944]: Case Template access when owner group from different company is applied', async () => {
            await navigationPage.signOut();
            await loginPage.login('qkatawazi');
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Case Management--Templates', BWF_PAGE_TITLES.CASE_MANAGEMENT.TEMPLATES);
            await utilityGrid.searchAndOpenHyperlink(caseTemplateName);
            await viewCaseTemplate.clickOnEditCaseTemplateButton();
            expect(await editCasetemplatePo.isCaseSummaryReadOnly()).toBeTruthy('Case Summary is editable');
            expect(await editCasetemplatePo.isCaseCompanyDisabled()).toBeTruthy('Case Company is enabled');
            await editCasetemplatePo.clickOnCancelButton();
            await utilityCommon.clickOnApplicationWarningYesNoButton('Yes');
            await viewCaseTemplate.clickBackArrowBtn();
        });
        afterAll(async () => {
            await utilityCommon.closeAllBlades();
            await navigationPage.signOut();
            await loginPage.login('qkatawazi');
        });
    });
//quick case issue-passing on CICD
    describe('[6290]: [Case Template] Template status lifecycle', async () => {
        let templateDataDraft, randomStr = [...Array(5)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        let caseTemplateName = randomStr + 'Draft';
        beforeAll(async () => {
            templateDataDraft = {
                "templateName": caseTemplateName,
                "templateSummary": caseTemplateName,
                "templateStatus": "Active",
                "company": "Petramco",
                "businessUnit": "United States Support",
                "supportGroup": "US Support 3",
                "assignee": 'qkatawazi',
                "ownerBU": "United States Support",
                "ownerGroup": "US Support 3",
                "categoryTier1": "Employee Relations",
                "categoryTier2": "Compensation",
                "categoryTier3": "Bonus",
                "casePriority": "Low",
                "caseStatus": "Assigned",
                "description": 'description' + randomStr,
                "lineOfBuisness": "Human Resource"
            }
            await apiHelper.apiLogin('qkatawazi');
            await apiHelper.createCaseTemplate(templateDataDraft);
        });
        it('[6290]: Case Agent checks for Active template & Consume it', async () => {
            await navigationPage.signOut();
            await loginPage.login('qkatawazi');
            await navigationPage.gotoQuickCase();
            await quickCasePo.selectRequesterName('adam');
            await quickCasePo.selectCaseTemplate(templateDataDraft.templateName);
            await quickCasePo.createCaseButton();
            await casePreviewPo.clickGoToCaseButton();
            expect(await viewCasePo.getCaseTemplateText()).toBe(templateDataDraft.templateName);
        });
        it('[6290]: [Case Template] Template status lifecycle', async () => {
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Case Management--Templates', BWF_PAGE_TITLES.CASE_MANAGEMENT.TEMPLATES);
            await utilityGrid.searchAndOpenHyperlink(caseTemplateName);
            await viewCaseTemplate.clickOnEditCaseTemplateButton();
            expect(await editCasetemplatePo.isCaseCompanyDisabled()).toBeTruthy();
            expect(await editCasetemplatePo.isCaseSummaryReadOnly()).toBeTruthy();
            await viewCaseTemplate.clickEditTemplateMetaData();
            await editCasetemplatePo.changeTemplateStatusDropdownValue('Inactive');
            await editCasetemplatePo.clickOnSaveCaseTemplateMetadata();
            expect(await viewCaseTemplate.getTemplateStatusValue()).toBe('Inactive');
            await editCasetemplatePo.clickSaveCaseTemplate();
            await viewCaseTemplate.clickBackArrowBtn();
            await navigationPage.gotoQuickCase();
            await quickCasePo.selectRequesterName('adam');
            expect(await quickCasePo.selectCaseTemplate(caseTemplateName)).toBeFalsy('Inactive template is present');
        });
        it('[6290]: Case Agent checks for Draft template', async () => {
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Case Management--Templates', BWF_PAGE_TITLES.CASE_MANAGEMENT.TEMPLATES);
            await utilityGrid.searchAndOpenHyperlink(caseTemplateName);
            await viewCaseTemplate.clickEditTemplateMetaData();
            await editCasetemplatePo.changeTemplateStatusDropdownValue('Draft');
            await editCasetemplatePo.clickOnSaveCaseTemplateMetadata();
            expect(await viewCaseTemplate.getTemplateStatusValue()).toBe('Draft');
            await viewCaseTemplate.clickBackArrowBtn();
            await navigationPage.gotoQuickCase();
            await quickCasePo.selectRequesterName('adam');
            expect(await quickCasePo.selectCaseTemplate(caseTemplateName)).toBeFalsy('Draft template is present');
        });
        afterAll(async () => {
            await navigationPage.signOut();
            await loginPage.login('qkatawazi');
        });
    })

    describe('[5358,5360]: [Negative Testing] - Verify permission for Case Manager from a different/same support group to edit case template.', async () => {
        let randomStr = [...Array(5)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        let caseTemplateName = 'caseTemplateName' + randomStr;
        beforeAll(async () => {
            let casetemplatePetramco = {
                "templateName": caseTemplateName,
                "templateSummary": caseTemplateName,
                "templateStatus": "Active",
                "company": "Petramco",
                "ownerCompany": "Petramco",
                "ownerBU": "United States Support",
                "ownerGroup": "US Support 3",
                "buisnessUnit": "United States Support",
                "supportGroup": "US Support 3",
                "assignee": 'qkatawazi',
                "categoryTier1": "Employee Relations",
                "categoryTier2": "Compensation",
                "categoryTier3": "Bonus",
                "casePriority": "Low",
                "caseStatus": "Assigned",
                "description": 'description' + randomStr,
            }
            await apiHelper.apiLogin('qkatawazi');
            await apiHelper.createCaseTemplate(casetemplatePetramco);
        });
        it('[5358,5360]: Creating the Case with case template', async () => {
            await navigationPage.signOut();
            await loginPage.login('qkatawazi');
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
        it('[5358,5360]: Login to CA with diffrent support group', async () => {
            await navigationPage.signOut();
            await loginPage.login('qtao');
            await navigationPage.gotoCaseConsole();
            await caseConsolePo.searchCase(caseTemplateName);
            expect(await caseConsolePo.isCaseSummaryPresent(caseTemplateName)).toBeFalsy("Case is present for diffrent company");
        });
        it('[5358,5360]: Login to CA with diffrent company', async () => {
            await navigationPage.signOut();
            await loginPage.login('werusha');
            await navigationPage.gotoCaseConsole();
            await caseConsolePo.searchCase(caseTemplateName);
            expect(await caseConsolePo.isCaseSummaryPresent(caseTemplateName)).toBeFalsy("Case is present for diffrent company");
        });
        it('[5358,5360]: [Negative Testing] - Verify permission for Case Manager from a different/same support group to edit case template.', async () => {
            await navigationPage.signOut();
            await loginPage.login('qkatawazi');
            await navigationPage.gotoCaseConsole();
            await caseConsolePo.searchAndOpenCase(caseTemplateName);
            expect(await viewCasePo.getCaseSummary()).toBe(caseTemplateName);
        });
        afterAll(async () => {
            await navigationPage.signOut();
            await loginPage.login('qkatawazi');
        });
    });
    
    describe('[4942]:Case Template submitter from different company than owner group company can edit the template', async () => {
        it('[4942]:Case Template submitter from different company than owner group company can edit the template', async () => {
            await navigationPage.signOut();
            await loginPage.login('qheroux');
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Case Management--Templates', BWF_PAGE_TITLES.CASE_MANAGEMENT.TEMPLATES);
            let caseTemplateName: string = "TemplateName" + Math.floor(Math.random() * 100000);
            await consoleCasetemplatePo.clickOnCreateCaseTemplateButton();
            await createCaseTemplate.setTemplateName(caseTemplateName);
            await createCaseTemplate.setCaseSummary(caseTemplateName);
            await createCaseTemplate.setCompanyName('Phylum');
            await createCaseTemplate.setPriorityValue('Low');
            await createCaseTemplate.setOwnerCompanyValue('Psilon');
            await createCaseTemplate.setOwnerOrgDropdownValue('Psilon Support Org1');
            await createCaseTemplate.setOwnerGroupDropdownValue('Psilon Support Group1');
            await createCaseTemplate.setTemplateStatusDropdownValue('Draft')
            await createCaseTemplate.clickSaveCaseTemplate();
            await viewCaseTemplate.clickBackArrowBtn();
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Case Management--Templates', BWF_PAGE_TITLES.CASE_MANAGEMENT.TEMPLATES);
            await utilityGrid.searchAndOpenHyperlink(caseTemplateName);
            await editCasetemplatePo.clickOnEditCaseTemplateMetadata();
            await editCasetemplatePo.changeOwnerCompanyValue('Petramco');
            await editCasetemplatePo.changeBusinessUnitDropdownValue("Petramco Support Org1");
            await editCasetemplatePo.changeOwnerGroupDropdownValue("Petramco Support Group1");
            await editCasetemplatePo.clickOnSaveCaseTemplateMetadata();
            expect(await viewCaseTemplate.getBuisnessUnitValue()).toContain("Petramco Support Org1");
            expect(await viewCaseTemplate.getOwnerGroupValue()).toContain("Petramco Support Group1");
            expect(await viewCaseTemplate.getOwnerCompanyValue()).toContain('Petramco');
        });
        afterAll(async () => {
            await viewCaseTemplate.clickBackArrowBtn();
            await navigationPage.signOut();
            await loginPage.login('qkatawazi');
        });
    });

    it('[5026]:[Negative Testing] - Global as well as company specific flowset will list if we select specific company while creating case template.', async () => {
        await apiHelper.apiLogin('qkatawazi');
        let randomStr = [...Array(4)].map(i => (~~(Math.random() * 36)).toString(36)).join('');

        let flowsetMandatoryFieldsData = cloneDeep(flowsetMandatoryFields);
        flowsetMandatoryFieldsData.flowsetName = flowsetMandatoryFieldsData.flowsetName + randomStr;
        await apiHelper.createNewFlowset(flowsetMandatoryFieldsData);

        let flowsetGlobalFieldsData = cloneDeep(flowsetGlobalFields);
        flowsetGlobalFieldsData.flowsetName = flowsetGlobalFieldsData.flowsetName + randomStr;
        await apiHelper.createNewFlowset(flowsetGlobalFieldsData);

        await navigationPage.gotoSettingsPage();
        await navigationPage.gotoSettingsMenuItem('Case Management--Templates', BWF_PAGE_TITLES.CASE_MANAGEMENT.TEMPLATES);
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
        await viewCaseTemplate.clickBackArrowBtn();
    });
    //assinee issue-passing on CICD
    describe('[4433]: Verify case assignment method is not applicable if user changes the case template', async () => {
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
                "categoryTier1": "Employee Relations",
                "categoryTier2": "Compensation",
                "categoryTier3": "Bonus",
                "casePriority": "Low",
                "caseStatus": "New",
                "company": "Petramco",
                "businessUnit": "United States Support",
                "supportGroup": "US Support 3",
                "ownerBU": "United States Support",
                "ownerGroup": "US Support 3",
                "description": 'description' + randomStr,
            }
            let casetemplatePetramco2 = {
                "templateName": caseTemplateName2,
                "templateSummary": caseTemplateName2,
                "templateStatus": "Draft",
                "categoryTier1": "Employee Relations",
                "categoryTier2": "Compensation",
                "categoryTier3": "Bonus",
                "casePriority": "Low",
                "caseStatus": "New",
                "company": "Petramco",
                "businessUnit": "HR Support",
                "supportGroup": "Workforce Administration",
                "ownerBU": "United States Support",
                "ownerGroup": "US Support 3",
                "description": 'description' + randomStr,
            }
            let casetemplatePetramco3 = {
                "templateName": caseTemplateName3,
                "templateSummary": caseTemplateName3,
                "templateStatus": "Active",
                "categoryTier1": "Employee Relations",
                "categoryTier2": "Compensation",
                "categoryTier3": "Bonus",
                "casePriority": "Low",
                "caseStatus": "New",
                "company": "Petramco",
                "businessUnit": "United States Support",
                "supportGroup": "US Support 3",
                "assignee": 'qkatawazi',
                "ownerBU": "United States Support",
                "ownerGroup": "US Support 3",
                "description": 'description' + randomStr,
            }
            let caseData =
            {
                "Requester": "qtao",
                "Summary": caseName,
                "categoryTier1": "Employee Relations",
                "categoryTier2": "Compensation",
                "categoryTier3": "Bonus",
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
        it('[4433]: Adding methods to case template', async () => {
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Case Management--Templates', BWF_PAGE_TITLES.CASE_MANAGEMENT.TEMPLATES);
            await utilityGrid.searchAndOpenHyperlink(caseTemplateName1);
            await viewCaseTemplate.clickOnEditCaseTemplateButton();
            await editCasetemplatePo.changeAssignmentMethodValue('Round Robin');
            await editCasetemplatePo.clickSaveCaseTemplate();
            await viewCaseTemplate.clickEditTemplateMetaData();
            await editCasetemplatePo.changeTemplateStatusDropdownValue('Active');
            await editCasetemplatePo.clickOnSaveCaseTemplateMetadata();
            await viewCaseTemplate.clickBackArrowBtn();
            await utilityGrid.searchAndOpenHyperlink(caseTemplateName2);
            await viewCaseTemplate.clickOnEditCaseTemplateButton();
            await editCasetemplatePo.changeAssignmentMethodValue('Round Robin');
            await editCasetemplatePo.clickSaveCaseTemplate();
            await viewCaseTemplate.clickEditTemplateMetaData();
            await editCasetemplatePo.changeTemplateStatusDropdownValue('Active');
            await editCasetemplatePo.clickOnSaveCaseTemplateMetadata();
            await viewCaseTemplate.clickBackArrowBtn();
        });
        it('[4433]: Verify case assignment method is not applicable if user changes the case template', async () => {
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
            expect(await viewCasePo.getAssignedGroupValue()).toBe("US Support 3");
            expect(await viewCasePo.getBusinessUnitText()).toBe("United States Support");
        });
        it('[4433]: Verify case assignment method is not applicable if user changes the case template', async () => {
            await navigationPage.gotoCaseConsole();
            await caseConsolePo.searchAndOpenCase(newCase2.displayId);
            expect(await viewCasePo.getAssigneeText()).toBe("Qadim Katawazi");
            await viewCasePo.clickEditCaseButton();
            await editCasePo.clickOnSelectCaseTemplate();
            await selectCasetemplateBladePo.selectCaseTemplate(caseTemplateName1);
            await editCasePo.clickSaveCase();
            expect(await viewCasePo.isAssigneeNameDisplayed()).toBeTruthy();
            expect(await viewCasePo.getAssignedGroupValue()).toBe("US Support 3");
            expect(await viewCasePo.getBusinessUnitText()).toBe("United States Support");
            await viewCasePo.clickEditCaseButton();
            await editCasePo.clickOnChangeCaseTemplate();
            await selectCasetemplateBladePo.selectCaseTemplate(caseTemplateName2);
            await editCasePo.clickSaveCase();
            await utilityCommon.closePopUpMessage();
            // verify support Group w.r.t template2 should be applied any assignee, as round robin assignement method
            expect(await viewCasePo.isAssigneeNameDisplayed()).toBeTruthy();
            expect(await viewCasePo.getAssignedGroupValue()).toBe('Workforce Administration');
            expect(await viewCasePo.getBusinessUnitText()).toBe('HR Support');
        });
        it('[4433]: Verify case assignment method is not applicable if user changes the case template', async () => {
            await navigationPage.gotoCaseConsole();
            await caseConsolePo.searchAndOpenCase(newCase3.displayId);
            expect(await viewCasePo.getAssigneeText()).toBe("Qadim Katawazi");
            await viewCasePo.clickEditCaseButton();
            await editCasePo.clickOnSelectCaseTemplate();
            await selectCasetemplateBladePo.selectCaseTemplate(caseTemplateName2);
            await editCasePo.clickSaveCase();
            expect(await viewCasePo.isAssigneeNameDisplayed()).toBeTruthy();
            expect(await viewCasePo.getAssignedGroupValue()).toBe('Workforce Administration');
            expect(await viewCasePo.getBusinessUnitText()).toBe('HR Support');
            await viewCasePo.clickEditCaseButton();
            await editCasePo.clickOnChangeCaseTemplate();
            await selectCasetemplateBladePo.selectCaseTemplate(caseTemplateName3);
            await editCasePo.clickSaveCase();
            await utilityCommon.closePopUpMessage();
            // verify support Group w.r.t template3 should be applied assignee, as none assignement method
            expect(await viewCasePo.getAssigneeText()).toBe('Qadim Katawazi');
            expect(await viewCasePo.getAssignedGroupValue()).toBe("US Support 3");
            expect(await viewCasePo.getBusinessUnitText()).toBe("United States Support");
        });
        it('[4433]: Verify case assignment method is not applicable if user changes the case template', async () => {
            await navigationPage.gotoCaseConsole();
            await caseConsolePo.searchAndOpenCase(newCase4.displayId);
            expect(await viewCasePo.getAssigneeText()).toBe("Qadim Katawazi");
            await viewCasePo.clickEditCaseButton();
            await editCasePo.clickOnSelectCaseTemplate();
            await selectCasetemplateBladePo.selectCaseTemplate(caseTemplateName3);
            await editCasePo.clickSaveCase();
            expect(await viewCasePo.getAssigneeText()).toBe('Qadim Katawazi');
            expect(await viewCasePo.getAssignedGroupValue()).toBe("US Support 3");
            expect(await viewCasePo.getBusinessUnitText()).toBe("United States Support");
            await viewCasePo.clickEditCaseButton();
            await editCasePo.clickOnChangeCaseTemplate();
            await selectCasetemplateBladePo.selectCaseTemplate(caseTemplateName2);
            await editCasePo.clickSaveCase();
            await utilityCommon.closePopUpMessage();
            // verify support Group w.r.t template2 should be applied any assignee, as round robin assignement method
            expect(await viewCasePo.isAssigneeNameDisplayed()).toBeTruthy();
            expect(await viewCasePo.getAssignedGroupValue()).toBe('Workforce Administration');
            expect(await viewCasePo.getBusinessUnitText()).toBe('HR Support');
        });
        afterAll(async () => {
            await utilityCommon.closeAllBlades();
            await navigationPage.signOut();
            await loginPage.login('qkatawazi');
        });
    });
    
    describe('[3797]: [RESOLVE_CASE_ON_LAST_TASK_COMPLETION] - Case behavior when Case Template is changed', async () => {
        let caseId, caseId1, randomStr = [...Array(5)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
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
                "businessUnit": "United States Support",
                "supportGroup": "US Support 3",
                "assignee": 'qkatawazi',
                "ownerBusinessUnit": "United States Support",
                "ownerGroup": "US Support 3"
            }
            let templateDataSetNO = {
                "templateName": `${caseTemplateNameWithNoValue}`,
                "templateSummary": `${caseTemplateSummaryNoValue}`,
                "templateStatus": "Active",
                "company": "Petramco",
                "resolveCaseonLastTaskCompletion": "0",
                "businessUnit": "United States Support",
                "supportGroup": "US Support 3",
                "assignee": 'qkatawazi',
                "ownerBusinessUnit": "United States Support",
                "ownerGroup": "US Support 3"
            }
            let taskTemplateData = {
                "templateName": `${manualTask}`,
                "templateSummary": `${ManualTaskTempSummary}`,
                "templateStatus": "Active",
                "taskCompany": "Petramco",
                "ownerCompany": "Petramco",
                "ownerBusinessUnit": "United States Support",
                "ownerGroup": "US Support 3",
                "supportGroup": "US Support 3",
                "assignee": 'qkatawazi'
            }
            await apiHelper.apiLogin('qkatawazi');
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
            caseId = await apiHelper.createCase(caseData);
            caseId1 = await apiHelper.createCase(caseData1);
        });
        it('[3797]: Case behavior when Case Template is changed', async () => {
            await navigationPage.gotoCaseConsole();
            await utilityGrid.searchAndOpenHyperlink(caseId1.displayId);
            await updateStatusBladePo.changeStatus('In Progress');
            await updateStatusBladePo.clickSaveStatus('In Progress');
        });
        it('[3797]: Case behavior when Case Template is changed', async () => {
            await utilityCommon.closePopUpMessage();
            await viewCasePo.clickOnTaskLink(ManualTaskTempSummary);
            await viewTaskPo.clickOnChangeStatus();
            await viewTaskPo.changeTaskStatus('Completed');
            await updateStatusBladePo.selectStatusReason('Successful');
            await updateStatusBladePo.clickSaveStatus();
            await utilityCommon.closePopUpMessage();
            await viewTaskPo.clickOnViewCase();
            await utilityCommon.clickOnApplicationWarningYesNoButton('Yes');
            expect(await viewCasePo.getCaseStatusValue()).toContain('In Progress');
        });
        it('[3797]: Case behavior when Case Template is changed', async () => {
            await navigationPage.gotoCaseConsole();
            await utilityGrid.searchAndOpenHyperlink(caseId.displayId);
            await updateStatusBladePo.changeStatus('In Progress');
            await updateStatusBladePo.clickSaveStatus('In Progress');
        });
        it('[3797]: [RESOLVE_CASE_ON_LAST_TASK_COMPLETION] - Case behavior when Case Template is changed', async () => {
            await viewCasePo.openTaskCard(1);
            await manageTaskBladePo.clickTaskLink(ManualTaskTempSummary);
            await viewTaskPo.clickOnChangeStatus();
            await viewTaskPo.changeTaskStatus('Completed');
            await updateStatusBladePo.selectStatusReason('Successful');
            await updateStatusBladePo.clickSaveStatus();
            await utilityCommon.closePopUpMessage();
            await viewTaskPo.clickOnViewCase();
            await utilityCommon.clickOnApplicationWarningYesNoButton('Yes');
            expect(await viewCasePo.getCaseStatusValue()).toContain('Resolved');
        });
    });
});
