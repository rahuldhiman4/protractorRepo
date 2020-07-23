import { $, browser, protractor, ProtractorExpectedConditions } from "protractor";
import apiHelper from '../../api/api.helper';
import attachmentBladePage from "../../pageobject/attachment/attachment-blade.po";
import caseConsolePage from '../../pageobject/case/case-console.po';
import previewCasePo from '../../pageobject/case/case-preview.po';
import createCasePage from "../../pageobject/case/create-case.po";
import editCasePage from '../../pageobject/case/edit-case.po';
import { default as selectCaseTemplateBlade } from '../../pageobject/case/select-casetemplate-blade.po';
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
import addReadAccess from '../../pageobject/settings/case-management/add-read-access-configuration.po';
import consoleCasetemplatePo from '../../pageobject/settings/case-management/console-casetemplate.po';
import createCaseTemplate from '../../pageobject/settings/case-management/create-casetemplate.po';
import editCaseTemplate from '../../pageobject/settings/case-management/edit-casetemplate.po';
import caseTemplatePreview from '../../pageobject/settings/case-management/preview-case-template.po';
import consoleReadAcess from '../../pageobject/settings/case-management/read-access-console.po';
import viewCaseTemplate from '../../pageobject/settings/case-management/view-casetemplate.po';
import selectTaskTemplate from "../../pageobject/settings/task-management/console-tasktemplate.po";
import createTaskTemplate from '../../pageobject/settings/task-management/create-tasktemplate.po';
import taskTemplatePreview from '../../pageobject/settings/task-management/preview-task-template.po';
import viewTasktemplatePage from '../../pageobject/settings/task-management/view-tasktemplate.po';
import { default as activityPo, default as activityTabPo } from '../../pageobject/social/activity-tab.po';
import taskConsolepage from "../../pageobject/task/console-task.po";
import adhoctaskTemplate from "../../pageobject/task/create-adhoc-task.po";
import manageTask from "../../pageobject/task/manage-task-blade.po";
import { BWF_BASE_URL } from '../../utils/constants';
import utilCommon from '../../utils/util.common';
import utilGrid from '../../utils/util.grid';
import utilityCommon from '../../utils/utility.common';
import utilityGrid from '../../utils/utility.grid';
import editReadAccess from "../../pageobject/settings/case-management/edit-read-access-config.po";
import apiCoreUtil from '../../api/api.core.util';
import caseAccessTabPo from '../../pageobject/common/case-access-tab.po';
import navigationPo from '../../pageobject/common/navigation.po';
import quickCasePo from '../../pageobject/case/quick-case.po';
import casePreviewPo from '../../pageobject/case/case-preview.po';

describe("Create Case", () => {
    const businessDataFile = require('../../data/ui/foundation/businessUnit.ui.json');
    const departmentDataFile = require('../../data/ui/foundation/department.ui.json');
    const supportGrpDataFile = require('../../data/ui/foundation/supportGroup.ui.json');
    const personDataFile = require('../../data/ui/foundation/person.ui.json');
    let businessData, departmentData, suppGrpData, personData, businessData1, departmentData1, suppGrpData1, personData1;
    let categName1, categName2, categName3, categName4;
    beforeAll(async () => {
        await browser.get(BWF_BASE_URL);
        await loginPage.login("qkatawazi");
        await foundationData1("Petramco");
    });

    afterAll(async () => {
        await utilityCommon.closeAllBlades();
        await navigationPage.signOut();
    });

    afterEach(async () => {
        await utilityCommon.refresh();
    });

    async function createCategoryAssociation() {
        categName1 = 'DemoCateg1';
        categName2 = 'DemoCateg2';
        categName3 = 'DemoCateg3';
        categName4 = 'DemoCateg4';
        await apiHelper.apiLogin('tadmin');
        await apiHelper.createOperationalCategory(categName1);
        await apiHelper.createOperationalCategory(categName2);
        await apiHelper.createOperationalCategory(categName3);
        await apiHelper.createOperationalCategory(categName4);
        await apiHelper.associateCategoryToOrganization(categName1, 'Petramco');
        await apiHelper.associateCategoryToCategory(categName1, categName2);
        await apiHelper.associateCategoryToCategory(categName2, categName3);
        await apiHelper.associateCategoryToCategory(categName3, categName4);
        await apiHelper.associateCategoryToOrganization(categName1, '- Global -');
    }

    async function foundationData1(company: string) {
        await apiHelper.apiLogin('tadmin');
        businessData = businessDataFile['BusinessUnitData'];
        departmentData = departmentDataFile['DepartmentData'];
        suppGrpData = supportGrpDataFile['SuppGrpData'];
        personData = personDataFile['PersonData'];
        await apiHelper.createNewUser(personData);
        let orgId = await apiCoreUtil.getOrganizationGuid(company);
        businessData.relatedOrgId = orgId;
        let businessUnitId = await apiHelper.createBusinessUnit(businessData);
        departmentData.relatedOrgId = businessUnitId;
        let depId = await apiHelper.createDepartment(departmentData);
        suppGrpData.relatedOrgId = depId;
        await apiHelper.createSupportGroup(suppGrpData);
        await apiHelper.associatePersonToSupportGroup(personData.userId, suppGrpData.orgName);
        await apiHelper.associatePersonToCompany(personData.userId, company);
    }

    async function foundationData2(company: string) {
        await apiHelper.apiLogin('tadmin');
        businessData1 = businessDataFile['BusinessUnitData19501'];
        departmentData1 = departmentDataFile['DepartmentData19501'];
        suppGrpData1 = supportGrpDataFile['SuppGrpData19501'];
        personData1 = personDataFile['PersonData19501'];
        await apiHelper.createNewUser(personData1);
        let orgId1 = await apiCoreUtil.getOrganizationGuid(company);
        businessData1.relatedOrgId = orgId1;
        let businessUnitId1 = await apiHelper.createBusinessUnit(businessData1);
        await browser.sleep(3000); // timeout requried to reflect data on UI
        departmentData1.relatedOrgId = businessUnitId1;
        let depId1 = await apiHelper.createDepartment(departmentData1);
        await browser.sleep(3000); // timeout requried to reflect data on UI
        suppGrpData1.relatedOrgId = depId1;
        await apiHelper.createSupportGroup(suppGrpData1);
        await browser.sleep(3000); // timeout requried to reflect data on UI
        await apiHelper.associatePersonToSupportGroup(personData1.userId, suppGrpData1.orgName);
        await apiHelper.associatePersonToCompany(personData1.userId, company);
    }
    //ankagraw
    it('[DRDMV-11818,DRDMV-11821]: [Global Case Template] Create/Update Case template with company and flowset as Global', async () => {
        try {
            let randomStr = [...Array(4)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
            let caseTemplate1 = 'Case Template 1' + randomStr;
            let caseTemplateSummary1 = 'Summary 1' + randomStr;
            let flowsetData = require('../../data/ui/case/flowset.ui.json');
            let flowsetName: string = await flowsetData['flowsetGlobalFields'].flowsetName + randomStr;
            flowsetData['flowsetGlobalFields'].flowsetName = flowsetName;
            await apiHelper.apiLogin('qkatawazi');
            await apiHelper.createNewFlowset(flowsetData['flowsetGlobalFields']);
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Case Management--Templates', 'Case Templates - Business Workflows');
            await consoleCasetemplatePo.clickOnCreateCaseTemplateButton();
            await createCaseTemplate.setTemplateName(caseTemplate1);
            await createCaseTemplate.setCompanyName('- Global -');
            await createCaseTemplate.setCaseSummary(caseTemplateSummary1);
            await createCaseTemplate.setFlowsetValue(flowsetName);
            await createCaseTemplate.setTemplateStatusDropdownValue('Active');
            await createCaseTemplate.clickSaveCaseTemplate();
            //expect(await utilCommon.isErrorMsgPresent()).toBeTruthy(); //no error message
            //await utilCommon.closePopUpMessage();
            expect(await viewCaseTemplate.getCaseCompanyValue()).toBe('- Global -');
            expect(await viewCaseTemplate.getFlowsetValue()).toBe(flowsetName);
            await viewCaseTemplate.clickOnEditCaseTemplateButton();
            expect(await editCaseTemplate.isCaseCompanyDisabled()).toBeTruthy();
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Case Management--Read Access', 'Case Read Access Configuration - Business Workflows');
            await consoleReadAcess.clickOnReadAccessConfiguration();
            await addReadAccess.setReadAccessConfigurationName("test");
            await addReadAccess.selectCompany('Global');
            await addReadAccess.selectFlowset(flowsetName);
            await addReadAccess.selectSupportCompany('Petramco');
            await addReadAccess.selectBusinessUnit('Australia Support');
            await addReadAccess.selectSupportGroup('AU Support 2');
            await addReadAccess.clickOnSave();
            await navigationPage.signOut();
            await loginPage.login('gwixillian');
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Case Management--Templates', 'Case Templates - Business Workflows');
            await consoleCasetemplatePo.searchAndClickOnCaseTemplate(caseTemplate1);
            expect(await viewCaseTemplate.getCaseCompanyValue()).toBe('- Global -');
            await viewCaseTemplate.clickOnEditCaseTemplateButton();
            expect(await editCaseTemplate.isCaseSummaryReadOnly()).toBeTruthy();
        } catch (e) {
            throw e;
        } finally {
            await navigationPage.signOut();
            await loginPage.login('qkatawazi');
        }
    }, 600 * 1000);

    it('[DRDMV-12060]:[Read Access] Editing Read Access Mappings Company to Global', async () => {
        let randVal = [...Array(10)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        await navigationPage.gotoSettingsPage();
        await navigationPage.gotoSettingsMenuItem('Case Management--Read Access', 'Case Read Access Configuration - Business Workflows');
        await consoleReadAcess.clickOnReadAccessConfiguration();
        await addReadAccess.setReadAccessConfigurationName("ReadAccess" + randVal);
        await addReadAccess.selectCompany('Petramco');
        await addReadAccess.selectSupportCompany('Petramco');
        await addReadAccess.selectBusinessUnit('Australia Support');
        await addReadAccess.selectSupportGroup('AU Support 2');
        await addReadAccess.clickOnSave();
        await utilGrid.searchAndOpenHyperlink("ReadAccess" + randVal);
        await editReadAccess.selectCompany('Global');
        await editReadAccess.clickOnSave();
        await utilGrid.searchAndOpenHyperlink("ReadAccess" + randVal);
        expect(await editReadAccess.isCompanyFieldDisabled()).toBeTruthy('Company is not disabled');
        await editReadAccess.clickOnCancel();
        await utilCommon.clickOnWarningOk();
        await utilGrid.searchAndSelectGridRecord("ReadAccess" + randVal);
        await consoleReadAcess.clickDeleteButton();
        await utilCommon.clickOnWarningOk();
        expect(await utilCommon.isPopUpMessagePresent('Record(s) deleted successfully.')).toBeTruthy('Successfull message is not appeared');
    });

    it('[DRDMV-11985]:[Read Access] Verify Global read acess configuration applied to case if read acess configuration qualification matches', async () => {
        let randVal = [...Array(10)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        await navigationPage.gotoSettingsPage();
        await navigationPage.gotoSettingsMenuItem('Case Management--Read Access', 'Case Read Access Configuration - Business Workflows');
        await consoleReadAcess.clickOnReadAccessConfiguration();
        await addReadAccess.setReadAccessConfigurationName("ReadAccess" + randVal);
        await addReadAccess.selectCompany('Global');
        await addReadAccess.selectPriority('Critical');
        await addReadAccess.selectCategoryTier1('Purchasing Card');
        await addReadAccess.selectSupportCompany('Petramco');
        await addReadAccess.selectBusinessUnit(businessData.orgName);
        await addReadAccess.selectDepartment(departmentData.orgName);
        await addReadAccess.selectSupportGroup(suppGrpData.orgName);
        await addReadAccess.clickOnSave();
        await utilCommon.closePopUpMessage();

        await navigationPage.gotoCreateCase();
        await createCasePage.selectRequester('adam');
        await createCasePage.setSummary('set summary');
        await createCasePage.selectCategoryTier1('Purchasing Card');
        await createCasePage.setPriority('Critical');
        await createCasePage.clickChangeAssignmentButton();
        await changeAssignmentPage.selectCompany('Petramco');
        await changeAssignmentPage.selectBusinessUnit('United States Support')
        await changeAssignmentPage.selectSupportGroup('US Support 3');
        await changeAssignmentPage.selectAssignee('Qadim Katawazi');
        await changeAssignmentPage.clickOnAssignButton();
        await createCasePage.clickSaveCaseButton();
        await previewCasePo.clickGoToCaseButton();
        await viewCasePage.clickOnTab('Case Access');
        expect(await caseAccessTabPo.isCaseAccessEntityAdded(suppGrpData.orgName)).toBeTruthy('FailuerMsg1: Support Group Name is missing');
        expect(await caseAccessTabPo.isCaseAccessEntityAdded('Qadim Katawazi')).toBeTruthy('FailuerMsg1: Agent Name is missing');
        expect(await caseAccessTabPo.isSupportGroupWriteAccessDisplayed('US Support 3')).toBeTruthy('Support Group does not have write access');
        expect(await caseAccessTabPo.isSupportGroupReadAccessDisplayed(suppGrpData.orgName)).toBeTruthy('Support Group does not have read access');
    });

    describe('[DRDMV-7061,DRDMV-6998]: [Read Access] Configuring non-default Read Access', async () => {
        const randomStr = [...Array(10)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        let caseTemplateData;
        beforeAll(async () => {
            await apiHelper.apiLogin('qkatawazi');
            caseTemplateData = {
                "templateName": `${randomStr}Case template`,
                "templateStatus": "Draft",
                "templateSummary": `${randomStr}Summary`,
                "caseStatus": "New",
                "casePriority": "Critical",
                "categoryTier1": 'Purchasing Card',
                "company": "Petramco",
            }
            await apiHelper.createCaseTemplate(caseTemplateData);
            await foundationData2("Petramco");
        });
        it('[DRDMV-7061,DRDMV-6998]: [Read Access] Configuring non-default Read Access', async () => {
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Case Management--Read Access', 'Case Read Access Configuration - Business Workflows');
            await consoleReadAcess.clickOnReadAccessConfiguration();
            await addReadAccess.setReadAccessConfigurationName("ReadAccess" + randomStr);
            await addReadAccess.selectCompany('Petramco');
            await addReadAccess.selectPriority('Critical');
            await addReadAccess.selectCategoryTier1('Purchasing Card');
            await addReadAccess.selectSupportCompany('Petramco');
            await addReadAccess.selectBusinessUnit(businessData.orgName);
            await addReadAccess.selectDepartment(departmentData.orgName);
            await addReadAccess.selectSupportGroup(suppGrpData.orgName);
            expect(await addReadAccess.isAccessMappingNameFieldMandatory()).toBeTruthy("Mapping Name Field is not present");
            expect(await addReadAccess.isBusinessUnitDisplayed()).toBeTruthy("Business Unit Field is not present");
            expect(await addReadAccess.isCancelButtonDisplayed()).toBeTruthy("Cancel Button is not present");
            expect(await addReadAccess.isDepartmentDisplayed()).toBeTruthy("Department Unit Field is not present");
            expect(await addReadAccess.isFlowsetDisplayed()).toBeTruthy("Flowset Field is not present");
            expect(await addReadAccess.isPriorityDisplayed()).toBeTruthy("Priority Field is not present");
            expect(await addReadAccess.isSupportCompanyFieldMandatory()).toBeTruthy("Support Company Field is not present");
            expect(await addReadAccess.isSaveButtonDisplayed()).toBeTruthy("Save Button is not present");
            expect(await addReadAccess.isSupportGroupFieldMandatory()).toBeTruthy("Support Group Field is not present");
            expect(await addReadAccess.isUseAsDefaultFieldMandatory()).toBeTruthy("Use As Default Field is not present");
            await addReadAccess.clickOnSave();
            await utilCommon.closePopUpMessage();
        });
        it('[DRDMV-7061,DRDMV-6998]: [Read Access] Configuring non-default Read Access', async () => {
            await navigationPo.gotoSettingsPage();
            await navigationPo.gotoSettingsMenuItem('Case Management--Templates', 'Case Templates - Business Workflows');
            await utilGrid.searchAndOpenHyperlink(caseTemplateData.templateName);
            await editCaseTemplate.clickEditCaseTemplate();
            await editCaseTemplate.clickOnChangeAssignmentButton();
            await changAssignmentOldPage.selectCompany('Petramco');
            await changAssignmentOldPage.selectBusinessUnit(businessData1.orgName);
            await changAssignmentOldPage.selectDepartment(departmentData1.orgName);
            await changAssignmentOldPage.selectSupportGroup(suppGrpData1.orgName);
            await changAssignmentOldPage.selectAssignee('fnPerson19501 lnPerson19501');
            await changAssignmentOldPage.clickOnAssignButton();
            await editCaseTemplate.clickSaveCaseTemplate();
            await editCaseTemplate.clickOnEditCaseTemplateMetadata();
            await editCaseTemplate.changeTemplateStatusDropdownValue('Active');
            await editCaseTemplate.clickOnSaveCaseTemplateMetadata();
            await utilCommon.closePopUpMessage();
        });
        it('[DRDMV-7061,DRDMV-6998]: [Read Access] Configuring non-default Read Access', async () => {
            await navigationPage.signOut();
            await loginPage.login('qtao')
            await navigationPage.gotoQuickCase();
            await quickCasePo.selectRequesterName('qkatawazi');
            await quickCasePo.selectCaseTemplate(caseTemplateData.templateName);
            await quickCasePo.saveCase();
            await casePreviewPo.clickGoToCaseButton();
            await viewCasePage.clickOnTab('Case Access');
            expect(await caseAccessTabPo.isCaseAccessEntityAdded(suppGrpData.orgName)).toBeTruthy('FailuerMsg1: Support Group Name is missing');
            expect(await caseAccessTabPo.isCaseAccessEntityAdded('fnPerson19501 lnPerson19501')).toBeTruthy('FailuerMsg1: Agent Name is missing');
            expect(await caseAccessTabPo.isSupportGroupReadAccessDisplayed(suppGrpData.orgName)).toBeTruthy('Support Group does not have read access');
        });
        afterAll(async () => {
            await navigationPage.signOut();
            await loginPage.login('qkatawazi');
        });
    });

    describe('[DRDMV-7026,DRDMV-7033]: [Read Access] Configuring a Default Read Access', async () => {
        const randomStr = [...Array(10)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        let newCase1, caseTemplateData, readAccessMappingData1, readAccessMappingData2;
        beforeAll(async () => {
            await apiHelper.apiLogin('qkatawazi');
            caseTemplateData = {
                "templateName": `${randomStr}Case template`,
                "templateStatus": "Active",
                "templateSummary": `${randomStr}Summary`,
                "caseStatus": "New",
                "casePriority": "Critical",
                "categoryTier1": categName1,
                "categoryTier2": categName2,
                "categoryTier3": categName3,
                "categoryTier4": categName4,
                "company": "Petramco",
            }
            readAccessMappingData1 = {
                "configName": randomStr + '1ReadAccessMappingName',
                "assignedCompany": 'Petramco',
                "businessUnit": 'HR Support',
                "supportGroup": 'Compensation and Benefits',
                "company": 'Petramco',
                "category1": categName1,
                "category2": categName2,
                "category3": categName3,
                "category4": categName4,
            }
            readAccessMappingData2 = {
                "configName": randomStr + '2ReadAccessMappingName',
                "assignedCompany": 'Petramco',
                "businessUnit": 'Facilities Support',
                "supportGroup": 'Facilities',
                "company": 'Petramco',
                "category1": 'Workforce Administration',
            }
            let caseData = {
                "Requester": "apavlik",
                "Summary": "Test case for Read Access",
                "Assigned Company": "Petramco",
                "Business Unit": "Facilities Support",
                "Support Group": "Facilities",
                "Assignee": "Fritz"
            }
            newCase1 = await apiHelper.createCase(caseData);
            await apiHelper.createCaseTemplate(caseTemplateData);
            await apiHelper.createReadAccessMapping(readAccessMappingData1);
            await apiHelper.createReadAccessMapping(readAccessMappingData2);
            readAccessMappingData2.configName = randomStr + '3ReadAccessMappingName';
            await apiHelper.createReadAccessMapping(readAccessMappingData2);
            await createCategoryAssociation();
        });
        it('[DRDMV-7026,DRDMV-7033]: [Read Access] Configuring a Default Read Access', async () => {
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Case Management--Read Access', 'Case Read Access Configuration - Business Workflows');
            await consoleReadAcess.deleteDefaultReadAccess();
            await utilGrid.searchAndOpenHyperlink(readAccessMappingData1.configName);
            await editReadAccess.selectCompany('Global');
            await editReadAccess.setDefaultToggleButton(true);
            await editReadAccess.clickOnSave();
            await utilCommon.closePopUpMessage();
            await utilGrid.searchAndOpenHyperlink(readAccessMappingData2.configName);
            await editReadAccess.selectCompany('Global');
            await editReadAccess.clickOnSave();
            await utilGrid.searchAndOpenHyperlink(readAccessMappingData2.configName);
            await editReadAccess.setDefaultToggleButton(true);
            await editReadAccess.clickOnSave();
            expect(await utilCommon.isPopUpMessagePresent('ERROR (10000): Only one default record is allowed for a company. Please change the default flag and save the record.')).toBeTruthy('Message Not Present');
            await editReadAccess.clickOnCancel();
            await utilCommon.clickOnWarningOk();
        });
        it('[DRDMV-7026,DRDMV-7033]: [Read Access] Configuring a Default Read Access', async () => {
            await navigationPage.signOut();
            await loginPage.login('qtao');
            await navigationPage.gotoQuickCase();
            await quickCasePo.selectRequesterName('qkatawazi');
            await quickCasePo.selectCaseTemplate(caseTemplateData.templateName);
            await quickCasePo.saveCase();
            await casePreviewPo.clickGoToCaseButton();
            await viewCasePage.clickOnTab('Case Access');
            expect(await caseAccessTabPo.isCaseAccessEntityAdded('Compensation and Benefits')).toBeTruthy('FailuerMsg1: Support Group Name is missing');
            expect(await caseAccessTabPo.isSupportGroupReadAccessDisplayed('Compensation and Benefits')).toBeTruthy('Support Group does not have read access');
            await navigationPage.gotoQuickCase();
            await quickCasePo.selectRequesterName('qkatawazi');
            await quickCasePo.setCaseSummary('Read Access');
            await quickCasePo.saveCase();
            await casePreviewPo.clickGoToCaseButton();
            await viewCasePage.clickOnTab('Case Access');
            expect(await caseAccessTabPo.isCaseAccessEntityAdded('Compensation and Benefits')).toBeTruthy('FailuerMsg1: Support Group Name is missing');
            expect(await caseAccessTabPo.isSupportGroupReadAccessDisplayed('Compensation and Benefits')).toBeTruthy('Support Group does not have read access');
            await navigationPage.signOut();
            await loginPage.login('fritz');
            await utilityGrid.searchAndOpenHyperlink(newCase1.displayId);
            await viewCasePage.clickOnTab('Case Access');
            expect(await caseAccessTabPo.isCaseAccessEntityAdded('Compensation and Benefits')).toBeFalsy('FailuerMsg1: Support Group Name is missing');
            expect(await caseAccessTabPo.isSupportGroupReadAccessDisplayed('Compensation and Benefits')).toBeFalsy('Support Group does not have read access');
        });
        afterAll(async () => {
            await apiHelper.apiLogin('tadmin');
            await apiHelper.deleteCaseReadAccess(readAccessMappingData1.configName);
            await apiHelper.deleteCaseReadAccess(randomStr + '2ReadAccessMappingName');
            await apiHelper.deleteCaseReadAccess(randomStr + '3ReadAccessMappingName');
            await navigationPage.signOut();
            await loginPage.login('qkatawazi');
        });
    });
});
