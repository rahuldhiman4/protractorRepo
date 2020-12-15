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
import utilCommon from '../../utils/util.common';
import consoleDefineLob from '../../pageobject/settings/lob/define-lob-config.po';
import defineLobCreate from '../../pageobject/settings/lob/create-lob-config.po';
import editLobConfig from '../../pageobject/settings/lob/edit-lob-config.po';
import changeAssignmentBlade from '../../pageobject/common/change-assignment-blade.po';
import editCasePage from '../../pageobject/case/edit-case.po';
import utilityGrid from '../../utils/utility.grid';
import { create } from 'domain';

describe('lob test file', () => {
    beforeAll(async () => {
        await browser.get(BWF_BASE_URL);
        await loginPage.login('qkatawazi');
    });

    afterAll(async () => {
        await utilityCommon.closeAllBlades();
        await navigationPage.signOut();
    });

    //asahitya
    describe('[DRDMV-23619]: Validate that tenant admin is able to create the LOB and upon LOB creation Domain Tag is created of LOB name in the Domain Tag registry', () => {
        let randomString: string = [...Array(4)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        let lobName = undefined;
        beforeAll(async () => {
            lobName = `q1W Name ${randomString}`;
            await apiHelper.apiLogin('tadmin');
            await apiHelper.deleteAllEmailConfiguration();
            await apiHelper.createEmailBox('incoming');
            let response1 = await apiHelper.createEmailBox('outgoing');
            await apiHelper.createEmailProfile(response1.id);
        });

        it('[DRDMV-23619]: Validate that tenant admin is able to create the LOB and upon LOB creation Domain Tag is created of LOB name in the Domain Tag registry', async () => {
            let lobConfigPageList = ['Define Line of Business', 'Manage Line of Business', 'Line of Business'];
            await navigationPage.signOut();
            await loginPage.login('tadmin');

            //Create LOB
            await navigationPage.gotoSettingsPage();
            expect(await navigationPage.isSettingSubMenusMatches("Line of Business", lobConfigPageList)).toBeTruthy("LOB config does not match");
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Line of Business--Define Line of Business', 'LOB Management Console - Business Workflows');
            await consoleDefineLob.clickAddLobBtn();
            expect(await defineLobCreate.isFieldPresent('Name')).toBeTruthy('Name is not Present');
            expect(await defineLobCreate.isFieldPresent('Outgoing Email Profile')).toBeTruthy('Outgoing Email Profile is not Present');
            expect(await defineLobCreate.isFieldPresent('Description')).toBeTruthy('Description is not Present');
            expect(await defineLobCreate.isFieldPresent('Status')).toBeTruthy('Status is not Present');
            expect(await defineLobCreate.isFieldPresent('Use as Default')).toBeTruthy('Use as Default is not Present');
            await defineLobCreate.setName(lobName);
            await defineLobCreate.setDescription(`q1@$W Description ${randomString}`);
            await defineLobCreate.setUseAsDefaultValue(false);
            await defineLobCreate.selectEmailOutgoingProfile('Email Profile for Outgoing');
            await defineLobCreate.saveLob();

            //View created LOB and Verify
            await utilGrid.clickOnGridRefreshButton();
            await browser.sleep(5000); //Waiting for Group Id to be reflected
            await utilGrid.searchAndOpenHyperlink(lobName);
            expect(await editLobConfig.getDescription()).toBe(`q1@$W Description ${randomString}`);
            expect(await editLobConfig.getName()).toBe(lobName);
            expect(await editLobConfig.getBundleName()).toContain(`com.petramco.`);
            await editLobConfig.clickOnCancelButton();
            expect((await consoleDefineLob.getColumnValueOfRecord('Group ID', lobName)).length).toBeGreaterThan(0);
        });
        it('[DRDMV-23619]: Validate that tenant admin is able to create the LOB and upon LOB creation Domain Tag is created of LOB name in the Domain Tag registry', async () => {
            await apiHelper.apiLogin('tadmin');
            expect((await coreApi.getDomainTagGuid(lobName)).length).toBeGreaterThan(0);
            expect((await coreApi.getFunctionalRoleGuid(lobName)).length).toBeGreaterThan(0);
            let domainTagData = {
                "domainTagName": `AccountsDomain123 ${randomString}`
            }
            await apiHelper.createDomainTag(domainTagData);
            await utilGrid.clickOnGridRefreshButton();
            await utilGrid.isGridRecordPresent(`AccountsDomain123 ${randomString}`);

            await consoleDefineLob.clickAddLobBtn();
            await defineLobCreate.setName(lobName);
            await defineLobCreate.setDescription(`q1@$W Description ${randomString}`);
            await defineLobCreate.setUseAsDefaultValue(false);
            await defineLobCreate.selectEmailOutgoingProfile('Email Profile for Outgoing');
            await defineLobCreate.saveLob();
            expect(await utilCommon.isPopUpMessagePresent('ERROR (10000): Line of Business with the given name already exists. Select a different name.')).toBeTruthy('Error message is not matching');
            await utilCommon.closeBladeOnSettings();

            let guid = await consoleDefineLob.getColumnValueOfRecord('Domain ID', lobName);
            expect(await coreApi.getDomainTagGuid(lobName)).toBe(guid);
        });

        afterAll(async () => {
            await navigationPage.signOut();
            await loginPage.login('qkatawazi');
        });
    });

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
            expect(await changeAssignmentBlade.isValuePresentInDropdown('Company', 'Psilon')).toBeFalsy();
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

});