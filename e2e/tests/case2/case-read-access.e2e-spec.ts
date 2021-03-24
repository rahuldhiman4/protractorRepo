import { cloneDeep } from 'lodash';
import { browser } from "protractor";
import apiCoreUtil from '../../api/api.core.util';
import apiHelper from '../../api/api.helper';
import { flowsetGlobalFields } from '../../data/ui/flowset/flowset.ui';
import casePreviewPo from '../../pageobject/case/case-preview.po';
import createCasePage from "../../pageobject/case/create-case.po";
import editCasePo from '../../pageobject/case/edit-case.po';
import quickCasePo from '../../pageobject/case/quick-case.po';
import selectCasetemplateBladePo from '../../pageobject/case/select-casetemplate-blade.po';
import viewCasePage from "../../pageobject/case/view-case.po";
import accessTabPo from '../../pageobject/common/access-tab.po';
import changeAssignmentPage from '../../pageobject/common/change-assignment.po';
import loginPage from "../../pageobject/common/login.po";
import navigationPo from "../../pageobject/common/navigation.po";
import addReadAccess from '../../pageobject/settings/case-management/add-read-access-configuration.po';
import consoleCasetemplatePo from '../../pageobject/settings/case-management/console-casetemplate.po';
import createCaseTemplate from '../../pageobject/settings/case-management/create-casetemplate.po';
import editCasetemplatePo from '../../pageobject/settings/case-management/edit-casetemplate.po';
import editReadAccess from "../../pageobject/settings/case-management/edit-read-access-config.po";
import consoleReadAcess from '../../pageobject/settings/case-management/read-access-console.po';
import viewCaseTemplate from '../../pageobject/settings/case-management/view-casetemplate.po';
import activityTabPo from '../../pageobject/social/activity-tab.po';
import manageTaskBladePo from '../../pageobject/task/manage-task-blade.po';
import { BWF_BASE_URL, BWF_PAGE_TITLES } from '../../utils/constants';
import utilityCommon from '../../utils/utility.common';
import utilityGrid from '../../utils/utility.grid';
import { ICaseTemplate } from '../../data/interface/template.interface';
let flowsetGlobalFieldsData = undefined;

describe("Case Read Access", () => {
    const businessDataFile = require('../../data/ui/foundation/businessUnit.ui.json');
    const supportGrpDataFile = require('../../data/ui/foundation/supportGroup.ui.json');
    const personDataFile = require('../../data/ui/foundation/person.ui.json');
    let businessData1, departmentData1, suppGrpData1, businessData2, departmentData2, suppGrpData2;
    let userData1;
    beforeAll(async () => {
        await utilityCommon.closeAllBlades();
        let randomStr = [...Array(4)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        await browser.get(BWF_BASE_URL);
        await loginPage.login("qkatawazi");
        // await foundationData1("Petramco");
        await apiHelper.apiLogin('qkatawazi');
        flowsetGlobalFieldsData = await cloneDeep(flowsetGlobalFields);
        flowsetGlobalFieldsData.flowsetName = flowsetGlobalFieldsData.flowsetName = randomStr;
        await apiHelper.createNewFlowset(flowsetGlobalFieldsData);
    });

    afterAll(async () => {
        await utilityCommon.closeAllBlades();
        await navigationPo.signOut();
    });

    async function foundationData1(company: string) {
        await apiHelper.apiLogin('tadmin');
        businessData1 = businessDataFile['BusinessUnitData'];
        suppGrpData1 = supportGrpDataFile['SuppGrpData'];
        let personData1 = personDataFile['PersonData'];
        await apiHelper.createNewUser(personData1);
        await apiHelper.associatePersonToCompany(personData1.userId, company);
        businessData1.relatedOrgId = company;
        let businessUnitId = await apiHelper.createBusinessUnit(businessData1);
        await browser.sleep(5000); // timeout requried to reflect data on UI
        await apiHelper.createSupportGroup(suppGrpData1);
        await browser.sleep(5000); // timeout requried to reflect data on UI
        await apiHelper.associatePersonToSupportGroup(personData1.userId, suppGrpData1.orgName);
    }

    async function foundationData2(company: string) {
        await apiHelper.apiLogin('tadmin');
        businessData2 = businessDataFile['BusinessUnitData19501'];
        suppGrpData2 = supportGrpDataFile['SuppGrpData19501'];
        let personData2 = personDataFile['PersonData19501'];
        await apiHelper.createNewUser(personData2);
        await apiHelper.associatePersonToCompany(personData2.userId, company);
        businessData2.relatedOrgId = company;
        let businessUnitId = await apiHelper.createBusinessUnit(businessData2);
        await browser.sleep(5000); // timeout requried to reflect data on UI
        await apiHelper.createSupportGroup(suppGrpData2);
        await browser.sleep(5000); // timeout requried to reflect data on UI
        await apiHelper.associatePersonToSupportGroup(personData2.userId, suppGrpData2.orgName);
    }

    async function createNewUsers() {
        await apiHelper.apiLogin('tadmin');
        userData1 = {
            "firstName": "7605",
            "lastName": "User1",
            "userId": "manager",
            "emailId": "manager@petramco.com",
            "userPermission": ["Case Manager", "Human Resource"]
        }
        await apiHelper.createNewUser(userData1);
        // userData2 = {
        //     "firstName": "7605",
        //     "lastName": "User2",
        //     "userId": "analyst",
        //     "emailId": "analyst@petramco.com",
        //     "userPermission": ["Case Business Analyst", "Human Resource"]
        // }
        // await apiHelper.createNewUser(userData2);
        await apiHelper.associatePersonToCompany(userData1.userId, "Petramco");
        await apiHelper.associatePersonToCompany(userData1.userId, "Psilon");
        // await apiHelper.associatePersonToCompany(userData2.userId, "Petramco");
        // await apiHelper.associatePersonToCompany(userData2.userId, "Psilon");
        await apiHelper.associatePersonToSupportGroup(userData1.userId, "Psilon Support Group1");
    }

    // #passed
    it('[5011]:[Read Access] Editing Read Access Mappings Company to Global', async () => {
        let randVal = [...Array(10)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        await navigationPo.gotoSettingsPage();
        await navigationPo.gotoSettingsMenuItem('Case Management--Read Access', BWF_PAGE_TITLES.CASE_MANAGEMENT.READ_ACCESS);
        await consoleReadAcess.clickOnReadAccessConfiguration();
        await addReadAccess.setReadAccessConfigurationName("ReadAccess" + randVal);
        await addReadAccess.selectCompany('Petramco');
        await addReadAccess.selectSupportCompany('Petramco');
        await addReadAccess.selectSupportOrg('Australia Support');
        await addReadAccess.selectSupportGroup('AU Support 2');
        await addReadAccess.clickOnSave();
        await utilityGrid.searchAndOpenHyperlink("ReadAccess" + randVal);
        await editReadAccess.selectCompany('- Global -');
        await editReadAccess.clickOnSave();
        await utilityGrid.searchAndOpenHyperlink("ReadAccess" + randVal);
        expect(await editReadAccess.isCompanyFieldDisabled()).toBeTruthy('Company is not disabled');
        await editReadAccess.clickOnCancel();
        await utilityCommon.clickOnApplicationWarningYesNoButton('Yes');
        await utilityGrid.searchAndSelectGridRecord("ReadAccess" + randVal);
        await consoleReadAcess.clickDeleteButton();
        await utilityCommon.clickOnApplicationWarningYesNoButton('Yes');
        expect(await utilityCommon.isPopUpMessagePresent('Record(s) deleted successfully.')).toBeTruthy('Successfull message is not appeared');
    });

    // #passed ?
    describe('[5025]:[Read Access] Verify Global read acess configuration applied to case if read acess configuration qualification matches', async () => {
        let randVal = [...Array(10)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        let readAccessName = "ReadAccess" + randVal;
        it('[5025]:[Read Access] Verify Global read acess configuration applied to case if read acess configuration qualification matches', async () => {
            await navigationPo.gotoSettingsPage();
            await navigationPo.gotoSettingsMenuItem('Case Management--Read Access', BWF_PAGE_TITLES.CASE_MANAGEMENT.READ_ACCESS);
            await consoleReadAcess.clickOnReadAccessConfiguration();
            await addReadAccess.setReadAccessConfigurationName(readAccessName);
            await addReadAccess.selectCompany('Global');
            await addReadAccess.selectPriority('Critical');
            await addReadAccess.selectCategoryTier1('Employee Relations');
            await addReadAccess.selectSupportCompany('Petramco');
            await addReadAccess.selectSupportOrg('HR Support');
            await addReadAccess.selectSupportGroup('Employee Relations');
            await addReadAccess.clickOnSave();
            await utilityCommon.closePopUpMessage();

            await navigationPo.gotoCreateCase();
            await createCasePage.selectRequester('adam');
            await createCasePage.setSummary('set summary');
            await createCasePage.selectCategoryTier1('Employee Relations');
            await createCasePage.setPriority('Critical');
            await changeAssignmentPage.setDropDownValue('AssignedGroup', 'US Support 3');
            await changeAssignmentPage.setDropDownValue('Assignee', 'Qadim Katawazi');
            await createCasePage.clickSaveCaseButton();
            await casePreviewPo.clickGoToCaseButton();
            await utilityCommon.clickOnApplicationWarningYesNoButton("Yes");
            await viewCasePage.clickOnTab('Case Access');
            expect(await accessTabPo.isAccessTypeOfEntityDisplayed('Qadim Katawazi', 'Write')).toBeTruthy('FailuerMsg1: Agent Name is missing');
            expect(await accessTabPo.isAccessTypeOfEntityDisplayed('US Support 3', 'Write')).toBeTruthy('Support Group does not have write access');
            expect(await accessTabPo.isAccessTypeOfEntityDisplayed('Employee Relations', 'Read')).toBeTruthy('Support Group does not have read access');
        });
        it('[5025]: create same name record in same LOB', async () => {
            //create same name record in same LOB
            await navigationPo.signOut();
            await loginPage.login('jbarnes');
            await navigationPo.gotoSettingsPage();
            await navigationPo.gotoSettingsMenuItem('Case Management--Read Access', BWF_PAGE_TITLES.CASE_MANAGEMENT.READ_ACCESS);
            await utilityGrid.selectLineOfBusiness('Human Resource');
            await consoleReadAcess.clickOnReadAccessConfiguration();
            await addReadAccess.setReadAccessConfigurationName(readAccessName);
            await addReadAccess.selectCompany('Global');
            await addReadAccess.selectPriority('Critical');
            await addReadAccess.selectCategoryTier1('Employee Relations');
            await addReadAccess.selectSupportCompany('Petramco');
            await addReadAccess.selectSupportOrg('Australia Support');
            await addReadAccess.selectSupportGroup('AU Support 1');
            await addReadAccess.clickOnSave();
            expect(await utilityCommon.isPopUpMessagePresent('The Access Mapping Name already exists. Please select a different name.')).toBeTruthy("Error message absent");
            await addReadAccess.clickOnCancel();
            await utilityCommon.clickOnApplicationWarningYesNoButton("Yes");
            await utilityCommon.closePopUpMessage();
        });
        it('[5025]: create same name record in different LOB', async () => {
            //create same name record in different LOB
            await utilityGrid.selectLineOfBusiness('Facilities');
            await consoleReadAcess.clickOnReadAccessConfiguration();
            await addReadAccess.setReadAccessConfigurationName(readAccessName);
            await addReadAccess.selectCompany('Global');
            // verify categ1, BU and SG as per LOB
            await utilityCommon.isAllDropDownValuesMatches(addReadAccess.selectors.categoryTier1Guid, ['Applications', 'Facilities', 'Fixed Assets', 'Phones', 'Projectors', 'Purchasing Card']);
            await addReadAccess.selectSupportCompany('Petramco');
            await addReadAccess.selectSupportOrg('Facilities Support');
            await addReadAccess.selectSupportGroup('Facilities');
            // verify LOB is there
            expect(await addReadAccess.getLobValue()).toBe("Facilities");
            await addReadAccess.clickOnSave();
            expect(await utilityCommon.isPopUpMessagePresent('Saved successfully.')).toBeTruthy("Success message absent");
            await utilityCommon.closePopUpMessage();
            // open the record and verify LOB is on edit screen
            await utilityGrid.searchAndOpenHyperlink(readAccessName);
            expect(await editReadAccess.getLobValue()).toBe("Facilities");
            await editReadAccess.clickOnCancel();
            await utilityGrid.selectLineOfBusiness('Human Resource');
        });
        afterAll(async () => {
            await utilityCommon.closeAllBlades();
            await navigationPo.signOut();
            await loginPage.login("qkatawazi");
        });
    });

    // #passed
    describe('[5050,5049]: [Global Case Template] Create/Update Case template with company and flowset as Global', async () => {
        let randomStr = [...Array(4)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        let caseTemplate1 = 'Case Template 1' + randomStr;
        let caseTemplateSummary1 = 'Summary 1' + randomStr;
        it('[5050,5049]: [Global Case Template] Create/Update Case template with company and flowset as Global', async () => {
            await navigationPo.gotoSettingsPage();
            await navigationPo.gotoSettingsMenuItem('Case Management--Templates', BWF_PAGE_TITLES.CASE_MANAGEMENT.TEMPLATES);
            await consoleCasetemplatePo.clickOnCreateCaseTemplateButton();
            await createCaseTemplate.setTemplateName(caseTemplate1);
            await createCaseTemplate.setCompanyName('- Global -');
            await createCaseTemplate.setCaseSummary(caseTemplateSummary1);
            await createCaseTemplate.setFlowsetValue(flowsetGlobalFieldsData.flowsetName);
            await createCaseTemplate.setTemplateStatusDropdownValue('Active');
            await createCaseTemplate.clickSaveCaseTemplate();
            await utilityCommon.closePopUpMessage();
            expect(await viewCaseTemplate.getCaseCompanyValue()).toBe('- Global -');
            expect(await viewCaseTemplate.getFlowsetValue()).toBe(flowsetGlobalFieldsData.flowsetName);
            await viewCaseTemplate.clickOnEditCaseTemplateButton();
            expect(await editCasetemplatePo.isCaseCompanyDisabled()).toBeTruthy();
            await editCasetemplatePo.clickOnCancelButton();
            await utilityCommon.clickOnApplicationWarningYesNoButton('Yes');
            await viewCaseTemplate.clickBackArrowBtn();
            await navigationPo.gotoCaseConsole();
        });
        it('[5050,5049]: [Global Case Template] Create/Update Case template with company and flowset as Global', async () => {
            await navigationPo.gotoSettingsPage();
            await navigationPo.gotoSettingsMenuItem('Case Management--Read Access', BWF_PAGE_TITLES.CASE_MANAGEMENT.READ_ACCESS);
            await consoleReadAcess.clickOnReadAccessConfiguration();
            await addReadAccess.setReadAccessConfigurationName("test_mapping" + randomStr);
            await addReadAccess.selectCompany('- Global -');
            await addReadAccess.selectFlowset(flowsetGlobalFieldsData.flowsetName);
            await addReadAccess.selectSupportCompany('Petramco');
            await addReadAccess.selectSupportOrg('Australia Support');
            await addReadAccess.selectSupportGroup('AU Support 2');
            await addReadAccess.clickOnSave();
            await utilityCommon.closePopUpMessage();
            await utilityCommon.closeAllBlades();
            await navigationPo.signOut();
            await loginPage.login('gwixillian');
            await navigationPo.gotoSettingsPage();
            await navigationPo.gotoSettingsMenuItem('Case Management--Templates', BWF_PAGE_TITLES.CASE_MANAGEMENT.TEMPLATES);
            await consoleCasetemplatePo.searchAndClickOnCaseTemplate(caseTemplate1);
            expect(await viewCaseTemplate.getCaseCompanyValue()).toBe('- Global -');
            await viewCaseTemplate.clickOnEditCaseTemplateButton();
            expect(await editCasetemplatePo.isCaseSummaryReadOnly()).toBeTruthy();
        });
        afterAll(async () => {
            await utilityCommon.closeAllBlades();
            await navigationPo.signOut();
            await loginPage.login('qkatawazi');
        });
    });

    // #passed - quick case defect
    describe('[5578,5606]: [Read Access] Configuring non-default Read Access', async () => {
        const randomStr = [...Array(10)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        let caseTemplateData: ICaseTemplate;
        beforeAll(async () => {
            // await foundationData2("Petramco");
            await browser.sleep(5000); // timeout requried to reflect data on UI
            await apiHelper.apiLogin('qkatawazi');
            caseTemplateData = {
                "templateName": `${randomStr}Case template`,
                "templateStatus": "Active",
                "templateSummary": `${randomStr}Summary`,
                "caseStatus": "New",
                "casePriority": "Critical",
                "categoryTier1": 'Employee Relations',
                "company": "Petramco",
                "businessUnit": 'HR Support',
                "supportGroup": 'Staffing',
                "assignee": "hhaas",
                "ownerCompany": "Petramco",
                "ownerBU": "United States Support",
                "ownerGroup": "US Support 3"
            }
            await apiHelper.createCaseTemplate(caseTemplateData);
        });
        it('[5578,5606]: [Read Access] Configuring non-default Read Access', async () => {
            await navigationPo.gotoSettingsPage();
            await navigationPo.gotoSettingsMenuItem('Case Management--Read Access', BWF_PAGE_TITLES.CASE_MANAGEMENT.READ_ACCESS);
            await consoleReadAcess.clickOnReadAccessConfiguration();
            await addReadAccess.setReadAccessConfigurationName("ReadAccess" + randomStr);
            await addReadAccess.selectCompany('Petramco');
            await addReadAccess.selectPriority('Critical');
            await addReadAccess.selectCategoryTier1('Employee Relations');
            await addReadAccess.selectSupportCompany('Petramco');
            await addReadAccess.selectSupportOrg('HR Support');
            await addReadAccess.selectSupportGroup('Employee Relations');
            expect(await addReadAccess.isAccessMappingNameFieldMandatory()).toBeTruthy("Mapping Name Field is not present");
            expect(await addReadAccess.isBusinessUnitDisplayed()).toBeTruthy("Business Unit Field is not present");
            expect(await addReadAccess.isCancelButtonDisplayed()).toBeTruthy("Cancel Button is not present");
            expect(await addReadAccess.isFlowsetDisplayed()).toBeTruthy("Flowset Field is not present");
            expect(await addReadAccess.isPriorityDisplayed()).toBeTruthy("Priority Field is not present");
            expect(await addReadAccess.isSupportCompanyFieldMandatory()).toBeTruthy("Support Company Field is not present");
            expect(await addReadAccess.isSaveButtonDisplayed()).toBeTruthy("Save Button is not present");
            expect(await addReadAccess.isSupportGroupFieldMandatory()).toBeTruthy("Support Group Field is not present");
            expect(await addReadAccess.isUseAsDefaultFieldMandatory()).toBeTruthy("Use As Default Field is not present");
            await addReadAccess.clickOnSave();
            await utilityCommon.closePopUpMessage();
        });
        // quick-case template search defect
        it('[5578,5606]: [Read Access] Configuring non-default Read Access', async () => {
            await navigationPo.gotoQuickCase();
            await quickCasePo.selectRequesterName('qtao');
            await quickCasePo.selectCaseTemplate(caseTemplateData.templateName);
            await quickCasePo.saveCase();
            await casePreviewPo.clickGoToCaseButton();
            await viewCasePage.clickOnTab('Case Access');
            expect(await accessTabPo.isAccessTypeOfEntityDisplayed('Employee Relations', 'Read')).toBeTruthy('FailuerMsg1: Agent Name is missing');
            expect(await accessTabPo.isAccessTypeOfEntityDisplayed('Hannah Haas', 'Write')).toBeTruthy('Support Group does not have write access');
        });
        it('[5578,5606]: Verify if Case read access mapping is accessible to same LOB Case Manager', async () => {
            await navigationPo.signOut();
            await loginPage.login('qdu');
            await navigationPo.gotoSettingsPage();
            await navigationPo.gotoSettingsMenuItem('Case Management--Read Access', BWF_PAGE_TITLES.CASE_MANAGEMENT.READ_ACCESS);
            expect(await utilityGrid.isGridRecordPresent("ReadAccess" + randomStr)).toBeTruthy('Case read access mapping is displayed to same LOB with different company Case BA.');
        });

        it('[5578,5606]: Verify if Case read access mapping is accessible to different LOB Case BA', async () => {
            await navigationPo.signOut();
            await loginPage.login('fritz');
            await navigationPo.gotoSettingsPage();
            await navigationPo.gotoSettingsMenuItem('Case Management--Read Access', BWF_PAGE_TITLES.CASE_MANAGEMENT.READ_ACCESS);
            expect(await utilityGrid.isGridRecordPresent("ReadAccess" + randomStr)).toBeFalsy('Case read access mapping is dispayed to different LOB case BA');
        });

        it('[5578,5606]: Verify if Case read access mapping is accessible to different LOB Case Manager', async () => {
            await navigationPo.signOut();
            await loginPage.login('frieda');
            await navigationPo.gotoSettingsPage();
            await navigationPo.gotoSettingsMenuItem('Case Management--Read Access', BWF_PAGE_TITLES.CASE_MANAGEMENT.READ_ACCESS);
            expect(await utilityGrid.isGridRecordPresent("ReadAccess" + randomStr)).toBeFalsy('Case read access mapping is dispayed to different LOB case manager');
        });

        it('[5578,5606]: Verify if Case read access mapping is accessible to Case BA belonging to different company with same LOB', async () => {
            await navigationPo.signOut();
            await loginPage.login('gwixillian');
            await navigationPo.gotoSettingsPage();
            await navigationPo.gotoSettingsMenuItem('Case Management--Read Access', BWF_PAGE_TITLES.CASE_MANAGEMENT.READ_ACCESS);
            expect(await utilityGrid.isGridRecordPresent("ReadAccess" + randomStr)).toBeTruthy('Case read access mapping is not dispayed to same LOB and different company case BA');
        });

        it('[5578,5606]: Verify Case read access mapping is accessible to Case Manager user having access to multiple LOB', async () => {
            await navigationPo.signOut();
            await loginPage.login('qyuan');
            await navigationPo.gotoSettingsPage();
            await navigationPo.gotoSettingsMenuItem('Case Management--Read Access', BWF_PAGE_TITLES.CASE_MANAGEMENT.READ_ACCESS);
            await utilityGrid.selectLineOfBusiness('Human Resource');
            expect(await utilityGrid.isGridRecordPresent("ReadAccess" + randomStr)).toBeTruthy('Case read access mapping is dispayed to user with multiple LOB case manager');
            await utilityGrid.selectLineOfBusiness('Facilities');
            expect(await utilityGrid.isGridRecordPresent("ReadAccess" + randomStr)).toBeFalsy('Case read access mapping is not dispayed to user with multiple LOB case manager');
        });

        it('[5578,5606]: Verify if Case read access mapping is accessible to Case BA user having access to multiple LOB', async () => {
            await navigationPo.signOut();
            await loginPage.login('jbarnes');
            await navigationPo.gotoSettingsPage();
            await navigationPo.gotoSettingsMenuItem('Case Management--Read Access', BWF_PAGE_TITLES.CASE_MANAGEMENT.READ_ACCESS);
            await utilityGrid.selectLineOfBusiness('Human Resource');
            expect(await utilityGrid.isGridRecordPresent("ReadAccess" + randomStr)).toBeTruthy('Case read access mapping is dispayed to user with multiple LOB case manager');
            await utilityGrid.selectLineOfBusiness('Facilities');
            expect(await utilityGrid.isGridRecordPresent("ReadAccess" + randomStr)).toBeFalsy('Case read access mapping is not dispayed to user with multiple LOB case manager');
        });

        afterAll(async () => {
            await utilityCommon.closeAllBlades();
            await navigationPo.signOut();
            await loginPage.login('qkatawazi');
        });
    });

    // #passed - quick case defect
    describe('[5592,5589,5024,5037]: [Read Access] Configuring a Default Read Access', async () => {
        const randomStr = [...Array(10)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        let caseTemplateData, readAccessMappingData1, readAccessMappingData2;
        beforeAll(async () => {
            caseTemplateData = {
                "templateName": `${randomStr}Case template`,
                "templateStatus": "Active",
                "templateSummary": `${randomStr}Summary`,
                "caseStatus": "New",
                "casePriority": "Critical",
                "categoryTier1": "Employee Relations",
                "categoryTier2": "Compensation",
                "categoryTier3": "Bonus",
                "categoryTier4": "Retention Bonus",
                "company": "Petramco",
                "businessUnit": 'United States Support',
                "supportGroup": 'US Support 3',
                "ownerBU": "United States Support",
                "ownerGroup": "US Support 3"
            }
            readAccessMappingData1 = {
                "configName": randomStr + '1ReadAccessMappingName',
                "assignedCompany": 'Petramco',
                "businessUnit": 'HR Support',
                "supportGroup": 'Compensation and Benefits',
                "company": 'Petramco',
                "category1": "Employee Relations",
                "category2": "Compensation",
                "category3": "Bonus",
                "category4": "Retention Bonus",
            }
            readAccessMappingData2 = {
                "configName": randomStr + '2ReadAccessMappingName',
                "assignedCompany": 'Petramco',
                "businessUnit": 'United States Support',
                "supportGroup": 'US Support 3',
                "company": 'Petramco',
                "category1": 'Workforce Administration',
            }
            await apiHelper.apiLogin('qkatawazi');
            await apiHelper.createCaseTemplate(caseTemplateData);
            await apiHelper.createReadAccessMapping(readAccessMappingData1);
            await apiHelper.createReadAccessMapping(readAccessMappingData2);
            readAccessMappingData2.configName = randomStr + '3ReadAccessMappingName';
            await apiHelper.createReadAccessMapping(readAccessMappingData2);
        });
        // success
        it('[5592,5589,5024,5037]: [Read Access] Configuring a Default Read Access', async () => {
            await navigationPo.gotoSettingsPage();
            await navigationPo.gotoSettingsMenuItem('Case Management--Read Access', BWF_PAGE_TITLES.CASE_MANAGEMENT.READ_ACCESS);
            await consoleReadAcess.deleteDefaultReadAccess();
            await utilityGrid.searchAndOpenHyperlink(readAccessMappingData1.configName);
            await editReadAccess.selectCompany('Global');
            await editReadAccess.setDefaultToggleButton(true);
            await editReadAccess.clickOnSave();
            await utilityCommon.closePopUpMessage();
            await utilityGrid.searchAndOpenHyperlink(readAccessMappingData2.configName);
            await editReadAccess.selectCompany('Global');
            await editReadAccess.clickOnSave();
            await utilityCommon.closePopUpMessage();
            await utilityGrid.searchAndOpenHyperlink(readAccessMappingData2.configName);
            await editReadAccess.setDefaultToggleButton(true);
            await editReadAccess.clickOnSave();
            expect(await utilityCommon.isPopUpMessagePresent('Only one default record is allowed for a Line of Business. Please change the default flag and save the record.')).toBeTruthy('pop up message absent');
            await editReadAccess.clickOnCancel();
            await utilityCommon.clickOnApplicationWarningYesNoButton('Yes')
        });
        it('[5592,5589,5024,5037]: [Read Access] Configuring a Default Read Access', async () => {
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
            expect(await accessTabPo.isAccessTypeOfEntityDisplayed('Compensation and Benefits', 'Read')).toBeTruthy('FailuerMsg1: Support Group Name is missing');
            await navigationPo.gotoQuickCase();
            await quickCasePo.selectRequesterName('qkatawazi');
            await quickCasePo.setCaseSummary('Read Access');
            await quickCasePo.saveCase();
            await utilityCommon.closePopUpMessage();
            await casePreviewPo.clickGoToCaseButton();
            await viewCasePage.clickOnTab('Case Access');
            expect(await accessTabPo.isAccessTypeOfEntityDisplayed('Compensation and Benefits', 'Read')).toBeTruthy('FailuerMsg2: Support Group Name is missing');
            await navigationPo.signOut();
            await loginPage.login('qkatawazi');
            await navigationPo.gotoQuickCase();
            await quickCasePo.selectRequesterName('qtao');
            await quickCasePo.setCaseSummary('Read Access');
            await quickCasePo.saveCase();
            await utilityCommon.closePopUpMessage();
            await casePreviewPo.clickGoToCaseButton();
            await viewCasePage.clickOnTab('Case Access');
            await accessTabPo.clickToExpandAccessEntitiyByGroup('Support Group Access');
            await accessTabPo.clickToExpandAccessEntitiyByGroup('Support Group Access');
            expect(await accessTabPo.isAccessTypeOfEntityDisplayed('Compensation and Benefits', 'Read')).toBeTruthy('FailuerMsg3: Support Group Name is missing');
        });
        // success
        it('[5592,5589,5024,5037]: [Read Access] Configuring a Default Read Access', async () => {
            await navigationPo.signOut();
            await loginPage.login('gderuno');
            await navigationPo.gotoSettingsPage();
            await navigationPo.gotoSettingsMenuItem('Case Management--Read Access', BWF_PAGE_TITLES.CASE_MANAGEMENT.READ_ACCESS);
            await utilityGrid.searchRecordWithoutClearFilter(readAccessMappingData1.configName);
            expect(await consoleReadAcess.getValueOnReadAccessConfigGrid('Access Mapping Name')).toContain(readAccessMappingData1.configName);
            await utilityGrid.searchRecordWithoutClearFilter(readAccessMappingData2.configName);
            expect(await consoleReadAcess.getValueOnReadAccessConfigGrid('Access Mapping Name')).toContain(readAccessMappingData2.configName);
            await utilityGrid.searchAndOpenHyperlink(readAccessMappingData1.configName);
            expect(await editReadAccess.isCompanyFieldDisabled()).toBeTruthy('Company is not disabled');
            await editReadAccess.clickOnCancel();
            await utilityCommon.clickOnApplicationWarningYesNoButton('Yes');
        });
        afterAll(async () => {
            await utilityCommon.closeAllBlades();
            await apiHelper.apiLogin('tadmin');
            await apiHelper.deleteReadAccessOrAssignmentMapping(readAccessMappingData1.configName);
            await apiHelper.deleteReadAccessOrAssignmentMapping(randomStr + '2ReadAccessMappingName');
            await apiHelper.deleteReadAccessOrAssignmentMapping(randomStr + '3ReadAccessMappingName');
            await navigationPo.signOut();
            await loginPage.login('qkatawazi');
        });
    });

    // #passed
    describe('[6060]: [Read Access] Applying mapping with flowset in case of best match', async () => {
        let randomStr = [...Array(10)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        let readAccessMappingData1, readAccessMappingData2, readAccessMappingData3, caseTemplateData1, caseTemplateData2;
        beforeAll(async () => {
            await apiHelper.apiLogin('qkatawazi');
            readAccessMappingData1 = {
                "configName": randomStr + '1ReadAccessMappingName',
                "assignedCompany": 'Petramco',
                "businessUnit": 'HR Support',
                "supportGroup": 'Compensation and Benefits',
                "company": 'Petramco',
                "category1": "Employee Relations",
                "category2": "Compensation",
                "category3": "Bonus",
            }
            readAccessMappingData2 = {
                "configName": randomStr + '2ReadAccessMappingName',
                "assignedCompany": 'Petramco',
                "businessUnit": 'Canada Support',
                "supportGroup": 'CA Support 2',
                "company": 'Petramco',
                "category1": "Employee Relations",
                "category2": "Compensation",
            }
            readAccessMappingData3 = {
                "configName": randomStr + '3ReadAccessMappingName',
                "assignedCompany": 'Petramco',
                "businessUnit": 'Latin America Support',
                "supportGroup": 'LA Support 1',
                "company": 'Petramco',
            }
            caseTemplateData1 = {
                "templateName": `${randomStr}1CaseTemplate`,
                "templateStatus": "Draft",
                "templateSummary": `${randomStr}Summary`,
                "caseStatus": "New",
                "casePriority": "Low",
                "categoryTier1": "Employee Relations",
                "categoryTier2": "Compensation",
                "categoryTier3": "Bonus",
                "company": "Petramco",
                "businessUnit": "United States Support",
                "supportGroup": "US Support 3",
                "assignee": "qkatawazi",
                "ownerBU": "United States Support",
                "ownerGroup": "US Support 3"
            }
            caseTemplateData2 = {
                "templateName": `${randomStr}2CaseTemplate`,
                "templateStatus": "Draft",
                "templateSummary": `${randomStr}Summary`,
                "caseStatus": "New",
                "categoryTier1": "Employee Relations",
                "company": "Petramco",
                "businessUnit": "United States Support",
                "supportGroup": "US Support 3",
                "assignee": "qfeng",
                "ownerBU": "United States Support",
                "ownerGroup": "US Support 3"
            }
            await apiHelper.createCaseTemplate(caseTemplateData1);
            await apiHelper.createCaseTemplate(caseTemplateData2);
            await apiHelper.createReadAccessMapping(readAccessMappingData1);
            await apiHelper.createReadAccessMapping(readAccessMappingData2);
            await apiHelper.createReadAccessMapping(readAccessMappingData3);
        });
        it('[6060]: [Read Access] Applying mapping with flowset in case of best match', async () => {
            await navigationPo.gotoSettingsPage();
            await navigationPo.gotoSettingsMenuItem('Case Management--Read Access', BWF_PAGE_TITLES.CASE_MANAGEMENT.READ_ACCESS);
            await utilityGrid.searchAndOpenHyperlink(readAccessMappingData1.configName);
            await editReadAccess.selectFlowset(flowsetGlobalFieldsData.flowsetName);
            await editReadAccess.selectPriority('Low');
            await editReadAccess.clickOnSave();
            await utilityCommon.closePopUpMessage();
            await utilityGrid.searchAndOpenHyperlink(readAccessMappingData2.configName);
            await editReadAccess.selectFlowset(flowsetGlobalFieldsData.flowsetName);
            await editReadAccess.clickOnSave();
            await utilityCommon.closePopUpMessage();
            await navigationPo.gotoSettingsPage();
            await navigationPo.gotoSettingsMenuItem('Case Management--Templates', BWF_PAGE_TITLES.CASE_MANAGEMENT.TEMPLATES);
            await utilityGrid.searchAndOpenHyperlink(caseTemplateData1.templateName);
            await viewCaseTemplate.clickOnEditCaseTemplateButton();
            await editCasetemplatePo.changeFlowsetValue(flowsetGlobalFieldsData.flowsetName);
            await editCasetemplatePo.clickSaveCaseTemplate();
            await utilityCommon.closePopUpMessage();
            await editCasetemplatePo.clickOnEditCaseTemplateMetadata();
            await editCasetemplatePo.changeTemplateStatusDropdownValue('Active');
            await editCasetemplatePo.clickOnSaveCaseTemplateMetadata();
            await utilityCommon.closePopUpMessage();
            await viewCaseTemplate.clickBackArrowBtn();
            await navigationPo.gotoSettingsPage();
            await navigationPo.gotoSettingsMenuItem('Case Management--Templates', BWF_PAGE_TITLES.CASE_MANAGEMENT.TEMPLATES);
            await utilityGrid.searchAndOpenHyperlink(caseTemplateData2.templateName);
            await viewCaseTemplate.clickOnEditCaseTemplateButton();
            await editCasetemplatePo.changeFlowsetValue(flowsetGlobalFieldsData.flowsetName);
            await editCasetemplatePo.clickSaveCaseTemplate();
            await utilityCommon.closePopUpMessage();
            await editCasetemplatePo.clickOnEditCaseTemplateMetadata();
            await editCasetemplatePo.changeTemplateStatusDropdownValue('Active');
            await editCasetemplatePo.clickOnSaveCaseTemplateMetadata();
            await utilityCommon.closePopUpMessage();
            await viewCaseTemplate.clickBackArrowBtn();
        });
        it('[6060]: [Read Access] Applying mapping with flowset in case of best match', async () => {
            await navigationPo.signOut();
            await loginPage.login('qtao');
            await navigationPo.gotoCreateCase();
            await createCasePage.selectRequester('adam');
            await createCasePage.setSummary('set summary');
            await createCasePage.clickSelectCaseTemplateButton();
            await selectCasetemplateBladePo.selectCaseTemplate(caseTemplateData1.templateName);
            await createCasePage.clickSaveCaseButton();
            await casePreviewPo.clickGoToCaseButton();
            await viewCasePage.clickOnTab('Case Access');
            expect(await accessTabPo.isAccessTypeOfEntityDisplayed('Compensation and Benefits', 'Read')).toBeTruthy('FailuerMsg1: Support Group Name is missing');
            await navigationPo.gotoCreateCase();
            await createCasePage.selectRequester('adam');
            await createCasePage.setSummary('set summary');
            await createCasePage.clickSelectCaseTemplateButton();
            await selectCasetemplateBladePo.selectCaseTemplate(caseTemplateData2.templateName);
            await createCasePage.clickSaveCaseButton();
            await casePreviewPo.clickGoToCaseButton();
            await viewCasePage.clickOnTab('Case Access');
            expect(await accessTabPo.isAccessTypeOfEntityDisplayed('LA Support 1', 'Read')).toBeTruthy('FailuerMsg1: Support Group Name is missing');
        });
        afterAll(async () => {
            await apiHelper.apiLogin('tadmin');
            await apiHelper.deleteReadAccessOrAssignmentMapping(readAccessMappingData1.configName);
            await apiHelper.deleteReadAccessOrAssignmentMapping(readAccessMappingData2.configName);
            await apiHelper.deleteReadAccessOrAssignmentMapping(readAccessMappingData3.configName);
            await utilityCommon.closeAllBlades();
            await navigationPo.signOut();
            await loginPage.login('qkatawazi');
        });
    });

    // #ashastra - fixed
    describe('[3457]: Bulk Case Access update clicking Reset to default.', async () => {
        let newCase1;
        beforeAll(async () => {
            await apiHelper.apiLogin('qkatawazi');
            let caseData = {
                "Requester": "apavlik",
                "Summary": "Test case for Read Access",
                "Assigned Company": "Petramco",
                "Business Unit": "United States Support",
                "Support Group": "US Support 3",
                "Assignee": "qkatawazi"
            }
            newCase1 = await apiHelper.createCase(caseData);
        });
        it('[3457]: Bulk Case Access update clicking Reset to default.', async () => {
            await navigationPo.signOut();
            await loginPage.login('qkatawazi');
            await utilityGrid.searchAndOpenHyperlink(newCase1.displayId);
            await viewCasePage.clickOnTab('Case Access');
            //Bulk Read Access
            await accessTabPo.clickToExpandAccessEntitiySearch('Support Group Access', 'Case');
            await accessTabPo.selectAccessEntityDropDown('Petramco', 'Select Company');
            await accessTabPo.selectAccessEntityDropDown('LA Support 1', 'Select Support Group');
            await accessTabPo.clickAccessEntitiyAddButton('Support Group');
            await accessTabPo.clickToExpandAccessEntitiySearch('Agent Access', 'Case');
            await accessTabPo.selectAgent('Quanah George', 'Agent');
            await accessTabPo.clickAccessEntitiyAddButton('Agent');
            await accessTabPo.selectAgent('Qiwei Liu', 'Agent');
            await accessTabPo.clickAccessEntitiyAddButton('Agent');
            expect(await activityTabPo.getGrantedReadAccessCount('granted read access')).toBe(3);
        });
        it('[3457]: Bulk Case Access update clicking Reset to default.', async () => {
            //Bulk Write Access // behaviour corrected
            await accessTabPo.selectAccessEntityDropDown('Petramco', 'Select Company');
            await accessTabPo.selectAccessEntityDropDown('LA Support 2', 'Select Support Group');
            await accessTabPo.clickAssignWriteAccessCheckbox('Support Group');
            await accessTabPo.clickAccessEntitiyAddButton('Support Group');
            await accessTabPo.selectAgent('Elizabeth Peters', 'Agent');
            await accessTabPo.clickAssignWriteAccessCheckbox('Agent');
            await accessTabPo.clickAccessEntitiyAddButton('Agent');
            await accessTabPo.selectAgent('Qianru Tao', 'Agent');
            await accessTabPo.clickAssignWriteAccessCheckbox('Agent');
            await accessTabPo.clickAccessEntitiyAddButton('Agent');
            expect(await activityTabPo.getGrantedReadAccessCount('granted write access')).toBe(3);
            await accessTabPo.clickOnResetToDefault();
            await activityTabPo.clickShowMoreLinkInActivity(1);
            expect(await activityTabPo.getRevokedReadAccessCount('revoked read access of')).toBe(3);
            await activityTabPo.clickShowMoreLinkInActivity(1);
            expect(await activityTabPo.getRevokedReadAccessCount('revoked write access of')).toBe(3);
        });
        afterAll(async () => {
            await utilityCommon.closeAllBlades();
            await navigationPo.signOut();
            await loginPage.login('qkatawazi');
        });
    });

    // #passed
    describe('[5543]: [Permissions] Case Read Access visibility', async () => {
        const randomStr = [...Array(10)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        let readAccessMappingData, readAccessMappingDataWithDiffrentCompany;
        beforeAll(async () => {
            // await createNewUsers();
            readAccessMappingData = {
                "configName": randomStr + '1ReadAccessMappingName',
                "assignedCompany": 'Petramco',
                "businessUnit": 'HR Support',
                "supportGroup": 'Compensation and Benefits',
                "company": 'Petramco',
                "category1": "Employee Relations",
                "category2": "Compensation",
                "category3": "Bonus",
                "category4": "Retention Bonus",
            }
            readAccessMappingDataWithDiffrentCompany = {
                "configName": randomStr + '2ReadAccessMappingName',
                "assignedCompany": 'Psilon',
                "businessUnit": 'Psilon Support Org1',
                "supportGroup": 'Psilon Support Group1',
                "company": 'Psilon',
            }
            await apiHelper.apiLogin('qheroux');
            await apiHelper.createReadAccessMapping(readAccessMappingData);
            await apiHelper.apiLogin('gderuno');
            await apiHelper.createReadAccessMapping(readAccessMappingDataWithDiffrentCompany);
        });
        it('[5543]: [Permissions] Case Read Access visibility', async () => {
            await navigationPo.signOut();
            await loginPage.login('qheroux');
            await navigationPo.gotoSettingsPage();
            await navigationPo.gotoSettingsMenuItem('Case Management--Read Access', BWF_PAGE_TITLES.CASE_MANAGEMENT.READ_ACCESS);
            await utilityGrid.searchRecordWithoutClearFilter(readAccessMappingData.configName);
            expect(await consoleReadAcess.getValueOnReadAccessConfigGrid('Access Mapping Name')).toContain(readAccessMappingData.configName);
            await navigationPo.signOut();
            await loginPage.login('qdu');
            await navigationPo.gotoSettingsPage();
            await navigationPo.gotoSettingsMenuItem('Case Management--Read Access', BWF_PAGE_TITLES.CASE_MANAGEMENT.READ_ACCESS);
            await utilityGrid.searchAndSelectGridRecord(readAccessMappingData.configName);
            expect(await consoleReadAcess.isDeleteButtonDisplayed()).toBeFalsy();
        });
        it('[5543]: [Permissions] Case Read Access visibility', async () => {
            await navigationPo.signOut();
            await loginPage.login('qheroux');
            await navigationPo.gotoSettingsPage();
            await navigationPo.gotoSettingsMenuItem('Case Management--Read Access', BWF_PAGE_TITLES.CASE_MANAGEMENT.READ_ACCESS);
            await utilityGrid.searchAndSelectGridRecord(readAccessMappingData.configName);
            await consoleReadAcess.clickDeleteButton();
            await utilityCommon.clickOnApplicationWarningYesNoButton("Yes");
            await utilityCommon.closePopUpMessage();
            expect(await consoleReadAcess.searchReadAccessMappingName(readAccessMappingData.configName)).toBeFalsy("Record is not Present");
            await navigationPo.signOut();
            await loginPage.login('gderuno');
            await navigationPo.gotoSettingsPage();
            await navigationPo.gotoSettingsMenuItem('Case Management--Read Access', BWF_PAGE_TITLES.CASE_MANAGEMENT.READ_ACCESS);
            await utilityGrid.searchAndSelectGridRecord(readAccessMappingDataWithDiffrentCompany.configName);
            await consoleReadAcess.clickDeleteButton();
            await utilityCommon.clickOnApplicationWarningYesNoButton("Yes");
            await utilityCommon.closePopUpMessage();
            expect(await consoleReadAcess.searchReadAccessMappingName(readAccessMappingDataWithDiffrentCompany.configName)).toBeFalsy("Record is not Present");
            await navigationPo.gotoSettingsPage();
            await navigationPo.gotoSettingsMenuItem('Case Management--Read Access', BWF_PAGE_TITLES.CASE_MANAGEMENT.READ_ACCESS);
            expect(await consoleReadAcess.searchReadAccessMappingName(readAccessMappingData.configName)).toBeFalsy("Record is not Present");
        });
        afterAll(async () => {
            await utilityCommon.closeAllBlades();
            await navigationPo.signOut();
            await loginPage.login('qkatawazi');
        });
    });

    // #ashastra
    describe('[5605]: [Read Access] Editing/Deleting the Read Access Mapping', async () => {
        const randomStr = [...Array(10)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        let caseTemplateData1, caseTemplateData2, readAccessMappingData;
        beforeAll(async () => {
            caseTemplateData1 = {
                "templateName": `${randomStr}1Casetemplate`,
                "templateStatus": "Active",
                "templateSummary": `${randomStr}Summary`,
                "caseStatus": "New",
                "casePriority": "Critical",
                "categoryTier1": "Employee Relations",
                "categoryTier2": "Compensation",
                "categoryTier3": "Bonus",
                "categoryTier4": "Retention Bonus",
                "company": "Petramco",
                "businessUnit": "United States Support",
                "supportGroup": "US Support 3",
                "assignee": "qfeng",
                "ownerBU": "United States Support",
                "ownerGroup": "US Support 3"
            }
            readAccessMappingData = {
                "configName": randomStr + '1ReadAccessMappingName',
                "assignedCompany": 'Petramco',
                "businessUnit": 'HR Support',
                "supportGroup": 'Compensation and Benefits',
                "company": 'Petramco',
                "category1": "Employee Relations",
                "category2": "Compensation",
                "category3": "Bonus",
                "category4": "Retention Bonus",
            }
            caseTemplateData2 = {
                "templateName": `${randomStr}2Casetemplate`,
                "templateStatus": "Active",
                "templateSummary": `${randomStr}Summary`,
                "caseStatus": "New",
                "casePriority": "Low",
                "categoryTier1": "Employee Relations",
                "categoryTier2": "Compensation",
                "categoryTier3": "Bonus",
                "categoryTier4": "Retention Bonus",
                "company": "Petramco",
                "businessUnit": "United States Support",
                "supportGroup": "US Support 3",
                "assignee": "qkatawazi",
                "ownerBU": "United States Support",
                "ownerGroup": "US Support 3"
            }
            await apiHelper.apiLogin('qkatawazi');
            await apiHelper.createCaseTemplate(caseTemplateData1);
            await apiHelper.createCaseTemplate(caseTemplateData2);
            await apiHelper.createReadAccessMapping(readAccessMappingData);
        });
        // #passed
        it('[5605]: [Read Access] Editing/Deleting the Read Access Mapping', async () => {
            await navigationPo.gotoSettingsPage();
            await navigationPo.gotoSettingsMenuItem('Case Management--Read Access', BWF_PAGE_TITLES.CASE_MANAGEMENT.READ_ACCESS);
            await consoleReadAcess.deleteDefaultReadAccess();
            await utilityGrid.searchAndOpenHyperlink(readAccessMappingData.configName);
            await editReadAccess.setDefaultToggleButton(true);
            await editReadAccess.clickOnSave();
            await utilityCommon.closePopUpMessage();
            await navigationPo.signOut();
            await loginPage.login('qtao');
            await navigationPo.gotoQuickCase();
            await quickCasePo.selectRequesterName('qkatawazi');
            await quickCasePo.selectCaseTemplate(caseTemplateData1.templateName);
            await quickCasePo.saveCase();
            await casePreviewPo.clickGoToCaseButton();
            await viewCasePage.clickOnTab('Case Access');
            expect(await accessTabPo.isAccessTypeOfEntityDisplayed('Compensation and Benefits', 'Read')).toBeTruthy('FailuerMsg1: Support Group Name is missing');
        });
        it('[5605]: [Read Access] Editing/Deleting the Read Access Mapping', async () => {
            await navigationPo.signOut();
            await loginPage.login('qkatawazi');
            await navigationPo.gotoSettingsPage();
            await navigationPo.gotoSettingsMenuItem('Case Management--Read Access', BWF_PAGE_TITLES.CASE_MANAGEMENT.READ_ACCESS);
            await consoleReadAcess.clickOnReadAccessConfiguration();
            await addReadAccess.clickOnSave();
            expect(await utilityCommon.isPopUpMessagePresent('Resolve the field validation errors and then try again.')).toBeTruthy('Pop up message absent');
            await utilityCommon.closeAllBlades();
            await utilityGrid.searchAndOpenHyperlink(readAccessMappingData.configName);
            await editReadAccess.setAccessMappingName(randomStr + 'UpdatedAccessMappingName');
            await editReadAccess.clickOnSave();
            await utilityCommon.closePopUpMessage();
            await utilityGrid.searchAndOpenHyperlink(randomStr + 'UpdatedAccessMappingName');
            await editReadAccess.selectPriority('Low');
            await editReadAccess.selectSupportOrg('United States Support');
            await editReadAccess.selectSupportGroup('US Support 3');
            await editReadAccess.clickOnSave();
            await utilityCommon.closePopUpMessage();
            await navigationPo.gotoQuickCase();
            await quickCasePo.selectRequesterName('adam');
            await quickCasePo.selectCaseTemplate(caseTemplateData2.templateName);
            await quickCasePo.saveCase();
            await casePreviewPo.clickGoToCaseButton();
            await viewCasePage.clickOnTab('Case Access');
            expect(await accessTabPo.isAccessTypeOfEntityDisplayed('US Support 3', 'Write')).toBeTruthy('FailuerMsg1: Support Group Name is missing');
        });
        it('[5605]: [Read Access] Editing/Deleting the Read Access Mapping', async () => {
            await navigationPo.gotoSettingsPage();
            await navigationPo.gotoSettingsMenuItem('Case Management--Read Access', BWF_PAGE_TITLES.CASE_MANAGEMENT.READ_ACCESS);
            await utilityGrid.searchAndSelectGridRecord(randomStr + 'UpdatedAccessMappingName');
            await consoleReadAcess.clickDeleteButton();
            await utilityCommon.clickOnApplicationWarningYesNoButton('Yes');
            await utilityCommon.closePopUpMessage();
            await navigationPo.gotoQuickCase();
            await quickCasePo.selectRequesterName('adam');
            await quickCasePo.selectCaseTemplate(caseTemplateData2.templateName);
            await quickCasePo.saveCase();
            await casePreviewPo.clickGoToCaseButton();
            await viewCasePage.clickOnTab('Case Access');
            expect(await accessTabPo.isAccessTypeOfEntityDisplayed('Compensation and Benefits', 'Read')).toBeFalsy('FailuerMsg1: Support Group Name is missing');
        });
        afterAll(async () => {
            await utilityCommon.closeAllBlades();
            await navigationPo.signOut();
            await loginPage.login('qkatawazi');
        });
    });

    // #ashastra passed
    describe('[5603]: [Read Access] Access to cases that match the Read Access partially - regular mapping', async () => {
        let randomStr = [...Array(10)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        let readAccessMappingData, readAccessMappingData2, templateData;
        beforeAll(async () => {
            readAccessMappingData = {
                "configName": randomStr + '1ReadAccessMappingName',
                "assignedCompany": 'Petramco',
                "businessUnit": "United States Support",
                "supportGroup": "US Support 1",
                "company": 'Petramco',
                "priority": "Low",
            }
            readAccessMappingData2 = {
                "configName": randomStr + '2ReadAccessMappingName',
                "assignedCompany": 'Petramco',
                "businessUnit": 'HR Support',
                "supportGroup": 'Compensation and Benefits',
                "company": 'Petramco',
                "priority": "Low",
            }
            templateData = {
                "templateName": 'manual task' + randomStr,
                "templateSummary": 'manual task' + randomStr,
                "templateStatus": "Active",
                "taskCompany": "Petramco",
                "ownerCompany": "Petramco",
                "ownerBusinessUnit": "United States Support",
                "ownerGroup": "US Support 1"
            }
            await apiHelper.apiLogin('qkatawazi');
            await apiHelper.createManualTaskTemplate(templateData)
            await apiHelper.createReadAccessMapping(readAccessMappingData);
            readAccessMappingData.category1 = "Employee Relations";
            readAccessMappingData.supportGroup = "Training and Development";
            await apiHelper.createReadAccessMapping(readAccessMappingData2);
            readAccessMappingData2.configName = randomStr + '3ReadAccessMappingName';
            readAccessMappingData2.category1 = "Payroll";
            readAccessMappingData2.category2 = "Finance";
            readAccessMappingData2.supportGroup = "Employee Relations";
            await apiHelper.createReadAccessMapping(readAccessMappingData2);
            readAccessMappingData2.configName = randomStr + '4ReadAccessMappingName';
            readAccessMappingData2.category1 = "Payroll";
            readAccessMappingData2.supportGroup = "Employee Relations Sensitive Data Access";
            await apiHelper.createReadAccessMapping(readAccessMappingData2);
            readAccessMappingData2.configName = randomStr + '5ReadAccessMappingName';
            readAccessMappingData2.category1 = "Payroll";
            readAccessMappingData2.category2 = "Finance";
            readAccessMappingData2.supportGroup = "Risk Management";
            await apiHelper.createReadAccessMapping(readAccessMappingData2);
            readAccessMappingData2.configName = randomStr + '6ReadAccessMappingName';
            readAccessMappingData2.category1 = "Payroll";
            readAccessMappingData2.category2 = "Finance";
            readAccessMappingData2.category3 = "Cost Centers";
            readAccessMappingData2.priority = "High";
            readAccessMappingData2.supportGroup = "Staffing";
            await apiHelper.createReadAccessMapping(readAccessMappingData2);
            readAccessMappingData2.configName = randomStr + '7ReadAccessMappingName';
            readAccessMappingData2.category1 = "Payroll";
            readAccessMappingData2.category2 = "Finance";
            readAccessMappingData2.category3 = "Cost Centers";
            readAccessMappingData2.priority = "Low";
            readAccessMappingData2.supportGroup = "Sensitive Personal Data (HR)";
            await apiHelper.createReadAccessMapping(readAccessMappingData2);
        });
        // #success
        it('[5603]: [Read Access] Access to cases that match the Read Access partially - regular mapping', async () => {
            await navigationPo.gotoCreateCase();
            await createCasePage.selectRequester('qtao');
            await createCasePage.setSummary('ReadAccessCase' + randomStr);
            await createCasePage.setPriority('Low');
            await createCasePage.clickSaveCaseButton();
            await casePreviewPo.clickGoToCaseButton();
            await viewCasePage.clickAddTaskButton();
            await manageTaskBladePo.addTaskFromTaskTemplate(templateData.templateName);
            await manageTaskBladePo.clickCloseButton();
            await viewCasePage.clickOnTab('Case Access');
            expect(await accessTabPo.isAccessTypeOfEntityDisplayed('US Support 1', 'Read')).toBeTruthy('FailuerMsg1: Support Group Name is missing');
            await accessTabPo.clickToExpandAccessEntitiySearch('Agent Access', 'Case');
            await accessTabPo.selectAgent('jbarnes', 'Agent');
            await accessTabPo.clickAccessEntitiyAddButton('Agent');
            await navigationPo.signOut();
            await loginPage.login('jbarnes');
            await utilityGrid.selectLineOfBusiness('Human Resource');
            await utilityGrid.searchAndOpenHyperlink('ReadAccessCase' + randomStr);
            expect(await viewCasePage.isAddTaskButtonDisabled()).toBeTruthy();
            await viewCasePage.clickEditCaseButton();
            expect(editCasePo.isCategoryTier1Disabled()).toBeTruthy();
            expect(editCasePo.isCategoryTier2Disabled()).toBeTruthy();
            expect(editCasePo.isCategoryTier3Disabled()).toBeTruthy();
            await editCasePo.clickOnCancelCaseButton();
            await utilityCommon.clickOnApplicationWarningYesNoButton("Yes");
        });
        // #success
        it('[5603]: [Read Access] Access to cases that match the Read Access partially - regular mapping', async () => {
            await navigationPo.signOut();
            await loginPage.login('qkatawazi');
            await navigationPo.gotoCreateCase();
            await createCasePage.selectRequester('qtao');
            await createCasePage.setSummary('SummaryWithmapping1');
            await createCasePage.setPriority('Low');
            await createCasePage.clickSaveCaseButton();
            await casePreviewPo.clickGoToCaseButton();
            await viewCasePage.clickOnTab('Case Access');
            expect(await accessTabPo.isAccessTypeOfEntityDisplayed('US Support 1', 'Read')).toBeTruthy('FailuerMsg1: Support Group Name is missing');
            await navigationPo.gotoCreateCase();
            await createCasePage.selectRequester('qtao');
            await createCasePage.setSummary('SummaryWithmapping2');
            await createCasePage.selectCategoryTier1('Payroll');
            await createCasePage.selectCategoryTier2('Finance');
            await createCasePage.selectCategoryTier3('Cost Centers');
            await createCasePage.setPriority('Low');
            await createCasePage.clickSaveCaseButton();
            await casePreviewPo.clickGoToCaseButton();
            await viewCasePage.clickOnTab('Case Access');
            expect(await accessTabPo.isAccessTypeOfEntityDisplayed('Sensitive Personal Data (HR)', 'Read')).toBeTruthy('FailuerMsg1: Support Group Name is missing');
        });
        // #success
        it('[5603]: [Read Access] Access to cases that match the Read Access partially - regular mapping', async () => {
            await navigationPo.gotoCreateCase();
            await createCasePage.selectRequester('qtao');
            await createCasePage.setSummary('SummaryWithmapping2');
            await createCasePage.selectCategoryTier1('Payroll');
            await createCasePage.selectCategoryTier2('Finance');
            await createCasePage.selectCategoryTier3('Cost Centers');
            await createCasePage.setPriority('High');
            await createCasePage.clickSaveCaseButton();
            await casePreviewPo.clickGoToCaseButton();
            await viewCasePage.clickOnTab('Case Access');
            expect(await accessTabPo.isAccessTypeOfEntityDisplayed('Staffing', 'Read')).toBeTruthy('FailuerMsg1: Support Group Name is missing');
            await navigationPo.gotoCreateCase();
            await createCasePage.selectRequester('qtao');
            await createCasePage.setSummary('SummaryWithmapping2');
            await createCasePage.selectCategoryTier1('Payroll');
            await createCasePage.selectCategoryTier2('Finance');
            await createCasePage.selectCategoryTier3('Cost Centers');
            await createCasePage.setPriority('Low');
            await createCasePage.clickSaveCaseButton();
            await casePreviewPo.clickGoToCaseButton();
            await viewCasePage.clickOnTab('Case Access');
            expect(await accessTabPo.isAccessTypeOfEntityDisplayed('Sensitive Personal Data (HR)', 'Read')).toBeTruthy('FailuerMsg1: Support Group Name is missing');
            await navigationPo.gotoCreateCase();
            await createCasePage.selectRequester('qtao');
            await createCasePage.setSummary('SummaryWithmapping3');
            await createCasePage.selectCategoryTier1('Payroll');
            await createCasePage.selectCategoryTier2('Finance');
            await createCasePage.setPriority('Low');
            await createCasePage.clickSaveCaseButton();
            await casePreviewPo.clickGoToCaseButton();
            await viewCasePage.clickOnTab('Case Access');
            expect(await accessTabPo.isAccessTypeOfEntityDisplayed('Employee Relations', 'Read')).toBeTruthy('FailuerMsg1: Support Group Name is missing');
        });
        // #passed
        it('[5603]: [Read Access] Access to cases that match the Read Access partially - regular mapping', async () => {
            await apiHelper.apiLogin('tadmin');
            await apiHelper.deleteReadAccessOrAssignmentMapping(randomStr + '1ReadAccessMappingName');
            await apiHelper.deleteReadAccessOrAssignmentMapping(randomStr + '2ReadAccessMappingName');
            await navigationPo.gotoSettingsPage();
            await navigationPo.gotoSettingsMenuItem('Case Management--Read Access', BWF_PAGE_TITLES.CASE_MANAGEMENT.READ_ACCESS);
            await consoleReadAcess.deleteDefaultReadAccess();
            await utilityGrid.searchAndOpenHyperlink(randomStr + '7ReadAccessMappingName');
            await editReadAccess.setDefaultToggleButton(true);
            await editReadAccess.clickOnSave();
            await utilityCommon.closePopUpMessage();
            await navigationPo.gotoCreateCase();
            await createCasePage.selectRequester('qtao');
            await createCasePage.setSummary('SummaryWithmapping2');
            await createCasePage.selectCategoryTier1('Talent Management');
            await createCasePage.setPriority('Low');
            await createCasePage.clickSaveCaseButton();
            await casePreviewPo.clickGoToCaseButton();
            await viewCasePage.clickOnTab('Case Access');
            expect(await accessTabPo.isAccessTypeOfEntityDisplayed('Sensitive Personal Data (HR)', 'Read')).toBeTruthy('FailuerMsg1: Support Group Name is missing');
        });
        afterAll(async () => {
            await apiHelper.apiLogin('tadmin');
            await apiHelper.deleteReadAccessOrAssignmentMapping(readAccessMappingData.configName);
            await apiHelper.deleteReadAccessOrAssignmentMapping(randomStr + '3ReadAccessMappingName');
            await apiHelper.deleteReadAccessOrAssignmentMapping(randomStr + '4ReadAccessMappingName');
            await apiHelper.deleteReadAccessOrAssignmentMapping(randomStr + '5ReadAccessMappingName');
            await apiHelper.deleteReadAccessOrAssignmentMapping(randomStr + '6ReadAccessMappingName');
            await apiHelper.deleteReadAccessOrAssignmentMapping(randomStr + '7ReadAccessMappingName');
            await utilityCommon.closeAllBlades();
            await navigationPo.signOut();
            await loginPage.login('qkatawazi');
        });
    });
});
