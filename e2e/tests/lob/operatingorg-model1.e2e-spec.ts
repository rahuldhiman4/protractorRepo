import { browser } from "protractor";
import apiHelper from '../../api/api.helper';
import coreApi from '../../api/api.core.util';
import loginPage from "../../pageobject/common/login.po";
import navigationPage from "../../pageobject/common/navigation.po";
import { BWF_BASE_URL } from '../../utils/constants';
import utilityCommon from '../../utils/utility.common';
import createCasePage from '../../pageobject/case/create-case.po';
import previewCasePage from '../../pageobject/case/case-preview.po';
import selectCasetemplateBladePo from '../../pageobject/case/select-casetemplate-blade.po';
import viewCasePage from '../../pageobject/case/view-case.po';
import utilGrid from '../../utils/util.grid';
import changeAssignmentBlade from '../../pageobject/common/change-assignment-blade.po';
import editCasePage from '../../pageobject/case/edit-case.po';
import utilityGrid from '../../utils/utility.grid';
import editCasePo from '../../pageobject/case/edit-case.po';
import changeAssignmentBladePo from '../../pageobject/common/change-assignment-blade.po';
import quickCasePo from '../../pageobject/case/quick-case.po';
import resourcesPo from '../../pageobject/common/resources-tab.po';
import previewCaseTemplateCasesPo from '../../pageobject/settings/case-management/preview-case-template.po';
import createCasePo from '../../pageobject/case/create-case.po';
import accessTabPo from '../../pageobject/common/access-tab.po';
import manageTaskBladePo from '../../pageobject/task/manage-task-blade.po';
import composeMailPo from '../../pageobject/email/compose-mail.po';
import selectEmailTemplateBladePo from '../../pageobject/email/select-email-template-blade.po';
import activityTabPo from '../../pageobject/social/activity-tab.po';
import notesTemplateUsage from '../../pageobject/social/note-template-usage.po';
import { cloneDeep } from 'lodash';
import { RESOLUTION_CODE_ACTIVE_ON_UI } from '../../data/ui/ticketing/menu.item.ui';
let emailTemplateData = require('../../data/ui/email/email.template.api.json');
import * as notesTemplateData from '../../data/ui/Social/notesTemplate.api';
import ckeditorValidationPo from '../../pageobject/common/ck-editor/ckeditor-validation.po';
import updateStatusBladePo from '../../pageobject/common/update.status.blade.po';
import createKnowledgePage from "../../pageobject/knowledge/create-knowlege.po";
import previewKnowledgePo from '../../pageobject/knowledge/preview-knowledge.po';
import viewKnowledgeArticlePo from '../../pageobject/knowledge/view-knowledge-article.po';
import editKnowledgePo from '../../pageobject/knowledge/edit-knowledge.po';
import knowledgeArticlesConsolePo from '../../pageobject/knowledge/knowledge-articles-console.po';
import statusBladeKnowledgeArticlePo from '../../pageobject/knowledge/status-blade-knowledge-article.po';


let userData1;

describe('Operating Orgnization Data Model Tests', () => {
    let personDataFile = require('../../data/ui/foundation/person.ui.json');
    beforeAll(async () => {
        await browser.get(BWF_BASE_URL);
        await loginPage.login('qkatawazi');
        await createNewUsers();
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
        await apiHelper.associatePersonToSupportGroup(userData1.userId, "Psilon Support Group1");
        await browser.sleep(3000); // timeout requried to reflect data on UI
        let personData1 = personDataFile['PhylumCaseAgent1'];
        await apiHelper.createNewUser(personData1);
        await apiHelper.associatePersonToSupportGroup(personData1.userId, 'Phylum Support Group1');
        await apiHelper.associatePersonToCompany(personData1.userId, 'Phylum');
    }


    //asahitya
    describe('[DRDMV-23621]: [Operating Organization][Create Case]: Verify the behavior when the case agent is able to create a case when user has access to multiple companies for the single Line of Business', () => {
        let randomStr: string = [...Array(4)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        let supportGroupDataHR, supportGroupDataFacilities, userData1, userData2, twoCompanyUser;
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
            "company": "-Global-",
            "businessUnit": "Canada Support",
            "supportGroup": "CA Support 3",
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
            "company": "-Global-",
            "businessUnit": "Facilities Support",
            "supportGroup": "Facilities",
            "ownerBU": "Facilities Support",
            "ownerGroup": "Facilities",
            "lineOfBusiness": "Facilities"
        }
        let caseTemplateDataPsilonHR = {
            "templateName": 'DRDMV-23621 Name Psilon HR' + randomStr,
            "templateSummary": 'DRDMV-23621 Summary Psilon HR' + randomStr,
            "templateStatus": "Active",
            "company": "Psilon",
            "businessUnit": "Canada Support",
            "supportGroup": "CA Support 3",
            "ownerBU": "United States Support",
            "ownerGroup": "US Support 3",
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

            //Create data for Assignment value validations
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

            userData1 = {
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

            await apiHelper.createNewUser(userData1);
            await apiHelper.createNewUser(userData2);
            let orgId = await coreApi.getBusinessUnitGuid('Canada Support');
            supportGroupDataHR.relatedOrgId = orgId;
            supportGroupDataFacilities.relatedOrgId = orgId;
            await apiHelper.createSupportGroup(supportGroupDataHR);
            await apiHelper.createSupportGroup(supportGroupDataFacilities);
            await apiHelper.associatePersonToCompany(userData1.userId, "Petramco");
            await apiHelper.associatePersonToSupportGroup(userData1.userId, "US Support 3");
            await apiHelper.associatePersonToCompany(userData2.userId, "Petramco");
            await apiHelper.associatePersonToSupportGroup(userData2.userId, "US Support 3");

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
            expect(await createCasePage.getLineOfBusinessFieldValue()).toBe('Human Resource');
            await createCasePage.selectRequester('qfeng');
            expect(await createCasePage.getLineOfBusinessLabel()).toBe('Line of Business');
            expect(await createCasePage.getLineOfBusinessFieldValue()).toBe('Human Resource');
            expect(await createCasePage.isLineOfBusinessFieldEnabled()).toBeFalsy('LOB field is editable');
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
            expect(await changeAssignmentBlade.isPersonAvailableOnAssignBlade(`${userData1.firstName} ${userData1.lastName}`)).toBeTruthy('User is not present on Assignment blade');
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
            expect(await changeAssignmentBlade.isPersonAvailableOnAssignBlade(`${userData1.firstName} ${userData1.lastName}`)).toBeTruthy('User is not present on Assignment blade');
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
        let supportGroupDataHR, supportGroupDataFacilities, userData1, userData2;
        let randomStr: string = [...Array(4)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
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
            "company": "-Global-",
            "businessUnit": "Canada Support",
            "supportGroup": "CA Support 3",
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
            "company": "-Global-",
            "businessUnit": "Facilities Support",
            "supportGroup": "Facilities",
            "ownerBU": "Facilities Support",
            "ownerGroup": "Facilities",
            "lineOfBusiness": "Facilities"
        }
        let caseTemplateDataPsilon = {
            "templateName": 'DRDMV-23621 Name Psilon' + randomStr,
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
            await apiHelper.apiLogin('tadmin');
            await apiHelper.createCaseTemplate(caseTemplateDataPetramcoHR);
            await apiHelper.createCaseTemplate(caseTemplateDataPetramcoFacilities);
            await apiHelper.createCaseTemplate(caseTemplateDataGlobalHR);
            await apiHelper.createCaseTemplate(caseTemplateDataGlobalFacilities);

            //Create data for Assignment value validations
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

            userData1 = {
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

            await apiHelper.createNewUser(userData1);
            await apiHelper.createNewUser(userData2);
            let orgId = await coreApi.getBusinessUnitGuid('Canada Support');
            supportGroupDataHR.relatedOrgId = orgId;
            supportGroupDataFacilities.relatedOrgId = orgId;
            await apiHelper.createSupportGroup(supportGroupDataHR);
            await apiHelper.createSupportGroup(supportGroupDataFacilities);
            await apiHelper.associatePersonToCompany(userData1.userId, "Petramco");
            await apiHelper.associatePersonToSupportGroup(userData1.userId, "US Support 3");
            await apiHelper.associatePersonToCompany(userData2.userId, "Petramco");
            await apiHelper.associatePersonToSupportGroup(userData2.userId, "US Support 3");
            await apiHelper.associatePersonToCompany('ncage', 'Psilon');
        });
        it('[DRDMV-23608]: [Operating Organization][Create Case]: Verify the behavior when the case agent is able to create a case when it has access to multiple LOB', async () => {
            await navigationPage.signOut();
            await loginPage.login('qfeng');
            await navigationPage.gotoCreateCase();
            expect(await createCasePage.getLineOfBusinessFieldValue()).toBe('Human Resource');
            await createCasePage.selectRequester('qtao');
            expect(await createCasePage.getLineOfBusinessLabel()).toBe('Line of Business');
            expect(await createCasePage.getLineOfBusinessFieldValue()).toBe('Facilities');
            expect(await createCasePage.isLineOfBusinessFieldEnabled()).toBeTruthy('LOB field is not editable');
            expect(await createCasePage.isValuePresentInDropdown('Category Tier 1', 'Facilities')).toBeTruthy('Facilities is not present in Catgory Tier 1 dropdown');
            expect(await createCasePage.isValuePresentInDropdown('Category Tier 1', 'Applications')).toBeFalsy('Applications is present in Catgory Tier 1 dropdown');
            await createCasePage.clickChangeAssignmentButton();
            await changeAssignmentBlade.selectCompany('Petramco');
            expect(await changeAssignmentBlade.isValuePresentInDropdown('Business Unit', 'Australia Support')).toBeTruthy();
            expect(await changeAssignmentBlade.isValuePresentInDropdown('Business Unit', 'Facilities Support')).toBeFalsy();
            await changeAssignmentBlade.selectBusinessUnit('Canada Support');
            expect(await changeAssignmentBlade.isValuePresentInDropdown('Support Group', 'Petramco HR')).toBeTruthy();
            expect(await changeAssignmentBlade.isValuePresentInDropdown('Support Group', 'Petramco Facilities')).toBeFalsy();
            await changeAssignmentBlade.selectBusinessUnit('United States Support');
            await changeAssignmentBlade.selectSupportGroup('US Support 3');
            expect(await changeAssignmentBlade.isPersonAvailableOnAssignBlade(`${userData1.firstName} ${userData1.lastName}`)).toBeTruthy('User is not present on Assignment blade');
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

            await editCasePage.clickChangeAssignmentButton();
            await changeAssignmentBlade.selectCompany('Petramco');
            expect(await changeAssignmentBlade.isValuePresentInDropdown('Business Unit', 'Australia Support')).toBeTruthy();
            expect(await changeAssignmentBlade.isValuePresentInDropdown('Business Unit', 'Facilities Support')).toBeFalsy();
            await changeAssignmentBlade.selectBusinessUnit('Canada Support');
            expect(await changeAssignmentBlade.isValuePresentInDropdown('Support Group', 'Petramco HR')).toBeTruthy();
            expect(await changeAssignmentBlade.isValuePresentInDropdown('Support Group', 'Petramco Facilities')).toBeFalsy();
            await changeAssignmentBlade.selectBusinessUnit('United States Support');
            await changeAssignmentBlade.selectSupportGroup('US Support 3');
            expect(await changeAssignmentBlade.isPersonAvailableOnAssignBlade(`${userData1.firstName} ${userData1.lastName}`)).toBeTruthy('User is not present on Assignment blade');
            expect(await changeAssignmentBlade.isPersonAvailableOnAssignBlade(`${userData2.firstName} ${userData2.lastName}`)).toBeFalsy('User is present on Assignment blade');
            await changeAssignmentBlade.clickOnCancelButton();
        });

        it('[DRDMV-23608]: [Operating Organization][Create Case]: Verify the behavior when the case agent is able to create a case when it has access to multiple LOB', async () => {
            await navigationPage.signOut();
            await loginPage.login('ncage');
            await navigationPage.gotoCreateCase();
            await createCasePage.selectRequester('qfeng');
            await createCasePage.clickSelectCaseTemplateButton();
            await selectCasetemplateBladePo.clickOnAllTemplateTab();
            expect(await utilityGrid.isGridRecordPresent(caseTemplateDataPsilon.templateName)).toBeFalsy(`${caseTemplateDataPetramcoHR.templateName} is not present`);
            expect(await utilityGrid.isGridRecordPresent(caseTemplateDataPetramcoHR.templateName)).toBeTruthy(`${caseTemplateDataPetramcoHR.templateName} is not present`);
            expect(await utilityGrid.isGridRecordPresent(caseTemplateDataPetramcoFacilities.templateName)).toBeFalsy(`${caseTemplateDataPetramcoFacilities.templateName} is present`);
            expect(await utilityGrid.isGridRecordPresent(caseTemplateDataGlobalHR.templateName)).toBeTruthy(`${caseTemplateDataPetramcoHR.templateName} is not present`);
            expect(await utilityGrid.isGridRecordPresent(caseTemplateDataGlobalFacilities.templateName)).toBeFalsy(`${caseTemplateDataPetramcoFacilities.templateName} is present`);
            await selectCasetemplateBladePo.selectCaseTemplate(caseTemplateDataPetramcoHR.templateName);

            await createCasePage.clickChangeAssignmentButton();
            expect(await changeAssignmentBlade.isValuePresentInDropdown('Petramco', 'Psilon')).toBeFalsy();
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
            await changeAssignmentBlade.setAssignee('Petramco', 'Australia Support', 'Au Support 1', "RA3 Liu");
            await createCasePage.selectLineOfBusiness('Facilities');
            let emptyStr = '';
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

    //apurva
    describe('[DRDMV-23486]:[Operating Organization][Create Case]: Verify the behavior when the case agent is able to create a case when it has access to single LOB', async () => {
        let randomStr = Math.floor(Math.random() * 1000000);
        let caseTemplateDataFacilities;
        let confidentialSupportGroup = "Employee Relations Sensitive Data Access";
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
            expect(await createCasePage.isValuePresentInDropdown("Category Tier 1", 'Employee Relations')).toBeFalsy('Value is present in  Category Tier 1 drop down');
            expect(await editCasePo.isLineOfBusinessReadOnly()).toBeTruthy('Field is enabled');
            await editCasePo.updateCasePriority('High');
            await editCasePo.updateCaseCategoryTier1('Phones');
            await editCasePo.updateCaseCategoryTier2('Cellular Phones');
            await editCasePo.updateCaseCategoryTier3('Service');
            await editCasePo.clickChangeAssignmentButton();
            expect(await changeAssignmentBladePo.businessUnitOptionsPresent('United States Support')).toBeFalsy();
            await changeAssignmentBladePo.clickOnCancelButton();
            await createCasePage.clickChangeAssignmentButton();
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
            await apiHelper.apiLogin('tadmin');
            await apiHelper.updateFoundationEntity('Person', 'Fritz', { functionalRole: "Facilities" });
            await navigationPage.signOut();
            await loginPage.login('fritz');
            await utilityGrid.clearFilter();
            await utilityGrid.searchRecord('DRDMV-23519Summary' + randomStr);
            expect(await utilityGrid.isGridRecordPresent('DRDMV-23519Summary' + randomStr)).toBeFalsy('DRDMV-23519Summary' + randomStr);
            await apiHelper.apiLogin('tadmin');
            await apiHelper.updateFoundationEntity('Person', 'Fritz', { functionalRole: "Facilities" });
            await utilityGrid.clearFilter();
            await utilityGrid.searchRecord('DRDMV-23519Summary' + randomStr);
            expect(await utilityGrid.isGridRecordPresent('DRDMV-23519Summary' + randomStr)).toBeTruthy('DRDMV-23519Summary' + randomStr);
        });
        afterAll(async () => {
            await utilityCommon.closeAllBlades();
            await navigationPage.signOut();
            await loginPage.login('qkatawazi');
        });
    });

    describe('[DRDMV-23488]:[Operating Organization][Quick Case]: Verify the behavior when the case agent is able to create a case when it has access to single LOB', async () => {
        let facilitiescaseData, facilitiesarticleData, caseTemplateDataGlobal, caseTemplateData, facilitiesTemplateData, randomStr = [...Array(4)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        let commonName = randomStr + "Case DRDMV23488";
        let commonNameForOtherLoB = randomStr + "FacilitiesDRDMV23488";
        beforeAll(async () => {
            caseTemplateData = {
                "templateName": commonName,
                "templateSummary": randomStr + 'Summary DRDMV23488',
                "caseStatus": "Assigned",
                "templateStatus": "Active",
                "company": "Petramco",
                "businessUnit": "United States Support",
                "supportGroup": "US Support 3",
                "assignee": "qkatawazi",
                "casePriority": "Low",
            };
            caseTemplateDataGlobal = {
                "templateName": commonName,
                "templateSummary": randomStr + 'Summary DRDMV23488',
                "caseStatus": "Assigned",
                "templateStatus": "Active",
                "company": "- Global -",
                "businessUnit": "United States Support",
                "supportGroup": "US Support 3",
                "assignee": "qkatawazi",
                "casePriority": "Low",
            };
            let caseData = {
                "Requester": "qtao",
                "Summary": commonName,
                "Assigned Company": "Petramco",
                "Business Unit": "United States Support",
                "Support Group": "US Support 3",
                "categoryTier1": "Purchasing Card",
                "categoryTier2": "Policies",
                "categoryTier3": "Card Issuance",
                "Assignee": "qfeng"
            };
            let articleData = {
                "knowledgeSet": "HR",
                "title": commonName,
                "templateId": "AGGAA5V0HGVMIAOK2JE7O965BK1BJW",
                "assignedCompany": "Petramco",
                "assigneeBusinessUnit": "Australia Support",
                "assigneeSupportGroup": "AU Support 3",
                "assignee": "KWilliamson"
            };
            await apiHelper.apiLogin('qkatawazi');
            await apiHelper.createCaseTemplate(caseTemplateData);
            await apiHelper.createCaseTemplate(caseTemplateDataGlobal);
            await apiHelper.createCase(caseData);
            let knowledgeArticleData = await apiHelper.createKnowledgeArticle(articleData);
            let knowledgeArticleGUID = knowledgeArticleData.id;
            expect(await apiHelper.updateKnowledgeArticleStatus(knowledgeArticleGUID, 'Draft')).toBeTruthy('Status Not Set');
            expect(await apiHelper.updateKnowledgeArticleStatus(knowledgeArticleGUID, 'SMEReview', 'qkatawazi', 'Compensation and Benefits', 'Petramco')).toBeTruthy("Article with SME Review status not updated.");
            expect(await apiHelper.updateKnowledgeArticleStatus(knowledgeArticleGUID, 'PublishApproval', 'qkatawazi', 'Compensation and Benefits', 'Petramco')).toBeTruthy('Status Not Set');
            facilitiesTemplateData = {
                "templateName": commonNameForOtherLoB,
                "templateSummary": randomStr + "FacilitiesDRDMV23488",
                "caseStatus": "Assigned",
                "templateStatus": "Active",
                "company": "Petramco",
                "businessUnit": "Facilities Support",
                "supportGroup": "Facilities",
                "assignee": "Fritz",
                "casePriority": "Low",
            };
            facilitiescaseData = {
                "Requester": "qtao",
                "Summary": commonNameForOtherLoB,
                "Assigned Company": "Petramco",
                "Business Unit": "Facilities Support",
                "Support Group": "Facilities",
                "categoryTier1": "Phones",
                "categoryTier2": "Cellular Phones",
                "categoryTier3": "Service",
                "Assignee": "Frieda"
            };
            facilitiesarticleData = {
                "knowledgeSet": "HR",
                "title": commonNameForOtherLoB,
                "templateId": "AGGAA5V0HGVMIAOK2JE7O965BK1BJW",
                "assignedCompany": "Petramco",
                "assigneeBusinessUnit": "Facilities Support",
                "assigneeSupportGroup": "Facilities",
                "assignee": "Fritz"
            };
            await apiHelper.apiLogin('fritz');
            await apiHelper.createCaseTemplate(facilitiesTemplateData);
            await apiHelper.createCase(caseData);
            let knowledgeArticleData1 = await apiHelper.createKnowledgeArticle(articleData);
            let knowledgeArticleGUID1 = knowledgeArticleData1.id;
            expect(await apiHelper.updateKnowledgeArticleStatus(knowledgeArticleGUID1, 'Draft')).toBeTruthy('Status Not Set');
            expect(await apiHelper.updateKnowledgeArticleStatus(knowledgeArticleGUID1, 'SMEReview', 'qkatawazi', 'Compensation and Benefits', 'Petramco')).toBeTruthy("Article with SME Review status not updated.");
            expect(await apiHelper.updateKnowledgeArticleStatus(knowledgeArticleGUID1, 'PublishApproval', 'qkatawazi', 'Compensation and Benefits', 'Petramco')).toBeTruthy('Status Not Set');
        });
        it('[DRDMV-23488]:[Operating Organization][Quick Case]: Verify the behavior when the case agent is able to create a case when it has access to single LOB', async () => {
            await navigationPage.gotoQuickCase();
            await quickCasePo.selectRequesterName('adam');
            await quickCasePo.selectCaseTemplate(caseTemplateData.templateName);
            await quickCasePo.clickArrowFirstRecommendedCaseTemplate();
            expect(await previewCaseTemplateCasesPo.getLineOfBusinessValue()).toBe('Human Resource');
            await previewCaseTemplateCasesPo.clickOnBackButton();
        });
        it('[DRDMV-23488]:[Operating Organization][Quick Case]: Verify the behavior when the case agent is able to create a case when it has access to single LOB', async () => {
            await browser.sleep(7000); //Hard wait for KA Indexing
            expect(await resourcesPo.getKnowledgeArticleInfo()).toContain('Human Resource', 'LOB is not correct');
            await resourcesPo.clickOnAdvancedSearchOptions();
            await resourcesPo.enterAdvancedSearchText(caseTemplateData.templateName);
            await resourcesPo.clickOnAdvancedSearchSettingsIconToOpen();
            await resourcesPo.clickOnAdvancedSearchFiltersButton('Apply');
            await resourcesPo.clickOnAdvancedSearchSettingsIconToClose();
            expect(await resourcesPo.getKnowledgeArticleInfo()).toContain('Human Resource', 'LOB is not correct');
            await quickCasePo.clickFirstRecommendedCases();
            expect(await previewCasePage.getLineOfBusinessValue()).toBe('Human Resource');
            await previewCasePage.clickBackButton();
            await quickCasePo.createCaseButton();
            await previewCasePage.clickGoToCaseButton();
        });
        it('[DRDMV-23488]:[Operating Organization][Quick Case]: Verify the behavior when the case agent is able to create a case when it has access to single LOB', async () => {
            await viewCasePage.clickEditCaseButton();
            expect(await editCasePo.isValuePresentInDropdown("Category Tier 1", 'Phones')).toBeFalsy('Value is present in  Category Tier 1 drop down');
            expect(await editCasePo.isLineOfBusinessReadOnly()).toBeTruthy('Field is enabled');
            await editCasePo.updateCasePriority('High');
            await editCasePo.updateCaseCategoryTier1('Employee Relations');
            await editCasePo.updateCaseCategoryTier2('Compensation');
            await editCasePo.updateCaseCategoryTier3('Bonus');
            await editCasePo.clickChangeAssignmentButton();
            expect(await changeAssignmentBladePo.businessUnitOptionsPresent('Facilities Support')).toBeFalsy();
            await changeAssignmentBladePo.clickOnCancelButton();
            await editCasePo.clickChangeAssignmentButton();
            await changeAssignmentBladePo.selectBusinessUnit('Australia Support');
            await changeAssignmentBladePo.selectSupportGroup('AU Support 1');
            await changeAssignmentBladePo.selectAssignee('RA3 Liu');
            await changeAssignmentBladePo.clickOnAssignButton();
            await editCasePo.clickSaveCase();
            expect(await viewCasePage.getCategoryTier1Value()).toBe('Employee Relations');
            expect(await viewCasePage.getCategoryTier2Value()).toBe('Compensation');
            expect(await viewCasePage.getCategoryTier3Value()).toBe('Bonus');
            expect(await viewCasePage.getAssignedGroupText()).toBe("AU Support 1");
            expect(await viewCasePage.getAssigneeText()).toBe("RA3 Liu");
        });
        it('[DRDMV-23488]:[Operating Organization][Quick Case]: Verify the behavior when the case agent is able to create a case when it has access to single LOB', async () => {
            await apiHelper.apiLogin('qkatawazi');
            caseTemplateData.templateName = randomStr + "2Case DRDMV23488";
            await apiHelper.createCaseTemplate(caseTemplateData);
            await viewCasePage.clickEditCaseButton();
            await editCasePo.clickOnChangeCaseTemplate();
            await selectCasetemplateBladePo.selectCaseTemplate(randomStr + "2Case DRDMV23488");
            await editCasePo.clickSaveCase();
            await utilityCommon.closePopUpMessage();
            await utilityCommon.closePopUpMessage();
            await navigationPage.gotoCaseConsole();
            expect(await utilityGrid.isGridRecordPresent(randomStr + "2Case DRDMV23488")).toBeTruthy('DRDMV-23519Summary' + randomStr);
            await navigationPage.signOut();
            await loginPage.login('fritz');
            await utilityGrid.clearFilter();
            expect(await utilityGrid.isGridRecordPresent(randomStr + "2Case DRDMV23488")).toBeFalsy('DRDMV-23519Summary' + randomStr);
            await navigationPage.signOut();
            await loginPage.login('jbarnes');
            await navigationPage.gotoQuickCase();
            await quickCasePo.selectRequesterName('adam');
            await quickCasePo.setCaseSummary('new case');
            await quickCasePo.createCaseButton();
            await utilityCommon.closePopUpMessage();
            expect(await previewCasePage.getLineOfBusinessValue()).toBe('Human Resource');
            await quickCasePo.gotoCaseButton();
            await viewCasePage.clickEditCaseButton();
            expect(await editCasePo.isValuePresentInDropdown("Category Tier 1", 'Phones')).toBeFalsy('Value is present in  Category Tier 1 drop down');
            expect(await editCasePo.isLineOfBusinessReadOnly()).toBeTruthy('Field is enabled');
            await editCasePo.updateCasePriority('High');
            await editCasePo.updateCaseCategoryTier1('Employee Relations');
            await editCasePo.updateCaseCategoryTier2('Compensation');
            await editCasePo.updateCaseCategoryTier3('Bonus');
            await editCasePo.clickChangeAssignmentButton();
            expect(await changeAssignmentBladePo.businessUnitOptionsPresent('Facilities Support')).toBeFalsy();
            await changeAssignmentBladePo.clickOnCancelButton();
            await editCasePo.clickChangeAssignmentButton();
            await changeAssignmentBladePo.selectBusinessUnit('Australia Support');
            await changeAssignmentBladePo.selectSupportGroup('AU Support 1');
            await changeAssignmentBladePo.selectAssignee('RA3 Liu');
            await changeAssignmentBladePo.clickOnAssignButton();
            await editCasePo.clickSaveCase();
            expect(await viewCasePage.getCategoryTier1Value()).toBe('Employee Relations');
            expect(await viewCasePage.getCategoryTier2Value()).toBe('Compensation');
            expect(await viewCasePage.getCategoryTier3Value()).toBe('Bonus');
            expect(await viewCasePage.getAssignedGroupText()).toBe("AU Support 1");
            expect(await viewCasePage.getAssigneeText()).toBe("RA3 Liu");
            await navigationPage.gotoQuickCase();
            await quickCasePo.selectRequesterName('adam');
            await quickCasePo.selectCaseTemplate(facilitiesTemplateData.templateName);
            await quickCasePo.createCaseButton();
            await utilityCommon.closePopUpMessage();
            expect(await previewCasePage.getLineOfBusinessValue()).toBe('Facilities');
            await quickCasePo.gotoCaseButton();
        });
        it('[DRDMV-23488]:[Operating Organization][Quick Case]: Verify the behavior when the case agent is able to create a case when it has access to single LOB', async () => {
            await navigationPage.gotoQuickCase();
            await quickCasePo.selectRequesterName('adam');
            await quickCasePo.selectCaseTemplate(caseTemplateDataGlobal.templateName);
            await quickCasePo.clickArrowFirstRecommendedCaseTemplate();
            expect(await previewCaseTemplateCasesPo.getLineOfBusinessValue()).toBe('Human Resource');
            await previewCaseTemplateCasesPo.clickOnBackButton();
            await navigationPage.signOut();
            await loginPage.login('qkatawazi');
            await navigationPage.gotoQuickCase();
            await quickCasePo.selectRequesterName('adam');
            expect(await quickCasePo.selectCaseTemplate(facilitiesTemplateData.templateName)).toBeFalsy('template is present');
            await quickCasePo.setCaseSummary('new case');
            await resourcesPo.clickOnAdvancedSearchOptions();
            await resourcesPo.enterAdvancedSearchText(facilitiesarticleData.title);
            await resourcesPo.clickOnAdvancedSearchSettingsIconToOpen();
            await resourcesPo.clickOnAdvancedSearchFiltersButton('Apply');
            await resourcesPo.clickOnAdvancedSearchSettingsIconToClose();
            expect(await resourcesPo.isRecommendedKnowledgePresent(facilitiesarticleData.title)).toBeFalsy();
        });
        afterAll(async () => {
            await utilityCommon.closeAllBlades();
            await navigationPage.signOut();
            await loginPage.login('qkatawazi');
        });
    });

    describe('[DRDMV-23624,DRDMV-23614]:[Operating Organization][Quick Case]: Verify the behavior when the case agent is able to create a case when it has access to single LOB with diff Company', async () => {
        let caseTemplateData, facilitiesTemplateData, caseTemplateDataPsilon, randomStr = [...Array(4)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        let commonName = randomStr + "Case DRDMV23488";
        beforeAll(async () => {
            caseTemplateData = {
                "templateName": commonName,
                "templateSummary": randomStr + 'Summary DRDMV23488',
                "caseStatus": "Assigned",
                "templateStatus": "Active",
                "company": "Petramco",
                "businessUnit": "United States Support",
                "supportGroup": "US Support 3",
                "assignee": "qkatawazi",
                "casePriority": "Low",
            };
            let caseData = {
                "Requester": "qtao",
                "Summary": commonName,
                "Assigned Company": "Petramco",
                "Business Unit": "United States Support",
                "Support Group": "US Support 3",
                "categoryTier1": "Purchasing Card",
                "categoryTier2": "Policies",
                "categoryTier3": "Card Issuance",
                "Assignee": "qkatawazi"
            };
            let articleData = {
                "knowledgeSet": "HR",
                "title": commonName,
                "templateId": "AGGAA5V0HGVMIAOK2JE7O965BK1BJW",
                "assignedCompany": "Petramco",
                "assigneeBusinessUnit": "Australia Support",
                "assigneeSupportGroup": "AU Support 3",
                "assignee": "KWilliamson"
            };
            caseTemplateDataPsilon = {
                "templateName": `psilonDraftCaseTemplate${randomStr}`,
                "templateSummary": `psilonDraftCaseTemplate${randomStr}`,
                "caseStatus": "Assigned",
                "templateStatus": "Active",
                "company": "Psilon",
                "businessUnit": "Psilon Support Org1",
                "supportGroup": "Psilon Support Group1",
                "ownerBU": "Psilon Support Org1",
                "ownerGroup": "Psilon Support Group1"
            }
            await apiHelper.apiLogin(userData1.userId + '@petramco.com', 'Password_1234');
            await apiHelper.createCaseTemplate(caseTemplateData);
            await apiHelper.createCaseTemplate(caseTemplateDataPsilon);
            await apiHelper.createCase(caseData);
            let knowledgeArticleData = await apiHelper.createKnowledgeArticle(articleData);
            let knowledgeArticleGUID = knowledgeArticleData.id;
            expect(await apiHelper.updateKnowledgeArticleStatus(knowledgeArticleGUID, 'Draft')).toBeTruthy('Status Not Set');
            expect(await apiHelper.updateKnowledgeArticleStatus(knowledgeArticleGUID, 'SMEReview', 'qkatawazi', 'Compensation and Benefits', 'Petramco')).toBeTruthy("Article with SME Review status not updated.");
            expect(await apiHelper.updateKnowledgeArticleStatus(knowledgeArticleGUID, 'PublishApproval', 'qkatawazi', 'Compensation and Benefits', 'Petramco')).toBeTruthy('Status Not Set');
            facilitiesTemplateData = {
                "templateName": randomStr + "FacilitiesDRDMV23488",
                "templateSummary": randomStr + "FacilitiesDRDMV23488",
                "caseStatus": "Assigned",
                "templateStatus": "Active",
                "company": "Petramco",
                "businessUnit": "Facilities Support",
                "supportGroup": "Facilities",
                "assignee": "Fritz",
                "casePriority": "Low",
            };
            await apiHelper.apiLogin('fritz');
            await apiHelper.createCaseTemplate(facilitiesTemplateData);
        });
        it('[DRDMV-23624,DRDMV-23614]:[Operating Organization][Quick Case]: Verify the behavior when the case agent is able to create a case when it has access to single LOB with diff Company', async () => {
            await navigationPage.signOut();
            await loginPage.login(userData1.userId + "@petramco.com", 'Password_1234');
            await navigationPage.gotoQuickCase();
            await quickCasePo.selectRequesterName('adam');
            await quickCasePo.setCaseSummary('PetramcoCaseSummary' + randomStr);
            await quickCasePo.selectCaseTemplate(caseTemplateData.templateName);
            await quickCasePo.clickArrowFirstRecommendedCaseTemplate();
            expect(await previewCaseTemplateCasesPo.getLineOfBusinessValue()).toBe('Human Resource');
            await previewCaseTemplateCasesPo.clickOnBackButton();
        });
        it('[DRDMV-23624,DRDMV-23614]:[Operating Organization][Quick Case]: Verify the behavior when the case agent is able to create a case when it has access to single LOB with diff Company', async () => {
            await browser.sleep(5000); //Hard wait for KA Indexing
            expect(await resourcesPo.getKnowledgeArticleInfo()).toContain('Human Resource', 'LOB is not correct');
            await resourcesPo.clickOnAdvancedSearchOptions();
            await resourcesPo.enterAdvancedSearchText(caseTemplateData.templateName);
            await resourcesPo.clickOnAdvancedSearchSettingsIconToOpen();
            await resourcesPo.clickOnAdvancedSearchFiltersButton('Apply');
            await resourcesPo.clickOnAdvancedSearchSettingsIconToClose();
            expect(await resourcesPo.getKnowledgeArticleInfo()).toContain('Human Resource', 'LOB is not correct');
            await quickCasePo.clickFirstRecommendedCases();
            expect(await previewCasePage.getLineOfBusinessValue()).toBe('Human Resource');
            await previewCasePage.clickBackButton();
            await quickCasePo.createCaseButton();
            await previewCasePage.clickGoToCaseButton();
        });
        it('[DRDMV-23624,DRDMV-23614]:[Operating Organization][Quick Case]: Verify the behavior when the case agent is able to create a case when it has access to single LOB with diff Company', async () => {
            await viewCasePage.clickEditCaseButton();
            expect(await editCasePo.isValuePresentInDropdown("Category Tier 1", 'Phones')).toBeFalsy('Value is present in  Category Tier 1 drop down');
            expect(await editCasePo.isLineOfBusinessReadOnly()).toBeTruthy('Field is enabled');
            await editCasePo.updateCasePriority('High');
            await editCasePo.updateCaseCategoryTier1('Employee Relations');
            await editCasePo.updateCaseCategoryTier2('Compensation');
            await editCasePo.updateCaseCategoryTier3('Bonus');
            await editCasePo.clickChangeAssignmentButton();
            expect(await changeAssignmentBladePo.businessUnitOptionsPresent('Facilities Support')).toBeFalsy();
            await changeAssignmentBladePo.clickOnCancelButton();
            await editCasePo.clickChangeAssignmentButton();
            await changeAssignmentBladePo.selectBusinessUnit('Australia Support');
            await changeAssignmentBladePo.selectSupportGroup('AU Support 1');
            await changeAssignmentBladePo.selectAssignee('RA3 Liu');
            await changeAssignmentBladePo.clickOnAssignButton();
            await editCasePo.clickSaveCase();
            expect(await viewCasePage.getCategoryTier1Value()).toBe('Employee Relations');
            expect(await viewCasePage.getCategoryTier2Value()).toBe('Compensation');
            expect(await viewCasePage.getCategoryTier3Value()).toBe('Bonus');
            expect(await viewCasePage.getAssignedGroupText()).toBe("AU Support 1");
            expect(await viewCasePage.getAssigneeText()).toBe("RA3 Liu");
        });
        it('[DRDMV-23624,DRDMV-23614]:[Operating Organization][Quick Case]: Verify the behavior when the case agent is able to create a case when it has access to single LOB with diff Company', async () => {
            await apiHelper.apiLogin(userData1.userId + '@petramco.com', 'Password_1234');
            caseTemplateData.templateName = randomStr + "2Case DRDMV23488";
            await apiHelper.createCaseTemplate(caseTemplateData);
            await viewCasePage.clickEditCaseButton();
            await editCasePo.clickOnChangeCaseTemplate();
            await selectCasetemplateBladePo.selectCaseTemplate(randomStr + "2Case DRDMV23488");
            await editCasePo.clickSaveCase();
            await utilityCommon.closePopUpMessage();
            await utilityCommon.closePopUpMessage();
            await navigationPage.gotoCaseConsole();
            expect(await utilityGrid.isGridRecordPresent(randomStr + "2Case DRDMV23488")).toBeTruthy('DRDMV-23519Summary' + randomStr);
            await navigationPage.signOut();
            await loginPage.login('fritz');
            await utilityGrid.clearFilter();
            expect(await utilityGrid.isGridRecordPresent(randomStr + "2Case DRDMV23488")).toBeFalsy('DRDMV-23519Summary' + randomStr);
            await navigationPage.signOut();
            await loginPage.login('jbarnes');
            await navigationPage.gotoQuickCase();
            await quickCasePo.selectRequesterName('adam');
            await quickCasePo.setCaseSummary('new case');
            await quickCasePo.createCaseButton();
            await utilityCommon.closePopUpMessage();
            expect(await previewCasePage.getLineOfBusinessValue()).toBe('Human Resource');
            await quickCasePo.gotoCaseButton();
            await navigationPage.gotoQuickCase();
            await quickCasePo.selectRequesterName('adam');
            await quickCasePo.selectCaseTemplate(randomStr + "FacilitiesDRDMV23488");
            expect(await quickCasePo.selectCaseTemplate(randomStr + "2Case DRDMV23488")).toBeTruthy('template is present');
            await quickCasePo.createCaseButton();
            await utilityCommon.closePopUpMessage();
            expect(await previewCasePage.getLineOfBusinessValue()).toBe('Facilities');
            await quickCasePo.gotoCaseButton();
        });
        it('[DRDMV-23624,DRDMV-23614]:[Operating Organization][Quick Case]: Verify the behavior when the case agent is able to create a case when it has access to single LOB with diff Company', async () => {
            await navigationPage.signOut();
            await loginPage.login(userData1.userId + "@petramco.com", 'Password_1234');
            await navigationPage.gotoQuickCase();
            await quickCasePo.selectRequesterName('adam');
            await quickCasePo.setCaseSummary('PsilonCaseSummary' + randomStr);
            await quickCasePo.selectCaseTemplate(caseTemplateDataPsilon.templateName);
            await quickCasePo.createCaseButton();
            await utilityCommon.closePopUpMessage();
            expect(await previewCasePage.getLineOfBusinessValue()).toBe('Human Resource');
            await quickCasePo.gotoCaseButton();
            await navigationPage.signOut();
            await loginPage.login('idphylum1@petramco.com', 'Password_1234');
            await utilityGrid.clearFilter();
            expect(await utilityGrid.isGridRecordPresent('PetramcoCaseSummary' + randomStr)).toBeFalsy('PetramcoCaseSummary' + randomStr);
            expect(await utilityGrid.isGridRecordPresent('PsilonCaseSummary' + randomStr)).toBeFalsy('PsilonCaseSummary' + randomStr);
        });
        it('[DRDMV-23624,DRDMV-23614]:[Operating Organization][Quick Case]: Verify the behavior when the case agent is able to create a case when it has Multiple LOB', async () => {
            await navigationPage.signOut();
            await loginPage.login('jbarnes');
            await utilityGrid.clearFilter();
            await utilGrid.selectLineOfBusiness("Human Resource");
            expect(await utilityGrid.isGridRecordPresent(randomStr + "2Case DRDMV23488")).toBeTruthy('DRDMV-23519Summary' + randomStr);
            await viewCasePage.clickEditCaseButton();
            expect(await editCasePo.isLineOfBusinessReadOnly()).toBeFalsy('Field is enabled');
            expect(await editCasePo.isValuePresentInDropdown("Category Tier 1", 'Phones')).toBeFalsy('Value is present in  Category Tier 1 drop down');
            await utilGrid.selectLineOfBusiness("Facilities");
            expect(await editCasePo.isValuePresentInDropdown("Category Tier 1", 'Phones')).toBeTruthy('Value is present in  Category Tier 1 drop down');
            await utilGrid.selectLineOfBusiness("Human Resource");
            expect(await editCasePo.isValuePresentInDropdown("Category Tier 1", 'Employee Relations')).toBeTruthy('Value is present in  Category Tier 1 drop down');
            await editCasePo.clickChangeAssignmentButton();
            expect(await changeAssignmentBladePo.businessUnitOptionsPresent('Facilities Support')).toBeFalsy();
            await changeAssignmentBladePo.clickOnCancelButton();
            await utilGrid.selectLineOfBusiness("Facilities");
            await editCasePo.clickChangeAssignmentButton();
            expect(await changeAssignmentBladePo.businessUnitOptionsPresent('Facilities Support')).toBeTruthy();
            await changeAssignmentBladePo.clickOnCancelButton();
            await utilGrid.selectLineOfBusiness("Human Resource");
            await editCasePo.clickChangeAssignmentButton();
            expect(await changeAssignmentBladePo.businessUnitOptionsPresent('Australia Support')).toBeFalsy();
            await changeAssignmentBladePo.clickOnCancelButton();
            await editCasePo.clickOnChangeCaseTemplate();
            await selectCasetemplateBladePo.selectCaseTemplate(caseTemplateData.templateName);
            await editCasePo.clickSaveCase();
            expect(await viewCasePage.getLineOfBusinessValue()).toBe('Human Resource');
            await navigationPage.gotoCaseConsole();
            await utilGrid.selectLineOfBusiness("Facilities");
            expect(await utilityGrid.isGridRecordPresent(caseTemplateData.templateName)).toBeFalsy('DRDMV-23519Summary' + randomStr);
            await utilGrid.selectLineOfBusiness("Human Resource");
            expect(await utilityGrid.isGridRecordPresent(caseTemplateData.templateName)).toBeTruthy('DRDMV-23519Summary' + randomStr);
        });
        afterAll(async () => {
            await utilityCommon.closeAllBlades();            
            await navigationPage.signOut();
            await loginPage.login('qkatawazi');
        });
    });

    describe('[DRDMV-23617]:[Operating Organization] [Cases] : Verify the behavior where Email Templates, Task Templates, Resolution Codes, Notes templates are filtered / displayed based on the Line of Business on Cases.', async () => {
        let randomStr = [...Array(5)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        let response, notesTemplate2, emailTemplateOraclePsilon, templateData2, tempNotesTemplateData1, templateData, externaltemplateData, automatedtemplateData, emailTemplateName, emailTemplateName1, notesTemplateName, notesTemplateBody, notesTemplateName1, notesTemplateBody1;
        let resolutionCode = 'resolutionCode' + randomStr;
        beforeAll(async () => {
            await apiHelper.apiLogin('qkatawazi');
            templateData = {
                "templateName": 'Manual task19011' + randomStr,
                "templateSummary": 'Manual task19011' + randomStr,
                "templateStatus": "Active",
                "taskCompany": "Petramco",
                "ownerCompany": "Petramco",
                "ownerBusinessUnit": "United States Support",
                "ownerGroup": "US Support 3",
                "businessUnit": "United States Support",
                "supportGroup": "US Support 3",
                "assignee": "qkatawazi",
            }
            await apiHelper.createManualTaskTemplate(templateData);
            externaltemplateData = {
                "templateName": 'External task19011' + randomStr,
                "templateSummary": 'External task19011' + randomStr,
                "templateStatus": "Active",
                "taskCompany": '- Global -',
                "ownerCompany": '- Global -',
                "ownerBusinessUnit": "United States Support",
                "ownerGroup": "US Support 3",
                "businessUnit": "United States Support",
                "supportGroup": "US Support 1",
                "assignee": "qtao",
            }
            await apiHelper.createExternalTaskTemplate(externaltemplateData);
            automatedtemplateData = {
                "templateName": 'Automated task19011' + randomStr,
                "templateSummary": 'Automated task19011' + randomStr,
                "templateStatus": "Active",
                "processBundle": "com.bmc.dsm.case-lib",
                "processName": 'Auto Proces' + randomStr,
                "taskCompany": "Petramco",
                "ownerCompany": "Petramco",
                "ownerBusinessUnit": "United States Support",
                "ownerGroup": "US Support 3",
                "businessUnit": "United States Support",
                "supportGroup": "US Support 1",
                "assignee": "qtao",
            }
            await apiHelper.createAutomatedTaskTemplate(automatedtemplateData);
            //create an email template 
            emailTemplateName = await emailTemplateData['emailTemplateToComposeEmail'].TemplateName + randomStr;
            emailTemplateData['emailTemplateToComposeEmail'].TemplateName = emailTemplateName;
            await apiHelper.createEmailTemplate(emailTemplateData['emailTemplateToComposeEmail']);
            emailTemplateName1 = await emailTemplateData['emailTemplateToComposeEmailGlobal'].TemplateName + randomStr;
            emailTemplateData['emailTemplateToComposeEmailGlobal'].TemplateName = emailTemplateName1;
            await apiHelper.createEmailTemplate(emailTemplateData['emailTemplateToComposeEmailGlobal']);

            // Create Resoution code
            await apiHelper.apiLogin('qkatawazi');
            let resolutionCodeActiveOnUIData = cloneDeep(RESOLUTION_CODE_ACTIVE_ON_UI)
            resolutionCode = resolutionCodeActiveOnUIData.menuItemName + randomStr;
            resolutionCodeActiveOnUIData.menuItemName = resolutionCode;
            await apiHelper.createNewMenuItem(resolutionCodeActiveOnUIData);

            // Create Notes Template
            tempNotesTemplateData1 = cloneDeep(notesTemplateData.NOTES_TEMPLATE_MANDATORY_FIELD);
            notesTemplateName = tempNotesTemplateData1.templateName + randomStr;
            notesTemplateBody = tempNotesTemplateData1.body + randomStr;
            tempNotesTemplateData1.body = notesTemplateBody;
            tempNotesTemplateData1.templateName = notesTemplateName;
            await apiHelper.createNotesTemplate("Case", tempNotesTemplateData1);

            let tempNotesTemplateData2 = cloneDeep(notesTemplateData.NOTES_TEMPLATE_MANDATORY_FIELD_GLOBAL);
            notesTemplateName1 = tempNotesTemplateData2.templateName + randomStr;
            notesTemplateBody1 = tempNotesTemplateData2.body + randomStr;
            tempNotesTemplateData2.body = notesTemplateBody1;
            tempNotesTemplateData2.templateName = notesTemplateName1;
            await apiHelper.createNotesTemplate("Case", tempNotesTemplateData2);
            let caseData = {
                "Requester": "qtao",
                "Summary": "Summary" + randomStr,
                "Assigned Company": "Petramco",
                "Business Unit": "United States Support",
                "Support Group": "US Support 3",
                "categoryTier1": "Purchasing Card",
                "categoryTier2": "Policies",
                "categoryTier3": "Card Issuance",
                "Assignee": "qfeng"
            };
            response = await apiHelper.createCase(caseData);
            await apiHelper.apiLogin('gderuno');
            templateData2 = {
                "templateName": "PsilonName" + randomStr,
                "templateSummary": "PsilonSummary" + randomStr,
                "templateStatus": "Active",
                "taskCompany": "Psilon",
                "ownerCompany": "Psilon",
                "ownerBusinessUnit": "Psilon Support Org1",
                "ownerGroup": "Psilon Support Group1",
                "businessUnit": "Psilon Support Org1",
                "supportGroup": "Psilon Support Group1",
                "assignee": "gwixillian",
            }
            await apiHelper.createManualTaskTemplate(templateData2);
            notesTemplate2 = {
                "templateName": "notesTemplatePsilon" + randomStr,
                "company": "Psilon",
                "templateStatus": 1,
                "body": "this is notes template description Oracle",
            }
            await apiHelper.createNotesTemplate("Case", notesTemplate2);
            emailTemplateOraclePsilon = {
                "TemplateName": "PsilonEmail" + randomStr,
                "Company": "Psilon",
                "Status": 1,
                "Description": "Leave details",
                "EmailMessageSubject": "Leave summary",
                "EmailMessageBody": "Hello testing Global Oracle",
            }
            await apiHelper.createEmailTemplate(emailTemplateOraclePsilon);
        });
        it('[DRDMV-23617]:[Operating Organization] [Cases] : Verify the behavior where Email Templates, Task Templates, Resolution Codes, Notes templates are filtered / displayed based on the Line of Business on Cases.', async () => {
            await navigationPage.signOut();
            await loginPage.login('qkatawazi');
            await utilityGrid.searchAndOpenHyperlink(response.displayId);
            await viewCasePage.clickOnEmailLink();
            await composeMailPo.clickOnSelectEmailTemplateLink();
            await selectEmailTemplateBladePo.searchEmailTemplate(emailTemplateName);
            expect(await selectEmailTemplateBladePo.getGridRecordValue("Template Name")).toBe(emailTemplateName);
            await selectEmailTemplateBladePo.searchEmailTemplate(emailTemplateName1);
            expect(await selectEmailTemplateBladePo.getGridRecordValue("Template Name")).toBe(emailTemplateName1);
            await selectEmailTemplateBladePo.searchEmailTemplate(emailTemplateOraclePsilon.TemplateName);
            expect(await selectEmailTemplateBladePo.getGridRecordValue("Template Name")).toBe(emailTemplateOraclePsilon.TemplateName);
            await selectEmailTemplateBladePo.clickOnCancelButton();
            await composeMailPo.clickOnSelectEmailTemplateLink();
            await selectEmailTemplateBladePo.searchAndSelectEmailTemplate(emailTemplateName);
            await selectEmailTemplateBladePo.clickOnApplyButton();
            await composeMailPo.setToOrCCInputTextbox('To', 'fritz.schulz@petramco.com');
            await composeMailPo.clickOnSendButton();
            await utilityCommon.closePopUpMessage();
        });
        it('[DRDMV-23617]:[Operating Organization] [Cases] : Verify the behavior where Email Templates, Task Templates, Resolution Codes, Notes templates are filtered / displayed based on the Line of Business on Cases.', async () => {
            await viewCasePage.clickAddTaskButton();
            await manageTaskBladePo.clickAddTaskFromTemplateButton();
            await manageTaskBladePo.searchTaskTemplate(templateData.templateSummary);
            expect(await manageTaskBladePo.getGridRecordValue("Template Name")).toBe(templateData.templateSummary);
            await manageTaskBladePo.searchTaskTemplate(automatedtemplateData.templateSummary);
            expect(await manageTaskBladePo.getGridRecordValue("Template Name")).toBe(automatedtemplateData.templateSummary);
            await manageTaskBladePo.searchTaskTemplate(externaltemplateData.templateSummary);
            expect(await manageTaskBladePo.getGridRecordValue("Template Name")).toBe(externaltemplateData.templateSummary);
            await manageTaskBladePo.searchTaskTemplate(templateData2.TemplateName);
            expect(await manageTaskBladePo.getGridRecordValue("Template Name")).toBe(templateData2.TemplateName);
            await manageTaskBladePo.clickTaskGridCancelButton();
            await manageTaskBladePo.addTaskFromTaskTemplate(templateData.templateSummary);
            await manageTaskBladePo.addTaskFromTaskTemplate(automatedtemplateData.templateSummary);
            await manageTaskBladePo.addTaskFromTaskTemplate(externaltemplateData.templateSummary);
            await manageTaskBladePo.clickCloseButton();
        });
        it('[DRDMV-23617]:[Operating Organization] [Cases] : Verify the behavior where Email Templates, Task Templates, Resolution Codes, Notes templates are filtered / displayed based on the Line of Business on Cases.', async () => {
            // Verify Case Notes Template
            await activityTabPo.clickActivityNoteTextBox();
            await activityTabPo.clickOnNotesTemplate();
            expect(await notesTemplateUsage.isTemplatePresent(notesTemplateName)).toBeTruthy();
            expect(await notesTemplateUsage.isTemplatePresent(notesTemplateName1)).toBeTruthy();
            expect(await notesTemplateUsage.isTemplatePresent(notesTemplate2.templateName)).toBeTruthy();
            await notesTemplateUsage.clickOnCancelBtn();
            await navigationPage.gotoCaseConsole();
            await utilityGrid.searchAndOpenHyperlink(response.displayId);
            await notesTemplateUsage.clickAddNoteAndAddNoteTemplate(notesTemplateName);
            expect(await ckeditorValidationPo.getTextCkEditorTextArea()).toContain(notesTemplateBody);
            await activityTabPo.clickOnPostButton();
            expect(await activityTabPo.isTextPresentInActivityLog(tempNotesTemplateData1.body)).toBeTruthy();
        });
        it('[DRDMV-23617]:[Operating Organization] [Cases] : Verify the behavior where Email Templates, Task Templates, Resolution Codes, Notes templates are filtered / displayed based on the Line of Business on Cases.', async () => {
            // Verify Resolution Code
            await viewCasePage.clickEditCaseButton();
            await editCasePo.updateResolutionCode(resolutionCode);
            await editCasePo.setResolutionDescription(resolutionCode);
            await editCasePo.clickSaveCase();
            await utilityCommon.closePopUpMessage();
            expect(await viewCasePage.getResolutionCodeValue()).toBe(resolutionCode);
            expect(await viewCasePage.getResolutionDescription()).toBe(resolutionCode);
            await updateStatusBladePo.changeCaseStatus('Resolved');
            await updateStatusBladePo.setStatusReason('Auto Resolved');
            await updateStatusBladePo.clickSaveStatus();
            await utilityCommon.closePopUpMessage();
            expect(await viewCasePage.getTextOfStatus()).toBe('Resolved');
            expect(await viewCasePage.getResolutionCodeValue()).toBe(resolutionCode);
            expect(await viewCasePage.getResolutionDescription()).toBe(resolutionCode);
        });
        afterAll(async () => {
            await utilityCommon.closeAllBlades();
            await navigationPage.signOut();
            await loginPage.login('qkatawazi');
        });
    });

    describe('[DRDMV-23597]: [Operating Organization] [Knowledge] Verify the Knowledge Article Creation with respect to Line of Business when user has access to single Line of Business', () => {
        const randomStr = [...Array(10)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        let knowledgeSetTitle = 'KnowledgeSet_' + randomStr, articleData, articleDetails;
        const knowledgeTemplateStr = 'ArticleTemplate_' + randomStr;
        beforeAll(async () => {
            // Knowledge set under LOB HR
            let knowledgeSetData = {
                knowledgeSetTitle: `${knowledgeSetTitle}`,
                knowledgeSetDesc: `${knowledgeSetTitle}_Desc`,
                company: 'Petramco'
            }
            await apiHelper.apiLogin('elizabeth');
            await apiHelper.createKnowledgeSet(knowledgeSetData);
            // Knowledge Template under LOB HR
            let knowledgeArticleTemplateData = {
                templateName: knowledgeTemplateStr,
                sectionTitle: "articleSection"
            }
            await apiHelper.createKnowledgeArticleTemplate(knowledgeArticleTemplateData);
            let knowledgeTemplateId = await coreApi.getKnowledgeTemplateGuid(knowledgeTemplateStr);
        });
        it('[DRDMV-23597]: [Operating Organization] [Knowledge] Verify the Knowledge Article Creation with respect to Line of Business when user has access to single Line of Business', async () => {
            await navigationPage.gotoCreateKnowledge();
            await createKnowledgePage.clickOnTemplate(knowledgeTemplateStr);
            await createKnowledgePage.clickOnUseSelectedTemplateButton();
            expect(await createKnowledgePage.getValueOfLineOFBusiness()).toContain('Human Resource', 'value not matched with expected');
            await expect(createKnowledgePage.isLineOfBusinessDisable());
            expect(await createKnowledgePage.isValuePresentInDropdown('Knowledge Set', knowledgeSetTitle)).toBeTruthy('Failure: Knowledge Set is missing');
            expect(await createKnowledgePage.isValuePresentInDropdown('Category Tier 1', 'Employee Relations')).toBeTruthy('Failure: Operational Category 1 is missing');

            //Verify Knowledge set and category belonging to LOB Finanace are not visible
            expect(await createKnowledgePage.isValuePresentInDropdown('Knowledge Set', 'Facilities')).toBeFalsy('Failure: Knowledge Set is available');
            expect(await createKnowledgePage.isValuePresentInDropdown('Category Tier 1', 'Facilties')).toBeFalsy('Failure: Operational Category 1 is missing');

            //Knowledge creation
            await createKnowledgePage.addTextInKnowlegeTitleField(knowledgeSetTitle);
            await createKnowledgePage.selectKnowledgeSet(knowledgeSetTitle);
            await createKnowledgePage.selectCategoryTier1Option('Employee Relations');
            await createKnowledgePage.selectCategoryTier2Option('Compensation');
            await createKnowledgePage.selectCategoryTier3Option('Bonus');
            await createKnowledgePage.clickChangeAssignmentButton();
            await changeAssignmentBladePo.selectCompany('Petramco');
            // Need to add validation to verify Business unit , support group, Agent are visible as per logged in user LOB - Human Resource on create knowledge article
            await changeAssignmentBladePo.selectBusinessUnit('United States Support')
            await changeAssignmentBladePo.selectSupportGroup('US Support 3');
            await changeAssignmentBladePo.selectAssignee('Qadim Katawazi');
            await changeAssignmentBladePo.clickOnAssignButton();
            await createKnowledgePage.clickOnSaveKnowledgeButton();
            await previewKnowledgePo.clickGoToArticleButton();
        });
        it('[DRDMV-23597]: [Operating Organization] [Knowledge] Verify the Knowledge Article Creation with respect to Line of Business when user has access to single Line of Business', async () => {
            await viewKnowledgeArticlePo.clickEditKnowledgeMedataData();
            expect(await editKnowledgePo.getLineOfBusinessValue()).toBe('Human Resource');
            expect(await editKnowledgePo.getCategoryTier1SelectedValue()).toBe('Employee Relations');
            expect(await editKnowledgePo.isValuePresentInDropdown('Category Tier 1', 'Facilities')).toBeFalsy('Failure: Operational Category 1 is missing');
            await editKnowledgePo.cancelKnowledgeMedataDataChanges();
            // Need to add validation to verify Business unit , support group, Agent are visible as per logged in user LOB - Human Resource on edit Knowledge article
            await editKnowledgePo.setKnowledgeStatus('Draft');
            await utilityCommon.closePopUpMessage();
            await editKnowledgePo.setKnowledgeStatusWithoutSave('SME Review');
            await statusBladeKnowledgeArticlePo.clickChangeReviewerBtn();
            await changeAssignmentBladePo.selectCompany('Petramco');
            // Need to add validation to verify Business unit , support group, Agent are visible as per logged in user LOB - Human Resource on SME Review blade
            await changeAssignmentBladePo.selectBusinessUnit('United States Support');
            await changeAssignmentBladePo.selectSupportGroup('US Support 3');
            await changeAssignmentBladePo.selectAssignee('Qadim Katawazi');
            await changeAssignmentBladePo.clickOnAssignButton();
            await editKnowledgePo.clickSaveStatusBtn();
        });
        it('[DRDMV-23597]: [Operating Organization] [Knowledge] Verify the Knowledge Article Creation with respect to Line of Business when user has access to single Line of Business', async () => {
            await navigationPage.signOut();
            await loginPage.login('fritz');
            await navigationPage.gotoKnowledgeConsole();
            await utilityGrid.clearFilter();
            expect(await knowledgeArticlesConsolePo.isGridRecordPresent(knowledgeSetTitle)).toBeFalsy('Artcile is present');
        });
    });

    describe('[DRDMV-23625]: [Operating Organization][Create Case]: Verify the behavior when the case agent is able to create a case when user has access to multiple companies for the single Line of Business', () => {
        let twoCompanyUser, supportGroupDataHR, supportGroupDataFacilities, knowledgeSetDataHR, knowledgeSetDataFacilities, userData1, userData2, knowledgeArticleDataDiffLOB, articleId;
        let randomStr = [...Array(7)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        beforeAll(async () => {
            twoCompanyUser = {
                "firstName": "DRDMV23625",
                "lastName": "test",
                "userId": "DRDMV_23625_test",
                "userPermission": ["Case Agent", "Human Resource", "Case Business Analyst", "Knowledge Publisher"]
            }


            knowledgeSetDataHR = {
                knowledgeSetTitle: `KS HR ${randomStr}`,
                knowledgeSetDesc: `${randomStr}_Desc_HR`,
                company: 'Petramco'
            }

            knowledgeSetDataFacilities = {
                knowledgeSetTitle: `KS HR ${randomStr}`,
                knowledgeSetDesc: `${randomStr}_Desc_HR`,
                company: 'Petramco',
                lineOfBusiness: 'Facilities'
            }

            knowledgeArticleDataDiffLOB = {
                "knowledgeSet": 'HR',
                "title": `${randomStr} title Diff LOB`,
                "templateId": "AGGAA5V0HGVMIAOK04TZO94MC355RA",
                "assignedCompany": "Petramco",
                "assigneeBusinessUnit": "Facilities Support",
                "assigneeSupportGroup": "Facilities",
                "assignee": "Fritz",
                "lineOfBusiness": "Facilities"
            }

            await apiHelper.apiLogin("tadmin");
            await apiHelper.updateFoundationEntity('Person', 'Monika', { functionalRole: "Human Resource" });
            await apiHelper.createKnowledgeSet(knowledgeSetDataHR);
            await apiHelper.createKnowledgeSet(knowledgeSetDataFacilities);
            await apiHelper.createNewUser(twoCompanyUser);
            await apiHelper.associatePersonToCompany(twoCompanyUser.userId, "Petramco");
            await apiHelper.associatePersonToCompany(twoCompanyUser.userId, "Psilon");
            await apiHelper.associatePersonToSupportGroup(twoCompanyUser.userId, "US Support 3");
            await apiHelper.associatePersonToSupportGroup(twoCompanyUser.userId, "Psilon Support Group1");
            await browser.sleep(9000); //Waiting for user data to be reflected
            await apiHelper.createKnowledgeArticle(knowledgeArticleDataDiffLOB);
            await apiHelper.associatePersonToCompany('ncage', "Psilon");
            //Create data for Assignment value validations
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

            userData1 = {
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

            await apiHelper.createNewUser(userData1);
            await apiHelper.createNewUser(userData2);
            let orgId = await coreApi.getBusinessUnitGuid('Canada Support');
            supportGroupDataHR.relatedOrgId = orgId;
            supportGroupDataFacilities.relatedOrgId = orgId;
            await apiHelper.createSupportGroup(supportGroupDataHR);
            await apiHelper.createSupportGroup(supportGroupDataFacilities);
            await apiHelper.associatePersonToCompany(userData1.userId, "Petramco");
            await apiHelper.associatePersonToSupportGroup(userData1.userId, "US Support 3");
            await apiHelper.associatePersonToCompany(userData2.userId, "Petramco");
            await apiHelper.associatePersonToSupportGroup(userData2.userId, "US Support 3");
        });

        it('[DRDMV-23625]: [Operating Organization][Create Case]: Verify the behavior when the case agent is able to create a case when user has access to multiple companies for the single Line of Business', async () => {
            await navigationPage.signOut();
            await loginPage.login(`${twoCompanyUser.userId}@petramco.com`, 'Password_1234');
            await navigationPage.gotoCreateKnowledge();
            await createKnowledgePage.clickOnTemplate('Reference');
            await createKnowledgePage.clickOnUseSelectedTemplateButton();
            expect(await createKnowledgePage.getValueOfLineOFBusiness()).toBe('Human Resource');
            expect(await createKnowledgePage.isLineOfBusinessDisable()).toBeTruthy();
            expect(await createKnowledgePage.isValuePresentInDropdown('Knowledge Set', knowledgeSetDataHR.knowledgeSetTitle)).toBeTruthy('Failure: Knowledge Set is missing');
            expect(await createKnowledgePage.isValuePresentInDropdown('Knowledge Set', knowledgeSetDataFacilities.knowledgeSetTitle)).toBeFalsy('Failure: Knowledge Set is available');

            expect(await createKnowledgePage.isValuePresentInDropdown('Category Tier 1', 'Applications')).toBeTruthy('Failure: Operational Category 1 is missing');
            expect(await createKnowledgePage.isValuePresentInDropdown('Category Tier 1', 'Facilties')).toBeFalsy('Failure: Operational Category 1 is present');

            await createKnowledgePage.addTextInKnowlegeTitleField(`Title ${randomStr}`);
            await createKnowledgePage.selectKnowledgeSet('HR');
            await createKnowledgePage.selectCategoryTier1Option('Employee Relations');

            //Validating Assignment fields
            await createKnowledgePage.clickChangeAssignmentButton();
            await changeAssignmentBladePo.selectCompany('Petramco');
            expect(await changeAssignmentBladePo.isValuePresentInDropdown('Business Unit', 'Australia Support')).toBeTruthy();
            expect(await changeAssignmentBladePo.isValuePresentInDropdown('Business Unit', 'Facilities Support')).toBeFalsy();
            await changeAssignmentBladePo.selectBusinessUnit('Canada Support');
            expect(await changeAssignmentBladePo.isValuePresentInDropdown('Support Group', 'Petramco HR')).toBeTruthy();
            expect(await changeAssignmentBladePo.isValuePresentInDropdown('Support Group', 'Petramco Facilities')).toBeFalsy();
            await changeAssignmentBladePo.selectBusinessUnit('United States Support');
            await changeAssignmentBladePo.selectSupportGroup('US Support 3');
            expect(await changeAssignmentBladePo.isPersonAvailableOnAssignBlade(`${userData1.firstName} ${userData1.lastName}`)).toBeTruthy('User is not present on Assignment blade');
            expect(await changeAssignmentBladePo.isPersonAvailableOnAssignBlade(`${userData2.firstName} ${userData2.lastName}`)).toBeTruthy('User is present on Assignment blade');
            await changeAssignmentBladePo.clickOnCancelButton();

            //Saving the Article
            await createKnowledgePage.clickOnSaveKnowledgeButton();
            await previewKnowledgePo.clickGoToArticleButton();
            articleId = await viewKnowledgeArticlePo.getKnowledgeArticleId();
        });

        it('[DRDMV-23625]: [Operating Organization][Create Case]: Verify the behavior when the case agent is able to create a case when user has access to multiple companies for the single Line of Business', async () => {
            await viewKnowledgeArticlePo.clickEditKnowledgeMedataData();
            expect(await editKnowledgePo.getLineOfBusinessValue()).toBe('Human Resource');
            expect(await editKnowledgePo.isLobSectionEnabled()).toBeTruthy();
            await editKnowledgePo.cancelKnowledgeMedataDataChanges();
            await viewKnowledgeArticlePo.clickEditKnowledgeAccess();
            await accessTabPo.clickToExpandAccessEntitiySearch('Support Group Access', 'Knowledge');
            await accessTabPo.selectAccessEntityDropDown('Petramco', 'Select Company');
            expect(await accessTabPo.isValuePresentInDropdown('Business Unit', 'Australia Support')).toBeTruthy();
            expect(await accessTabPo.isValuePresentInDropdown('Business Unit', 'Facilities Support')).toBeFalsy();
            await accessTabPo.selectAccessEntityDropDown('Australia Support', 'Select Business Unit');
            expect(await accessTabPo.isValuePresentInDropdown('Support Group', 'Petramco HR')).toBeTruthy();
            expect(await accessTabPo.isValuePresentInDropdown('Support Group', 'Petramco Facilities')).toBeFalsy();

            await accessTabPo.clickToExpandAccessEntitiySearch('Agent Access', 'Knowledge');
            expect(await accessTabPo.isAgentPresent(userData1.firstName)).toBeTruthy('User is not Present');
            expect(await accessTabPo.isAgentPresent(userData2.firstName)).toBeFalsy('User is Present');
            await accessTabPo.clickCloseKnowledgeAccessBlade();

            await viewKnowledgeArticlePo.clickEditKnowledgeMedataData();
            expect(await createKnowledgePage.isValuePresentInDropdown('Category Tier 1', 'Applications')).toBeTruthy('Failure: Operational Category 1 is missing');
            expect(await createKnowledgePage.isValuePresentInDropdown('Category Tier 1', 'Facilties')).toBeFalsy('Failure: Operational Category 1 is present');
            await editKnowledgePo.setCategoryTier1('Payroll');
            await editKnowledgePo.saveKnowledgeMedataDataChanges();
            expect(await viewKnowledgeArticlePo.getCategoryTier1Value()).toBe('Payroll');

            await editKnowledgePo.setKnowledgeStatus('Draft');
            await editKnowledgePo.setKnowledgeStatusWithoutSave('SME Review');
            await statusBladeKnowledgeArticlePo.clickChangeReviewerBtn();
            await changeAssignmentBladePo.selectCompany('Petramco');
            expect(await changeAssignmentBladePo.isValuePresentInDropdown('Business Unit', 'Australia Support')).toBeTruthy();
            expect(await changeAssignmentBladePo.isValuePresentInDropdown('Business Unit', 'Facilities Support')).toBeFalsy();
            await changeAssignmentBladePo.selectBusinessUnit('Canada Support');
            expect(await changeAssignmentBladePo.isValuePresentInDropdown('Support Group', 'Petramco HR')).toBeTruthy();
            expect(await changeAssignmentBladePo.isValuePresentInDropdown('Support Group', 'Petramco Facilities')).toBeFalsy();
            await changeAssignmentBladePo.selectBusinessUnit('United States Support');
            await changeAssignmentBladePo.selectSupportGroup('US Support 3');
            expect(await changeAssignmentBladePo.isPersonAvailableOnAssignBlade(`${userData1.firstName} ${userData1.lastName}`)).toBeTruthy('User is not present on Assignment blade');
            expect(await changeAssignmentBladePo.isPersonAvailableOnAssignBlade(`${userData2.firstName} ${userData2.lastName}`)).toBeFalsy('User is present on Assignment blade');
            await changeAssignmentBladePo.clickOnCancelButton();

            await navigationPage.gotoKnowledgeConsole();
            expect(await utilityGrid.isGridRecordPresent(knowledgeArticleDataDiffLOB.title)).toBeFalsy('Record is present');

            await navigationPage.signOut();
            await loginPage.login('gwixillian');
            await navigationPage.gotoKnowledgeConsole();
            expect(await utilityGrid.isGridRecordPresent(articleId)).toBeFalsy(articleId + ' Record is present');
        });

        it('[DRDMV-23625]: [Operating Organization][Create Case]: Verify the behavior when the case agent is able to create a case when user has access to multiple companies for the single Line of Business', async () => {
            await navigationPage.signOut();
            await loginPage.login('ppeter');
            await navigationPage.gotoKnowledgeConsole();
            await utilityGrid.selectLineOfBusiness('Facilities');
            expect(await utilityGrid.isGridRecordPresent(articleId)).toBeFalsy(articleId + ' Record is present');
            await utilityGrid.selectLineOfBusiness('Human Resource');
            expect(await utilityGrid.isGridRecordPresent(articleId)).toBeTruthy(articleId + ' Record is not present');

            await navigationPage.signOut();
            await loginPage.login('qyuan');
            await navigationPage.gotoKnowledgeConsole();
            await utilityGrid.selectLineOfBusiness('Facilities');
            expect(await utilityGrid.isGridRecordPresent(articleId)).toBeFalsy(articleId + ' Record is present');
            await utilityGrid.selectLineOfBusiness('Human Resource');
            expect(await utilityGrid.isGridRecordPresent(articleId)).toBeTruthy(articleId + ' Record is not present');

            await navigationPage.signOut();
            await loginPage.login('monika');
            await navigationPage.gotoKnowledgeConsole();
            await utilityGrid.selectLineOfBusiness('Finance');
            expect(await utilityGrid.isGridRecordPresent(articleId)).toBeFalsy(articleId + ' Record is present');
            await utilityGrid.selectLineOfBusiness('Human Resource');
            expect(await utilityGrid.isGridRecordPresent(articleId)).toBeTruthy(articleId + ' Record is not present');
        });

        it('[DRDMV-23625]: [Operating Organization][Create Case]: Verify the behavior when the case agent is able to create a case when user has access to multiple companies for the single Line of Business', async () => {
            await navigationPage.signOut();
            await loginPage.login('ncage');
            await navigationPage.gotoCreateKnowledge();
            await utilityGrid.selectLineOfBusiness('Human Resource')
            await createKnowledgePage.clickOnTemplate('Reference');
            await createKnowledgePage.clickOnUseSelectedTemplateButton();
            await createKnowledgePage.addTextInKnowlegeTitleField('DRDMV23625');
            await createKnowledgePage.selectKnowledgeSet('HR');
            await createKnowledgePage.clickChangeAssignmentButton();
            expect(await changeAssignmentBladePo.isValuePresentInDropdown('Company', 'Psilon')).toBeFalsy();
            await changeAssignmentBladePo.clickOnCancelButton();
            await createKnowledgePage.clickOnSaveKnowledgeButton();
            await previewKnowledgePo.clickGoToArticleButton();
            await editKnowledgePo.setKnowledgeStatus('Draft');
            await editKnowledgePo.setKnowledgeStatusWithoutSave('SME Review');
            await statusBladeKnowledgeArticlePo.clickChangeReviewerBtn();
            expect(await changeAssignmentBladePo.isValuePresentInDropdown('Company', 'Psilon')).toBeFalsy();
            await utilityCommon.closeAllBlades();
        });


        afterAll(async () => {
            await navigationPage.signOut();
            await loginPage.login('qkatawazi');
        });
    });

});    