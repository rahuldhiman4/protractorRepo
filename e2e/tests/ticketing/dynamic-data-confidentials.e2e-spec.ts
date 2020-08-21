import { browser } from "protractor";
import apiHelper from "../../api/api.helper";
import caseConsolePo from '../../pageobject/case/case-console.po';
import previewCasePo from '../../pageobject/case/case-preview.po';
import createCasePage from '../../pageobject/case/create-case.po';
import editCasePo from '../../pageobject/case/edit-case.po';
import quickCasePo from '../../pageobject/case/quick-case.po';
import selectCasetemplateBladePo from '../../pageobject/case/select-casetemplate-blade.po';
import viewCasePo from "../../pageobject/case/view-case.po";
import addFieldsPopPo from '../../pageobject/common/add-fields-pop.po';
import dynamicFieldsPage from '../../pageobject/common/dynamic-fields.po';
import loginPage from "../../pageobject/common/login.po";
import navigationPage from "../../pageobject/common/navigation.po";
import updateStatusBladePo from '../../pageobject/common/update.status.blade.po';
import createDynamicFieldLibraryConfigPo from '../../pageobject/settings/application-config/create-dynamic-field-library-config.po';
import createDynamicGroupLibraryConfigPo from '../../pageobject/settings/application-config/create-dynamic-group-library-config.po';
import dynamicFieldLibraryConfigConsolePo from '../../pageobject/settings/application-config/dynamic-field-library-config-console.po';
import dynamicGroupLibraryConfigConsolePo from '../../pageobject/settings/application-config/dynamic-group-library-config-console.po';
import consoleCasetemplatePo from '../../pageobject/settings/case-management/console-casetemplate.po';
import copyCasetemplatePo from '../../pageobject/settings/case-management/copy-casetemplate.po';
import editCasetemplatePo from '../../pageobject/settings/case-management/edit-casetemplate.po';
import viewCasetemplatePo from '../../pageobject/settings/case-management/view-casetemplate.po';
import createDocumentTemplatePo from '../../pageobject/settings/document-management/create-document-template.po';
import editDocumentTemplatePo from '../../pageobject/settings/document-management/edit-document-template.po';
import selectTaskTemplate from "../../pageobject/settings/task-management/console-tasktemplate.po";
import copyTasktemplatePo from '../../pageobject/settings/task-management/copy-tasktemplate.po';
import createTaskTemplate from "../../pageobject/settings/task-management/create-tasktemplate.po";
import editTaskTemplate from "../../pageobject/settings/task-management/edit-tasktemplate.po";
import viewTaskTemplate from "../../pageobject/settings/task-management/view-tasktemplate.po";
import activityTabPo from '../../pageobject/social/activity-tab.po';
import editTaskPo from '../../pageobject/task/edit-task.po';
import manageTask from "../../pageobject/task/manage-task-blade.po";
import viewTaskPo from '../../pageobject/task/view-task.po';
import { BWF_BASE_URL } from '../../utils/constants';
import utilCommon from '../../utils/util.common';
import utilGrid from '../../utils/util.grid';
import utilityCommon from '../../utils/utility.common';
import caseAccessTabPo from '../../pageobject/common/case-access-tab.po';
import utilityGrid from '../../utils/utility.grid';
import changeAssignmentBladePo from '../../pageobject/common/change-assignment-blade.po';

describe('Dynamic Confidentials Data', () => {
    beforeAll(async () => {
        await browser.get(BWF_BASE_URL);
        await loginPage.login('fritz');
    });

    afterAll(async () => {
        await utilityCommon.closeAllBlades();
        await navigationPage.signOut();
    });

    //ankagraw
    describe('[DRDMV-17962]: Validation of Confidential fields in Dynamic Field Group on Case', async () => {
        let caseTemplateData, caseId, randomStr = [...Array(4)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        beforeAll(async () => {
            caseTemplateData = {
                "templateName": randomStr + 'caseTemplateName',
                "templateSummary": 'CaseSummaryName' + randomStr,
                "caseStatus": "InProgress",
                "templateStatus": "Active",
                "assignee": "Fritz",
                "company": "Petramco",
                "supportGroup": "Facilities",
                "ownerGroup": "Facilities",
                "businessUnit": "Facilities Support",
                "ownerBU": "Facilities Support",
            }
            await apiHelper.apiLogin('tadmin');
            await apiHelper.deleteDynamicFieldAndGroup();
            await apiHelper.apiLogin('fritz');
            let newCaseTemplate = await apiHelper.createCaseTemplate(caseTemplateData);
            await apiHelper.createDynamicDataOnTemplate(newCaseTemplate.id, 'CASE_TEMPLATE_WITH_CONFIDENTIAL');
            await apiHelper.apiLogin('tadmin');
            await apiHelper.updateFoundationEntity('SupportGroup', 'Facilities', { confidential: 'true' });
        });
        it('[DRDMV-17962]: Validation of Confidential fields in Dynamic Field Group on Case', async () => {
            await navigationPage.gotoCreateCase();
            await createCasePage.selectRequester('fritz');
            await createCasePage.setSummary('Summary' + randomStr);
            await createCasePage.clickSelectCaseTemplateButton();
            await selectCasetemplateBladePo.selectCaseTemplate(caseTemplateData.templateName);
            await createCasePage.clickAssignToMeButton();
            await createCasePage.clickSaveCaseButton();
            await previewCasePo.clickGoToCaseButton();
            caseId = await viewCasePo.getCaseID();
            await viewCasePo.clickOnTab('Case Access');
            await caseAccessTabPo.clickOnConfidentialSupportGroupAccess();
            await caseAccessTabPo.selectConfidentialSupportGroup('Facilities');
            await caseAccessTabPo.selectConfidentialsSupportGroupWriteAccess();
            await caseAccessTabPo.clickOnConfidentialSupportGroupAdd();
        });
        it('[DRDMV-17962]: Validation of Confidential fields in Dynamic Field Group on Case', async () => {
            await navigationPage.gotoCaseConsole();
            await utilityGrid.searchAndOpenHyperlink(caseId);
            await viewCasePo.clickEditCaseButton();
            await editCasePo.setDynamicFieldValue("LocalNonConfidentialDesc", "Test 1");
            await editCasePo.setDynamicFieldValue("LocalConfidentialDesc", "1234");
            await editCasePo.clickChangeAssignmentButton();
            await changeAssignmentBladePo.selectCompany('Petramco');
            await changeAssignmentBladePo.selectBusinessUnit("United States Support");
            await changeAssignmentBladePo.selectSupportGroup('US Support 3');
            await changeAssignmentBladePo.selectAssignToSupportGroup();
            await changeAssignmentBladePo.clickOnAssignButton();
            await editCasePo.clickSaveCase();
        });
        it('[DRDMV-17962]: Validation of Confidential fields in Dynamic Field Group on Case', async () => {
            expect(await viewCasePo.getValueOfDynamicFields("LocalNonConfidentialDesc")).toBe("Test 1");
            expect(await viewCasePo.getValueOfDynamicFields("LocalConfidentialDesc")).toBe("1234");
            await navigationPage.signOut();
            await loginPage.login('qkatawazi');
            await navigationPage.gotoCaseConsole();
            await utilityGrid.searchAndOpenHyperlink(caseId);
            expect(await viewCasePo.getValueOfDynamicFields("LocalNonConfidentialDesc")).toBe("Test 1");
            expect(await viewCasePo.getValueOfDynamicFields("LocalConfidentialDesc")).toBe("******");
        });
    });

    describe('[DRDMV-15006,DRDMV-15024,DRDMV-15025]: [DesignTime] Add confidential support group on case template', async () => {
        let caseTemplateData, randomStr = [...Array(4)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        beforeAll(async () => {
            caseTemplateData = {
                "templateName": randomStr + 'caseTemplateName',
                "templateSummary": 'CaseSummaryName' + randomStr,
                "caseStatus": "InProgress",
                "templateStatus": "Draft",
                "assignee": "Fritz",
                "company": "Petramco",
                "supportGroup": "Facilities",
                "ownerGroup": "Facilities",
                "businessUnit": "Facilities Support",
                "ownerBU": "Facilities Support",
            }
            await apiHelper.apiLogin('tadmin');
            await apiHelper.deleteDynamicFieldAndGroup();
            await apiHelper.apiLogin('fritz');
            await apiHelper.createCaseTemplate(caseTemplateData);
            await navigationPage.signOut();
            await loginPage.login('fritz');
        });
        it('[DRDMV-15006,DRDMV-15024,DRDMV-15025]: [DesignTime] Add confidential support group on case template', async () => {
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Case Management--Templates', 'Case Templates - Business Workflows');
            await utilGrid.searchAndOpenHyperlink(caseTemplateData.templateName);
            await viewCasetemplatePo.selectTab('Case Access');
            await viewCasetemplatePo.clickConfidentialSupportGroupAccess();
            expect(await viewCasetemplatePo.isConfidentialSupportGroupDropDownPresent("United Support 3")).toBeFalsy();
            await viewCasetemplatePo.selectConfidentialSupportGroupDropDown("Facilities");
            await viewCasetemplatePo.clickConfidentialWriteSupportGroupAccess();
            await viewCasetemplatePo.clickAddConfidentialSupportGroup();
            await viewCasetemplatePo.clickConfidentialSupportGroupAccess();
            expect(await viewCasetemplatePo.isConfidentialSupportGroupDropDownPresent("Sensitive Personal Data (HR)")).toBeTruthy();
            await viewCasetemplatePo.selectConfidentialSupportGroupDropDown("Sensitive Personal Data (HR)");
            await viewCasetemplatePo.clickAddConfidentialSupportGroup();
        });
        it('[DRDMV-15006,DRDMV-15024,DRDMV-15025]: [DesignTime] Add confidential support group on case template', async () => {
            expect(await viewCasetemplatePo.isConfidentialSupportGroupValueTextDisplayed("Facilities")).toBeTruthy();
            expect(await viewCasetemplatePo.isConfidentialSupportGroupValueTextDisplayed("Sensitive Personal Data (HR)")).toBeTruthy();
            await viewCasetemplatePo.clickDeleteConfidentialSupportGroup();
            await viewCasetemplatePo.clickDeleteConfidentialSupportGroup();
            expect(await viewCasetemplatePo.isConfidentialSupportGroupValueTextDisplayed("Facilities")).toBeFalsy();
            expect(await viewCasetemplatePo.isConfidentialSupportGroupValueTextDisplayed("Sensitive Personal Data (HR)")).toBeFalsy();
            await viewCasetemplatePo.clickConfidentialSupportGroupAccess();
            expect(await viewCasetemplatePo.isConfidentialSupportGroupDropDownPresent("Sensitive Personal Data (HR)")).toBeTruthy();
            await viewCasetemplatePo.selectConfidentialSupportGroupDropDown("Sensitive Personal Data (HR)");
            await viewCasetemplatePo.clickAddConfidentialSupportGroup();
            expect(await viewCasetemplatePo.isConfidentialSupportGroupValueTextDisplayed("Sensitive Personal Data (HR)")).toBeTruthy();
        });
        it('[DRDMV-15006,DRDMV-15024,DRDMV-15025]: [DesignTime] Add confidential support group on case template', async () => {
            await editCasetemplatePo.clickOnEditCaseTemplateMetadata();
            await editCasetemplatePo.changeTemplateStatusDropdownValue('Active');
            await editCasetemplatePo.clickOnSaveCaseTemplateMetadata();
            await viewCasetemplatePo.selectTab('Case Access');

        });
    });

});