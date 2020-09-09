import { browser } from "protractor";
import apiHelper from "../../api/api.helper";
import localizeValuePopPo from '../../pageobject/common/localize-value-pop.po';
import loginPage from "../../pageobject/common/login.po";
import navigationPage from "../../pageobject/common/navigation.po";
import createMenuItemsBladePo from '../../pageobject/settings/application-config/create-menu-items-blade.po';
import imagePropertiesPo from '../../pageobject/settings/common/image-properties.po';
import createDocumentTemplatePo from '../../pageobject/settings/document-management/create-document-template.po';
import documentTemplateConsolePo from '../../pageobject/settings/document-management/document-template-console.po';
import editDocumentTemplatePo from '../../pageobject/settings/document-management/edit-document-template.po';
import { BWF_BASE_URL } from '../../utils/constants';
import utilCommon from '../../utils/util.common';
import utilityCommon from '../../utils/utility.common';
import addFieldsPopPo from '../../pageobject/common/add-fields-pop.po';

describe('Document Template', () => {
    beforeAll(async () => {
        await browser.get(BWF_BASE_URL);
        await loginPage.login('qkatawazi');
    });

    afterAll(async () => {
        await utilityCommon.closeAllBlades();
        await navigationPage.signOut();
    });

    //kgaikwad
    describe('[DRDMV-14970,DRDMV-14974,DRDMV-14971,DRDMV-14972]: Verify Document template creation with Case business analyst', async () => {
        let randomStr = [...Array(10)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        let templateRandVal1 = 'templateRandVal1' + randomStr;
        let templateRandVal2 = 'templateRakndVal2' + randomStr;
        let description1 = 'description1' + randomStr;
        let description2 = 'description2' + randomStr;
        let documentBody1 = 'documentBody1' + randomStr;
        let documentBody2 = 'documentBody2' + randomStr;
        let labelRandVal1 = 'labelRandVal1' + randomStr;
        let labelRandVal2 = 'labelRandVal2' + randomStr;
        it('[DRDMV-14970,DRDMV-14974,DRDMV-14971,DRDMV-14972]: Create Menu item label', async () => {
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Application Configuration--Menu Items', 'Menu Items - Business Workflows');
            await createMenuItemsBladePo.clickOnMenuOptionLink();
            await createMenuItemsBladePo.selectMenuNameDropDown('Label');
            await createMenuItemsBladePo.clickOnLocalizeLink();
            await localizeValuePopPo.setLocalizeValue(labelRandVal1);
            await localizeValuePopPo.clickOnSaveButton();
            await createMenuItemsBladePo.selectStatusDropDown('Active');
            await createMenuItemsBladePo.selectAvailableOnUiToggleButton(true);
            await createMenuItemsBladePo.clickOnSaveButton();
            await createMenuItemsBladePo.clickOnMenuOptionLink();
            await createMenuItemsBladePo.selectMenuNameDropDown('Label');
            await createMenuItemsBladePo.clickOnLocalizeLink();
            await localizeValuePopPo.setLocalizeValue(labelRandVal2);
            await localizeValuePopPo.clickOnSaveButton();
            await createMenuItemsBladePo.selectStatusDropDown('Active');
            await createMenuItemsBladePo.selectAvailableOnUiToggleButton(true);
            await createMenuItemsBladePo.clickOnSaveButton();
        });
        it('[DRDMV-14970,DRDMV-14974,DRDMV-14971,DRDMV-14972]: Create document template', async () => {
            await navigationPage.gotoCaseConsole();
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Document Management--Templates', 'Document Templates - Business Workflows');
            await createDocumentTemplatePo.clickOnAddTemplate();
            expect(await createDocumentTemplatePo.isSaveButtonEnabled()).toBeFalsy('Save button is enabled');
            await createDocumentTemplatePo.setTemplateName(templateRandVal1);
            await createDocumentTemplatePo.setCompany('Petramco');
            await createDocumentTemplatePo.selectLabelDropDown(labelRandVal1);
            await createDocumentTemplatePo.setDescription(description1);
            await createDocumentTemplatePo.setDocumentBody(documentBody1);
            await createDocumentTemplatePo.clickOnDocumentBodyImageButton();
            await imagePropertiesPo.addImg('Upload', '../../../data/ui/attachment/articleStatus.png');
            await createDocumentTemplatePo.clickOnSaveButton();
            await createDocumentTemplatePo.clickOnAddTemplate();
            await createDocumentTemplatePo.setTemplateName(templateRandVal2);
            expect(await createDocumentTemplatePo.isSaveButtonEnabled()).toBeFalsy('Save button is enabled');
            await createDocumentTemplatePo.setCompany('- Global -');
            await createDocumentTemplatePo.selectLabelDropDown(labelRandVal1);
            await createDocumentTemplatePo.setDescription(description1);
            await createDocumentTemplatePo.setDocumentBody(documentBody1);
            await createDocumentTemplatePo.clickOnSaveButton();
        });
        it('[DRDMV-14970,DRDMV-14974,DRDMV-14971,DRDMV-14972]: Validation of document template', async () => {
            await documentTemplateConsolePo.searchAndOpenDocumentTemplate(templateRandVal1);
            expect(await editDocumentTemplatePo.isTemplateNameDisplayed(templateRandVal1)).toBeTruthy('Template Name is missing');
            expect(await editDocumentTemplatePo.isCompanyNameDisplayed('Petramco')).toBeTruthy('Petramco Company Name is missing');
            expect(await editDocumentTemplatePo.isLabelValueDisplayed(labelRandVal1)).toBeTruthy('label is missing');
            expect(await editDocumentTemplatePo.isDescriptionValueDisplayed(description1)).toBeTruthy('Description Name is missing');
            expect(await editDocumentTemplatePo.isDocumentBodyDisplayed(documentBody1)).toBeTruthy('Document body text is missing');
            expect(await editDocumentTemplatePo.isDocumentBodyImgDisplay()).toBeTruthy('Document body Img text is missing');
            await editDocumentTemplatePo.clickOnCancelButton();
            await utilCommon.clickOnWarningOk();
            await documentTemplateConsolePo.searchAndOpenDocumentTemplate(templateRandVal2);
            expect(await editDocumentTemplatePo.isTemplateNameDisplayed(templateRandVal2)).toBeTruthy('Template Name is missing for Global company');
            expect(await editDocumentTemplatePo.isCompanyNameDisplayed('- Global -')).toBeTruthy('Global Company Name is missing ');
            expect(await editDocumentTemplatePo.isLabelValueDisplayed(labelRandVal1)).toBeTruthy('label is missing of Global company');
            expect(await editDocumentTemplatePo.isDescriptionValueDisplayed(description1)).toBeTruthy('Description Name is missing of Global company ');
            expect(await editDocumentTemplatePo.isDocumentBodyDisplayed(documentBody1)).toBeTruthy('Document body text is missing of Global company');
            expect(await editDocumentTemplatePo.isCompanyDropDownDisabled()).toBeTruthy('company drop down is enabled of Global company');
            await editDocumentTemplatePo.clickOnCancelButton();
            await utilCommon.clickOnWarningOk();
        });
        it('[DRDMV-14970,DRDMV-14974,DRDMV-14971,DRDMV-14972]: Update document template', async () => {
            await documentTemplateConsolePo.searchAndOpenDocumentTemplate(templateRandVal1);
            expect(await editDocumentTemplatePo.isCompanyDropDownDisabled()).toBeTruthy('Company Drop down is not disabled');
            expect(await editDocumentTemplatePo.isTemplateNameDisabled()).toBeTruthy('Template Name is disabled');
            await editDocumentTemplatePo.selectLabelDropDown(labelRandVal2);
            await editDocumentTemplatePo.updateDescription(description2);
            await editDocumentTemplatePo.updateDocumentBody(documentBody2);
            await editDocumentTemplatePo.clickOnSaveButton();
            await documentTemplateConsolePo.searchAndOpenDocumentTemplate(templateRandVal1);
            expect(await editDocumentTemplatePo.isTemplateNameDisplayed(templateRandVal1)).toBeTruthy('Template Name is missing');
            expect(await editDocumentTemplatePo.isCompanyNameDisplayed('Petramco')).toBeTruthy('Petramco 2 Company Name is missing');
            expect(await editDocumentTemplatePo.isLabelValueDisplayed(labelRandVal2)).toBeTruthy('label2 is missing');
            expect(await editDocumentTemplatePo.isDescriptionValueDisplayed(description2)).toBeTruthy('Description2 Name is missing');
            expect(await editDocumentTemplatePo.isDocumentBodyDisplayed(documentBody2)).toBeTruthy('Document body2 text is missing');
            await editDocumentTemplatePo.clickOnCancelButton();
            await utilCommon.clickOnWarningOk();
            await documentTemplateConsolePo.searchOnGridConsole(templateRandVal1);
        });
        it('[DRDMV-14970,DRDMV-14974,DRDMV-14971,DRDMV-14972]: Verify Document template creation with Case business analyst only and different validations on the window', async () => {
            await navigationPage.signOut();
            await loginPage.login('gwixillian');
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Document Management--Templates', 'Document Templates - Business Workflows');
            expect(await documentTemplateConsolePo.isGridRecordPresent(templateRandVal1)).toBeFalsy('Record is visible with "gwixillian" login');
            await documentTemplateConsolePo.searchOnGridConsole(templateRandVal2);
            expect(await documentTemplateConsolePo.getSelectedGridRecordValue('Template Name')).toBe(templateRandVal2, 'Template name is missing on Grid');
            expect(await documentTemplateConsolePo.getSelectedGridRecordValue('Company')).toBe('- Global -', 'Global Company name is missing on Grid');
            await documentTemplateConsolePo.clearGridSearchBox();
            await documentTemplateConsolePo.selectCheckBox(templateRandVal2);
            await documentTemplateConsolePo.clickOnDeleteButton();
            await utilCommon.clickOnWarningOk();
            expect(await documentTemplateConsolePo.isGridRecordPresent(templateRandVal2)).toBeFalsy('template name is preset on grid');
        });
    });

    //kgaikwad
    describe('[DRDMV-14977]: Verify UI for Document template create ,edit, view mode', async () => {
        let randomStr = [...Array(4)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        let documentName = "DocumentTemplate" + randomStr;
        let documentDescription = "description" + randomStr;
        let documentBody = "documentBody" + randomStr;
        let lable1, lable2;

        beforeAll(async () => {
            await navigationPage.signOut();
            await loginPage.login('qkatawazi');
            // Create Menu item Lables with API
            await apiHelper.apiLogin('qkatawazi');
            let menuItemDataFile1 = require('../../data/ui/ticketing/menuItem.ui.json');
            lable1 = await menuItemDataFile1['sampleMenuItem'].menuItemName + "lable1" + randomStr;
            menuItemDataFile1['sampleMenuItem'].menuItemName = lable1;
            await apiHelper.createNewMenuItem(menuItemDataFile1['sampleMenuItem']);

            let menuItemDataFile2 = require('../../data/ui/ticketing/menuItem.ui.json');
            lable2 = await menuItemDataFile2['sampleMenuItem'].menuItemName + "lable2" + randomStr;
            menuItemDataFile2['sampleMenuItem'].menuItemName = lable2;
            await apiHelper.createNewMenuItem(menuItemDataFile2['sampleMenuItem']);
        });

        it('[DRDMV-14977]: Verify Create Document Template UI', async () => {
            // Goto document template
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Document Management--Templates', 'Document Templates - Business Workflows');

            await createDocumentTemplatePo.clickOnAddTemplate();
            expect(await createDocumentTemplatePo.isHeaderDisplayed('Create Document Template')).toBeTruthy('Create document template header is missing');
            expect(await createDocumentTemplatePo.isFieldRequired('Template Name')).toBeTruthy('FailureMsg: Required tag is missing for Template Name')
            expect(await createDocumentTemplatePo.isFieldRequired('Company')).toBeTruthy('FailureMsg: Required tag is missing for Company')
            expect(await createDocumentTemplatePo.isFieldRequired('Description')).toBeTruthy('FailureMsg: Required tag is missing for Description')
            expect(await createDocumentTemplatePo.isFieldRequired('Document Body')).toBeTruthy('FailureMsg: Required tag is missing for Document Body')
            expect(await createDocumentTemplatePo.isFieldRequired('Label')).toBeFalsy('FailureMsg: Required tag is displayed for Label')

            await createDocumentTemplatePo.setTemplateName(documentName);
            await createDocumentTemplatePo.setCompany('Petramco');
            await createDocumentTemplatePo.selectLabelDropDown(lable1);
            await createDocumentTemplatePo.setDescription(documentDescription);
            await createDocumentTemplatePo.setDocumentBody(documentBody);
            await createDocumentTemplatePo.clickOnSaveButton();
        });
        it('[DRDMV-14977]: Updated new Label and verify on console', async () => {
            await documentTemplateConsolePo.clickOnGridRefreshButton();
            await documentTemplateConsolePo.addColumnOnGrid(['Label']);
            await documentTemplateConsolePo.searchOnGridConsole(documentName);
            expect(await documentTemplateConsolePo.getSelectedGridRecordValue('Template Name')).toBe(documentName, 'FailureMsg: Template name is missing on Grid');
            expect(await documentTemplateConsolePo.getSelectedGridRecordValue('Company')).toBe('Petramco', 'FailureMsg: Petramco  Company name is missing on Grid');
            expect(await documentTemplateConsolePo.getSelectedGridRecordValue('Label')).toBe(lable1, 'FailureMsg: Label is missing on Grid');

            await documentTemplateConsolePo.searchAndOpenDocumentTemplate(documentName);
            await editDocumentTemplatePo.selectLabelDropDown(lable2);
            await editDocumentTemplatePo.clickOnSaveButton();
            await documentTemplateConsolePo.searchOnGridConsole(documentName);
            expect(await documentTemplateConsolePo.getSelectedGridRecordValue('Label')).toBe(lable2, 'Label is missing on Grid');
            expect(await documentTemplateConsolePo.isGridColumnSorted('Label', 'descending')).toBeTruthy('Label is not get sorted with descending order');
        });
    });

    //kgaikwad
    describe('[DRDMV-14973]: Verify document body expression editor will list dynamic fields along with Case fields.', async () => {
        let randomStr = [...Array(4)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        let caseTemplateData;
        let documentName1 = '1Document'+ randomStr;
        let documentName2 = '2Document'+ randomStr;
        let documentName3 = '3Document'+ randomStr;
        let caseTempateName1 = '1caseTemplateName' +randomStr;
        let caseTempateName2 = '2caseTemplateName' +randomStr;
        let caseTempateName3 = '3caseTemplateName' +randomStr;
        
        let caseTemplateSummary = 'CaseSummaryName' + randomStr;
        beforeAll(async () => {
            await apiHelper.apiLogin('tadmin');
            await apiHelper.deleteDynamicFieldAndGroup();

            caseTemplateData = {
                "templateName": 'caseTempateName',
                "templateSummary": caseTemplateSummary,
                "caseStatus": "InProgress",
                "templateStatus": "Active",
                "assignee": "Fritz",
                "company": "Petramco",
                "supportGroup": "Facilities",
                "ownerGroup": "Facilities"
            }

            await apiHelper.apiLogin('tadmin');
            await apiHelper.deleteDynamicFieldAndGroup();
            await apiHelper.apiLogin('qkatawazi');

            caseTemplateData.templateName = caseTempateName1;
            let newCaseTemplate1 = await apiHelper.createCaseTemplate(caseTemplateData);
            caseTemplateData.templateName = caseTempateName2;
            let newCaseTemplate2 = await apiHelper.createCaseTemplate(caseTemplateData);
            caseTemplateData.templateName = caseTempateName3;
            await apiHelper.createCaseTemplate(caseTemplateData);

            await apiHelper.createDynamicDataOnTemplate(newCaseTemplate1.id, 'DynamicGroupField'); 
            
            await apiHelper.createDynamicDataOnTemplate(newCaseTemplate2.id, 'AllDataType');
        });

        it('[14973]: Verify Document Template With Case Dynamic Field ', async () => {
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Document Management--Templates', 'Document Templates - Business Workflows');

            await createDocumentTemplatePo.clickOnAddTemplate();
            await createDocumentTemplatePo.setTemplateName(documentName1);
            await createDocumentTemplatePo.setCompany("Petramco");
            await createDocumentTemplatePo.clickOnInsertFieldOfDocumentBody();
            await addFieldsPopPo.navigateToDynamicFieldInCaseTemplate('Case');
            expect(await addFieldsPopPo.isDynamicFieldPresentInTemplate('Application BundleID')).toBeTruthy("Application BundleID is missing");
            expect(await addFieldsPopPo.isDynamicFieldPresentInTemplate('Approver List')).toBeTruthy("Approver List is missing");
            expect(await addFieldsPopPo.isDynamicFieldPresentInTemplate('Assigned Business Unit')).toBeTruthy("Assigned Business Unit is missing");
            expect(await addFieldsPopPo.isDynamicFieldPresentInTemplate('ASSIGNED COMPANY_ID')).toBeTruthy("ASSIGNED COMPANY_ID is missing");
            expect(await addFieldsPopPo.isDynamicFieldPresentInTemplate('Assigned Department')).toBeTruthy("Assigned Department is missing");
            expect(await addFieldsPopPo.isDynamicFieldPresentInTemplate('Assigned Group')).toBeTruthy("Assigned Group is missing");
            expect(await addFieldsPopPo.isDynamicFieldPresentInTemplate('Assignee')).toBeTruthy("Assignee is missing");
            expect(await addFieldsPopPo.isDynamicFieldPresentInTemplate('Assignee GUID')).toBeTruthy("Assignee GUID is missing");
            expect(await addFieldsPopPo.isDynamicFieldPresentInTemplate('Category Tier 1')).toBeTruthy("Category Tier 1 is missing");
            expect(await addFieldsPopPo.isDynamicFieldPresentInTemplate('Category Tier 2')).toBeTruthy("Category Tier 2 is missing");
            expect(await addFieldsPopPo.isDynamicFieldPresentInTemplate('Category Tier 3')).toBeTruthy("Category Tier 3 is missing");
            expect(await addFieldsPopPo.isDynamicFieldPresentInTemplate('Category Tier 4')).toBeTruthy("Category Tier 4 is missing");
            expect(await addFieldsPopPo.isDynamicFieldPresentInTemplate('Changed by Approval')).toBeTruthy("Changed by Approval is missing");
            expect(await addFieldsPopPo.isDynamicFieldPresentInTemplate('Confidential Data Audit Info')).toBeTruthy("Confidential Data Audit Info is missing");
            expect(await addFieldsPopPo.isDynamicFieldPresentInTemplate('Create SR from API')).toBeTruthy("Create SR from API is missing");
            expect(await addFieldsPopPo.isDynamicFieldPresentInTemplate('Created By')).toBeTruthy("Created By is missing");
            expect(await addFieldsPopPo.isDynamicFieldPresentInTemplate('Created Date')).toBeTruthy("Created Date is missing");
            expect(await addFieldsPopPo.isDynamicFieldPresentInTemplate('Data Upgrade Action')).toBeTruthy("Data Upgrade Action is missing");
            expect(await addFieldsPopPo.isDynamicFieldPresentInTemplate('Description')).toBeTruthy("Description is missing");
            expect(await addFieldsPopPo.isDynamicFieldPresentInTemplate('Display ID')).toBeTruthy("Display ID is missing");
            expect(await addFieldsPopPo.isDynamicFieldPresentInTemplate('Domain Tag')).toBeTruthy("Domain Tag is missing");
            expect(await addFieldsPopPo.isDynamicFieldPresentInTemplate('Dynamic Data Audit Info')).toBeTruthy("Dynamic Data Audit Info is missing");
            expect(await addFieldsPopPo.isDynamicFieldPresentInTemplate('Dynamic Data DefinitionID')).toBeTruthy("Dynamic Data DefinitionID is missing");
            expect(await addFieldsPopPo.isDynamicFieldPresentInTemplate('Dynamic Data Parameter')).toBeTruthy("Dynamic Data Parameter is missing");
            expect(await addFieldsPopPo.isDynamicFieldPresentInTemplate('Email Context')).toBeTruthy("Email Context is missing");
            expect(await addFieldsPopPo.isDynamicFieldPresentInTemplate('External Email ID')).toBeTruthy("External Email ID is missing");
            expect(await addFieldsPopPo.isDynamicFieldPresentInTemplate('Flowset')).toBeTruthy("Flowset is missing");
            expect(await addFieldsPopPo.isDynamicFieldPresentInTemplate('GUID')).toBeTruthy("GUID is missing");
            expect(await addFieldsPopPo.isDynamicFieldPresentInTemplate('ID')).toBeTruthy("ID is missing");
            expect(await addFieldsPopPo.isDynamicFieldPresentInTemplate('Identity Validation')).toBeTruthy("Identity Validation is missing");
            expect(await addFieldsPopPo.isDynamicFieldPresentInTemplate('LABEL_ID')).toBeTruthy("LABEL_ID is missing");
            expect(await addFieldsPopPo.isDynamicFieldPresentInTemplate('Last Approval Result')).toBeTruthy("Last Approval Result is missing");
            expect(await addFieldsPopPo.isDynamicFieldPresentInTemplate('Modified By')).toBeTruthy("Modified By is missing");
            expect(await addFieldsPopPo.isDynamicFieldPresentInTemplate('Modified Date')).toBeTruthy("Modified Date is missing");
            expect(await addFieldsPopPo.isDynamicFieldPresentInTemplate('Notifier Listening')).toBeTruthy("Notifier Listening is missing");
            expect(await addFieldsPopPo.isDynamicFieldPresentInTemplate('Notify')).toBeTruthy("Notify is missing");
            expect(await addFieldsPopPo.isDynamicFieldPresentInTemplate('Origin')).toBeTruthy("Origin is missing");
            expect(await addFieldsPopPo.isDynamicFieldPresentInTemplate('Previous Case Status Value')).toBeTruthy("Previous Case Status Value is missing");
            expect(await addFieldsPopPo.isDynamicFieldPresentInTemplate('Priority')).toBeTruthy("Priority is missing");
            expect(await addFieldsPopPo.isDynamicFieldPresentInTemplate('REGION_ID')).toBeTruthy("REGION_ID is missing");
            expect(await addFieldsPopPo.isDynamicFieldPresentInTemplate('Reopened')).toBeTruthy("Reopened is missing");
            expect(await addFieldsPopPo.isDynamicFieldPresentInTemplate('Reopened Counter')).toBeTruthy("Reopened Counter is missing");
            expect(await addFieldsPopPo.isDynamicFieldPresentInTemplate('Requester')).toBeTruthy("Requester is missing");
            expect(await addFieldsPopPo.isDynamicFieldPresentInTemplate('Resolution Code')).toBeTruthy("Resolution Code is missing");
            expect(await addFieldsPopPo.isDynamicFieldPresentInTemplate('Resolution Date')).toBeTruthy("Resolution Date is missing");
            expect(await addFieldsPopPo.isDynamicFieldPresentInTemplate('Resolution Description')).toBeTruthy("Resolution Description is missing");
            expect(await addFieldsPopPo.isDynamicFieldPresentInTemplate('RLS Manual Update')).toBeTruthy("RLS Manual Update is missing");
            expect(await addFieldsPopPo.isDynamicFieldPresentInTemplate('Service Request Display ID')).toBeTruthy("Service Request Display ID is missing");
            expect(await addFieldsPopPo.isDynamicFieldPresentInTemplate('Service Request GUID')).toBeTruthy("Service Request GUID is missing");
            expect(await addFieldsPopPo.isDynamicFieldPresentInTemplate('Site Change Reason')).toBeTruthy("Site Change Reason is missing");
            expect(await addFieldsPopPo.isDynamicFieldPresentInTemplate('SITE_ID')).toBeTruthy("SITE_ID is missing");
            expect(await addFieldsPopPo.isDynamicFieldPresentInTemplate('Status')).toBeTruthy("Status is missing");
            expect(await addFieldsPopPo.isDynamicFieldPresentInTemplate('Status Changed Date')).toBeTruthy("Status Changed Date is missing");
            expect(await addFieldsPopPo.isDynamicFieldPresentInTemplate('Status Reason')).toBeTruthy("Status Reason is missing");
            expect(await addFieldsPopPo.isDynamicFieldPresentInTemplate('Status Reason Code')).toBeTruthy("Status Reason Code is missing");
            expect(await addFieldsPopPo.isDynamicFieldPresentInTemplate('Summary')).toBeTruthy("Summary is missing");
            expect(await addFieldsPopPo.isDynamicFieldPresentInTemplate('Target Date')).toBeTruthy("Target Date is missing");
            expect(await addFieldsPopPo.isDynamicFieldPresentInTemplate('Task Flow Process Instance Id')).toBeTruthy("Task Flow Process Instance Id is missing");
            expect(await addFieldsPopPo.isDynamicFieldPresentInTemplate('Task Flow Process Name')).toBeTruthy("Task Flow Process Name is missing");
            expect(await addFieldsPopPo.isDynamicFieldPresentInTemplate('tempIdentityValidationToken')).toBeTruthy("tempIdentityValidationToken is missing");
            expect(await addFieldsPopPo.isDynamicFieldPresentInTemplate('Template Name')).toBeTruthy("Template Name is missing");
            expect(await addFieldsPopPo.isDynamicFieldPresentInTemplate('Ticket Status')).toBeTruthy("Ticket Status is missing");
            expect(await addFieldsPopPo.isDynamicFieldPresentInTemplate('Ticket Status GUID')).toBeTruthy("Ticket Status GUID is missing");

            await addFieldsPopPo.selectDynamicField('Category Tier 1');
            await addFieldsPopPo.clickOnOkButtonOfEditor();
            await createDocumentTemplatePo.setDescription("Description");
            expect(await createDocumentTemplatePo.getDynamicFieldOnBody()).toContain('Category Tier 1');
            await createDocumentTemplatePo.clickOnSaveButton();
            await documentTemplateConsolePo.searchAndOpenDocumentTemplate(documentName1);
            expect(await editDocumentTemplatePo.getDynamicFieldOnBody()).toContain('Category Tier 1');                
            await editDocumentTemplatePo.clickOnCancelButton();
            await utilCommon.clickOnWarningOk();
        });

        it('[14973]: Verify Document Template With Case Template Dynamic Field  ', async () => {
            await createDocumentTemplatePo.clickOnAddTemplate();
            await createDocumentTemplatePo.setTemplateName(documentName2);
            await createDocumentTemplatePo.setCompany("Petramco");
            await createDocumentTemplatePo.clickOnInsertFieldOfDocumentBody();
            await addFieldsPopPo.navigateToDynamicFieldInCaseTemplate(caseTempateName1);
            expect(await addFieldsPopPo.isAssocitionDisplayed('GroupOne')).toBeTruthy("Group");
            await addFieldsPopPo.clickOnGroupName('GroupOne');
            expect(await addFieldsPopPo.isDynamicFieldPresentInTemplate('FieldGroup1')).toBeTruthy("FieldGroup1 is missing");
            expect(await addFieldsPopPo.isDynamicFieldPresentInTemplate('externalNumber')).toBeTruthy("externalNumber is missing");
            expect(await addFieldsPopPo.isDynamicFieldPresentInTemplate('externalDate')).toBeTruthy("externalDate is missing");
            expect(await addFieldsPopPo.isDynamicFieldPresentInTemplate('externalBoolean')).toBeTruthy("externalBoolean is missing");
            expect(await addFieldsPopPo.isDynamicFieldPresentInTemplate('externalDateTime')).toBeTruthy("externalDateTime is missing");
            expect(await addFieldsPopPo.isDynamicFieldPresentInTemplate('externalTime')).toBeTruthy("externalTime is missing");
            expect(await addFieldsPopPo.isDynamicFieldPresentInTemplate('newfiles')).toBeTruthy("newfiles is missing");
            expect(await addFieldsPopPo.isDynamicFieldPresentInTemplate('FieldGroupOutside')).toBeTruthy("FieldGroupOutside is missing");
            expect(await addFieldsPopPo.isDynamicFieldPresentInTemplate('FieldGroupOutside1')).toBeTruthy("FieldGroupOutside1 is missing");
            await addFieldsPopPo.selectDynamicField('FieldGroup1');
            
            await addFieldsPopPo.clickOnOkButtonOfEditor();
            await createDocumentTemplatePo.setDescription("Description");
            expect(await createDocumentTemplatePo.getDynamicFieldOnBody()).toContain('FieldGroup1');
            await createDocumentTemplatePo.clickOnSaveButton();
            await documentTemplateConsolePo.searchAndOpenDocumentTemplate(documentName2);
            expect(await editDocumentTemplatePo.getDynamicFieldOnBody()).toContain('FieldGroup1');  
            await editDocumentTemplatePo.clickOnCancelButton();
            await utilCommon.clickOnWarningOk();
        });

        it('[14973]: Verify Document Template With Confidential, Non Confidential Required and Hidden ', async () => {
            await createDocumentTemplatePo.clickOnAddTemplate();
            await createDocumentTemplatePo.setTemplateName(documentName2);
            await createDocumentTemplatePo.setCompany("Petramco");
            await createDocumentTemplatePo.clickOnInsertFieldOfDocumentBody();
            await addFieldsPopPo.navigateToDynamicFieldInCaseTemplate(caseTempateName2);
            expect(await addFieldsPopPo.isDynamicFieldPresentInTemplate('requiredFieldTrue')).toBeTruthy("requiredFieldTrue is missing");
            expect(await addFieldsPopPo.isDynamicFieldPresentInTemplate('confidentialFieldTrue (Confidential)')).toBeTruthy("confidentialFieldTrue (Confidential) is missing");
            expect(await addFieldsPopPo.isDynamicFieldPresentInTemplate('hiddenFieldTrue')).toBeTruthy("hiddenFieldTrue is missing");
            await addFieldsPopPo.clickOnCancelButtonOfEditor();
            await createDocumentTemplatePo.clickOnCancelButton();
            await utilCommon.clickOnWarningOk();
        });

        it('[14973]: Verify Document Template With Case Template Without Dynamic Field  ', async () => {
            await createDocumentTemplatePo.clickOnAddTemplate();
            await createDocumentTemplatePo.setTemplateName(documentName3);
            await createDocumentTemplatePo.setCompany("Petramco");
            await createDocumentTemplatePo.clickOnInsertFieldOfDocumentBody();
            expect(await addFieldsPopPo.isAssocitionDisplayed(caseTempateName3)).toBeFalsy('Case Template 3 is displayed');
            await addFieldsPopPo.clickOnCancelButtonOfEditor();
        });
    });
});

