import { browser } from "protractor";
import apiHelper from '../../api/api.helper';
import caseConsolePo from "../../pageobject/case/case-console.po";
import casePreviewPo from '../../pageobject/case/case-preview.po';
import createCasePage from '../../pageobject/case/create-case.po';
import editCasePo from '../../pageobject/case/edit-case.po';
import quickCasePo from "../../pageobject/case/quick-case.po";
import selectCasetemplateBladePo from '../../pageobject/case/select-casetemplate-blade.po';
import viewCasePage from '../../pageobject/case/view-case.po';
import changeAssignmentBladePo from '../../pageobject/common/change-assignment.po';
import loginPage from "../../pageobject/common/login.po";
import navigationPage from "../../pageobject/common/navigation.po";
import resourcesTabPo from "../../pageobject/common/resources-tab.po";
import updateStatusBladePo from '../../pageobject/common/update.status.blade.po';
import composeMailPo from '../../pageobject/email/compose-mail.po';
import selectEmailTemplateBladePo from '../../pageobject/email/select-email-template-blade.po';
import createKnowledgePage from "../../pageobject/knowledge/create-knowlege.po";
import editKnowledgePo from "../../pageobject/knowledge/edit-knowledge.po";
import previewKnowledgePo from '../../pageobject/knowledge/preview-knowledge.po';
import previewCaseTemplatePo from '../../pageobject/settings/case-management/preview-case-template.po';
import activityTabPo from '../../pageobject/social/activity-tab.po';
import notesTemplateUsage from '../../pageobject/social/note-template-usage.po';
import createAdhocTaskPo from '../../pageobject/task/create-adhoc-task.po';
import manageTaskBladePo from '../../pageobject/task/manage-task-blade.po';
import viewTaskPo from '../../pageobject/task/view-task.po';
import { BWF_BASE_URL } from '../../utils/constants';
import utilityCommon from '../../utils/utility.common';
import utilityGrid from '../../utils/utility.grid';

xdescribe('Service Provider Data Model Tests', () => {
    let kingstoneHRUserName = 'smoran@petramco.com';
    let oracleUserName = 'umiguelde@petramco.com';
    let kingstoneLegalUserName = 'yhenny@petramco.com';
    let kingstoneOracleLOBUserName = 'jstuart@petramco.com';
    let financeBackOfficeUserName = 'wsteven@petramco.com';

    let password = 'Password_1234';
    beforeAll(async () => {
        await browser.get(BWF_BASE_URL);
        await loginPage.login(kingstoneHRUserName, password);
    });

    afterAll(async () => {
        await utilityCommon.closeAllBlades();
        await navigationPage.signOut();
    });

    //kiran
    describe('[12036]: [Service Provider Model] [Cases] : Verify the behavior where Email Templates, Task Templates, Resolution Codes, Notes templates are filtered / displayed based on the Line of Business on Cases.', () => {
        let randomStr = [...Array(4)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        let emailTemplateDataKingston, emailTemplateDataKingstonGlobal, emailTemplateOracle, emailTemplateOracleGlobal;

        let kingstonEmailTemplateName = "1TemplateNameDRDMV23676" + randomStr;
        let globalkingStoneEmailTemplatename = "1GlobalTemplateNameDRDMV23676" + randomStr;
        let kingstoneTaskTemplateName = "1TemplateNameDRDMV23676" + randomStr;
        let globalKingStonetaskTemplateName = "1GlobalTemplateNameDRDMV23676" + randomStr;
        let notesTemplatekingStone = "1notesTemplateDRDMV23676" + randomStr;
        let notesTemplateKingStoneGlobal = "1notesTemplateGlobalDRDMV23676" + randomStr;
        let resolutionCodeNamekingStone = '1resolutionCodeNameDRDMV23676' + randomStr;

        let oracleEmailTemplateName = "2TemplateNameDRDMV23676" + randomStr;
        let globalOracleEmailTemplatename = "2GlobalTemplateNameDRDMV23676" + randomStr;
        let oracleTaskTemplateName = "2TemplateNameDRDMV23676" + randomStr;
        let globaloracletaskTemplateName = "2GlobalTemplateNameDRDMV23676" + randomStr;
        let notesTemplateOracle = "2notesTemplateDRDMV23676" + randomStr;
        let notesTemplateOracleGlobal = "2notesTemplateGlobalDRDMV23676" + randomStr;
        let resolutionCodeNameOracle = '2resolutionCodeNameDRDMV23676' + randomStr;

        beforeAll(async () => {
            // Create Data with Kingston HR LOB
            await apiHelper.apiLogin(kingstoneHRUserName, password);

            // create an email template
            emailTemplateDataKingston = {
                "TemplateName": kingstonEmailTemplateName,
                "Company": "Phyto",
                "Status": 1,
                "Description": "Leave details",
                "EmailMessageSubject": "Leave summary",
                "EmailMessageBody": "Hello testing",
                "lineOfBusiness": "Kingston HR"
            }
            await apiHelper.createEmailTemplate(emailTemplateDataKingston);

            emailTemplateDataKingstonGlobal = {
                "TemplateName": globalkingStoneEmailTemplatename,
                "Company": "- Global -",
                "Status": 1,
                "Description": "Leave details",
                "EmailMessageSubject": "Leave summary",
                "EmailMessageBody": "Hello testing Global",
                "lineOfBusiness": "Kingston HR"
            }
            await apiHelper.createEmailTemplate(emailTemplateDataKingstonGlobal);

            // Create Task Template
            let manualTemplateData = {
                "templateName": kingstoneTaskTemplateName,
                "templateSummary": kingstoneTaskTemplateName,
                "templateStatus": "Active",
                "taskCompany": 'Kingston',
                "ownerCompany": "Phyto",
                "ownerBusinessUnit": "Kingston HR",
                "ownerGroup": "Kingston AskHR",
                "lineOfBusiness": "Kingston HR"
            }
            await apiHelper.createManualTaskTemplate(manualTemplateData);

            // Create Global Task Template
            manualTemplateData.templateName = globalKingStonetaskTemplateName;
            manualTemplateData.templateSummary = globalKingStonetaskTemplateName;
            manualTemplateData.taskCompany = "- Global -";
            await apiHelper.createManualTaskTemplate(manualTemplateData);

            //Create Notes Template
            let notesTemplate = {
                "templateName": notesTemplatekingStone,
                "company": "Phyto",
                "templateStatus": 1,
                "body": "this is notes template description",
                "lineOfBusiness": "Kingston HR"
            }
            await apiHelper.createNotesTemplate("Case", notesTemplate);

            // Create Global Notes Template
            notesTemplate.templateName = notesTemplateKingStoneGlobal;
            notesTemplate.company = "- Global -";
            await apiHelper.createNotesTemplate("Case", notesTemplate);

            // Create Resoution code
            let resolutionCodeActiveOnUIData = {
                "menuItemName": resolutionCodeNamekingStone,
                "menuItemStatus": "Active",
                "menuType": "Resolution Code",
                "lineOfBusiness": "Kingston HR"
            }
            await apiHelper.createNewMenuItem(resolutionCodeActiveOnUIData);

            // >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

            await apiHelper.apiLogin(oracleUserName, password);
            // Create Data with Oracle HR 
            emailTemplateOracle = {
                "TemplateName": oracleEmailTemplateName,
                "Company": "Phyto",
                "Status": 1,
                "Description": "Leave details Oracle",
                "EmailMessageSubject": "Leave summary Oracle",
                "EmailMessageBody": "Hello testing Oracle",
                "lineOfBusiness": "Oracle HR"
            }
            await apiHelper.createEmailTemplate(emailTemplateOracle);

            emailTemplateOracleGlobal = {
                "TemplateName": globalOracleEmailTemplatename,
                "Company": "- Global -",
                "Status": 1,
                "Description": "Leave details",
                "EmailMessageSubject": "Leave summary",
                "EmailMessageBody": "Hello testing Global Oracle",
                "lineOfBusiness": "Oracle HR"
            }
            await apiHelper.createEmailTemplate(emailTemplateOracleGlobal);

            // Create Task Template
            let manualTemplateData2 = {
                "templateName": oracleTaskTemplateName,
                "templateSummary": oracleTaskTemplateName,
                "templateStatus": "Active",
                "taskCompany": 'Oracle',
                "ownerCompany": "Phyto",
                "ownerBusinessUnit": "Oracle HR",
                "ownerGroup": "Oracle AskHR",
                "lineOfBusiness": "Oracle HR"
            }
            await apiHelper.createManualTaskTemplate(manualTemplateData2);
            // Create Global Template
            manualTemplateData2.templateName = globaloracletaskTemplateName;
            manualTemplateData2.templateSummary = globaloracletaskTemplateName;
            manualTemplateData2.taskCompany = "- Global -";
            await apiHelper.createManualTaskTemplate(manualTemplateData2);

            //Create Active Case Notes Template
            let notesTemplate2 = {
                "templateName": notesTemplateOracle,
                "company": "Phyto",
                "templateStatus": 1,
                "body": "this is notes template description Oracle",
                "lineOfBusiness": "Oracle HR"
            }
            await apiHelper.createNotesTemplate("Case", notesTemplate2);

            // Create Global Notes Template
            notesTemplate2.templateName = notesTemplateOracleGlobal;
            notesTemplate2.company = "- Global -";
            await apiHelper.createNotesTemplate("Case", notesTemplate2);

            // Create Resoution code
            let resolutionCodeActiveOnUIData2 = {
                "menuItemName": resolutionCodeNameOracle,
                "menuItemStatus": "Active",
                "menuType": "Resolution Code",
                "lineOfBusiness": "Oracle HR"
            }
            await apiHelper.createNewMenuItem(resolutionCodeActiveOnUIData2);
        });

        it('[12036]: Create Case and verify email template on select email template blade grid', async () => {
            await navigationPage.gotoCreateCase();
            await createCasePage.selectRequester('David Kramer');
            await createCasePage.setSummary('DRDMV23676CaseSummary');
            await createCasePage.clickChangeAssignmentButton();
            await changeAssignmentBladePo.setAssignee('Kingston AskHR', 'Samara Moran');
            await createCasePage.clickSaveCaseButton();
            await casePreviewPo.clickGoToCaseButton();

            await viewCasePage.clickOnRequestersEmail();
            await composeMailPo.clickOnSelectEmailTemplateLink();

            expect(await utilityGrid.isGridRecordPresent(kingstonEmailTemplateName)).toBeTruthy('kingstonEmailTemplateName Record is not preset');
            expect(await utilityGrid.isGridRecordPresent(globalkingStoneEmailTemplatename)).toBeTruthy('globalkingStoneEmailTemplatename Record is not preset');

            expect(await utilityGrid.isGridRecordPresent(oracleEmailTemplateName)).toBeFalsy('oracleEmailTemplateName Record is preset');
            expect(await utilityGrid.isGridRecordPresent(oracleEmailTemplateName)).toBeFalsy('globalOracleEmailTemplatename Record is preset');

            await selectEmailTemplateBladePo.searchAndSelectEmailTemplate(kingstonEmailTemplateName);
            await selectEmailTemplateBladePo.clickOnApplyButton();
            expect(await composeMailPo.getEmailBody()).toBe('Hello testing');
            await composeMailPo.clickOnSendButton();
        });

        it('[12036]: Verify Task template on manage task blade', async () => {
            await viewCasePage.clickAddTaskButton();
            await manageTaskBladePo.clickAddTaskFromTemplateButton();

            expect(await utilityGrid.isGridRecordPresent(kingstoneTaskTemplateName)).toBeTruthy('kingstoneTaskTemplateName Record is not preset');
            expect(await utilityGrid.isGridRecordPresent(globalKingStonetaskTemplateName)).toBeTruthy('globalKingStonetaskTemplateName Record is not preset');

            expect(await utilityGrid.isGridRecordPresent(oracleTaskTemplateName)).toBeFalsy('oracleTaskTemplateName Record is preset');
            expect(await utilityGrid.isGridRecordPresent(globaloracletaskTemplateName)).toBeFalsy('globaloracletaskTemplateName Record is preset');

            await utilityGrid.searchAndSelectGridRecord(kingstoneTaskTemplateName);
            await manageTaskBladePo.clickTaskGridSaveButton();
        });

        it('[12036]: Verify Adhoc Task template LOB on manage task blade', async () => {
            await manageTaskBladePo.clickAddAdhocTaskButton();
            await createAdhocTaskPo.setSummary("DRDMV23676Test");
            expect(await createAdhocTaskPo.getLineOfBussinessValue()).toBe('Kingston HR');
            await createAdhocTaskPo.clickSaveAdhoctask();
            await manageTaskBladePo.clickCloseButton();
        });

        it('[12036]: Verify Notes Template', async () => {
            await activityTabPo.clickActivityNoteTextBox();
            await activityTabPo.clickOnNotesTemplate();
            expect(await notesTemplateUsage.isTemplatePresent(notesTemplatekingStone)).toBeTruthy('notesTemplatekingStone is missing');
            expect(await notesTemplateUsage.isTemplatePresent(notesTemplateKingStoneGlobal)).toBeTruthy('notesTemplateKingStoneGlobal is missing');

            expect(await notesTemplateUsage.isTemplatePresent(notesTemplateOracle)).toBeFalsy('notesTemplateOracle is displayed');
            expect(await notesTemplateUsage.isTemplatePresent(notesTemplateOracleGlobal)).toBeFalsy('notesTemplateOracleGlobal is displayed');

            await notesTemplateUsage.clickOnCancelBtn();
            await utilityCommon.closeAllBlades();
            await activityTabPo.clickOnCancelButton();
            await notesTemplateUsage.clickAddNoteAndAddNoteTemplate(notesTemplatekingStone);

            await activityTabPo.clickOnPostButton();
            await activityTabPo.isTextPresentInActivityLog('this is notes template description');
        });

        it('[12036]: Verify Resolution Code', async () => {
            await viewCasePage.clickEditCaseButton();
            await editCasePo.updateResolutionCode(resolutionCodeNamekingStone);
            await editCasePo.setResolutionDescription('resolution code testing');
            expect(await editCasePo.isValuePresentInResolutionCode(resolutionCodeNameOracle)).toBeFalsy('resolutionCodeNamekingStone is missing')
            await editCasePo.clickSaveCase();

            await viewCasePage.clickOnStatus();
            await updateStatusBladePo.changeStatus('Resolved');
            await updateStatusBladePo.selectStatusReason('Auto Resolved');
            await updateStatusBladePo.selectResolutionCode(resolutionCodeNamekingStone);
            expect(await updateStatusBladePo.isResolutionoCodeDropDownValueDisplayed(resolutionCodeNameOracle)).toBeFalsy('resolutionCodeNamekingStone is missing')

            await updateStatusBladePo.setResolutionDescription('resolution code update');
            await updateStatusBladePo.clickSaveStatus();
        });

        afterAll(async () => {
            await utilityCommon.closeAllBlades();
            await navigationPage.signOut();
            await loginPage.login(kingstoneLegalUserName, password);
        });
    });

    //kiran
    describe('[12017]: [Service Provider Model] [Cases] : Verify the behavior where Email Templates, Task Templates, Resolution Codes, Notes templates are filtered / displayed based on the Line of Business on Cases.', () => {
        let randomStr = [...Array(4)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        let emailTemplateDataKingston, emailTemplateDataKingstonGlobal, emailTemplateOracle, emailTemplateOracleGlobal;

        let kingstonEmailTemplateName = "1TemplateNameDRDMV23763" + randomStr;
        let globalkingStoneEmailTemplatename = "1GlobalTemplateNameDRDMV23763" + randomStr;
        let kingstoneTaskTemplateName = "1TemplateNameDRDMV23763" + randomStr;
        let globalKingStonetaskTemplateName = "1GlobalTemplateNameDRDMV23763" + randomStr;
        let notesTemplatekingStone = "1notesTemplateDRDMV23763" + randomStr;
        let notesTemplateKingStoneGlobal = "1notesTemplateGlobalDRDMV23763" + randomStr;
        let resolutionCodeNamekingStone = '1resolutionCodeNameDRDMV23763' + randomStr;

        beforeAll(async () => {
            // Create Data with Kingston HR LOB
            await apiHelper.apiLogin(kingstoneLegalUserName, password);

            // create an email template
            emailTemplateDataKingston = {
                "TemplateName": kingstonEmailTemplateName,
                "Company": "Kingston",
                "Status": 1,
                "Description": "Leave details",
                "EmailMessageSubject": "Leave summary",
                "EmailMessageBody": "Hello testing",
                "lineOfBusiness": "Kingston Legal"
            }
            await apiHelper.createEmailTemplate(emailTemplateDataKingston);

            emailTemplateDataKingstonGlobal = {
                "TemplateName": globalkingStoneEmailTemplatename,
                "Company": "- Global -",
                "Status": 1,
                "Description": "Leave details",
                "EmailMessageSubject": "Leave summary",
                "EmailMessageBody": "Hello testing Global",
                "lineOfBusiness": "Kingston Legal"
            }
            await apiHelper.createEmailTemplate(emailTemplateDataKingstonGlobal);

            // Create Task Template
            let manualTemplateData = {
                "templateName": kingstoneTaskTemplateName,
                "templateSummary": kingstoneTaskTemplateName,
                "templateStatus": "Active",
                "taskCompany": 'Kingston',
                "ownerCompany": "Kingston",
                "ownerBusinessUnit": "Kingston Legal",
                "ownerGroup": "Legal Support",
                "lineOfBusiness": "Kingston Legal"
            }
            await apiHelper.createManualTaskTemplate(manualTemplateData);

            // Create Global Task Template
            manualTemplateData.templateName = globalKingStonetaskTemplateName;
            manualTemplateData.templateSummary = globalKingStonetaskTemplateName;
            manualTemplateData.taskCompany = "- Global -";
            await apiHelper.createManualTaskTemplate(manualTemplateData);

            //Create Notes Template
            let notesTemplate = {
                "templateName": notesTemplatekingStone,
                "company": "Kingston",
                "templateStatus": 1,
                "body": "this is notes template description",
                "lineOfBusiness": "Kingston Legal"
            }
            await apiHelper.createNotesTemplate("Case", notesTemplate);

            // Create Global Notes Template
            notesTemplate.templateName = notesTemplateKingStoneGlobal;
            notesTemplate.company = "- Global -";
            await apiHelper.createNotesTemplate("Case", notesTemplate);

            // Create Resoution code
            let resolutionCodeActiveOnUIData = {
                "menuItemName": resolutionCodeNamekingStone,
                "menuItemStatus": "Active",
                "menuType": "Resolution Code",
                "lineOfBusiness": "Kingston Legal"
            }
            await apiHelper.createNewMenuItem(resolutionCodeActiveOnUIData);
        });

        it('[12017]: Create Case and verify email template on select email template blade grid', async () => {
            await navigationPage.gotoCreateCase();
            await createCasePage.selectRequester('Young Neil');
            await createCasePage.setSummary('DRDMV23763CaseSummary');
            await createCasePage.clickChangeAssignmentButton();
            await changeAssignmentBladePo.setAssignee('Legal Support', 'Youngman Henny');
            await createCasePage.clickSaveCaseButton();
            await casePreviewPo.clickGoToCaseButton();
            await viewCasePage.clickOnStatus();
            await updateStatusBladePo.changeStatus('In Progress');
            await updateStatusBladePo.clickSaveStatus();

            await viewCasePage.clickOnRequestersEmail();
            await composeMailPo.clickOnSelectEmailTemplateLink();

            expect(await utilityGrid.isGridRecordPresent(kingstonEmailTemplateName)).toBeTruthy('kingstonEmailTemplateName Record is not preset');
            expect(await utilityGrid.isGridRecordPresent(globalkingStoneEmailTemplatename)).toBeTruthy('globalkingStoneEmailTemplatename Record is not preset');

            await selectEmailTemplateBladePo.searchAndSelectEmailTemplate(kingstonEmailTemplateName);
            await selectEmailTemplateBladePo.clickOnApplyButton();
            expect(await composeMailPo.getEmailBody()).toBe('Hello testing');
            await composeMailPo.clickOnSendButton();
        });

        it('[12017]: Verify Task template on manage task blade', async () => {
            await viewCasePage.clickAddTaskButton();
            await manageTaskBladePo.clickAddTaskFromTemplateButton();

            expect(await utilityGrid.isGridRecordPresent(kingstoneTaskTemplateName)).toBeTruthy('kingstoneTaskTemplateName Record is not preset');
            expect(await utilityGrid.isGridRecordPresent(globalKingStonetaskTemplateName)).toBeTruthy('globalKingStonetaskTemplateName Record is not preset');

            await utilityGrid.searchAndSelectGridRecord(kingstoneTaskTemplateName);
            await manageTaskBladePo.clickTaskGridSaveButton();
        });

        it('[12017]: Verify Adhoc Task template LOB on manage task blade', async () => {
            await manageTaskBladePo.clickAddAdhocTaskButton();
            await createAdhocTaskPo.setSummary("DRDMV23763Test");
            expect(await createAdhocTaskPo.getLineOfBussinessValue()).toBe('Kingston Legal');
            await createAdhocTaskPo.clickSaveAdhoctask();
            await manageTaskBladePo.clickTaskLink(kingstoneTaskTemplateName);

            await viewTaskPo.clickOnChangeStatus();
            await viewTaskPo.changeTaskStatus('Completed');
            await updateStatusBladePo.selectStatusReason('Successful');
            await updateStatusBladePo.clickSaveStatus();
            await viewTaskPo.clickOnViewCase();
        });

        it('[12017]: Change Task Status', async () => {
            await viewCasePage.clickAddTaskButton();
            await manageTaskBladePo.clickTaskLink('DRDMV23763Test');
            await viewTaskPo.clickOnChangeStatus();
            await viewTaskPo.changeTaskStatus('Completed');
            await updateStatusBladePo.selectStatusReason('Successful');
            await updateStatusBladePo.clickSaveStatus();
            await viewTaskPo.clickOnViewCase();
        });

        it('[12017]: Verify Notes Template', async () => {
            await activityTabPo.clickActivityNoteTextBox();
            await activityTabPo.clickOnNotesTemplate();
            expect(await notesTemplateUsage.isTemplatePresent(notesTemplatekingStone)).toBeTruthy('notesTemplatekingStone is missing');
            expect(await notesTemplateUsage.isTemplatePresent(notesTemplateKingStoneGlobal)).toBeTruthy('notesTemplateKingStoneGlobal is missing');

            await notesTemplateUsage.clickOnCancelBtn();
            await utilityCommon.closeAllBlades();
            await activityTabPo.clickOnCancelButton();
            await notesTemplateUsage.clickAddNoteAndAddNoteTemplate(notesTemplatekingStone);

            await activityTabPo.clickOnPostButton();
            await activityTabPo.isTextPresentInActivityLog('this is notes template description');
        });

        it('[12017]: Verify Resolution Code', async () => {
            await viewCasePage.clickEditCaseButton();
            await editCasePo.updateResolutionCode(resolutionCodeNamekingStone);
            await editCasePo.setResolutionDescription('resolution code testing');
            await editCasePo.clickSaveCase();

            await viewCasePage.clickOnStatus();
            await updateStatusBladePo.changeStatus('Resolved');
            await updateStatusBladePo.selectStatusReason('Auto Resolved');
            await updateStatusBladePo.selectResolutionCode(resolutionCodeNamekingStone);

            await updateStatusBladePo.setResolutionDescription('resolution code update');
            await updateStatusBladePo.clickSaveStatus();
            await utilityCommon.closeAllBlades();
        });

        it('[12017]: Create Case and verify email template on select email template blade grid', async () => {
            await navigationPage.signOut();
            await loginPage.login(kingstoneHRUserName, password);

            await navigationPage.gotoCreateCase();
            await createCasePage.selectRequester('David Kramer');
            await createCasePage.setSummary('DRDMV23763CaseSummary');
            await createCasePage.clickChangeAssignmentButton();
            await changeAssignmentBladePo.setAssignee('Kingston AskHR', 'Samara Moran');
            await createCasePage.clickSaveCaseButton();
            await casePreviewPo.clickGoToCaseButton();

            await viewCasePage.clickOnRequestersEmail();
            await composeMailPo.clickOnSelectEmailTemplateLink();

            expect(await utilityGrid.isGridRecordPresent(kingstonEmailTemplateName)).toBeFalsy('kingstonEmailTemplateName Record is  preset');
            expect(await utilityGrid.isGridRecordPresent(globalkingStoneEmailTemplatename)).toBeFalsy('globalkingStoneEmailTemplatename Record is preset');

            await selectEmailTemplateBladePo.clickOnCancelButton();
            await utilityCommon.closeAllBlades();
            await composeMailPo.clickOnDiscardButton();
            await utilityCommon.clickOnApplicationWarningYesNoButton("Yes");
        });

        it('[12017]: Verify Task template on manage task blade', async () => {
            await viewCasePage.clickAddTaskButton();
            await manageTaskBladePo.clickAddTaskFromTemplateButton();

            expect(await utilityGrid.isGridRecordPresent(kingstoneTaskTemplateName)).toBeFalsy('kingstoneTaskTemplateName Record is not preset');
            expect(await utilityGrid.isGridRecordPresent(globalKingStonetaskTemplateName)).toBeFalsy('globalKingStonetaskTemplateName Record is not preset');
            await manageTaskBladePo.clickTaskGridCancelButton();
            await manageTaskBladePo.clickCloseButton();
        });

        it('[12017]: Verify Notes Template', async () => {
            await activityTabPo.clickActivityNoteTextBox();
            await activityTabPo.clickOnNotesTemplate();
            expect(await notesTemplateUsage.isTemplatePresent(notesTemplatekingStone)).toBeFalsy('notesTemplatekingStone is missing');
            expect(await notesTemplateUsage.isTemplatePresent(notesTemplateKingStoneGlobal)).toBeFalsy('notesTemplateKingStoneGlobal is missing');

            await notesTemplateUsage.clickOnCancelBtn();
            await utilityCommon.closeAllBlades();
        });

        it('[12017]: Verify Resolution Code', async () => {
            await viewCasePage.clickEditCaseButton();
            await expect(await editCasePo.isValuePresentInResolutionCode(resolutionCodeNamekingStone)).toBeFalsy();
            await editCasePo.setResolutionDescription('resolution code testing');
            await editCasePo.clickSaveCase();

            await viewCasePage.clickOnStatus();
            await updateStatusBladePo.changeStatus('Resolved');
            await updateStatusBladePo.selectStatusReason('Auto Resolved');
            await expect(await updateStatusBladePo.isResolutionoCodeDropDownValueDisplayed(resolutionCodeNamekingStone)).toBeFalsy();

            await updateStatusBladePo.setResolutionDescription('resolution code update');
            await updateStatusBladePo.clickSaveStatus();
            await utilityCommon.closeAllBlades();
        });
        afterAll(async () => {
            await utilityCommon.closeAllBlades();
            await utilityCommon.clickOnApplicationWarningYesNoButton('Yes');
            await navigationPage.signOut();
            await loginPage.login(kingstoneOracleLOBUserName, password);
        });
    });

    //kiran
    describe('[12033]: [Service Provider Model][Create Case]: Verify the behavior when the case agent is able to create a case when it has access to multiple LOB', () => {
        let randomStr = [...Array(4)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        let caseTemplateDataGlobalKingstonHR, caseTemplateDataKingstoneHR, caseIdKingstoneHR, caseIdOracleHR, caseTemplateDataOracleHR, caseTemplateDataGlobalOracleHR, caseTemplateDataGlobalKingstoneLegal, caseTemplateDataKingstoneLegal;
        let taskTemplateNameSummaryKingstoneHR = "1taskTemplateNameSummaryDRDMV23681" + randomStr;
        let taskTemplateNameSummaryOracleHR = "2taskTemplateNameSummaryDRDMV23681" + randomStr;

        beforeAll(async () => {
            // Create Data with Kingston HR LOB
            await apiHelper.apiLogin(kingstoneOracleLOBUserName, password);

            caseTemplateDataGlobalKingstonHR = {
                "templateName": 'GlobalcaseTemplateNameKingstonHR' + randomStr,
                "templateSummary": 'GlobalCaseTemplateSummaryKingstonHR' + randomStr,
                "categoryTier1": 'Employee Relations',
                "categoryTier2": 'Compensation',
                "categoryTier3": 'Bonus',
                "casePriority": "Low",
                "templateStatus": "Active",
                "company": "- Global -",
                "businessUnit": "Kingston HR",
                "supportGroup": "Kingston AskHR",
                "assignee": "smoran",
                "ownerBU": "Kingston HR",
                "ownerGroup": "Kingston AskHR",
                "lineOfBusiness": "Kingston HR"
            }
            await apiHelper.createCaseTemplate(caseTemplateDataGlobalKingstonHR);

            caseTemplateDataKingstoneHR = {
                "templateName": '2caseTemplateNameKingstonHR' + randomStr,
                "templateSummary": '2caseTemplateSummaryKingstonHR' + randomStr,
                "categoryTier1": 'Workforce Administration',
                "categoryTier2": 'HR Operations',
                "categoryTier3": 'Adjustments',
                "casePriority": "High",
                "templateStatus": "Active",
                "company": "Phyto",
                "businessUnit": "Kingston HR",
                "supportGroup": "Kingston AskHR",
                "assignee": "sochoa",
                "ownerBU": "Kingston HR",
                "ownerGroup": "Kingston AskHR",
                "lineOfBusiness": "Kingston HR"
            }
            let newCaseTemplate = await apiHelper.createCaseTemplate(caseTemplateDataKingstoneHR);

            let taskTemplateDataSet = {
                "templateName": `${taskTemplateNameSummaryKingstoneHR}`,
                "templateSummary": `${taskTemplateNameSummaryKingstoneHR}`,
                "templateStatus": "Active",
                "taskCompany": 'Phyto',
                "assignee": "smoran",
                "businessUnit": "Kingston HR",
                "supportGroup": "Kingston AskHR",
                "ownerCompany": "Phyto",
                "ownerBusinessUnit": "Kingston HR",
                "ownerGroup": "Kingston AskHR",
                "lineOfBusiness": "Kingston HR"
            }
            let manualTaskTemplate = await apiHelper.createManualTaskTemplate(taskTemplateDataSet);
            await apiHelper.associateCaseTemplateWithOneTaskTemplate(newCaseTemplate.displayId, manualTaskTemplate.displayId);

            // >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
            // Create data with Oracle HR Data
            caseTemplateDataGlobalOracleHR = {
                "templateName": 'GlobalcaseTemplateNameOracleHR' + randomStr,
                "templateSummary": 'GlobalCaseTemplateSummaryOracleHR' + randomStr,
                "categoryTier1": 'Employee Relations',
                "categoryTier2": 'Compensation',
                "categoryTier3": 'Bonus',
                "casePriority": "Low",
                "templateStatus": "Active",
                "company": "- Global -",
                "businessUnit": "Oracle HR",
                "supportGroup": "Oracle AskHR",
                "assignee": "umiguelde",
                "ownerBU": "Oracle HR",
                "ownerGroup": "Oracle AskHR",
                "lineOfBusiness": "Oracle HR"
            }
            await apiHelper.createCaseTemplate(caseTemplateDataGlobalOracleHR);

            caseTemplateDataOracleHR = {
                "templateName": '2caseTemplateNameOracleHR' + randomStr,
                "templateSummary": '2caseTemplateSummaryOracleHR' + randomStr,
                "categoryTier1": 'Workforce Administration',
                "categoryTier2": 'HR Operations',
                "categoryTier3": 'Adjustments',
                "casePriority": "High",
                "templateStatus": "Active",
                "company": "Phyto",
                "businessUnit": "Oracle HR",
                "supportGroup": "Oracle AskHR",
                "assignee": "umiguelde",
                "ownerBU": "Oracle HR",
                "ownerGroup": "Oracle AskHR",
                "lineOfBusiness": "Oracle HR"
            }
            let newCaseTemplate2 = await apiHelper.createCaseTemplate(caseTemplateDataOracleHR);

            let taskTemplateDataSet2 = {
                "templateName": `${taskTemplateNameSummaryOracleHR}`,
                "templateSummary": `${taskTemplateNameSummaryOracleHR}`,
                "templateStatus": "Active",
                "taskCompany": 'Phyto',
                "assignee": "umorihei",
                "businessUnit": "Oracle HR",
                "supportGroup": "Oracle AskHR",
                "ownerCompany": "Phyto",
                "ownerBusinessUnit": "Oracle HR",
                "ownerGroup": "Oracle AskHR",
                "lineOfBusiness": "Oracle HR"
            }
            let manualTaskTemplate2 = await apiHelper.createManualTaskTemplate(taskTemplateDataSet2);
            await apiHelper.associateCaseTemplateWithOneTaskTemplate(newCaseTemplate2.displayId, manualTaskTemplate2.displayId);

            // >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
            // Create data with Kingstone Legal Data
            await apiHelper.apiLogin(kingstoneLegalUserName, password);
            caseTemplateDataGlobalKingstoneLegal = {
                "templateName": 'GlobalcaseTemplateNameKingstoneLegal' + randomStr,
                "templateSummary": 'GlobalCaseTemplateSummaryKingstonLegal' + randomStr,
                "categoryTier1": 'Employee Relations',
                "categoryTier2": 'Compensation',
                "categoryTier3": 'Bonus',
                "casePriority": "Low",
                "templateStatus": "Active",
                "company": "- Global -",
                "businessUnit": "Kingston Legal",
                "supportGroup": "Legal Support",
                "assignee": "yhenny",
                "ownerBU": "Kingston Legal",
                "ownerGroup": "Legal Support",
                "lineOfBusiness": "Kingston Legal"
            }
            await apiHelper.createCaseTemplate(caseTemplateDataGlobalKingstoneLegal);

            caseTemplateDataKingstoneLegal = {
                "templateName": '3caseTemplateNameKingstonLegal' + randomStr,
                "templateSummary": '2caseTemplateSummaryKingstonLegal' + randomStr,
                "categoryTier1": 'Workforce Administration',
                "categoryTier2": 'HR Operations',
                "categoryTier3": 'Adjustments',
                "casePriority": "High",
                "templateStatus": "Active",
                "company": "Kingston",
                "businessUnit": "Kingston Legal",
                "supportGroup": "Legal Support",
                "assignee": "yhenny",
                "ownerBU": "Kingston Legal",
                "ownerGroup": "Legal Support",
                "lineOfBusiness": "Kingston Legal"
            }
            await apiHelper.createCaseTemplate(caseTemplateDataKingstoneLegal);
        });

        it('[12033]: Verify Negative Scenrio for Oracle HR and Kingston Leagal data but Finance LOB for category diffrence', async () => {
            await navigationPage.gotoCaseConsole();
            await navigationPage.gotoCreateCase();
            await createCasePage.selectRequester('Ueshiba Morihei');
            await createCasePage.selectLineOfBusiness('Oracle HR');

            await createCasePage.setSummary('DRDMV23681CaseSummary');
            // Verify negative scenario for Kingston Legal and Kingston HR LOB case template should not display
            await createCasePage.clickSelectCaseTemplateButton();
            await selectCasetemplateBladePo.clickOnAllTemplateTab();
            expect(await utilityGrid.isGridRecordPresent(caseTemplateDataKingstoneLegal.templateName)).toBeFalsy('caseTemplateDataKingstoneLegal.templateName is missing');
            expect(await utilityGrid.isGridRecordPresent(caseTemplateDataGlobalKingstoneLegal.templateName)).toBeFalsy('caseTemplateDataGlobalKingstoneLegal.templateName is missing');

            expect(await utilityGrid.isGridRecordPresent(caseTemplateDataKingstoneHR.templateName)).toBeFalsy('caseTemplateDataKingstoneHR is missing');
            expect(await utilityGrid.isGridRecordPresent(caseTemplateDataGlobalKingstonHR.templateName)).toBeFalsy('caseTemplateDataGlobalKingstonHR is missing');

            expect(await utilityGrid.isGridRecordPresent(caseTemplateDataOracleHR.templateName)).toBeTruthy('caseTemplateDataOracleHR.templateName is missing');
            expect(await utilityGrid.isGridRecordPresent(caseTemplateDataGlobalOracleHR.templateName)).toBeTruthy('caseTemplateDataGlobalOracleHR.templateName is missing');
            await selectCasetemplateBladePo.selectCaseTemplate(caseTemplateDataOracleHR.templateName);

            expect(await createCasePage.getCategoryTier1Value()).toBe('Workforce Administration');
            expect(await createCasePage.getCategoryTier2Value()).toBe('HR Operations');
            expect(await createCasePage.getCategoryTier3Value()).toBe('Adjustments');
            expect(await createCasePage.getAssigneeBusinessUnitValue()).toBe('Oracle HR');
            expect(await createCasePage.getAssigneeGroupValue()).toBe('Oracle AskHR');
            expect(await createCasePage.getAssigneeValue()).toBe('Unamuno Miguel de');

            // Verify negative scenario for Kingston Legal LOB should not display
            expect(await createCasePage.isValuePresentInLineOfBusinessDropDown('Kingston Legal')).toBeFalsy('Kingston lob is displayed');

            // verify negative scenario for categoryTier1 with Finance LOB
            expect(await createCasePage.isCategoryTier1DropDownValueDisplayed('General Ledger')).toBeFalsy('General Ledger CategoryTier1 drop down value displayed');

            await createCasePage.clickChangeAssignmentButton();
            // Verify negative scenario for Kingston LOB for change assignment
            expect(await changeAssignmentBladePo.isValuePresentInDropDown("AssignedGroup", 'Legal Support')).toBeFalsy('Support Group is displayed');
            await changeAssignmentBladePo.clickOnCancelButton();

            await createCasePage.clickChangeAssignmentButton();
            await changeAssignmentBladePo.setAssignee('Oracle AskHR', 'Vixie Paul');

            expect(await createCasePage.getAssigneeValue()).toBe('Vixie Paul');

            // Change verify with change LOB and should be clear all selected values
            await createCasePage.selectLineOfBusiness('KingstonOracle Finance');

            expect(await createCasePage.getCategoryTier1Value()).toBe('Select');
            expect(await createCasePage.getCategoryTier2Value()).toBe('Select');
            expect(await createCasePage.getCategoryTier3Value()).toBe('Select');

            expect(await createCasePage.getAssigneeBusinessUnitValue()).toBe('');
            expect(await createCasePage.getAssigneeBusinessUnitValue()).toBe('');
            expect(await createCasePage.getAssigneeValue()).toBe('Select');

            expect(await createCasePage.isCategoryTier1DropDownValueDisplayed('General Ledger')).toBeTruthy('General Ledger CategoryTier1 drop down value missing');
        });

        it('[12033]: Create case without case template', async () => {
            await navigationPage.gotoCaseConsole();
            await utilityGrid.selectLineOfBusiness('Kingston HR');
            await navigationPage.gotoCreateCase();
            await createCasePage.selectRequester('Samara Moran');
            expect(await createCasePage.isCategoryTier1DropDownValueDisplayed('General Ledger')).toBeFalsy('General Ledger CategoryTier1 drop down value displayed');
            await createCasePage.selectLineOfBusiness('Kingston HR');
            await createCasePage.setSummary('DRDMV23681CaseSummary');
            await createCasePage.selectCategoryTier1('Workforce Administration');
            await createCasePage.selectCategoryTier2('HR Operations');
            await createCasePage.selectCategoryTier3('Adjustments');
            await createCasePage.clickChangeAssignmentButton();
            await changeAssignmentBladePo.setAssignee('Kingston AskHR', 'Sherri Ochoa');
            await createCasePage.clickSaveCaseButton();
            expect(await casePreviewPo.getLineOfBusinessValue()).toBe('Kingston HR');
            await casePreviewPo.clickOncreateNewCaseButton();
        });

        it('[12033]: Create case with case template', async () => {
            await createCasePage.selectRequester('Stuart Rexroad');
            expect(await createCasePage.getLineOfBusinessValue()).toBe('Kingston HR');
            await createCasePage.setSummary('DRDMV23681CaseSummary');

            await createCasePage.clickSelectCaseTemplateButton();
            await selectCasetemplateBladePo.clickOnAllTemplateTab();

            expect(await utilityGrid.isGridRecordPresent(caseTemplateDataKingstoneLegal.templateName)).toBeFalsy('caseTemplateDataKingstoneLegal.templateName is missing');
            expect(await utilityGrid.isGridRecordPresent(caseTemplateDataGlobalKingstoneLegal.templateName)).toBeFalsy('caseTemplateDataGlobalKingstoneLegal.templateName is missing');

            expect(await utilityGrid.isGridRecordPresent(caseTemplateDataOracleHR.templateName)).toBeFalsy('caseTemplateDataOracleHR.templateName is missing');
            expect(await utilityGrid.isGridRecordPresent(caseTemplateDataGlobalOracleHR.templateName)).toBeFalsy('caseTemplateDataGlobalOracleHR.templateName is missing');

            expect(await utilityGrid.isGridRecordPresent(caseTemplateDataKingstoneHR.templateName)).toBeTruthy('caseTemplateDataKingstoneHR is missing');
            expect(await utilityGrid.isGridRecordPresent(caseTemplateDataGlobalKingstonHR.templateName)).toBeTruthy('caseTemplateDataGlobalKingstonHR is missing');

            await selectCasetemplateBladePo.searchAndOpenCaseTemplate(caseTemplateDataGlobalKingstonHR.templateName);
            expect(await previewCaseTemplatePo.isLabelTitleDisplayed('Case Summary')).toBeTruthy('Case Summary label is missing');
            await previewCaseTemplatePo.clickOnBackButton();
            await selectCasetemplateBladePo.selectCaseTemplate(caseTemplateDataGlobalKingstonHR.templateName);

            expect(await createCasePage.getCategoryTier1Value()).toBe('Employee Relations');
            expect(await createCasePage.getCategoryTier2Value()).toBe('Compensation');
            expect(await createCasePage.getCategoryTier3Value()).toBe('Bonus');
            expect(await createCasePage.getAssigneeBusinessUnitValue()).toBe('Kingston HR');
            expect(await createCasePage.getAssigneeGroupValue()).toBe('Kingston AskHR');
            expect(await createCasePage.getAssigneeValue()).toBe('Samara Moran');

            await createCasePage.clickSaveCaseButton();
            await casePreviewPo.clickGoToCaseButton();
            caseIdKingstoneHR = await viewCasePage.getCaseID();
        });

        it('[12033]: Verify Edit Case Page', async () => {
            await viewCasePage.clickEditCaseButton();
            expect(await editCasePo.isLineOfBusinessReadOnly()).toBeTruthy('Line of business is not readonly');
            await editCasePo.updateCaseCategoryTier1('Total Rewards');
            await editCasePo.updateCaseCategoryTier2('Benefits');
            await editCasePo.updateCaseCategoryTier3('Beneficiaries');

            await editCasePo.clickOnChangeCaseTemplate();
            await selectCasetemplateBladePo.clickOnAllTemplateTab();
            expect(await utilityGrid.isGridRecordPresent(caseTemplateDataKingstoneHR.templateName)).toBeTruthy('caseTemplateDataKingstoneHR is missing');
            expect(await utilityGrid.isGridRecordPresent(caseTemplateDataGlobalKingstonHR.templateName)).toBeTruthy('caseTemplateDataGlobalKingstonHR is missing');
            await selectCasetemplateBladePo.selectCaseTemplate(caseTemplateDataKingstoneHR.templateName);

            expect(await editCasePo.getCategoryTier1()).toBe('Workforce Administration');
            expect(await editCasePo.getCategoryTier2()).toBe('HR Operations');
            expect(await editCasePo.getCategoryTier3()).toBe('Adjustments');
            expect(await editCasePo.getAssigneeValue()).toBe('Sherri Ochoa');

            await editCasePo.clickChangeAssignmentButton();
            await changeAssignmentBladePo.setAssignee('Kingston AskHR', 'David Kramer');
            expect(await editCasePo.getAssigneeValue()).toBe('David Kramer');

            await editCasePo.clickSaveCase();
            await viewCasePage.clickAddTaskButton();
            await manageTaskBladePo.clickCloseButton();
            await viewCasePage.clickOnTaskLink(taskTemplateNameSummaryKingstoneHR);
        });

        it('[12033]: Create case With Oracle HR User and verify data', async () => {
            await navigationPage.gotoCaseConsole();
            await utilityGrid.selectLineOfBusiness('Oracle HR');
            await navigationPage.gotoCreateCase();
            await createCasePage.selectRequester('Vixie Paul');
            expect(await createCasePage.getLineOfBusinessValue()).toBe('Oracle HR');
            await createCasePage.setSummary('DRDMV23681CaseSummary');
            expect(await createCasePage.isCategoryTier1DropDownValueDisplayed('General Ledger')).toBeFalsy('General Ledger CategoryTier1 drop down value displayed');

            await createCasePage.clickSelectCaseTemplateButton();
            await selectCasetemplateBladePo.clickOnAllTemplateTab();
            expect(await utilityGrid.isGridRecordPresent(caseTemplateDataKingstoneHR.templateName)).toBeFalsy('caseTemplateDataKingstoneHR is missing');
            expect(await utilityGrid.isGridRecordPresent(caseTemplateDataGlobalKingstonHR.templateName)).toBeFalsy('caseTemplateDataGlobalKingstonHR is missing');
            await selectCasetemplateBladePo.clickOnCancelButton();

            await createCasePage.selectCategoryTier1('Total Rewards');
            await createCasePage.selectCategoryTier2('Leave');
            await createCasePage.selectCategoryTier3('Bereavement');
            await createCasePage.clickChangeAssignmentButton();
            await changeAssignmentBladePo.setAssignee('Oracle AskHR', 'Ueshiba Morihei');
            await createCasePage.clickSaveCaseButton();

            await casePreviewPo.clickGoToCaseButton();
            caseIdOracleHR = await viewCasePage.getCaseID();
        });

        it('[12033]: Verify KingstoneHR case access to Oracle HR LOB', async () => {
            await navigationPage.gotoCaseConsole();
            await utilityGrid.clearFilter();
            expect(await utilityGrid.isGridRecordPresent(caseIdOracleHR)).toBeTruthy('caseIdOracleHR Missing on grid');
            expect(await utilityGrid.isGridRecordPresent(caseIdKingstoneHR)).toBeFalsy('caseIdKingstoneHR Missing on grid');

            await utilityGrid.selectLineOfBusiness('Kingston HR');
            await utilityGrid.clearFilter();
            expect(await utilityGrid.isGridRecordPresent(caseIdOracleHR)).toBeFalsy('caseIdOracleHR Missing on grid');
            expect(await utilityGrid.isGridRecordPresent(caseIdKingstoneHR)).toBeTruthy('caseIdKingstoneHR Missing on grid');
        });

        afterAll(async () => {
            await navigationPage.signOut();
            await loginPage.login(kingstoneLegalUserName, password);
        });
    });

    //kiran
    describe('[12020]: [Service Provider Model][Create Case]: Verify the behavior when the case agent is able to create a case when one of the supporting organization supports a Line of Business for its own.', () => {
        let randomStr = [...Array(4)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        let caseTemplateDataKingstoneHR, caseTemplateDataGlobalKingstonHR, caseIdKingstoneLegal, caseIdFinance, caseTemplateDataGlobalKingstoneLegal, caseTemplateDataKingstoneLegal, caseTemplateDataGlobalFinanceBackOffice, caseTemplateDataFinanceBackOffice;
        let taskTemplateNameSummaryKingstoneLegal = "1taskTemplateNameSummaryDRDMV23760" + randomStr;
        let taskTemplateNameSummaryFinanceBackOffice = "2taskTemplateNameSummaryDRDMV23760" + randomStr;

        beforeAll(async () => {
            // Create Data with Kingston HR LOB
            await apiHelper.apiLogin(kingstoneLegalUserName, password);
            caseTemplateDataGlobalKingstoneLegal = {
                "templateName": 'GlobalcaseTemplateNameKingstoneLegal' + randomStr,
                "templateSummary": 'GlobalCaseTemplateSummaryKingstonLegal' + randomStr,
                "categoryTier1": 'Employee Relations',
                "categoryTier2": 'Compensation',
                "categoryTier3": 'Bonus',
                "casePriority": "Low",
                "templateStatus": "Active",
                "company": "- Global -",
                "businessUnit": "Kingston Legal",
                "supportGroup": "Legal Support",
                "assignee": "yhenny",
                "ownerBU": "Kingston Legal",
                "ownerGroup": "Legal Support",
                "lineOfBusiness": "Kingston Legal"
            }
            await apiHelper.createCaseTemplate(caseTemplateDataGlobalKingstoneLegal);

            caseTemplateDataKingstoneLegal = {
                "templateName": 'caseTemplateNameKingstonLegal' + randomStr,
                "templateSummary": 'caseTemplateSummaryKingstonLegal' + randomStr,
                "categoryTier1": 'Workforce Administration',
                "categoryTier2": 'HR Operations',
                "categoryTier3": 'Adjustments',
                "casePriority": "High",
                "templateStatus": "Active",
                "company": "Kingston",
                "businessUnit": "Kingston Legal",
                "supportGroup": "Legal Support",
                "assignee": "ytylershell",
                "ownerBU": "Kingston Legal",
                "ownerGroup": "Legal Support",
                "lineOfBusiness": "Kingston Legal"
            }
            let newCaseTemplate = await apiHelper.createCaseTemplate(caseTemplateDataKingstoneLegal);

            let taskTemplateDataSet = {
                "templateName": `${taskTemplateNameSummaryKingstoneLegal}`,
                "templateSummary": `${taskTemplateNameSummaryKingstoneLegal}`,
                "templateStatus": "Active",
                "taskCompany": 'Kingston',
                "assignee": "ytylershell",
                "businessUnit": "Kingston Legal",
                "supportGroup": "Legal Support",
                "ownerCompany": "Kingston",
                "ownerBusinessUnit": "Kingston Legal",
                "ownerGroup": "Legal Support",
                "lineOfBusiness": "Kingston Legal"
            }
            let manualTaskTemplate = await apiHelper.createManualTaskTemplate(taskTemplateDataSet);
            await apiHelper.associateCaseTemplateWithOneTaskTemplate(newCaseTemplate.displayId, manualTaskTemplate.displayId);

            // >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
            // Create data with Oracle Finance HR Data 
            await apiHelper.apiLogin(kingstoneOracleLOBUserName, password);
            caseTemplateDataGlobalFinanceBackOffice = {
                "templateName": 'GlobalcaseTemplateNameOracleHR' + randomStr,
                "templateSummary": 'GlobalCaseTemplateSummaryOracleHR' + randomStr,
                "categoryTier1": 'General Ledger',
                "categoryTier2": 'Expenses',
                "casePriority": "Low",
                "templateStatus": "Active",
                "company": "- Global -",
                "businessUnit": "Finance Back Office",
                "supportGroup": "Finance Back Support",
                "assignee": "wsteven",
                "ownerBU": "Finance Back Office",
                "ownerGroup": "Finance Back Support",
                "lineOfBusiness": "KingstonOracle Finance"
            }
            await apiHelper.createCaseTemplate(caseTemplateDataGlobalFinanceBackOffice);

            caseTemplateDataFinanceBackOffice = {
                "templateName": '2caseTemplateNameOracleHR' + randomStr,
                "templateSummary": '2caseTemplateSummaryOracleHR' + randomStr,
                "categoryTier1": 'General Ledger',
                "categoryTier2": 'Assets',
                "casePriority": "High",
                "templateStatus": "Active",
                "company": "Phyto",
                "businessUnit": "Finance Back Office",
                "supportGroup": "Finance Back Support",
                "assignee": "rtownsend",
                "ownerBU": "Finance Back Office",
                "ownerGroup": "Finance Back Support",
                "lineOfBusiness": "KingstonOracle Finance"
            }
            let newCaseTemplate2 = await apiHelper.createCaseTemplate(caseTemplateDataFinanceBackOffice);

            let taskTemplateDataSet2 = {
                "templateName": `${taskTemplateNameSummaryFinanceBackOffice}`,
                "templateSummary": `${taskTemplateNameSummaryFinanceBackOffice}`,
                "templateStatus": "Active",
                "taskCompany": 'Phyto',
                "assignee": "umorihei",
                "businessUnit": "Finance Back Office",
                "supportGroup": "Finance Back Support",
                "ownerCompany": "Phyto",
                "ownerBusinessUnit": "Finance Back Office",
                "ownerGroup": "Finance Back Support",
                "lineOfBusiness": "KingstonOracle Finance"
            }
            let manualTaskTemplate2 = await apiHelper.createManualTaskTemplate(taskTemplateDataSet2);
            await apiHelper.associateCaseTemplateWithOneTaskTemplate(newCaseTemplate2.displayId, manualTaskTemplate2.displayId);

            //>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
            // Create data with Kingston HR Data
            caseTemplateDataGlobalKingstonHR = {
                "templateName": 'GlobalcaseTemplateNameKingstonHR' + randomStr,
                "templateSummary": 'GlobalCaseTemplateSummaryKingstonHR' + randomStr,
                "categoryTier1": 'Employee Relations',
                "categoryTier2": 'Compensation',
                "categoryTier3": 'Bonus',
                "casePriority": "Low",
                "templateStatus": "Active",
                "company": "- Global -",
                "businessUnit": "Kingston HR",
                "supportGroup": "Kingston AskHR",
                "assignee": "smoran",
                "ownerBU": "Kingston HR",
                "ownerGroup": "Kingston AskHR",
                "lineOfBusiness": "Kingston HR"
            }
            await apiHelper.createCaseTemplate(caseTemplateDataGlobalKingstonHR);

            caseTemplateDataKingstoneHR = {
                "templateName": '2caseTemplateNameKingstonHR' + randomStr,
                "templateSummary": '2caseTemplateSummaryKingstonHR' + randomStr,
                "categoryTier1": 'Workforce Administration',
                "categoryTier2": 'HR Operations',
                "categoryTier3": 'Adjustments',
                "casePriority": "High",
                "templateStatus": "Active",
                "company": "Phyto",
                "businessUnit": "Kingston HR",
                "supportGroup": "Kingston AskHR",
                "assignee": "sochoa",
                "ownerBU": "Kingston HR",
                "ownerGroup": "Kingston AskHR",
                "lineOfBusiness": "Kingston HR"
            }
            await apiHelper.createCaseTemplate(caseTemplateDataKingstoneHR);
        });

        it('[12020]: Create case without case template', async () => {
            await navigationPage.gotoCaseConsole();
            await navigationPage.gotoCreateCase();
            await createCasePage.selectRequester('Young Neil');
            expect(await createCasePage.getCompany()).toBe('Kingston');
            expect(await createCasePage.getLineOfBusinessValue()).toBe('Kingston Legal');
            expect(await createCasePage.isLineOfBusinessDisabled).toBeTruthy('LOB is not disabled');
            await createCasePage.setSummary('DRDMV23760CaseSummary');
            await createCasePage.selectCategoryTier1('Workforce Administration');
            await createCasePage.selectCategoryTier2('HR Operations');
            await createCasePage.selectCategoryTier3('Adjustments');
            await createCasePage.clickChangeAssignmentButton();
            await changeAssignmentBladePo.setAssignee('Legal Support', 'Youngman Henny');

            // Verify  category of finance with kingston legal as it should not display
            expect(await createCasePage.isCategoryTier1DropDownValueDisplayed('General Ledger')).toBeFalsy('General Ledger CategoryTier1 drop down value displayed');

            expect(await createCasePage.getCategoryTier1Value()).toBe('Workforce Administration');
            expect(await createCasePage.getCategoryTier2Value()).toBe('HR Operations');
            expect(await createCasePage.getCategoryTier3Value()).toBe('Adjustments');

            expect(await createCasePage.getAssigneeBusinessUnitValue()).toBe('Kingston Legal');
            expect(await createCasePage.getAssigneeGroupValue()).toBe('Legal Support');
            expect(await createCasePage.getAssigneeValue()).toBe('Youngman Henny');

            // Verify negative scenario for Finance LOB for change assignment
            await createCasePage.clickChangeAssignmentButton();
            expect(await changeAssignmentBladePo.isValuePresentInDropDown("AssignedGroup", 'Finance Back Support')).toBeFalsy('Support Group is displayed');
            await changeAssignmentBladePo.clickOnCancelButton();

            // Verify negative scenario for Kingston HR LOB for change assignment
            await createCasePage.clickChangeAssignmentButton();
            expect(await changeAssignmentBladePo.isValuePresentInDropDown("AssignedGroup", 'Kingston AskHR')).toBeFalsy('Support Group is displayed');
            await changeAssignmentBladePo.clickOnCancelButton();

            await createCasePage.clickSaveCaseButton();
            expect(await casePreviewPo.getLineOfBusinessValue()).toBe('Kingston Legal');
            await casePreviewPo.clickOncreateNewCaseButton();
        });

        it('[12020]: Create case with case template', async () => {
            await createCasePage.selectRequester('Young Edward');
            expect(await createCasePage.getLineOfBusinessValue()).toBe('Kingston Legal');
            await createCasePage.setSummary('DRDMV23760CaseSummary');

            await createCasePage.clickSelectCaseTemplateButton();
            await selectCasetemplateBladePo.clickOnAllTemplateTab(); caseTemplateDataGlobalKingstoneLegal

            expect(await utilityGrid.isGridRecordPresent(caseTemplateDataKingstoneHR.templateName)).toBeFalsy('caseTemplateDataFinanceBackOffice is missing');
            expect(await utilityGrid.isGridRecordPresent(caseTemplateDataGlobalKingstonHR.templateName)).toBeFalsy('caseTemplateDataGlobalFinanceBackOffice is missing');

            expect(await utilityGrid.isGridRecordPresent(caseTemplateDataFinanceBackOffice.templateName)).toBeFalsy('caseTemplateDataFinanceBackOffice is missing');
            expect(await utilityGrid.isGridRecordPresent(caseTemplateDataGlobalFinanceBackOffice.templateName)).toBeFalsy('caseTemplateDataGlobalFinanceBackOffice is missing');

            expect(await utilityGrid.isGridRecordPresent(caseTemplateDataKingstoneLegal.templateName)).toBeTruthy('caseTemplateDataKingstoneLegal is missing');
            expect(await utilityGrid.isGridRecordPresent(caseTemplateDataGlobalKingstoneLegal.templateName)).toBeTruthy('caseTemplateDataGlobalKingstoneLegal is missing');

            await selectCasetemplateBladePo.searchAndOpenCaseTemplate(caseTemplateDataKingstoneLegal.templateName);
            expect(await previewCaseTemplatePo.isLabelTitleDisplayed('Case Summary')).toBeTruthy('Case Summary label is missing');
            await previewCaseTemplatePo.clickOnBackButton();
            await selectCasetemplateBladePo.selectCaseTemplate(caseTemplateDataGlobalKingstoneLegal.templateName);

            expect(await createCasePage.getCategoryTier1Value()).toBe('Employee Relations');
            expect(await createCasePage.getCategoryTier2Value()).toBe('Compensation');
            expect(await createCasePage.getCategoryTier3Value()).toBe('Bonus');

            expect(await createCasePage.getAssigneeBusinessUnitValue()).toBe('Kingston Legal');
            expect(await createCasePage.getAssigneeGroupValue()).toBe('Legal Support');
            expect(await createCasePage.getAssigneeValue()).toBe('Youngman Henny');

            expect(await createCasePage.isCategoryTier1DropDownValueDisplayed('General Ledger')).toBeFalsy('General Ledger CategoryTier1 drop down value displayed');

            // Verify negative scenario for Finance LOB for change assignment
            await createCasePage.clickChangeAssignmentButton();
            expect(await changeAssignmentBladePo.isValuePresentInDropDown("AssignedGroup", 'Finance Back Support')).toBeFalsy('Support Group is displayed');
            await changeAssignmentBladePo.clickOnCancelButton();

            await createCasePage.clickSaveCaseButton();
            await casePreviewPo.clickGoToCaseButton();
            caseIdKingstoneLegal = await viewCasePage.getCaseID();
        });

        it('[12020]: Verify Edit Case Page', async () => {
            await viewCasePage.clickEditCaseButton();
            expect(await editCasePo.isLineOfBusinessReadOnly()).toBeTruthy('Line of business is not readonly');
            await editCasePo.updateCaseCategoryTier1('Total Rewards');
            await editCasePo.updateCaseCategoryTier2('Benefits');
            await editCasePo.updateCaseCategoryTier3('Beneficiaries');

            // Verify  category of finance with kingston legal as it should not display
            expect(await editCasePo.isValuePresentInCategoryTier1('General Ledger')).toBeFalsy('General Ledger CategoryTier1 drop down value displayed');

            await editCasePo.clickOnChangeCaseTemplate();
            await selectCasetemplateBladePo.clickOnAllTemplateTab();

            expect(await utilityGrid.isGridRecordPresent(caseTemplateDataKingstoneHR.templateName)).toBeFalsy('caseTemplateDataFinanceBackOffice is missing');
            expect(await utilityGrid.isGridRecordPresent(caseTemplateDataGlobalKingstonHR.templateName)).toBeFalsy('caseTemplateDataGlobalFinanceBackOffice is missing');

            expect(await utilityGrid.isGridRecordPresent(caseTemplateDataFinanceBackOffice.templateName)).toBeFalsy('caseTemplateDataFinanceBackOffice is missing');
            expect(await utilityGrid.isGridRecordPresent(caseTemplateDataGlobalFinanceBackOffice.templateName)).toBeFalsy('caseTemplateDataGlobalFinanceBackOffice is missing');

            expect(await utilityGrid.isGridRecordPresent(caseTemplateDataKingstoneLegal.templateName)).toBeTruthy('caseTemplateDataKingstoneLegal is missing');
            expect(await utilityGrid.isGridRecordPresent(caseTemplateDataGlobalKingstoneLegal.templateName)).toBeTruthy('caseTemplateDataGlobalKingstoneLegal is missing');
            await selectCasetemplateBladePo.selectCaseTemplate(caseTemplateDataKingstoneLegal.templateName);

            expect(await editCasePo.getCategoryTier1()).toBe('Workforce Administration');
            expect(await editCasePo.getCategoryTier2()).toBe('HR Operations');
            expect(await editCasePo.getCategoryTier3()).toBe('Adjustments');

            expect(await editCasePo.getAssigneeValue()).toBe('Young Tyler Shell');

            await editCasePo.clickChangeAssignmentButton();
            await changeAssignmentBladePo.setAssignee('Legal Support', 'Young Neil');
            expect(await editCasePo.getAssigneeValue()).toBe('Young Neil');

            await editCasePo.clickSaveCase();
            await viewCasePage.clickAddTaskButton();
            await manageTaskBladePo.clickAddAdhocTaskButton();
            await createAdhocTaskPo.setSummary('adhocTaskSummary1');
            expect(await createAdhocTaskPo.getLineOfBussinessValue()).toBe('Kingston Legal');
            await createAdhocTaskPo.clickSaveAdhoctask();
            await manageTaskBladePo.clickCloseButton();
            await viewCasePage.clickOnTaskLink(taskTemplateNameSummaryKingstoneLegal);
        });

        it('[12020]: Login And Create case With Finance Back Office User and verify data', async () => {
            await navigationPage.signOut();
            await loginPage.login(financeBackOfficeUserName, password);
            await navigationPage.gotoCaseConsole();
            await navigationPage.gotoCreateCase();
            await createCasePage.selectRequester('Wright Steven');
            expect(await createCasePage.getLineOfBusinessValue()).toBe('KingstonOracle Finance');
            await createCasePage.setSummary('DRDMV23760CaseSummary');
            expect(await createCasePage.isCategoryTier1DropDownValueDisplayed('General Ledger')).toBeTruthy('General Ledger CategoryTier1 drop down value displayed');

            await createCasePage.clickSelectCaseTemplateButton();
            await selectCasetemplateBladePo.clickOnAllTemplateTab();
            expect(await utilityGrid.isGridRecordPresent(caseTemplateDataKingstoneLegal.templateName)).toBeFalsy('caseTemplateDataKingstoneLegal is missing');
            expect(await utilityGrid.isGridRecordPresent(caseTemplateDataGlobalKingstoneLegal.templateName)).toBeFalsy('caseTemplateDataGlobalKingstoneLegal is missing');

            expect(await utilityGrid.isGridRecordPresent(caseTemplateDataFinanceBackOffice.templateName)).toBeTruthy('caseTemplateDataFinanceBackOffice is missing');
            expect(await utilityGrid.isGridRecordPresent(caseTemplateDataGlobalFinanceBackOffice.templateName)).toBeTruthy('caseTemplateDataGlobalFinanceBackOffice is missing');


            await selectCasetemplateBladePo.searchAndOpenCaseTemplate(caseTemplateDataFinanceBackOffice.templateName);
            expect(await previewCaseTemplatePo.isLabelTitleDisplayed('Case Summary')).toBeTruthy('Case Summary label is missing');
            await previewCaseTemplatePo.clickOnBackButton();
            await selectCasetemplateBladePo.selectCaseTemplate(caseTemplateDataFinanceBackOffice.templateName);

            expect(await createCasePage.getCategoryTier1Value()).toBe('General Ledger');
            expect(await createCasePage.getCategoryTier2Value()).toBe('Assets');

            expect(await createCasePage.getAssigneeBusinessUnitValue()).toBe('Finance Back Office');
            expect(await createCasePage.getAssigneeGroupValue()).toBe('Finance Back Support');
            expect(await createCasePage.getAssigneeValue()).toBe('Russell Townsend');

            expect(await createCasePage.isCategoryTier1DropDownValueDisplayed('Total Rewards')).toBeFalsy('Total Rewards CategoryTier1 drop down value displayed');
            // Verify negative scenario for Finance LOB for change assignment
            await createCasePage.clickChangeAssignmentButton();
            expect(await changeAssignmentBladePo.isValuePresentInDropDown("AssignedGroup", 'Legal Support')).toBeFalsy('Support Group is displayed');
            await changeAssignmentBladePo.clickOnCancelButton();

            // Verify negative scenario for Kingston HR LOB for change assignment
            await createCasePage.clickChangeAssignmentButton();
            await changeAssignmentBladePo.setDropDownValue('AssignedGroup', 'Kingston AskHR');
            expect(await changeAssignmentBladePo.isValuePresentInDropDown("Assignee", 'Samara Moran')).toBeFalsy('BU is diaplayed');
            await changeAssignmentBladePo.clickOnCancelButton();

            await createCasePage.clickSaveCaseButton();
            await casePreviewPo.clickGoToCaseButton();

            caseIdFinance = await viewCasePage.getCaseID();
            await viewCasePage.clickOnTaskLink(taskTemplateNameSummaryFinanceBackOffice);
        });

        it('[12020]: Verify KingstoneHR case access to Oracle HR LOB', async () => {
            await navigationPage.gotoCaseConsole();
            await utilityGrid.clearFilter();
            expect(await utilityGrid.isGridRecordPresent(caseIdFinance)).toBeTruthy('caseIdFinance Missing on grid');
            expect(await utilityGrid.isGridRecordPresent(caseIdKingstoneLegal)).toBeFalsy('caseIdKingstoneLegal Missing on grid');

            await navigationPage.signOut();
            await loginPage.login(kingstoneLegalUserName, password);

            await utilityGrid.clearFilter();
            expect(await utilityGrid.isGridRecordPresent(caseIdFinance)).toBeFalsy('caseIdFinance Missing on grid');
            expect(await utilityGrid.isGridRecordPresent(caseIdKingstoneLegal)).toBeTruthy('caseIdKingstoneLegal Missing on grid');
        });

        afterAll(async () => {
            await navigationPage.signOut();
            await loginPage.login(kingstoneOracleLOBUserName, password);
        });
    });

    //kiran
    describe('[12024]: [Service Provider Model][Create Case]: Verify the behavior when the case agent is able to create a case when a single line of business is shared between multiple organizations', () => {
        let randomStr = [...Array(4)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        let caseTemplateDataFinanceBackOffice, caseTemplateDataGlobalFinanceBackOffice, caseIdFinance, caseIdOracleHR, caseTemplateDataOracleHR, caseTemplateDataGlobalOracleHR, caseTemplateDataGlobalKingstoneLegal, caseTemplateDataKingstoneLegal, knowledgeSetData, KADetails;

        let taskTemplateNameSummaryFinanceBackOffice = "1taskTemplateNameSummaryDRDMV23744" + randomStr;
        let taskTemplateNameSummaryOracleHR = "3taskTemplateNameSummaryDRDMV23744" + randomStr;
        let knowledgeTitle = "3knowledgeTitleDRDMV23744" + randomStr;
        let summary = "DRDMV23744Summary" + randomStr;

        beforeAll(async () => {
            // Create Data with Finance LOB
            await apiHelper.apiLogin(kingstoneOracleLOBUserName, password);

            caseTemplateDataGlobalFinanceBackOffice = {
                "templateName": 'GlobalcaseTemplateNameFinanceBackOffice' + randomStr,
                "templateSummary": 'GlobalCaseTemplateSummaryFinanceBackOffice' + randomStr,
                "categoryTier1": 'General Ledger',
                "categoryTier2": 'Expenses',
                "casePriority": "Low",
                "templateStatus": "Active",
                "company": "- Global -",
                "businessUnit": "Finance Back Office",
                "supportGroup": "Finance Back Support",
                "assignee": "wsteven",
                "ownerBU": "Finance Back Office",
                "ownerGroup": "Finance Back Support",
                "lineOfBusiness": "KingstonOracle Finance"
            }
            await apiHelper.createCaseTemplate(caseTemplateDataGlobalFinanceBackOffice);

            caseTemplateDataFinanceBackOffice = {
                "templateName": '2caseTemplateNameFinanceBackOffice' + randomStr,
                "templateSummary": '2caseTemplateSummaryFinanceBackOffice' + randomStr,
                "categoryTier1": 'General Ledger',
                "categoryTier2": 'Assets',
                "casePriority": "High",
                "templateStatus": "Active",
                "company": "Phyto",
                "businessUnit": "Finance Back Office",
                "supportGroup": "Finance Back Support",
                "assignee": "wfranklloyd",
                "ownerBU": "Finance Back Office",
                "ownerGroup": "Finance Back Support",
                "lineOfBusiness": "KingstonOracle Finance"
            }
            let newCaseTemplate = await apiHelper.createCaseTemplate(caseTemplateDataFinanceBackOffice);

            let taskTemplateDataSet = {
                "templateName": `${taskTemplateNameSummaryFinanceBackOffice}`,
                "templateSummary": `${taskTemplateNameSummaryFinanceBackOffice}`,
                "templateStatus": "Active",
                "taskCompany": 'Phyto',
                "assignee": "wfranklloyd",
                "businessUnit": "Finance Back Office",
                "supportGroup": "Finance Back Support",
                "ownerCompany": "Phyto",
                "ownerBusinessUnit": "Finance Back Office",
                "ownerGroup": "Finance Back Support",
                "lineOfBusiness": "KingstonOracle Finance"
            }
            let manualTaskTemplate = await apiHelper.createManualTaskTemplate(taskTemplateDataSet);
            await apiHelper.associateCaseTemplateWithOneTaskTemplate(newCaseTemplate.displayId, manualTaskTemplate.displayId);

            //>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
            // Create data knowledge set for KingstonOracle Finance 
            knowledgeSetData = {
                'knowledgeSetTitle': 'KASetPhyto' + randomStr,
                'knowledgeSetDesc': 'KAPsilon_Desc' + randomStr,
                'company': 'Phyto',
                "lineOfBusiness": "KingstonOracle Finance"
            }
            await apiHelper.createKnowledgeSet(knowledgeSetData);

            // >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
            // Create data with Oracle HR Data
            caseTemplateDataGlobalOracleHR = {
                "templateName": 'GlobalcaseTemplateNameOracleHR' + randomStr,
                "templateSummary": 'GlobalCaseTemplateSummaryOracleHR' + randomStr,
                "categoryTier1": 'Employee Relations',
                "categoryTier2": 'Compensation',
                "categoryTier3": 'Bonus',
                "casePriority": "Low",
                "templateStatus": "Active",
                "company": "- Global -",
                "businessUnit": "Oracle HR",
                "supportGroup": "Oracle AskHR",
                "assignee": "umiguelde",
                "ownerBU": "Oracle HR",
                "ownerGroup": "Oracle AskHR",
                "lineOfBusiness": "Oracle HR"
            }
            await apiHelper.createCaseTemplate(caseTemplateDataGlobalOracleHR);

            caseTemplateDataOracleHR = {
                "templateName": '2caseTemplateNameOracleHR' + randomStr,
                "templateSummary": '2caseTemplateSummaryOracleHR' + randomStr,
                "categoryTier1": 'Workforce Administration',
                "categoryTier2": 'HR Operations',
                "categoryTier3": 'Adjustments',
                "casePriority": "High",
                "templateStatus": "Active",
                "company": "Phyto",
                "businessUnit": "Oracle HR",
                "supportGroup": "Oracle AskHR",
                "assignee": "umiguelde",
                "ownerBU": "Oracle HR",
                "ownerGroup": "Oracle AskHR",
                "lineOfBusiness": "Oracle HR"
            }
            let newCaseTemplate2 = await apiHelper.createCaseTemplate(caseTemplateDataOracleHR);

            let taskTemplateDataSet2 = {
                "templateName": `${taskTemplateNameSummaryOracleHR}`,
                "templateSummary": `${taskTemplateNameSummaryOracleHR}`,
                "templateStatus": "Active",
                "taskCompany": 'Phyto',
                "assignee": "umorihei",
                "businessUnit": "Oracle HR",
                "supportGroup": "Oracle AskHR",
                "ownerCompany": "Phyto",
                "ownerBusinessUnit": "Oracle HR",
                "ownerGroup": "Oracle AskHR",
                "lineOfBusiness": "Oracle HR"
            }
            let manualTaskTemplate2 = await apiHelper.createManualTaskTemplate(taskTemplateDataSet2);
            await apiHelper.associateCaseTemplateWithOneTaskTemplate(newCaseTemplate2.displayId, manualTaskTemplate2.displayId);

            // >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
            // Create data with Kingstone Legal Data
            await apiHelper.apiLogin(kingstoneLegalUserName, password);
            caseTemplateDataGlobalKingstoneLegal = {
                "templateName": 'GlobalcaseTemplateNameKingstoneLegal' + randomStr,
                "templateSummary": 'GlobalCaseTemplateSummaryKingstonLegal' + randomStr,
                "categoryTier1": 'Employee Relations',
                "categoryTier2": 'Compensation',
                "categoryTier3": 'Bonus',
                "casePriority": "Low",
                "templateStatus": "Active",
                "company": "- Global -",
                "businessUnit": "Kingston Legal",
                "supportGroup": "Legal Support",
                "assignee": "yhenny",
                "ownerBU": "Kingston Legal",
                "ownerGroup": "Legal Support",
                "lineOfBusiness": "Kingston Legal"
            }
            await apiHelper.createCaseTemplate(caseTemplateDataGlobalKingstoneLegal);

            caseTemplateDataKingstoneLegal = {
                "templateName": '3caseTemplateNameKingstonLegal' + randomStr,
                "templateSummary": '2caseTemplateSummaryKingstonLegal' + randomStr,
                "categoryTier1": 'Workforce Administration',
                "categoryTier2": 'HR Operations',
                "categoryTier3": 'Adjustments',
                "casePriority": "High",
                "templateStatus": "Active",
                "company": "Kingston",
                "businessUnit": "Kingston Legal",
                "supportGroup": "Legal Support",
                "assignee": "yhenny",
                "ownerBU": "Kingston Legal",
                "ownerGroup": "Legal Support",
                "lineOfBusiness": "Kingston Legal"
            }
            await apiHelper.createCaseTemplate(caseTemplateDataKingstoneLegal);
        });

        it('[12024]: Verify Negative Scenrio for Finance HR, Oracle HR and Kingston Leagal data but used Finance LOB for category diffrence', async () => {
            await navigationPage.gotoCaseConsole();
            await navigationPage.gotoCreateCase();
            await createCasePage.selectLineOfBusiness('KingstonOracle Finance');
            await createCasePage.selectRequester('Wright Steven');

            await createCasePage.setSummary('DRDMV23744CaseSummary');
            // Verify negative scenario for Kingston Legal and Kingston HR LOB case template should not display
            await createCasePage.clickSelectCaseTemplateButton();
            await selectCasetemplateBladePo.clickOnAllTemplateTab();

            expect(await utilityGrid.isGridRecordPresent(caseTemplateDataKingstoneLegal.templateName)).toBeFalsy('caseTemplateDataKingstoneHR is display');
            expect(await utilityGrid.isGridRecordPresent(caseTemplateDataGlobalKingstoneLegal.templateName)).toBeFalsy('caseTemplateDataGlobalKingstonHR is display');

            expect(await utilityGrid.isGridRecordPresent(caseTemplateDataOracleHR.templateName)).toBeFalsy('caseTemplateDataOracleHR.templateName is display');
            expect(await utilityGrid.isGridRecordPresent(caseTemplateDataGlobalOracleHR.templateName)).toBeFalsy('caseTemplateDataGlobalOracleHR.templateName is display');

            expect(await utilityGrid.isGridRecordPresent(caseTemplateDataGlobalFinanceBackOffice.templateName)).toBeTruthy('caseTemplateDataGlobalKingstoneLegal.templateName is missing');
            expect(await utilityGrid.isGridRecordPresent(caseTemplateDataFinanceBackOffice.templateName)).toBeTruthy('caseTemplateDataGlobalKingstoneLegal.templateName is missing');

            await selectCasetemplateBladePo.selectCaseTemplate(caseTemplateDataFinanceBackOffice.templateName);

            expect(await createCasePage.getCategoryTier1Value()).toBe('General Ledger');
            expect(await createCasePage.getCategoryTier2Value()).toBe('Assets');

            expect(await createCasePage.getAssigneeBusinessUnitValue()).toBe('Finance Back Office');
            expect(await createCasePage.getAssigneeGroupValue()).toBe('Finance Back Support');
            expect(await createCasePage.getAssigneeValue()).toBe('Wright Frank Lloyd');

            // Verify negative scenario for Kingston Legal LOB should not display
            expect(await createCasePage.isValuePresentInLineOfBusinessDropDown('Kingston Legal')).toBeFalsy('Kingston lob is displayed');

            // Verify negative scenario for Kingston Legal and Oracle HR LOB for change assignment
            await createCasePage.clickChangeAssignmentButton();
            expect(await changeAssignmentBladePo.isValuePresentInDropDown("AssignedGroup", 'Legal Support')).toBeFalsy('Support Group is displayed');
            await changeAssignmentBladePo.clickOnCancelButton();

            await createCasePage.clickChangeAssignmentButton();
            await changeAssignmentBladePo.setDropDownValue('AssignedGroup', 'Oracle AskHR');
            expect(await changeAssignmentBladePo.isValuePresentInDropDown("Assignee", 'Ueshiba Morihei')).toBeFalsy('Assignee name is displayed');
            await changeAssignmentBladePo.clickOnCancelButton();

            await createCasePage.clickChangeAssignmentButton();
            await changeAssignmentBladePo.setAssignee('Finance Back Support', 'Yourcenar Marguerite');

            expect(await createCasePage.getAssigneeValue()).toBe('Yourcenar Marguerite');

            // Change verify with change LOB and should be clear all selected values
            await createCasePage.selectLineOfBusiness('Oracle HR');

            expect(await createCasePage.getCategoryTier1Value()).toBe('Select');
            expect(await createCasePage.getCategoryTier2Value()).toBe('Select');
            expect(await createCasePage.getCategoryTier3Value()).toBe('Select');

            expect(await createCasePage.getAssigneeBusinessUnitValue()).toBe('');
            expect(await createCasePage.getAssigneeBusinessUnitValue()).toBe('');
            expect(await createCasePage.getAssigneeValue()).toBe('Select');

            expect(await createCasePage.isCategoryTier1DropDownValueDisplayed('General Ledger')).toBeFalsy('General Ledger CategoryTier1 drop down value display');
        });

        it('[12024]: Create case without case template', async () => {
            await navigationPage.gotoCaseConsole();
            await utilityGrid.selectLineOfBusiness('KingstonOracle Finance');
            await navigationPage.gotoCreateCase();
            await createCasePage.selectRequester('Wright Steven');
            await createCasePage.selectLineOfBusiness('KingstonOracle Finance');
            await createCasePage.setSummary(summary);
            await createCasePage.selectCategoryTier1('General Ledger');
            await createCasePage.selectCategoryTier2('Equity');
            await createCasePage.clickChangeAssignmentButton();
            await changeAssignmentBladePo.setAssignee('Finance Back Support', 'Wright Frank Lloyd');

            expect(await createCasePage.getCategoryTier1Value()).toBe('General Ledger');
            expect(await createCasePage.getCategoryTier2Value()).toBe('Equity');

            expect(await createCasePage.getAssigneeBusinessUnitValue()).toBe('Finance Back Office');
            expect(await createCasePage.getAssigneeGroupValue()).toBe('Finance Back Support');
            expect(await createCasePage.getAssigneeValue()).toBe('Wright Frank Lloyd');

            // Verify Kingston HR Category with finance LOB
            expect(await createCasePage.isCategoryTier1DropDownValueDisplayed('Total Rewards')).toBeFalsy('Employee Relations CategoryTier1 drop down value display');
            expect(await createCasePage.isCategoryTier1DropDownValueDisplayed('Benefits')).toBeFalsy('Compensation CategoryTier1 drop down value display');
            expect(await createCasePage.isCategoryTier1DropDownValueDisplayed('Adoption Assistance')).toBeFalsy('Bonus CategoryTier1 drop down value display');

            await createCasePage.clickSaveCaseButton();
            expect(await casePreviewPo.getLineOfBusinessValue()).toBe('KingstonOracle Finance');
            await casePreviewPo.clickOncreateNewCaseButton();
        });

        it('[12024]: Create case with case template', async () => {
            await createCasePage.selectRequester('Yourcenar Marguerite');
            expect(await createCasePage.getLineOfBusinessValue()).toBe('KingstonOracle Finance');
            await createCasePage.setSummary(summary);

            await createCasePage.clickSelectCaseTemplateButton();
            await selectCasetemplateBladePo.clickOnAllTemplateTab();

            expect(await utilityGrid.isGridRecordPresent(caseTemplateDataKingstoneLegal.templateName)).toBeFalsy('caseTemplateDataKingstoneHR is display');
            expect(await utilityGrid.isGridRecordPresent(caseTemplateDataGlobalKingstoneLegal.templateName)).toBeFalsy('caseTemplateDataGlobalKingstonHR is display');

            expect(await utilityGrid.isGridRecordPresent(caseTemplateDataOracleHR.templateName)).toBeFalsy('caseTemplateDataOracleHR.templateName is display');
            expect(await utilityGrid.isGridRecordPresent(caseTemplateDataGlobalOracleHR.templateName)).toBeFalsy('caseTemplateDataGlobalOracleHR.templateName is display');

            expect(await utilityGrid.isGridRecordPresent(caseTemplateDataGlobalFinanceBackOffice.templateName)).toBeTruthy('caseTemplateDataGlobalKingstoneLegal.templateName is missing');
            expect(await utilityGrid.isGridRecordPresent(caseTemplateDataFinanceBackOffice.templateName)).toBeTruthy('caseTemplateDataGlobalKingstoneLegal.templateName is missing');

            await selectCasetemplateBladePo.searchAndOpenCaseTemplate(caseTemplateDataFinanceBackOffice.templateName);
            expect(await previewCaseTemplatePo.isLabelTitleDisplayed('Case Summary')).toBeTruthy('Case Summary label is missing');
            await previewCaseTemplatePo.clickOnBackButton();
            await selectCasetemplateBladePo.selectCaseTemplate(caseTemplateDataGlobalFinanceBackOffice.templateName);

            expect(await createCasePage.getCategoryTier1Value()).toBe('General Ledger');
            expect(await createCasePage.getCategoryTier2Value()).toBe('Expenses');

            expect(await createCasePage.getAssigneeBusinessUnitValue()).toBe('Finance Back Office');
            expect(await createCasePage.getAssigneeGroupValue()).toBe('Finance Back Support');
            expect(await createCasePage.getAssigneeValue()).toBe('Wright Steven');

            await createCasePage.clickSaveCaseButton();
            await casePreviewPo.clickGoToCaseButton();
            caseIdFinance = await viewCasePage.getCaseID();
        });

        it('[12024]: Verify Edit Case Page', async () => {
            await viewCasePage.clickEditCaseButton();
            expect(await editCasePo.isLineOfBusinessReadOnly()).toBeTruthy('Line of business is not readonly');
            await editCasePo.updateCaseCategoryTier1('Accounts Receivable');
            await editCasePo.updateCaseCategoryTier2('Collection');
            await editCasePo.updateCaseCategoryTier3('Past Due');

            await editCasePo.clickOnChangeCaseTemplate();
            await selectCasetemplateBladePo.clickOnAllTemplateTab();


            expect(await utilityGrid.isGridRecordPresent(caseTemplateDataKingstoneLegal.templateName)).toBeFalsy('caseTemplateDataKingstoneHR is display');
            expect(await utilityGrid.isGridRecordPresent(caseTemplateDataGlobalKingstoneLegal.templateName)).toBeFalsy('caseTemplateDataGlobalKingstonHR is display');

            expect(await utilityGrid.isGridRecordPresent(caseTemplateDataOracleHR.templateName)).toBeFalsy('caseTemplateDataOracleHR.templateName is display');
            expect(await utilityGrid.isGridRecordPresent(caseTemplateDataGlobalOracleHR.templateName)).toBeFalsy('caseTemplateDataGlobalOracleHR.templateName is display');

            expect(await utilityGrid.isGridRecordPresent(caseTemplateDataGlobalFinanceBackOffice.templateName)).toBeTruthy('caseTemplateDataGlobalKingstoneLegal.templateName is missing');
            expect(await utilityGrid.isGridRecordPresent(caseTemplateDataFinanceBackOffice.templateName)).toBeTruthy('caseTemplateDataGlobalKingstoneLegal.templateName is missing');

            await selectCasetemplateBladePo.selectCaseTemplate(caseTemplateDataFinanceBackOffice.templateName);

            expect(await editCasePo.getCategoryTier1()).toBe('General Ledger');
            expect(await editCasePo.getCategoryTier2()).toBe('Assets');
            expect(await editCasePo.getAssigneeValue()).toBe('Wright Frank Lloyd');

            await editCasePo.clickChangeAssignmentButton();
            await changeAssignmentBladePo.setAssignee('Finance Back Support', 'Jack Torrance');
            expect(await editCasePo.getAssigneeValue()).toBe('Jack Torrance');

            await editCasePo.clickSaveCase();
            await viewCasePage.clickAddTaskButton();
            await manageTaskBladePo.clickCloseButton();
            await viewCasePage.clickOnTaskLink(taskTemplateNameSummaryFinanceBackOffice);
        });

        it('[12024]: create knowledge article', async () => {
            await navigationPage.gotoCreateKnowledge();
            await createKnowledgePage.clickOnTemplate('Reference');
            await createKnowledgePage.clickOnUseSelectedTemplateButton();
            await createKnowledgePage.addTextInKnowlegeTitleField(knowledgeTitle);
            await createKnowledgePage.selectKnowledgeSet(knowledgeSetData.knowledgeSetTitle);
            await createKnowledgePage.clickOnSaveKnowledgeButton();
            await previewKnowledgePo.clickGoToArticleButton();
            await editKnowledgePo.setKnowledgeStatus('Draft');
            await utilityCommon.closePopUpMessage();
            await editKnowledgePo.setKnowledgeStatus('Publish Approval');
        });

        it('[12024]: Verify with Resources Tab  with case', async () => {
            await utilityCommon.closeAllBlades();
            await navigationPage.gotoCaseConsole();
            await caseConsolePo.searchAndOpenCase(caseIdFinance);

            await viewCasePage.clickOnTab('Resources');
            await resourcesTabPo.clickOnAdvancedSearchOptions();
            await resourcesTabPo.searchTextAndEnter(knowledgeTitle);
            await resourcesTabPo.searchTextAndEnter(knowledgeTitle);
            await expect(await resourcesTabPo.getAdvancedSearchResultForParticularSection(knowledgeTitle)).toEqual(knowledgeTitle);
            await expect(await resourcesTabPo.getAdvancedSearchResultForParticularSection(summary)).toEqual(summary);
        });
        it('[12024]: Create case With Oracle HR User and verify data', async () => {
            await navigationPage.gotoCaseConsole();
            await utilityGrid.selectLineOfBusiness('Oracle HR');
            await navigationPage.gotoCreateCase();
            await createCasePage.selectRequester('Vixie Paul');
            expect(await createCasePage.getLineOfBusinessValue()).toBe('Oracle HR');
            await createCasePage.setSummary('DRDMV23744Summary');
            expect(await createCasePage.isCategoryTier1DropDownValueDisplayed('General Ledger')).toBeFalsy('General Ledger CategoryTier1 drop down value displayed');

            await createCasePage.clickSelectCaseTemplateButton();
            await selectCasetemplateBladePo.clickOnAllTemplateTab();

            expect(await utilityGrid.isGridRecordPresent(caseTemplateDataKingstoneLegal.templateName)).toBeFalsy('caseTemplateDataKingstoneHR is display');
            expect(await utilityGrid.isGridRecordPresent(caseTemplateDataGlobalKingstoneLegal.templateName)).toBeFalsy('caseTemplateDataGlobalKingstonHR is display');

            expect(await utilityGrid.isGridRecordPresent(caseTemplateDataGlobalFinanceBackOffice.templateName)).toBeFalsy('caseTemplateDataGlobalKingstoneLegal.templateName is display');
            expect(await utilityGrid.isGridRecordPresent(caseTemplateDataFinanceBackOffice.templateName)).toBeFalsy('caseTemplateDataGlobalKingstoneLegal.templateName is display');

            expect(await utilityGrid.isGridRecordPresent(caseTemplateDataOracleHR.templateName)).toBeTruthy('caseTemplateDataOracleHR.templateName is missing');
            expect(await utilityGrid.isGridRecordPresent(caseTemplateDataGlobalOracleHR.templateName)).toBeTruthy('caseTemplateDataGlobalOracleHR.templateName is missing');

            await selectCasetemplateBladePo.selectCaseTemplate(caseTemplateDataOracleHR.templateName);

            expect(await createCasePage.getCategoryTier1Value()).toBe('Workforce Administration');
            expect(await createCasePage.getCategoryTier2Value()).toBe('HR Operations');
            expect(await createCasePage.getCategoryTier3Value()).toBe('Adjustments');

            expect(await createCasePage.getAssigneeBusinessUnitValue()).toBe('Oracle HR');
            expect(await createCasePage.getAssigneeGroupValue()).toBe('Oracle AskHR');
            expect(await createCasePage.getAssigneeValue()).toBe('Unamuno Miguel de');

            // Verify negative scenario for Kingston Legal and Finance HR LOB for change assignment
            await createCasePage.clickChangeAssignmentButton();
            expect(await changeAssignmentBladePo.isValuePresentInDropDown("AssignedGroup", 'Legal Support')).toBeFalsy('Support Group is displayed');
            await changeAssignmentBladePo.clickOnCancelButton();

            await createCasePage.clickChangeAssignmentButton();
            await changeAssignmentBladePo.setDropDownValue('AssignedGroup', 'Finance Back Support');
            expect(await changeAssignmentBladePo.isValuePresentInDropDown("Assignee", 'Wright Steven')).toBeFalsy('Assignee name is displayed');
            await changeAssignmentBladePo.clickOnCancelButton();

            await createCasePage.clickSaveCaseButton();

            await casePreviewPo.clickGoToCaseButton();
            caseIdOracleHR = await viewCasePage.getCaseID();
            await viewCasePage.clickOnTaskLink(taskTemplateNameSummaryOracleHR);
            await viewTaskPo.clickOnViewCase();
        });

        it('[12024]: Verify Knowledge Article and case with Resources Tab', async () => {
            await viewCasePage.clickOnTab('Resources');
            await resourcesTabPo.clickOnAdvancedSearchOptions();
            await resourcesTabPo.searchTextAndEnter(knowledgeTitle);
            await browser.sleep(3000); // wait untile result gets reflect
            await expect(await resourcesTabPo.getAdvancedSearchResultForParticularSection(knowledgeTitle)).toEqual(undefined);
            await expect(await resourcesTabPo.getAdvancedSearchResultForParticularSection(summary)).toEqual(undefined);
        });

        it('[12024]: Verify KingstoneHR case access to Oracle HR LOB', async () => {
            await navigationPage.gotoCaseConsole();
            await utilityGrid.selectLineOfBusiness('Oracle HR');
            await utilityGrid.clearFilter();
            expect(await utilityGrid.isGridRecordPresent(caseIdOracleHR)).toBeTruthy('caseIdOracleHR Missing on grid');
            expect(await utilityGrid.isGridRecordPresent(caseIdFinance)).toBeFalsy('caseIdKingstoneHR Missing on grid');

            await utilityGrid.selectLineOfBusiness('KingstonOracle Finance');
            await utilityGrid.clearFilter();
            expect(await utilityGrid.isGridRecordPresent(caseIdOracleHR)).toBeFalsy('caseIdOracleHR Missing on grid');
            expect(await utilityGrid.isGridRecordPresent(caseIdFinance)).toBeTruthy('caseIdKingstoneHR Missing on grid');
        });

        afterAll(async () => {
            await utilityCommon.closeAllBlades();
            await navigationPage.signOut();
            await loginPage.login(kingstoneHRUserName, password);
        });
    });

    //kiran
    describe('[12038]: [Service Provide Model][Create Case]: Verify the behavior when the case agent from service provider company is able to create a case for requester company', () => {
        let randomStr = [...Array(4)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        let knowledgeSetData, caseTemplateDataGlobalOracleHR, caseTemplateDataOracleHR, caseTemplateDataGlobalKingstonHR, caseTemplateDataKingstoneHR, caseIdKingstoneHR, caseIdOracleHR;
        let taskTemplateNameSummaryKingstoneHR = "1taskTemplateNameSummaryDRDMV23673" + randomStr;
        let taskTemplateNameSummaryOracleHR = "2taskTemplateNameSummaryDRDMV23673" + randomStr;
        let summary = 'DRDMV23673CaseSummary';
        let knowledgeTitle = "KATitleDRDMV23673" + randomStr;

        beforeAll(async () => {
            // Create Data with Kingston HR LOB
            await apiHelper.apiLogin(kingstoneHRUserName, password);
            caseTemplateDataGlobalKingstonHR = {
                "templateName": 'GlobalcaseTemplateNameKingstonHR' + randomStr,
                "templateSummary": 'GlobalCaseTemplateSummaryKingstonHR' + randomStr,
                "categoryTier1": 'Employee Relations',
                "categoryTier2": 'Compensation',
                "categoryTier3": 'Bonus',
                "casePriority": "Low",
                "templateStatus": "Active",
                "company": "- Global -",
                "businessUnit": "Kingston HR",
                "supportGroup": "Kingston AskHR",
                "assignee": "smoran",
                "ownerBU": "Kingston HR",
                "ownerGroup": "Kingston AskHR",
                "lineOfBusiness": "Kingston HR"
            }
            await apiHelper.createCaseTemplate(caseTemplateDataGlobalKingstonHR);

            caseTemplateDataKingstoneHR = {
                "templateName": '2caseTemplateNameKingstonHR' + randomStr,
                "templateSummary": '2caseTemplateSummaryKingstonHR' + randomStr,
                "categoryTier1": 'Workforce Administration',
                "categoryTier2": 'HR Operations',
                "categoryTier3": 'Adjustments',
                "casePriority": "High",
                "templateStatus": "Active",
                "company": "Phyto",
                "businessUnit": "Kingston HR",
                "supportGroup": "Kingston AskHR",
                "assignee": "sochoa",
                "ownerBU": "Kingston HR",
                "ownerGroup": "Kingston AskHR",
                "lineOfBusiness": "Kingston HR"
            }
            let newCaseTemplate = await apiHelper.createCaseTemplate(caseTemplateDataKingstoneHR);

            let taskTemplateDataSet = {
                "templateName": `${taskTemplateNameSummaryKingstoneHR}`,
                "templateSummary": `${taskTemplateNameSummaryKingstoneHR}`,
                "templateStatus": "Active",
                "taskCompany": 'Phyto',
                "assignee": "smoran",
                "businessUnit": "Kingston HR",
                "supportGroup": "Kingston AskHR",
                "ownerCompany": "Phyto",
                "ownerBusinessUnit": "Kingston HR",
                "ownerGroup": "Kingston AskHR",
                "lineOfBusiness": "Kingston HR"
            }
            let manualTaskTemplate = await apiHelper.createManualTaskTemplate(taskTemplateDataSet);
            await apiHelper.associateCaseTemplateWithOneTaskTemplate(newCaseTemplate.displayId, manualTaskTemplate.displayId);

            //>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
            // Create data knowledge set for KingstonOracle Finance 
            knowledgeSetData = {
                'knowledgeSetTitle': 'KASetPhyto' + randomStr,
                'knowledgeSetDesc': 'KAPhyto_Desc' + randomStr,
                'company': 'Phyto',
                "lineOfBusiness": "Kingston HR"
            }
            await apiHelper.createKnowledgeSet(knowledgeSetData);

            // >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
            // Create data with Oracle HR Data
            await apiHelper.apiLogin(oracleUserName, password);
            caseTemplateDataGlobalOracleHR = {
                "templateName": 'GlobalcaseTemplateNameOracleHR' + randomStr,
                "templateSummary": 'GlobalCaseTemplateSummaryOracleHR' + randomStr,
                "categoryTier1": 'Employee Relations',
                "categoryTier2": 'Compensation',
                "categoryTier3": 'Bonus',
                "casePriority": "Low",
                "templateStatus": "Active",
                "company": "- Global -",
                "businessUnit": "Oracle HR",
                "supportGroup": "Oracle AskHR",
                "assignee": "umiguelde",
                "ownerBU": "Oracle HR",
                "ownerGroup": "Oracle AskHR",
                "lineOfBusiness": "Oracle HR"
            }
            await apiHelper.createCaseTemplate(caseTemplateDataGlobalOracleHR);

            caseTemplateDataOracleHR = {
                "templateName": '2caseTemplateNameOracleHR' + randomStr,
                "templateSummary": '2caseTemplateSummaryOracleHR' + randomStr,
                "categoryTier1": 'Workforce Administration',
                "categoryTier2": 'HR Operations',
                "categoryTier3": 'Adjustments',
                "casePriority": "High",
                "templateStatus": "Active",
                "company": "Phyto",
                "businessUnit": "Oracle HR",
                "supportGroup": "Oracle AskHR",
                "assignee": "umiguelde",
                "ownerBU": "Oracle HR",
                "ownerGroup": "Oracle AskHR",
                "lineOfBusiness": "Oracle HR"
            }
            let newCaseTemplate2 = await apiHelper.createCaseTemplate(caseTemplateDataOracleHR);

            let taskTemplateDataSet2 = {
                "templateName": `${taskTemplateNameSummaryOracleHR}`,
                "templateSummary": `${taskTemplateNameSummaryOracleHR}`,
                "templateStatus": "Active",
                "taskCompany": 'Phyto',
                "assignee": "umorihei",
                "businessUnit": "Oracle HR",
                "supportGroup": "Oracle AskHR",
                "ownerCompany": "Phyto",
                "ownerBusinessUnit": "Oracle HR",
                "ownerGroup": "Oracle AskHR",
                "lineOfBusiness": "Oracle HR"
            }
            let manualTaskTemplate2 = await apiHelper.createManualTaskTemplate(taskTemplateDataSet2);
            await apiHelper.associateCaseTemplateWithOneTaskTemplate(newCaseTemplate2.displayId, manualTaskTemplate2.displayId);

        });

        it('[12038]: Create case without case template for Kingston HR', async () => {
            await navigationPage.gotoCaseConsole();
            await navigationPage.gotoCreateCase();
            await createCasePage.selectRequester('David Kramer');
            expect(await createCasePage.getCompany()).toBe('Phyto');
            expect(await createCasePage.getLineOfBusinessValue()).toBe('Kingston HR');
            expect(await createCasePage.isLineOfBusinessDisabled).toBeTruthy('LOB is not disabled');
            await createCasePage.setSummary(summary);
            await createCasePage.selectCategoryTier1('Workforce Administration');
            await createCasePage.selectCategoryTier2('HR Operations');
            await createCasePage.selectCategoryTier3('Adjustments');

            // Verify CategorTIer of Ericsson SAM LOB which don't have access to Kingston HR
            expect(await createCasePage.isCategoryTier1DropDownValueDisplayed('General Ledger')).toBeFalsy('General Ledger CategoryTier1 drop down value displayed');

            await createCasePage.clickChangeAssignmentButton();
            await changeAssignmentBladePo.setAssignee('Kingston AskHR', 'Sherri Ochoa');

            expect(await createCasePage.getCategoryTier1Value()).toBe('Workforce Administration');
            expect(await createCasePage.getCategoryTier2Value()).toBe('HR Operations');
            expect(await createCasePage.getCategoryTier3Value()).toBe('Adjustments');

            expect(await createCasePage.getAssigneeBusinessUnitValue()).toBe('Kingston HR');
            expect(await createCasePage.getAssigneeGroupValue()).toBe('Kingston AskHR');
            expect(await createCasePage.getAssigneeValue()).toBe('Sherri Ochoa');

            // Verify negative scenario for Ericsson SAM LOB for change assignment
            await createCasePage.clickChangeAssignmentButton();
            await changeAssignmentBladePo.setDropDownValue('AssignedGroup', 'Oracle AskHR');
            expect(await changeAssignmentBladePo.isValuePresentInDropDown("Assignee", 'Unamuno Miguel de')).toBeFalsy('Assignee is diaplayed');
            await changeAssignmentBladePo.clickOnCancelButton();

            await createCasePage.clickSaveCaseButton();
            expect(await casePreviewPo.getLineOfBusinessValue()).toBe('Kingston HR');
            await casePreviewPo.clickOncreateNewCaseButton();
        });

        it('[12038]: Create case with case template for Kingston HR', async () => {
            await createCasePage.selectRequester('Stuart Rexroad');
            expect(await createCasePage.getLineOfBusinessValue()).toBe('Kingston HR');
            await createCasePage.setSummary(summary);

            await createCasePage.clickSelectCaseTemplateButton();
            await selectCasetemplateBladePo.clickOnAllTemplateTab();

            expect(await utilityGrid.isGridRecordPresent(caseTemplateDataGlobalOracleHR.templateName)).toBeFalsy('caseTemplateDataGlobalEricssonSAM is display');
            expect(await utilityGrid.isGridRecordPresent(caseTemplateDataOracleHR.templateName)).toBeFalsy('caseTemplateDataEricssonSAM is display');

            expect(await utilityGrid.isGridRecordPresent(caseTemplateDataKingstoneHR.templateName)).toBeTruthy('caseTemplateDataKingstoneHR is missing');
            expect(await utilityGrid.isGridRecordPresent(caseTemplateDataGlobalKingstonHR.templateName)).toBeTruthy('caseTemplateDataGlobalKingstonHR is missing');

            await selectCasetemplateBladePo.searchAndOpenCaseTemplate(caseTemplateDataGlobalKingstonHR.templateName);
            expect(await previewCaseTemplatePo.isLabelTitleDisplayed('Case Summary')).toBeTruthy('Case Summary label is missing');
            await previewCaseTemplatePo.clickOnBackButton();
            await selectCasetemplateBladePo.selectCaseTemplate(caseTemplateDataGlobalKingstonHR.templateName);

            expect(await createCasePage.getCategoryTier1Value()).toBe('Employee Relations');
            expect(await createCasePage.getCategoryTier2Value()).toBe('Compensation');
            expect(await createCasePage.getCategoryTier3Value()).toBe('Bonus');

            expect(await createCasePage.getAssigneeBusinessUnitValue()).toBe('Kingston HR');
            expect(await createCasePage.getAssigneeGroupValue()).toBe('Kingston AskHR');
            expect(await createCasePage.getAssigneeValue()).toBe('Samara Moran');

            await createCasePage.clickSaveCaseButton();
            await casePreviewPo.clickGoToCaseButton();
            caseIdKingstoneHR = await viewCasePage.getCaseID();
        });

        it('[12038]: Verify Edit Case Page', async () => {
            await viewCasePage.clickEditCaseButton();
            expect(await editCasePo.isLineOfBusinessReadOnly()).toBeTruthy('Line of business is not readonly');
            await editCasePo.updateCaseCategoryTier1('Total Rewards');
            await editCasePo.updateCaseCategoryTier2('Benefits');
            await editCasePo.updateCaseCategoryTier3('Beneficiaries');

            await editCasePo.clickOnChangeCaseTemplate();
            await selectCasetemplateBladePo.clickOnAllTemplateTab();
            expect(await utilityGrid.isGridRecordPresent(caseTemplateDataGlobalOracleHR.templateName)).toBeFalsy('caseTemplateDataGlobalOracleHR is display');
            expect(await utilityGrid.isGridRecordPresent(caseTemplateDataOracleHR.templateName)).toBeFalsy('caseTemplateDataGlobalOracleHR is display');

            expect(await utilityGrid.isGridRecordPresent(caseTemplateDataKingstoneHR.templateName)).toBeTruthy('caseTemplateDataKingstoneHR is missing');
            expect(await utilityGrid.isGridRecordPresent(caseTemplateDataGlobalKingstonHR.templateName)).toBeTruthy('caseTemplateDataGlobalKingstonHR is missing');

            await selectCasetemplateBladePo.searchAndOpenCaseTemplate(caseTemplateDataGlobalKingstonHR.templateName);
            expect(await previewCaseTemplatePo.isLabelTitleDisplayed('Case Summary')).toBeTruthy('Case Summary label is missing');
            await previewCaseTemplatePo.clickOnBackButton();
            await selectCasetemplateBladePo.selectCaseTemplate(caseTemplateDataKingstoneHR.templateName);

            expect(await editCasePo.getCategoryTier1()).toBe('Workforce Administration');
            expect(await editCasePo.getCategoryTier2()).toBe('HR Operations');
            expect(await editCasePo.getCategoryTier3()).toBe('Adjustments');

            expect(await editCasePo.getAssigneeValue()).toBe('Sherri Ochoa');

            await editCasePo.clickChangeAssignmentButton();
            await changeAssignmentBladePo.setAssignee('Kingston AskHR', 'Jack Torrance');
            expect(await editCasePo.getAssigneeValue()).toBe('Jack Torrance');

            // Verify CategorTIer of Ericsson SAM LOB which don't have access to Kingston HR
            expect(await editCasePo.isValuePresentInCategoryTier1('General Ledger')).toBeFalsy('General Ledger CategoryTier1 drop down value displayed');

            // Verify negative scenario for Ericsson SAM LOB for change assignment
            await editCasePo.clickChangeAssignmentButton();
            await changeAssignmentBladePo.setDropDownValue('AssignedGroup', 'Oracle AskHR');
            expect(await changeAssignmentBladePo.isValuePresentInDropDown("Assignee", 'Unamuno Miguel de')).toBeFalsy('Assignee is diaplayed');
            await changeAssignmentBladePo.clickOnCancelButton();

            await editCasePo.clickSaveCase();
            await viewCasePage.clickAddTaskButton();
            await manageTaskBladePo.clickAddAdhocTaskButton();
            await createAdhocTaskPo.setSummary('adhocTask')
            expect(await createAdhocTaskPo.getLineOfBussinessValue()).toBe('Kingston HR');
            await createAdhocTaskPo.clickSaveAdhoctask();
            await manageTaskBladePo.clickCloseButton();
            await viewCasePage.clickOnTaskLink(taskTemplateNameSummaryKingstoneHR);
        });

        it('[12038]: create knowledge article', async () => {
            await navigationPage.gotoCreateKnowledge();
            await createKnowledgePage.clickOnTemplate('Reference');
            await createKnowledgePage.clickOnUseSelectedTemplateButton();
            await createKnowledgePage.addTextInKnowlegeTitleField(knowledgeTitle);
            await createKnowledgePage.selectKnowledgeSet(knowledgeSetData.knowledgeSetTitle);
            await createKnowledgePage.clickOnSaveKnowledgeButton();
            await previewKnowledgePo.clickGoToArticleButton();
            await editKnowledgePo.setKnowledgeStatus('Draft');
            await utilityCommon.closePopUpMessage();
            await editKnowledgePo.setKnowledgeStatus('Publish Approval');
        });

        it('[12038]: Verify with Resources Tab', async () => {
            await utilityCommon.closeAllBlades();
            await navigationPage.gotoCaseConsole();
            await caseConsolePo.searchAndOpenCase(caseIdKingstoneHR);

            await viewCasePage.clickOnTab('Resources');
            await resourcesTabPo.clickOnAdvancedSearchOptions();
            await resourcesTabPo.searchTextAndEnter(knowledgeTitle);
            await resourcesTabPo.searchTextAndEnter(knowledgeTitle);
            await expect(await resourcesTabPo.getAdvancedSearchResultForParticularSection(knowledgeTitle)).toEqual(knowledgeTitle);
            await expect(await resourcesTabPo.getAdvancedSearchResultForParticularSection(summary)).toEqual(summary);
        });

        it('[12038]: Login And Create case With Oracle HR User and verify data', async () => {
            await navigationPage.signOut();
            await loginPage.login(oracleUserName, password);
            await navigationPage.gotoCaseConsole();
            await navigationPage.gotoCreateCase();
            await createCasePage.selectRequester('Ueshiba Morihei');
            expect(await createCasePage.getLineOfBusinessValue()).toBe('Oracle HR');
            await createCasePage.setSummary('DRDMV23673CaseSummary123');

            await createCasePage.clickSelectCaseTemplateButton();
            await selectCasetemplateBladePo.clickOnAllTemplateTab();

            expect(await utilityGrid.isGridRecordPresent(caseTemplateDataKingstoneHR.templateName)).toBeFalsy('caseTemplateDataKingstoneHR is display');
            expect(await utilityGrid.isGridRecordPresent(caseTemplateDataGlobalKingstonHR.templateName)).toBeFalsy('caseTemplateDataGlobalKingstonHR is display');

            expect(await utilityGrid.isGridRecordPresent(caseTemplateDataGlobalOracleHR.templateName)).toBeTruthy('caseTemplateDataGlobalEricssonSAM is missing');
            expect(await utilityGrid.isGridRecordPresent(caseTemplateDataOracleHR.templateName)).toBeTruthy('caseTemplateDataEricssonSAM is missing');

            await selectCasetemplateBladePo.searchAndOpenCaseTemplate(caseTemplateDataOracleHR.templateName);
            expect(await previewCaseTemplatePo.isLabelTitleDisplayed('Case Summary')).toBeTruthy('Case Summary label is missing');
            await previewCaseTemplatePo.clickOnBackButton();
            await selectCasetemplateBladePo.selectCaseTemplate(caseTemplateDataOracleHR.templateName);

            expect(await createCasePage.getCategoryTier1Value()).toBe('Workforce Administration');
            expect(await createCasePage.getCategoryTier2Value()).toBe('HR Operations');
            expect(await createCasePage.getCategoryTier3Value()).toBe('Adjustments');


            expect(await createCasePage.getAssigneeBusinessUnitValue()).toBe('Oracle HR');
            expect(await createCasePage.getAssigneeGroupValue()).toBe('Oracle AskHR');
            expect(await createCasePage.getAssigneeValue()).toBe('Unamuno Miguel de');

            // Verify negative scenario for kingston HR LOB for change assignment
            await createCasePage.clickChangeAssignmentButton();
            await changeAssignmentBladePo.setDropDownValue('AssignedGroup', 'Kingston AskHR');
            expect(await changeAssignmentBladePo.isValuePresentInDropDown("Assignee", 'Samara Moran')).toBeFalsy('Assignee is diaplayed');
            await changeAssignmentBladePo.clickOnCancelButton();

            await createCasePage.clickSaveCaseButton();
            await casePreviewPo.clickGoToCaseButton();

            caseIdOracleHR = await viewCasePage.getCaseID();
            await viewCasePage.clickOnTaskLink(taskTemplateNameSummaryOracleHR);
            await viewTaskPo.clickOnViewCase();
        });

        it('[12038]: Verify Knowledge Article and case with Resources Tab', async () => {
            await viewCasePage.clickOnTab('Resources');
            await resourcesTabPo.clickOnAdvancedSearchOptions();
            await resourcesTabPo.searchTextAndEnter(knowledgeTitle);
            await browser.sleep(3000); // wait untile result gets reflect
            await expect(await resourcesTabPo.getAdvancedSearchResultForParticularSection(knowledgeTitle)).toEqual(undefined);
            await expect(await resourcesTabPo.getAdvancedSearchResultForParticularSection('DRDMV23673CaseSummary123')).toEqual(undefined);
        });

        it('[12038]: Verify KingstoneHR and Oracle HR Case Access in between LOB', async () => {
            await navigationPage.gotoCaseConsole();
            await utilityGrid.clearFilter();
            expect(await utilityGrid.isGridRecordPresent(caseIdOracleHR)).toBeTruthy('caseIdOracleHR Missing on grid');
            expect(await utilityGrid.isGridRecordPresent(caseIdKingstoneHR)).toBeFalsy('caseIdKingstoneHR Missing on grid');

            await navigationPage.signOut();
            await loginPage.login(kingstoneHRUserName, password);

            await utilityGrid.clearFilter();
            expect(await utilityGrid.isGridRecordPresent(caseIdOracleHR)).toBeFalsy('caseIdOracleHR Missing on grid');
            expect(await utilityGrid.isGridRecordPresent(caseIdKingstoneHR)).toBeTruthy('caseIdKingstoneHR Missing on grid');
        });

        afterAll(async () => {
            await utilityCommon.closeAllBlades();
            await navigationPage.signOut();
            await loginPage.login(kingstoneHRUserName, password);
        });
    });

    //kiran
    describe('[12032]: [Service Provider Model][Quick Case]: Verify the behavior when the case agent is able to create a case when it has access to multiple LOB', () => {
        let randomStr = [...Array(4)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        let knowledgeSetData2, knowledgeSetData, caseTemplateDataGlobalOracleHR, caseTemplateDataOracleHR, caseTemplateDataGlobalKingstonHR, caseTemplateDataKingstoneHR, caseIdKingstoneHR, caseIdOracleHR;

        let caseSummaryKingstoneHR1 = "1caseSummaryKingstoneHR" + randomStr;
        let articleKingstoneHR1 = "1articleKingstoneHR" + randomStr;

        let caseSummaryOracleHR2 = "2caseSummaryOracleHR" + randomStr;
        let articleOracleHR2 = "2articleOracleHR" + randomStr;

        beforeAll(async () => {
            // Create Data with Kingston HR LOB
            await apiHelper.apiLogin(kingstoneOracleLOBUserName, password);
            caseTemplateDataGlobalKingstonHR = {
                "templateName": 'GlobalcaseTemplateNameKingstonHR' + randomStr,
                "templateSummary": 'GlobalCaseTemplateSummaryKingstonHR' + randomStr,
                "categoryTier1": 'Employee Relations',
                "categoryTier2": 'Compensation',
                "categoryTier3": 'Bonus',
                "casePriority": "Low",
                "templateStatus": "Active",
                "company": "- Global -",
                "businessUnit": "Kingston HR",
                "supportGroup": "Kingston AskHR",
                "assignee": "smoran",
                "ownerBU": "Kingston HR",
                "ownerGroup": "Kingston AskHR",
                "lineOfBusiness": "Kingston HR"
            }
            await apiHelper.createCaseTemplate(caseTemplateDataGlobalKingstonHR);

            caseTemplateDataKingstoneHR = {
                "templateName": 'CaseTemplateNameKingstonHR' + randomStr,
                "templateSummary": 'CaseTemplateNameKingstonHR' + randomStr,
                "categoryTier1": 'Workforce Administration',
                "categoryTier2": 'HR Operations',
                "categoryTier3": 'Adjustments',
                "casePriority": "High",
                "templateStatus": "Active",
                "company": "Phyto",
                "businessUnit": "Kingston HR",
                "supportGroup": "Kingston AskHR",
                "assignee": "sochoa",
                "ownerBU": "Kingston HR",
                "ownerGroup": "Kingston AskHR",
                "lineOfBusiness": "Kingston HR"
            }
            await apiHelper.createCaseTemplate(caseTemplateDataKingstoneHR);

            // Create data knowledge set for Kingston HR 
            knowledgeSetData = {
                'knowledgeSetTitle': 'KASetKingstonHR' + randomStr,
                'knowledgeSetDesc': 'KingstonHR_Desc' + randomStr,
                'company': 'Phyto',
                "lineOfBusiness": "Kingston HR"
            }
            await apiHelper.createKnowledgeSet(knowledgeSetData);


            // >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
            // Create data with Oracle HR Data

            // Create data knowledge set for Oracle HR 
            knowledgeSetData2 = {
                'knowledgeSetTitle': 'KASetOracleHR' + randomStr,
                'knowledgeSetDesc': 'KAPhyto_Desc' + randomStr,
                'company': 'Phyto',
                "lineOfBusiness": "Oracle HR"
            }
            await apiHelper.createKnowledgeSet(knowledgeSetData2);

            caseTemplateDataGlobalOracleHR = {
                "templateName": 'GlobalcaseTemplateNameOracleHR' + randomStr,
                "templateSummary": 'GlobalCaseTemplateSummaryOracleHR' + randomStr,
                "categoryTier1": 'Employee Relations',
                "categoryTier2": 'Compensation',
                "categoryTier3": 'Bonus',
                "casePriority": "Low",
                "templateStatus": "Active",
                "company": "- Global -",
                "businessUnit": "Oracle HR",
                "supportGroup": "Oracle AskHR",
                "assignee": "jtorrance",
                "ownerBU": "Oracle HR",
                "ownerGroup": "Oracle AskHR",
                "lineOfBusiness": "Oracle HR"
            }
            await apiHelper.createCaseTemplate(caseTemplateDataGlobalOracleHR);

            caseTemplateDataOracleHR = {
                "templateName": 'CaseTemplateNameOracleHR' + randomStr,
                "templateSummary": 'CaseTemplateNameOracleHR' + randomStr,
                "categoryTier1": 'Workforce Administration',
                "categoryTier2": 'HR Operations',
                "categoryTier3": 'Adjustments',
                "casePriority": "High",
                "templateStatus": "Active",
                "company": "Phyto",
                "businessUnit": "Oracle HR",
                "supportGroup": "Oracle AskHR",
                "assignee": "umiguelde",
                "ownerBU": "Oracle HR",
                "ownerGroup": "Oracle AskHR",
                "lineOfBusiness": "Oracle HR"
            }
            await apiHelper.createCaseTemplate(caseTemplateDataOracleHR);
        });

        it('[12032]: Create Case And Article Data For Kingston HR', async () => {
            // Create Case For Kingston HR
            await navigationPage.gotoCaseConsole();
            await utilityGrid.selectLineOfBusiness('Kingston HR');
            await navigationPage.gotoCreateCase();
            await createCasePage.selectRequester('David Kramer');
            await createCasePage.setSummary(caseSummaryKingstoneHR1);
            await createCasePage.clickChangeAssignmentButton();
            await changeAssignmentBladePo.setAssignee('Kingston AskHR', 'Sherri Ochoa');
            await createCasePage.clickSaveCaseButton();
            await casePreviewPo.clickOncreateNewCaseButton();

            //Create Knowledge Article Kingston HR
            await navigationPage.gotoCreateKnowledge();
            await createKnowledgePage.clickOnTemplate('Reference');
            await createKnowledgePage.clickOnUseSelectedTemplateButton();
            await createKnowledgePage.addTextInKnowlegeTitleField(articleKingstoneHR1);
            await createKnowledgePage.selectKnowledgeSet(knowledgeSetData.knowledgeSetTitle);
            await createKnowledgePage.clickOnSaveKnowledgeButton();
            await previewKnowledgePo.clickGoToArticleButton();
            await editKnowledgePo.setKnowledgeStatus('Draft');
            await editKnowledgePo.setKnowledgeStatus('Publish Approval');
        });

        it('[12032]: Create Case And Article Data For Oracle HR', async () => {
            // // Create Case For Oracle HR
            await navigationPage.gotoCaseConsole();
            await utilityGrid.selectLineOfBusiness('Oracle HR');
            await navigationPage.gotoCreateCase();
            await createCasePage.selectRequester('Ueshiba Morihei');
            await createCasePage.setSummary(caseSummaryOracleHR2);
            await createCasePage.clickChangeAssignmentButton();
            await changeAssignmentBladePo.setAssignee('Oracle AskHR', 'Vixie Paul');
            await createCasePage.clickSaveCaseButton();
            await casePreviewPo.clickOncreateNewCaseButton();

            //Create Knowledge Article Oracle HR
            await navigationPage.gotoCreateKnowledge();
            await createKnowledgePage.clickOnTemplate('Reference');
            await createKnowledgePage.clickOnUseSelectedTemplateButton();
            await createKnowledgePage.addTextInKnowlegeTitleField(articleOracleHR2);
            await createKnowledgePage.selectKnowledgeSet(knowledgeSetData2.knowledgeSetTitle);
            await createKnowledgePage.clickOnSaveKnowledgeButton();
            await previewKnowledgePo.clickGoToArticleButton();
            await editKnowledgePo.setKnowledgeStatus('Draft');
            await editKnowledgePo.setKnowledgeStatus('Publish Approval');
        });

        it('[12032]: Create Quick Case Negative scenario With Kingston HR', async () => {
            await navigationPage.gotoCaseConsole();
            await utilityGrid.selectLineOfBusiness('Kingston HR');
            await navigationPage.gotoQuickCase();

            await quickCasePo.selectRequesterName('smoran');
            await quickCasePo.setCaseSummary(caseSummaryOracleHR2);
            expect(await resourcesTabPo.isRecommendedCasePresent(caseSummaryOracleHR2)).toBeTruthy(`${caseSummaryOracleHR2} commonNameKingstonHR displayed in Recommended Knowledge`);
            await quickCasePo.clickStartOverButton();

            await quickCasePo.selectRequesterName('smoran');
            await quickCasePo.setCaseSummary(caseTemplateDataOracleHR.templateName);
            expect(await resourcesTabPo.isRecommendedTemplatePresent(caseTemplateDataOracleHR.templateName)).toBeTruthy(`${caseTemplateDataOracleHR.templateName} commonNameKingstonHR missing in Recommended Knowledge`);
            await quickCasePo.clickStartOverButton();

            await quickCasePo.selectRequesterName('smoran');
            await quickCasePo.setCaseSummary(caseTemplateDataGlobalOracleHR.templateName);
            expect(await resourcesTabPo.isRecommendedTemplatePresent(caseTemplateDataGlobalOracleHR.templateName)).toBeTruthy(`${caseTemplateDataGlobalOracleHR.templateName} commonNameKingstonHR missing in Recommended Knowledge`);
            await quickCasePo.clickStartOverButton();

            await quickCasePo.selectRequesterName('smoran');
            await quickCasePo.setCaseSummary(articleOracleHR2);
            expect(await resourcesTabPo.isRecommendedKnowledgePresent(articleOracleHR2)).toBeTruthy(`${articleOracleHR2} commonNameKingstonHR displayed in Recommended Knowledge`);
            await quickCasePo.clickStartOverButton();
        });

        it('[12032]: Create Quick Case without template and verify Kingston HR in recommended data', async () => {
            await quickCasePo.selectRequesterName('smoran');
            await quickCasePo.setCaseSummary(caseSummaryKingstoneHR1);
            expect(await resourcesTabPo.isRecommendedCasePresent(caseSummaryKingstoneHR1)).toBeTruthy(`${caseSummaryKingstoneHR1} caseSummaryKingstoneHR1 displayed in Recommended Knowledge`);
            await quickCasePo.clickStartOverButton();

            await quickCasePo.selectRequesterName('smoran');
            await quickCasePo.setCaseSummary(caseTemplateDataKingstoneHR.templateName);
            expect(await resourcesTabPo.isRecommendedTemplatePresent(caseTemplateDataKingstoneHR.templateName)).toBeTruthy(`${caseTemplateDataKingstoneHR.templateName} caseTemplateDataKingstoneHR.templateName displayed in Recommended Knowledge`);
            await quickCasePo.clickStartOverButton();

            await quickCasePo.selectRequesterName('smoran');
            await quickCasePo.setCaseSummary(caseTemplateDataGlobalKingstonHR.templateName);
            expect(await resourcesTabPo.isRecommendedTemplatePresent(caseTemplateDataGlobalKingstonHR.templateName)).toBeTruthy(`${caseTemplateDataGlobalKingstonHR.templateName} caseTemplateDataGlobalKingstonHR.templateName displayed in Recommended Knowledge`);
            await quickCasePo.clickStartOverButton();

            await quickCasePo.selectRequesterName('smoran');
            await quickCasePo.setCaseSummary(articleKingstoneHR1);
            expect(await resourcesTabPo.isRecommendedKnowledgePresent(articleKingstoneHR1)).toBeTruthy(`${articleKingstoneHR1} articleKingstoneHR1 displayed in Recommended Knowledge`);
            await quickCasePo.clickStartOverButton();

            await quickCasePo.clickStartOverButton();
            await quickCasePo.selectRequesterName('smoran');
            await quickCasePo.setCaseSummary(caseSummaryKingstoneHR1);
            await quickCasePo.saveCase();
            expect(await casePreviewPo.getLineOfBusinessValue()).toBe('Kingston HR');
            await casePreviewPo.clickOncreateNewCaseButton();
        });

        it('[12032]: Create Quick Case with case template', async () => {
            await quickCasePo.selectRequesterName('smoran');
            await quickCasePo.selectCaseTemplate(caseTemplateDataKingstoneHR.templateName);
            await quickCasePo.saveCase();
            await casePreviewPo.clickGoToCaseButton();
        });

        it('[12032]: Verify Edit Case Page', async () => {
            await viewCasePage.clickEditCaseButton();
            expect(await editCasePo.isLineOfBusinessReadOnly()).toBeTruthy('Line of business is not readonly');
            expect(await editCasePo.getLobValue()).toBe('Kingston HR');

            expect(await editCasePo.getCategoryTier1()).toBe('Workforce Administration');
            expect(await editCasePo.getCategoryTier2()).toBe('HR Operations');
            expect(await editCasePo.getCategoryTier3()).toBe('Adjustments');

            expect(await editCasePo.getAssigneeValue()).toBe('Sherri Ochoa');


            await editCasePo.updateCaseCategoryTier1('Total Rewards');
            await editCasePo.updateCaseCategoryTier2('Benefits');
            await editCasePo.updateCaseCategoryTier3('Beneficiaries');

            await editCasePo.clickOnChangeCaseTemplate();
            await selectCasetemplateBladePo.clickOnAllTemplateTab();
            expect(await utilityGrid.isGridRecordPresent(caseTemplateDataGlobalOracleHR.templateName)).toBeFalsy('caseTemplateDataGlobalOracleHR is display');
            expect(await utilityGrid.isGridRecordPresent(caseTemplateDataOracleHR.templateName)).toBeFalsy('caseTemplateDataGlobalOracleHR is display');

            expect(await utilityGrid.isGridRecordPresent(caseTemplateDataKingstoneHR.templateName)).toBeTruthy('caseTemplateDataKingstoneHR is missing');
            expect(await utilityGrid.isGridRecordPresent(caseTemplateDataGlobalKingstonHR.templateName)).toBeTruthy('caseTemplateDataGlobalKingstonHR is missing');

            await selectCasetemplateBladePo.searchAndOpenCaseTemplate(caseTemplateDataGlobalKingstonHR.templateName);
            expect(await previewCaseTemplatePo.isLabelTitleDisplayed('Case Summary')).toBeTruthy('Case Summary label is missing');
            await previewCaseTemplatePo.clickOnBackButton();
            await selectCasetemplateBladePo.selectCaseTemplate(caseTemplateDataGlobalKingstonHR.templateName);

            expect(await editCasePo.getCategoryTier1()).toBe('Employee Relations');
            expect(await editCasePo.getCategoryTier2()).toBe('Compensation');
            expect(await editCasePo.getCategoryTier3()).toBe('Bonus');
            expect(await editCasePo.getAssigneeValue()).toBe('Samara Moran');

            await editCasePo.clickChangeAssignmentButton();
            await changeAssignmentBladePo.setAssignee('Kingston AskHR', 'Jack Torrance');
            expect(await editCasePo.getAssigneeValue()).toBe('Jack Torrance');

            // Verify CategorTIer of Ericsson SAM LOB which don't have access to Kingston HR
            expect(await editCasePo.isValuePresentInCategoryTier1('General Ledger')).toBeFalsy('General Ledger CategoryTier1 drop down value displayed');

            // Verify negative scenario for Ericsson SAM LOB for change assignment
            await editCasePo.clickChangeAssignmentButton();
            await changeAssignmentBladePo.setDropDownValue('AssignedGroup', 'Oracle AskHR');
            expect(await changeAssignmentBladePo.isValuePresentInDropDown("Assignee", 'Unamuno Miguel de')).toBeFalsy('Assignee is diaplayed');
            await changeAssignmentBladePo.clickOnCancelButton();

            await editCasePo.clickSaveCase();
            await viewCasePage.clickAddTaskButton();
            await manageTaskBladePo.clickAddAdhocTaskButton();
            await createAdhocTaskPo.setSummary('adhocTask')
            expect(await createAdhocTaskPo.getLineOfBussinessValue()).toBe('Kingston HR');
            await createAdhocTaskPo.clickSaveAdhoctask();
            await manageTaskBladePo.clickCloseButton();
            await viewCasePage.clickOnTaskLink('adhocTask');
        });

        it('[12032]: Create Quick Case scenario With Oracle HR', async () => {
            await navigationPage.gotoCaseConsole();
            await utilityGrid.selectLineOfBusiness('Oracle HR');
            await navigationPage.gotoQuickCase();

            await quickCasePo.selectRequesterName('rtownsend');
            await quickCasePo.setCaseSummary(caseSummaryKingstoneHR1);
            expect(await resourcesTabPo.isRecommendedCasePresent(caseSummaryKingstoneHR1)).toBeTruthy(`${caseSummaryKingstoneHR1} commonNameKingstonHR displayed in Recommended Knowledge`);
            await quickCasePo.clickStartOverButton();

            await quickCasePo.selectRequesterName('rtownsend');
            await quickCasePo.setCaseSummary(caseTemplateDataKingstoneHR.templateName);
            expect(await resourcesTabPo.isRecommendedTemplatePresent(caseTemplateDataKingstoneHR.templateName)).toBeTruthy(`${caseTemplateDataKingstoneHR.templateName} commonNameKingstonHR missing in Recommended Knowledge`);
            await quickCasePo.clickStartOverButton();

            await quickCasePo.selectRequesterName('rtownsend');
            await quickCasePo.setCaseSummary(caseTemplateDataGlobalKingstonHR.templateName);
            expect(await resourcesTabPo.isRecommendedTemplatePresent(caseTemplateDataGlobalKingstonHR.templateName)).toBeTruthy(`${caseTemplateDataGlobalKingstonHR.templateName} commonNameKingstonHR missing in Recommended Knowledge`);
            await quickCasePo.clickStartOverButton();

            await quickCasePo.selectRequesterName('rtownsend');
            await quickCasePo.setCaseSummary(articleKingstoneHR1);
            expect(await resourcesTabPo.isRecommendedKnowledgePresent(articleKingstoneHR1)).toBeTruthy(`${articleKingstoneHR1} commonNameKingstonHR displayed in Recommended Knowledge`);
            await quickCasePo.clickStartOverButton();
        });

        it('[12032]: Create Quick Case without template and verify Oracle HR in recommended data ', async () => {
            await quickCasePo.selectRequesterName('rtownsend');
            await quickCasePo.setCaseSummary(caseSummaryOracleHR2);
            expect(await resourcesTabPo.isRecommendedCasePresent(caseSummaryOracleHR2)).toBeTruthy(`${caseSummaryOracleHR2} caseSummaryOracleHR2 displayed in Recommended Knowledge`);
            await quickCasePo.clickStartOverButton();

            await quickCasePo.selectRequesterName('rtownsend');
            await quickCasePo.setCaseSummary(caseTemplateDataOracleHR.templateName);
            expect(await resourcesTabPo.isRecommendedTemplatePresent(caseTemplateDataOracleHR.templateName)).toBeTruthy(`${caseTemplateDataOracleHR.templateName} caseTemplateDataOracleHR.templateName displayed in Recommended Knowledge`);
            await quickCasePo.clickStartOverButton();

            await quickCasePo.selectRequesterName('rtownsend');
            await quickCasePo.setCaseSummary(caseTemplateDataGlobalOracleHR.templateName);
            expect(await resourcesTabPo.isRecommendedTemplatePresent(caseTemplateDataGlobalOracleHR.templateName)).toBeTruthy(`${caseTemplateDataGlobalOracleHR.templateName} caseTemplateDataGlobalOracleHR.templateName displayed in Recommended Knowledge`);
            await quickCasePo.clickStartOverButton();

            await quickCasePo.selectRequesterName('rtownsend');
            await quickCasePo.setCaseSummary(articleOracleHR2);
            expect(await resourcesTabPo.isRecommendedKnowledgePresent(articleOracleHR2)).toBeTruthy(`${articleOracleHR2} articleOracleHR2 displayed in Recommended Knowledge`);
            await quickCasePo.clickStartOverButton();

            await quickCasePo.clickStartOverButton();
            await quickCasePo.selectRequesterName('rtownsend');
            await quickCasePo.setCaseSummary(caseSummaryOracleHR2);
            await quickCasePo.saveCase();
            expect(await casePreviewPo.getLineOfBusinessValue()).toBe('Kingston HR');
            await casePreviewPo.clickOncreateNewCaseButton();
        });

        it('[12032]: Create Quick Case with case template Oracle HR', async () => {
            await quickCasePo.selectRequesterName('smoran');
            await quickCasePo.selectCaseTemplate(caseTemplateDataOracleHR.templateName);
            await quickCasePo.saveCase();
            await casePreviewPo.clickGoToCaseButton();
        });

        it('[12032]: Verify Edit Case Page for Oracle HR', async () => {
            await viewCasePage.clickEditCaseButton();
            expect(await editCasePo.isLineOfBusinessReadOnly()).toBeTruthy('Line of business is not readonly');
            expect(await editCasePo.getLobValue()).toBe('Oracle HR');

            expect(await editCasePo.getCategoryTier1()).toBe('Workforce Administration');
            expect(await editCasePo.getCategoryTier2()).toBe('HR Operations');
            expect(await editCasePo.getCategoryTier3()).toBe('Adjustments');

            expect(await editCasePo.getAssigneeValue()).toBe('Unamuno Miguel de');

            await editCasePo.updateCaseCategoryTier1('Total Rewards');
            await editCasePo.updateCaseCategoryTier2('Benefits');
            await editCasePo.updateCaseCategoryTier3('Beneficiaries');

            await editCasePo.clickOnChangeCaseTemplate();
            await selectCasetemplateBladePo.clickOnAllTemplateTab();

            expect(await utilityGrid.isGridRecordPresent(caseTemplateDataKingstoneHR.templateName)).toBeFalsy('caseTemplateDataKingstoneHR is missing');
            expect(await utilityGrid.isGridRecordPresent(caseTemplateDataGlobalKingstonHR.templateName)).toBeFalsy('caseTemplateDataGlobalKingstonHR is missing');

            expect(await utilityGrid.isGridRecordPresent(caseTemplateDataGlobalOracleHR.templateName)).toBeTruthy('caseTemplateDataGlobalOracleHR is display');
            expect(await utilityGrid.isGridRecordPresent(caseTemplateDataOracleHR.templateName)).toBeTruthy('caseTemplateDataGlobalOracleHR is display');

            await selectCasetemplateBladePo.searchAndOpenCaseTemplate(caseTemplateDataOracleHR.templateName);
            expect(await previewCaseTemplatePo.isLabelTitleDisplayed('Case Summary')).toBeTruthy('Case Summary label is missing');
            await previewCaseTemplatePo.clickOnBackButton();
            await selectCasetemplateBladePo.selectCaseTemplate(caseTemplateDataGlobalOracleHR.templateName);

            expect(await editCasePo.getCategoryTier1()).toBe('Employee Relations');
            expect(await editCasePo.getCategoryTier2()).toBe('Compensation');
            expect(await editCasePo.getCategoryTier3()).toBe('Bonus');
            expect(await editCasePo.getAssigneeValue()).toBe('Jack Torrance');
            await editCasePo.clickChangeAssignmentButton();
            await changeAssignmentBladePo.setAssignee('Oracle AskHR', 'Vixie Paul');
            expect(await editCasePo.getAssigneeValue()).toBe('Vixie Paul');

            // Verify CategorTIer of Ericsson SAM LOB which don't have access to Kingston HR
            expect(await editCasePo.isValuePresentInCategoryTier1('General Ledger')).toBeFalsy('General Ledger CategoryTier1 drop down value displayed');

            // Verify negative scenario for Ericsson SAM LOB for change assignment
            await editCasePo.clickChangeAssignmentButton();
            await changeAssignmentBladePo.setDropDownValue('AssignedGroup', 'Kingston AskHR');
            expect(await changeAssignmentBladePo.isValuePresentInDropDown("Assignee", 'Sherri Ochoa')).toBeFalsy('Assignee is diaplayed');
            await changeAssignmentBladePo.clickOnCancelButton();

            await editCasePo.clickSaveCase();
            await viewCasePage.clickAddTaskButton();
            await manageTaskBladePo.clickAddAdhocTaskButton();
            await createAdhocTaskPo.setSummary('adhocTask2')
            expect(await createAdhocTaskPo.getLineOfBussinessValue()).toBe('Oracle HR');
            await createAdhocTaskPo.clickSaveAdhoctask();
            await manageTaskBladePo.clickCloseButton();
            await viewCasePage.clickOnTaskLink('adhocTask2');
        });
    });
});