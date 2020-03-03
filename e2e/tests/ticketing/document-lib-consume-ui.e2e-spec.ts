import { browser } from "protractor";
import apiHelper from '../../api/api.helper';
import attachmentBladePo from '../../pageobject/attachment/attachment-blade.po';
import caseConsolePo from '../../pageobject/case/case-console.po';
import createCasePo from '../../pageobject/case/create-case.po';
import editCasePo from '../../pageobject/case/edit-case.po';
import quickCasePo from '../../pageobject/case/quick-case.po';
import selectCasetemplateBladePo from '../../pageobject/case/select-casetemplate-blade.po';
import viewCasePo from '../../pageobject/case/view-case.po';
import attachDocumentBladePo from '../../pageobject/common/attach-document-blade.po';
import caseAccessTabPo from '../../pageobject/common/case-access-tab.po';
import loginPage from "../../pageobject/common/login.po";
import navigationPage from "../../pageobject/common/navigation.po";
import resourcesTabPo from '../../pageobject/common/resources-tab.po';
import composeMailPo from '../../pageobject/email/compose-mail.po';
import documentLibraryConsolePo from '../../pageobject/settings/document-management/document-library-console.po';
import editDocumentLibraryPo from '../../pageobject/settings/document-management/edit-document-library.po';
import activityTabPo from '../../pageobject/social/activity-tab.po';
import adhoctaskTemplate from "../../pageobject/task/create-adhoc-task.po";
import editTaskPo from '../../pageobject/task/edit-task.po';
import { default as manageTask } from "../../pageobject/task/manage-task-blade.po";
import viewTaskPo from '../../pageobject/task/view-task.po';
import utilCommon from '../../utils/util.common';


describe('Document Library Consume UI', () => {
    let filePath1 = 'e2e/data/ui/attachment/bwfJpg.jpg';
    let filePath2 = 'e2e/data/ui/attachment/bwfPdf.pdf';
    let filePath3 = 'e2e/data/ui/attachment/bwfJpg1.jpg';
    let filePath4 = 'e2e/data/ui/attachment/bwfJpg2.jpg';
    let filePath5 = 'e2e/data/ui/attachment/bwfXlsx.xlsx';
    // let publishDocLib1 = [...Array(10)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
    // let publishDocLib2 = [...Array(10)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
    // let publishDocLib3 = [...Array(10)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
    // let draftDocLib4 = [...Array(10)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
    // let publishDocLib5 = [...Array(10)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
    let caseSummary = [...Array(10)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
    let loginId = 'caseagentbwf';
    beforeAll(async () => {
        await browser.get('/innovationsuite/index.html#/com.bmc.dsm.bwfa');
        await loginPage.login('qkatawazi');
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
        await apiHelper.associatePersonToSupportGroup(loginId, 'Compensation and Benefits');
    });

    afterAll(async () => {
        await navigationPage.signOut();
    });

    afterEach(async () => {
        await browser.refresh();
    });

    //kgaikwad
    it('[DRDMV-13539]: Documents attached on case still accessible when someone deletes them from document library', async () => {
        //   Create Publish 1 document
        let publishDocData = {
            docLibTitle: 'drdmv13539_document',
            company: 'Petramco',
            ownerGroup: 'Compensation and Benefits',
        }
        await apiHelper.apiLogin('tadmin');
        await apiHelper.deleteDocumentLibrary(publishDocData.docLibTitle);
        await apiHelper.apiLogin('qkatawazi');
        let docLib = await apiHelper.createDocumentLibrary(publishDocData, filePath1);
        await apiHelper.publishDocumentLibrary(docLib);

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
        await browser.sleep(5000);
        await viewCasePo.clickEditCaseButton();
        await editCasePo.clickOnAttachLink();
        await attachDocumentBladePo.searchAndAttachDocument('drdmv13539_document');
        await editCasePo.clickSaveCase();
        await viewCasePo.clickAttachmentsLink();
        await expect(await utilCommon.deleteAlreadyDownloadedFile('bwfJpg.jpg')).toBeTruthy('failureMsg: bwfJpg.jpg File is delete sucessfully');
        await attachmentBladePo.searchAndSelectCheckBox('bwfJpg');
        await attachmentBladePo.clickOnDownloadButton();
        await expect(await utilCommon.isFileDownloaded('bwfJpg.jpg')).toBeTruthy('bwfJpg.jpg File is not downloaded.');
        await expect(await utilCommon.deleteAlreadyDownloadedFile('bwfJpg.jpg')).toBeTruthy('failureMsg: bwfJpg.jpg File is delete sucessfully');
        await attachmentBladePo.clickOnCloseButton();
        await navigationPage.gotoSettingsPage();
        await navigationPage.gotoSettingsMenuItem('Document Management--Library', 'Document Library Console - Business Workflows');
        await documentLibraryConsolePo.searchAndOpenDocumentLibrary('drdmv13539_document');
        await editDocumentLibraryPo.selectStatus('Draft');
        await editDocumentLibraryPo.clickOnSaveButton();
        await apiHelper.apiLogin('tadmin');
        await apiHelper.deleteDocumentLibrary(publishDocData.docLibTitle);

        await navigationPage.gotoCaseConsole();
        await caseConsolePo.searchAndOpenCase(caseId);
        await viewCasePo.clickAttachmentsLink();
        await expect(await utilCommon.deleteAlreadyDownloadedFile('bwfJpg.jpg')).toBeTruthy('failureMsg: Fail to delete bwfJpg.jpg file');
        await attachmentBladePo.searchAndSelectCheckBox('bwfJpg');
        await attachmentBladePo.clickOnDownloadButton();
        await expect(await utilCommon.isFileDownloaded('bwfJpg.jpg')).toBeTruthy('failureMsg: bwfJpg.jpg File is not downloaded.');
    }, 140 * 1000);

    //kgaikwad
    it('[DRDMV-13533]: Access to the documents attached on case when agent has read access to the case', async () => {
        try {
            //   Create Publish 1 document
            let publishDocLibData1 = {
                docLibTitle: 'drdmv13533_publish_document1',
                company: 'Petramco',
                ownerGroup: 'Compensation and Benefits',
            }
            await apiHelper.apiLogin('tadmin');
            await apiHelper.deleteDocumentLibrary(publishDocLibData1.docLibTitle);
            await apiHelper.apiLogin('qkatawazi');
            let docLib = await apiHelper.createDocumentLibrary(publishDocLibData1, filePath1);
            await apiHelper.giveReadAccessToDocLib(docLib, "Staffing");
            await apiHelper.publishDocumentLibrary(docLib);

            // Create Publish 2 doc
            let publishDocLibData2 = {
                docLibTitle: 'drdmv13533_publish_document2',
                company: 'Petramco',
                ownerGroup: 'Compensation and Benefits',
            }
            await apiHelper.apiLogin('tadmin');
            await apiHelper.deleteDocumentLibrary(publishDocLibData2.docLibTitle);
            await apiHelper.apiLogin('qkatawazi');
            let docLib2 = await apiHelper.createDocumentLibrary(publishDocLibData2, filePath2);
            await apiHelper.publishDocumentLibrary(docLib2);

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
            await attachDocumentBladePo.searchAndAttachDocument('drdmv13533_publish_document1');
            await editCasePo.clickOnAttachLink();
            await attachDocumentBladePo.searchAndAttachDocument('drdmv13533_publish_document2');
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
    }, 140 * 1000);

    //kgaikwad
    it('[DRDMV-13524]: Edit Task - Case agent attaches published document from document library where case agent is author of the document', async () => {
        try {
            let randomStr = [...Array(5)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
            let caseTemplateName = 'caseTemplateName' + randomStr;
            let casTemplateSummary = 'CaseSummaryName' + randomStr;

            // Create Publish 3 which assigned support group as a 'Staffing' document
            let publishDocLibData2 = {
                docLibTitle: 'drdmv13524_publish_document3',
                company: 'Petramco',
                ownerGroup: 'Staffing',
            }
            await apiHelper.apiLogin('tadmin');
            await apiHelper.deleteDocumentLibrary(publishDocLibData2.docLibTitle);
            await apiHelper.apiLogin('qkatawazi');
            let docLib3 = await apiHelper.createDocumentLibrary(publishDocLibData2, filePath1);
            await apiHelper.publishDocumentLibrary(docLib3);

            // Create Case Template 
            let templateData = {
                "templateName": caseTemplateName,
                "templateSummary": casTemplateSummary,
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

            // Create publish1, publish2,publish5 document libarary 
            let publishDocLibData1: string[] = ['drdmv13524_publish_document1', 'drdmv13524_publish_document2', 'drdmv13524_publish_document5'];
            let files1: string[] = [filePath1, filePath2, filePath5];
            for (let i = 0; i < publishDocLibData1.length; i++) {
                let docLibData1 = {
                    docLibTitle: publishDocLibData1[i],
                    company: 'Petramco',
                    ownerGroup: 'Staffing',
                }
                await apiHelper.apiLogin('tadmin');
                await apiHelper.deleteDocumentLibrary(docLibData1.docLibTitle);
                await apiHelper.apiLogin(loginId);
                let getFilePath1 = files1[i];
                let docLib = await apiHelper.createDocumentLibrary(docLibData1, getFilePath1);
                await apiHelper.publishDocumentLibrary(docLib);
            }

            // Create Draft 4th document
            let draftDocLibData = {
                docLibTitle: 'drdmv13524_draft_document',
                company: 'Petramco',
                ownerGroup: 'Staffing',
            }
            await apiHelper.apiLogin('tadmin');
            await apiHelper.deleteDocumentLibrary(draftDocLibData.docLibTitle);
            await apiHelper.apiLogin(loginId);
            await apiHelper.createDocumentLibrary(draftDocLibData, filePath4);

            // SignOut & Login in
            await navigationPage.signOut();
            await loginPage.login(loginId);
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

            await attachDocumentBladePo.searchRecord('drdmv13524_publish_document3');
            await expect(await attachDocumentBladePo.isDocumentLibaryPresent('drdmv13524_publish_document3')).toBeFalsy('FailuerMsg: drdmv13524_publish_document3 doc is displayed');
            await attachDocumentBladePo.searchRecord('drdmv13524_draft_document');
            await expect(await attachDocumentBladePo.isDocumentLibaryPresent('drdmv13524_draft_document')).toBeFalsy('FailuerMsg: drdmv13524_draft_document doc is displayed');
            await attachDocumentBladePo.searchRecord('drdmv13524_publish_document1');
            await attachDocumentBladePo.selectDocument();
            await attachDocumentBladePo.clickOnAttachButton();
            await editTaskPo.clickOnSaveButton();

            await expect(await viewTaskPo.isAttachedDocumentPresent('bwfJpg.jpg')).toBeTruthy('FailuerMsg: bwfJpg.jpg Attached Document is missing');
            await expect(await utilCommon.deleteAlreadyDownloadedFile('bwfJpg.jpg')).toBeTruthy('FailuerMsg: bwfJpg.jpg File is delete sucessfully');
            await viewTaskPo.clickOnAttachedDocumentFile('bwfJpg.jpg');
            await expect(await utilCommon.isFileDownloaded('bwfJpg.jpg')).toBeTruthy('FailuerMsg: bwfJpg.jpg File is not downloaded.');
            await viewTaskPo.clickOnEditTask();
            await editTaskPo.clickOnAttachButton();
            await attachDocumentBladePo.searchAndAttachDocument('drdmv13524_publish_document2');
            await editTaskPo.clickOnAttachButton();
            await attachDocumentBladePo.searchAndAttachDocument('drdmv13524_publish_document5');
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
            // Create Publish 3 which assigned support group as a 'Staffing' document
            let publishDocLibData1 = {
                docLibTitle: 'drdmv13507_publish_document3',
                company: 'Petramco',
                ownerGroup: 'Staffing',
            }
            await apiHelper.apiLogin('tadmin');
            await apiHelper.deleteDocumentLibrary(publishDocLibData1.docLibTitle);
            await apiHelper.apiLogin('qkatawazi');
            let docLib3 = await apiHelper.createDocumentLibrary(publishDocLibData1, filePath3);
            await apiHelper.publishDocumentLibrary(docLib3);

            // Create publish1, publish2,publish5 document libarary for write access of "Staffing" group
            let publishDocLibData2: string[] = ['drdmv13507_publish_document1', 'drdmv13507_publish_document2', 'drdmv13507_publish_document5'];
            let files1: string[] = [filePath1, filePath2, filePath5];
            // delete if doc lib with same name exists
            for (let i = 0; i < publishDocLibData2.length; i++) {
                let docLibData1 = {
                    docLibTitle: publishDocLibData2[i],
                    company: 'Petramco',
                    ownerGroup: 'Staffing',
                    shareExternally: true
                }
                await apiHelper.apiLogin('tadmin');
                await apiHelper.deleteDocumentLibrary(docLibData1.docLibTitle);
                await apiHelper.apiLogin(loginId);
                let getFilePath1 = files1[i];
                let docLib = await apiHelper.createDocumentLibrary(docLibData1, getFilePath1);
                await apiHelper.publishDocumentLibrary(docLib);
            }
            // Create Draft 4th document
            let draftDocLibData = {
                docLibTitle: 'drdmv13507_draft_document',
                company: 'Petramco',
                ownerGroup: 'Staffing',
                shareExternally: true
            }
            await apiHelper.apiLogin('tadmin');
            await apiHelper.deleteDocumentLibrary(draftDocLibData.docLibTitle);
            await apiHelper.apiLogin(loginId);
            await apiHelper.createDocumentLibrary(draftDocLibData, filePath4);
            // SignOut & Login in
            await navigationPage.signOut();
            await loginPage.login(loginId);
            //Create Case
            await navigationPage.gotCreateCase();
            await createCasePo.selectRequester('qtao');
            await createCasePo.setSummary(caseSummary);
            await createCasePo.clickSaveCaseButton();
            await createCasePo.clickGoToCaseButton();
            await viewCasePo.clickOnEmailLink();
            await composeMailPo.clickOnAttachmentLink();

            await attachDocumentBladePo.clickOnAdvanceSearchButton();
            await attachDocumentBladePo.searchRecord('drdmv13507_publish_document3');
            await expect(await attachDocumentBladePo.isDocumentLibaryPresent('drdmv13507_publish_document3')).toBeFalsy('FailuerMsg: drdmv13507_publish_document1 doc is displayed');

            await attachDocumentBladePo.searchRecord('drdmv13507_draft_document');
            await expect(await attachDocumentBladePo.isDocumentLibaryPresent('drdmv13507_draft_document')).toBeFalsy('FailuerMsg: publishDocLib3 doc is displayed');

            await attachDocumentBladePo.searchRecord('drdmv13507_publish_document1');
            await attachDocumentBladePo.selectDocument();
            await attachDocumentBladePo.clickOnAttachButton();
            await composeMailPo.setToOrCCInputTetxbox('To', 'fritz.schulz@petramco.com');
            await composeMailPo.clickOnSendButton();

            await expect(await activityTabPo.isAttachedFileNameDisplayed('bwfJpg.jpg')).toBeTruthy('FailuerMsg: bwfJpg.jpg Attached Document is missing');
            await expect(await utilCommon.deleteAlreadyDownloadedFile('bwfJpg.jpg')).toBeTruthy('FailuerMsg: bwfJpg.jpg File is delete sucessfully');
            await activityTabPo.clickAndDownloadAttachmentFile('bwfJpg.jpg');
            await expect(await utilCommon.isFileDownloaded('bwfJpg.jpg')).toBeTruthy('FailuerMsg: bwfJpg.jpg File is not downloaded.');

            await viewCasePo.clickOnEmailLink();
            await composeMailPo.clickOnAttachmentLink();
            await attachDocumentBladePo.searchAndAttachDocument('drdmv13507_publish_document2');
            await composeMailPo.clickOnAttachmentLink();
            await attachDocumentBladePo.searchAndAttachDocument('drdmv13507_publish_document5');
            await composeMailPo.setToOrCCInputTetxbox('To', 'fritz.schulz@petramco.com');
            await composeMailPo.clickOnSendButton();

            await expect(await activityTabPo.isAttachedFileNameDisplayed('bwfPdf.pdf')).toBeTruthy('FailuerMsg: bwfPdf.pdf Attached Document is missing');
            await expect(await utilCommon.deleteAlreadyDownloadedFile('bwfPdf.pdf')).toBeTruthy('FailuerMsg: bwfPdf.pdf File is delete sucessfully');
            await activityTabPo.clickAndDownloadAttachmentFile('bwfPdf.pdf');
            await expect(await utilCommon.isFileDownloaded('bwfPdf.pdf')).toBeTruthy('FailuerMsg: bwfPdf.pdf File is not downloaded.');

            await expect(await activityTabPo.isAttachedFileNameDisplayed('bwfXlsx.xlsx')).toBeTruthy('FailuerMsg: bwfXlsx.xlsx Attached Document is missing');
            await expect(await utilCommon.deleteAlreadyDownloadedFile('bwfXlsx.xlsx')).toBeTruthy('FailuerMsg: bwfXlsx.xlsx File is delete sucessfully');
            await activityTabPo.clickAndDownloadAttachmentFile('bwfXlsx.xlsx');
            await expect(await utilCommon.isFileDownloaded('bwfXlsx.xlsx')).toBeTruthy('FailuerMsg: bwfXlsx.xlsx File is not downloaded.');
        } catch (e) {
            throw e;
        } finally {
            await navigationPage.signOut();
            await loginPage.login('qkatawazi');
        }
    }, 420 * 1000);

    //kgaikwad
    it('[DRDMV-13449]: Edit Case - Case agent attaches published document from document library who has write access to that document', async () => {
        try {
            // Create publish1, publish2,publish3 document libarary for write access of "Compensation and Benefits" group
            let publishDocLibData1: string[] = ['drdmv13449_publish_document1', 'drdmv13449_publish_document2', 'drdmv13449_publish_document5'];
            let files1: string[] = [filePath1, filePath2, filePath5];
            // delete if doc lib with same name exists
            for (let i = 0; i < publishDocLibData1.length; i++) {
                let docLibData1 = {
                    docLibTitle: publishDocLibData1[i],
                    company: 'Petramco',
                    ownerGroup: 'Compensation and Benefits',
                }
                await apiHelper.apiLogin('tadmin');
                await apiHelper.deleteDocumentLibrary(docLibData1.docLibTitle);
                await apiHelper.apiLogin('qkatawazi');
                let getFilePath1 = files1[i];
                let docLib = await apiHelper.createDocumentLibrary(docLibData1, getFilePath1);
                await apiHelper.publishDocumentLibrary(docLib);
            }
            // Create Publish 3 which assigned support group as a 'Facilities' document
            let publishDocLibData2 = {
                docLibTitle: 'drdmv13449_publish_document3',
                company: 'Petramco',
                ownerGroup: 'Staffing',
            }
            await apiHelper.apiLogin('tadmin');
            await apiHelper.deleteDocumentLibrary(publishDocLibData2.docLibTitle);
            await apiHelper.apiLogin('qkatawazi');
            let docLib3 = await apiHelper.createDocumentLibrary(publishDocLibData2, filePath3);
            await apiHelper.publishDocumentLibrary(docLib3);
            // Create Draft 4th document
            let draftDocLibData = {
                docLibTitle: 'drdmv13449_draft_document',
                company: 'Petramco',
                ownerGroup: 'Compensation and Benefits',
            }
            await apiHelper.apiLogin('tadmin');
            await apiHelper.deleteDocumentLibrary(draftDocLibData.docLibTitle);
            await apiHelper.apiLogin('qkatawazi');
            await apiHelper.createDocumentLibrary(draftDocLibData, filePath4);

            // signOut & Login in with Agent
            await navigationPage.signOut();
            await loginPage.login(loginId);
            //Create Case
            await navigationPage.gotCreateCase();
            await createCasePo.selectRequester('qtao');
            await createCasePo.setSummary(caseSummary);
            await createCasePo.clickSaveCaseButton();
            await createCasePo.clickGoToCaseButton();
            await viewCasePo.clickEditCaseButton();
            await editCasePo.clickOnAttachLink();
            await attachDocumentBladePo.clickOnAdvanceSearchButton();

            // await attachDocumentBladePo.searchRecord('drdmv13449_publish_document3');
            // await expect(await attachDocumentBladePo.isDocumentLibaryPresent('drdmv13449_publish_document3')).toBeFalsy('FailuerMsg: drdmv13449_publish_document3 doc is displayed');
            // await attachDocumentBladePo.searchRecord('drdmv13449_draft_document');
            // await expect(await attachDocumentBladePo.isDocumentLibaryPresent('drdmv13449_draft_document')).toBeFalsy('FailuerMsg: draftDocLib4 doc is displayed');
            await attachDocumentBladePo.searchRecord('drdmv13449_publish_document1');
            await attachDocumentBladePo.selectDocument();
            await attachDocumentBladePo.clickOnAttachButton();
            await editCasePo.clickSaveCase();

            await expect(await viewCasePo.isAttachedDocumentPresent('bwfJpg.jpg')).toBeTruthy('FailuerMsg: bwfJpg.jpg Attached Document is missing');
            await expect(await utilCommon.deleteAlreadyDownloadedFile('bwfJpg.jpg')).toBeTruthy('FailuerMsg: bwfJpg.jpg File is delete sucessfully');
            await viewCasePo.clickOnAttachedDocumentFile('bwfJpg.jpg');
            await expect(await utilCommon.isFileDownloaded('bwfJpg.jpg')).toBeTruthy('FailuerMsg: bwfJpg.jpg File is not downloaded.');
            await viewCasePo.clickEditCaseButton();
            await editCasePo.clickOnAttachLink();
            await attachDocumentBladePo.searchAndAttachDocument('drdmv13449_publish_document2');
            await editCasePo.clickOnAttachLink();
            await attachDocumentBladePo.searchAndAttachDocument('drdmv13449_publish_document5');
            await editCasePo.clickSaveCase();

            await expect(await viewCasePo.isAttachedDocumentPresent('bwfPdf.pdf')).toBeTruthy('FailuerMsg: bwfPdf.pdf Attached Document is missing');
            await expect(await utilCommon.deleteAlreadyDownloadedFile('bwfPdf.pdf')).toBeTruthy('FailuerMsg: bwfPdf.pdf File is delete sucessfully');
            await viewCasePo.clickOnAttachedDocumentFile('bwfPdf.pdf');
            await expect(await utilCommon.isFileDownloaded('bwfPdf.pdf')).toBeTruthy('FailuerMsg: bwfPdf.pdf File is not downloaded.');

            await expect(await viewCasePo.isAttachedDocumentPresent('bwfXlsx.xlsx')).toBeTruthy('FailuerMsg:bwfXlsx.xlsx Attached Document is missing');
            await expect(await utilCommon.deleteAlreadyDownloadedFile('bwfXlsx.xlsx')).toBeTruthy('FailuerMsg: bwfXlsx.xlsx File is delete sucessfully');
            await viewCasePo.clickOnAttachedDocumentFile('bwfXlsx.xlsx');
            await expect(await utilCommon.isFileDownloaded('bwfXlsx.xlsx')).toBeTruthy('FailuerMsg: bwfXlsx.xlsx File is not downloaded.');
        } catch (e) {
            throw e;
        } finally {
            await navigationPage.signOut();
            await loginPage.login('qkatawazi');
        }
    }, 340 * 1000);

    //kgaikwad
    it('[DRDMV-13480]: Add Activity - Case agent attaches published document from document library who has read access to that document', async () => {
        try {
            let addNoteText = [...Array(10)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
            // Create publish1, publish2,publish3 document libarary for write access of "Compensation and Benefits" group
            let publishDocLibData1: string[] = ['drdmv13480_publish_document1', 'drdmv13480_publish_document2', 'drdmv13480_publish_document5'];
            let files1: string[] = [filePath1, filePath2, filePath5];
            // delete if doc lib with same name exists
            for (let i = 0; i < publishDocLibData1.length; i++) {
                let docLibData1 = {
                    docLibTitle: publishDocLibData1[i],
                    company: 'Petramco',
                    ownerGroup: 'Staffing',
                }
                await apiHelper.apiLogin('tadmin');
                await apiHelper.deleteDocumentLibrary(docLibData1.docLibTitle);
                await apiHelper.apiLogin('qkatawazi');
                let getFilePath1 = files1[i];
                let docLib = await apiHelper.createDocumentLibrary(docLibData1, getFilePath1);
                await apiHelper.apiLogin('qheroux');   //Always login from the owner group member to assign access 
                await apiHelper.giveReadAccessToDocLib(docLib, "Compensation and Benefits");
                await apiHelper.publishDocumentLibrary(docLib);
            }
            // Create Publish 3 which assigned support group as a 'Staffing' document
            let publishDocLibData2 = {
                docLibTitle: 'drdmv13480_publish_document3',
                company: 'Petramco',
                ownerGroup: 'Staffing',
            }
            await apiHelper.apiLogin('tadmin');
            await apiHelper.deleteDocumentLibrary(publishDocLibData2.docLibTitle);
            await apiHelper.apiLogin('qkatawazi');
            let docLib3 = await apiHelper.createDocumentLibrary(publishDocLibData2, filePath3);
            await apiHelper.publishDocumentLibrary(docLib3);
            // Create Draft 4th document
            let draftDocLibData = {
                docLibTitle: 'drdmv13480_draft_document',
                company: 'Petramco',
                ownerGroup: 'Compensation and Benefits',
            }
            await apiHelper.apiLogin('tadmin');
            await apiHelper.deleteDocumentLibrary(draftDocLibData.docLibTitle);
            await apiHelper.apiLogin('qkatawazi');
            await apiHelper.createDocumentLibrary(draftDocLibData, filePath4);

            await navigationPage.signOut();
            await loginPage.login(loginId);

            //Create Case
            await navigationPage.gotCreateCase();
            await createCasePo.selectRequester('qtao');
            await createCasePo.setSummary(caseSummary);
            await createCasePo.clickSaveCaseButton();
            await createCasePo.clickGoToCaseButton();
            // Activity Tab
            await activityTabPo.addActivityNote(addNoteText);
            await activityTabPo.clickOnAttachLink();
            await attachDocumentBladePo.clickOnAdvanceSearchButton();

            await attachDocumentBladePo.searchRecord('drdmv13480_publish_document3');
            await expect(await attachDocumentBladePo.isDocumentLibaryPresent('drdmv13480_publish_document3')).toBeFalsy('FailuerMsg: drdmv13480_publish_document3 doc is displayed');
            await attachDocumentBladePo.searchRecord('drdmv13480_draft_document');
            await expect(await attachDocumentBladePo.isDocumentLibaryPresent('drdmv13480_draft_document')).toBeFalsy('FailuerMsg: drdmv13480_draft_document doc is displayed');
            await attachDocumentBladePo.searchRecord('drdmv13480_publish_document1');
            await attachDocumentBladePo.selectDocument();
            await attachDocumentBladePo.clickOnAttachButton();
            await activityTabPo.clickOnPostButton();
            await utilCommon.waitUntilSpinnerToHide();
            await expect(await activityTabPo.isAttachedFileNameDisplayed('bwfJpg.jpg')).toBeTruthy('FailuerMsg: bwfJpg.jpg Attached Document is missing');
            await expect(await utilCommon.deleteAlreadyDownloadedFile('bwfJpg.jpg')).toBeTruthy('FailuerMsg: bwfJpg.jpg File is delete sucessfully');
            await activityTabPo.clickAndDownloadAttachmentFile('bwfJpg.jpg');
            await expect(await utilCommon.isFileDownloaded('bwfJpg.jpg')).toBeTruthy('FailuerMsg: bwfJpg.jpg File is not downloaded.');

            // Multiple attachment
            await activityTabPo.addActivityNote(addNoteText);
            await activityTabPo.clickOnAttachLink();
            await attachDocumentBladePo.searchAndAttachDocument('drdmv13480_publish_document2');
            await activityTabPo.clickOnAttachLink();
            await attachDocumentBladePo.searchAndAttachDocument('drdmv13480_publish_document5');
            await activityTabPo.clickOnPostButton();
            await utilCommon.waitUntilSpinnerToHide();
            await expect(await activityTabPo.isAttachedFileNameDisplayed('bwfPdf.pdf')).toBeTruthy('FailuerMsg: bwfPdf.pdf Attached Document is missing');
            await expect(await utilCommon.deleteAlreadyDownloadedFile('bwfPdf.pdf')).toBeTruthy('FailuerMsg: bwfPdf.pdf File is delete sucessfully');
            await activityTabPo.clickAndDownloadAttachmentFile('bwfPdf.pdf');
            await expect(await utilCommon.isFileDownloaded('bwfPdf.pdf')).toBeTruthy('FailuerMsg: bwfPdf.pdf File is not downloaded.');

            await expect(await activityTabPo.isAttachedFileNameDisplayed('bwfXlsx.xlsx')).toBeTruthy('FailuerMsg:bwfXlsx.xlsx Attached Document is missing');
            await expect(await utilCommon.deleteAlreadyDownloadedFile('bwfXlsx.xlsx')).toBeTruthy('FailuerMsg: bwfXlsx.xlsx File is delete sucessfully');
            await activityTabPo.clickAndDownloadAttachmentFile('bwfXlsx.xlsx');
            await expect(await utilCommon.isFileDownloaded('bwfXlsx.xlsx')).toBeTruthy('FailuerMsg: bwfXlsx.xlsx File is not downloaded.');
        } catch (e) {
            throw e;
        } finally {
            await navigationPage.signOut();
            await loginPage.login('qkatawazi');
        }
    }, 350 * 1000);

    //kgaikwad
    it('[DRDMV-13479]: Add Activity - Case business analyst attaches published document from document library who has read access to that document', async () => {
        try {
            let addNoteText = [...Array(10)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
            // Create publish1, publish2,publish3 document libarary for write access of "Compensation and Benefits" group
            let publishDocLibData1: string[] = ['drdmv13479_publish_document1', 'drdmv13479_publish_document2', 'drdmv13479_publish_document5'];
            let files1: string[] = [filePath1, filePath2, filePath5];
            // delete if doc lib with same name exists
            for (let i = 0; i < publishDocLibData1.length; i++) {
                let docLibData1 = {
                    docLibTitle: publishDocLibData1[i],
                    company: 'Petramco',
                    ownerGroup: 'Staffing',
                }
                await apiHelper.apiLogin('tadmin');
                await apiHelper.deleteDocumentLibrary(docLibData1.docLibTitle);
                await apiHelper.apiLogin('elizabeth');
                let getFilePath1 = files1[i];
                let docLib = await apiHelper.createDocumentLibrary(docLibData1, getFilePath1);
                await apiHelper.apiLogin('qheroux');
                await apiHelper.giveReadAccessToDocLib(docLib, "Compensation and Benefits");
                await apiHelper.publishDocumentLibrary(docLib);
            }
            // Create Publish 3 which assigned support group as a 'Staffing' document
            let publishDocLibData2 = {
                docLibTitle: 'drdmv13479_publish_document3',
                company: 'Petramco',
                ownerGroup: 'Staffing',
            }
            await apiHelper.apiLogin('tadmin');
            await apiHelper.deleteDocumentLibrary(publishDocLibData2.docLibTitle);
            await apiHelper.apiLogin('elizabeth');
            let docLib3 = await apiHelper.createDocumentLibrary(publishDocLibData2, filePath3);
            await apiHelper.publishDocumentLibrary(docLib3);
            // Create Draft 4th document
            let draftDocLibData = {
                docLibTitle: 'drdmv13479_draft_document',
                company: 'Petramco',
                ownerGroup: 'Compensation and Benefits',
            }
            await apiHelper.apiLogin('tadmin');
            await apiHelper.deleteDocumentLibrary(draftDocLibData.docLibTitle);
            await apiHelper.apiLogin('elizabeth');
            await apiHelper.createDocumentLibrary(draftDocLibData, filePath4);
            // SignOut & Login 
            await navigationPage.signOut();
            await loginPage.login('qkatawazi');
            //Create Case
            await navigationPage.gotCreateCase();
            await createCasePo.selectRequester('qtao');
            await createCasePo.setSummary(caseSummary);
            await createCasePo.clickSaveCaseButton();
            await createCasePo.clickGoToCaseButton();
            // Activity Tab
            await activityTabPo.addActivityNote(addNoteText);
            await activityTabPo.clickOnAttachLink();
            await attachDocumentBladePo.clickOnAdvanceSearchButton();

            await attachDocumentBladePo.searchRecord('drdmv13479_publish_document3');
            await expect(await attachDocumentBladePo.isDocumentLibaryPresent('drdmv13479_publish_document3')).toBeFalsy('FailuerMsg: drdmv13479_publish_document3 doc is displayed');
            await attachDocumentBladePo.searchRecord('drdmv13479_draft_document');
            await expect(await attachDocumentBladePo.isDocumentLibaryPresent('drdmv13479_draft_document')).toBeFalsy('FailuerMsg: draftDocLib4 doc is displayed');
            await attachDocumentBladePo.searchRecord('drdmv13479_publish_document1');
            await attachDocumentBladePo.selectDocument();
            await attachDocumentBladePo.clickOnAttachButton();
            await activityTabPo.clickOnPostButton();
            await utilCommon.waitUntilSpinnerToHide();
            await expect(await activityTabPo.isAttachedFileNameDisplayed('bwfJpg.jpg')).toBeTruthy('FailuerMsg: bwfJpg.jpg Attached Document is missing');
            await expect(await utilCommon.deleteAlreadyDownloadedFile('bwfJpg.jpg')).toBeTruthy('FailuerMsg: bwfJpg.jpg File is delete sucessfully');
            await activityTabPo.clickAndDownloadAttachmentFile('bwfJpg.jpg');
            await expect(await utilCommon.isFileDownloaded('bwfJpg.jpg')).toBeTruthy('FailuerMsg: bwfJpg.jpg File is not downloaded.');
            // Multiple attachment
            await activityTabPo.addActivityNote(addNoteText);
            await activityTabPo.clickOnAttachLink();
            await attachDocumentBladePo.searchAndAttachDocument('drdmv13479_publish_document2');
            await activityTabPo.clickOnAttachLink();
            await attachDocumentBladePo.searchAndAttachDocument('drdmv13479_publish_document5');
            await activityTabPo.clickOnPostButton();
            await utilCommon.waitUntilSpinnerToHide();
            await expect(await activityTabPo.isAttachedFileNameDisplayed('bwfPdf.pdf')).toBeTruthy('FailuerMsg: bwfPdf.pdf Attached Document is missing');
            await expect(await utilCommon.deleteAlreadyDownloadedFile('bwfPdf.pdf')).toBeTruthy('FailuerMsg: bwfPdf.pdf File is delete sucessfully');
            await activityTabPo.clickAndDownloadAttachmentFile('bwfPdf.pdf');
            await expect(await utilCommon.isFileDownloaded('bwfPdf.pdf')).toBeTruthy('FailuerMsg: bwfPdf.pdf File is not downloaded.');

            await expect(await activityTabPo.isAttachedFileNameDisplayed('bwfXlsx.xlsx')).toBeTruthy('FailuerMsg:bwfXlsx.xlsx Attached Document is missing');
            await expect(await utilCommon.deleteAlreadyDownloadedFile('bwfXlsx.xlsx')).toBeTruthy('FailuerMsg: bwfXlsx.xlsx File is delete sucessfully');
            await activityTabPo.clickAndDownloadAttachmentFile('bwfXlsx.xlsx');
            await expect(await utilCommon.isFileDownloaded('bwfXlsx.xlsx')).toBeTruthy('FailuerMsg: bwfXlsx.xlsx File is not downloaded.');
        } catch (e) {
            throw e;
        } finally {
            await navigationPage.signOut();
            await loginPage.login('qkatawazi');
        }
    }, 340 * 1000);

    //kgaikwad
    it('[DRDMV-13463]: Edit Case - Case business analyst attaches published document from document library who has write access to that document', async () => {
        try {
            // Create publish1, publish2,publish3 document libarary for write access of "Compensation and Benefits" group
            let publish: string[] = ['drdmv13463_publish_document1', 'drdmv13463_publish_document2', 'drdmv13463_publish_document5'];
            let files1: string[] = [filePath1, filePath2, filePath5];
            for (let i = 0; i < publish.length; i++) {
                let publishDocLibData1 = {
                    docLibTitle: publish[i],
                    company: 'Petramco',
                    ownerGroup: 'Compensation and Benefits',
                }
                await apiHelper.apiLogin('tadmin');
                await apiHelper.deleteDocumentLibrary(publishDocLibData1.docLibTitle);
                await apiHelper.apiLogin('elizabeth');
                let getFilePath1 = files1[i];
                let docLib = await apiHelper.createDocumentLibrary(publishDocLibData1, getFilePath1);
                await apiHelper.publishDocumentLibrary(docLib);
            }

            // Create Publish 3 which assigned support group as a 'Staffing' document
            let publishDocLibData2 = {
                docLibTitle: 'drdmv13463_publish_document3',
                company: 'Petramco',
                ownerGroup: 'Staffing',
            }
            await apiHelper.apiLogin('tadmin');
            await apiHelper.deleteDocumentLibrary(publishDocLibData2.docLibTitle);
            await apiHelper.apiLogin('elizabeth');
            let docLib3 = await apiHelper.createDocumentLibrary(publishDocLibData2, filePath3);
            await apiHelper.publishDocumentLibrary(docLib3);

            // Create Draft 4th document
            let draftDocLibData = {
                docLibTitle: 'drdmv13463_draft_document',
                company: 'Petramco',
                ownerGroup: 'Compensation and Benefits',
            }
            await apiHelper.apiLogin('tadmin');
            await apiHelper.deleteDocumentLibrary(draftDocLibData.docLibTitle);
            await apiHelper.apiLogin('elizabeth');
            await apiHelper.createDocumentLibrary(draftDocLibData, filePath4);
            // SignOut & Login
            await navigationPage.signOut();
            await loginPage.login('qkatawazi');

            //Create Case
            await navigationPage.gotCreateCase();
            await createCasePo.selectRequester('qtao');
            await createCasePo.setSummary(caseSummary);
            await createCasePo.clickSaveCaseButton();
            await createCasePo.clickGoToCaseButton();
            await viewCasePo.clickEditCaseButton();
            await editCasePo.clickOnAttachLink();
            await attachDocumentBladePo.clickOnAdvanceSearchButton();

            await attachDocumentBladePo.searchRecord('drdmv13463_publish_document3');
            await expect(await attachDocumentBladePo.isDocumentLibaryPresent('drdmv13463_publish_document3')).toBeFalsy('FailuerMsg: drdmv13463_draft_document doc is displayed');
            await attachDocumentBladePo.searchRecord('drdmv13463_draft_document');
            await expect(await attachDocumentBladePo.isDocumentLibaryPresent('drdmv13463_draft_document')).toBeFalsy('FailuerMsg: drdmv13463_draft_document doc is displayed');
            await attachDocumentBladePo.searchRecord('drdmv13463_publish_document1');
            await attachDocumentBladePo.selectDocument();
            await attachDocumentBladePo.clickOnAttachButton();
            await editCasePo.clickSaveCase();

            await expect(await viewCasePo.isAttachedDocumentPresent('bwfJpg.jpg')).toBeTruthy('FailuerMsg: bwfJpg.jpg Attached Document is missing');
            await expect(await utilCommon.deleteAlreadyDownloadedFile('bwfJpg.jpg')).toBeTruthy('FailuerMsg: bwfJpg.jpg File is delete sucessfully');
            await viewCasePo.clickOnAttachedDocumentFile('bwfJpg.jpg');
            await expect(await utilCommon.isFileDownloaded('bwfJpg.jpg')).toBeTruthy('FailuerMsg: bwfJpg.jpg File is not downloaded.');
            await viewCasePo.clickEditCaseButton();
            await editCasePo.clickOnAttachLink();
            await attachDocumentBladePo.searchAndAttachDocument('drdmv13463_publish_document2');
            await editCasePo.clickOnAttachLink();
            await attachDocumentBladePo.searchAndAttachDocument('drdmv13463_publish_document5');
            await editCasePo.clickSaveCase();

            await expect(await viewCasePo.isAttachedDocumentPresent('bwfPdf.pdf')).toBeTruthy('FailuerMsg: bwfPdf.pdf Attached Document is missing');
            await expect(await utilCommon.deleteAlreadyDownloadedFile('bwfPdf.pdf')).toBeTruthy('FailuerMsg: bwfPdf.pdf File is delete sucessfully');
            await viewCasePo.clickOnAttachedDocumentFile('bwfPdf.pdf');
            await expect(await utilCommon.isFileDownloaded('bwfPdf.pdf')).toBeTruthy('FailuerMsg: bwfPdf.pdf File is not downloaded.');

            await expect(await viewCasePo.isAttachedDocumentPresent('bwfXlsx.xlsx')).toBeTruthy('FailuerMsg:bwfXlsx.xlsx Attached Document is missing');
            await expect(await utilCommon.deleteAlreadyDownloadedFile('bwfXlsx.xlsx')).toBeTruthy('FailuerMsg: bwfXlsx.xlsx File is delete sucessfully');
            await viewCasePo.clickOnAttachedDocumentFile('bwfXlsx.xlsx');
            await expect(await utilCommon.isFileDownloaded('bwfXlsx.xlsx')).toBeTruthy('FailuerMsg: bwfXlsx.xlsx File is not downloaded.');
        } catch (e) {
            throw e;
        } finally {
            await navigationPage.signOut();
            await loginPage.login('qkatawazi');
        }
    }, 330 * 1000);

    //kgaikwad
    it('[DRDMV-13506]: Compose Email - Case business analyst attaches published document from document library where case business analyst is author of the document', async () => {
        try {
            // Create Publish 3 which assigned support group as a 'Staffing' document
            let publishDocLibData1 = {
                docLibTitle: 'drdmv13506_publish_document3',
                company: 'Petramco',
                ownerGroup: 'Staffing',
            }
            await apiHelper.apiLogin('tadmin');
            await apiHelper.deleteDocumentLibrary(publishDocLibData1.docLibTitle);
            await apiHelper.apiLogin('elizabeth');
            let docLib3 = await apiHelper.createDocumentLibrary(publishDocLibData1, filePath3);
            await apiHelper.publishDocumentLibrary(docLib3);

            // Create publish1, publish2,publish5 document libarary for write access of "Compensation and Benefits" group
            let publish: string[] = ['drdmv13506_publish_document1', 'drdmv13506_publish_document2', 'drdmv13506_publish_document5'];
            let files1: string[] = [filePath1, filePath2, filePath5];
            // delete if doc lib with same name exists
            for (let i = 0; i < publish.length; i++) {
                let publishDocLibData2 = {
                    docLibTitle: publish[i],
                    company: 'Petramco',
                    ownerGroup: 'Staffing',
                    shareExternally: true
                }
                await apiHelper.apiLogin('tadmin');
                await apiHelper.deleteDocumentLibrary(publishDocLibData2.docLibTitle);
                await apiHelper.apiLogin('qkatawazi');
                let getFilePath1 = files1[i];
                let docLib = await apiHelper.createDocumentLibrary(publishDocLibData2, getFilePath1);
                await apiHelper.publishDocumentLibrary(docLib);
            }
            // Create Draft 4th document
            let draftDocLibData = {
                docLibTitle: 'drdmv13506_draft_document',
                company: 'Petramco',
                ownerGroup: 'Compensation and Benefits',
                shareExternally: true
            }
            await apiHelper.apiLogin('tadmin');
            await apiHelper.deleteDocumentLibrary(draftDocLibData.docLibTitle);
            await apiHelper.apiLogin('qkatawazi');
            await apiHelper.createDocumentLibrary(draftDocLibData, filePath4);

            // SingOut and Login in
            await navigationPage.signOut();
            await loginPage.login('qkatawazi');

            //Create Case
            await navigationPage.gotCreateCase();
            await createCasePo.selectRequester('qtao');
            await createCasePo.setSummary(caseSummary);
            await createCasePo.clickSaveCaseButton();
            await createCasePo.clickGoToCaseButton();
            await viewCasePo.clickOnEmailLink();
            await composeMailPo.clickOnAttachmentLink();

            await attachDocumentBladePo.clickOnAdvanceSearchButton();
            await attachDocumentBladePo.searchRecord('drdmv13506_publish_document3');
            await expect(await attachDocumentBladePo.isDocumentLibaryPresent('drdmv13506_publish_document3')).toBeFalsy('FailuerMsg: drdmv13506_publish_document3 doc is displayed');

            await attachDocumentBladePo.searchRecord('drdmv13506_draft_document');
            await expect(await attachDocumentBladePo.isDocumentLibaryPresent('drdmv13506_draft_document')).toBeFalsy('FailuerMsg: drdmv13506_draft_document doc is displayed');

            await attachDocumentBladePo.searchRecord('drdmv13506_publish_document1');
            await attachDocumentBladePo.selectDocument();
            await attachDocumentBladePo.clickOnAttachButton();
            await composeMailPo.setToOrCCInputTetxbox('To', 'fritz.schulz@petramco.com');
            await composeMailPo.clickOnSendButton();

            await expect(await activityTabPo.isAttachedFileNameDisplayed('bwfJpg.jpg')).toBeTruthy('FailuerMsg: bwfJpg.jpg Attached Document is missing');
            await expect(await utilCommon.deleteAlreadyDownloadedFile('bwfJpg.jpg')).toBeTruthy('FailuerMsg: bwfJpg.jpg File is delete sucessfully');
            await activityTabPo.clickAndDownloadAttachmentFile('bwfJpg.jpg');
            await expect(await utilCommon.isFileDownloaded('bwfJpg.jpg')).toBeTruthy('FailuerMsg: bwfJpg.jpg File is not downloaded.');

            await viewCasePo.clickOnEmailLink();
            await composeMailPo.clickOnAttachmentLink();
            await attachDocumentBladePo.searchAndAttachDocument('drdmv13506_publish_document2');
            await composeMailPo.clickOnAttachmentLink();
            await attachDocumentBladePo.searchAndAttachDocument('drdmv13506_publish_document5');
            await composeMailPo.setToOrCCInputTetxbox('To', 'fritz.schulz@petramco.com');
            await composeMailPo.clickOnSendButton();

            await expect(await activityTabPo.isAttachedFileNameDisplayed('bwfPdf.pdf')).toBeTruthy('FailuerMsg: bwfPdf.pdf Attached Document is missing');
            await expect(await utilCommon.deleteAlreadyDownloadedFile('bwfPdf.pdf')).toBeTruthy('FailuerMsg: bwfPdf.pdf File is delete sucessfully');
            await activityTabPo.clickAndDownloadAttachmentFile('bwfPdf.pdf');
            await expect(await utilCommon.isFileDownloaded('bwfPdf.pdf')).toBeTruthy('FailuerMsg: bwfPdf.pdf File is not downloaded.');

            await expect(await activityTabPo.isAttachedFileNameDisplayed('bwfXlsx.xlsx')).toBeTruthy('FailuerMsg: bwfXlsx.xlsx Attached Document is missing');
            await expect(await utilCommon.deleteAlreadyDownloadedFile('bwfXlsx.xlsx')).toBeTruthy('FailuerMsg: bwfXlsx.xlsx File is delete sucessfully');
            await activityTabPo.clickAndDownloadAttachmentFile('bwfXlsx.xlsx');
            await expect(await utilCommon.isFileDownloaded('bwfXlsx.xlsx')).toBeTruthy('FailuerMsg: bwfXlsx.xlsx File is not downloaded.');
        } catch (e) {
            throw e;
        } finally {
            await navigationPage.signOut();
            await loginPage.login('qkatawazi');
        }
    }, 360 * 1000);

    //kgaikwad
    it('[DRDMV-13481]: Add Activity - Case manager attaches published document from document library who has read access to that document', async () => {
        try {
            let addNoteText = [...Array(10)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
            // Create publish1, publish2,publish3 document libarary for write access of "Compensation and Benefits" group
            let publish: string[] = ['drdmv13481_publish_document1', 'drdmv13481_publish_document2', 'drdmv13481_publish_document5'];
            let files1: string[] = [filePath1, filePath2, filePath5];
            for (let i = 0; i < publish.length; i++) {
                let publishDocLibData1 = {
                    docLibTitle: publish[i],
                    company: 'Petramco',
                    ownerGroup: 'Staffing',
                }
                await apiHelper.apiLogin('tadmin');
                await apiHelper.deleteDocumentLibrary(publishDocLibData1.docLibTitle);
                await apiHelper.apiLogin('elizabeth');
                let getFilePath1 = files1[i];
                let docLib = await apiHelper.createDocumentLibrary(publishDocLibData1, getFilePath1);
                await apiHelper.apiLogin('qheroux');
                await apiHelper.giveReadAccessToDocLib(docLib, "Compensation and Benefits");
                await apiHelper.publishDocumentLibrary(docLib);
            }
            // Create Publish 3 which assigned support group as a 'Staffing' document
            let publishDocLibData2 = {
                docLibTitle: 'drdmv13481_publish_document3',
                company: 'Petramco',
                ownerGroup: 'Staffing',
            }
            await apiHelper.apiLogin('tadmin');
            await apiHelper.deleteDocumentLibrary(publishDocLibData2.docLibTitle);
            await apiHelper.apiLogin('elizabeth');
            let docLib3 = await apiHelper.createDocumentLibrary(publishDocLibData2, filePath3);
            await apiHelper.publishDocumentLibrary(docLib3);
            // Create Draft 4th document
            let draftDocLibData = {
                docLibTitle: 'drdmv13481_draft_document',
                company: 'Petramco',
                ownerGroup: 'Compensation and Benefits',
            }
            await apiHelper.apiLogin('tadmin');
            await apiHelper.deleteDocumentLibrary(draftDocLibData.docLibTitle);
            await apiHelper.apiLogin('elizabeth');
            await apiHelper.createDocumentLibrary(draftDocLibData, filePath4);

            await navigationPage.signOut();
            await loginPage.login('qdu');
            //Create Case
            await navigationPage.gotCreateCase();
            await createCasePo.selectRequester('qtao');
            await createCasePo.setSummary(caseSummary);
            await createCasePo.clickSaveCaseButton();
            await createCasePo.clickGoToCaseButton();
            // Activity Tab
            await activityTabPo.addActivityNote(addNoteText);
            await activityTabPo.clickOnAttachLink();
            await attachDocumentBladePo.clickOnAdvanceSearchButton();

            await attachDocumentBladePo.searchRecord('drdmv13481_publish_document3');
            await expect(await attachDocumentBladePo.isDocumentLibaryPresent('drdmv13481_publish_document3')).toBeFalsy('FailuerMsg: publishDocLib3 doc is displayed');
            await attachDocumentBladePo.searchRecord('drdmv13481_draft_document');
            await expect(await attachDocumentBladePo.isDocumentLibaryPresent('drdmv13481_draft_document')).toBeFalsy('FailuerMsg: draftDocLib4 doc is displayed');
            await attachDocumentBladePo.searchRecord('drdmv13481_publish_document1');
            await attachDocumentBladePo.selectDocument();
            await attachDocumentBladePo.clickOnAttachButton();
            await activityTabPo.clickOnPostButton();
            await utilCommon.waitUntilSpinnerToHide();
            await expect(await activityTabPo.isAttachedFileNameDisplayed('bwfJpg.jpg')).toBeTruthy('FailuerMsg: bwfJpg.jpg Attached Document is missing');
            await expect(await utilCommon.deleteAlreadyDownloadedFile('bwfJpg.jpg')).toBeTruthy('FailuerMsg: bwfJpg.jpg File is delete sucessfully');
            await activityTabPo.clickAndDownloadAttachmentFile('bwfJpg.jpg');
            await expect(await utilCommon.isFileDownloaded('bwfJpg.jpg')).toBeTruthy('FailuerMsg: bwfJpg.jpg File is not downloaded.');
            // Multiple attachment
            await activityTabPo.addActivityNote(addNoteText);
            await activityTabPo.clickOnAttachLink();
            await attachDocumentBladePo.searchAndAttachDocument('drdmv13481_publish_document2');
            await activityTabPo.clickOnAttachLink();
            await attachDocumentBladePo.searchAndAttachDocument('drdmv13481_publish_document5');
            await activityTabPo.clickOnPostButton();
            await utilCommon.waitUntilSpinnerToHide();
            await expect(await activityTabPo.isAttachedFileNameDisplayed('bwfPdf.pdf')).toBeTruthy('FailuerMsg: bwfPdf.pdf Attached Document is missing');
            await expect(await utilCommon.deleteAlreadyDownloadedFile('bwfPdf.pdf')).toBeTruthy('FailuerMsg: bwfPdf.pdf File is delete sucessfully');
            await activityTabPo.clickAndDownloadAttachmentFile('bwfPdf.pdf');
            await expect(await utilCommon.isFileDownloaded('bwfPdf.pdf')).toBeTruthy('FailuerMsg: bwfPdf.pdf File is not downloaded.');

            await expect(await activityTabPo.isAttachedFileNameDisplayed('bwfXlsx.xlsx')).toBeTruthy('FailuerMsg:bwfXlsx.xlsx Attached Document is missing');
            await expect(await utilCommon.deleteAlreadyDownloadedFile('bwfXlsx.xlsx')).toBeTruthy('FailuerMsg: bwfXlsx.xlsx File is delete sucessfully');
            await activityTabPo.clickAndDownloadAttachmentFile('bwfXlsx.xlsx');
            await expect(await utilCommon.isFileDownloaded('bwfXlsx.xlsx')).toBeTruthy('FailuerMsg: bwfXlsx.xlsx File is not downloaded.');
        } catch (e) {
            throw e;
        } finally {
            await navigationPage.signOut();
            await loginPage.login('qkatawazi');
        }
    }, 360 * 1000);

    //kgaikwad
    it('[DRDMV-13458]: Edit Case - Case manager attaches published document from document library who has write access to that document', async () => {
        try {
            // Create publish1, publish2,publish3 document libarary for write access of "Compensation and Benefits" group
            let publish: string[] = ['drdmv13458_publish_document1', 'drdmv13458_publish_document2', 'drdmv13458_publish_document5'];
            let files1: string[] = [filePath1, filePath2, filePath5];
            for (let i = 0; i < publish.length; i++) {
                let publishDocLibData1 = {
                    docLibTitle: publish[i],
                    company: 'Petramco',
                    ownerGroup: 'Compensation and Benefits',
                }
                await apiHelper.apiLogin('tadmin');
                await apiHelper.deleteDocumentLibrary(publishDocLibData1.docLibTitle);
                await apiHelper.apiLogin('elizabeth');
                let getFilePath1 = files1[i];
                let docLib = await apiHelper.createDocumentLibrary(publishDocLibData1, getFilePath1);
                await apiHelper.publishDocumentLibrary(docLib);
            }
            // Create Publish 3 which assigned support group as a 'Staffing' document
            let publishDocLibData2 = {
                docLibTitle: 'drdmv13458_publish_document3',
                company: 'Petramco',
                ownerGroup: 'Staffing',
            }
            await apiHelper.apiLogin('tadmin');
            await apiHelper.deleteDocumentLibrary(publishDocLibData2.docLibTitle);
            await apiHelper.apiLogin('elizabeth');
            let docLib3 = await apiHelper.createDocumentLibrary(publishDocLibData2, filePath3);
            await apiHelper.publishDocumentLibrary(docLib3);
            // Create Draft 4th document
            let draftDocLibData = {
                docLibTitle: 'drdmv13458_draft_document',
                company: 'Petramco',
                ownerGroup: 'Compensation and Benefits',
            }
            await apiHelper.apiLogin('tadmin');
            await apiHelper.deleteDocumentLibrary(draftDocLibData.docLibTitle);
            await apiHelper.apiLogin('elizabeth');
            await apiHelper.createDocumentLibrary(draftDocLibData, filePath4);

            // Login to  Case Manager
            await navigationPage.signOut();
            await loginPage.login('qdu');
            //Create Case
            await navigationPage.gotCreateCase();
            await createCasePo.selectRequester('qtao');
            await createCasePo.setSummary(caseSummary);
            await createCasePo.clickSaveCaseButton();
            await createCasePo.clickGoToCaseButton();
            await viewCasePo.clickEditCaseButton();
            await editCasePo.clickOnAttachLink();
            await attachDocumentBladePo.clickOnAdvanceSearchButton();

            await attachDocumentBladePo.searchRecord('drdmv13458_publish_document3');
            await expect(await attachDocumentBladePo.isDocumentLibaryPresent('drdmv13458_publish_document3')).toBeFalsy('FailuerMsg: publishDocLib3 doc is displayed');
            await attachDocumentBladePo.searchRecord('drdmv13458_draft_document');
            await expect(await attachDocumentBladePo.isDocumentLibaryPresent('drdmv13458_draft_document')).toBeFalsy('FailuerMsg: draftDocLib4 doc is displayed');
            await attachDocumentBladePo.searchRecord('drdmv13458_publish_document1');
            await attachDocumentBladePo.selectDocument();
            await attachDocumentBladePo.clickOnAttachButton();
            await editCasePo.clickSaveCase();

            await expect(await viewCasePo.isAttachedDocumentPresent('bwfJpg.jpg')).toBeTruthy('FailuerMsg: bwfJpg.jpg Attached Document is missing');
            await expect(await utilCommon.deleteAlreadyDownloadedFile('bwfJpg.jpg')).toBeTruthy('FailuerMsg: bwfJpg.jpg File is delete sucessfully');
            await viewCasePo.clickOnAttachedDocumentFile('bwfJpg.jpg');
            await expect(await utilCommon.isFileDownloaded('bwfJpg.jpg')).toBeTruthy('FailuerMsg: bwfJpg.jpg File is not downloaded.');
            await viewCasePo.clickEditCaseButton();
            await editCasePo.clickOnAttachLink();
            await attachDocumentBladePo.searchAndAttachDocument('drdmv13458_publish_document2');
            await editCasePo.clickOnAttachLink();
            await attachDocumentBladePo.searchAndAttachDocument('drdmv13458_publish_document5');
            await editCasePo.clickSaveCase();

            await expect(await viewCasePo.isAttachedDocumentPresent('bwfPdf.pdf')).toBeTruthy('FailuerMsg: bwfPdf.pdf Attached Document is missing');
            await expect(await utilCommon.deleteAlreadyDownloadedFile('bwfPdf.pdf')).toBeTruthy('FailuerMsg: bwfPdf.pdf File is delete sucessfully');
            await viewCasePo.clickOnAttachedDocumentFile('bwfPdf.pdf');
            await expect(await utilCommon.isFileDownloaded('bwfPdf.pdf')).toBeTruthy('FailuerMsg: bwfPdf.pdf File is not downloaded.');

            await expect(await viewCasePo.isAttachedDocumentPresent('bwfXlsx.xlsx')).toBeTruthy('FailuerMsg:bwfXlsx.xlsx Attached Document is missing');
            await expect(await utilCommon.deleteAlreadyDownloadedFile('bwfXlsx.xlsx')).toBeTruthy('FailuerMsg: bwfXlsx.xlsx File is delete sucessfully');
            await viewCasePo.clickOnAttachedDocumentFile('bwfXlsx.xlsx');
            await expect(await utilCommon.isFileDownloaded('bwfXlsx.xlsx')).toBeTruthy('FailuerMsg: bwfXlsx.xlsx File is not downloaded.');
        } catch (e) {
            throw e;
        } finally {
            await navigationPage.signOut();
            await loginPage.login('qkatawazi');
        }
    }, 360 * 1000);

    //kgaikwad
    it('[DRDMV-13537]: Availability of documents on knowledge search under Quick case, Resources tab', async () => {
        // Create Publish 3 which assigned support group as a 'Staffing' document
        let publishDocLibData1 = {
            docLibTitle: 'drdmv13537_publish_document',
            company: 'Petramco',
            ownerGroup: 'Compensation and Benefits',
        }
        await apiHelper.apiLogin('tadmin');
        await apiHelper.deleteDocumentLibrary(publishDocLibData1.docLibTitle);
        await apiHelper.apiLogin(loginId);
        let docLib1 = await apiHelper.createDocumentLibrary(publishDocLibData1, filePath1);
        await apiHelper.publishDocumentLibrary(docLib1);

        // SignOut & Login in
        await navigationPage.signOut();
        await loginPage.login(loginId);
        // Quick Case
        await navigationPage.gotoQuickCase();
        await quickCasePo.selectRequesterName('qtao');
        await quickCasePo.setCaseSummary('drdmv13537_publish_document');
        await utilCommon.waitUntilSpinnerToHide();
        await expect(await quickCasePo.isRecommendedKnowledgeEmpty()).toBeTruthy('FailuerMsg: Recommended knowledge is not empty');

        await navigationPage.gotoCaseConsole();
        let summary = [...Array(10)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        var caseData =
        {
            "Requester": "qtao",
            "Summary": "Test case for DRDMV-8377RandVal" + summary,
            "Support Group": "Compensation and Benefits",
            "Assignee": "qkatawazi"
        }
        await apiHelper.apiLogin(loginId);
        var newCase = await apiHelper.createCase(caseData);
        var caseId: string = newCase.displayId;
        await caseConsolePo.searchAndOpenCase(caseId);
        await viewCasePo.clickEditCaseButton();
        await editCasePo.updateCaseSummary('drdmv13537_publish_document');
        await editCasePo.clickSaveCase();
        await viewCasePo.clickOnTab('Resources')
        await expect(await resourcesTabPo.isKnowledgeArticlesEmpty()).toBeTruthy('Failuer: Knowledge Article is not empty');
        await resourcesTabPo.clickOnAdvancedSearchOptions('Knowledge Articles ');
        await resourcesTabPo.searchTextAndEnter('drdmv13537_publish_document');
        await expect(await resourcesTabPo.isKnowledgeArticlesEmpty()).toBeTruthy('Failuer: Knowledge Article is not empty');
    }, 120 * 1000);

    //kgaikwad
    it('[DRDMV-13517]: Add Task - Case agent attaches published document from document library where case agent is author of the document', async () => {
        try {
            let randomStr = [...Array(5)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
            let adhocTaskSummary1 = [...Array(10)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
            let adhocTaskSummary2 = [...Array(10)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
            let caseTemplateName = 'caseTemplateName' + randomStr;
            let casTemplateSummary = 'CaseSummaryName' + randomStr;

            // Create Publish 3 which assigned support group as a 'Staffing' document
            let publishDocLibData1 = {
                docLibTitle: 'drdmv13517_publish_document3',
                company: 'Petramco',
                ownerGroup: 'Staffing',
            }
            await apiHelper.apiLogin('tadmin');
            await apiHelper.deleteDocumentLibrary(publishDocLibData1.docLibTitle);
            await apiHelper.apiLogin('qkatawazi');
            let docLib3 = await apiHelper.createDocumentLibrary(publishDocLibData1, filePath3);
            await apiHelper.publishDocumentLibrary(docLib3);

            // SignOut & Login In
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

            // Create publish1, publish2,publish5 document libarary 
            let publish: string[] = ['drdmv13517_publish_document1', 'drdmv13517_publish_document2', 'drdmv13517_publish_document5'];
            let files1: string[] = [filePath1, filePath2, filePath5];
            for (let i = 0; i < publish.length; i++) {
                let publishDocLibData2 = {
                    docLibTitle: publish[i],
                    company: 'Petramco',
                    ownerGroup: 'Staffing',
                }
                await apiHelper.apiLogin('tadmin');
                await apiHelper.deleteDocumentLibrary(publishDocLibData2.docLibTitle);
                await apiHelper.apiLogin(loginId);
                let getFilePath1 = files1[i];
                let docLib = await apiHelper.createDocumentLibrary(publishDocLibData2, getFilePath1);
                await apiHelper.publishDocumentLibrary(docLib);
            }

            // Create Draft 4th document
            let draftDocLibData = {
                docLibTitle: 'drdmv13517_draft_document',
                company: 'Petramco',
                ownerGroup: 'Compensation and Benefits',
            }
            await apiHelper.apiLogin('tadmin');
            await apiHelper.deleteDocumentLibrary(draftDocLibData.docLibTitle);
            await apiHelper.apiLogin(loginId);
            await apiHelper.createDocumentLibrary(draftDocLibData, filePath4);

            //Create Case
            await navigationPage.gotCreateCase();
            await createCasePo.selectRequester('qtao');
            await createCasePo.setSummary(caseSummary);
            await createCasePo.clickSelectCaseTemplateButton();
            await selectCasetemplateBladePo.selectCaseTemplate(caseTemplateName);
            await createCasePo.clickSaveCaseButton();
            await createCasePo.clickGoToCaseButton();
            // Add adhoc task 1
            await viewCasePo.clickAddTaskButton();
            await manageTask.clickAddAdhocTaskButton();
            await adhoctaskTemplate.setSummary(adhocTaskSummary1);
            await adhoctaskTemplate.clickOnAttachButton();

            await attachDocumentBladePo.clickOnAdvanceSearchButton();
            await attachDocumentBladePo.searchRecord('drdmv13517_publish_document3');
            await expect(await attachDocumentBladePo.isDocumentLibaryPresent('drdmv13517_publish_document3')).toBeFalsy('FailuerMsg: publishDocLib3 doc is displayed');
            await attachDocumentBladePo.searchRecord('drdmv13517_draft_document');
            await expect(await attachDocumentBladePo.isDocumentLibaryPresent('drdmv13517_draft_document')).toBeFalsy('FailuerMsg: draftDocLib4 doc is displayed');
            await attachDocumentBladePo.searchRecord('drdmv13517_publish_document1');
            await attachDocumentBladePo.selectDocument();
            await attachDocumentBladePo.clickOnAttachButton();

            await adhoctaskTemplate.clickOnSaveAdhoctask();
            await manageTask.clickOnCloseButton();
            // Add adhoc task 2
            await viewCasePo.clickOnTaskLink(adhocTaskSummary1);
            await expect(await viewTaskPo.isAttachedDocumentPresent('bwfJpg.jpg')).toBeTruthy('FailuerMsg: bwfJpg.jpg Attached Document is missing');
            await expect(await utilCommon.deleteAlreadyDownloadedFile('bwfJpg.jpg')).toBeTruthy('FailuerMsg: bwfJpg.jpg File is delete sucessfully');
            await viewTaskPo.clickOnAttachedDocumentFile('bwfJpg.jpg');
            await expect(await utilCommon.isFileDownloaded('bwfJpg.jpg')).toBeTruthy('FailuerMsg: bwfJpg.jpg File is not downloaded.');
            await utilCommon.scrollUpOrDownTillElement(viewTaskPo.selectors.viewCaseLink);
            await viewTaskPo.clickOnViewCase();
            await viewCasePo.clickAddTaskButton();
            await manageTask.clickAddAdhocTaskButton();
            await adhoctaskTemplate.setSummary(adhocTaskSummary2);
            await adhoctaskTemplate.clickOnAttachButton();
            await attachDocumentBladePo.searchAndAttachDocument('drdmv13517_publish_document2');
            await adhoctaskTemplate.clickOnAttachButton();
            await attachDocumentBladePo.searchAndAttachDocument('drdmv13517_publish_document5');
            await adhoctaskTemplate.clickOnSaveAdhoctask();
            await manageTask.clickTaskLinkOnManageTask(adhocTaskSummary2);
            await expect(await viewTaskPo.isAttachedDocumentPresent('bwfPdf.pdf')).toBeTruthy('FailuerMsg: bwfPdf.pdf Attached Document is missing');
            await expect(await utilCommon.deleteAlreadyDownloadedFile('bwfPdf.pdf')).toBeTruthy('FailuerMsg: bwfPdf.pdf File is delete sucessfully');
            await viewTaskPo.clickOnAttachedDocumentFile('bwfPdf.pdf');
            await expect(await utilCommon.isFileDownloaded('bwfPdf.pdf')).toBeTruthy('FailuerMsg: bwfPdf.pdf File is not downloaded.');
            await expect(await viewTaskPo.isAttachedDocumentPresent('bwfXlsx.xlsx')).toBeTruthy('FailuerMsg:bwfXlsx.xlsx Attached Document is missing');
            await expect(await utilCommon.deleteAlreadyDownloadedFile('bwfXlsx.xlsx')).toBeTruthy('FailuerMsg: bwfXlsx.xlsx File is delete sucessfully');
            await viewTaskPo.clickOnAttachedDocumentFile('bwfXlsx.xlsx');
            await expect(await utilCommon.isFileDownloaded('bwfXlsx.xlsx')).toBeTruthy('FailuerMsg: bwfXlsx.xlsx File is not downloaded.');
        } catch (e) {
            throw e;
        } finally {
            await navigationPage.signOut();
            await loginPage.login('qkatawazi');
        }
    }, 362 * 1000);

    //kgaikwad
    it('[DRDMV-13508]: Compose Email - Case manager attaches published document from document library where case manager is author of the document', async () => {
        try {
            let loginId2 = 'casemanagerwithdocmanager'
            await apiHelper.apiLogin('tadmin');
            var caseAgentuserData = {
                "firstName": "CaseManager",
                "lastName": "WithDocManager",
                "userId": loginId2,
                "userPermission": "AGGAA5V0GE9Z4AOR7CWOOQLASE4PHJ;AGGAA5V0GEON8AOZHHGIOY0UZNXGOR;AGGADG1AAO0VGAP8SXEGP7VU2U4ZS8",
            }
            await apiHelper.createNewUser(caseAgentuserData);
            await apiHelper.associatePersonToCompany(caseAgentuserData.userId, "Petramco");
            await apiHelper.associatePersonToSupportGroup(loginId2, 'Compensation and Benefits');

            // Create Publish 3 which assigned support group as a 'Staffing' document
            let publishDocLibData1 = {
                docLibTitle: 'drdmv13508_publish_document3',
                company: 'Petramco',
                ownerGroup: 'Staffing',
            }
            await apiHelper.apiLogin('tadmin');
            await apiHelper.deleteDocumentLibrary(publishDocLibData1.docLibTitle);
            await apiHelper.apiLogin('elizabeth');
            let docLib3 = await apiHelper.createDocumentLibrary(publishDocLibData1, filePath3);
            await apiHelper.publishDocumentLibrary(docLib3);

            // Create publish1, publish2,publish5 document libarary for write access of "Compensation and Benefits" group
            let publish: string[] = ['drdmv13508_publish_document1', 'drdmv13508_publish_document2', 'drdmv13508_publish_document5'];
            let files1: string[] = [filePath1, filePath2, filePath5];
            for (let i = 0; i < publish.length; i++) {
                let publishDocLibData2 = {
                    docLibTitle: publish[i],
                    company: 'Petramco',
                    ownerGroup: 'Staffing',
                    shareExternally: true
                }
                await apiHelper.apiLogin('tadmin');
                await apiHelper.deleteDocumentLibrary(publishDocLibData2.docLibTitle);
                await apiHelper.apiLogin(loginId2);
                let getFilePath1 = files1[i];
                let docLib = await apiHelper.createDocumentLibrary(publishDocLibData2, getFilePath1);
                await apiHelper.publishDocumentLibrary(docLib);
            }
            // Create Draft 4th document
            let draftDocLibData = {
                docLibTitle: 'drdmv13508_draft_document',
                company: 'Petramco',
                ownerGroup: 'Compensation and Benefits',
                shareExternally: true
            }
            await apiHelper.apiLogin('tadmin');
            await apiHelper.deleteDocumentLibrary(draftDocLibData.docLibTitle);
            await apiHelper.apiLogin(loginId2);
            await apiHelper.createDocumentLibrary(draftDocLibData, filePath4);
            // SingOut & Login in
            await navigationPage.signOut();
            await loginPage.login(loginId2);
            //Create Case
            await navigationPage.gotCreateCase();
            await createCasePo.selectRequester('qtao');
            await createCasePo.setSummary(caseSummary);
            await createCasePo.clickSaveCaseButton();
            await createCasePo.clickGoToCaseButton();
            await viewCasePo.clickOnEmailLink();
            await composeMailPo.clickOnAttachmentLink();

            await attachDocumentBladePo.clickOnAdvanceSearchButton();
            await attachDocumentBladePo.searchRecord('drdmv13508_publish_document3');
            await expect(await attachDocumentBladePo.isDocumentLibaryPresent('drdmv13508_publish_document3')).toBeFalsy('FailuerMsg: drdmv13508_publish_document3 doc is displayed');
            await attachDocumentBladePo.searchRecord('drdmv13508_draft_document');
            await expect(await attachDocumentBladePo.isDocumentLibaryPresent('drdmv13508_draft_document')).toBeFalsy('FailuerMsg: drdmv13508_draft_document doc is displayed');

            await attachDocumentBladePo.searchRecord('drdmv13508_publish_document1');
            await attachDocumentBladePo.selectDocument();
            await attachDocumentBladePo.clickOnAttachButton();
            await composeMailPo.setToOrCCInputTetxbox('To', 'fritz.schulz@petramco.com');
            await composeMailPo.clickOnSendButton();

            await expect(await activityTabPo.isAttachedFileNameDisplayed('bwfJpg.jpg')).toBeTruthy('FailuerMsg: bwfJpg.jpg Attached Document is missing');
            await expect(await utilCommon.deleteAlreadyDownloadedFile('bwfJpg.jpg')).toBeTruthy('FailuerMsg: bwfJpg.jpg File is delete sucessfully');
            await activityTabPo.clickAndDownloadAttachmentFile('bwfJpg.jpg');
            await expect(await utilCommon.isFileDownloaded('bwfJpg.jpg')).toBeTruthy('FailuerMsg: bwfJpg.jpg File is not downloaded.');

            await viewCasePo.clickOnEmailLink();
            await composeMailPo.clickOnAttachmentLink();
            await attachDocumentBladePo.searchAndAttachDocument('drdmv13508_publish_document2');
            await composeMailPo.clickOnAttachmentLink();
            await attachDocumentBladePo.searchAndAttachDocument('drdmv13508_publish_document5');
            await composeMailPo.setToOrCCInputTetxbox('To', 'fritz.schulz@petramco.com');
            await composeMailPo.clickOnSendButton();

            await expect(await activityTabPo.isAttachedFileNameDisplayed('bwfPdf.pdf')).toBeTruthy('FailuerMsg: bwfPdf.pdf Attached Document is missing');
            await expect(await utilCommon.deleteAlreadyDownloadedFile('bwfPdf.pdf')).toBeTruthy('FailuerMsg: bwfPdf.pdf File is delete sucessfully');
            await activityTabPo.clickAndDownloadAttachmentFile('bwfPdf.pdf');
            await expect(await utilCommon.isFileDownloaded('bwfPdf.pdf')).toBeTruthy('FailuerMsg: bwfPdf.pdf File is not downloaded.');

            await expect(await activityTabPo.isAttachedFileNameDisplayed('bwfXlsx.xlsx')).toBeTruthy('FailuerMsg: bwfXlsx.xlsx Attached Document is missing');
            await expect(await utilCommon.deleteAlreadyDownloadedFile('bwfXlsx.xlsx')).toBeTruthy('FailuerMsg: bwfXlsx.xlsx File is delete sucessfully');
            await activityTabPo.clickAndDownloadAttachmentFile('bwfXlsx.xlsx');
            await expect(await utilCommon.isFileDownloaded('bwfXlsx.xlsx')).toBeTruthy('FailuerMsg: bwfXlsx.xlsx File is not downloaded.');
        } catch (e) {
            throw e;
        } finally {
            await navigationPage.signOut();
            await loginPage.login('qkatawazi');
        }
    }, 340 * 1000);
})