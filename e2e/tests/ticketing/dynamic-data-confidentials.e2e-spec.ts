import dynamicFieldLibraryConfigConsolePo from '../../pageobject/settings/application-config/dynamic-field-library-config-console.po';
import { browser } from "protractor";
import apiHelper from "../../api/api.helper";
import previewCasePo from '../../pageobject/case/case-preview.po';
import createCasePage from '../../pageobject/case/create-case.po';
import editCasePo from '../../pageobject/case/edit-case.po';
import quickCasePo from '../../pageobject/case/quick-case.po';
import selectCasetemplateBladePo from '../../pageobject/case/select-casetemplate-blade.po';
import viewCasePo from "../../pageobject/case/view-case.po";
import accessTabPo from '../../pageobject/common/access-tab.po';
import changeAssignmentBladePo from '../../pageobject/common/change-assignment-blade.po';
import loginPage from "../../pageobject/common/login.po";
import navigationPage from "../../pageobject/common/navigation.po";
import copyCasetemplatePo from '../../pageobject/settings/case-management/copy-casetemplate.po';
import editCasetemplatePo from '../../pageobject/settings/case-management/edit-casetemplate.po';
import viewCasetemplatePo from '../../pageobject/settings/case-management/view-casetemplate.po';
import consoleFlowsetConfigPo from '../../pageobject/settings/manage-flowset/console-flowset-config.po';
import createFlowsetConfigPo from '../../pageobject/settings/manage-flowset/create-flowset-config.po';
import editFlowsetConfigPo from '../../pageobject/settings/manage-flowset/edit-flowset-config.po';
import activityTabPo from '../../pageobject/social/activity-tab.po';
import { BWF_BASE_URL } from '../../utils/constants';
import utilGrid from '../../utils/util.grid';
import selectTaskTemplate from "../../pageobject/settings/task-management/console-tasktemplate.po";
import utilityCommon from '../../utils/utility.common';
import utilCommon from '../../utils/util.common';
import dynamicField from "../../pageobject/common/dynamic-fields.po";
import utilityGrid from '../../utils/utility.grid';
import createDynamicFieldLibraryConfigPo from '../../pageobject/settings/application-config/create-dynamic-field-library-config.po';
import localizeValuePopPo from '../../pageobject/common/localize-value-pop.po';
import viewTasktemplatePo from '../../pageobject/settings/task-management/view-tasktemplate.po';
import editDynamicFieldLibraryConfigPo from '../../pageobject/settings/application-config/edit-dynamic-field-library-config.po';
import caseAccessTabOldPo from '../../pageobject/common/common-services/case-access-tab-old.po';

describe('Dynamic Confidentials Data', () => {
    beforeAll(async () => {
        await browser.get(BWF_BASE_URL);
        await loginPage.login('qkatawazi');
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
                "assignee": "qkatawazi",
                "company": "Petramco",
                "businessUnit": "United States Support",
                "ownerBU": "United States Support",
                "supportGroup": "US Support 3",
                "ownerGroup": "US Support 3"
            }
            await apiHelper.apiLogin('tadmin');
            await apiHelper.deleteDynamicFieldAndGroup();
            await apiHelper.apiLogin('qkatawazi');
            let newCaseTemplate = await apiHelper.createCaseTemplate(caseTemplateData);
            await apiHelper.createDynamicDataOnTemplate(newCaseTemplate.id, 'CASE_TEMPLATE_WITH_CONFIDENTIAL');
            await apiHelper.apiLogin('tadmin');
            await apiHelper.updateFoundationEntity('SupportGroup', 'US Support 3', { confidential: 'true' });
        });
        it('[4058]: Validation of Confidential fields in Dynamic Field Group on Case', async () => {
            await navigationPage.gotoCreateCase();
            await createCasePage.selectRequester('adam');
            await createCasePage.setSummary('Summary' + randomStr);
            await createCasePage.clickSelectCaseTemplateButton();
            await selectCasetemplateBladePo.selectCaseTemplate(caseTemplateData.templateName);
            await createCasePage.clickAssignToMeButton();
            await createCasePage.clickSaveCaseButton();
            await previewCasePo.clickGoToCaseButton();
            caseId = await viewCasePo.getCaseID();
            await viewCasePo.clickOnTab('Case Access');
            await accessTabPo.clickToExpandAccessEntitiySearch('Support Group Access', "Confidential Group");
            await accessTabPo.selectAccessEntityDropDown('US Support 3', 'Select Support Group', true);
            await accessTabPo.clickAssignWriteAccessCheckbox('Support Group');
            await accessTabPo.clickAccessEntitiyAddButton('Support Group');
        });
        it('[4058]: Validation of Confidential fields in Dynamic Field Group on Case', async () => {
            await navigationPage.gotoCaseConsole();
            await utilityGrid.searchAndOpenHyperlink(caseId);
            await viewCasePo.clickEditCaseButton();
            await editCasePo.setDynamicFieldValue("LocalNonConfidentialDesc", "Test 1");
            await editCasePo.setDynamicFieldValue("LocalConfidentialDesc", "1234");
            await changeAssignmentBladePo.selectCompany('Petramco');
            await changeAssignmentBladePo.selectBusinessUnit("United Kingdom Support");
            await changeAssignmentBladePo.selectSupportGroup('GB Support 2');
            await editCasePo.clickSaveCase();
        });
        it('[4058]: Validation of Confidential fields in Dynamic Field Group on Case', async () => {
            expect(await viewCasePo.getValueOfDynamicFields("LocalNonConfidentialDesc")).toBe("Test 1");
            expect(await viewCasePo.getValueOfDynamicFields("LocalConfidentialDesc")).toBe("1234");
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
            await loginPage.login('qkatawazi');
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
                "assignee": "qkatawazi",
                "company": "Petramco",
                "businessUnit": "United States Support",
                "ownerBU": "United States Support",
                "supportGroup": "US Support 3",
                "ownerGroup": "US Support 3"
            }
            await apiHelper.apiLogin('tadmin');
            await apiHelper.deleteDynamicFieldAndGroup();
            await apiHelper.apiLogin('qkatawazi');
            await apiHelper.createCaseTemplate(caseTemplateData);
            await apiHelper.apiLogin('tadmin');
            await apiHelper.updateFoundationEntity('SupportGroup', 'US Support 3', { confidential: 'true' });
        });
        it('[4493,4489,4488]: [DesignTime] Add confidential support group on case template', async () => {
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Case Management--Templates', 'Case Templates - Business Workflows');
            await utilGrid.searchAndOpenHyperlink(caseTemplateData.templateName);
            await viewCasetemplatePo.selectTab('Case Access');
            await caseAccessTabOldPo.clickConfidentialSupportGroupAccess();
            expect(await caseAccessTabOldPo.isConfidentialSupportGroupDropDownPresent("Facilities")).toBeFalsy();
            await caseAccessTabOldPo.selectConfidentialSupportGroupDropDown("US Support 3");
            await caseAccessTabOldPo.clickConfidentialWriteSupportGroupAccess();
            await caseAccessTabOldPo.clickAddConfidentialSupportGroup();
            await caseAccessTabOldPo.clickConfidentialSupportGroupAccess();
            expect(await caseAccessTabOldPo.isConfidentialSupportGroupDropDownPresent("Sensitive Personal Data (HR)")).toBeTruthy();
            await caseAccessTabOldPo.selectConfidentialSupportGroupDropDown("Sensitive Personal Data (HR)");
            await caseAccessTabOldPo.clickAddConfidentialSupportGroup();
        });
        it('[4493,4489,4488]: [DesignTime] Add confidential support group on case template', async () => {
            expect(await caseAccessTabOldPo.isConfidentialSupportGroupValueTextDisplayed("US Support 3")).toBeTruthy();
            expect(await caseAccessTabOldPo.isConfidentialSupportGroupValueTextDisplayed("Sensitive Personal Data (HR)")).toBeTruthy();
            await caseAccessTabOldPo.clickDeleteConfidentialSupportGroup();
            await caseAccessTabOldPo.clickDeleteConfidentialSupportGroup();
            expect(await caseAccessTabOldPo.isConfidentialSupportGroupValueTextDisplayed("US Support 3")).toBeFalsy();
            expect(await caseAccessTabOldPo.isConfidentialSupportGroupValueTextDisplayed("Sensitive Personal Data (HR)")).toBeFalsy();
            await caseAccessTabOldPo.clickConfidentialSupportGroupAccess();
            expect(await caseAccessTabOldPo.isConfidentialSupportGroupDropDownPresent("Sensitive Personal Data (HR)")).toBeTruthy();
            await caseAccessTabOldPo.selectConfidentialSupportGroupDropDown("Sensitive Personal Data (HR)");
            await caseAccessTabOldPo.clickAddConfidentialSupportGroup();
            expect(await caseAccessTabOldPo.isConfidentialSupportGroupValueTextDisplayed("Sensitive Personal Data (HR)")).toBeTruthy();
        });
        it('[4493,4489,4488]: [DesignTime] Add confidential support group on case template', async () => {
            await editCasetemplatePo.clickOnEditCaseTemplateMetadata();
            await editCasetemplatePo.changeTemplateStatusDropdownValue('Active');
            await editCasetemplatePo.clickOnSaveCaseTemplateMetadata();
            await viewCasetemplatePo.selectTab('Case Access');
            expect(await caseAccessTabOldPo.isConfidentialSupportGroupAccess()).toBeFalsy();

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
                "assignee": "qkatawazi",
                "company": "Petramco",
                "businessUnit": "United States Support",
                "ownerBU": "United States Support",
                "supportGroup": "US Support 3",
                "ownerGroup": "US Support 3"
            }
            await apiHelper.apiLogin('tadmin');
            await apiHelper.deleteDynamicFieldAndGroup();
            await apiHelper.apiLogin('qkatawazi');
            let newCaseTemplate = await apiHelper.createCaseTemplate(caseTemplateData);
            await apiHelper.createDynamicDataOnTemplate(newCaseTemplate.id, 'CASE_TEMPLATE_WITH_CONFIDENTIAL');
            await apiHelper.apiLogin('tadmin');
            await apiHelper.updateFoundationEntity('SupportGroup', 'US Support 3', { confidential: 'true' });
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
            await accessTabPo.selectAccessEntityDropDown('US Support 3', 'Select Support Group', true);
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
                "assignee": "qkatawazi",
                "company": '- Global -',
                "businessUnit": "United States Support",
                "ownerBU": "United States Support",
                "supportGroup": "US Support 3",
                "ownerGroup": "US Support 3"
            }
            await apiHelper.apiLogin('tadmin');
            await apiHelper.deleteDynamicFieldAndGroup();
            await apiHelper.apiLogin('qkatawazi');
            await apiHelper.createCaseTemplate(caseTemplateData);
            await apiHelper.apiLogin('tadmin');
            await apiHelper.updateFoundationEntity('SupportGroup', 'US Support 3', { confidential: 'true' });
            await apiHelper.updateFoundationEntity('SupportGroup', 'AU Support 1', { confidential: 'true' });
            await apiHelper.updateFoundationEntity('SupportGroup', 'AU Support 2', { confidential: 'true' });
            await apiHelper.updateFoundationEntity('SupportGroup', 'AU Support 3', { confidential: 'true' });
            await apiHelper.updateFoundationEntity('SupportGroup', 'AU Support 4', { confidential: 'true' });
            await apiHelper.updateFoundationEntity('SupportGroup', 'CA Support 1', { confidential: 'true' });
            await apiHelper.updateFoundationEntity('SupportGroup', 'CA Support 2', { confidential: 'true' });
            await apiHelper.updateFoundationEntity('SupportGroup', 'CA Support 3', { confidential: 'true' });
        });
        it('[4487,4486,4492]: [DesignTime] Add confidential support group on case template - Global Company', async () => {
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Case Management--Templates', 'Case Templates - Business Workflows');
            await utilGrid.searchAndOpenHyperlink(randomStr + 'caseTemplateName');
            await viewCasetemplatePo.selectTab('Case Access');
            await caseAccessTabOldPo.clickConfidentialSupportGroupAccess();
            expect(await caseAccessTabOldPo.isConfidentialSupportGroupDropDownPresent("AU Support 1")).toBeTruthy();
            await caseAccessTabOldPo.selectConfidentialSupportGroupDropDown("AU Support 1");
            await caseAccessTabOldPo.clickAddConfidentialSupportGroup();
            await caseAccessTabOldPo.clickConfidentialSupportGroupAccess();
            expect(await caseAccessTabOldPo.isConfidentialSupportGroupDropDownPresent("Sensitive Personal Data (HR)")).toBeTruthy();
            await caseAccessTabOldPo.selectConfidentialSupportGroupDropDown("Sensitive Personal Data (HR)");
        });
        it('[4487,4486,4492]: [DesignTime] Add confidential support group on case template - Global Company', async () => {
            await caseAccessTabOldPo.clickAddConfidentialSupportGroup();
            await caseAccessTabOldPo.clickConfidentialSupportGroupAccess();
            expect(await caseAccessTabOldPo.isConfidentialSupportGroupDropDownPresent("AU Support 2")).toBeTruthy();
            await caseAccessTabOldPo.selectConfidentialSupportGroupDropDown("AU Support 2");
            await caseAccessTabOldPo.clickAddConfidentialSupportGroup();
            await caseAccessTabOldPo.clickConfidentialSupportGroupAccess();
            expect(await caseAccessTabOldPo.isConfidentialSupportGroupDropDownPresent("AU Support 3")).toBeTruthy();
            await caseAccessTabOldPo.selectConfidentialSupportGroupDropDown("AU Support 3");
            await caseAccessTabOldPo.clickAddConfidentialSupportGroup();
            await caseAccessTabOldPo.clickConfidentialSupportGroupAccess();
            expect(await caseAccessTabOldPo.isConfidentialSupportGroupDropDownPresent("AU Support 4")).toBeTruthy();
            await caseAccessTabOldPo.selectConfidentialSupportGroupDropDown("AU Support 4");
            await caseAccessTabOldPo.clickAddConfidentialSupportGroup();
        });
        it('[4487,4486,4492]: [DesignTime] Add confidential support group on case template - Global Company', async () => {
            await caseAccessTabOldPo.clickConfidentialSupportGroupAccess();
            expect(await caseAccessTabOldPo.isConfidentialSupportGroupDropDownPresent("US Support 3")).toBeTruthy();
            await caseAccessTabOldPo.selectConfidentialSupportGroupDropDown("US Support 3");
            await caseAccessTabOldPo.clickConfidentialWriteSupportGroupAccess();
            await caseAccessTabOldPo.clickAddConfidentialSupportGroup();
            await caseAccessTabOldPo.clickConfidentialSupportGroupAccess();
            expect(await caseAccessTabOldPo.isConfidentialSupportGroupDropDownPresent("CA Support 1")).toBeTruthy();
            await caseAccessTabOldPo.selectConfidentialSupportGroupDropDown("CA Support 1");
            await caseAccessTabOldPo.clickConfidentialWriteSupportGroupAccess();
            await caseAccessTabOldPo.clickAddConfidentialSupportGroup();
        });
        it('[4487,4486,4492]: [DesignTime] Add confidential support group on case template - Global Company', async () => {
            await caseAccessTabOldPo.clickConfidentialSupportGroupAccess();
            expect(await caseAccessTabOldPo.isConfidentialSupportGroupDropDownPresent("CA Support 2")).toBeTruthy();
            await caseAccessTabOldPo.selectConfidentialSupportGroupDropDown("CA Support 2");
            await caseAccessTabOldPo.clickConfidentialWriteSupportGroupAccess();
            await caseAccessTabOldPo.clickAddConfidentialSupportGroup();
            await caseAccessTabOldPo.clickConfidentialSupportGroupAccess();
            expect(await caseAccessTabOldPo.isConfidentialSupportGroupDropDownPresent("CA Support 3")).toBeTruthy();
            await caseAccessTabOldPo.selectConfidentialSupportGroupDropDown("CA Support 3");
            await caseAccessTabOldPo.clickConfidentialWriteSupportGroupAccess();
            await caseAccessTabOldPo.clickAddConfidentialSupportGroup();
            await caseAccessTabOldPo.clickConfidentialSupportGroupAccess();
            expect(await caseAccessTabOldPo.isConfidentialSupportGroupDropDownPresent("Employee Relations Sensitive Data Access")).toBeTruthy();
            await caseAccessTabOldPo.selectConfidentialSupportGroupDropDown("Employee Relations Sensitive Data Access");
            await caseAccessTabOldPo.clickConfidentialWriteSupportGroupAccess();
            await caseAccessTabOldPo.clickAddConfidentialSupportGroup();
        });
        it('[4487,4486,4492]: [DesignTime] Add confidential support group on case template - Global Company', async () => {
            await caseAccessTabOldPo.clickConfidentialSupportGroupAccess();
            expect(await caseAccessTabOldPo.isConfidentialSupportGroupDropDownPresent("Employee Relations Sensitive Data Access")).toBeTruthy();
            await caseAccessTabOldPo.selectConfidentialSupportGroupDropDown("Employee Relations Sensitive Data Access");
            await caseAccessTabOldPo.clickAddConfidentialSupportGroup();
            expect(await caseAccessTabOldPo.getSupportGroupWarningMessage()).toContain("The group already exists in the access list.");
            await viewCasetemplatePo.clickCopycaseTemplate();
            await copyCasetemplatePo.setTemplateName(randomStr + "Copy Case Template");
            await copyCasetemplatePo.clickSaveCaseTemplate();
            await viewCasetemplatePo.selectTab('Case Access');
            expect(await caseAccessTabOldPo.isConfidentialSupportGroupValueTextDisplayed("US Support 3")).toBeTruthy();
            expect(await caseAccessTabOldPo.isConfidentialSupportGroupValueTextDisplayed("AU Support 1")).toBeTruthy();
            expect(await caseAccessTabOldPo.isConfidentialSupportGroupValueTextDisplayed("AU Support 2")).toBeTruthy();
            expect(await caseAccessTabOldPo.isConfidentialSupportGroupValueTextDisplayed("AU Support 3")).toBeTruthy();
            expect(await caseAccessTabOldPo.isConfidentialSupportGroupValueTextDisplayed("AU Support 4")).toBeTruthy();
            expect(await caseAccessTabOldPo.isConfidentialSupportGroupValueTextDisplayed("CA Support 1")).toBeTruthy();
            expect(await caseAccessTabOldPo.isConfidentialSupportGroupValueTextDisplayed("CA Support 2")).toBeTruthy();
            expect(await caseAccessTabOldPo.isConfidentialSupportGroupValueTextDisplayed("CA Support 3")).toBeTruthy();
            expect(await caseAccessTabOldPo.isConfidentialSupportGroupValueTextDisplayed("Employee Relations Sensitive Data Access")).toBeTruthy();
            expect(await caseAccessTabOldPo.isConfidentialSupportGroupValueTextDisplayed("Sensitive Personal Data (HR)")).toBeTruthy();
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
                "assignee": "qkatawazi",
                "company": "Petramco",
                "businessUnit": "United States Support",
                "ownerBU": "United States Support",
                "supportGroup": "US Support 3",
                "ownerGroup": "US Support 3"
            }
            await apiHelper.apiLogin('tadmin');
            await apiHelper.deleteDynamicFieldAndGroup();
            await apiHelper.apiLogin('qkatawazi');
            let newCaseTemplate = await apiHelper.createCaseTemplate(caseTemplateData);
            await apiHelper.createDynamicDataOnTemplate(newCaseTemplate.id, 'DynamicGroupContainsConfidentialsFieldDRDMV15041');
            await apiHelper.apiLogin('tadmin');
            await apiHelper.updateFoundationEntity('SupportGroup', 'US Support 3', { confidential: 'true' });
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
            await accessTabPo.selectAccessEntityDropDown('US Support 3', 'Select Support Group', true);
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
            await loginPage.login("qkatawazi");
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
                "ownerBusinessUnit": "United States Support",
                "ownerGroup": "US Support 3"
            }
            caseTemplateData = {
                "templateName": randomStr + 'caseTemplateName',
                "templateSummary": 'CaseSummaryName' + randomStr,
                "caseStatus": "InProgress",
                "templateStatus": "Draft",
                "assignee": "qkatawazi",
                "company": "Petramco",
                "businessUnit": "United States Support",
                "ownerBU": "United States Support",
                "supportGroup": "US Support 3",
                "ownerGroup": "US Support 3"
            }

            await apiHelper.apiLogin('tadmin');
            await apiHelper.deleteDynamicFieldAndGroup();
            await apiHelper.apiLogin('qkatawazi');
            await apiHelper.createManualTaskTemplate(templateData);
            await apiHelper.createCaseTemplate(caseTemplateData);
        });
        it('[4482,4873]: [DesignTime] Availability of Confidential checkbox on all types of dynamic fields', async () => {
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Application Configuration--Dynamic Field Library', 'Dynamic Field Library - Settings - Business Workflows');
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
            await navigationPage.gotoSettingsMenuItem('Task Management--Templates', 'Templates - Settings - Business Workflows');
            await selectTaskTemplate.searchAndOpenTaskTemplate(templateData.templateName);
            await viewTasktemplatePo.clickOnManageDynamicFieldLink();
            await dynamicField.clickOnDynamicField();
            expect(await dynamicField.isConfidentialsRadioButtonDisplayed()).toBeTruthy();
            await dynamicField.clickEnabledConfidentialsRadioButton
            await dynamicField.setFieldName("test" + randomStr);
            await dynamicField.setDescriptionName("test 123" + randomStr);
            await dynamicField.clickEnabledConfidentialsRadioButton();
            await dynamicField.clickSaveButton();
            await utilityCommon.closePopUpMessage();
        });

        it('[4482,4873]: [DesignTime] Availability of Confidential checkbox on all types of dynamic fields', async () => {
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Case Management--Templates', 'Templates - Settings - Business Workflows');
            await utilityGrid.searchAndOpenHyperlink(caseTemplateData.templateName);
            await viewCasetemplatePo.clickOnMangeDynamicFieldLink();
            await dynamicField.clickOnDynamicField();
            expect(await dynamicField.isConfidentialsRadioButtonDisplayed()).toBeTruthy();
            await dynamicField.setFieldName("test" + randomStr);
            await dynamicField.setDescriptionName("test 123" + randomStr);
            await dynamicField.clickEnabledConfidentialsRadioButton();
            await dynamicField.clickSaveButton();
            await utilityCommon.closePopUpMessage();
        });
    });
});