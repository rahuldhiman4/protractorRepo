import { browser } from "protractor";
import apiHelper from '../../api/api.helper';
import previewCasePage from '../../pageobject/case/case-preview.po';
import createCasePage from '../../pageobject/case/create-case.po';
import editCasePo from '../../pageobject/case/edit-case.po';
import viewCasePage from '../../pageobject/case/view-case.po';
import changeAssignmentBladePo from '../../pageobject/common/change-assignment-blade.po';
import loginPage from "../../pageobject/common/login.po";
import navigationPage from "../../pageobject/common/navigation.po";
import updateStatusBladePo from '../../pageobject/common/update.status.blade.po';
import composeMailPo from '../../pageobject/email/compose-mail.po';
import selectEmailTemplateBladePo from '../../pageobject/email/select-email-template-blade.po';
import activityTabPo from '../../pageobject/social/activity-tab.po';
import notesTemplateUsage from '../../pageobject/social/note-template-usage.po';
import createAdhocTaskPo from '../../pageobject/task/create-adhoc-task.po';
import manageTaskBladePo from '../../pageobject/task/manage-task-blade.po';
import { BWF_BASE_URL } from '../../utils/constants';
import utilityCommon from '../../utils/utility.common';
import utilityGrid from '../../utils/utility.grid';
import viewTaskPo from '../../pageobject/task/view-task.po';
import casePreviewPo from '../../pageobject/case/case-preview.po';
import selectCasetemplateBladePo from '../../pageobject/case/select-casetemplate-blade.po';
import previewCaseTemplatePo from '../../pageobject/settings/case-management/preview-case-template.po';

describe('Create Process in Flowset', () => {
    let kingstoneUserName = 'smoran@petramco.com';
    let oracleUserName = 'umiguelde@petramco.com';
    let kingstoneLegalUserName = 'yhenny@petramco.com';
    let kingstoneOracleLOBUserName = 'jstuart@petramco.com';

    let password = 'Password_1234';
    beforeAll(async () => {
        await browser.get(BWF_BASE_URL);
        await loginPage.login(kingstoneUserName, password);
    });

    afterAll(async () => {
        await utilityCommon.closeAllBlades();
        await navigationPage.signOut();
    });

    //kiran
    describe('[DRDMV-23676]: [Service Provider Model] [Cases] : Verify the behavior where Email Templates, Task Templates, Resolution Codes, Notes templates are filtered / displayed based on the Line of Business on Cases.', () => {
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
            await apiHelper.apiLogin(kingstoneUserName, password);

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

        it('[DRDMV-23676]: Create Case and verify email template on select email template blade grid', async () => {
            await navigationPage.gotoCreateCase();
            await createCasePage.selectRequester('David Kramer');
            await createCasePage.setSummary('DRDMV23676CaseSummary');
            await createCasePage.clickChangeAssignmentButton();
            await changeAssignmentBladePo.setAssignee('Phyto', 'Kingston HR', 'Kingston AskHR', 'Samara Moran');
            await createCasePage.clickSaveCaseButton();
            await previewCasePage.clickGoToCaseButton();

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

        it('[DRDMV-23676]: Verify Task template on manage task blade', async () => {
            await viewCasePage.clickAddTaskButton();
            await manageTaskBladePo.clickAddTaskFromTemplateButton();

            expect(await utilityGrid.isGridRecordPresent(kingstoneTaskTemplateName)).toBeTruthy('kingstoneTaskTemplateName Record is not preset');
            expect(await utilityGrid.isGridRecordPresent(globalKingStonetaskTemplateName)).toBeTruthy('globalKingStonetaskTemplateName Record is not preset');

            expect(await utilityGrid.isGridRecordPresent(oracleTaskTemplateName)).toBeFalsy('oracleTaskTemplateName Record is preset');
            expect(await utilityGrid.isGridRecordPresent(globaloracletaskTemplateName)).toBeFalsy('globaloracletaskTemplateName Record is preset');

            await utilityGrid.searchAndSelectGridRecord(kingstoneTaskTemplateName);
            await manageTaskBladePo.clickTaskGridSaveButton();
        });

        it('[DRDMV-23676]: Verify Adhoc Task template LOB on manage task blade', async () => {
            await manageTaskBladePo.clickAddAdhocTaskButton();
            await createAdhocTaskPo.setSummary("DRDMV23676Test");
            expect(await createAdhocTaskPo.getLineOfBussinessValue()).toBe('Kingston HR');
            await createAdhocTaskPo.clickSaveAdhoctask();
            await manageTaskBladePo.clickCloseButton();
        });

        it('[DRDMV-23676]: Verify Notes Template', async () => {
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

        it('[DRDMV-23676]: Verify Resolution Code', async () => {
            await viewCasePage.clickEditCaseButton();
            await editCasePo.updateResolutionCode(resolutionCodeNamekingStone);
            await editCasePo.setResolutionDescription('resolution code testing');
            expect(await editCasePo.isValuePresentInResolutionCode(resolutionCodeNameOracle)).toBeFalsy('resolutionCodeNamekingStone is missing')
            await editCasePo.clickSaveCase();

            await viewCasePage.clickOnStatus();
            await updateStatusBladePo.changeStatus('Resolved');
            await updateStatusBladePo.setStatusReason('Auto Resolved');
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
    describe('[DRDMV-23763]: [Service Provider Model] [Cases] : Verify the behavior where Email Templates, Task Templates, Resolution Codes, Notes templates are filtered / displayed based on the Line of Business on Cases.', () => {
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

        it('[DRDMV-23763]: Create Case and verify email template on select email template blade grid', async () => {
            await navigationPage.gotoCreateCase();
            await createCasePage.selectRequester('Young Neil');
            await createCasePage.setSummary('DRDMV23763CaseSummary');
            await createCasePage.clickAssignToMeButton();
            await createCasePage.clickSaveCaseButton();
            await previewCasePage.clickGoToCaseButton();
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

        it('[DRDMV-23763]: Verify Task template on manage task blade', async () => {
            await viewCasePage.clickAddTaskButton();
            await manageTaskBladePo.clickAddTaskFromTemplateButton();

            expect(await utilityGrid.isGridRecordPresent(kingstoneTaskTemplateName)).toBeTruthy('kingstoneTaskTemplateName Record is not preset');
            expect(await utilityGrid.isGridRecordPresent(globalKingStonetaskTemplateName)).toBeTruthy('globalKingStonetaskTemplateName Record is not preset');

            await utilityGrid.searchAndSelectGridRecord(kingstoneTaskTemplateName);
            await manageTaskBladePo.clickTaskGridSaveButton();
        });

        it('[DRDMV-23763]: Verify Adhoc Task template LOB on manage task blade', async () => {
            await manageTaskBladePo.clickAddAdhocTaskButton();
            await createAdhocTaskPo.setSummary("DRDMV23763Test");
            expect(await createAdhocTaskPo.getLineOfBussinessValue()).toBe('Kingston Legal');
            await createAdhocTaskPo.clickSaveAdhoctask();
            await manageTaskBladePo.clickTaskLink(kingstoneTaskTemplateName);

            await viewTaskPo.clickOnChangeStatus();
            await viewTaskPo.changeTaskStatus('Completed');
            await updateStatusBladePo.setStatusReason('Successful');
            await updateStatusBladePo.clickSaveStatus();
            await viewTaskPo.clickOnViewCase();
        });

        it('[DRDMV-23763]: Change Task Status', async () => {
            await viewCasePage.clickAddTaskButton();
            await manageTaskBladePo.clickTaskLink('DRDMV23763Test');
            await viewTaskPo.clickOnChangeStatus();
            await viewTaskPo.changeTaskStatus('Completed');
            await updateStatusBladePo.setStatusReason('Successful');
            await updateStatusBladePo.clickSaveStatus();
            await viewTaskPo.clickOnViewCase();
        });

        it('[DRDMV-23763]: Verify Notes Template', async () => {
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

        it('[DRDMV-23763]: Verify Resolution Code', async () => {
            await viewCasePage.clickEditCaseButton();
            await editCasePo.updateResolutionCode(resolutionCodeNamekingStone);
            await editCasePo.setResolutionDescription('resolution code testing');
            await editCasePo.clickSaveCase();

            await viewCasePage.clickOnStatus();
            await updateStatusBladePo.changeStatus('Resolved');
            await updateStatusBladePo.setStatusReason('Auto Resolved');
            await updateStatusBladePo.selectResolutionCode(resolutionCodeNamekingStone);

            await updateStatusBladePo.setResolutionDescription('resolution code update');
            await updateStatusBladePo.clickSaveStatus();
            await utilityCommon.closeAllBlades();
        });

        it('[DRDMV-23763]: Create Case and verify email template on select email template blade grid', async () => {
            await navigationPage.signOut();
            await loginPage.login(kingstoneUserName, password);

            await navigationPage.gotoCreateCase();
            await createCasePage.selectRequester('David Kramer');
            await createCasePage.setSummary('DRDMV23763CaseSummary');
            await createCasePage.clickChangeAssignmentButton();
            await changeAssignmentBladePo.setAssignee('Phyto', 'Kingston HR', 'Kingston AskHR', 'Samara Moran');
            await createCasePage.clickSaveCaseButton();
            await previewCasePage.clickGoToCaseButton();

            await viewCasePage.clickOnRequestersEmail();
            await composeMailPo.clickOnSelectEmailTemplateLink();

            expect(await utilityGrid.isGridRecordPresent(kingstonEmailTemplateName)).toBeFalsy('kingstonEmailTemplateName Record is  preset');
            expect(await utilityGrid.isGridRecordPresent(globalkingStoneEmailTemplatename)).toBeFalsy('globalkingStoneEmailTemplatename Record is preset');

            await selectEmailTemplateBladePo.clickOnCancelButton();
            await utilityCommon.closeAllBlades();
            await composeMailPo.clickOnDiscardButton();
            await utilityCommon.clickOnApplicationWarningYesNoButton("Yes");
        });

        it('[DRDMV-23763]: Verify Task template on manage task blade', async () => {
            await viewCasePage.clickAddTaskButton();
            await manageTaskBladePo.clickAddTaskFromTemplateButton();

            expect(await utilityGrid.isGridRecordPresent(kingstoneTaskTemplateName)).toBeFalsy('kingstoneTaskTemplateName Record is not preset');
            expect(await utilityGrid.isGridRecordPresent(globalKingStonetaskTemplateName)).toBeFalsy('globalKingStonetaskTemplateName Record is not preset');
            await manageTaskBladePo.clickTaskGridCancelButton();
            await manageTaskBladePo.clickCloseButton();
        });

        it('[DRDMV-23763]: Verify Notes Template', async () => {
            await activityTabPo.clickActivityNoteTextBox();
            await activityTabPo.clickOnNotesTemplate();
            expect(await notesTemplateUsage.isTemplatePresent(notesTemplatekingStone)).toBeFalsy('notesTemplatekingStone is missing');
            expect(await notesTemplateUsage.isTemplatePresent(notesTemplateKingStoneGlobal)).toBeFalsy('notesTemplateKingStoneGlobal is missing');

            await notesTemplateUsage.clickOnCancelBtn();
            await utilityCommon.closeAllBlades();
        });

        it('[DRDMV-23763]: Verify Resolution Code', async () => {
            await viewCasePage.clickEditCaseButton();
            await expect(await editCasePo.isValuePresentInResolutionCode(resolutionCodeNamekingStone)).toBeFalsy();
            await editCasePo.setResolutionDescription('resolution code testing');
            await editCasePo.clickSaveCase();

            await viewCasePage.clickOnStatus();
            await updateStatusBladePo.changeStatus('Resolved');
            await updateStatusBladePo.setStatusReason('Auto Resolved');
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
    describe('[DRDMV-23681]: [Service Provider Model][Create Case]: Verify the behavior when the case agent is able to create a case when it has access to multiple LOB', () => {
        let randomStr = [...Array(4)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        let caseTemplateDataGlobalKingstonHR, caseTemplateDataKingstoneHR , caseIdKingstoneHR, caseIdOracleHR, caseTemplateDataOracleHR, caseTemplateDataGlobalOracleHR, caseTemplateDataGlobalKingstoneLegal, caseTemplateDataKingstoneLegal;
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

        fit('[DRDMV-23681]: Verify Negative Scenrio for Oracle HR and Kingston Leagal data but Finance LOB for category diffrence', async () => {
            await navigationPage.gotoCaseConsole();
            await navigationPage.gotoCreateCase();
            await createCasePage.selectRequester('Ueshiba Morihei');
            await createCasePage.selectLineOfBusiness('Oracle HR');
            
            await createCasePage.setSummary('DRDMV23681CaseSummary');
        // Verify negative scenario for Kingston Legal and Kingston HR LOB case template should not display
            await createCasePage.clickSelectCaseTemplateButton();
            await selectCasetemplateBladePo.clickOnAllTemplateTab();
            expect (await utilityGrid.isGridRecordPresent(caseTemplateDataKingstoneLegal.templateName)).toBeFalsy('caseTemplateDataKingstoneLegal.templateName is missing');
            expect (await utilityGrid.isGridRecordPresent(caseTemplateDataGlobalKingstoneLegal.templateName)).toBeFalsy('caseTemplateDataGlobalKingstoneLegal.templateName is missing');

            expect (await utilityGrid.isGridRecordPresent(caseTemplateDataKingstoneHR.templateName)).toBeFalsy('caseTemplateDataKingstoneHR is missing');
            expect (await utilityGrid.isGridRecordPresent(caseTemplateDataGlobalKingstonHR.templateName)).toBeFalsy('caseTemplateDataGlobalKingstonHR is missing');

            expect (await utilityGrid.isGridRecordPresent(caseTemplateDataOracleHR.templateName)).toBeTruthy('caseTemplateDataOracleHR.templateName is missing');
            expect (await utilityGrid.isGridRecordPresent(caseTemplateDataGlobalOracleHR.templateName)).toBeTruthy('caseTemplateDataGlobalOracleHR.templateName is missing');
            await selectCasetemplateBladePo.selectCaseTemplate(caseTemplateDataOracleHR.templateName);
            
            expect (await createCasePage.getCategoryTier1Value()).toBe('Workforce Administration');
            expect (await createCasePage.getCategoryTier2Value()).toBe('HR Operations');
            expect (await createCasePage.getCategoryTier3Value()).toBe('Adjustments');
            expect (await createCasePage.getAssigneeBusinessUnitValue()).toBe('Oracle HR');
            expect (await createCasePage.getAssigneeGroupValue()).toBe('Oracle AskHR');
            expect (await createCasePage.getAssigneeValue()).toBe('Unamuno Miguel de');
            
            // Verify negative scenario for Kingston Legal LOB should not display
            expect (await createCasePage.isValuePresentInLineOfBusinessDropDown('Kingston Legal')).toBeFalsy ('Kingston lob is displayed');

            // verify negative scenario for categoryTier1 with Finance LOB
            expect (await createCasePage.isCategoryTier1DropDownValueDisplayed('General Ledger')).toBeFalsy('General Ledger CategoryTier1 drop down value displayed');

            await createCasePage.clickChangeAssignmentButton();
            // Verify negative scenario for Kingston LOB for change assignment
            await changeAssignmentBladePo.selectCompany('Kingston')
            expect (await changeAssignmentBladePo.isValuePresentInDropdown('Business Unit', 'Kingston Legal')).toBeFalsy('BU is diaplayed');
            expect (await changeAssignmentBladePo.isValuePresentInDropdown('Support', 'Legal Support')).toBeFalsy('Support Group is displayed');
            await changeAssignmentBladePo.clickOnCancelButton();

            await createCasePage.clickChangeAssignmentButton();
            await changeAssignmentBladePo.setAssignee('Phyto', 'Oracle HR', 'Oracle AskHR', 'Vixie Paul');
            
            expect (await createCasePage.getAssigneeValue()).toBe('Vixie Paul');
            
            // Change verify with change LOB and should be clear all selected values
            await createCasePage.selectLineOfBusiness('KingstonOracle Finance');

            expect (await createCasePage.getCategoryTier1Value()).toBe('Select');
            expect (await createCasePage.getCategoryTier2Value()).toBe('Select');
            expect (await createCasePage.getCategoryTier3Value()).toBe('Select');

            expect (await createCasePage.getAssigneeBusinessUnitValue()).toBe('');
            expect (await createCasePage.getAssigneeBusinessUnitValue()).toBe('');
            expect (await createCasePage.getAssigneeValue()).toBe('Select');

            expect (await createCasePage.isCategoryTier1DropDownValueDisplayed('General Ledger')).toBeTruthy('General Ledger CategoryTier1 drop down value missing');
        });

        it('[DRDMV-23681]: Create case without case template', async () => {
            await navigationPage.gotoCaseConsole();
            await utilityGrid.selectLineOfBusiness('Kingston HR');
            await navigationPage.gotoCreateCase();
            await createCasePage.selectRequester('Samara Moran');
            expect (await createCasePage.isCategoryTier1DropDownValueDisplayed('General Ledger')).toBeFalsy('General Ledger CategoryTier1 drop down value displayed');
            await createCasePage.selectLineOfBusiness('Kingston HR');
            await createCasePage.setSummary('DRDMV23681CaseSummary');
            await createCasePage.selectCategoryTier1('Applications');
            await createCasePage.selectCategoryTier2('Help Desk');
            await createCasePage.selectCategoryTier3('Incident');
            await createCasePage.clickChangeAssignmentButton();
            await changeAssignmentBladePo.setAssignee('Phyto', 'Kingston HR', 'Kingston AskHR', 'Sherri Ochoa');
            await createCasePage.clickSaveCaseButton();
            expect (await casePreviewPo.getLineOfBusinessValue()).toBe('Kingston HR');
            await casePreviewPo.clickOncreateNewCaseButton();
        });

        it('[DRDMV-23681]: Create case with case template', async () => {
            await createCasePage.selectRequester('Stuart Rexroad');
            expect (await createCasePage.getLineOfBusinessValue()).toBe('Kingston HR');
            await createCasePage.setSummary('DRDMV23681CaseSummary');

            await createCasePage.clickSelectCaseTemplateButton();
            await selectCasetemplateBladePo.clickOnAllTemplateTab();

            expect (await utilityGrid.isGridRecordPresent(caseTemplateDataOracleHR.templateName)).toBeFalsy('caseTemplateDataOracleHR.templateName is missing');
            expect (await utilityGrid.isGridRecordPresent(caseTemplateDataGlobalOracleHR.templateName)).toBeFalsy('caseTemplateDataGlobalOracleHR.templateName is missing');

            expect (await utilityGrid.isGridRecordPresent(caseTemplateDataKingstoneHR.templateName)).toBeFalsy('caseTemplateDataKingstoneHR is missing');
            expect (await utilityGrid.isGridRecordPresent(caseTemplateDataGlobalKingstonHR.templateName)).toBeFalsy('caseTemplateDataGlobalKingstonHR is missing');

            expect (await utilityGrid.isGridRecordPresent(caseTemplateDataKingstoneHR.templateName)).toBeTruthy('caseTemplateDataKingstoneHR is missing');
            expect (await utilityGrid.isGridRecordPresent(caseTemplateDataGlobalKingstonHR.templateName)).toBeTruthy('caseTemplateDataGlobalKingstonHR is missing');
         
            await selectCasetemplateBladePo.searchAndOpenCaseTemplate(caseTemplateDataGlobalKingstonHR.templateName); 
            expect(await previewCaseTemplatePo.isLabelTitleDisplayed('Case Summary')).toBeTruthy('Case Summary label is missing'); 
            await previewCaseTemplatePo.clickOnBackButton();
            await selectCasetemplateBladePo.selectCaseTemplate(caseTemplateDataGlobalKingstonHR.templateName);

            expect (await createCasePage.getCategoryTier1Value()).toBe('Employee Relations');
            expect (await createCasePage.getCategoryTier2Value()).toBe('Compensation');
            expect (await createCasePage.getCategoryTier3Value()).toBe('Bonus');
            expect (await createCasePage.getAssigneeBusinessUnitValue()).toBe('Kingston HR');
            expect (await createCasePage.getAssigneeBusinessUnitValue()).toBe('Kingston AskHR');
            expect (await createCasePage.getAssigneeValue()).toBe('Unamuno Miguel de');

            await createCasePage.clickSaveCaseButton();
            await previewCasePage.clickGoToCaseButton();
            caseIdKingstoneHR = await viewCasePage.getCaseID();
        });

        it('[DRDMV-23681]: Verify Edit Case Page', async () => {
            await viewCasePage.clickEditCaseButton();
            expect (await editCasePo.isLineOfBusinessReadOnly()).toBeTruthy('Line of business is not readonly');
            await editCasePo.updateCaseCategoryTier1('Total Rewards');
            await editCasePo.updateCaseCategoryTier2('Benefits');
            await editCasePo.updateCaseCategoryTier3('Beneficiaries');

            await editCasePo.clickOnChangeCaseTemplate();
            await selectCasetemplateBladePo.clickOnAllTemplateTab();
            expect (await utilityGrid.isGridRecordPresent(caseTemplateDataKingstoneHR.templateName)).toBeTruthy('caseTemplateDataKingstoneHR is missing');
            expect (await utilityGrid.isGridRecordPresent(caseTemplateDataGlobalKingstonHR.templateName)).toBeTruthy('caseTemplateDataGlobalKingstonHR is missing');
            await selectCasetemplateBladePo.selectCaseTemplate(caseTemplateDataKingstoneHR.templateName);
           
            expect (await editCasePo.getCategoryTier1()).toBe('Workforce Administration');
            expect (await editCasePo.getCategoryTier2()).toBe('HR Operations');
            expect (await editCasePo.getCategoryTier3()).toBe('Adjustments');
            expect (await editCasePo.getAssigneeValue()).toBe('Sherri Ochoa');

            await editCasePo.clickChangeAssignmentButton();
            await changeAssignmentBladePo.setAssignee('Phyto', 'Kingston HR', 'Kingston AskHR', 'David Kramer');
            expect (await editCasePo.getAssigneeValue()).toBe('David Kramer');

            await editCasePo.clickSaveCase();
            await viewCasePage.clickOnTaskLink(taskTemplateNameSummaryKingstoneHR);
        });

        it('[DRDMV-23681]: Create case With Oracle HR User and verify data', async () => {
            await navigationPage.gotoCaseConsole();
            await utilityGrid.selectLineOfBusiness('Oracle HR');
            await navigationPage.gotoCreateCase();
            await createCasePage.selectRequester('Vixie Paul');
            expect (await createCasePage.getLineOfBusinessValue()).toBe('Oracle HR');
            await createCasePage.setSummary('DRDMV23681CaseSummary');
            expect (await createCasePage.isCategoryTier1DropDownValueDisplayed('General Ledger')).toBeFalsy('General Ledger CategoryTier1 drop down value displayed');
            
            await createCasePage.clickSelectCaseTemplateButton();
            await selectCasetemplateBladePo.clickOnAllTemplateTab();
            expect (await utilityGrid.isGridRecordPresent(caseTemplateDataKingstoneHR.templateName)).toBeFalsy('caseTemplateDataKingstoneHR is missing');
            expect (await utilityGrid.isGridRecordPresent(caseTemplateDataGlobalKingstonHR.templateName)).toBeFalsy('caseTemplateDataGlobalKingstonHR is missing');
            await selectCasetemplateBladePo.clickOnCancelButton();

            await createCasePage.selectCategoryTier1('Total Rewards');
            await createCasePage.selectCategoryTier2('Leave');
            await createCasePage.selectCategoryTier3('Bereavement');
            await createCasePage.clickChangeAssignmentButton();
            await changeAssignmentBladePo.setAssignee('Phyto', 'Oracle HR', 'Oracle AskHR', 'Ueshiba Morihei');
            await createCasePage.clickSaveCaseButton();

            await previewCasePage.clickGoToCaseButton();
            caseIdOracleHR = await viewCasePage.getCaseID();
        });

        it('[DRDMV-23681]: Verify KingstoneHR case access to Oracle HR LOB', async () => {
            await navigationPage.gotoCaseConsole(); 
            await utilityGrid.clearFilter();
            expect (await utilityGrid.isGridRecordPresent(caseIdOracleHR)).toBeTruthy('caseIdOracleHR Missing on grid');
            expect (await utilityGrid.isGridRecordPresent(caseIdKingstoneHR)).toBeFalsy('caseIdKingstoneHR Missing on grid');

            await utilityGrid.selectLineOfBusiness('Kingston HR');
            await utilityGrid.clearFilter();
            expect (await utilityGrid.isGridRecordPresent(caseIdOracleHR)).toBeFalsy('caseIdOracleHR Missing on grid');
            expect (await utilityGrid.isGridRecordPresent(caseIdKingstoneHR)).toBeTruthy('caseIdKingstoneHR Missing on grid');
        });

        afterAll(async () => {
            await navigationPage.signOut();
            await loginPage.login(kingstoneUserName, password);
        });
    });
});