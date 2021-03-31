import { browser } from "protractor";
import coreApi from '../../api/api.core.util';
import apiHelper from '../../api/api.helper';
import previewCasePage from '../../pageobject/case/case-preview.po';
import createCasePo from '../../pageobject/case/create-case.po';
import editCasePo from '../../pageobject/case/edit-case.po';
import quickCasePo from '../../pageobject/case/quick-case.po';
import selectCasetemplateBladePo from '../../pageobject/case/select-casetemplate-blade.po';
import viewCasePage from '../../pageobject/case/view-case.po';
import accessTabPo from '../../pageobject/common/access-tab.po';
import changeAssignmentBladePo from '../../pageobject/common/change-assignment.po';
import loginPage from "../../pageobject/common/login.po";
import navigationPage from "../../pageobject/common/navigation.po";
import { BWF_BASE_URL } from '../../utils/constants';
import utilityCommon from '../../utils/utility.common';
import utilityGrid from '../../utils/utility.grid';

let supportGroupDataHR, supportGroupDataFacilities, userData0, userData1, userData2, userData3;

xdescribe('Operating Orgnization Data Model Tests', () => {
    let personDataFile = require('../../data/ui/foundation/person.ui.json');
    beforeAll(async () => {
        await browser.get(BWF_BASE_URL);
        await loginPage.login('qkatawazi');
        await createFoundationDataForAssigneeValidations();
    });

    afterAll(async () => {
        await utilityCommon.closeAllBlades();
        await navigationPage.signOut();
    });

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
    describe('[60201]: [Operating Organization][Create Case]: Verify the behavior when the case agent is able to create a case when user has access to multiple companies for the single Line of Business', () => {
        let randomStr: string = [...Array(4)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        let twoCompanyUser;
        let caseTemplateDataPetramcoHR = {
            "templateName": '60201 Name HR' + randomStr,
            "templateSummary": '60201 Summary HR' + randomStr,
            "templateStatus": "Active",
            "company": "Petramco",
            "businessUnit": "United States Support",
            "supportGroup": "US Support 3",
            "ownerBU": "United States Support",
            "ownerGroup": "US Support 3",
            "lineOfBusiness": "Human Resource"
        }
        let caseTemplateDataPetramcoFacilities = {
            "templateName": '60201 Name Facilities' + randomStr,
            "templateSummary": '60201 Summary Facilities' + randomStr,
            "templateStatus": "Active",
            "company": "Petramco",
            "businessUnit": "Facilities Support",
            "supportGroup": "Facilities",
            "ownerBU": "Facilities Support",
            "ownerGroup": "Facilities",
            "lineOfBusiness": "Facilities"
        }
        let caseTemplateDataGlobalHR = {
            "templateName": '60201 Name HR' + randomStr,
            "templateSummary": '60201 Summary HR' + randomStr,
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
            "templateName": '60201 Name Facilities' + randomStr,
            "templateSummary": '60201 Summary Facilities' + randomStr,
            "templateStatus": "Active",
            "company": "- Global -",
            "ownerBU": "Facilities Support",
            "ownerGroup": "Facilities",
            "lineOfBusiness": "Facilities"
        }
        let caseTemplateDataPsilonHR = {
            "templateName": '60201 Name Psilon HR' + randomStr,
            "templateSummary": '60201 Summary Psilon HR' + randomStr,
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

        it('[60201]: [Operating Organization][Create Case]: Verify the behavior when the case agent is able to create a case when user has access to multiple companies for the single Line of Business', async () => {
            await navigationPage.signOut();
            await loginPage.login('qtao');
            await navigationPage.gotoCreateCase();
            expect(await createCasePo.getLineOfBusinessValue()).toBe('Human Resource');
            await createCasePo.selectRequester('qfeng');
            expect(await createCasePo.getLineOfBusinessLabel()).toBe('Line of Business');
            expect(await createCasePo.getLineOfBusinessValue()).toBe('Human Resource');
            expect(await createCasePo.isLineOfBusinessDisabled()).toBeTruthy('LOB field is editable');
            expect(await createCasePo.isValuePresentInDropdown('Category Tier 1', 'Applications')).toBeTruthy('Applications is not present in Catgory Tier 1 dropdown');
            expect(await createCasePo.isValuePresentInDropdown('Category Tier 1', 'Facilities')).toBeFalsy('Facilities is present in Catgory Tier 1 dropdown');
            await createCasePo.clickChangeAssignmentButton();
            expect(await changeAssignmentBladePo.isValuePresentInDropDown("AssignedGroup", 'Petramco HR')).toBeTruthy();
            expect(await changeAssignmentBladePo.isValuePresentInDropDown("AssignedGroup", 'Petramco Facilities')).toBeFalsy();
            await changeAssignmentBladePo.setDropDownValue('AssignedGroup', 'US Support 3');
            expect(await changeAssignmentBladePo.isPersonAvailableOnAssignBlade(`${userData0.firstName} ${userData0.lastName}`)).toBeTruthy('User is not present on Assignment blade');
            expect(await changeAssignmentBladePo.isPersonAvailableOnAssignBlade(`${userData2.firstName} ${userData2.lastName}`)).toBeFalsy('User is present on Assignment blade');
            await changeAssignmentBladePo.clickOnCancelButton();
            await createCasePo.setSummary('DRDMV23621');
            await createCasePo.clickSaveCaseButtonWithoutMessageDisappear();
            expect(await utilityCommon.isPopUpMessagePresent('Saved successfully.')).toBeTruthy('Successful message is not appeared');
            await previewCasePage.clickGoToCaseButton();
            caseId = await viewCasePage.getCaseID();
        });

        it('[60201]: [Operating Organization][Create Case]: Verify the behavior when the case agent is able to create a case when user has access to multiple companies for the single Line of Business', async () => {
            await navigationPage.gotoCreateCase();
            await createCasePo.selectRequester('qfeng');
            await createCasePo.clickSelectCaseTemplateButton();
            await selectCasetemplateBladePo.clickOnAllTemplateTab();
            expect(await utilityGrid.isGridRecordPresent(caseTemplateDataPetramcoHR.templateName)).toBeTruthy(`${caseTemplateDataPetramcoHR.templateName} is not present`);
            expect(await utilityGrid.isGridRecordPresent(caseTemplateDataPetramcoFacilities.templateName)).toBeFalsy(`${caseTemplateDataPetramcoFacilities.templateName} is present`);
            expect(await utilityGrid.isGridRecordPresent(caseTemplateDataGlobalHR.templateName)).toBeTruthy(`${caseTemplateDataPetramcoHR.templateName} is not present`);
            expect(await utilityGrid.isGridRecordPresent(caseTemplateDataGlobalFacilities.templateName)).toBeFalsy(`${caseTemplateDataPetramcoFacilities.templateName} is present`);
            await selectCasetemplateBladePo.selectCaseTemplate(caseTemplateDataPetramcoHR.templateName);
            await createCasePo.clickSaveCaseButtonWithoutMessageDisappear();
            expect(await utilityCommon.isPopUpMessagePresent('Saved successfully.')).toBeTruthy('Successful message is not appeared');
            expect(await previewCasePage.getLineOfBusinessValue()).toBe('Human Resource');
            await previewCasePage.clickGoToCaseButton();
            expect(await viewCasePage.getLineOfBusinessValue()).toBe('Human Resource');
            await viewCasePage.clickEditCaseButton();
            expect(await editCasePo.isLineOfBusinessReadOnly()).toBeTruthy('Lob section is enabled on Case Edit screen');
            expect(await editCasePo.getLobValue()).toBe('Human Resource');
            expect(await editCasePo.isValuePresentInCategoryTier1('Payroll')).toBeTruthy();
            expect(await editCasePo.isValuePresentInCategoryTier1('Facilities')).toBeFalsy();
            await editCasePo.clickOnChangeCaseTemplate();
            await selectCasetemplateBladePo.selectCaseTemplate(caseTemplateDataGlobalHR.templateName);
            await editCasePo.clickSaveCase();
            expect(await viewCasePage.getCategoryTier1Value()).toBe('Payroll');
            expect(await viewCasePage.getCategoryTier2Value()).toBe('Finance');
            expect(await viewCasePage.getCategoryTier3Value()).toBe('Reporting');

            await editCasePo.clickChangeAssignmentButton();
            expect(await changeAssignmentBladePo.isValuePresentInDropDown("AssignedGroup", 'Petramco HR')).toBeTruthy();
            expect(await changeAssignmentBladePo.isValuePresentInDropDown("AssignedGroup", 'Petramco Facilities')).toBeFalsy();
            await changeAssignmentBladePo.setDropDownValue('AssignedGroup', 'US Support 3');
            expect(await changeAssignmentBladePo.isPersonAvailableOnAssignBlade(`${userData0.firstName} ${userData0.lastName}`)).toBeTruthy('User is not present on Assignment blade');
            expect(await changeAssignmentBladePo.isPersonAvailableOnAssignBlade(`${userData2.firstName} ${userData2.lastName}`)).toBeFalsy('User is present on Assignment blade');
            await changeAssignmentBladePo.clickOnCancelButton();
        });

        it('[60201]: [Operating Organization][Create Case]: Verify the behavior when the case agent is able to create a case when user has access to multiple companies for the single Line of Business', async () => {
            await navigationPage.signOut();
            await loginPage.login('fritz');
            expect(await utilityGrid.isGridRecordPresent(caseId)).toBeFalsy();

            await navigationPage.signOut();
            await loginPage.login('gderuno');
            expect(await utilityGrid.isGridRecordPresent(caseId)).toBeFalsy();

            await navigationPage.signOut();
            await loginPage.login(twoCompanyUser.userId + '@petramco.com', 'Password_1234');
            await navigationPage.gotoCreateCase();
            await createCasePo.selectRequester('qfeng');
            await createCasePo.clickSelectCaseTemplateButton();
            await selectCasetemplateBladePo.clickOnAllTemplateTab();
            expect(await utilityGrid.isGridRecordPresent(caseTemplateDataPsilonHR.templateName)).toBeFalsy(`${caseTemplateDataPetramcoHR.templateName} is not present`);
            expect(await utilityGrid.isGridRecordPresent(caseTemplateDataPetramcoHR.templateName)).toBeTruthy(`${caseTemplateDataPetramcoHR.templateName} is not present`);
            expect(await utilityGrid.isGridRecordPresent(caseTemplateDataPetramcoFacilities.templateName)).toBeFalsy(`${caseTemplateDataPetramcoFacilities.templateName} is present`);
            expect(await utilityGrid.isGridRecordPresent(caseTemplateDataGlobalHR.templateName)).toBeTruthy(`${caseTemplateDataPetramcoHR.templateName} is not present`);
            expect(await utilityGrid.isGridRecordPresent(caseTemplateDataGlobalFacilities.templateName)).toBeFalsy(`${caseTemplateDataPetramcoFacilities.templateName} is present`);
            await selectCasetemplateBladePo.selectCaseTemplate(caseTemplateDataPetramcoHR.templateName);
            await createCasePo.clickSaveCaseButton();

            await previewCasePage.clickGoToCaseButton();
            await viewCasePage.clickEditCaseButton();
            await editCasePo.clickOnChangeCaseTemplate();
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
    describe('[60228]: [Operating Organization][Create Case]: Verify the behavior when the case agent is able to create a case when it has access to multiple LOB', () => {
        let caseId = undefined;
        let randomStr: string = [...Array(4)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        let caseTemplateDataPetramcoHR = {
            "templateName": randomStr + '60201 Name HR',
            "templateSummary": '60201 Summary HR' + randomStr,
            "templateStatus": "Active",
            "company": "Petramco",
            "businessUnit": "United States Support",
            "supportGroup": "US Support 3",
            "ownerBU": "United States Support",
            "ownerGroup": "US Support 3",
            "lineOfBusiness": "Human Resource"
        }
        let caseTemplateDataPetramcoFacilities = {
            "templateName": randomStr + '60201 Name Facilities',
            "templateSummary": '60201 Summary Facilities' + randomStr,
            "templateStatus": "Active",
            "company": "Petramco",
            "businessUnit": "Facilities Support",
            "supportGroup": "Facilities",
            "ownerBU": "Facilities Support",
            "ownerGroup": "Facilities",
            "lineOfBusiness": "Facilities"
        }
        let caseTemplateDataGlobalHR = {
            "templateName": randomStr + '60201NameHRGloabl',
            "templateSummary": '60201 Summary HR' + randomStr,
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
            "templateName": randomStr + '60201 Name Facilities',
            "templateSummary": '60201 Summary Facilities' + randomStr,
            "templateStatus": "Active",
            "company": "- Global -",
            "businessUnit": "Facilities Support",
            "supportGroup": "Facilities",
            "ownerBU": "Facilities Support",
            "ownerGroup": "Facilities",
            "lineOfBusiness": "Facilities"
        }
        let caseTemplateDataPsilon = {
            "templateName": randomStr + '60201 Name Psilon',
            "templateSummary": '60201 Summary Psilon' + randomStr,
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
        it('[60228]: [Operating Organization][Create Case]: Verify the behavior when the case agent is able to create a case when it has access to multiple LOB', async () => {
            await navigationPage.gotoCreateCase();
            expect(await createCasePo.getLineOfBusinessValue()).toBe('Human Resource');
            await createCasePo.selectRequester('qtao');
            expect(await createCasePo.getLineOfBusinessLabel()).toBe('Line of Business');
            expect(await createCasePo.getLineOfBusinessValue()).toBe('Human Resource');
            expect(await createCasePo.isLineOfBusinessDisabled()).toBeTruthy('LOB field is not editable');
            expect(await createCasePo.isValuePresentInDropdown('Category Tier 1', 'Applications')).toBeTruthy('Facilities is not present in Catgory Tier 1 dropdown');
            expect(await createCasePo.isValuePresentInDropdown('Category Tier 1', 'Facilities')).toBeFalsy('Applications is present in Catgory Tier 1 dropdown');
            await createCasePo.clickChangeAssignmentButton();
            expect(await changeAssignmentBladePo.isValuePresentInDropDown("AssignedGroup", 'Petramco HR')).toBeTruthy();
            expect(await changeAssignmentBladePo.isValuePresentInDropDown("AssignedGroup", 'Petramco Facilities')).toBeFalsy();
            await changeAssignmentBladePo.setDropDownValue('AssignedGroup', 'US Support 3');
            expect(await changeAssignmentBladePo.isPersonAvailableOnAssignBlade(`${userData0.firstName} ${userData0.lastName}`)).toBeTruthy('User is not present on Assignment blade');
            expect(await changeAssignmentBladePo.isPersonAvailableOnAssignBlade(`${userData2.firstName} ${userData2.lastName}`)).toBeFalsy('User is present on Assignment blade');
            await changeAssignmentBladePo.clickOnCancelButton();

            await createCasePo.setSummary('DRDMV23608');
            await createCasePo.clickSaveCaseButtonWithoutMessageDisappear();
            expect(await utilityCommon.isPopUpMessagePresent('Saved successfully.')).toBeTruthy('Successful message is not appeared');
            await previewCasePage.clickGoToCaseButton();
            caseId = await viewCasePage.getCaseID();
        });

        it('[60228]: [Operating Organization][Create Case]: Verify the behavior when the case agent is able to create a case when it has access to multiple LOB', async () => {
            await navigationPage.gotoCreateCase();
            await createCasePo.selectRequester('qfeng');
            await createCasePo.clickSelectCaseTemplateButton();
            await selectCasetemplateBladePo.clickOnAllTemplateTab();
            expect(await utilityGrid.isGridRecordPresent(caseTemplateDataPetramcoHR.templateName)).toBeTruthy(`${caseTemplateDataPetramcoHR.templateName} is not present`);
            expect(await utilityGrid.isGridRecordPresent(caseTemplateDataPetramcoFacilities.templateName)).toBeFalsy(`${caseTemplateDataPetramcoFacilities.templateName} is present`);
            expect(await utilityGrid.isGridRecordPresent(caseTemplateDataGlobalHR.templateName)).toBeTruthy(`${caseTemplateDataPetramcoHR.templateName} is not present`);
            expect(await utilityGrid.isGridRecordPresent(caseTemplateDataGlobalFacilities.templateName)).toBeFalsy(`${caseTemplateDataPetramcoFacilities.templateName} is present`);
            await selectCasetemplateBladePo.selectCaseTemplate(caseTemplateDataPetramcoHR.templateName);
            await createCasePo.clickSaveCaseButtonWithoutMessageDisappear();
            expect(await utilityCommon.isPopUpMessagePresent('Saved successfully.')).toBeTruthy('Successful message is not appeared');
            expect(await previewCasePage.getLineOfBusinessValue()).toBe('Human Resource');
            await previewCasePage.clickGoToCaseButton();
            expect(await viewCasePage.getLineOfBusinessValue()).toBe('Human Resource');
            await viewCasePage.clickEditCaseButton();
            expect(await editCasePo.isLineOfBusinessReadOnly()).toBeTruthy('Lob section is enabled on Case Edit screen');
            expect(await editCasePo.getLobValue()).toBe('Human Resource');
            expect(await editCasePo.isValuePresentInCategoryTier1('Payroll')).toBeTruthy();
            expect(await editCasePo.isValuePresentInCategoryTier1('Facilities')).toBeFalsy();
            await editCasePo.clickOnChangeCaseTemplate();
            await selectCasetemplateBladePo.selectCaseTemplate(caseTemplateDataGlobalHR.templateName);
            await editCasePo.clickSaveCase();
            expect(await viewCasePage.getCategoryTier1Value()).toBe('Payroll');
            expect(await viewCasePage.getCategoryTier2Value()).toBe('Finance');
            expect(await viewCasePage.getCategoryTier3Value()).toBe('Reporting');

            await viewCasePage.clickEditCaseButton();
            await editCasePo.clickChangeAssignmentButton();
            await changeAssignmentBladePo.setDropDownValue("Assignee", 'None');
            expect(await changeAssignmentBladePo.isValuePresentInDropDown("AssignedGroup", 'Petramco HR')).toBeTruthy();
            expect(await changeAssignmentBladePo.isValuePresentInDropDown("AssignedGroup", 'Petramco Facilities')).toBeFalsy();
            await changeAssignmentBladePo.setDropDownValue('AssignedGroup', 'US Support 3');
            expect(await changeAssignmentBladePo.isPersonAvailableOnAssignBlade(`${userData0.firstName} ${userData0.lastName}`)).toBeTruthy('User is not present on Assignment blade');
            expect(await changeAssignmentBladePo.isPersonAvailableOnAssignBlade(`${userData2.firstName} ${userData2.lastName}`)).toBeFalsy('User is present on Assignment blade');
            await changeAssignmentBladePo.clickOnCancelButton();
        });

        it('[60228]: [Operating Organization][Create Case]: Verify the behavior when the case agent is able to create a case when it has access to multiple LOB', async () => {
            await navigationPage.signOut();
            await loginPage.login('qliu');
            await navigationPage.gotoCreateCase();
            await createCasePo.selectRequester('qfeng');
            await createCasePo.clickSelectCaseTemplateButton();
            await selectCasetemplateBladePo.clickOnAllTemplateTab();
            expect(await utilityGrid.isGridRecordPresent(caseTemplateDataPetramcoHR.templateName)).toBeTruthy(`${caseTemplateDataPetramcoHR.templateName} is not present`);
            expect(await utilityGrid.isGridRecordPresent(caseTemplateDataPsilon.templateName)).toBeFalsy(`${caseTemplateDataPsilon.templateName} is not present`);
            expect(await utilityGrid.isGridRecordPresent(caseTemplateDataPetramcoFacilities.templateName)).toBeFalsy(`${caseTemplateDataPetramcoFacilities.templateName} is present`);
            expect(await utilityGrid.isGridRecordPresent(caseTemplateDataGlobalHR.templateName)).toBeTruthy(`${caseTemplateDataGlobalHR.templateName} is not present`);
            expect(await utilityGrid.isGridRecordPresent(caseTemplateDataGlobalFacilities.templateName)).toBeFalsy(`${caseTemplateDataGlobalFacilities.templateName} is present`);
            await selectCasetemplateBladePo.selectCaseTemplate(caseTemplateDataPetramcoHR.templateName);

            await createCasePo.clickChangeAssignmentButton();
            await changeAssignmentBladePo.setDropDownValue("Assignee", 'None');
            await changeAssignmentBladePo.clickOnCancelButton();
            await createCasePo.clickSaveCaseButton();

            await previewCasePage.clickGoToCaseButton();
            await viewCasePage.clickEditCaseButton();
            await editCasePo.clickOnChangeCaseTemplate();
            await selectCasetemplateBladePo.clickOnAllTemplateTab();
            expect(await utilityGrid.isGridRecordPresent(caseTemplateDataPsilon.templateName)).toBeFalsy(`${caseTemplateDataPetramcoHR.templateName} is not present`);
            expect(await utilityGrid.isGridRecordPresent(caseTemplateDataPetramcoHR.templateName)).toBeTruthy(`${caseTemplateDataPetramcoHR.templateName} is not present`);
            expect(await utilityGrid.isGridRecordPresent(caseTemplateDataPetramcoFacilities.templateName)).toBeFalsy(`${caseTemplateDataPetramcoFacilities.templateName} is present`);
            expect(await utilityGrid.isGridRecordPresent(caseTemplateDataGlobalHR.templateName)).toBeTruthy(`${caseTemplateDataPetramcoHR.templateName} is not present`);
            expect(await utilityGrid.isGridRecordPresent(caseTemplateDataGlobalFacilities.templateName)).toBeFalsy(`${caseTemplateDataPetramcoFacilities.templateName} is present`);
            await selectCasetemplateBladePo.selectCaseTemplate(caseTemplateDataGlobalHR.templateName);
        });

        it('[60228]: [Operating Organization][Create Case]: Verify the behavior when the case agent is able to create a case when it has access to multiple LOB', async () => {
            await navigationPage.signOut();
            await loginPage.login('qyuan');
            await navigationPage.gotoCreateCase();
            await createCasePo.selectRequester('qtao');
            await createCasePo.selectLineOfBusiness('Human Resource');
            await createCasePo.setSummary('xyz' + randomStr);
            await createCasePo.selectCategoryTier1('Total Rewards');
            await createCasePo.selectCategoryTier2('Benefits');
            await createCasePo.selectCategoryTier3('Annual Merit');
            await createCasePo.clickChangeAssignmentButton();
            await changeAssignmentBladePo.setAssignee('AU Support 1', "RA3 Liu");
            await createCasePo.selectLineOfBusiness('Facilities');
            let emptyStr = 'Select';
            expect(await createCasePo.getCategoryTier1Value()).toBe(emptyStr);
            expect(await createCasePo.getCategoryTier2Value()).toBe(emptyStr);
            expect(await createCasePo.getCategoryTier3Value()).toBe(emptyStr);
            expect(await createCasePo.getAssigneeBusinessUnitValue()).toBe('');
            expect(await createCasePo.getAssigneeGroupValue()).toBe('');
            expect(await createCasePo.getAssigneeValue()).toBe(emptyStr);

            await createCasePo.selectLineOfBusiness('Human Resource');
            await createCasePo.selectCategoryTier1('Total Rewards');
            await createCasePo.clickChangeAssignmentButton();
            await changeAssignmentBladePo.setAssignee('IN Support 1', "Qing Yuan");
            await createCasePo.clickSaveCaseButton();
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

    describe('[12083]:[Operating Organization][Create Case]: Verify the behavior when the case agent is able to create a case when it has access to single LOB', async () => {
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
        it('[12083]:[Operating Organization][Create Case]: Verify the behavior when the case agent is able to create a case when it has access to single LOB', async () => {
            await navigationPage.signOut();
            await loginPage.login('fritz');
            await navigationPage.gotoCreateCase();
            await createCasePo.selectRequester('adam');
            expect(await createCasePo.isLineOfBusinessDisabled()).toBeTruthy('Line of Buisness Field is Enabled');
            expect(await createCasePo.getLineOfBusinessValue()).toBe('Facilities', 'Line of Buisness Field is Enabled');
            await createCasePo.setSummary('12063Summary' + randomStr);
            expect(await createCasePo.isValuePresentInDropdown("Category Tier 1", 'Employee Relations')).toBeFalsy('Value is present in  Category Tier 1 drop down');
            await createCasePo.clickAssignToMeButton();
            expect(await createCasePo.isValuePresentInDropdown("Category Tier 1", 'Facilities')).toBeTruthy('Value is present in  Category Tier 1 drop down');
            await createCasePo.setPriority('Low');
            await createCasePo.selectCategoryTier1("Facilities");
            await createCasePo.selectCategoryTier2("Conference Room");
            await createCasePo.selectCategoryTier3("Furniture");
            await createCasePo.selectCategoryTier4("Chair");
            expect(await createCasePo.getCategoryTier1Value()).toBe('Facilities');
            expect(await createCasePo.getCategoryTier2Value()).toBe('Conference Room');
            expect(await createCasePo.getCategoryTier3Value()).toBe('Furniture');
            expect(await createCasePo.getCategoryTier4Value()).toBe('Chair');
        });
        it('[12083]:[Operating Organization][Create Case]: Verify the behavior when the case agent is able to create a case when it has access to single LOB', async () => {
            await createCasePo.clickChangeAssignmentButton();
            expect(await changeAssignmentBladePo.isValuePresentInDropDown("AssignedGroup", 'United States Support')).toBeFalsy();
            await changeAssignmentBladePo.clickOnCancelButton();
            await createCasePo.clickChangeAssignmentButton();
            expect(await changeAssignmentBladePo.isValuePresentInDropDown("AssignedGroup", 'Facilities Support')).toBeTruthy();
            await changeAssignmentBladePo.clickOnCancelButton();
            await createCasePo.clickSaveCaseButton();
            await previewCasePage.clickGoToCaseButton();
            await viewCasePage.clickEditCaseButton();
            await editCasePo.clickOnSelectCaseTemplate();
            await selectCasetemplateBladePo.selectCaseTemplate(caseTemplateDataFacilities.templateName);
            await editCasePo.clickSaveCase();
            expect(await viewCasePage.getCaseTemplateText()).toBe(caseTemplateDataFacilities.templateName);
            expect(await viewCasePage.getLineOfBusinessValue()).toBe('Facilities');
        });
        it('[12083]:[Operating Organization][Create Case]: Verify the behavior when the case agent is able to create a case when it has access to single LOB', async () => {
            await viewCasePage.clickEditCaseButton();
            expect(await editCasePo.isValuePresentInDropdown("Category Tier 1", 'Employee Relations')).toBeFalsy('Value is present in  Category Tier 1 drop down');
            expect(await editCasePo.isLineOfBusinessReadOnly()).toBeTruthy('Field is enabled');
            await editCasePo.updateCasePriority('High');
            await editCasePo.updateCaseCategoryTier1('Phones');
            await editCasePo.updateCaseCategoryTier2('Cellular Phones');
            await editCasePo.updateCaseCategoryTier3('Service');
            await editCasePo.clickChangeAssignmentButton();
            expect(await changeAssignmentBladePo.isValuePresentInDropDown("AssignedGroup", 'United States Support')).toBeFalsy();
            await changeAssignmentBladePo.clickOnCancelButton();
            await editCasePo.clickChangeAssignmentButton();
            await changeAssignmentBladePo.setDropDownValue('AssignedGroup', 'Pantry Service');
            await changeAssignmentBladePo.setDropDownValue('Assignee', 'Qing Yuan');
            await changeAssignmentBladePo.clickOnAssignButton();
            await editCasePo.clickSaveCase();
            expect(await viewCasePage.getCategoryTier1Value()).toBe('Phones');
            expect(await viewCasePage.getCategoryTier2Value()).toBe('Cellular Phones');
            expect(await viewCasePage.getCategoryTier3Value()).toBe('Service');
            expect(await viewCasePage.getAssignedGroupValue()).toBe("Pantry Service");
            expect(await viewCasePage.getAssigneeText()).toBe("Qing Yuan");
        });
        it('[12083]:[Operating Organization][Create Case]: Verify the behavior when the case agent is able to create a case when it has access to single LOB', async () => {
            await viewCasePage.clickOnTab('Case Access');
            await accessTabPo.clickToExpandAccessEntitiySearch('Support Group Access', 'Case');
            expect(await accessTabPo.isOptionsPresent('Pantry Service', 'Select Support Group')).toBeFalsy();
            await accessTabPo.clickToExpandAccessEntitiySearch('Support Group Access', 'Case');
            await accessTabPo.clickToExpandAccessEntitiySearch('Support Group Access', 'Case');
            await accessTabPo.selectAccessEntityDropDown('Pantry Service', 'Select Support Group');
            await accessTabPo.clickAccessEntitiyAddButton('Support Group');
            expect(await accessTabPo.isAccessTypeOfEntityDisplayed('Pantry Service', 'Read')).toBeTruthy('FailuerMsg1: Support Group is missing');
            await accessTabPo.clickToExpandAccessEntitiySearch('Support Group Access', 'Confidential Group');
            expect(await accessTabPo.isOptionsPresent(confidentialSupportGroup, 'Select Support Group', true)).toBeFalsy();
        });
        it('[12083]:[Operating Organization][Create Case]: Verify the behavior when the case agent is able to create a case when it has access to single LOB', async () => {
            await navigationPage.signOut();
            await loginPage.login('qkatawazi');
            await utilityGrid.clearFilter();
            await utilityGrid.searchRecord('12063Summary' + randomStr);
            expect(await utilityGrid.isGridRecordPresent('12063Summary' + randomStr)).toBeFalsy('12063Summary' + randomStr);
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
        it('[12083]:[Operating Organization][Create Case]: Verify the behavior when the case agent is able to create a case when it has access to single LOB', async () => {
            await navigationPage.signOut();
            await loginPage.login('oprusr@petramco.com', 'Password_1234');
            await utilityGrid.clearFilter();
            expect(await utilityGrid.isGridRecordPresent('12063Summary' + randomStr)).toBeTruthy('12063Summary' + randomStr);
            await apiHelper.apiLogin('tadmin');
            await apiHelper.deleteFoundationEntity("oprusr", { functionalRole: "Case Agent,Case Business Analyst,Knowledge Publisher" });
            await navigationPage.gotoQuickCase();
            await navigationPage.gotoCaseConsole();
            await utilityGrid.clearFilter();
            expect(await utilityGrid.isGridRecordPresent('12063Summary' + randomStr)).toBeFalsy('12063Summary' + randomStr);
        });
    });
});
