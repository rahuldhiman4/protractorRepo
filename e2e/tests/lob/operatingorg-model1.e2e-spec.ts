import { cloneDeep } from 'lodash';
import { browser } from "protractor";
import coreApi from '../../api/api.core.util';
import apiHelper from '../../api/api.helper';
import * as notesTemplateData from '../../data/ui/Social/notesTemplate.api';
import { RESOLUTION_CODE_ACTIVE_ON_UI } from '../../data/ui/ticketing/menu.item.ui';
import previewCasePage from '../../pageobject/case/case-preview.po';
import { default as createCasePage, default as createCasePo } from '../../pageobject/case/create-case.po';
import { default as editCasePage, default as editCasePo } from '../../pageobject/case/edit-case.po';
import quickCasePo from '../../pageobject/case/quick-case.po';
import selectCasetemplateBladePo from '../../pageobject/case/select-casetemplate-blade.po';
import viewCasePage from '../../pageobject/case/view-case.po';
import accessTabPo from '../../pageobject/common/access-tab.po';
import { default as changeAssignmentBlade, default as changeAssignmentBladePo } from '../../pageobject/common/change-assignment-blade.po';
import ckeditorValidationPo from '../../pageobject/common/ck-editor/ckeditor-validation.po';
import loginPage from "../../pageobject/common/login.po";
import navigationPage from "../../pageobject/common/navigation.po";
import resourcesPo from '../../pageobject/common/resources-tab.po';
import updateStatusBladePo from '../../pageobject/common/update.status.blade.po';
import composeMailPo from '../../pageobject/email/compose-mail.po';
import selectEmailTemplateBladePo from '../../pageobject/email/select-email-template-blade.po';
import createKnowledgePage from "../../pageobject/knowledge/create-knowlege.po";
import editKnowledgePo from '../../pageobject/knowledge/edit-knowledge.po';
import knowledgeArticlesConsolePo from '../../pageobject/knowledge/knowledge-articles-console.po';
import previewKnowledgePo from '../../pageobject/knowledge/preview-knowledge.po';
import statusBladeKnowledgeArticlePo from '../../pageobject/knowledge/status-blade-knowledge-article.po';
import viewKnowledgeArticlePo from '../../pageobject/knowledge/view-knowledge-article.po';
import previewCaseTemplateCasesPo from '../../pageobject/settings/case-management/preview-case-template.po';
import activityTabPo from '../../pageobject/social/activity-tab.po';
import notesTemplateUsage from '../../pageobject/social/note-template-usage.po';
import manageTaskBladePo from '../../pageobject/task/manage-task-blade.po';
import { BWF_BASE_URL } from '../../utils/constants';
import utilGrid from '../../utils/util.grid';
import utilityCommon from '../../utils/utility.common';
import utilityGrid from '../../utils/utility.grid';
let emailTemplateData = require('../../data/ui/email/email.template.api.json');

let supportGroupDataHR, supportGroupDataFacilities, userData0, userData1, userData2, userData3;

describe('Operating Orgnization Data Model Tests', () => {
    let personDataFile = require('../../data/ui/foundation/person.ui.json');
    beforeAll(async () => {
        await browser.get(BWF_BASE_URL);
        await loginPage.login('qkatawazi');
        await createNewUsers();
        await createFoundationDataForAssigneeValidations();
    });

    afterAll(async () => {
        await utilityCommon.closeAllBlades();
        await navigationPage.signOut();
    });

    async function createNewUsers() {
        await apiHelper.apiLogin('tadmin');
        userData1 = {
            "firstName": "Petramco",
            "lastName": "SGUser1",
            "userId": "13550User1",
            "userPermission": ["Case Business Analyst", "Human Resource"]
        }
        await apiHelper.createNewUser(userData1);
        await apiHelper.associatePersonToCompany(userData1.userId, "Petramco");
        await apiHelper.associatePersonToCompany(userData1.userId, "- Global -");
        await apiHelper.associatePersonToCompany(userData1.userId, "Psilon");
        await apiHelper.associatePersonToSupportGroup(userData1.userId, "US Support 3");
        await apiHelper.associatePersonToSupportGroup(userData1.userId, "Psilon Support Group1");
        await browser.sleep(3000); // timeout requried to reflect data on UI
        let personData1 = personDataFile['PhylumCaseAgent1'];
        await apiHelper.createNewUser(personData1);
        await apiHelper.associatePersonToSupportGroup(personData1.userId, 'Phylum Support Group1');
        await apiHelper.associatePersonToCompany(personData1.userId, 'Phylum');
    }

    async function createFoundationDataForAssigneeValidations() {
        await apiHelper.apiLogin('tadmin');
        supportGroupDataHR = {
            "orgName": "Petramco HR",
            "relatedOrgId": null,
            "domainTag": "Human Resource"
        }

        supportGroupDataFacilities = {
            "orgName": "Petramco Facilities",
            "relatedOrgId": null,
            "domainTag": "Facilities"
        }

        userData0 = {
            "firstName": "xod user23625_1",
            "lastName": "test",
            "userId": "user23625_1",
            "userPermission": ["Case Agent", "Human Resource", "Case Business Analyst", "Knowledge Publisher"]
        }

        userData2 = {
            "firstName": "bto user23625_2",
            "lastName": "test",
            "userId": "user23625_2",
            "userPermission": ["Case Agent", "Facilities", "Case Business Analyst", "Knowledge Publisher"]
        }

        await apiHelper.createNewUser(userData0);
        await apiHelper.createNewUser(userData2);
        let orgId = await coreApi.getBusinessUnitGuid('Canada Support');
        supportGroupDataHR.relatedOrgId = orgId;
        supportGroupDataFacilities.relatedOrgId = orgId;
        await apiHelper.createSupportGroup(supportGroupDataHR);
        await apiHelper.createSupportGroup(supportGroupDataFacilities);
        await apiHelper.associatePersonToCompany(userData0.userId, "Petramco");
        await apiHelper.associatePersonToSupportGroup(userData0.userId, "US Support 3");
        await apiHelper.associatePersonToCompany(userData2.userId, "Petramco");
        await apiHelper.associatePersonToSupportGroup(userData2.userId, "US Support 3");

        await apiHelper.apiLogin('tadmin');
        userData3 = {
            "firstName": "operating hr tst",
            "lastName": "usr",
            "userId": "oprusr",
            "userPermission": ["Case Agent", "Facilities", "Case Business Analyst", "Knowledge Publisher"]
        }
        await apiHelper.createNewUser(userData3);
        await apiHelper.associatePersonToCompany(userData3.userId, "Petramco");
        await apiHelper.associatePersonToSupportGroup(userData3.userId, "Facilities");
    }

    //asahitya
    describe('[DRDMV-23621]: [Operating Organization][Create Case]: Verify the behavior when the case agent is able to create a case when user has access to multiple companies for the single Line of Business', () => {
        let randomStr: string = [...Array(4)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        let twoCompanyUser;
        let caseTemplateDataPetramcoHR = {
            "templateName": 'DRDMV-23621 Name HR' + randomStr,
            "templateSummary": 'DRDMV-23621 Summary HR' + randomStr,
            "templateStatus": "Active",
            "company": "Petramco",
            "businessUnit": "United States Support",
            "supportGroup": "US Support 3",
            "ownerBU": "United States Support",
            "ownerGroup": "US Support 3",
            "lineOfBusiness": "Human Resource"
        }
        let caseTemplateDataPetramcoFacilities = {
            "templateName": 'DRDMV-23621 Name Facilities' + randomStr,
            "templateSummary": 'DRDMV-23621 Summary Facilities' + randomStr,
            "templateStatus": "Active",
            "company": "Petramco",
            "businessUnit": "Facilities Support",
            "supportGroup": "Facilities",
            "ownerBU": "Facilities Support",
            "ownerGroup": "Facilities",
            "lineOfBusiness": "Facilities"
        }
        let caseTemplateDataGlobalHR = {
            "templateName": 'DRDMV-23621 Name HR' + randomStr,
            "templateSummary": 'DRDMV-23621 Summary HR' + randomStr,
            "templateStatus": "Active",
            "company": "- Global -",
            "ownerCompany": "Petramco",
            "ownerBU": "United States Support",
            "ownerGroup": "US Support 3",
            "lineOfBusiness": "Human Resource",
            "categoryTier1": "Payroll",
            "categoryTier2": "Finance",
            "categoryTier3": "Reporting"
        }
        let caseTemplateDataGlobalFacilities = {
            "templateName": 'DRDMV-23621 Name Facilities' + randomStr,
            "templateSummary": 'DRDMV-23621 Summary Facilities' + randomStr,
            "templateStatus": "Active",
            "company": "- Global -",
            "ownerBU": "Facilities Support",
            "ownerGroup": "Facilities",
            "lineOfBusiness": "Facilities"
        }
        let caseTemplateDataPsilonHR = {
            "templateName": 'DRDMV-23621 Name Psilon HR' + randomStr,
            "templateSummary": 'DRDMV-23621 Summary Psilon HR' + randomStr,
            "templateStatus": "Active",
            "company": "Psilon",
            "businessUnit": "Psilon Support Org1",
            "supportGroup": "Psilon Support Group1",
            "ownerBU": "Psilon Support Org1",
            "ownerGroup": "Psilon Support Group1",
            "lineOfBusiness": "Human Resource",
            "categoryTier1": "Payroll",
            "categoryTier2": "Finance",
            "categoryTier3": "Reporting"
        }

        let caseId = undefined;
        beforeAll(async () => {
            await apiHelper.apiLogin('tadmin');
            await apiHelper.createCaseTemplate(caseTemplateDataPetramcoHR);
            await apiHelper.createCaseTemplate(caseTemplateDataPetramcoFacilities);
            await apiHelper.createCaseTemplate(caseTemplateDataGlobalHR);
            await apiHelper.createCaseTemplate(caseTemplateDataGlobalFacilities);
            await apiHelper.createCaseTemplate(caseTemplateDataPsilonHR);
            twoCompanyUser = {
                "firstName": "CopyTask",
                "lastName": "Psilon",
                "userId": "copytask",
                "emailId": "copytask@petramco.com",
                "userPermission": ["Case Business Analyst", "Human Resource"]
            }
            await apiHelper.apiLogin("tadmin");
            await apiHelper.createNewUser(twoCompanyUser);
            await apiHelper.associatePersonToCompany(twoCompanyUser.userId, "Petramco");
            await apiHelper.associatePersonToCompany(twoCompanyUser.userId, "Psilon");
            await apiHelper.associatePersonToSupportGroup(twoCompanyUser.userId, "US Support 3");
        });

        it('[DRDMV-23621]: [Operating Organization][Create Case]: Verify the behavior when the case agent is able to create a case when user has access to multiple companies for the single Line of Business', async () => {
            await navigationPage.signOut();
            await loginPage.login('qtao');
            await navigationPage.gotoCreateCase();
            expect(await createCasePage.getLineOfBusinessValue()).toBe('Human Resource');
            await createCasePage.selectRequester('qfeng');
            expect(await createCasePage.getLineOfBusinessLabel()).toBe('Line of Business');
            expect(await createCasePage.getLineOfBusinessValue()).toBe('Human Resource');
            expect(await createCasePage.isLineOfBusinessDisabled()).toBeTruthy('LOB field is editable');
            expect(await createCasePage.isValuePresentInDropdown('Category Tier 1', 'Applications')).toBeTruthy('Applications is not present in Catgory Tier 1 dropdown');
            expect(await createCasePage.isValuePresentInDropdown('Category Tier 1', 'Facilities')).toBeFalsy('Facilities is present in Catgory Tier 1 dropdown');
            await createCasePage.clickChangeAssignmentButton();
            await changeAssignmentBlade.selectCompany('Petramco');
            expect(await changeAssignmentBlade.isValuePresentInDropdown('Business Unit', 'Australia Support')).toBeTruthy();
            expect(await changeAssignmentBlade.isValuePresentInDropdown('Business Unit', 'Facilities Support')).toBeFalsy();
            await changeAssignmentBlade.selectBusinessUnit('Canada Support');
            expect(await changeAssignmentBlade.isValuePresentInDropdown('Support Group', 'Petramco HR')).toBeTruthy();
            expect(await changeAssignmentBlade.isValuePresentInDropdown('Support Group', 'Petramco Facilities')).toBeFalsy();
            await changeAssignmentBlade.selectBusinessUnit('United States Support');
            await changeAssignmentBlade.selectSupportGroup('US Support 3');
            expect(await changeAssignmentBlade.isPersonAvailableOnAssignBlade(`${userData0.firstName} ${userData0.lastName}`)).toBeTruthy('User is not present on Assignment blade');
            expect(await changeAssignmentBlade.isPersonAvailableOnAssignBlade(`${userData2.firstName} ${userData2.lastName}`)).toBeFalsy('User is present on Assignment blade');
            await changeAssignmentBlade.clickOnCancelButton();
            await createCasePage.setSummary('DRDMV23621');
            await createCasePage.clickSaveCaseButtonWithoutMessageDisappear();
            expect(await utilityCommon.isPopUpMessagePresent('Saved successfully.')).toBeTruthy('Successful message is not appeared');
            await previewCasePage.clickGoToCaseButton();
            caseId = await viewCasePage.getCaseID();
        });

        it('[DRDMV-23621]: [Operating Organization][Create Case]: Verify the behavior when the case agent is able to create a case when user has access to multiple companies for the single Line of Business', async () => {
            await navigationPage.gotoCreateCase();
            await createCasePage.selectRequester('qfeng');
            await createCasePage.clickSelectCaseTemplateButton();
            await selectCasetemplateBladePo.clickOnAllTemplateTab();
            expect(await utilityGrid.isGridRecordPresent(caseTemplateDataPetramcoHR.templateName)).toBeTruthy(`${caseTemplateDataPetramcoHR.templateName} is not present`);
            expect(await utilityGrid.isGridRecordPresent(caseTemplateDataPetramcoFacilities.templateName)).toBeFalsy(`${caseTemplateDataPetramcoFacilities.templateName} is present`);
            expect(await utilityGrid.isGridRecordPresent(caseTemplateDataGlobalHR.templateName)).toBeTruthy(`${caseTemplateDataPetramcoHR.templateName} is not present`);
            expect(await utilityGrid.isGridRecordPresent(caseTemplateDataGlobalFacilities.templateName)).toBeFalsy(`${caseTemplateDataPetramcoFacilities.templateName} is present`);
            await selectCasetemplateBladePo.selectCaseTemplate(caseTemplateDataPetramcoHR.templateName);
            await createCasePage.clickSaveCaseButtonWithoutMessageDisappear();
            expect(await utilityCommon.isPopUpMessagePresent('Saved successfully.')).toBeTruthy('Successful message is not appeared');
            expect(await previewCasePage.getLineOfBusinessValue()).toBe('Human Resource');
            await previewCasePage.clickGoToCaseButton();
            expect(await viewCasePage.getLineOfBusinessValue()).toBe('Human Resource');
            await viewCasePage.clickEditCaseButton();
            expect(await editCasePage.isLineOfBusinessReadOnly()).toBeTruthy('Lob section is enabled on Case Edit screen');
            expect(await editCasePage.getLobValue()).toBe('Human Resource');
            expect(await editCasePage.isValuePresentInCategoryTier1('Payroll')).toBeTruthy();
            expect(await editCasePage.isValuePresentInCategoryTier1('Facilities')).toBeFalsy();
            await editCasePage.clickOnChangeCaseTemplate();
            await selectCasetemplateBladePo.selectCaseTemplate(caseTemplateDataGlobalHR.templateName);
            await editCasePage.clickSaveCase();
            expect(await viewCasePage.getCategoryTier1Value()).toBe('Payroll');
            expect(await viewCasePage.getCategoryTier2Value()).toBe('Finance');
            expect(await viewCasePage.getCategoryTier3Value()).toBe('Reporting');

            await editCasePage.clickChangeAssignmentButton();
            expect(await changeAssignmentBlade.isValuePresentInDropdown('Company', 'Psilon')).toBeFalsy();
            await changeAssignmentBlade.selectCompany('Petramco');
            expect(await changeAssignmentBlade.isValuePresentInDropdown('Business Unit', 'Australia Support')).toBeTruthy();
            expect(await changeAssignmentBlade.isValuePresentInDropdown('Business Unit', 'Facilities Support')).toBeFalsy();
            await changeAssignmentBlade.selectBusinessUnit('Canada Support');
            expect(await changeAssignmentBlade.isValuePresentInDropdown('Support Group', 'Petramco HR')).toBeTruthy();
            expect(await changeAssignmentBlade.isValuePresentInDropdown('Support Group', 'Petramco Facilities')).toBeFalsy();
            await changeAssignmentBlade.selectBusinessUnit('United States Support');
            await changeAssignmentBlade.selectSupportGroup('US Support 3');
            expect(await changeAssignmentBlade.isPersonAvailableOnAssignBlade(`${userData0.firstName} ${userData0.lastName}`)).toBeTruthy('User is not present on Assignment blade');
            expect(await changeAssignmentBlade.isPersonAvailableOnAssignBlade(`${userData2.firstName} ${userData2.lastName}`)).toBeFalsy('User is present on Assignment blade');
            await changeAssignmentBlade.clickOnCancelButton();
        });

        it('[DRDMV-23621]: [Operating Organization][Create Case]: Verify the behavior when the case agent is able to create a case when user has access to multiple companies for the single Line of Business', async () => {
            await navigationPage.signOut();
            await loginPage.login('fritz');
            expect(await utilityGrid.isGridRecordPresent(caseId)).toBeFalsy();

            await navigationPage.signOut();
            await loginPage.login('gderuno');
            expect(await utilityGrid.isGridRecordPresent(caseId)).toBeFalsy();

            await navigationPage.signOut();
            await loginPage.login(twoCompanyUser.userId + '@petramco.com', 'Password_1234');
            await navigationPage.gotoCreateCase();
            await createCasePage.selectRequester('qfeng');
            await createCasePage.clickSelectCaseTemplateButton();
            await selectCasetemplateBladePo.clickOnAllTemplateTab();
            expect(await utilityGrid.isGridRecordPresent(caseTemplateDataPsilonHR.templateName)).toBeFalsy(`${caseTemplateDataPetramcoHR.templateName} is not present`);
            expect(await utilityGrid.isGridRecordPresent(caseTemplateDataPetramcoHR.templateName)).toBeTruthy(`${caseTemplateDataPetramcoHR.templateName} is not present`);
            expect(await utilityGrid.isGridRecordPresent(caseTemplateDataPetramcoFacilities.templateName)).toBeFalsy(`${caseTemplateDataPetramcoFacilities.templateName} is present`);
            expect(await utilityGrid.isGridRecordPresent(caseTemplateDataGlobalHR.templateName)).toBeTruthy(`${caseTemplateDataPetramcoHR.templateName} is not present`);
            expect(await utilityGrid.isGridRecordPresent(caseTemplateDataGlobalFacilities.templateName)).toBeFalsy(`${caseTemplateDataPetramcoFacilities.templateName} is present`);
            await selectCasetemplateBladePo.selectCaseTemplate(caseTemplateDataPetramcoHR.templateName);

            await createCasePage.clickChangeAssignmentButton();
            expect(await changeAssignmentBlade.isValuePresentInDropdown('Company', 'Psilon')).toBeFalsy();
            await changeAssignmentBlade.clickOnCancelButton();
            await createCasePage.clickSaveCaseButton();

            await previewCasePage.clickGoToCaseButton();
            await viewCasePage.clickEditCaseButton();
            await editCasePage.clickOnChangeCaseTemplate();
            await selectCasetemplateBladePo.clickOnAllTemplateTab();
            expect(await utilityGrid.isGridRecordPresent(caseTemplateDataPsilonHR.templateName)).toBeFalsy(`${caseTemplateDataPetramcoHR.templateName} is not present`);
            expect(await utilityGrid.isGridRecordPresent(caseTemplateDataPetramcoHR.templateName)).toBeTruthy(`${caseTemplateDataPetramcoHR.templateName} is not present`);
            expect(await utilityGrid.isGridRecordPresent(caseTemplateDataPetramcoFacilities.templateName)).toBeFalsy(`${caseTemplateDataPetramcoFacilities.templateName} is present`);
            expect(await utilityGrid.isGridRecordPresent(caseTemplateDataGlobalHR.templateName)).toBeTruthy(`${caseTemplateDataPetramcoHR.templateName} is not present`);
            expect(await utilityGrid.isGridRecordPresent(caseTemplateDataGlobalFacilities.templateName)).toBeFalsy(`${caseTemplateDataPetramcoFacilities.templateName} is present`);
            await selectCasetemplateBladePo.selectCaseTemplate(caseTemplateDataGlobalHR.templateName);
        });

        afterAll(async () => {
            await utilityCommon.closeAllBlades();
            await navigationPage.signOut();
            await loginPage.login('qkatawazi');
        });
    });

    //asahitya
    describe('[DRDMV-23608]: [Operating Organization][Create Case]: Verify the behavior when the case agent is able to create a case when it has access to multiple LOB', () => {
        let caseId = undefined;
        let randomStr: string = [...Array(4)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        let caseTemplateDataPetramcoHR = {
            "templateName": randomStr + 'DRDMV-23621 Name HR',
            "templateSummary": 'DRDMV-23621 Summary HR' + randomStr,
            "templateStatus": "Active",
            "company": "Petramco",
            "businessUnit": "United States Support",
            "supportGroup": "US Support 3",
            "ownerBU": "United States Support",
            "ownerGroup": "US Support 3",
            "lineOfBusiness": "Human Resource"
        }
        let caseTemplateDataPetramcoFacilities = {
            "templateName": randomStr + 'DRDMV-23621 Name Facilities',
            "templateSummary": 'DRDMV-23621 Summary Facilities' + randomStr,
            "templateStatus": "Active",
            "company": "Petramco",
            "businessUnit": "Facilities Support",
            "supportGroup": "Facilities",
            "ownerBU": "Facilities Support",
            "ownerGroup": "Facilities",
            "lineOfBusiness": "Facilities"
        }
        let caseTemplateDataGlobalHR = {
            "templateName":  randomStr +'DRDMV-23621NameHRGloabl',
            "templateSummary": 'DRDMV-23621 Summary HR' + randomStr,
            "templateStatus": "Active",
            "company": "- Global -",
            "ownerBU": "United States Support",
            "ownerGroup": "US Support 3",
            "lineOfBusiness": "Human Resource",
            "categoryTier1": "Payroll",
            "categoryTier2": "Finance",
            "categoryTier3": "Reporting"
        }
        let caseTemplateDataGlobalFacilities = {
            "templateName": randomStr + 'DRDMV-23621 Name Facilities',
            "templateSummary": 'DRDMV-23621 Summary Facilities' + randomStr,
            "templateStatus": "Active",
            "company": "- Global -",
            "businessUnit": "Facilities Support",
            "supportGroup": "Facilities",
            "ownerBU": "Facilities Support",
            "ownerGroup": "Facilities",
            "lineOfBusiness": "Facilities"
        }
        let caseTemplateDataPsilon = {
            "templateName": randomStr + 'DRDMV-23621 Name Psilon',
            "templateSummary": 'DRDMV-23621 Summary Psilon' + randomStr,
            "templateStatus": "Active",
            "company": "Psilon",
            "businessUnit": "Canada Support",
            "supportGroup": "CA Support 1",
            "ownerBU": "Canada Support",
            "ownerGroup": "CA Support 1",
            "lineOfBusiness": "Human Resource"
        }

        beforeAll(async () => {
            await apiHelper.apiLogin('qkatawazi');
            await apiHelper.createCaseTemplate(caseTemplateDataPetramcoHR);
            await apiHelper.createCaseTemplate(caseTemplateDataPetramcoFacilities);
            await apiHelper.createCaseTemplate(caseTemplateDataGlobalHR);
            await apiHelper.createCaseTemplate(caseTemplateDataGlobalFacilities);
            await apiHelper.apiLogin('gderuno');
            await apiHelper.createCaseTemplate(caseTemplateDataPsilon);
        });
        it('[DRDMV-23608]: [Operating Organization][Create Case]: Verify the behavior when the case agent is able to create a case when it has access to multiple LOB', async () => {
            await navigationPage.signOut();
            await loginPage.login('qkatawazi');
            await navigationPage.gotoCreateCase();
            expect(await createCasePage.getLineOfBusinessValue()).toBe('Human Resource');
            await createCasePage.selectRequester('qtao');
            expect(await createCasePage.getLineOfBusinessLabel()).toBe('Line of Business');
            expect(await createCasePage.getLineOfBusinessValue()).toBe('Human Resource');
            expect(await createCasePage.isLineOfBusinessDisabled()).toBeTruthy('LOB field is not editable');
            expect(await createCasePage.isValuePresentInDropdown('Category Tier 1', 'Applications')).toBeTruthy('Facilities is not present in Catgory Tier 1 dropdown');
            expect(await createCasePage.isValuePresentInDropdown('Category Tier 1', 'Facilities')).toBeFalsy('Applications is present in Catgory Tier 1 dropdown');
            await createCasePage.clickChangeAssignmentButton();
            await changeAssignmentBlade.selectCompany('Petramco');
            expect(await changeAssignmentBlade.isValuePresentInDropdown('Business Unit', 'Australia Support')).toBeTruthy();
            expect(await changeAssignmentBlade.isValuePresentInDropdown('Business Unit', 'Facilities Support')).toBeFalsy();
            await changeAssignmentBlade.selectBusinessUnit('Canada Support');
            expect(await changeAssignmentBlade.isValuePresentInDropdown('Support Group', 'Petramco HR')).toBeTruthy();
            expect(await changeAssignmentBlade.isValuePresentInDropdown('Support Group', 'Petramco Facilities')).toBeFalsy();
            await changeAssignmentBlade.selectBusinessUnit('United States Support');
            await changeAssignmentBlade.selectSupportGroup('US Support 3');
            expect(await changeAssignmentBlade.isPersonAvailableOnAssignBlade(`${userData0.firstName} ${userData0.lastName}`)).toBeTruthy('User is not present on Assignment blade');
            expect(await changeAssignmentBlade.isPersonAvailableOnAssignBlade(`${userData2.firstName} ${userData2.lastName}`)).toBeFalsy('User is present on Assignment blade');
            await changeAssignmentBlade.clickOnCancelButton();

            await createCasePage.setSummary('DRDMV23608');
            await createCasePage.clickSaveCaseButtonWithoutMessageDisappear();
            expect(await utilityCommon.isPopUpMessagePresent('Saved successfully.')).toBeTruthy('Successful message is not appeared');
            await previewCasePage.clickGoToCaseButton();
            caseId = await viewCasePage.getCaseID();
        });

        it('[DRDMV-23608]: [Operating Organization][Create Case]: Verify the behavior when the case agent is able to create a case when it has access to multiple LOB', async () => {
            await navigationPage.gotoCreateCase();
            await createCasePage.selectRequester('qfeng');
            await createCasePage.clickSelectCaseTemplateButton();
            await selectCasetemplateBladePo.clickOnAllTemplateTab();
            expect(await utilityGrid.isGridRecordPresent(caseTemplateDataPetramcoHR.templateName)).toBeTruthy(`${caseTemplateDataPetramcoHR.templateName} is not present`);
            expect(await utilityGrid.isGridRecordPresent(caseTemplateDataPetramcoFacilities.templateName)).toBeFalsy(`${caseTemplateDataPetramcoFacilities.templateName} is present`);
            expect(await utilityGrid.isGridRecordPresent(caseTemplateDataGlobalHR.templateName)).toBeTruthy(`${caseTemplateDataPetramcoHR.templateName} is not present`);
            expect(await utilityGrid.isGridRecordPresent(caseTemplateDataGlobalFacilities.templateName)).toBeFalsy(`${caseTemplateDataPetramcoFacilities.templateName} is present`);
            await selectCasetemplateBladePo.selectCaseTemplate(caseTemplateDataPetramcoHR.templateName);
            await createCasePage.clickSaveCaseButtonWithoutMessageDisappear();
            expect(await utilityCommon.isPopUpMessagePresent('Saved successfully.')).toBeTruthy('Successful message is not appeared');
            expect(await previewCasePage.getLineOfBusinessValue()).toBe('Human Resource');
            await previewCasePage.clickGoToCaseButton();
            expect(await viewCasePage.getLineOfBusinessValue()).toBe('Human Resource');
            await viewCasePage.clickEditCaseButton();
            expect(await editCasePage.isLineOfBusinessReadOnly()).toBeTruthy('Lob section is enabled on Case Edit screen');
            expect(await editCasePage.getLobValue()).toBe('Human Resource');
            expect(await editCasePage.isValuePresentInCategoryTier1('Payroll')).toBeTruthy();
            expect(await editCasePage.isValuePresentInCategoryTier1('Facilities')).toBeFalsy();
            await editCasePage.clickOnChangeCaseTemplate();
            await selectCasetemplateBladePo.selectCaseTemplate(caseTemplateDataGlobalHR.templateName);
            await editCasePage.clickSaveCase();
            expect(await viewCasePage.getCategoryTier1Value()).toBe('Payroll');
            expect(await viewCasePage.getCategoryTier2Value()).toBe('Finance');
            expect(await viewCasePage.getCategoryTier3Value()).toBe('Reporting');
 
            await viewCasePage.clickEditCaseButton();
            await editCasePage.clickChangeAssignmentButton();
            await changeAssignmentBlade.selectNoneCompany();
            await changeAssignmentBlade.selectCompany('Petramco');
            expect(await changeAssignmentBlade.isValuePresentInDropdown('Business Unit', 'Australia Support')).toBeTruthy();
            expect(await changeAssignmentBlade.isValuePresentInDropdown('Business Unit', 'Facilities Support')).toBeFalsy();
            await changeAssignmentBlade.selectBusinessUnit('Canada Support');
            expect(await changeAssignmentBlade.isValuePresentInDropdown('Support Group', 'Petramco HR')).toBeTruthy();
            expect(await changeAssignmentBlade.isValuePresentInDropdown('Support Group', 'Petramco Facilities')).toBeFalsy();
            await changeAssignmentBlade.selectBusinessUnit('United States Support');
            await changeAssignmentBlade.selectSupportGroup('US Support 3');
            expect(await changeAssignmentBlade.isPersonAvailableOnAssignBlade(`${userData0.firstName} ${userData0.lastName}`)).toBeTruthy('User is not present on Assignment blade');
            expect(await changeAssignmentBlade.isPersonAvailableOnAssignBlade(`${userData2.firstName} ${userData2.lastName}`)).toBeFalsy('User is present on Assignment blade');
            await changeAssignmentBlade.clickOnCancelButton();           
        });

        it('[DRDMV-23608]: [Operating Organization][Create Case]: Verify the behavior when the case agent is able to create a case when it has access to multiple LOB', async () => {
            await navigationPage.signOut();
            await loginPage.login('qliu');
            await navigationPage.gotoCreateCase();
            await createCasePage.selectRequester('qfeng');
            await createCasePage.clickSelectCaseTemplateButton();
            await selectCasetemplateBladePo.clickOnAllTemplateTab();
            expect(await utilityGrid.isGridRecordPresent(caseTemplateDataPetramcoHR.templateName)).toBeTruthy(`${caseTemplateDataPetramcoHR.templateName} is not present`);
            expect(await utilityGrid.isGridRecordPresent(caseTemplateDataPsilon.templateName)).toBeFalsy(`${caseTemplateDataPsilon.templateName} is not present`);
            expect(await utilityGrid.isGridRecordPresent(caseTemplateDataPetramcoFacilities.templateName)).toBeFalsy(`${caseTemplateDataPetramcoFacilities.templateName} is present`);
            expect(await utilityGrid.isGridRecordPresent(caseTemplateDataGlobalHR.templateName)).toBeTruthy(`${caseTemplateDataGlobalHR.templateName} is not present`);
            expect(await utilityGrid.isGridRecordPresent(caseTemplateDataGlobalFacilities.templateName)).toBeFalsy(`${caseTemplateDataGlobalFacilities.templateName} is present`);
            await selectCasetemplateBladePo.selectCaseTemplate(caseTemplateDataPetramcoHR.templateName);

            await createCasePage.clickChangeAssignmentButton();
            await changeAssignmentBlade.selectNoneCompany();
            expect(await changeAssignmentBlade.isValuePresentInDropdown('Organization', 'Psilon')).toBeFalsy();
            await changeAssignmentBlade.clickOnCancelButton();
            await createCasePage.clickSaveCaseButton();

            await previewCasePage.clickGoToCaseButton();
            await viewCasePage.clickEditCaseButton();
            await editCasePage.clickOnChangeCaseTemplate();
            await selectCasetemplateBladePo.clickOnAllTemplateTab();
            expect(await utilityGrid.isGridRecordPresent(caseTemplateDataPsilon.templateName)).toBeFalsy(`${caseTemplateDataPetramcoHR.templateName} is not present`);
            expect(await utilityGrid.isGridRecordPresent(caseTemplateDataPetramcoHR.templateName)).toBeTruthy(`${caseTemplateDataPetramcoHR.templateName} is not present`);
            expect(await utilityGrid.isGridRecordPresent(caseTemplateDataPetramcoFacilities.templateName)).toBeFalsy(`${caseTemplateDataPetramcoFacilities.templateName} is present`);
            expect(await utilityGrid.isGridRecordPresent(caseTemplateDataGlobalHR.templateName)).toBeTruthy(`${caseTemplateDataPetramcoHR.templateName} is not present`);
            expect(await utilityGrid.isGridRecordPresent(caseTemplateDataGlobalFacilities.templateName)).toBeFalsy(`${caseTemplateDataPetramcoFacilities.templateName} is present`);
            await selectCasetemplateBladePo.selectCaseTemplate(caseTemplateDataGlobalHR.templateName);
        });

        it('[DRDMV-23608]: [Operating Organization][Create Case]: Verify the behavior when the case agent is able to create a case when it has access to multiple LOB', async () => {
            await navigationPage.signOut();
            await loginPage.login('qyuan');
            await navigationPage.gotoCreateCase();
            await createCasePage.selectRequester('qtao');
            await createCasePage.selectLineOfBusiness('Human Resource');
            await createCasePage.setSummary('xyz' + randomStr);
            await createCasePage.selectCategoryTier1('Total Rewards');
            await createCasePage.selectCategoryTier2('Benefits');
            await createCasePage.selectCategoryTier3('Annual Merit');
            await createCasePage.clickChangeAssignmentButton();
            await changeAssignmentBlade.setAssignee('Petramco', 'Australia Support', 'AU Support 1', "RA3 Liu");
            await createCasePage.selectLineOfBusiness('Facilities');
            let emptyStr = 'Select';
            expect(await createCasePage.getCategoryTier1Value()).toBe(emptyStr);
            expect(await createCasePage.getCategoryTier2Value()).toBe(emptyStr);
            expect(await createCasePage.getCategoryTier3Value()).toBe(emptyStr);
            expect(await createCasePage.getAssigneeBusinessUnitValue()).toBe(emptyStr);
            expect(await createCasePage.getAssigneeGroupValue()).toBe(emptyStr);
            expect(await createCasePage.getAssigneeValue()).toBe(emptyStr);

            await createCasePage.selectLineOfBusiness('Human Resource');
            await createCasePage.selectCategoryTier1('Total Rewards');
            await createCasePage.clickChangeAssignmentButton();
            await changeAssignmentBlade.setAssignee('Petramco', 'India Support', 'IN Support 1', "Qing Yuan");
            await createCasePage.clickSaveCaseButton();
            await previewCasePage.clickGoToCaseButton();

            await navigationPage.gotoCaseConsole();
            await utilityGrid.selectLineOfBusiness('Human Resource');
            expect(await utilityGrid.isGridRecordPresent('xyz' + randomStr)).toBeTruthy();

            await utilityGrid.selectLineOfBusiness('Facilities');
            expect(await utilityGrid.isGridRecordPresent('xyz' + randomStr)).toBeFalsy();
        });

        afterAll(async () => {
            await utilityCommon.closeAllBlades();
            await navigationPage.signOut();
            await loginPage.login('qkatawazi');
        });
    });

    describe('[DRDMV-23486]:[Operating Organization][Create Case]: Verify the behavior when the case agent is able to create a case when it has access to single LOB', async () => {
        let randomStr = Math.floor(Math.random() * 1000000);
        let caseTemplateDataFacilities;
        let confidentialSupportGroup = "Employee Relations Sensitive Data Access";
        let caseId = undefined;
        beforeAll(async () => {
            caseTemplateDataFacilities = {
                "templateName": `Casetemplate1${randomStr}`,
                "templateStatus": "Active",
                "templateSummary": `Summary1${randomStr}`,
                "caseStatus": "New",
                "casePriority": "Medium",
                "ownerBU": "Facilities Support",
                "ownerGroup": "Facilities",
                "lineOfBusiness": "Facilities"
            }
            await apiHelper.apiLogin('fritz');
            await apiHelper.createCaseTemplate(caseTemplateDataFacilities);
        });
        it('[DRDMV-23486]:[Operating Organization][Create Case]: Verify the behavior when the case agent is able to create a case when it has access to single LOB', async () => {
            await navigationPage.signOut();
            await loginPage.login('fritz');
            await navigationPage.gotoCreateCase();
            await createCasePage.selectRequester('adam');
            expect(await createCasePage.isLineOfBusinessDisabled()).toBeTruthy('Line of Buisness Field is Enabled');
            expect(await createCasePage.getLineOfBusinessValue()).toBe('Facilities', 'Line of Buisness Field is Enabled');
            await createCasePage.setSummary('DRDMV-23519Summary' + randomStr);
            expect(await createCasePage.isValuePresentInDropdown("Category Tier 1", 'Employee Relations')).toBeFalsy('Value is present in  Category Tier 1 drop down');
            await createCasePage.clickAssignToMeButton();
            expect(await createCasePage.isValuePresentInDropdown("Category Tier 1", 'Facilities')).toBeTruthy('Value is present in  Category Tier 1 drop down');
            await createCasePage.setPriority('Low');
            await createCasePage.selectCategoryTier1("Facilities");
            await createCasePage.selectCategoryTier2("Conference Room");
            await createCasePage.selectCategoryTier3("Furniture");
            await createCasePage.selectCategoryTier4("Chair");
            expect(await createCasePo.getCategoryTier1Value()).toBe('Facilities');
            expect(await createCasePo.getCategoryTier2Value()).toBe('Conference Room');
            expect(await createCasePo.getCategoryTier3Value()).toBe('Furniture');
            expect(await createCasePo.getCategoryTier4Value()).toBe('Chair');
        });
        it('[DRDMV-23486]:[Operating Organization][Create Case]: Verify the behavior when the case agent is able to create a case when it has access to single LOB', async () => {
            await createCasePage.clickChangeAssignmentButton();
            expect(await changeAssignmentBladePo.businessUnitOptionsPresent('United States Support')).toBeFalsy();
            await changeAssignmentBladePo.clickOnCancelButton();
            await createCasePage.clickChangeAssignmentButton();
            expect(await changeAssignmentBladePo.businessUnitOptionsPresent('Facilities Support')).toBeTruthy();
            await changeAssignmentBladePo.clickOnCancelButton();
            await createCasePage.clickSaveCaseButton();
            await previewCasePage.clickGoToCaseButton();
            await viewCasePage.clickEditCaseButton();
            await editCasePo.clickOnSelectCaseTemplate();
            await selectCasetemplateBladePo.selectCaseTemplate(caseTemplateDataFacilities.templateName);
            await editCasePo.clickSaveCase();
            expect(await viewCasePage.getCaseTemplateText()).toBe(caseTemplateDataFacilities.templateName);
            expect(await viewCasePage.getLineOfBusinessValue()).toBe('Facilities');
        });
        it('[DRDMV-23486]:[Operating Organization][Create Case]: Verify the behavior when the case agent is able to create a case when it has access to single LOB', async () => {
            await viewCasePage.clickEditCaseButton();
            expect(await editCasePo.isValuePresentInDropdown("Category Tier 1", 'Employee Relations')).toBeFalsy('Value is present in  Category Tier 1 drop down');
            expect(await editCasePo.isLineOfBusinessReadOnly()).toBeTruthy('Field is enabled');
            await editCasePo.updateCasePriority('High');
            await editCasePo.updateCaseCategoryTier1('Phones');
            await editCasePo.updateCaseCategoryTier2('Cellular Phones');
            await editCasePo.updateCaseCategoryTier3('Service');
            await editCasePo.clickChangeAssignmentButton();
            expect(await changeAssignmentBladePo.businessUnitOptionsPresent('United States Support')).toBeFalsy();
            await changeAssignmentBladePo.clickOnCancelButton();
            await editCasePo.clickChangeAssignmentButton();
            await changeAssignmentBladePo.selectBusinessUnit('Facilities Support');
            await changeAssignmentBladePo.selectSupportGroup('Pantry Service');
            await changeAssignmentBladePo.selectAssignee('Qing Yuan');
            await changeAssignmentBladePo.clickOnAssignButton();
            await editCasePo.clickSaveCase();
            expect(await viewCasePage.getCategoryTier1Value()).toBe('Phones');
            expect(await viewCasePage.getCategoryTier2Value()).toBe('Cellular Phones');
            expect(await viewCasePage.getCategoryTier3Value()).toBe('Service');
            expect(await viewCasePage.getAssignedGroupText()).toBe("Pantry Service");
            expect(await viewCasePage.getAssigneeText()).toBe("Qing Yuan");
        });
        it('[DRDMV-23486]:[Operating Organization][Create Case]: Verify the behavior when the case agent is able to create a case when it has access to single LOB', async () => {
            await viewCasePage.clickOnTab('Case Access');
            await accessTabPo.clickToExpandAccessEntitiySearch('Support Group Access', 'Case');
            await accessTabPo.selectAccessEntityDropDown('Petramco', 'Select Company');
            expect(await accessTabPo.isOptionsPresent('United States Support', 'Select Business Unit')).toBeFalsy();
            await accessTabPo.clickToExpandAccessEntitiySearch('Support Group Access', 'Case');
            await accessTabPo.clickToExpandAccessEntitiySearch('Support Group Access', 'Case');
            await accessTabPo.selectAccessEntityDropDown('Facilities Support', 'Select Business Unit');
            await accessTabPo.clickAccessEntitiyAddButton('Business Unit');
            expect(await accessTabPo.isAccessTypeOfEntityDisplayed('Facilities Support', 'Read')).toBeTruthy('FailuerMsg1: Agent Name is missing');
            await accessTabPo.clickToExpandAccessEntitiySearch('Support Group Access', 'Confidential Group');
            expect(await accessTabPo.isOptionsPresent(confidentialSupportGroup, 'Select Support Group', true)).toBeFalsy();
        });
        it('[DRDMV-23486]:[Operating Organization][Create Case]: Verify the behavior when the case agent is able to create a case when it has access to single LOB', async () => {
            await navigationPage.signOut();
            await loginPage.login('qkatawazi');
            await utilityGrid.clearFilter();
            await utilityGrid.searchRecord('DRDMV-23519Summary' + randomStr);
            expect(await utilityGrid.isGridRecordPresent('DRDMV-23519Summary' + randomStr)).toBeFalsy('DRDMV-23519Summary' + randomStr);
            await navigationPage.gotoQuickCase();
            await quickCasePo.selectRequesterName('adam');
            await quickCasePo.setCaseSummary('new case');
            await quickCasePo.createCaseButton();
            await utilityCommon.closePopUpMessage();
            await quickCasePo.gotoCaseButton();
            await viewCasePage.clickOnTab('Case Access');
            await accessTabPo.clickToExpandAccessEntitiySearch('Support Group Access', 'Confidential Group');
            expect(await accessTabPo.isOptionsPresent(confidentialSupportGroup, 'Select Support Group', true)).toBeTruthy();
        });
        it('[DRDMV-23486]:[Operating Organization][Create Case]: Verify the behavior when the case agent is able to create a case when it has access to single LOB', async () => {
            await navigationPage.signOut();
            await loginPage.login('oprusr@petramco.com', 'Password_1234');
            await utilityGrid.clearFilter();
            expect(await utilityGrid.isGridRecordPresent('DRDMV-23519Summary' + randomStr)).toBeTruthy('DRDMV-23519Summary' + randomStr);
            await apiHelper.apiLogin('tadmin');
            await apiHelper.deleteFoundationEntity("oprusr", { functionalRole: "Case Agent,Case Business Analyst,Knowledge Publisher" });
            await navigationPage.gotoQuickCase();
            await navigationPage.gotoCaseConsole();
            await utilityGrid.clearFilter();
            expect(await utilityGrid.isGridRecordPresent('DRDMV-23519Summary' + randomStr)).toBeFalsy('DRDMV-23519Summary' + randomStr);
        });
        afterAll(async () => {
            await utilityCommon.closeAllBlades();
            await navigationPage.signOut();
            await loginPage.login('qkatawazi');
        });
    });


});    