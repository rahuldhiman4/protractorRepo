import { browser } from "protractor";
import apiCoreUtil from '../../api/api.core.util';
import apiHelper from '../../api/api.helper';
import casePreviewPo from '../../pageobject/case/case-preview.po';
import createCasePage from "../../pageobject/case/create-case.po";
import quickCasePo from '../../pageobject/case/quick-case.po';
import viewCasePage from "../../pageobject/case/view-case.po";
import caseAccessTabPo from '../../pageobject/common/case-access-tab.po';
import changeAssignmentPage from '../../pageobject/common/change-assignment-blade.po';
import changAssignmentOldPage from '../../pageobject/common/change-assignment-old-blade.po';
import loginPage from "../../pageobject/common/login.po";
import navigationPo from "../../pageobject/common/navigation.po";
import addReadAccess from '../../pageobject/settings/case-management/add-read-access-configuration.po';
import consoleCasetemplatePo from '../../pageobject/settings/case-management/console-casetemplate.po';
import createCaseTemplate from '../../pageobject/settings/case-management/create-casetemplate.po';
import editCaseTemplate from '../../pageobject/settings/case-management/edit-casetemplate.po';
import editReadAccess from "../../pageobject/settings/case-management/edit-read-access-config.po";
import consoleReadAcess from '../../pageobject/settings/case-management/read-access-console.po';
import viewCaseTemplate from '../../pageobject/settings/case-management/view-casetemplate.po';
import { BWF_BASE_URL } from '../../utils/constants';
import utilCommon from '../../utils/util.common';
import utilGrid from '../../utils/util.grid';
import utilityCommon from '../../utils/utility.common';
import utilityGrid from '../../utils/utility.grid';
import editCasetemplatePo from "../../pageobject/settings/case-management/edit-casetemplate.po";
import selectCasetemplateBladePo from '../../pageobject/case/select-casetemplate-blade.po';
import activityTabPo from '../../pageobject/social/activity-tab.po';

describe("Case Read Access", () => {
    const businessDataFile = require('../../data/ui/foundation/businessUnit.ui.json');
    const departmentDataFile = require('../../data/ui/foundation/department.ui.json');
    const supportGrpDataFile = require('../../data/ui/foundation/supportGroup.ui.json');
    const personDataFile = require('../../data/ui/foundation/person.ui.json');
    let businessData1, departmentData1, suppGrpData1, businessData2, departmentData2, suppGrpData2;
    let categName1, categName2, categName3, categName4;
    beforeAll(async () => {
        await browser.get(BWF_BASE_URL);
        await loginPage.login("qkatawazi");
        await foundationData1("Petramco");
    });

    afterAll(async () => {
        await utilityCommon.closeAllBlades();
        await navigationPo.signOut();
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
        businessData1 = businessDataFile['BusinessUnitData'];
        departmentData1 = departmentDataFile['DepartmentData'];
        suppGrpData1 = supportGrpDataFile['SuppGrpData'];
        let personData1 = personDataFile['PersonData'];
        let orgId = await apiCoreUtil.getOrganizationGuid(company);
        businessData1.relatedOrgId = orgId;
        let businessUnitId = await apiHelper.createBusinessUnit(businessData1);
        departmentData1.relatedOrgId = businessUnitId;
        let depId = await apiHelper.createDepartment(departmentData1);
        suppGrpData1.relatedOrgId = depId;
        await apiHelper.createSupportGroup(suppGrpData1);
        await apiHelper.createNewUser(personData1);
        await browser.sleep(3000); // timeout requried to reflect data on UI
        await apiHelper.associatePersonToCompany(personData1.userId, company);
        await apiHelper.associatePersonToSupportGroup(personData1.userId, suppGrpData1.orgName);
        await browser.sleep(5000); // timeout requried to reflect data on UI
    }

    async function foundationData2(company: string) {
        await apiHelper.apiLogin('tadmin');
        businessData2 = businessDataFile['BusinessUnitData19501'];
        departmentData2 = departmentDataFile['DepartmentData19501'];
        suppGrpData2 = supportGrpDataFile['SuppGrpData19501'];
        let personData2 = personDataFile['PersonData19501'];
        let orgId1 = await apiCoreUtil.getOrganizationGuid(company);
        businessData2.relatedOrgId = orgId1;
        let businessUnitId1 = await apiHelper.createBusinessUnit(businessData2);
        departmentData2.relatedOrgId = businessUnitId1;
        let depId1 = await apiHelper.createDepartment(departmentData2);
        suppGrpData2.relatedOrgId = depId1;
        await apiHelper.createSupportGroup(suppGrpData2);
        await apiHelper.createNewUser(personData2);
        await browser.sleep(3000); // timeout requried to reflect data on UI
        await apiHelper.associatePersonToSupportGroup(personData2.userId, suppGrpData2.orgName);
        await apiHelper.associatePersonToCompany(personData2.userId, company);
        await browser.sleep(5000); // timeout requried to reflect data on UI
    }

    it('[DRDMV-12060]:[Read Access] Editing Read Access Mappings Company to Global', async () => {
        let randVal = [...Array(10)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        await navigationPo.gotoSettingsPage();
        await navigationPo.gotoSettingsMenuItem('Case Management--Read Access', 'Case Read Access Configuration - Business Workflows');
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
        await navigationPo.gotoSettingsPage();
        await navigationPo.gotoSettingsMenuItem('Case Management--Read Access', 'Case Read Access Configuration - Business Workflows');
        await consoleReadAcess.clickOnReadAccessConfiguration();
        await addReadAccess.setReadAccessConfigurationName("ReadAccess" + randVal);
        await addReadAccess.selectCompany('Global');
        await addReadAccess.selectPriority('Critical');
        await addReadAccess.selectCategoryTier1('Purchasing Card');
        await addReadAccess.selectSupportCompany('Petramco');
        await addReadAccess.selectBusinessUnit(businessData1.orgName);
        await addReadAccess.selectDepartment(departmentData1.orgName);
        await addReadAccess.selectSupportGroup(suppGrpData1.orgName);
        await addReadAccess.clickOnSave();
        await utilCommon.closePopUpMessage();

        await navigationPo.gotoCreateCase();
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
        await casePreviewPo.clickGoToCaseButton();
        await viewCasePage.clickOnTab('Case Access');
        expect(await caseAccessTabPo.isCaseAccessEntityAdded(suppGrpData1.orgName)).toBeTruthy('FailuerMsg1: Support Group Name is missing');
        expect(await caseAccessTabPo.isCaseAccessEntityAdded('Qadim Katawazi')).toBeTruthy('FailuerMsg1: Agent Name is missing');
        expect(await caseAccessTabPo.isSupportGroupWriteAccessDisplayed('US Support 3')).toBeTruthy('Support Group does not have write access');
        expect(await caseAccessTabPo.isSupportGroupReadAccessDisplayed(suppGrpData1.orgName)).toBeTruthy('Support Group does not have read access');
    });

    describe('[DRDMV-11818,DRDMV-11821]: [Global Case Template] Create/Update Case template with company and flowset as Global', async () => {
        let randomStr = [...Array(4)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        let caseTemplate1 = 'Case Template 1' + randomStr;
        let caseTemplateSummary1 = 'Summary 1' + randomStr;
        let flowsetData = require('../../data/ui/case/flowset.ui.json');
        let flowsetName: string;
        beforeAll(async () => {
            await apiHelper.apiLogin('qkatawazi');
            flowsetName = await flowsetData['flowsetGlobalFields'].flowsetName + randomStr;
            flowsetData['flowsetGlobalFields'].flowsetName = flowsetName;
            await apiHelper.createNewFlowset(flowsetData['flowsetGlobalFields']);
        });
        it('[DRDMV-11818,DRDMV-11821]: [Global Case Template] Create/Update Case template with company and flowset as Global', async () => {
            await navigationPo.gotoSettingsPage();
            await navigationPo.gotoSettingsMenuItem('Case Management--Templates', 'Case Templates - Business Workflows');
            await consoleCasetemplatePo.clickOnCreateCaseTemplateButton();
            await createCaseTemplate.setTemplateName(caseTemplate1);
            await createCaseTemplate.setCompanyName('- Global -');
            await createCaseTemplate.setCaseSummary(caseTemplateSummary1);
            await createCaseTemplate.setFlowsetValue(flowsetName);
            await createCaseTemplate.setTemplateStatusDropdownValue('Active');
            await createCaseTemplate.clickSaveCaseTemplate();
            expect(await viewCaseTemplate.getCaseCompanyValue()).toBe('- Global -');
            expect(await viewCaseTemplate.getFlowsetValue()).toBe(flowsetName);
            await viewCaseTemplate.clickOnEditCaseTemplateButton();
            expect(await editCaseTemplate.isCaseCompanyDisabled()).toBeTruthy();
        });
        it('[DRDMV-11818,DRDMV-11821]: [Global Case Template] Create/Update Case template with company and flowset as Global', async () => {
            await navigationPo.gotoSettingsPage();
            await navigationPo.gotoSettingsMenuItem('Case Management--Read Access', 'Case Read Access Configuration - Business Workflows');
            await consoleReadAcess.clickOnReadAccessConfiguration();
            await addReadAccess.setReadAccessConfigurationName("test");
            await addReadAccess.selectCompany('Global');
            await addReadAccess.selectFlowset(flowsetName);
            await addReadAccess.selectSupportCompany('Petramco');
            await addReadAccess.selectBusinessUnit('Australia Support');
            await addReadAccess.selectSupportGroup('AU Support 2');
            await addReadAccess.clickOnSave();
            await navigationPo.signOut();
            await loginPage.login('gwixillian');
            await navigationPo.gotoSettingsPage();
            await navigationPo.gotoSettingsMenuItem('Case Management--Templates', 'Case Templates - Business Workflows');
            await consoleCasetemplatePo.searchAndClickOnCaseTemplate(caseTemplate1);
            expect(await viewCaseTemplate.getCaseCompanyValue()).toBe('- Global -');
            await viewCaseTemplate.clickOnEditCaseTemplateButton();
            expect(await editCaseTemplate.isCaseSummaryReadOnly()).toBeTruthy();
        });
        afterAll(async () => {
            await navigationPo.signOut();
            await loginPage.login('qkatawazi');
        });
    });

    describe('[DRDMV-7061,DRDMV-6998]: [Read Access] Configuring non-default Read Access', async () => {
        const randomStr = [...Array(10)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        let caseTemplateData;
        beforeAll(async () => {
            await foundationData2("Petramco");
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
        });
        it('[DRDMV-7061,DRDMV-6998]: [Read Access] Configuring non-default Read Access', async () => {
            await navigationPo.gotoSettingsPage();
            await navigationPo.gotoSettingsMenuItem('Case Management--Read Access', 'Case Read Access Configuration - Business Workflows');
            await consoleReadAcess.clickOnReadAccessConfiguration();
            await addReadAccess.setReadAccessConfigurationName("ReadAccess" + randomStr);
            await addReadAccess.selectCompany('Petramco');
            await addReadAccess.selectPriority('Critical');
            await addReadAccess.selectCategoryTier1('Purchasing Card');
            await addReadAccess.selectSupportCompany('Petramco');
            await addReadAccess.selectBusinessUnit(businessData1.orgName);
            await addReadAccess.selectDepartment(departmentData1.orgName);
            await addReadAccess.selectSupportGroup(suppGrpData1.orgName);
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
            await changAssignmentOldPage.selectBusinessUnit(businessData2.orgName);
            await changAssignmentOldPage.selectDepartment(departmentData2.orgName);
            await changAssignmentOldPage.selectSupportGroup(suppGrpData2.orgName);
            await changAssignmentOldPage.selectAssignee('fnPerson19501 lnPerson19501');
            await changAssignmentOldPage.clickOnAssignButton();
            await editCaseTemplate.clickSaveCaseTemplate();
            await editCaseTemplate.clickOnEditCaseTemplateMetadata();
            await editCaseTemplate.changeTemplateStatusDropdownValue('Active');
            await editCaseTemplate.clickOnSaveCaseTemplateMetadata();
            await utilCommon.closePopUpMessage();
        });
        it('[DRDMV-7061,DRDMV-6998]: [Read Access] Configuring non-default Read Access', async () => {
            await navigationPo.signOut();
            await loginPage.login('qtao')
            await navigationPo.gotoQuickCase();
            await quickCasePo.selectRequesterName('qkatawazi');
            await quickCasePo.selectCaseTemplate(caseTemplateData.templateName);
            await quickCasePo.saveCase();
            await casePreviewPo.clickGoToCaseButton();
            await viewCasePage.clickOnTab('Case Access');
            expect(await caseAccessTabPo.isCaseAccessEntityAdded(suppGrpData1.orgName)).toBeTruthy('FailuerMsg1: Support Group Name is missing');
            expect(await caseAccessTabPo.isCaseAccessEntityAdded('fnPerson19501 lnPerson19501')).toBeTruthy('FailuerMsg1: Agent Name is missing');
            expect(await caseAccessTabPo.isSupportGroupReadAccessDisplayed(suppGrpData1.orgName)).toBeTruthy('Support Group does not have read access');
        });
        afterAll(async () => {
            await navigationPo.signOut();
            await loginPage.login('qkatawazi');
        });
    });

    describe('[DRDMV-7026,DRDMV-7033,DRDMV-11986]: [Read Access] Configuring a Default Read Access', async () => {
        const randomStr = [...Array(10)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        let newCase1, caseTemplateData, readAccessMappingData1, readAccessMappingData2;
        beforeAll(async () => {
            await createCategoryAssociation();
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
            await apiHelper.apiLogin('qkatawazi');
            newCase1 = await apiHelper.createCase(caseData);
            await apiHelper.createCaseTemplate(caseTemplateData);
            await apiHelper.createReadAccessMapping(readAccessMappingData1);
            await apiHelper.createReadAccessMapping(readAccessMappingData2);
            readAccessMappingData2.configName = randomStr + '3ReadAccessMappingName';
            await apiHelper.createReadAccessMapping(readAccessMappingData2);
        });
        it('[DRDMV-7026,DRDMV-7033,DRDMV-11986]: [Read Access] Configuring a Default Read Access', async () => {
            await navigationPo.gotoSettingsPage();
            await navigationPo.gotoSettingsMenuItem('Case Management--Read Access', 'Case Read Access Configuration - Business Workflows');
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
        it('[DRDMV-7026,DRDMV-7033,DRDMV-11986]: [Read Access] Configuring a Default Read Access', async () => {
            await navigationPo.signOut();
            await loginPage.login('qtao');
            await navigationPo.gotoQuickCase();
            await quickCasePo.selectRequesterName('qkatawazi');
            await quickCasePo.selectCaseTemplate(caseTemplateData.templateName);
            await quickCasePo.saveCase();
            await casePreviewPo.clickGoToCaseButton();
            await viewCasePage.clickOnTab('Case Access');
            expect(await caseAccessTabPo.isCaseAccessEntityAdded('Compensation and Benefits')).toBeTruthy('FailuerMsg1: Support Group Name is missing');
            expect(await caseAccessTabPo.isSupportGroupReadAccessDisplayed('Compensation and Benefits')).toBeTruthy('Support Group does not have read access');
            await navigationPo.gotoQuickCase();
            await quickCasePo.selectRequesterName('qkatawazi');
            await quickCasePo.setCaseSummary('Read Access');
            await quickCasePo.saveCase();
            await casePreviewPo.clickGoToCaseButton();
            await viewCasePage.clickOnTab('Case Access');
            expect(await caseAccessTabPo.isCaseAccessEntityAdded('Compensation and Benefits')).toBeTruthy('FailuerMsg1: Support Group Name is missing');
            expect(await caseAccessTabPo.isSupportGroupReadAccessDisplayed('Compensation and Benefits')).toBeTruthy('Support Group does not have read access');
            await navigationPo.signOut();
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
            await navigationPo.signOut();
            await loginPage.login('qkatawazi');
        });
    }); 

    describe('[DRDMV-2004]: [Read Access] Applying mapping with flowset in case of best match', async () => {
        const randomStr = [...Array(10)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        let readAccessMappingData1, readAccessMappingData2, readAccessMappingData3, caseTemplateData, caseTemplateData1;
        beforeAll(async () => {
            await apiHelper.apiLogin('qkatawazi');
            readAccessMappingData1 = {
                "configName": randomStr + '1ReadAccessMappingName',
                "assignedCompany": 'Petramco',
                "businessUnit": 'HR Support',
                "supportGroup": 'Compensation and Benefits',
                "company": 'Petramco',
                "category1": 'Facilities',
                "category2": 'Conference Room',
                "category3": 'Furniture',
            }
            readAccessMappingData2 = {
                "configName": randomStr + '2ReadAccessMappingName',
                "assignedCompany": 'Petramco',
                "businessUnit": 'Canada Support',
                "supportGroup": 'CA Support 2',
                "company": 'Petramco',
                "category1": 'Facilities',
                "category2": 'Conference Room',
            }
            readAccessMappingData3 = {
                "configName": randomStr + '3ReadAccessMappingName',
                "assignedCompany": 'Petramco',
                "businessUnit": 'Latin America Support',
                "supportGroup": 'LA Support 1',
                "company": 'Petramco',
            }
            caseTemplateData = {
                "templateName": `${randomStr}1Case template`,
                "templateStatus": "Draft",
                "templateSummary": `${randomStr}Summary`,
                "caseStatus": "New",
                "casePriority": "Low",
                "categoryTier1": 'Facilities',
                "categoryTier2": 'Conference Room',
                "categoryTier3": 'Furniture',
                "company": "Petramco",
                "businessUnit": "Facilities Support",
                "supportGroup": "Facilities",
                "assignee": "Fritz",
                "ownerBU": 'Facilities Support',
                "ownerGroup": "Facilities",
            }
            caseTemplateData1 = {
                "templateName": `${randomStr}2CaseTemplate`,
                "templateStatus": "Draft",
                "templateSummary": `${randomStr}Summary`,
                "caseStatus": "New",
                "categoryTier1": 'Facilities',
                "company": "Petramco",
                "businessUnit": "United States Support",
                "supportGroup": "US Support 3",
                "assignee": "qfeng",
                "ownerBU": "United States Support",
                "ownerGroup": "US Support 3"
            }
            await apiHelper.createCaseTemplate(caseTemplateData);
            await apiHelper.createCaseTemplate(caseTemplateData1);
            await apiHelper.createReadAccessMapping(readAccessMappingData1);
            await apiHelper.createReadAccessMapping(readAccessMappingData2);
            await apiHelper.createReadAccessMapping(readAccessMappingData3);
        });
        it('[DRDMV-2004]: [Read Access] Applying mapping with flowset in case of best match', async () => {
            await navigationPo.gotoSettingsPage();
            await navigationPo.gotoSettingsMenuItem('Case Management--Read Access', 'Case Read Access Configuration - Business Workflows');
            await utilGrid.searchAndOpenHyperlink(readAccessMappingData1.configName);
            await editReadAccess.selectFlowset('Facilities Management');
            await editReadAccess.selectPriority('Low');
            await editReadAccess.clickOnSave();
            await utilCommon.closePopUpMessage();
            await utilGrid.searchAndOpenHyperlink(readAccessMappingData2.configName);
            await editReadAccess.selectFlowset('Facilities Management');
            await editReadAccess.clickOnSave();
            await navigationPo.gotoSettingsPage();
            await navigationPo.gotoSettingsMenuItem('Case Management--Templates', 'Case Templates - Business Workflows');
            await utilGrid.searchAndOpenHyperlink(caseTemplateData.templateName);
            await viewCaseTemplate.clickOnEditCaseTemplateButton();
            await editCasetemplatePo.changeFlowsetValue('Facilities Management');
            await editCasetemplatePo.clickSaveCaseTemplate();
            await utilCommon.closePopUpMessage();
            await editCaseTemplate.clickOnEditCaseTemplateMetadata();
            await editCaseTemplate.changeTemplateStatusDropdownValue('Active');
            await editCaseTemplate.clickOnSaveCaseTemplateMetadata();
            await utilCommon.closePopUpMessage();
            await utilCommon.clickOnBackArrow();
            await utilGrid.searchAndOpenHyperlink(caseTemplateData1.templateName);
            await viewCaseTemplate.clickOnEditCaseTemplateButton();
            await editCasetemplatePo.changeFlowsetValue('Facilities Management');
            await editCasetemplatePo.clickSaveCaseTemplate();
            await utilCommon.closePopUpMessage();
            await editCaseTemplate.clickOnEditCaseTemplateMetadata();
            await editCaseTemplate.changeTemplateStatusDropdownValue('Active');
            await editCaseTemplate.clickOnSaveCaseTemplateMetadata();
            await utilCommon.closePopUpMessage();
        });
        it('[DRDMV-2004]: [Read Access] Applying mapping with flowset in case of best match', async () => {
            await navigationPo.signOut();
            await loginPage.login('qtao');
            await navigationPo.gotoCreateCase();
            await createCasePage.selectRequester('adam');
            await createCasePage.setSummary('set summary');
            await createCasePage.clickSelectCaseTemplateButton();
            await selectCasetemplateBladePo.selectCaseTemplate(caseTemplateData.templateName);
            await createCasePage.clickSaveCaseButton();
            await casePreviewPo.clickGoToCaseButton();
            await viewCasePage.clickOnTab('Case Access');
            expect(await caseAccessTabPo.isCaseAccessEntityAdded('Compensation and Benefits')).toBeTruthy('FailuerMsg1: Support Group Name is missing');
            expect(await caseAccessTabPo.isSupportGroupReadAccessDisplayed('Compensation and Benefits')).toBeTruthy('Support Group does not have read access');
            await navigationPo.gotoCreateCase();
            await createCasePage.selectRequester('adam');
            await createCasePage.setSummary('set summary');
            await createCasePage.clickSelectCaseTemplateButton();
            await selectCasetemplateBladePo.selectCaseTemplate(caseTemplateData1.templateName);
            await createCasePage.clickSaveCaseButton();
            await casePreviewPo.clickGoToCaseButton();
            await viewCasePage.clickOnTab('Case Access');
            expect(await caseAccessTabPo.isCaseAccessEntityAdded('LA Support 1')).toBeTruthy('FailuerMsg1: Support Group Name is missing');
            expect(await caseAccessTabPo.isSupportGroupReadAccessDisplayed('LA Support 1')).toBeTruthy('Support Group does not have read access');
        });
        afterAll(async () => {
            await apiHelper.apiLogin('tadmin');
            await apiHelper.deleteCaseReadAccess(readAccessMappingData1.configName);
            await apiHelper.deleteCaseReadAccess(readAccessMappingData2.configName);
            await apiHelper.deleteCaseReadAccess(readAccessMappingData3.configName);
            await navigationPo.signOut();
            await loginPage.login('qkatawazi');
        });
    });

    describe('[DRDMV-22479]: Bulk Case Access update clicking Reset to default.', async () => {
        let newCase1;
        beforeAll(async () => {
            await apiHelper.apiLogin('franz');
            let caseData = {
                "Requester": "apavlik",
                "Summary": "Test case for Read Access",
                "Assigned Company": "Petramco",
                "Business Unit": "Facilities Support",
                "Support Group": "Facilities",
                "Assignee": "Fritz"
            }
            newCase1 = await apiHelper.createCase(caseData);
            await foundationData2("Petramco");
        });
        it('[DRDMV-22479]: Bulk Case Access update clicking Reset to default.', async () => {
            await navigationPo.signOut();
            await loginPage.login('fritz');
            await utilityGrid.searchAndOpenHyperlink(newCase1.displayId);
            await viewCasePage.clickOnTab('Case Access');
            //Bulk Read Access
            await caseAccessTabPo.clickOnSupportGroupAccessORAgentAccessButton('Support Group Access');
            await caseAccessTabPo.selectCompany('Petramco', 'Select Company');
            await caseAccessTabPo.selectBusinessUnit(businessData1.orgName, 'Select Business Unit');
            await caseAccessTabPo.clickOnReadAccessAddButton('Add Business Unit');
            await caseAccessTabPo.selectCompany('Petramco', 'Select Company');
            await caseAccessTabPo.selectBusinessUnit(businessData1.orgName, 'Select Business Unit');
            await caseAccessTabPo.selectDepartment(departmentData1.orgName, 'Select Department');
            await caseAccessTabPo.clickOnReadAccessAddButton('Add Support Department');
            await caseAccessTabPo.selectCompany('Petramco', 'Select Company');
            await caseAccessTabPo.selectBusinessUnit(businessData1.orgName, 'Select Business Unit');
            await caseAccessTabPo.selectDepartment(departmentData1.orgName, 'Select Department');
            await caseAccessTabPo.selectSupportGroup(suppGrpData1.orgName, 'Select Support Group');
            await caseAccessTabPo.clickOnReadAccessAddButton('Add Support Group');
            await caseAccessTabPo.clickOnSupportGroupAccessORAgentAccessButton('Agent Access');
            await caseAccessTabPo.selectAndAddAgent('fnPerson lnPerson');
            expect(await activityTabPo.getReadAccessActivityCount('granted read access')).toBe(4);
        });
        it('[DRDMV-22479]: Bulk Case Access update clicking Reset to default.', async () => {
            //Bulk Write Access
            await caseAccessTabPo.selectCompany('Petramco', 'Select Company');
            await caseAccessTabPo.selectBusinessUnit(businessData2.orgName, 'Select Business Unit');
            await caseAccessTabPo.clickOnWriteAccessAddButton('Add Business Unit');
            await caseAccessTabPo.selectCompany('Petramco', 'Select Company');
            await caseAccessTabPo.selectBusinessUnit(businessData2.orgName, 'Select Business Unit');
            await caseAccessTabPo.selectDepartment(departmentData2.orgName, 'Select Department');
            await caseAccessTabPo.clickOnWriteAccessAddButton('Add Support Department');
            await caseAccessTabPo.selectCompany('Petramco', 'Select Company');
            await caseAccessTabPo.selectBusinessUnit(businessData2.orgName, 'Select Business Unit');
            await caseAccessTabPo.selectDepartment(departmentData2.orgName, 'Select Department');
            await caseAccessTabPo.selectSupportGroup(suppGrpData2.orgName, 'Select Support Group');
            await caseAccessTabPo.clickOnWriteAccessAddButton('Add Support Group');
            await caseAccessTabPo.selectAgentWithWriteAccess('fnPerson19501 lnPerson19501');
            await caseAccessTabPo.clickOnSupportGroupAccessORAgentAccessButton('Support Group Access');
            expect(await activityTabPo.getReadAccessActivityCount('granted write access')).toBe(4);
        });
        it('[DRDMV-22479]: Bulk Case Access update clicking Reset to default.', async () => {
            await caseAccessTabPo.deleteAccess('UI-BusinessUnit');
            await caseAccessTabPo.deleteAccess('UI-Department');
            await caseAccessTabPo.deleteAccess('UI-SupportGroup');
            await caseAccessTabPo.deleteAccess('fnPerson lnPerson');
            await caseAccessTabPo.deleteAccess('UI-BusinessUnit-19501');
            await caseAccessTabPo.deleteAccess('UI-Department-19501');
            await caseAccessTabPo.deleteAccess('UI-SupportGroup-19501');
            await caseAccessTabPo.deleteAccess('fnPerson19501 lnPerson19501');
            expect(await activityTabPo.getReadAccessActivityCount('revoked read access of')).toBe(4);
            expect(await activityTabPo.getReadAccessActivityCount('revoked write access of')).toBe(4);
        });
        afterAll(async () => {
            await navigationPo.signOut();
            await loginPage.login('qkatawazi');
        });
    });
});
