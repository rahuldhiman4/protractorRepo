import consoleCasetemplatePo from '../../pageobject/settings/case-management/console-casetemplate.po';
import { browser } from "protractor";
import apiHelper from "../../api/api.helper";
import previewCasePo from '../../pageobject/case/case-preview.po';
import createCasePage from '../../pageobject/case/create-case.po';
import editCasePo from '../../pageobject/case/edit-case.po';
import quickCasePo from '../../pageobject/case/quick-case.po';
import selectCasetemplateBladePo from '../../pageobject/case/select-casetemplate-blade.po';
import viewCasePo from "../../pageobject/case/view-case.po";
import accessTabPo from '../../pageobject/common/access-tab.po';
import changeAssignmentBladePo from '../../pageobject/common/change-assignment.po';
import dynamicField from "../../pageobject/common/dynamic-fields.po";
import localizeValuePopPo from '../../pageobject/common/localize-value-pop.po';
import loginPage from "../../pageobject/common/login.po";
import navigationPage from "../../pageobject/common/navigation.po";
import createDynamicFieldLibraryConfigPo from '../../pageobject/settings/application-config/create-dynamic-field-library-config.po';
import dynamicFieldLibraryConfigConsolePo from '../../pageobject/settings/application-config/dynamic-field-library-config-console.po';
import editDynamicFieldLibraryConfigPo from '../../pageobject/settings/application-config/edit-dynamic-field-library-config.po';
import copyCasetemplatePo from '../../pageobject/settings/case-management/copy-casetemplate.po';
import editCasetemplatePo from '../../pageobject/settings/case-management/edit-casetemplate.po';
import viewCasetemplatePo from '../../pageobject/settings/case-management/view-casetemplate.po';
import selectTaskTemplate from "../../pageobject/settings/task-management/console-tasktemplate.po";
import viewTasktemplatePo from '../../pageobject/settings/task-management/view-tasktemplate.po';
import activityTabPo from '../../pageobject/social/activity-tab.po';
import { BWF_BASE_URL, BWF_PAGE_TITLES } from '../../utils/constants';
import utilityCommon from '../../utils/utility.common';
import utilityGrid from '../../utils/utility.grid';
import changeAssignmentPo from '../../pageobject/common/change-assignment.po';

describe('Dynamic Confidentials Data', () => {
    beforeAll(async () => {
        await browser.get(BWF_BASE_URL);
        await loginPage.login('jbarnes');
        await utilityGrid.selectLineOfBusiness('Human Resource');
    });

    afterAll(async () => {
        await utilityCommon.closeAllBlades();
        await navigationPage.signOut();
    });

    //ankagraw
    describe('[4058]: Validation of Confidential fields in Dynamic Field Group on Case', async () => {
        let caseTemplateData, caseId, randomStr = [...Array(4)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        beforeAll(async () => {
            caseTemplateData = {
                "templateName": randomStr + 'caseTemplateName',
                "templateSummary": 'CaseSummaryName' + randomStr,
                "caseStatus": "InProgress",
                "templateStatus": "Active",
                "assignee": "jbarnes",
                "company": "Petramco",
                "businessUnit": "India Support",
                "ownerBU": "India Support",
                "supportGroup": "IN Support 1",
                "ownerGroup": "IN Support 1"
            }
            await apiHelper.apiLogin('tadmin');
            await apiHelper.deleteDynamicFieldAndGroup();
            await apiHelper.apiLogin('jbarnes');
            let newCaseTemplate = await apiHelper.createCaseTemplate(caseTemplateData);
            await apiHelper.createDynamicDataOnTemplate(newCaseTemplate.id, 'CASE_TEMPLATE_WITH_CONFIDENTIAL');
        });
        it('[4058]: Validation of Confidential fields in Dynamic Field Group on Case', async () => {
            await navigationPage.gotoCreateCase();
            await createCasePage.selectRequester('adam');
            await createCasePage.setSummary('Summary' + randomStr);
            await createCasePage.clickSelectCaseTemplateButton();
            await selectCasetemplateBladePo.selectCaseTemplate(caseTemplateData.templateName);
            await createCasePage.clickAssignToMeButton();
            await createCasePage.clickSaveCaseButton();
            await utilityCommon.closePopUpMessage();
            await previewCasePo.clickGoToCaseButton();
            caseId = await viewCasePo.getCaseID();
            await viewCasePo.clickOnTab('Case Access');
            await accessTabPo.clickToExpandAccessEntitiySearch('Support Group Access', "Confidential Group");
            await accessTabPo.selectAccessEntityDropDown('IN Support 1', 'Select Support Group', true);
            await accessTabPo.clickAssignWriteAccessCheckbox('Support Group');
            await accessTabPo.clickAccessEntitiyAddButton('Support Group');
        });
        it('[4058]: Validation of Confidential fields in Dynamic Field Group on Case', async () => {
            await navigationPage.gotoCaseConsole();
            await utilityGrid.searchAndOpenHyperlink(caseId);
            await viewCasePo.clickEditCaseButton();
            await editCasePo.setDynamicFieldValue("LocalNonConfidentialDesc", "Test 1");
            await editCasePo.setDynamicFieldValue("LocalConfidentialDesc", "1234");
            await editCasePo.clickSaveCase();
            expect(await viewCasePo.getValueOfDynamicFields("LocalNonConfidentialDesc")).toBe("Test 1");
            expect(await viewCasePo.getValueOfDynamicFields("LocalConfidentialDesc")).toBe("1234");
            await viewCasePo.clickEditCaseButton();
            await changeAssignmentBladePo.setDropDownValue('AssignedGroup', 'GB Support 2');
            await editCasePo.clickSaveCase();
            await utilityCommon.closePopUpMessage();
        });
        it('[4058]: Validation of Confidential fields in Dynamic Field Group on Case', async () => {
            await navigationPage.signOut();
            await loginPage.login('qstrong');
            await navigationPage.gotoCaseConsole();
            await utilityGrid.searchAndOpenHyperlink(caseId);
            expect(await viewCasePo.getValueOfDynamicFields("LocalNonConfidentialDesc")).toBe("Test 1");
            expect(await viewCasePo.getValueOfDynamicFields("LocalConfidentialDesc")).toBe("******");
        });
        afterAll(async () => {
            await utilityCommon.closeAllBlades();
            await navigationPage.signOut();
            await loginPage.login('jbarnes');
            await utilityGrid.selectLineOfBusiness('Human Resource')
        });
    });

    describe('[4493,4489,4488]: [DesignTime] Add confidential support group on case template', async () => {
        let caseTemplateData, randomStr = [...Array(4)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        beforeAll(async () => {
            caseTemplateData = {
                "templateName": randomStr + 'caseTemplateName',
                "templateSummary": 'CaseSummaryName' + randomStr,
                "caseStatus": "InProgress",
                "templateStatus": "Draft",
                "assignee": "jbarnes",
                "company": "Petramco",
                "businessUnit": "India Support",
                "ownerBU": "India Support",
                "supportGroup": "IN Support 1",
                "ownerGroup": "IN Support 1"
            }
            await apiHelper.apiLogin('tadmin');
            await apiHelper.deleteDynamicFieldAndGroup();
            await apiHelper.apiLogin('jbarnes');
            await apiHelper.createCaseTemplate(caseTemplateData);
        });
        it('[4493,4489,4488]: [DesignTime] Add confidential support group on case template', async () => {
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Case Management--Templates', BWF_PAGE_TITLES.CASE_MANAGEMENT.TEMPLATES);
            await utilityGrid.searchAndOpenHyperlink(caseTemplateData.templateName);
            await viewCasetemplatePo.selectTab('Case Access');
            await accessTabPo.clickToExpandAccessEntitiyByGroup('Confidential Access');
            expect(await accessTabPo.isConfidentialSupportGroupDropDownPresent('Facilities')).toBeFalsy();
            await accessTabPo.selectAccessEntityDropDown('IN Support 1', 'Select Support Group');
            await accessTabPo.clickAssignWriteAccessCheckbox('Support Group');
            await accessTabPo.clickAccessEntitiyAddButton('Support Group');
            await accessTabPo.clickToExpandAccessEntitiyByGroup('Confidential Access');
            await accessTabPo.clickToExpandAccessEntitiyByGroup('Confidential Access');
            expect(await accessTabPo.isConfidentialSupportGroupDropDownPresent('Sensitive Personal Data (HR)')).toBeTruthy();
            await accessTabPo.selectAccessEntityDropDown('Sensitive Personal Data (HR)', 'Select Support Group');
            await accessTabPo.clickAccessEntitiyAddButton('Support Group');
        });
        it('[4493,4489,4488]: [DesignTime] Add confidential support group on case template', async () => {
            expect(await accessTabPo.isAccessTypeOfEntityDisplayed('IN Support 1', 'Write')).toBeTruthy('FailuerMsg1: Support Group is missing');
            expect(await accessTabPo.isAccessTypeOfEntityDisplayed('Sensitive Personal Data (HR)', 'Read')).toBeTruthy('FailuerMsg1: Support Group is missing');
            await accessTabPo.clickRemoveAccess("IN Support 1");
            await accessTabPo.clickAccessRemoveWarningBtn("Yes");
            await accessTabPo.clickRemoveAccess("Sensitive Personal Data (HR)");
            await accessTabPo.clickAccessRemoveWarningBtn("Yes");
            expect(await accessTabPo.isAccessTypeOfEntityDisplayed('IN Support 1', 'Write')).toBeFalsy('FailuerMsg1: Support Group Name is missing');
            expect(await accessTabPo.isAccessTypeOfEntityDisplayed('Sensitive Personal Data (HR)', 'Read')).toBeFalsy('FailuerMsg1: Support Group Name is missing');
            expect(await accessTabPo.isConfidentialSupportGroupDropDownPresent('Sensitive Personal Data (HR)')).toBeTruthy();
            await accessTabPo.selectAccessEntityDropDown('Sensitive Personal Data (HR)', 'Select Support Group');
            await accessTabPo.clickAccessEntitiyAddButton('Support Group');
            expect(await accessTabPo.isAccessTypeOfEntityDisplayed('Sensitive Personal Data (HR)', 'Read')).toBeTruthy('FailuerMsg1: Support Group is missing');
        });
        it('[4493,4489,4488]: [DesignTime] Add confidential support group on case template', async () => {
            await editCasetemplatePo.clickOnEditCaseTemplateMetadata();
            await editCasetemplatePo.changeTemplateStatusDropdownValue('Active');
            await editCasetemplatePo.clickOnSaveCaseTemplateMetadata();
            await viewCasetemplatePo.selectTab('Case Access');
            expect(await accessTabPo.isConfidentialSupportGroupAccessAbsent()).toBeFalsy();
            await viewCasetemplatePo.clickBackArrowBtn();
        });
    });

    //ankagraw
    describe('[4478]: Validation of Confidential fields in Dynamic Field Group on Case', async () => {
        let caseTemplateData, caseId, randomStr = [...Array(4)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        beforeAll(async () => {
            caseTemplateData = {
                "templateName": randomStr + 'QuickcaseTemplateName',
                "templateSummary": 'CaseSummaryName' + randomStr,
                "caseStatus": "InProgress",
                "templateStatus": "Active",
                "assignee": "jbarnes",
                "company": "Petramco",
                "businessUnit": "India Support",
                "ownerBU": "India Support",
                "supportGroup": "IN Support 1",
                "ownerGroup": "IN Support 1"
            }
            await apiHelper.apiLogin('tadmin');
            await apiHelper.deleteDynamicFieldAndGroup();
            await apiHelper.apiLogin('jbarnes');
            let newCaseTemplate = await apiHelper.createCaseTemplate(caseTemplateData);
            await apiHelper.createDynamicDataOnTemplate(newCaseTemplate.id, 'CASE_TEMPLATE_WITH_CONFIDENTIAL');
        });
        it('[4478]: Validation of Confidential fields in Dynamic Field Group on Case', async () => {
            await navigationPage.gotoQuickCase();
            await quickCasePo.selectRequesterName('fritz');
            await quickCasePo.selectCaseTemplate(caseTemplateData.templateName);
            await quickCasePo.saveCase();
            await previewCasePo.clickGoToCaseButton();
            caseId = await viewCasePo.getCaseID();
            await viewCasePo.clickOnTab('Case Access');
            await accessTabPo.clickToExpandAccessEntitiySearch('Support Group Access', "Confidential Group");
            await accessTabPo.selectAccessEntityDropDown('IN Support 1', 'Select Support Group', true);
            await accessTabPo.clickAssignWriteAccessCheckbox('Support Group');
            await accessTabPo.clickAccessEntitiyAddButton('Support Group');
        });
        it('[4478]: Validation of Confidential fields in Dynamic Field Group on Case', async () => {
            await navigationPage.gotoCaseConsole();
            await utilityGrid.searchAndOpenHyperlink(caseId);
            await navigationPage.gotoPersonProfile();
            expect(await activityTabPo.isTextPresentInActivityLog("Added the confidential support group")).toBeTruthy();
        });
    });

    describe('[4487,4486,4492]: [DesignTime] Add confidential support group on case template - Global Company', async () => {
        let caseTemplateData, randomStr = [...Array(4)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        beforeAll(async () => {
            caseTemplateData = {
                "templateName": randomStr + 'caseTemplateName',
                "templateSummary": 'CaseSummaryName' + randomStr,
                "caseStatus": "InProgress",
                "templateStatus": "Draft",
                "assignee": "jbarnes",
                "company": '- Global -',
                "businessUnit": "India Support",
                "ownerBU": "India Support",
                "supportGroup": "IN Support 1",
                "ownerGroup": "IN Support 1"
            }
            await apiHelper.apiLogin('tadmin');
            await apiHelper.deleteDynamicFieldAndGroup();
            await apiHelper.apiLogin('jbarnes');
            await apiHelper.createCaseTemplate(caseTemplateData);
        });
        it('[4487,4486,4492]: [DesignTime] Add confidential support group on case template - Global Company', async () => {
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Case Management--Templates', BWF_PAGE_TITLES.CASE_MANAGEMENT.TEMPLATES);
            await utilityGrid.searchAndOpenHyperlink(randomStr + 'caseTemplateName');
            await viewCasetemplatePo.selectTab('Case Access');
            await accessTabPo.clickToExpandAccessEntitiyByGroup('Confidential Access');
            expect(await accessTabPo.isConfidentialSupportGroupDropDownPresent("IN Support 1")).toBeTruthy();
            await accessTabPo.selectAccessEntityDropDown('IN Support 1', 'Select Support Group');
            await accessTabPo.clickAccessEntitiyAddButton('Support Group');
        });
        it('[4487,4486,4492]: [DesignTime] Add confidential support group on case template - Global Company', async () => {
            expect(await accessTabPo.isConfidentialSupportGroupDropDownPresent("Sensitive Personal Data (HR)")).toBeTruthy();
            await accessTabPo.selectAccessEntityDropDown('Sensitive Personal Data (HR)', 'Select Support Group');
            await accessTabPo.clickAccessEntitiyAddButton('Support Group');
            expect(await accessTabPo.isConfidentialSupportGroupDropDownPresent("IN Support 2")).toBeTruthy();
            await accessTabPo.selectAccessEntityDropDown('IN Support 2', 'Select Support Group');
            await accessTabPo.clickAccessEntitiyAddButton('Support Group');
            expect(await accessTabPo.isConfidentialSupportGroupDropDownPresent("IN Support 3")).toBeTruthy();
            await accessTabPo.selectAccessEntityDropDown('IN Support 3', 'Select Support Group');
            await accessTabPo.clickAccessEntitiyAddButton('Support Group');
            expect(await accessTabPo.isConfidentialSupportGroupDropDownPresent("LA Support 1")).toBeTruthy();
            await accessTabPo.selectAccessEntityDropDown('LA Support 1', 'Select Support Group');
            await accessTabPo.clickAccessEntitiyAddButton('Support Group');
        });
        it('[4487,4486,4492]: [DesignTime] Add confidential support group on case template - Global Company', async () => {
            expect(await accessTabPo.isConfidentialSupportGroupDropDownPresent("LA Support 2")).toBeTruthy();
            await accessTabPo.selectAccessEntityDropDown('LA Support 2', 'Select Support Group');
            await accessTabPo.clickAssignWriteAccessCheckbox('Support Group');
            await accessTabPo.clickAccessEntitiyAddButton('Support Group');
            expect(await accessTabPo.isConfidentialSupportGroupDropDownPresent("LA Support 3")).toBeTruthy();
            await accessTabPo.selectAccessEntityDropDown('LA Support 3', 'Select Support Group');
            await accessTabPo.clickAssignWriteAccessCheckbox('Support Group');
            await accessTabPo.clickAccessEntitiyAddButton('Support Group');
        });
        it('[4487,4486,4492]: [DesignTime] Add confidential support group on case template - Global Company', async () => {
            expect(await accessTabPo.isConfidentialSupportGroupDropDownPresent("Employee Relations Sensitive Data Access")).toBeTruthy();
            await accessTabPo.selectAccessEntityDropDown('Employee Relations Sensitive Data Access', 'Select Support Group');
            await accessTabPo.clickAssignWriteAccessCheckbox('Support Group');
            await accessTabPo.clickAccessEntitiyAddButton('Support Group');
        });
        it('[4487,4486,4492]: [DesignTime] Add confidential support group on case template - Global Company', async () => {
            expect(await accessTabPo.isConfidentialSupportGroupDropDownPresent("Employee Relations Sensitive Data Access")).toBeTruthy();
            await accessTabPo.selectAccessEntityDropDown('Employee Relations Sensitive Data Access', 'Select Support Group');
            await accessTabPo.clickAccessEntitiyAddButton('Support Group');
            expect(await accessTabPo.getSupportGroupWarningMessage()).toContain("The group already exists in the access list.");
            await viewCasetemplatePo.clickBackArrowBtn();
            await consoleCasetemplatePo.searchAndselectCaseTemplate(randomStr + 'caseTemplateName');
            await consoleCasetemplatePo.clickOnCopyCaseTemplate();
            await copyCasetemplatePo.setTemplateName(randomStr + "Copy Case Template");
            await changeAssignmentPo.setAssignee("US Support 3", "Qadim Katawazi");
            await copyCasetemplatePo.clickSaveCaseTemplate();
            await utilityCommon.closePopUpMessage();
            await viewCasetemplatePo.selectTab('Case Access');
            expect(await accessTabPo.isAccessTypeOfEntityDisplayed('IN Support 1', 'Read')).toBeTruthy('FailuerMsg1: Support Group is missing');
            expect(await accessTabPo.isAccessTypeOfEntityDisplayed('IN Support 2', 'Read')).toBeTruthy('FailuerMsg1: Support Group is missing');
            expect(await accessTabPo.isAccessTypeOfEntityDisplayed('IN Support 3', 'Read')).toBeTruthy('FailuerMsg1: Support Group is missing');
            expect(await accessTabPo.isAccessTypeOfEntityDisplayed('LA Support 1', 'Read')).toBeTruthy('FailuerMsg1: Support Group is missing');
            expect(await accessTabPo.isAccessTypeOfEntityDisplayed('LA Support 2', 'Write')).toBeTruthy('FailuerMsg1: Support Group is missing');
            expect(await accessTabPo.isAccessTypeOfEntityDisplayed('LA Support 3', 'Write')).toBeTruthy('FailuerMsg1: Support Group is missing');
            expect(await accessTabPo.isAccessTypeOfEntityDisplayed('Sensitive Personal Data (HR)', 'Read')).toBeTruthy('FailuerMsg1: Support Group is missing');
            expect(await accessTabPo.isAccessTypeOfEntityDisplayed('Employee Relations Sensitive Data Access', 'Write')).toBeTruthy('FailuerMsg1: Support Group is missing');
            await viewCasetemplatePo.clickBackArrowBtn();
        });
    });

    //ankagraw
    describe('[4479]: [RunTime]Create Case with template which has confidential fields with Requester source of information', async () => {
        let caseId, caseTemplateData, randomStr = [...Array(4)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        beforeAll(async () => {
            caseTemplateData = {
                "templateName": randomStr + 'caseTemplateName',
                "templateSummary": 'CaseSummaryName' + randomStr,
                "caseStatus": "InProgress",
                "templateStatus": "Active",
                "assignee": "jbarnes",
                "company": "Petramco",
                "businessUnit": "India Support",
                "ownerBU": "India Support",
                "supportGroup": "IN Support 1",
                "ownerGroup": "IN Support 1"
            }
            await apiHelper.apiLogin('tadmin');
            await apiHelper.deleteDynamicFieldAndGroup();
            await apiHelper.apiLogin('jbarnes');
            let newCaseTemplate = await apiHelper.createCaseTemplate(caseTemplateData);
            await apiHelper.createDynamicDataOnTemplate(newCaseTemplate.id, 'DynamicGroupContainsConfidentialsFieldDRDMV15041');
        });
        it('[4479]: [RunTime]Create Case with template which has confidential fields with Requester source of information', async () => {
            await navigationPage.gotoQuickCase();
            await quickCasePo.selectRequesterName('adam');
            await quickCasePo.selectCaseTemplate(caseTemplateData.templateName);
            await quickCasePo.saveCase();
            await previewCasePo.clickGoToCaseButton();
            caseId = await viewCasePo.getCaseID();
            await viewCasePo.clickOnTab('Case Access');
            await accessTabPo.clickToExpandAccessEntitiySearch('Support Group Access', "Confidential Group");
            await accessTabPo.selectAccessEntityDropDown('IN Support 1', 'Select Support Group', true);
            await accessTabPo.clickAssignWriteAccessCheckbox('Support Group');
            await accessTabPo.clickAccessEntitiyAddButton('Support Group');
            await navigationPage.gotoCaseConsole();
            await utilityGrid.searchAndOpenHyperlink(caseId);
            await viewCasePo.clickEditCaseButton();
            await editCasePo.setDynamicFieldValue('FieldGroup1', 'test');
            await editCasePo.clickSaveCase();
            await viewCasePo.getValueOfDynamicFields("FieldGroup1");
        });

        it('[4479]: [RunTime]Create Case with template which has confidential fields with Requester source of information', async () => {
            await navigationPage.signOut();
            await loginPage.login("qtao");
            await navigationPage.gotoQuickCase();
            await quickCasePo.selectRequesterName('adam');
            await quickCasePo.selectCaseTemplate(caseTemplateData.templateName);
            await quickCasePo.saveCase();
            await previewCasePo.clickGoToCaseButton();
            expect(await viewCasePo.getValueOfDynamicFields("FieldGroup1")).toBe("******");
        });
        afterAll(async () => {
            await utilityCommon.closeAllBlades();
            await navigationPage.signOut();
            await loginPage.login("jbarnes");
        });

    });

    //ankagraw
    describe('[4482,4873]: [DesignTime] Availability of Confidential checkbox on all types of dynamic fields', async () => {
        let caseTemplateData, templateData, randomStr = [...Array(4)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        let drpValue: string[] = ["TEXT", "NUMBER", "DATE", "BOOLEAN", "LIST", "ATTACHMENT", "DATE_TIME", "TIME"];
        let status: string[] = ["Active", "Inactive"];
        let imformationSource: string[] = ["Requester", "Agent", "Task Assignee", "System"];
        beforeAll(async () => {
            templateData = {
                "templateName": `manualTaskTemplate1 ${randomStr}`,
                "templateSummary": `manualTaskTemplateSummary1 ${randomStr}`,
                "templateStatus": "Draft",
                "taskCompany": 'Petramco',
                "ownerCompany": "Petramco",
                "ownerBusinessUnit": "India Support",
                "ownerGroup": "IN Support 1"
            }
            caseTemplateData = {
                "templateName": randomStr + 'caseTemplateName',
                "templateSummary": 'CaseSummaryName' + randomStr,
                "caseStatus": "InProgress",
                "templateStatus": "Draft",
                "assignee": "jbarnes",
                "company": "Petramco",
                "businessUnit": "India Support",
                "ownerBU": "India Support",
                "supportGroup": "IN Support 1",
                "ownerGroup": "IN Support 1"
            }

            await apiHelper.apiLogin('tadmin');
            await apiHelper.deleteDynamicFieldAndGroup();
            await apiHelper.apiLogin('jbarnes');
            await apiHelper.createManualTaskTemplate(templateData);
            await apiHelper.createCaseTemplate(caseTemplateData);
        });
        it('[4482,4873]: [DesignTime] Availability of Confidential checkbox on all types of dynamic fields', async () => {
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Application Configuration--Dynamic Field Library', BWF_PAGE_TITLES.APPLICATION_CONFIGURATIONS.DYNAMIC_FILED_LIBRARY);
            await dynamicFieldLibraryConfigConsolePo.clickAddDynamicFieldButton();
            expect(await createDynamicFieldLibraryConfigPo.isConfidentialsRadioButtonDisplayed()).toBeTruthy("isConfidentialsRadioButtonDisplayed");
            expect(await createDynamicFieldLibraryConfigPo.isFieldNameRequiredText()).toBeTruthy("isFieldNameRequiredText");
            expect(await createDynamicFieldLibraryConfigPo.isFieldValueTypeRequiredText()).toBeTruthy("isFieldValueTypeRequiredText");
            expect(await createDynamicFieldLibraryConfigPo.isInformationSoucreRequiredText()).toBeTruthy("isInformationSoucreRequiredText");
            expect(await createDynamicFieldLibraryConfigPo.isStatusRequiredText()).toBeTruthy("isStatusRequiredText");
            expect(await createDynamicFieldLibraryConfigPo.isFieldDescriptionRequiredText()).toBeTruthy("isFieldDescriptionRequiredText");
            expect(await createDynamicFieldLibraryConfigPo.isInformationSourceDropDownPresent(imformationSource)).toBeTruthy("isInformationSourceDropDownPresent");
            await createDynamicFieldLibraryConfigPo.setFieldName('LibTextField' + randomStr);
            expect(await createDynamicFieldLibraryConfigPo.isFieldValueTypeDropDownPresent(drpValue)).toBeTruthy("isFieldValueTypeDropDownPresent");
            expect(await createDynamicFieldLibraryConfigPo.isStatusDropDownPresent(status)).toBeTruthy("isStatusDropDownPresent");
            await createDynamicFieldLibraryConfigPo.clickOnLocalizeButton();
            await localizeValuePopPo.setLocalizeValue('LibTextField' + randomStr);
            await localizeValuePopPo.clickOnSaveButton();
            await createDynamicFieldLibraryConfigPo.setStatusValue('Active');
            await createDynamicFieldLibraryConfigPo.setInformationSourceValueType('Agent');
            await createDynamicFieldLibraryConfigPo.setFieldValueType('TEXT');
            await createDynamicFieldLibraryConfigPo.clickOnActiveConfidentialsCheckbox();
            await createDynamicFieldLibraryConfigPo.clickOnSaveButton();
        });
        it('[4482,4873]: [DesignTime] Availability of Confidential checkbox on all types of dynamic fields', async () => {
            await utilityGrid.searchAndOpenHyperlink('LibTextField' + randomStr);
            expect(await editDynamicFieldLibraryConfigPo.isFieldNameRequiredText()).toBeTruthy("isFieldNameRequiredText");
            expect(await editDynamicFieldLibraryConfigPo.isFieldDescriptionRequiredText()).toBeTruthy("isFieldDescriptionRequiredText");
            expect(await editDynamicFieldLibraryConfigPo.isStatusRequiredText()).toBeTruthy("isStatusRequiredText");
            expect(await editDynamicFieldLibraryConfigPo.isInformationSoucreRequiredText()).toBeTruthy("isInformationSoucreRequiredText");
            expect(await editDynamicFieldLibraryConfigPo.isFieldValueTypeRequiredText()).toBeTruthy("isFieldValueTypeRequiredText");
            expect(await editDynamicFieldLibraryConfigPo.isFieldNameAttribute("readonly")).toBe("true");
            expect(await editDynamicFieldLibraryConfigPo.isFieldValueTypeAttribute("aria-disabled")).toBe("true");
            await editDynamicFieldLibraryConfigPo.clickOnLocalizeButton();
            await localizeValuePopPo.setLocalizeValue('LibTextField' + randomStr);
            await localizeValuePopPo.clickOnSaveButton();
            await editDynamicFieldLibraryConfigPo.clickEnabledRequiredRadioButton();
            await editDynamicFieldLibraryConfigPo.setInformationSourceValueType("System");
            await editDynamicFieldLibraryConfigPo.setStatusValue("Inactive");
            await editDynamicFieldLibraryConfigPo.clickOnSaveButton();
        });

        it('[4482,4873]: [DesignTime] Availability of Confidential checkbox on all types of dynamic fields', async () => {
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Task Management--Templates', BWF_PAGE_TITLES.TASK_MANAGEMENT.TEMPLATES);
            await selectTaskTemplate.searchAndOpenTaskTemplate(templateData.templateName);
            await viewTasktemplatePo.clickOnManageDynamicFieldLink();
            await dynamicField.clickOnDynamicField();
            expect(await dynamicField.isConfidentialsRadioButtonDisplayed()).toBeTruthy();
            await dynamicField.clickEnabledConfidentialsRadioButton();
            await dynamicField.setFieldName("test" + randomStr);
            await dynamicField.setDescriptionName("test 123" + randomStr);
            await dynamicField.clickEnabledConfidentialsRadioButton();
            await dynamicField.clickSaveButton();
            await utilityCommon.closePopUpMessage();
            await viewTasktemplatePo.clickBackArrowBtn();
        });

        it('[4482,4873]: [DesignTime] Availability of Confidential checkbox on all types of dynamic fields', async () => {
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Case Management--Templates', BWF_PAGE_TITLES.CASE_MANAGEMENT.TEMPLATES);
            await utilityGrid.searchAndOpenHyperlink(caseTemplateData.templateName);
            await viewCasetemplatePo.clickOnMangeDynamicFieldLink();
            await dynamicField.clickOnDynamicField();
            expect(await dynamicField.isConfidentialsRadioButtonDisplayed()).toBeTruthy();
            await dynamicField.setFieldName("testing 111" + randomStr);
            await dynamicField.setDescriptionName("testing 111" + randomStr);
            await dynamicField.clickEnabledConfidentialsRadioButton();
            await dynamicField.clickSaveButton();
            await utilityCommon.closePopUpMessage();
        });
        afterAll(async () => {
            await viewCasetemplatePo.clickBackArrowBtn();
        });
    });
});