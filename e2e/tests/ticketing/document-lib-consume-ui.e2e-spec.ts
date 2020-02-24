import { browser } from "protractor";
import apiHelper from '../../api/api.helper';
import attachmentBladePo from '../../pageobject/attachment/attachment-blade.po';
import caseConsolePo from '../../pageobject/case/case-console.po';
import createCasePo from '../../pageobject/case/create-case.po';
import editCasePo from '../../pageobject/case/edit-case.po';
import selectCasetemplateBladePo from '../../pageobject/case/select-casetemplate-blade.po';
import viewCasePo from '../../pageobject/case/view-case.po';
import attachDocumentBladePo from '../../pageobject/common/attach-document-blade.po';
import caseAccessTabPo from '../../pageobject/common/case-access-tab.po';
import loginPage from "../../pageobject/common/login.po";
import navigationPage from "../../pageobject/common/navigation.po";
import createDocumentLibraryPo from '../../pageobject/settings/document-management/create-document-library.po';
import documentLibraryConsolePo from '../../pageobject/settings/document-management/document-library-console.po';
import editDocumentLibraryPo from '../../pageobject/settings/document-management/edit-document-library.po';
import editTaskPo from '../../pageobject/task/edit-task.po';
import viewTaskPo from '../../pageobject/task/view-task.po';
import utilCommon from '../../utils/util.common';
import composeMailPo from '../../pageobject/email/compose-mail.po';
import activityTabPo from '../../pageobject/social/activity-tab.po';


describe('Document Library Consume UI', () => {
    beforeAll(async () => {
        await browser.get('/innovationsuite/index.html#/com.bmc.dsm.bwfa');
        await loginPage.login('qkatawazi');
    });

    afterAll(async () => {
        await navigationPage.signOut();
    });

    afterEach(async () => {
        await browser.refresh();
    });

    //kgaikwad
    // DefectID: DRDMV-20519
    it('[DRDMV-13539]: Documents attached on case still accessible when someone deletes them from document library', async () => {
        let filePath = '../../../data/ui/attachment/demo.txt';
        let docLib1 = [...Array(10)].map(i => (~~(Math.random() * 36)).toString(36)).join('');

        await navigationPage.gotoSettingsPage();
        await navigationPage.gotoSettingsMenuItem('Document Management--Library', 'Document Library Console - Business Workflows');
        await createDocumentLibraryPo.openAddNewDocumentBlade();
        await createDocumentLibraryPo.addAttachment(filePath);
        await createDocumentLibraryPo.setTitle(docLib1);
        await createDocumentLibraryPo.selectCompany('Petramco');
        await createDocumentLibraryPo.selectOwnerGroup('Compensation and Benefits');
        await createDocumentLibraryPo.clickOnSaveButton();
        await documentLibraryConsolePo.searchAndOpenDocumentLibrary(docLib1);
        await editDocumentLibraryPo.selectStatus('Published');
        await editDocumentLibraryPo.clickOnSaveButton();

        await navigationPage.gotoCaseConsole();
        let summary = [...Array(10)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        var caseData =
        {
            "Requester": "qtao",
            "Summary": "Test case for DRDMV-8377RandVal" + summary,
            "Support Group": "Compensation and Benefits",
            "Assignee": "qkatawazi"
        }
        await apiHelper.apiLogin('qkatawazi');
        var newCase = await apiHelper.createCase(caseData);
        var caseId: string = newCase.displayId;
        await caseConsolePo.searchAndOpenCase(caseId);
        await viewCasePo.clickEditCaseButton();
        await editCasePo.clickOnAttachLink();
        await attachDocumentBladePo.searchAndAttachDocument(docLib1);
        await editCasePo.clickSaveCase();
        await viewCasePo.clickAttachmentsLink();
        await expect(await utilCommon.deleteAlreadyDownloadedFile('demo.txt')).toBeTruthy('failureMsg: demo.txt File is delete sucessfully');
        await attachmentBladePo.searchAndSelectCheckBox('demo');
        await attachmentBladePo.clickOnDownloadButton();
        await expect(await utilCommon.isFileDownloaded('demo.txt')).toBeTruthy('demo.txt File is not downloaded.');
        await expect(await utilCommon.deleteAlreadyDownloadedFile('demo.txt')).toBeTruthy('failureMsg: demo.txt File is delete sucessfully');
        await attachmentBladePo.clickOnCloseButton();
        await navigationPage.gotoSettingsPage();
        await navigationPage.gotoSettingsMenuItem('Document Management--Library', 'Document Library Console - Business Workflows');
        await documentLibraryConsolePo.searchAndOpenDocumentLibrary(docLib1);
        await editDocumentLibraryPo.selectStatus('Draft');
        await editDocumentLibraryPo.clickOnSaveButton();
        await documentLibraryConsolePo.searchAndOpenDocumentLibrary(docLib1);
        await editDocumentLibraryPo.clickOnDeleteButton();
        await editDocumentLibraryPo.clickOnYesButtonOfDeleteWarningMsg();
        await expect(await utilCommon.getPopUpMessage()).toBe('Document deleted successfully.', 'failureMsg: Document deleted pop up is missing');
        await navigationPage.gotoCaseConsole();
        await caseConsolePo.searchAndOpenCase(caseId);
        await viewCasePo.clickAttachmentsLink();
        await expect(await utilCommon.deleteAlreadyDownloadedFile('demo.txt')).toBeTruthy('failureMsg: Fail to delete demo.txt file');
        await attachmentBladePo.searchAndSelectCheckBox('demo');
        await attachmentBladePo.clickOnDownloadButton();
        await expect(await utilCommon.isFileDownloaded('demo.txt')).toBeTruthy('failureMsg: demo.txt File is not downloaded.');
    }, 150 * 1000);
    
    //kgaikwad
    it('[DRDMV-13533]: Access to the documents attached on case when agent has read access to the case', async () => {
        try {
            let filePath1 = '../../../data/ui/attachment/bwfJpg.jpg';
            let filePath2 = '../../../data/ui/attachment/bwfPdf.pdf';
            let docLib1 = [...Array(10)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
            let docLib2 = [...Array(10)].map(i => (~~(Math.random() * 36)).toString(36)).join('');

            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Document Management--Library', 'Document Library Console - Business Workflows');
            await createDocumentLibraryPo.openAddNewDocumentBlade();
            await createDocumentLibraryPo.addAttachment(filePath1);
            await createDocumentLibraryPo.setTitle(docLib1);
            await createDocumentLibraryPo.selectCompany('Petramco');
            await createDocumentLibraryPo.selectOwnerGroup('Compensation and Benefits');
            await createDocumentLibraryPo.clickOnSaveButton();
            await documentLibraryConsolePo.searchAndOpenDocumentLibrary(docLib1);
            await editDocumentLibraryPo.clickOnAdditionalDetailsOrReadAccessTab('Read Access');
            await editDocumentLibraryPo.selectAddCompanyDropDownOfReadAccess('Petramco');
            await editDocumentLibraryPo.selectAddSupportGroupDropDownOfReadAccess('Staffing');

            await editDocumentLibraryPo.clickOnReadAccessAddButton('Add Support Group');
            await editDocumentLibraryPo.selectStatus('Published');
            await editDocumentLibraryPo.clickOnSaveButton();

            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Document Management--Library', 'Document Library Console - Business Workflows');
            await createDocumentLibraryPo.openAddNewDocumentBlade();
            await createDocumentLibraryPo.addAttachment(filePath2);
            await createDocumentLibraryPo.setTitle(docLib2);
            await createDocumentLibraryPo.selectCompany('Petramco');
            await createDocumentLibraryPo.selectOwnerGroup('Compensation and Benefits');
            await createDocumentLibraryPo.clickOnSaveButton();
            await documentLibraryConsolePo.searchAndOpenDocumentLibrary(docLib2);
            await editDocumentLibraryPo.selectStatus('Published');
            await editDocumentLibraryPo.clickOnSaveButton();

            await navigationPage.gotoCaseConsole();
            let summary = [...Array(10)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
            var caseData =
            {
                "Requester": "qtao",
                "Summary": "Test case for DRDMV-8377RandVal" + summary,
                "Support Group": "Compensation and Benefits",
                "Assignee": "qkatawazi"
            }
            await apiHelper.apiLogin('qkatawazi');
            var newCase = await apiHelper.createCase(caseData);
            var caseId: string = newCase.displayId;
            await caseConsolePo.searchAndOpenCase(caseId);
            await viewCasePo.clickEditCaseButton();
            await editCasePo.clickOnAttachLink();
            await attachDocumentBladePo.searchAndAttachDocument(docLib1);
            await editCasePo.clickOnAttachLink();
            await attachDocumentBladePo.searchAndAttachDocument(docLib2);
            await editCasePo.clickSaveCase();
            await viewCasePo.clickOnTab('Case Access');
            await caseAccessTabPo.clickOnSupportGroupAccessORAgentAccessButton('Agent Access');
            await caseAccessTabPo.selectAndAddAgent('qstrong');
            await expect(await caseAccessTabPo.isAgentNameOrSupportGroupNameDisplayed('Quin Strong')).toBeTruthy('Failuer: Quanah George Agent Name is missing');
            await navigationPage.gotoCaseConsole();
            await navigationPage.signOut();
            await loginPage.login('qstrong');
            await caseConsolePo.searchAndOpenCase(caseId);
            await expect(await viewCasePo.isAttachedDocumentPresent('bwfJpg.jpg')).toBeTruthy('FailuerMsg: Attached Document is missing');
            await expect(await viewCasePo.isAttachedDocumentPresent('bwfPdf.pdf')).toBeFalsy('FailuerMsg: Attached Document is displyaed');
            await expect(await utilCommon.deleteAlreadyDownloadedFile('bwfJpg.jpg')).toBeTruthy('FailuerMsg: File is delete sucessfully');
            await viewCasePo.clickOnAttachedDocumentFile('bwfJpg.jpg');
            await expect(await utilCommon.isFileDownloaded('bwfJpg.jpg')).toBeTruthy('FailuerMsg: File is not downloaded.');
        } catch (e) {
            throw e;
        } finally {
            await navigationPage.signOut();
            await loginPage.login('qkatawazi');
        }
    }, 210 * 1000);

    //kgaikwad
    it('[DRDMV-13524]: Edit Task - Case agent attaches published document from document library where case agent is author of the document', async () => {
        try {
            let randomStr = [...Array(5)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
            let filePath1 = '../../../data/ui/attachment/bwfJpg.jpg';
            let filePath2 = '../../../data/ui/attachment/bwfPdf.pdf';
            let filePath3 = '../../../data/ui/attachment/bwfJpg1.jpg';
            let filePath4 = '../../../data/ui/attachment/bwfJpg2.jpg';
            let filePath5 = '../../../data/ui/attachment/bwfXlsx.xlsx';
            let publishDocLib1 = [...Array(10)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
            let publishDocLib2 = [...Array(10)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
            let publishDocLib3 = [...Array(10)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
            let draftDocLib4 = [...Array(10)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
            let publishDocLib5 = [...Array(10)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
            let caseSummary = [...Array(10)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
            let caseTemplateName = 'caseTemplateName' + randomStr;
            let casTemplateSummary = 'CaseSummaryName' + randomStr;
            let loginId = 'caseagentbwf';
            // Create User and assigned Document Manager Permission to agent
            await apiHelper.apiLogin('tadmin');
            var caseAgentuserData = {
                "firstName": "caseAgent2",
                "lastName": "user2",
                "userId": loginId,
                "userPermission": "AGGAA5V0GE9Z4AOR0BXUOQ3ZT04EJA;AGGADG1AAO0VGAP8SXEGP7VU2U4ZS8",
            }
            await apiHelper.createNewUser(caseAgentuserData);
            await apiHelper.associatePersonToCompany(caseAgentuserData.userId, "Petramco");
             // Create Publish 3 which assigned support group as a 'Facilities' document
             await navigationPage.gotoSettingsPage();
             await navigationPage.gotoSettingsMenuItem('Document Management--Library', 'Document Library Console - Business Workflows');
             await createDocumentLibraryPo.openAddNewDocumentBlade();
             await createDocumentLibraryPo.addAttachment(filePath3);
             await createDocumentLibraryPo.setTitle(publishDocLib3);
             await createDocumentLibraryPo.selectCompany('Petramco');
             await createDocumentLibraryPo.selectOwnerGroup('Staffing');
             await createDocumentLibraryPo.clickOnSaveButton();
             await documentLibraryConsolePo.searchAndOpenDocumentLibrary(publishDocLib3);
             await editDocumentLibraryPo.selectStatus('Published');
             await editDocumentLibraryPo.clickOnSaveButton();

            await navigationPage.signOut();
            await loginPage.login(loginId);
            // Create Case Template 
            let templateData = {
                "templateName": `${caseTemplateName}`,
                "templateSummary": `${casTemplateSummary}`,
                "templateStatus": "Active",
                "company": "Petramco",
                "resolveCaseonLastTaskCompletion": "1",
                "assignee": loginId,
                "supportGroup": "Compensation and Benefits"
            }
            await apiHelper.apiLogin('qkatawazi');
            let newCaseTemplate = await apiHelper.createCaseTemplate(templateData);
            // Create Task Template
            let taskTemplateNameWithYesValue = 'taskTemplateWithYesResolve' + randomStr;
            let taskTemplateSummaryYesValue = 'taskSummaryYesResolved' + randomStr;
            let taskTemplateDataSet = {
                "templateName": `${taskTemplateNameWithYesValue}`,
                "templateSummary": `${taskTemplateSummaryYesValue}`,
                "templateStatus": "Active",
                "assignee": loginId,
                "company": "Petramco",
                "supportGroup": "Compensation and Benefits"
            }
            let manualTaskTemplate = await apiHelper.createManualTaskTemplate(taskTemplateDataSet);
            // Associate Case Template With Task Template
            await apiHelper.associateCaseTemplateWithOneTaskTemplate(newCaseTemplate.displayId, manualTaskTemplate.displayId);
            // Create Publish 1 document
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Document Management--Library', 'Document Library Console - Business Workflows');
            await createDocumentLibraryPo.openAddNewDocumentBlade();
            await createDocumentLibraryPo.addAttachment(filePath1);
            await createDocumentLibraryPo.setTitle(publishDocLib1);
            await createDocumentLibraryPo.selectCompany('Petramco');
            await createDocumentLibraryPo.selectOwnerGroup('Compensation and Benefits');
            await createDocumentLibraryPo.clickOnSaveButton();
            await documentLibraryConsolePo.searchAndOpenDocumentLibrary(publishDocLib1);
            await editDocumentLibraryPo.selectStatus('Published');
            await editDocumentLibraryPo.clickOnSaveButton();
            // Create Publish 2 document
            await createDocumentLibraryPo.openAddNewDocumentBlade();
            await createDocumentLibraryPo.addAttachment(filePath2);
            await createDocumentLibraryPo.setTitle(publishDocLib2);
            await createDocumentLibraryPo.selectCompany('Petramco');
            await createDocumentLibraryPo.selectOwnerGroup('Compensation and Benefits');
            await createDocumentLibraryPo.clickOnSaveButton();
            await documentLibraryConsolePo.searchAndOpenDocumentLibrary(publishDocLib2);
            await editDocumentLibraryPo.selectStatus('Published');
            await editDocumentLibraryPo.clickOnSaveButton();
            // Create Draft document
            await createDocumentLibraryPo.openAddNewDocumentBlade();
            await createDocumentLibraryPo.addAttachment(filePath4);
            await createDocumentLibraryPo.setTitle(draftDocLib4);
            await createDocumentLibraryPo.selectCompany('Petramco');
            await createDocumentLibraryPo.selectOwnerGroup('Compensation and Benefits');
            await createDocumentLibraryPo.clickOnSaveButton();
            // Create publish 5th doc
            await createDocumentLibraryPo.openAddNewDocumentBlade();
            await createDocumentLibraryPo.addAttachment(filePath5);
            await createDocumentLibraryPo.setTitle(publishDocLib5);
            await createDocumentLibraryPo.selectCompany('Petramco');
            await createDocumentLibraryPo.selectOwnerGroup('Compensation and Benefits');
            await createDocumentLibraryPo.clickOnSaveButton();
            await documentLibraryConsolePo.searchAndOpenDocumentLibrary(publishDocLib5);
            await editDocumentLibraryPo.selectStatus('Published');
            await editDocumentLibraryPo.clickOnSaveButton();
            //Create Case
            await navigationPage.gotCreateCase();
            await createCasePo.selectRequester('qtao');
            await createCasePo.setSummary(caseSummary);
            await createCasePo.clickSelectCaseTemplateButton();
            await selectCasetemplateBladePo.selectCaseTemplate(caseTemplateName);
            await createCasePo.clickSaveCaseButton();
            await createCasePo.clickGoToCaseButton();
            await viewCasePo.clickOnTaskLink(taskTemplateSummaryYesValue);
            await viewTaskPo.clickOnEditTask();
            await editTaskPo.clickOnAttachButton();
            await attachDocumentBladePo.clickOnAdvanceSearchButton();
            // Defect
            await attachDocumentBladePo.searchRecord(publishDocLib3);
            await expect(await attachDocumentBladePo.isDocumentLibaryPresent(publishDocLib3)).toBeFalsy('FailuerMsg: publishDocLib3 doc is displayed');
            await attachDocumentBladePo.searchRecord(draftDocLib4);
            await expect(await attachDocumentBladePo.isDocumentLibaryPresent(draftDocLib4)).toBeFalsy('FailuerMsg: draftDocLib4 doc is displayed');
            await attachDocumentBladePo.searchRecord(publishDocLib1);
            await attachDocumentBladePo.selectDocument();
            await attachDocumentBladePo.clickOnAttachButton();
            await editTaskPo.clickOnSaveButton();

            await expect(await viewTaskPo.isAttachedDocumentPresent('bwfJpg.jpg')).toBeTruthy('FailuerMsg: bwfJpg.jpg Attached Document is missing');
            await expect(await utilCommon.deleteAlreadyDownloadedFile('bwfJpg.jpg')).toBeTruthy('FailuerMsg: bwfJpg.jpg File is delete sucessfully');
            await viewTaskPo.clickOnAttachedDocumentFile('bwfJpg.jpg');
            await expect(await utilCommon.isFileDownloaded('bwfJpg.jpg')).toBeTruthy('FailuerMsg: bwfJpg.jpg File is not downloaded.');
            await viewTaskPo.clickOnEditTask();
            await editTaskPo.clickOnAttachButton();
            await attachDocumentBladePo.searchAndAttachDocument(publishDocLib2);
            await editTaskPo.clickOnAttachButton();
            await attachDocumentBladePo.searchAndAttachDocument(publishDocLib5);
            await editTaskPo.clickOnSaveButton();
            await expect(await viewTaskPo.isAttachedDocumentPresent('bwfPdf.pdf')).toBeTruthy('FailuerMsg: bwfPdf.pdf Attached Document is missing');
            await expect(await utilCommon.deleteAlreadyDownloadedFile('bwfPdf.pdf')).toBeTruthy('FailuerMsg: bwfPdf.pdf File is delete sucessfully');
            await viewCasePo.clickOnAttachedDocumentFile('bwfPdf.pdf');
            await expect(await utilCommon.isFileDownloaded('bwfPdf.pdf')).toBeTruthy('FailuerMsg: bwfPdf.pdf File is not downloaded.');
            await expect(await viewTaskPo.isAttachedDocumentPresent('bwfXlsx.xlsx')).toBeTruthy('FailuerMsg:bwfXlsx.xlsx Attached Document is missing');
            await expect(await utilCommon.deleteAlreadyDownloadedFile('bwfXlsx.xlsx')).toBeTruthy('FailuerMsg: bwfXlsx.xlsx File is delete sucessfully');
            await viewCasePo.clickOnAttachedDocumentFile('bwfXlsx.xlsx');
            await expect(await utilCommon.isFileDownloaded('bwfXlsx.xlsx')).toBeTruthy('FailuerMsg: bwfXlsx.xlsx File is not downloaded.');
        } catch (e) {
            throw e;
        } finally {
            await navigationPage.signOut();
            await loginPage.login('qkatawazi');
        }
    }, 440 * 1000);

    //kgaikwad
    it('[DRDMV-13507]: Compose Email - Case agent attaches published document from document library where case agent is author of the document', async () => {
        try {
            let filePath1 = '../../../data/ui/attachment/bwfJpg.jpg';
            let filePath2 = '../../../data/ui/attachment/bwfPdf.pdf';
            let filePath3 = '../../../data/ui/attachment/bwfJpg1.jpg';
            let filePath4 = '../../../data/ui/attachment/bwfJpg2.jpg';
            let filePath5 = '../../../data/ui/attachment/bwfWord1.rtf';
            let publishDocLib1 = [...Array(10)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
            let publishDocLib2 = [...Array(10)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
            let publishDocLib3 = [...Array(10)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
            let draftDocLib4 = [...Array(10)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
            let caseSummary = [...Array(10)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
            let publishDocLib5 = [...Array(10)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
            let loginId = 'caseagentbwf';
            // Create User and assigned Document Manager Permission to agent
            await apiHelper.apiLogin('tadmin');
            var caseAgentuserData = {
                "firstName": "caseAgent2",
                "lastName": "user2",
                "userId": loginId,
                "userPermission": "AGGAA5V0GE9Z4AOR0BXUOQ3ZT04EJA;AGGADG1AAO0VGAP8SXEGP7VU2U4ZS8",
            }
            await apiHelper.createNewUser(caseAgentuserData);
            await apiHelper.associatePersonToCompany(caseAgentuserData.userId, "Petramco");

            // Create Publish 3 which assigned support group as a 'Facilities' document
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Document Management--Library', 'Document Library Console - Business Workflows');
            await createDocumentLibraryPo.openAddNewDocumentBlade();
            await createDocumentLibraryPo.addAttachment(filePath3);
            await createDocumentLibraryPo.setTitle(publishDocLib3);
            await createDocumentLibraryPo.selectCompany('Petramco');
            await createDocumentLibraryPo.selectOwnerGroup('Staffing');
            await createDocumentLibraryPo.clickOnSaveButton();
            await documentLibraryConsolePo.searchAndOpenDocumentLibrary(publishDocLib3);
            await editDocumentLibraryPo.selectStatus('Published');
            await editDocumentLibraryPo.clickOnSaveButton();

            await navigationPage.signOut();
            await loginPage.login(loginId);

            // Create Publish 1 document
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Document Management--Library', 'Document Library Console - Business Workflows');
            await createDocumentLibraryPo.openAddNewDocumentBlade();
            await createDocumentLibraryPo.addAttachment(filePath1);
            await createDocumentLibraryPo.setTitle(publishDocLib1);
            await createDocumentLibraryPo.selectCompany('Petramco');
            await createDocumentLibraryPo.selectOwnerGroup('Compensation and Benefits');
            await createDocumentLibraryPo.clickOnSaveButton();
            await documentLibraryConsolePo.searchAndOpenDocumentLibrary(publishDocLib1);
            await editDocumentLibraryPo.setShareExternallyToogleButton(true);
            await editDocumentLibraryPo.selectStatus('Published');
            await editDocumentLibraryPo.clickOnSaveButton();
            // Create Publish 2 document
            await createDocumentLibraryPo.openAddNewDocumentBlade();
            await createDocumentLibraryPo.addAttachment(filePath2);
            await createDocumentLibraryPo.setTitle(publishDocLib2);
            await createDocumentLibraryPo.selectCompany('Petramco');
            await createDocumentLibraryPo.selectOwnerGroup('Compensation and Benefits');
            await createDocumentLibraryPo.clickOnSaveButton();
            await documentLibraryConsolePo.searchAndOpenDocumentLibrary(publishDocLib2);
            await editDocumentLibraryPo.setShareExternallyToogleButton(true);
            await editDocumentLibraryPo.selectStatus('Published');
            await editDocumentLibraryPo.clickOnSaveButton();
            // Create Draft document
            await createDocumentLibraryPo.openAddNewDocumentBlade();
            await createDocumentLibraryPo.addAttachment(filePath4);
            await createDocumentLibraryPo.setTitle(draftDocLib4);
            await createDocumentLibraryPo.selectCompany('Petramco');
            await createDocumentLibraryPo.selectOwnerGroup('Compensation and Benefits');
            await createDocumentLibraryPo.clickOnSaveButton();
            //Publish 5 doc
            await createDocumentLibraryPo.openAddNewDocumentBlade();
            await createDocumentLibraryPo.addAttachment(filePath5);
            await createDocumentLibraryPo.setTitle(publishDocLib5);
            await createDocumentLibraryPo.selectCompany('Petramco');
            await createDocumentLibraryPo.selectOwnerGroup('Compensation and Benefits');
            await createDocumentLibraryPo.clickOnSaveButton();
            await documentLibraryConsolePo.searchAndOpenDocumentLibrary(publishDocLib5);
            await editDocumentLibraryPo.setShareExternallyToogleButton(true);
            await editDocumentLibraryPo.selectStatus('Published');
            await editDocumentLibraryPo.clickOnSaveButton();

            //Create Case
            await navigationPage.gotCreateCase();
            await createCasePo.selectRequester('qtao');
            await createCasePo.setSummary(caseSummary);
            await createCasePo.clickSaveCaseButton();
            await createCasePo.clickGoToCaseButton();
            await viewCasePo.clickOnEmailLink();
            await composeMailPo.clickOnAttachmentLink();

            await attachDocumentBladePo.clickOnAdvanceSearchButton();
            await attachDocumentBladePo.searchRecord(publishDocLib3);
            await expect(await attachDocumentBladePo.isDocumentLibaryPresent(publishDocLib3)).toBeFalsy('FailuerMsg: publishDocLib3 doc is displayed');

            await attachDocumentBladePo.searchRecord(draftDocLib4);
            await expect(await attachDocumentBladePo.isDocumentLibaryPresent(draftDocLib4)).toBeFalsy('FailuerMsg: publishDocLib3 doc is displayed');

            await attachDocumentBladePo.searchRecord(publishDocLib1);
            await attachDocumentBladePo.selectDocument();
            await attachDocumentBladePo.clickOnAttachButton();
            await composeMailPo.setToOrCCInputTetxbox('To','fritz.schulz@petramco.com');
            await composeMailPo.clickOnSendButton();
            
            await expect(await activityTabPo.isAttachedFileNameDisplayed('bwfJpg.jpg')).toBeTruthy('FailuerMsg: bwfJpg.jpg Attached Document is missing');
            await expect(await utilCommon.deleteAlreadyDownloadedFile('bwfJpg.jpg')).toBeTruthy('FailuerMsg: bwfJpg.jpg File is delete sucessfully');
            await activityTabPo.clickAndDownloadAttachmentFile('bwfJpg.jpg');
            await expect(await utilCommon.isFileDownloaded('bwfJpg.jpg')).toBeTruthy('FailuerMsg: bwfJpg.jpg File is not downloaded.');

            await viewCasePo.clickOnEmailLink();
            await composeMailPo.clickOnAttachmentLink();
            await attachDocumentBladePo.searchAndAttachDocument(publishDocLib2);
            await composeMailPo.clickOnAttachmentLink();
            await attachDocumentBladePo.searchAndAttachDocument(publishDocLib5);
            await composeMailPo.setToOrCCInputTetxbox('To','fritz.schulz@petramco.com');
            await composeMailPo.clickOnSendButton();

            await expect(await activityTabPo.isAttachedFileNameDisplayed('bwfPdf.pdf')).toBeTruthy('FailuerMsg: bwfPdf.pdf Attached Document is missing');
            await expect(await utilCommon.deleteAlreadyDownloadedFile('bwfPdf.pdf')).toBeTruthy('FailuerMsg: bwfPdf.pdf File is delete sucessfully');
            await activityTabPo.clickAndDownloadAttachmentFile('bwfPdf.pdf');
            await expect(await utilCommon.isFileDownloaded('bwfPdf.pdf')).toBeTruthy('FailuerMsg: bwfPdf.pdf File is not downloaded.');

            await expect(await activityTabPo.isAttachedFileNameDisplayed('bwfWord1.rtf')).toBeTruthy('FailuerMsg: bwfWord1.rtf Attached Document is missing');
            await expect(await utilCommon.deleteAlreadyDownloadedFile('bwfWord1.rtf')).toBeTruthy('FailuerMsg: bwfWord1.rtf File is delete sucessfully');
            await activityTabPo.clickAndDownloadAttachmentFile('bwfWord1.rtf');
            await expect(await utilCommon.isFileDownloaded('bwfWord1.rtf')).toBeTruthy('FailuerMsg: bwfWord1.rtf File is not downloaded.');
        } catch (e) {
            throw e;
        } finally {
            await navigationPage.signOut();
            await loginPage.login('qkatawazi');
        }
    }, 530 * 1000);


})