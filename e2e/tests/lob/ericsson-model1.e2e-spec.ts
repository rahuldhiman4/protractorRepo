import { browser } from "protractor";
import apiHelper from '../../api/api.helper';
import previewCasePage from '../../pageobject/case/case-preview.po';
import createCasePo from '../../pageobject/case/create-case.po';
import editCasePo from '../../pageobject/case/edit-case.po';
import quickCasePo from '../../pageobject/case/quick-case.po';
import selectCasetemplateBladePo from '../../pageobject/case/select-casetemplate-blade.po';
import viewCasePage from '../../pageobject/case/view-case.po';
import accessTabPo from '../../pageobject/common/access-tab.po';
import changeAssignmentBladePo from '../../pageobject/common/change-assignment.po';
import ckeditorValidationPo from '../../pageobject/common/ck-editor/ckeditor-validation.po';
import loginPage from "../../pageobject/common/login.po";
import navigationPage from "../../pageobject/common/navigation.po";
import updateStatusBladePo from '../../pageobject/common/update.status.blade.po';
import composeMailPo from '../../pageobject/email/compose-mail.po';
import selectEmailTemplateBladePo from '../../pageobject/email/select-email-template-blade.po';
import previewCaseTemplateCasesPo from '../../pageobject/settings/case-management/preview-case-template.po';
import activityTabPo from '../../pageobject/social/activity-tab.po';
import notesTemplateUsage from '../../pageobject/social/note-template-usage.po';
import manageTaskBladePo from '../../pageobject/task/manage-task-blade.po';
import { BWF_BASE_URL } from '../../utils/constants';
import utilityCommon from '../../utils/utility.common';
import utilityGrid from '../../utils/utility.grid';

xdescribe('Ericsson Data Model Tests', () => {
    beforeAll(async () => {
        await browser.get(BWF_BASE_URL);
        await loginPage.login('rwillie');
    });

    afterAll(async () => {
        await utilityCommon.closeAllBlades();
        await navigationPage.signOut();
    });

    describe('[60209]:[Ericsson Model][Create Case]: Verify the behavior when the case agent is able to create a case when it has access to single LOB', async () => {
        let randomStr = Math.floor(Math.random() * 1000000);
        let caseTemplateData, caseTemplateDataGlobal, caseTemplateDataEricssonGlobal, ericssonSAMcaseTemplateData, caseTemplateDataEricssonSAMGlobal;
        beforeAll(async () => {
            caseTemplateData = {
                "templateName": `Casetemplate1${randomStr}`,
                "templateStatus": "Active",
                "templateSummary": `Summary1${randomStr}`,
                "caseStatus": "New",
                "casePriority": "Medium",
                "ownerComapny": "Ericsson HR",
                "ownerBU": "Ericsson United States Support",
                "ownerGroup": "US Support 1",
                "company": "Ericsson HR",
                "lineOfBusiness": "Ericsson HR",
            }
            caseTemplateDataEricssonGlobal = {
                "templateName": `Casetemplate2${randomStr}`,
                "templateSummary": randomStr + 'Summary DRDMV23488',
                "caseStatus": "Assigned",
                "templateStatus": "Active",
                "company": "Ericsson Global",
                "casePriority": "Low",
                "ownerComapny": "Ericsson HR",
                "ownerBU": "Ericsson United States Support",
                "ownerGroup": "US Support 1",
                "lineOfBusiness": "Ericsson HR",
            };
            caseTemplateDataGlobal = {
                "templateName": `Casetemplate3${randomStr}`,
                "templateSummary": randomStr + 'Summary DRDMV23488',
                "caseStatus": "Assigned",
                "templateStatus": "Active",
                "company": "- Global -",
                "casePriority": "Low",
                "ownerComapny": "Ericsson HR",
                "ownerBU": "Ericsson United States Support",
                "ownerGroup": "US Support 1",
                "lineOfBusiness": "Ericsson HR",
            };
            ericssonSAMcaseTemplateData = {
                "templateName": `Casetemplate4${randomStr}`,
                "templateStatus": "Active",
                "templateSummary": `Summary1${randomStr}`,
                "caseStatus": "New",
                "casePriority": "Medium",
                "ownerComapny": "Ericsson SAM",
                "ownerBU": "Ericsson Asset Management - USA",
                "ownerGroup": "Asset Disposal",
                "company": "Ericsson SAM",
                "lineOfBusiness": "Ericsson SAM",
            }
            caseTemplateDataEricssonSAMGlobal = {
                "templateName": `Casetemplate5${randomStr}`,
                "templateSummary": randomStr + 'Summary DRDMV23488',
                "caseStatus": "Assigned",
                "templateStatus": "Active",
                "company": "Ericsson Global",
                "casePriority": "Low",
                "ownerComapny": "Ericsson SAM",
                "ownerBU": "Ericsson Asset Management - USA",
                "ownerGroup": "Asset Disposal",
                "lineOfBusiness": "Ericsson SAM",
            };
            await apiHelper.apiLogin('rwillie');
            await apiHelper.createCaseTemplate(caseTemplateData);
            await apiHelper.createCaseTemplate(caseTemplateDataEricssonGlobal);
            await apiHelper.createCaseTemplate(caseTemplateDataGlobal);
            await apiHelper.apiLogin('sbruce');
            await apiHelper.createCaseTemplate(ericssonSAMcaseTemplateData);
            await apiHelper.createCaseTemplate(caseTemplateDataEricssonSAMGlobal);
        });
        it('[60209]:[Ericsson Model][Create Case]: Verify the behavior when the case agent is able to create a case when it has access to single LOB', async () => {
            await navigationPage.gotoCreateCase();
            await createCasePo.selectRequester('syakov');
            expect(await createCasePo.isLineOfBusinessDisabled()).toBeTruthy('Line of Buisness Field is Enabled');
            expect(await createCasePo.getLineOfBusinessValue()).toBe('Ericsson HR', 'Line of Buisness Field is Enabled');
            await createCasePo.setSummary('60209Summary' + randomStr);
            expect(await createCasePo.isValuePresentInDropdown("Category Tier 1", 'Purchasing Card')).toBeFalsy('Value is present in  Category Tier 1 drop down');
            await createCasePo.clickAssignToMeButton();
            expect(await createCasePo.isValuePresentInDropdown("Category Tier 1", 'Employee Relations')).toBeTruthy('Value is present in  Category Tier 1 drop down');
            await createCasePo.setPriority('Low');
            await createCasePo.selectCategoryTier1("Employee Relations");
            await createCasePo.selectCategoryTier2("Compensation");
            await createCasePo.selectCategoryTier3("Bonus");
            expect(await createCasePo.getCategoryTier1Value()).toBe('Employee Relations');
            expect(await createCasePo.getCategoryTier2Value()).toBe('Compensation');
            expect(await createCasePo.getCategoryTier3Value()).toBe('Bonus');
        });
        it('[60209]:[Ericsson Model][Create Case]: Verify the behavior when the case agent is able to create a case when it has access to single LOB', async () => {
            await createCasePo.clickChangeAssignmentButton();
            expect(await changeAssignmentBladePo.isValuePresentInDropDown("AssignedGroup", 'Ericsson Asset Management - USA')).toBeFalsy();
            await changeAssignmentBladePo.clickOnCancelButton();
            await createCasePo.clickChangeAssignmentButton();
            expect(await changeAssignmentBladePo.isValuePresentInDropDown("AssignedGroup", 'Ericsson United States Support')).toBeTruthy();
            await changeAssignmentBladePo.clickOnCancelButton();
            await createCasePo.clickSaveCaseButton();
            await previewCasePage.clickGoToCaseButton();
            await viewCasePage.clickEditCaseButton();
            await editCasePo.clickOnSelectCaseTemplate();
            await selectCasetemplateBladePo.selectCaseTemplate(caseTemplateData.templateName);
            await editCasePo.clickSaveCase();
            expect(await viewCasePage.getCaseTemplateText()).toBe(caseTemplateData.templateName);
            expect(await viewCasePage.getLineOfBusinessValue()).toBe('Ericsson HR');
        });
        it('[60209]:[Ericsson Model][Create Case]: Verify the behavior when the case agent is able to create a case when it has access to single LOB', async () => {
            await viewCasePage.clickEditCaseButton();
            expect(await editCasePo.isValuePresentInDropdown("Category Tier 1", 'Fixed Assets')).toBeFalsy('Value is present in  Category Tier 1 drop down');
            expect(await editCasePo.isLineOfBusinessReadOnly()).toBeTruthy('Field is enabled');
            await editCasePo.updateCasePriority('High');
            await editCasePo.updateCaseCategoryTier1('Applications');
            await editCasePo.updateCaseCategoryTier2('Help Desk');
            await editCasePo.updateCaseCategoryTier3('Incident');
            await editCasePo.clickChangeAssignmentButton();
            expect(await changeAssignmentBladePo.isValuePresentInDropDown("AssignedGroup", 'Ericsson Asset Management - India')).toBeFalsy();
            await changeAssignmentBladePo.clickOnCancelButton();
            await editCasePo.clickChangeAssignmentButton();
            await changeAssignmentBladePo.setDropDownValue('AssignedGroup', 'US Support 2');
            await changeAssignmentBladePo.setDropDownValue('Assignee', 'Rudner Rita');
            await changeAssignmentBladePo.clickOnAssignButton();
            await editCasePo.clickSaveCase();
            expect(await viewCasePage.getCategoryTier1Value()).toBe('Applications');
            expect(await viewCasePage.getCategoryTier2Value()).toBe('Help Desk');
            expect(await viewCasePage.getCategoryTier3Value()).toBe('Incident');
            expect(await viewCasePage.getAssignedGroupValue()).toBe("US Support 2");
            expect(await viewCasePage.getAssigneeText()).toBe("Rudner Rita");
        });
        it('[60209]:[Ericsson Model][Create Case]: Verify the behavior when the case agent is able to create a case when it has access to single LOB', async () => {
            await viewCasePage.clickOnTab('Case Access');
            await accessTabPo.clickToExpandAccessEntitiySearch('Support Group Access', 'Case');
            expect(await accessTabPo.isOptionsPresent('Ericsson Asset Management - India', 'Select Support Group')).toBeFalsy();
            await accessTabPo.clickToExpandAccessEntitiySearch('Support Group Access', 'Case');
            await accessTabPo.clickToExpandAccessEntitiySearch('Support Group Access', 'Case');
            await accessTabPo.selectAccessEntityDropDown('Ericsson HR Support', 'Select Support Group');
            await accessTabPo.clickAccessEntitiyAddButton('Support Group');
            expect(await accessTabPo.isAccessTypeOfEntityDisplayed('Ericsson HR Support', 'Read')).toBeTruthy('FailuerMsg1: Agent Name is missing');
        });
        it('[60209]:[Ericsson Model][Create Case]: Verify the behavior when the case agent is able to create a case when it has access to single LOB', async () => {
            await navigationPage.gotoCreateCase();
            await createCasePo.selectRequester('rdustin');
            await createCasePo.setSummary('New Case 3');
            await createCasePo.clickSelectCaseTemplateButton();
            await selectCasetemplateBladePo.selectCaseTemplate(caseTemplateDataEricssonGlobal.templateName);
            await createCasePo.clickSaveCaseButton();
            await previewCasePage.clickGoToCaseButton();
            expect(await viewCasePage.getLineOfBusinessValue()).toBe('Ericsson HR');
            await navigationPage.gotoCreateCase();
            await createCasePo.selectRequester('rdustin');
            await createCasePo.setSummary('New Case 3');
            await createCasePo.clickSelectCaseTemplateButton();
            await selectCasetemplateBladePo.selectCaseTemplate(caseTemplateDataGlobal.templateName);
            await createCasePo.clickSaveCaseButton();
            await previewCasePage.clickGoToCaseButton();
            expect(await viewCasePage.getLineOfBusinessValue()).toBe('Ericsson HR');
            await viewCasePage.clickEditCaseButton();
            await selectCasetemplateBladePo.selectCaseTemplate(caseTemplateData.templateName);
            await editCasePo.clickSaveCase();
            expect(await viewCasePage.getLineOfBusinessValue()).toBe('Ericsson HR');
            await navigationPage.gotoCreateCase();
            await createCasePo.selectRequester('rdustin');
            await createCasePo.setSummary('New Case 3');
            await createCasePo.clickSelectCaseTemplateButton();
            expect(await selectCasetemplateBladePo.isRecordPresent(ericssonSAMcaseTemplateData.templateName)).toBeFalsy();
            expect(await selectCasetemplateBladePo.isRecordPresent(caseTemplateDataEricssonSAMGlobal.templateName)).toBeFalsy();
            await selectCasetemplateBladePo.clickOnCancelButton();
        });
        it('[60209]:[Ericsson Model][Create Case]: Verify the behavior when the case agent is able to create a case when it has access to single LOB', async () => {
            await navigationPage.gotoQuickCase();
            await quickCasePo.selectRequesterName('rwillie');
            await quickCasePo.selectCaseTemplate(caseTemplateDataEricssonGlobal.templateName);
            await quickCasePo.clickArrowFirstRecommendedCaseTemplate();
            expect(await previewCaseTemplateCasesPo.getLineOfBusinessValue()).toBe('Ericsson HR');
            await previewCaseTemplateCasesPo.clickOnBackButton();
            await quickCasePo.createCaseButton();
            await utilityCommon.closePopUpMessage();
            expect(await previewCasePage.getLineOfBusinessValue()).toBe('Ericsson HR');
            await quickCasePo.gotoCaseButton();
            await viewCasePage.clickEditCaseButton();
            await editCasePo.clickOnChangeCaseTemplate();
            await selectCasetemplateBladePo.selectCaseTemplate(caseTemplateData.templateName);
            await editCasePo.clickSaveCase();
            await utilityCommon.closePopUpMessage();
            expect(await viewCasePage.getLineOfBusinessValue()).toBe('Ericsson HR');
        });
        it('[60209]:[Ericsson Model][Create Case]: Verify the behavior when the case agent is able to create a case when it has access to single LOB', async () => {
            await navigationPage.signOut();
            await loginPage.login('sbruce');
            await utilityGrid.clearFilter();
            await utilityGrid.searchRecord('60209Summary' + randomStr);
            expect(await utilityGrid.isGridRecordPresent('60209Summary' + randomStr)).toBeFalsy('60209Summary' + randomStr);
            await navigationPage.gotoQuickCase();
            await quickCasePo.selectRequesterName('sjoel');
            await quickCasePo.setCaseSummary('new case');
            await quickCasePo.createCaseButton();
            await utilityCommon.closePopUpMessage();
            await quickCasePo.gotoCaseButton();
            await viewCasePage.clickOnTab('Case Access');
            await accessTabPo.clickToExpandAccessEntitiySearch('Support Group Access', 'Case');
            expect(await accessTabPo.isOptionsPresent('Ericsson Asset Management - India', 'Select Support Group')).toBeTruthy();
            await accessTabPo.clickToExpandAccessEntitiySearch('Support Group Access', 'Case');
            await accessTabPo.clickToExpandAccessEntitiySearch('Support Group Access', 'Case');
            await accessTabPo.selectAccessEntityDropDown('Ericsson Asset Management - India', 'Select Support Group');
            await accessTabPo.clickAccessEntitiyAddButton('Support Group');
            expect(await accessTabPo.isAccessTypeOfEntityDisplayed('Ericsson Asset Management - India', 'Read')).toBeTruthy('FailuerMsg1: Agent Name is missing');
        });
        afterAll(async () => {
            await utilityCommon.closeAllBlades();
            await navigationPage.signOut();
            await loginPage.login('rwillie');
        });
    });

    describe('[60195]:[Ericsson Model] [Cases] : Verify the behavior where Email Templates, Task Templates, Resolution Codes, Notes templates are filtered / displayed based on the Line of Business on Cases.', async () => {
        let randomStr = [...Array(5)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        let response, notesTemplate, templateData, externaltemplateData, automatedtemplateData, emailTemplateDataEricsson;
        let notesTemplateSAM, templateDataSAM, externaltemplateDataSAM, automatedtemplateDataSAM, emailTemplateDataEricssonSAM;
        let resolutionCode = 'resolutionCode' + randomStr;
        beforeAll(async () => {
            await apiHelper.apiLogin('rwillie');
            templateData = {
                "templateName": 'Manual task19011' + randomStr,
                "templateSummary": 'Manual task19011' + randomStr,
                "templateStatus": "Active",
                "taskCompany": "Ericsson HR",
                "ownerCompany": "Ericsson HR",
                "ownerBusinessUnit": "Ericsson United States Support",
                "ownerGroup": "US Support 1",
                "businessUnit": "Ericsson United States Support",
                "supportGroup": "US Support 1",
                "assignee": "rwillie",
                "lineOfBusiness": "Ericsson HR"
            }
            await apiHelper.createManualTaskTemplate(templateData);
            externaltemplateData = {
                "templateName": 'External task19011' + randomStr,
                "templateSummary": 'External task19011' + randomStr,
                "templateStatus": "Active",
                "taskCompany": 'Ericsson Global',
                "ownerCompany": 'Ericsson HR',
                "ownerBusinessUnit": "Ericsson United States Support",
                "ownerGroup": "US Support 1",
                "lineOfBusiness": "Ericsson HR"
            }
            await apiHelper.createExternalTaskTemplate(externaltemplateData);
            automatedtemplateData = {
                "templateName": 'Automated task19011' + randomStr,
                "templateSummary": 'Automated task19011' + randomStr,
                "templateStatus": "Active",
                "processBundle": "com.bmc.dsm.case-lib",
                "processName": 'Auto Proces' + randomStr,
                "taskCompany": "Ericsson HR",
                "ownerCompany": "Ericsson HR",
                "ownerBusinessUnit": "Ericsson United States Support",
                "ownerGroup": "US Support 1",
                "businessUnit": "Ericsson United States Support",
                "supportGroup": "US Support 1",
                "assignee": "rwillie",
                "lineOfBusiness": "Ericsson HR"
            }
            await apiHelper.createAutomatedTaskTemplate(automatedtemplateData);
            emailTemplateDataEricsson = {
                "TemplateName": "ericssonEmailTemplateName" + randomStr,
                "Company": "Ericsson HR",
                "Status": 1,
                "Description": "Leave details",
                "EmailMessageSubject": "Leave summary",
                "EmailMessageBody": "Hello testing",
                "lineOfBusiness": "Ericsson HR"
            }
            //create an email template 
            await apiHelper.createEmailTemplate(emailTemplateDataEricsson);
            emailTemplateDataEricsson.TemplateName = "ericssonGlobalEmailTemplate" + randomStr;
            emailTemplateDataEricsson.Company = 'Ericsson Global';
            await apiHelper.createEmailTemplate(emailTemplateDataEricsson);
            // Create Resoution code
            await apiHelper.apiLogin('rwillie');
            let resolutionCodeActiveOnUIData = {
                "menuItemName": "resolutionCodeNameEricsson" + randomStr,
                "menuItemStatus": "Active",
                "menuType": "Resolution Code",
                "lineOfBusiness": "Ericsson HR"
            }
            await apiHelper.createNewMenuItem(resolutionCodeActiveOnUIData);
            notesTemplate = {
                "templateName": "notesTemplateEricssonHR" + randomStr,
                "company": "Ericsson HR",
                "templateStatus": 1,
                "body": "this is notes template description Oracle",
                "lineOfBusiness": "Ericsson HR"
            }
            await apiHelper.createNotesTemplate("Case", notesTemplate);
            // Create Global Notes Template
            notesTemplate.templateName = "notesTemplateEricssonGlobal" + randomStr;
            notesTemplate.company = "Ericsson Global";
            await apiHelper.createNotesTemplate("Case", notesTemplate);
            let caseData = {
                "Requester": "rdustin",
                "Summary": "Summary" + randomStr,
                "Assigned Company": "Ericsson HR",
                "Business Unit": "Ericsson HR Support",
                "Support Group": "Compensation and Benefits",
                "Assignee": "syakov",
                "Line of Business": "Ericsson HR"
            };
            response = await apiHelper.createCase(caseData);
        });
        it('[60195]:Create Ericsson SAM data', async () => {
            await apiHelper.apiLogin('ttristan');
            templateDataSAM = {
                "templateName": 'Manual taskSAM' + randomStr,
                "templateSummary": 'Manual taskSAM' + randomStr,
                "templateStatus": "Active",
                "taskCompany": "Ericsson SAM",
                "ownerCompany": "Ericsson SAM",
                "ownerBusinessUnit": "Ericsson Asset Management - India",
                "ownerGroup": "Old Asset Management",
                "businessUnit": "Ericsson Asset Management - India",
                "supportGroup": "Old Asset Management",
                "assignee": "ttristan",
                "lineOfBusiness": "Ericsson SAM"
            }
            await apiHelper.createManualTaskTemplate(templateDataSAM);
            externaltemplateDataSAM = {
                "templateName": 'External taskSAM' + randomStr,
                "templateSummary": 'External taskSAM' + randomStr,
                "templateStatus": "Active",
                "taskCompany": 'Ericsson Global',
                "ownerCompany": 'Ericsson SAM',
                "ownerBusinessUnit": "Ericsson Asset Management - India",
                "ownerGroup": "Old Asset Management",
                "lineOfBusiness": "Ericsson SAM"
            }
            await apiHelper.createExternalTaskTemplate(externaltemplateDataSAM);
            automatedtemplateDataSAM = {
                "templateName": 'Automated taskSAM' + randomStr,
                "templateSummary": 'Automated taskSAM' + randomStr,
                "templateStatus": "Active",
                "processBundle": "com.bmc.dsm.case-lib",
                "processName": 'Auto Proces' + randomStr,
                "taskCompany": "Ericsson SAM",
                "ownerCompany": "Ericsson SAM",
                "ownerBusinessUnit": "Ericsson Asset Management - India",
                "ownerGroup": "Old Asset Management",
                "businessUnit": "Ericsson Asset Management - India",
                "supportGroup": "Old Asset Management",
                "assignee": "ttristan",
                "lineOfBusiness": "Ericsson SAM"
            }
            await apiHelper.createAutomatedTaskTemplate(automatedtemplateDataSAM);
            emailTemplateDataEricssonSAM = {
                "TemplateName": "ericssonSAMEmailTemplateName" + randomStr,
                "Company": "Ericsson SAM",
                "Status": 1,
                "Description": "Leave details",
                "EmailMessageSubject": "Leave summary",
                "EmailMessageBody": "Hello testing",
                "lineOfBusiness": "Ericsson SAM"
            }
            //create an email template 
            await apiHelper.createEmailTemplate(emailTemplateDataEricssonSAM);
            emailTemplateDataEricsson.TemplateName = "ericssonGlobalEmailTemplate2" + randomStr;
            emailTemplateDataEricsson.Company = 'Ericsson Global';
            await apiHelper.createEmailTemplate(emailTemplateDataEricsson);
            notesTemplateSAM = {
                "templateName": "notesTemplateEricssonSAM" + randomStr,
                "company": "Ericsson SAM",
                "templateStatus": 1,
                "body": "this is notes template description",
                "lineOfBusiness": "Ericsson SAM"
            }
            await apiHelper.createNotesTemplate("Case", notesTemplateSAM);
            notesTemplate.templateName = "notesTemplateEricssonGlobal2" + randomStr;
            notesTemplate.company = "Ericsson Global";
            await apiHelper.createNotesTemplate("Case", notesTemplate);
        });
        it('[60195]:[Ericsson Model] [Cases] : Verify the behavior where Email Templates, Task Templates, Resolution Codes, Notes templates are filtered / displayed based on the Line of Business on Cases.', async () => {
            await utilityGrid.searchAndOpenHyperlink(response.displayId);
            await viewCasePage.clickOnEmailLink();
            await composeMailPo.clickOnSelectEmailTemplateLink();
            await selectEmailTemplateBladePo.searchEmailTemplate("ericssonEmailTemplateName" + randomStr);
            expect(await selectEmailTemplateBladePo.getGridRecordValue("Template Name")).toBe("ericssonEmailTemplateName" + randomStr);
            await selectEmailTemplateBladePo.searchEmailTemplate("ericssonGlobalEmailTemplate" + randomStr);
            expect(await selectEmailTemplateBladePo.getGridRecordValue("Template Name")).toBe("ericssonGlobalEmailTemplate" + randomStr);
            await selectEmailTemplateBladePo.searchEmailTemplate(emailTemplateDataEricssonSAM.TemplateName);
            expect(await selectEmailTemplateBladePo.isRecordPresent(emailTemplateDataEricssonSAM.TemplateName)).toBeFalsy();
            await selectEmailTemplateBladePo.searchEmailTemplate("ericssonGlobalEmailTemplate2" + randomStr);
            expect(await selectEmailTemplateBladePo.isRecordPresent("ericssonGlobalEmailTemplate2" + randomStr)).toBeFalsy();
            await selectEmailTemplateBladePo.clickOnCancelButton();
            await composeMailPo.clickOnSelectEmailTemplateLink();
            await selectEmailTemplateBladePo.searchAndSelectEmailTemplate("ericssonEmailTemplateName" + randomStr);
            await selectEmailTemplateBladePo.clickOnApplyButton();
            await composeMailPo.setToOrCCInputTextbox('To', 'fritz.schulz@petramco.com');
            await composeMailPo.clickOnSendButton();
            await utilityCommon.closePopUpMessage();
        });
        it('[60195]:[Ericsson Model] [Cases] : Verify the behavior where Email Templates, Task Templates, Resolution Codes, Notes templates are filtered / displayed based on the Line of Business on Cases.', async () => {
            await viewCasePage.clickAddTaskButton();
            await manageTaskBladePo.clickAddTaskFromTemplateButton();
            await manageTaskBladePo.searchTaskTemplate(templateData.templateSummary);
            expect(await manageTaskBladePo.getGridRecordValue("Template Name")).toBe(templateData.templateSummary);
            await manageTaskBladePo.searchTaskTemplate(automatedtemplateData.templateSummary);
            expect(await manageTaskBladePo.getGridRecordValue("Template Name")).toBe(automatedtemplateData.templateSummary);
            await manageTaskBladePo.searchTaskTemplate(externaltemplateData.templateSummary);
            expect(await manageTaskBladePo.getGridRecordValue("Template Name")).toBe(externaltemplateData.templateSummary);
            await manageTaskBladePo.searchTaskTemplate(externaltemplateDataSAM.templateSummary);
            expect(await manageTaskBladePo.isRecordPresent(externaltemplateDataSAM.templateSummary)).toBeFalsy();
            await manageTaskBladePo.searchTaskTemplate(templateDataSAM.templateSummary);
            expect(await manageTaskBladePo.isRecordPresent(templateDataSAM.templateSummary)).toBeFalsy();
            await manageTaskBladePo.clickTaskGridCancelButton();
            await manageTaskBladePo.addTaskFromTaskTemplate(templateData.templateSummary);
            await manageTaskBladePo.addTaskFromTaskTemplate(automatedtemplateData.templateSummary);
            await manageTaskBladePo.addTaskFromTaskTemplate(externaltemplateData.templateSummary);
            await manageTaskBladePo.clickCloseButton();
        });
        it('[60195]:[Ericsson Model] [Cases] : Verify the behavior where Email Templates, Task Templates, Resolution Codes, Notes templates are filtered / displayed based on the Line of Business on Cases.', async () => {
            // Verify Case Notes Template
            await activityTabPo.clickActivityNoteTextBox();
            await activityTabPo.clickOnNotesTemplate();
            expect(await notesTemplateUsage.isTemplatePresent("notesTemplateEricssonHR" + randomStr)).toBeTruthy();
            expect(await notesTemplateUsage.isTemplatePresent("notesTemplateEricssonGlobal" + randomStr)).toBeTruthy();
            expect(await notesTemplateUsage.isTemplatePresent(notesTemplateSAM.templateName)).toBeFalsy();
            expect(await notesTemplateUsage.isTemplatePresent("notesTemplateEricssonGlobal2" + randomStr)).toBeFalsy();
            await notesTemplateUsage.clickOnCancelBtn();
            await navigationPage.gotoCaseConsole();
            await utilityGrid.searchAndOpenHyperlink(response.displayId);
            await notesTemplateUsage.clickAddNoteAndAddNoteTemplate("notesTemplateEricssonHR" + randomStr);
            expect(await ckeditorValidationPo.getTextCkEditorTextArea()).toContain(notesTemplate.body);
            await activityTabPo.clickOnPostButton();
            expect(await activityTabPo.isTextPresentInActivityLog(notesTemplate.body)).toBeTruthy();
        });
        it('[60195]:[Ericsson Model] [Cases] : Verify the behavior where Email Templates, Task Templates, Resolution Codes, Notes templates are filtered / displayed based on the Line of Business on Cases.', async () => {
            // Verify Resolution Code
            await viewCasePage.clickEditCaseButton();
            await editCasePo.updateResolutionCode(resolutionCode);
            await editCasePo.setResolutionDescription(resolutionCode);
            await editCasePo.clickSaveCase();
            await utilityCommon.closePopUpMessage();
            expect(await viewCasePage.getResolutionCodeValue()).toBe(resolutionCode);
            expect(await viewCasePage.getResolutionDescription()).toBe(resolutionCode);
            await updateStatusBladePo.changeStatus('Resolved');
            await updateStatusBladePo.selectStatusReason('Auto Resolved');
            await updateStatusBladePo.clickSaveStatus();
            await utilityCommon.closePopUpMessage();
            expect(await viewCasePage.getTextOfStatus()).toBe('Resolved');
            expect(await viewCasePage.getResolutionCodeValue()).toBe(resolutionCode);
            expect(await viewCasePage.getResolutionDescription()).toBe(resolutionCode);
        });
        afterAll(async () => {
            await utilityCommon.closeAllBlades();
            await composeMailPo.clickOnDiscardButton();
            await utilityCommon.clickOnApplicationWarningYesNoButton("Yes");
        });
    });
});
