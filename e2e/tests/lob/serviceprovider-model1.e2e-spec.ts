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

describe('Create Process in Flowset', () => {
    const emailTemplateData = require('../../data/ui/email/email.template.api.json');
    let kingstoneUserName = 'smoran@petramco.com';
    let oracleUserName = 'umiguelde@petramco.com'
    let password = 'Password_1234';
    beforeAll(async () => {
        await browser.get(BWF_BASE_URL);
        await loginPage.login(kingstoneUserName, password);
    });

    afterAll(async () => {
        await utilityCommon.closeAllBlades();
        await navigationPage.signOut();
    });

    //apurva
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
    });
    afterAll(async () => {
        await navigationPage.signOut();
        await loginPage.login(kingstoneUserName, password);
    });
});