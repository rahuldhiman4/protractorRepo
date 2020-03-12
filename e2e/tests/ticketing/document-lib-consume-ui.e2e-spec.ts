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
import changeAssignmentBladePo from '../../pageobject/common/change-assignment-blade.po';
import loginPage from "../../pageobject/common/login.po";
import navigationPage from "../../pageobject/common/navigation.po";
import { default as resources, default as resourcesTabPo } from '../../pageobject/common/resources-tab.po';
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
        await attachDocumentBladePo.searchAndAttachDocument(publishDocData.docLibTitle);
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
        await documentLibraryConsolePo.searchAndOpenDocumentLibrary(publishDocData.docLibTitle);
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
            await attachDocumentBladePo.searchAndAttachDocument(publishDocLibData1.docLibTitle);
            await editCasePo.clickOnAttachLink();
            await attachDocumentBladePo.searchAndAttachDocument(publishDocLibData2.docLibTitle);
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
            await apiHelper.associateCaseTemplateWithOneTaskTemplate(newCaseTemplate.displayId, manualTaskTemplate.displayId);

            let publish: string[] = ['drdmv13524_publish_document1', 'drdmv13524_publish_document2', 'drdmv13524_publish_document5'];
            let files1: string[] = [filePath1, filePath2, filePath5];
            for (let i = 0; i < publish.length; i++) {
                let publishDocLibData1 = {
                    docLibTitle: publish[i],
                    company: 'Petramco',
                    ownerGroup: 'Staffing',
                }
                await apiHelper.apiLogin('tadmin');
                await apiHelper.deleteDocumentLibrary(publishDocLibData1.docLibTitle);
                await apiHelper.apiLogin(loginId);
                let getFilePath1 = files1[i];
                let docLib = await apiHelper.createDocumentLibrary(publishDocLibData1, getFilePath1);
                await apiHelper.publishDocumentLibrary(docLib);
            }

            let draftDocLibData = {
                docLibTitle: 'drdmv13524_draft_document',
                company: 'Petramco',
                ownerGroup: 'Staffing',
            }
            await apiHelper.apiLogin('tadmin');
            await apiHelper.deleteDocumentLibrary(draftDocLibData.docLibTitle);
            await apiHelper.apiLogin(loginId);
            await apiHelper.createDocumentLibrary(draftDocLibData, filePath4);

            await navigationPage.signOut();
            await loginPage.login(loginId);

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

            await attachDocumentBladePo.searchRecord(publishDocLibData2.docLibTitle);
            await expect(await attachDocumentBladePo.isDocumentLibaryPresent(publishDocLibData2.docLibTitle)).toBeFalsy('FailuerMsg: drdmv13524_publish_document3 doc is displayed');
            await attachDocumentBladePo.searchRecord(draftDocLibData.docLibTitle);
            await expect(await attachDocumentBladePo.isDocumentLibaryPresent(draftDocLibData.docLibTitle)).toBeFalsy('FailuerMsg: drdmv13524_draft_document doc is displayed');
            await attachDocumentBladePo.searchRecord(publish[0]);
            await attachDocumentBladePo.selectDocument();
            await attachDocumentBladePo.clickOnAttachButton();
            await editTaskPo.clickOnSaveButton();

            await expect(await viewTaskPo.isAttachedDocumentPresent('bwfJpg.jpg')).toBeTruthy('FailuerMsg: bwfJpg.jpg Attached Document is missing');
            await expect(await utilCommon.deleteAlreadyDownloadedFile('bwfJpg.jpg')).toBeTruthy('FailuerMsg: bwfJpg.jpg File is delete sucessfully');
            await viewTaskPo.clickOnAttachedDocumentFile('bwfJpg.jpg');
            await expect(await utilCommon.isFileDownloaded('bwfJpg.jpg')).toBeTruthy('FailuerMsg: bwfJpg.jpg File is not downloaded.');
            await viewTaskPo.clickOnEditTask();
            await editTaskPo.clickOnAttachButton();
            await attachDocumentBladePo.searchAndAttachDocument(publish[1]);
            await editTaskPo.clickOnAttachButton();
            await attachDocumentBladePo.searchAndAttachDocument(publish[2]);
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

            let publish: string[] = ['drdmv13507_publish_document1', 'drdmv13507_publish_document2', 'drdmv13507_publish_document5'];
            let files1: string[] = [filePath1, filePath2, filePath5];
            for (let i = 0; i < publish.length; i++) {
                let publishDocLibData1 = {
                    docLibTitle: publish[i],
                    company: 'Petramco',
                    ownerGroup: 'Staffing',
                    shareExternally: true
                }
                await apiHelper.apiLogin('tadmin');
                await apiHelper.deleteDocumentLibrary(publishDocLibData1.docLibTitle);
                await apiHelper.apiLogin(loginId);
                let getFilePath1 = files1[i];
                let docLib = await apiHelper.createDocumentLibrary(publishDocLibData1, getFilePath1);
                await apiHelper.publishDocumentLibrary(docLib);
            }
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

            await navigationPage.signOut();
            await loginPage.login(loginId);

            await navigationPage.gotCreateCase();
            await createCasePo.selectRequester('qtao');
            await createCasePo.setSummary(caseSummary);
            await createCasePo.clickSaveCaseButton();
            await createCasePo.clickGoToCaseButton();
            await viewCasePo.clickOnEmailLink();
            await composeMailPo.clickOnAttachmentLink();

            await attachDocumentBladePo.clickOnAdvanceSearchButton();
            await attachDocumentBladePo.searchRecord(publishDocLibData1.docLibTitle);
            await expect(await attachDocumentBladePo.isDocumentLibaryPresent(publishDocLibData1.docLibTitle)).toBeFalsy('FailuerMsg: drdmv13507_publish_document1 doc is displayed');

            await attachDocumentBladePo.searchRecord(draftDocLibData.docLibTitle);
            await expect(await attachDocumentBladePo.isDocumentLibaryPresent(draftDocLibData.docLibTitle)).toBeFalsy('FailuerMsg: publishDocLib3 doc is displayed');

            await attachDocumentBladePo.searchRecord(publish[0]);
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
            await attachDocumentBladePo.searchAndAttachDocument(publish[1]);
            await composeMailPo.clickOnAttachmentLink();
            await attachDocumentBladePo.searchAndAttachDocument(publish[2]);
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
            let publish: string[] = ['drdmv13449_publish_document1', 'drdmv13449_publish_document2', 'drdmv13449_publish_document5'];
            let files1: string[] = [filePath1, filePath2, filePath5];
            for (let i = 0; i < publish.length; i++) {
                let publishDocLibData1 = {
                    docLibTitle: publish[i],
                    company: 'Petramco',
                    ownerGroup: 'Compensation and Benefits',
                }
                await apiHelper.apiLogin('tadmin');
                await apiHelper.deleteDocumentLibrary(publishDocLibData1.docLibTitle);
                await apiHelper.apiLogin('qkatawazi');
                let getFilePath1 = files1[i];
                let docLib = await apiHelper.createDocumentLibrary(publishDocLibData1, getFilePath1);
                await apiHelper.publishDocumentLibrary(docLib);
            }
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
            let draftDocLibData = {
                docLibTitle: 'drdmv13449_draft_document',
                company: 'Petramco',
                ownerGroup: 'Compensation and Benefits',
            }
            await apiHelper.apiLogin('tadmin');
            await apiHelper.deleteDocumentLibrary(draftDocLibData.docLibTitle);
            await apiHelper.apiLogin('qkatawazi');
            await apiHelper.createDocumentLibrary(draftDocLibData, filePath4);

            await navigationPage.signOut();
            await loginPage.login(loginId);
            await navigationPage.gotCreateCase();
            await createCasePo.selectRequester('qtao');
            await createCasePo.setSummary(caseSummary);
            await createCasePo.clickSaveCaseButton();
            await createCasePo.clickGoToCaseButton();
            await viewCasePo.clickEditCaseButton();
            await editCasePo.clickOnAttachLink();
            await attachDocumentBladePo.clickOnAdvanceSearchButton();

            await attachDocumentBladePo.searchRecord(publishDocLibData2.docLibTitle);
            await expect(await attachDocumentBladePo.isDocumentLibaryPresent(publishDocLibData2.docLibTitle)).toBeFalsy('FailuerMsg: drdmv13449_publish_document3 doc is displayed');
            await attachDocumentBladePo.searchRecord(draftDocLibData.docLibTitle);
            await expect(await attachDocumentBladePo.isDocumentLibaryPresent(draftDocLibData.docLibTitle)).toBeFalsy('FailuerMsg: draftDocLib4 doc is displayed');
            await attachDocumentBladePo.searchRecord(publish[0]);
            await attachDocumentBladePo.selectDocument();
            await attachDocumentBladePo.clickOnAttachButton();
            await editCasePo.clickSaveCase();

            await expect(await viewCasePo.isAttachedDocumentPresent('bwfJpg.jpg')).toBeTruthy('FailuerMsg: bwfJpg.jpg Attached Document is missing');
            await expect(await utilCommon.deleteAlreadyDownloadedFile('bwfJpg.jpg')).toBeTruthy('FailuerMsg: bwfJpg.jpg File is delete sucessfully');
            await viewCasePo.clickOnAttachedDocumentFile('bwfJpg.jpg');
            await expect(await utilCommon.isFileDownloaded('bwfJpg.jpg')).toBeTruthy('FailuerMsg: bwfJpg.jpg File is not downloaded.');
            await viewCasePo.clickEditCaseButton();
            await editCasePo.clickOnAttachLink();
            await attachDocumentBladePo.searchAndAttachDocument(publish[1]);
            await editCasePo.clickOnAttachLink();
            await attachDocumentBladePo.searchAndAttachDocument(publish[2]);
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
            let publish: string[] = ['drdmv13480_publish_document1', 'drdmv13480_publish_document2', 'drdmv13480_publish_document5'];
            let files1: string[] = [filePath1, filePath2, filePath5];
            for (let i = 0; i < publish.length; i++) {
                let publishDocLibData1 = {
                    docLibTitle: publish[i],
                    company: 'Petramco',
                    ownerGroup: 'Staffing',
                }
                await apiHelper.apiLogin('tadmin');
                await apiHelper.deleteDocumentLibrary(publishDocLibData1.docLibTitle);
                await apiHelper.apiLogin('qkatawazi');
                let getFilePath1 = files1[i];
                let docLib = await apiHelper.createDocumentLibrary(publishDocLibData1, getFilePath1);
                await apiHelper.apiLogin('qheroux');
                await apiHelper.giveReadAccessToDocLib(docLib, "Compensation and Benefits");
                await apiHelper.publishDocumentLibrary(docLib);
            }
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

            await navigationPage.gotCreateCase();
            await createCasePo.selectRequester('qtao');
            await createCasePo.setSummary(caseSummary);
            await createCasePo.clickSaveCaseButton();
            await createCasePo.clickGoToCaseButton();

            await activityTabPo.addActivityNote(addNoteText);
            await activityTabPo.clickOnAttachLink();
            await attachDocumentBladePo.clickOnAdvanceSearchButton();

            await attachDocumentBladePo.searchRecord(publishDocLibData2.docLibTitle);
            await expect(await attachDocumentBladePo.isDocumentLibaryPresent(publishDocLibData2.docLibTitle)).toBeFalsy('FailuerMsg: drdmv13480_publish_document3 doc is displayed');
            await attachDocumentBladePo.searchRecord(draftDocLibData.docLibTitle);
            await expect(await attachDocumentBladePo.isDocumentLibaryPresent(draftDocLibData.docLibTitle)).toBeFalsy('FailuerMsg: drdmv13480_draft_document doc is displayed');
            await attachDocumentBladePo.searchRecord(publish[0]);
            await attachDocumentBladePo.selectDocument();
            await attachDocumentBladePo.clickOnAttachButton();
            await activityTabPo.clickOnPostButton();
            await utilCommon.waitUntilSpinnerToHide();
            await expect(await activityTabPo.isAttachedFileNameDisplayed('bwfJpg.jpg')).toBeTruthy('FailuerMsg: bwfJpg.jpg Attached Document is missing');
            await expect(await utilCommon.deleteAlreadyDownloadedFile('bwfJpg.jpg')).toBeTruthy('FailuerMsg: bwfJpg.jpg File is delete sucessfully');
            await activityTabPo.clickAndDownloadAttachmentFile('bwfJpg.jpg');
            await expect(await utilCommon.isFileDownloaded('bwfJpg.jpg')).toBeTruthy('FailuerMsg: bwfJpg.jpg File is not downloaded.');

            await activityTabPo.addActivityNote(addNoteText);
            await activityTabPo.clickOnAttachLink();
            await attachDocumentBladePo.searchAndAttachDocument(publish[1]);
            await activityTabPo.clickOnAttachLink();
            await attachDocumentBladePo.searchAndAttachDocument(publish[2]);
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
            let publish: string[] = ['drdmv13479_publish_document1', 'drdmv13479_publish_document2', 'drdmv13479_publish_document5'];
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

            let draftDocLibData = {
                docLibTitle: 'drdmv13479_draft_document',
                company: 'Petramco',
                ownerGroup: 'Compensation and Benefits',
            }
            await apiHelper.apiLogin('tadmin');
            await apiHelper.deleteDocumentLibrary(draftDocLibData.docLibTitle);
            await apiHelper.apiLogin('elizabeth');
            await apiHelper.createDocumentLibrary(draftDocLibData, filePath4);

            await navigationPage.signOut();
            await loginPage.login('qkatawazi');

            await navigationPage.gotCreateCase();
            await createCasePo.selectRequester('qtao');
            await createCasePo.setSummary(caseSummary);
            await createCasePo.clickSaveCaseButton();
            await createCasePo.clickGoToCaseButton();

            await activityTabPo.addActivityNote(addNoteText);
            await activityTabPo.clickOnAttachLink();
            await attachDocumentBladePo.clickOnAdvanceSearchButton();

            await attachDocumentBladePo.searchRecord(publishDocLibData2.docLibTitle);
            await expect(await attachDocumentBladePo.isDocumentLibaryPresent(publishDocLibData2.docLibTitle)).toBeFalsy('FailuerMsg: drdmv13479_publish_document3 doc is displayed');
            await attachDocumentBladePo.searchRecord(draftDocLibData.docLibTitle);
            await expect(await attachDocumentBladePo.isDocumentLibaryPresent(draftDocLibData.docLibTitle)).toBeFalsy('FailuerMsg: draftDocLib4 doc is displayed');
            await attachDocumentBladePo.searchRecord(publish[0]);
            await attachDocumentBladePo.selectDocument();
            await attachDocumentBladePo.clickOnAttachButton();
            await activityTabPo.clickOnPostButton();
            await utilCommon.waitUntilSpinnerToHide();
            await expect(await activityTabPo.isAttachedFileNameDisplayed('bwfJpg.jpg')).toBeTruthy('FailuerMsg: bwfJpg.jpg Attached Document is missing');
            await expect(await utilCommon.deleteAlreadyDownloadedFile('bwfJpg.jpg')).toBeTruthy('FailuerMsg: bwfJpg.jpg File is delete sucessfully');
            await activityTabPo.clickAndDownloadAttachmentFile('bwfJpg.jpg');
            await expect(await utilCommon.isFileDownloaded('bwfJpg.jpg')).toBeTruthy('FailuerMsg: bwfJpg.jpg File is not downloaded.');

            await activityTabPo.addActivityNote(addNoteText);
            await activityTabPo.clickOnAttachLink();
            await attachDocumentBladePo.searchAndAttachDocument(publish[1]);
            await activityTabPo.clickOnAttachLink();
            await attachDocumentBladePo.searchAndAttachDocument(publish[2]);
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
            let draftDocLibData = {
                docLibTitle: 'drdmv13463_draft_document',
                company: 'Petramco',
                ownerGroup: 'Compensation and Benefits',
            }
            await apiHelper.apiLogin('tadmin');
            await apiHelper.deleteDocumentLibrary(draftDocLibData.docLibTitle);
            await apiHelper.apiLogin('elizabeth');
            await apiHelper.createDocumentLibrary(draftDocLibData, filePath4);

            await navigationPage.signOut();
            await loginPage.login('qkatawazi');

            await navigationPage.gotCreateCase();
            await createCasePo.selectRequester('qtao');
            await createCasePo.setSummary(caseSummary);
            await createCasePo.clickSaveCaseButton();
            await createCasePo.clickGoToCaseButton();
            await viewCasePo.clickEditCaseButton();
            await editCasePo.clickOnAttachLink();
            await attachDocumentBladePo.clickOnAdvanceSearchButton();

            await attachDocumentBladePo.searchRecord(publishDocLibData2.docLibTitle);
            await expect(await attachDocumentBladePo.isDocumentLibaryPresent(publishDocLibData2.docLibTitle)).toBeFalsy('FailuerMsg: drdmv13463_publish_document3 doc is displayed');
            await attachDocumentBladePo.searchRecord(draftDocLibData.docLibTitle);
            await expect(await attachDocumentBladePo.isDocumentLibaryPresent(draftDocLibData.docLibTitle)).toBeFalsy('FailuerMsg: drdmv13463_draft_document doc is displayed');
            await attachDocumentBladePo.searchRecord(publish[0]);
            await attachDocumentBladePo.selectDocument();
            await attachDocumentBladePo.clickOnAttachButton();
            await editCasePo.clickSaveCase();

            await expect(await viewCasePo.isAttachedDocumentPresent('bwfJpg.jpg')).toBeTruthy('FailuerMsg: bwfJpg.jpg Attached Document is missing');
            await expect(await utilCommon.deleteAlreadyDownloadedFile('bwfJpg.jpg')).toBeTruthy('FailuerMsg: bwfJpg.jpg File is delete sucessfully');
            await viewCasePo.clickOnAttachedDocumentFile('bwfJpg.jpg');
            await expect(await utilCommon.isFileDownloaded('bwfJpg.jpg')).toBeTruthy('FailuerMsg: bwfJpg.jpg File is not downloaded.');
            await viewCasePo.clickEditCaseButton();
            await editCasePo.clickOnAttachLink();
            await attachDocumentBladePo.searchAndAttachDocument(publish[1]);
            await editCasePo.clickOnAttachLink();
            await attachDocumentBladePo.searchAndAttachDocument(publish[2]);
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

            let publish: string[] = ['drdmv13506_publish_document1', 'drdmv13506_publish_document2', 'drdmv13506_publish_document5'];
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
                await apiHelper.apiLogin('qkatawazi');
                let getFilePath1 = files1[i];
                let docLib = await apiHelper.createDocumentLibrary(publishDocLibData2, getFilePath1);
                await apiHelper.publishDocumentLibrary(docLib);
            }
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

            await navigationPage.signOut();
            await loginPage.login('qkatawazi');

            await navigationPage.gotCreateCase();
            await createCasePo.selectRequester('qtao');
            await createCasePo.setSummary(caseSummary);
            await createCasePo.clickSaveCaseButton();
            await createCasePo.clickGoToCaseButton();
            await viewCasePo.clickOnEmailLink();
            await composeMailPo.clickOnAttachmentLink();

            await attachDocumentBladePo.clickOnAdvanceSearchButton();
            await attachDocumentBladePo.searchRecord(publishDocLibData1.docLibTitle);
            await expect(await attachDocumentBladePo.isDocumentLibaryPresent(publishDocLibData1.docLibTitle)).toBeFalsy('FailuerMsg: drdmv13506_publish_document3 doc is displayed');

            await attachDocumentBladePo.searchRecord(draftDocLibData.docLibTitle);
            await expect(await attachDocumentBladePo.isDocumentLibaryPresent(draftDocLibData.docLibTitle)).toBeFalsy('FailuerMsg: drdmv13506_draft_document doc is displayed');

            await attachDocumentBladePo.searchRecord(publish[0]);
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
            await attachDocumentBladePo.searchAndAttachDocument(publish[1]);
            await composeMailPo.clickOnAttachmentLink();
            await attachDocumentBladePo.searchAndAttachDocument(publish[2]);
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

            await navigationPage.gotCreateCase();
            await createCasePo.selectRequester('qtao');
            await createCasePo.setSummary(caseSummary);
            await createCasePo.clickSaveCaseButton();
            await createCasePo.clickGoToCaseButton();

            await activityTabPo.addActivityNote(addNoteText);
            await activityTabPo.clickOnAttachLink();
            await attachDocumentBladePo.clickOnAdvanceSearchButton();

            await attachDocumentBladePo.searchRecord(publishDocLibData2.docLibTitle);
            await expect(await attachDocumentBladePo.isDocumentLibaryPresent(publishDocLibData2.docLibTitle)).toBeFalsy('FailuerMsg: publishDocLib3 doc is displayed');
            await attachDocumentBladePo.searchRecord(draftDocLibData.docLibTitle);
            await expect(await attachDocumentBladePo.isDocumentLibaryPresent(draftDocLibData.docLibTitle)).toBeFalsy('FailuerMsg: draftDocLib4 doc is displayed');
            await attachDocumentBladePo.searchRecord(publish[0]);
            await attachDocumentBladePo.selectDocument();
            await attachDocumentBladePo.clickOnAttachButton();
            await activityTabPo.clickOnPostButton();
            await utilCommon.waitUntilSpinnerToHide();
            await expect(await activityTabPo.isAttachedFileNameDisplayed('bwfJpg.jpg')).toBeTruthy('FailuerMsg: bwfJpg.jpg Attached Document is missing');
            await expect(await utilCommon.deleteAlreadyDownloadedFile('bwfJpg.jpg')).toBeTruthy('FailuerMsg: bwfJpg.jpg File is delete sucessfully');
            await activityTabPo.clickAndDownloadAttachmentFile('bwfJpg.jpg');
            await expect(await utilCommon.isFileDownloaded('bwfJpg.jpg')).toBeTruthy('FailuerMsg: bwfJpg.jpg File is not downloaded.');

            await activityTabPo.addActivityNote(addNoteText);
            await activityTabPo.clickOnAttachLink();
            await attachDocumentBladePo.searchAndAttachDocument(publish[1]);
            await activityTabPo.clickOnAttachLink();
            await attachDocumentBladePo.searchAndAttachDocument(publish[2]);
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

            let draftDocLibData = {
                docLibTitle: 'drdmv13458_draft_document',
                company: 'Petramco',
                ownerGroup: 'Compensation and Benefits',
            }
            await apiHelper.apiLogin('tadmin');
            await apiHelper.deleteDocumentLibrary(draftDocLibData.docLibTitle);
            await apiHelper.apiLogin('elizabeth');
            await apiHelper.createDocumentLibrary(draftDocLibData, filePath4);

            await navigationPage.signOut();
            await loginPage.login('qdu');

            await navigationPage.gotCreateCase();
            await createCasePo.selectRequester('qtao');
            await createCasePo.setSummary(caseSummary);
            await createCasePo.clickSaveCaseButton();
            await createCasePo.clickGoToCaseButton();
            await viewCasePo.clickEditCaseButton();
            await editCasePo.clickOnAttachLink();
            await attachDocumentBladePo.clickOnAdvanceSearchButton();

            await attachDocumentBladePo.searchRecord(publishDocLibData2.docLibTitle);
            await expect(await attachDocumentBladePo.isDocumentLibaryPresent(publishDocLibData2.docLibTitle)).toBeFalsy('FailuerMsg: publishDocLib3 doc is displayed');
            await attachDocumentBladePo.searchRecord(draftDocLibData.docLibTitle);
            await expect(await attachDocumentBladePo.isDocumentLibaryPresent(draftDocLibData.docLibTitle)).toBeFalsy('FailuerMsg: draftDocLib4 doc is displayed');
            await attachDocumentBladePo.searchRecord(publish[0]);
            await attachDocumentBladePo.selectDocument();
            await attachDocumentBladePo.clickOnAttachButton();
            await editCasePo.clickSaveCase();

            await expect(await viewCasePo.isAttachedDocumentPresent('bwfJpg.jpg')).toBeTruthy('FailuerMsg: bwfJpg.jpg Attached Document is missing');
            await expect(await utilCommon.deleteAlreadyDownloadedFile('bwfJpg.jpg')).toBeTruthy('FailuerMsg: bwfJpg.jpg File is delete sucessfully');
            await viewCasePo.clickOnAttachedDocumentFile('bwfJpg.jpg');
            await expect(await utilCommon.isFileDownloaded('bwfJpg.jpg')).toBeTruthy('FailuerMsg: bwfJpg.jpg File is not downloaded.');
            await viewCasePo.clickEditCaseButton();
            await editCasePo.clickOnAttachLink();
            await attachDocumentBladePo.searchAndAttachDocument(publish[1]);
            await editCasePo.clickOnAttachLink();
            await attachDocumentBladePo.searchAndAttachDocument(publish[2]);
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

        await navigationPage.signOut();
        await loginPage.login(loginId);

        await navigationPage.gotoQuickCase();
        await quickCasePo.selectRequesterName('qtao');
        await quickCasePo.setCaseSummary(publishDocLibData1.docLibTitle);
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
        await editCasePo.updateCaseSummary(publishDocLibData1.docLibTitle);
        await editCasePo.clickSaveCase();
        await viewCasePo.clickOnTab('Resources')
        await expect(await resourcesTabPo.isKnowledgeArticlesEmpty()).toBeTruthy('Failuer: Knowledge Article is not empty');
        await resourcesTabPo.clickOnAdvancedSearchOptions('Knowledge Articles ');
        await resourcesTabPo.searchTextAndEnter(publishDocLibData1.docLibTitle);
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

            await navigationPage.signOut();
            await loginPage.login(loginId);

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
            await apiHelper.associateCaseTemplateWithOneTaskTemplate(newCaseTemplate.displayId, manualTaskTemplate.displayId);

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

            let draftDocLibData = {
                docLibTitle: 'drdmv13517_draft_document',
                company: 'Petramco',
                ownerGroup: 'Compensation and Benefits',
            }
            await apiHelper.apiLogin('tadmin');
            await apiHelper.deleteDocumentLibrary(draftDocLibData.docLibTitle);
            await apiHelper.apiLogin(loginId);
            await apiHelper.createDocumentLibrary(draftDocLibData, filePath4);

            await navigationPage.gotCreateCase();
            await createCasePo.selectRequester('qtao');
            await createCasePo.setSummary(caseSummary);
            await createCasePo.clickSelectCaseTemplateButton();
            await selectCasetemplateBladePo.selectCaseTemplate(caseTemplateName);
            await createCasePo.clickSaveCaseButton();
            await createCasePo.clickGoToCaseButton();

            await viewCasePo.clickAddTaskButton();
            await manageTask.clickAddAdhocTaskButton();
            await adhoctaskTemplate.setSummary(adhocTaskSummary1);
            await adhoctaskTemplate.clickOnAttachButton();

            await attachDocumentBladePo.clickOnAdvanceSearchButton();
            await attachDocumentBladePo.searchRecord(publishDocLibData1.docLibTitle);
            await expect(await attachDocumentBladePo.isDocumentLibaryPresent(publishDocLibData1.docLibTitle)).toBeFalsy('FailuerMsg: drdmv13517_publish_document3 doc is displayed');
            await attachDocumentBladePo.searchRecord(draftDocLibData.docLibTitle);
            await expect(await attachDocumentBladePo.isDocumentLibaryPresent(draftDocLibData.docLibTitle)).toBeFalsy('FailuerMsg: draftDocLib4 doc is displayed');
            await attachDocumentBladePo.searchRecord(publish[0]);
            await attachDocumentBladePo.selectDocument();
            await attachDocumentBladePo.clickOnAttachButton();

            await adhoctaskTemplate.clickOnSaveAdhoctask();
            await manageTask.clickOnCloseButton();

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
            await attachDocumentBladePo.searchAndAttachDocument(publish[1]);
            await adhoctaskTemplate.clickOnAttachButton();
            await attachDocumentBladePo.searchAndAttachDocument(publish[2]);
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
            let loginId2 = 'casemanagerwithdocmanager';

            let username = `${loginId2}@petramco.com`;
            let password = 'Password_1234';
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
                await apiHelper.apiLoginWithCredential(username, password);
                let getFilePath1 = files1[i];
                let docLib = await apiHelper.createDocumentLibrary(publishDocLibData2, getFilePath1);
                await apiHelper.publishDocumentLibrary(docLib);
            }
            let draftDocLibData = {
                docLibTitle: 'drdmv13508_draft_document',
                company: 'Petramco',
                ownerGroup: 'Compensation and Benefits',
                shareExternally: true
            }
            await apiHelper.apiLogin('tadmin');
            await apiHelper.deleteDocumentLibrary(draftDocLibData.docLibTitle);
            await apiHelper.apiLoginWithCredential(username, password);
            await apiHelper.createDocumentLibrary(draftDocLibData, filePath4);

            await navigationPage.signOut();
            await loginPage.loginWithCredentials(username, password);
            await navigationPage.gotCreateCase();
            await createCasePo.selectRequester('qtao');
            await createCasePo.setSummary(caseSummary);
            await createCasePo.clickSaveCaseButton();
            await createCasePo.clickGoToCaseButton();
            await viewCasePo.clickOnEmailLink();
            await composeMailPo.clickOnAttachmentLink();

            await attachDocumentBladePo.clickOnAdvanceSearchButton();
            await attachDocumentBladePo.searchRecord(publishDocLibData1.docLibTitle);
            await expect(await attachDocumentBladePo.isDocumentLibaryPresent(publishDocLibData1.docLibTitle)).toBeFalsy('FailuerMsg: drdmv13508_publish_document3 doc is displayed');
            await attachDocumentBladePo.searchRecord(draftDocLibData.docLibTitle);
            await expect(await attachDocumentBladePo.isDocumentLibaryPresent(draftDocLibData.docLibTitle)).toBeFalsy('FailuerMsg: drdmv13508_draft_document doc is displayed');

            await attachDocumentBladePo.searchRecord(publish[0]);
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
            await attachDocumentBladePo.searchAndAttachDocument(publish[1]);
            await composeMailPo.clickOnAttachmentLink();
            await attachDocumentBladePo.searchAndAttachDocument(publish[2]);
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

    //kgaikwad
    it('[DRDMV-13534]: Search and UI Validation of document library search view', async () => {
        let addNoteText = [...Array(10)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        let publish: string[] = ['drdmv13534_publish_document1', 'drdmv13534_publish_document2', 'drdmv13534_publish_document3', 'drdmv13534_publish_document4', 'drdmv13534_publish_document5', 'drdmv13534_publish_document6', 'drdmv13534_publish_document7', 'drdmv13534_publish_document8', 'drdmv13534_publish_document9', 'drdmv13534_publish_document10', 'drdmv13534_publish_document11'];
        let files1: string[] = [filePath1, filePath2, filePath3, filePath4, filePath5, filePath1, filePath2, filePath3, filePath4, filePath5, filePath1];
        for (let i = 0; i < publish.length; i++) {
            let publishDocLibData1 = {
                docLibTitle: publish[i],
                company: 'Petramco',
                ownerGroup: 'Compensation and Benefits',
            }
            await apiHelper.apiLogin('tadmin');
            await apiHelper.deleteDocumentLibrary(publishDocLibData1.docLibTitle);
            await apiHelper.apiLogin(loginId);
            let getFilePath1 = files1[i];
            let docLib = await apiHelper.createDocumentLibrary(publishDocLibData1, getFilePath1);
            await apiHelper.publishDocumentLibrary(docLib);
        }

        await navigationPage.gotoSettingsPage();
        await navigationPage.gotoSettingsMenuItem('Document Management--Library', 'Document Library Console - Business Workflows');
        await documentLibraryConsolePo.searchAndOpenDocumentLibrary(publish[0]);
        await editDocumentLibraryPo.selectStatus('Draft');
        await editDocumentLibraryPo.clickOnSaveButton();
        await documentLibraryConsolePo.searchAndOpenDocumentLibrary(publish[0]);
        await editDocumentLibraryPo.setCategoryTier1('Applications');
        await editDocumentLibraryPo.setRegion('Australia');
        await editDocumentLibraryPo.setSite('Canberra');
        await editDocumentLibraryPo.selectStatus('Published');
        await editDocumentLibraryPo.clickOnSaveButton();
        //Create Case
        await navigationPage.gotCreateCase();
        await createCasePo.selectRequester('qtao');
        await createCasePo.setSummary(caseSummary);
        await createCasePo.clickSaveCaseButton();
        await createCasePo.clickGoToCaseButton();

        await activityTabPo.addActivityNote(addNoteText);
        await activityTabPo.clickOnAttachLink();
        await attachDocumentBladePo.clickOnAdvanceSearchButton();
        await attachDocumentBladePo.searchRecord(publish[0]);
        await expect(await attachDocumentBladePo.isBladeTitleDisplayed()).toBeTruthy(': Attach Document Blade title is missing');
        await expect(await attachDocumentBladePo.getTextOfDocumentListHeading()).toContain('Document Library ');
        await expect(await attachDocumentBladePo.isAttachFromLocalDriveButtonDisplayed()).toBeTruthy('Failure: Attach from local drive button is missing');
        await expect(await attachDocumentBladePo.isAttachButtonDisplayed()).toBeTruthy('Failure: Attach button is missing');
        await expect(await attachDocumentBladePo.isCancelButtonDisplayed()).toBeTruthy('Failure: cancel button is missing');
        await expect(await attachDocumentBladePo.isDocumentTitleDisplayed(publish[0])).toBeTruthy('Failure: bwfJpg.jpg file name is missing');
        let objDate: Date = new Date();
        let numYear: number = objDate.getFullYear();
        let year = new Number(numYear).toString();
        await expect(await attachDocumentBladePo.isUpdatedDateDisplayed(year)).toBeTruthy('Failure: cancel button is missing');
        await expect(await attachDocumentBladePo.isDocumentAttachmentNameDisplayed('bwfJpg.jpg')).toBeTruthy('Failure: attached file name is missing');
        await attachDocumentBladePo.isDocumentLibaryPresent(publish[0]);
        await attachDocumentBladePo.searchRecord('%');
        await expect(await attachDocumentBladePo.isPaginationPresent()).toBeTruthy('Failure: Pagination is missing');
        await resources.clickOnAdvancedSearchSettingsIconToOpen();
        await resources.selectAdvancedSearchFilterOption('Operational Category 1', 'Applications');
        await resources.selectAdvancedSearchFilterOption('Region', 'Australia');
        await resources.selectAdvancedSearchFilterOption('Site', 'Canberra');
        await resources.clickOnAdvancedSearchFiltersButton('Apply');
        await attachDocumentBladePo.selectDocument();
        await attachDocumentBladePo.clickOnAttachButton();
        await activityTabPo.clickOnAttachLink();
        await attachDocumentBladePo.searchAndAttachDocument(publish[1]);
        await activityTabPo.clickOnPostButton();
        await utilCommon.waitUntilSpinnerToHide();
        await expect(await activityTabPo.isAttachedFileNameDisplayed('bwfJpg.jpg')).toBeTruthy('FailureMsg: bwfJpg.jpg Attached Document is missing');
        await expect(await utilCommon.deleteAlreadyDownloadedFile('bwfJpg.jpg')).toBeTruthy('FailureMsg: bwfJpg.jpg File is delete sucessfully');
        await activityTabPo.clickAndDownloadAttachmentFile('bwfJpg.jpg');
        await expect(await utilCommon.isFileDownloaded('bwfJpg.jpg')).toBeTruthy('FailureMsg: bwfJpg.jpg File is not downloaded.');

        await expect(await activityTabPo.isAttachedFileNameDisplayed('bwfPdf.pdf')).toBeTruthy('FailureMsg: bwfPdf.pdf Attached Document is missing');
        await expect(await utilCommon.deleteAlreadyDownloadedFile('bwfPdf.pdf')).toBeTruthy('FailureMsg: bwfPdf.pdf File is delete sucessfully');
        await activityTabPo.clickAndDownloadAttachmentFile('bwfPdf.pdf');
        await expect(await utilCommon.isFileDownloaded('bwfPdf.pdf')).toBeTruthy('FailuerMsg: bwfPdf.pdf File is not downloaded.');
    }, 240 * 1000);

    //kgaikwad
    it('[DRDMV-13536]: Attach documents from local drive and document library at the same time', async () => {
        try {
            let excelFile = '../../data/ui/attachment/bwfXlsx.xlsx';
            let addNoteText = [...Array(10)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
            let publish: string[] = ['drdmv13536_publish_document1', 'drdmv13536_publish_document2'];
            let files: string[] = [filePath1, filePath2];
            for (let i = 0; i < publish.length; i++) {
                let publishDocLibData1 = {
                    docLibTitle: publish[i],
                    company: 'Petramco',
                    ownerGroup: 'Compensation and Benefits',
                }
                await apiHelper.apiLogin('tadmin');
                await apiHelper.deleteDocumentLibrary(publishDocLibData1.docLibTitle);
                await apiHelper.apiLogin(loginId);
                let getFilePath1 = files[i];
                let docLib = await apiHelper.createDocumentLibrary(publishDocLibData1, getFilePath1);
                await apiHelper.apiLogin(loginId);
                await apiHelper.giveReadAccessToDocLib(docLib, "Staffing");
                await apiHelper.publishDocumentLibrary(docLib);
            }

            await navigationPage.signOut();
            await loginPage.login(loginId);

            await navigationPage.gotCreateCase();
            await createCasePo.selectRequester('qtao');
            await createCasePo.setSummary('drdmv-13536' + caseSummary);
            await createCasePo.clickSaveCaseButton();
            await createCasePo.clickGoToCaseButton();
            let caseId = await viewCasePo.getCaseID();
            await activityTabPo.addActivityNote(addNoteText);
            await activityTabPo.addAttachment(excelFile);
            await activityTabPo.clickOnAttachLink();
            await attachDocumentBladePo.searchAndAttachDocument(publish[0]);
            await activityTabPo.clickOnAttachLink();
            await attachDocumentBladePo.searchAndAttachDocument(publish[1]);
            await activityTabPo.clickOnPostButton();
            await utilCommon.waitUntilSpinnerToHide();
            await viewCasePo.clickAttachmentsLink();
            await attachmentBladePo.clickOnCloseButton();

            await expect(await activityTabPo.isAttachedFileNameDisplayed('bwfJpg.jpg')).toBeTruthy('FailureMsg: bwfJpg.jpg Attached Document is missing');
            await expect(await utilCommon.deleteAlreadyDownloadedFile('bwfJpg.jpg')).toBeTruthy('FailureMsg: bwfJpg.jpg File is delete sucessfully');
            await activityTabPo.clickAndDownloadAttachmentFile('bwfJpg.jpg');
            await expect(await utilCommon.isFileDownloaded('bwfJpg.jpg')).toBeTruthy('FailureMsg: bwfJpg.jpg File is not downloaded.');

            await expect(await activityTabPo.isAttachedFileNameDisplayed('bwfPdf.pdf')).toBeTruthy('FailureMsg: bwfPdf.pdf Attached Document is missing');
            await expect(await utilCommon.deleteAlreadyDownloadedFile('bwfPdf.pdf')).toBeTruthy('FailureMsg: bwfPdf.pdf File is delete sucessfully');
            await activityTabPo.clickAndDownloadAttachmentFile('bwfPdf.pdf');
            await expect(await utilCommon.isFileDownloaded('bwfPdf.pdf')).toBeTruthy('FailureMsg: bwfPdf.pdf File is not downloaded.');

            await expect(await activityTabPo.isAttachedFileNameDisplayed('bwfXlsx.xlsx')).toBeTruthy('FailureMsg:bwfXlsx.xlsx Attached Document is missing');
            await expect(await utilCommon.deleteAlreadyDownloadedFile('bwfXlsx.xlsx')).toBeTruthy('FailureMsg: bwfXlsx.xlsx File is delete sucessfully');
            await activityTabPo.clickAndDownloadAttachmentFile('bwfXlsx.xlsx');
            await expect(await utilCommon.isFileDownloaded('bwfXlsx.xlsx')).toBeTruthy('FailureMsg: bwfXlsx.xlsx File is not downloaded.');

            await viewCasePo.clickOnTab('Case Access');
            await caseAccessTabPo.clickOnSupportGroupAccessORAgentAccessButton('Agent Access');
            await caseAccessTabPo.selectAndAddAgent('qstrong');
            await expect(await caseAccessTabPo.isAgentNameOrSupportGroupNameDisplayed('Quin Strong')).toBeTruthy('Failuer: Quanah George Agent Name is missing');

            await navigationPage.signOut();
            await loginPage.login('qstrong');
            await caseConsolePo.searchAndOpenCase(caseId);

            await expect(await activityTabPo.isAttachedFileNameDisplayed('bwfJpg.jpg')).toBeTruthy('FailureMsg:bwfJpg.jpg Attached Document is missing');
            await expect(await utilCommon.deleteAlreadyDownloadedFile('bwfJpg.jpg')).toBeTruthy('FailureMsg: bwfJpg.jpg File is delete sucessfully');
            await activityTabPo.clickAndDownloadAttachmentFile('bwfJpg.jpg');
            await expect(await utilCommon.isFileDownloaded('bwfJpg.jpg')).toBeTruthy('FailureMsg: bwfJpg.jpg File is not downloaded.');

            await expect(await activityTabPo.isAttachedFileNameDisplayed('bwfPdf.pdf')).toBeTruthy('FailureMsg:bwfPdf.pdf Attached Document is missing');
            await expect(await utilCommon.deleteAlreadyDownloadedFile('bwfPdf.pdf')).toBeTruthy('FailureMsg: bwfPdf.pdf File is delete sucessfully');
            await activityTabPo.clickAndDownloadAttachmentFile('bwfPdf.pdf');
            await expect(await utilCommon.isFileDownloaded('bwfPdf.pdf')).toBeTruthy('FailureMsg: bwfPdf.pdf File is not downloaded.');

            await expect(await activityTabPo.isAttachedFileNameDisplayed('bwfXlsx.xlsx')).toBeTruthy('FailureMsg:bwfXlsx.xlsx Attached Document is missing');
            await expect(await utilCommon.deleteAlreadyDownloadedFile('bwfXlsx.xlsx')).toBeTruthy('FailureMsg: bwfXlsx.xlsx File is delete sucessfully');
            await activityTabPo.clickAndDownloadAttachmentFile('bwfXlsx.xlsx');
            await expect(await utilCommon.isFileDownloaded('bwfXlsx.xlsx')).toBeTruthy('FailureMsg: bwfXlsx.xlsx File is not downloaded.');
        } catch (e) {
            throw e;
        } finally {
            await navigationPage.signOut();
            await loginPage.login('qkatawazi');
        }
    }, 240 * 1000);

    //kgaikwad
    it('[DRDMV-13528]: Access to the documents attached on case when case is re-assigned to some other support group', async () => {
        try {
            let caseId;
            let publishDocLibData1 = {
                docLibTitle: 'drdmv13528_publish_document1',
                company: 'Petramco',
                ownerGroup: 'Compensation and Benefits',
            }
            await apiHelper.apiLogin('tadmin');
            await apiHelper.deleteDocumentLibrary(publishDocLibData1.docLibTitle);
            await apiHelper.apiLogin(loginId);
            let docLib1 = await apiHelper.createDocumentLibrary(publishDocLibData1, filePath1);
            await apiHelper.giveReadAccessToDocLib(docLib1, "Staffing");
            await apiHelper.publishDocumentLibrary(docLib1);

            let publishDocLibData2 = {
                docLibTitle: 'drdmv13528_publish_document2',
                company: 'Petramco',
                ownerGroup: 'Compensation and Benefits',
            }
            await apiHelper.apiLogin('tadmin');
            await apiHelper.deleteDocumentLibrary(publishDocLibData2.docLibTitle);
            await apiHelper.apiLogin(loginId);
            let docLib2 = await apiHelper.createDocumentLibrary(publishDocLibData2, filePath2);
            await apiHelper.publishDocumentLibrary(docLib2);

            await navigationPage.signOut();
            await loginPage.login(loginId);

            await navigationPage.gotCreateCase();
            await createCasePo.selectRequester('qtao');
            await createCasePo.setSummary(caseSummary);
            await createCasePo.clickChangeAssignmentButton();
            await changeAssignmentBladePo.selectCompany('Petramco');
            await changeAssignmentBladePo.selectSupportGroup('Staffing');
            await changeAssignmentBladePo.selectAssignee('Quin Strong');
            await changeAssignmentBladePo.clickOnAssignButton();
            await createCasePo.clickSaveCaseButton();
            await createCasePo.clickGoToCaseButton();
            caseId = await viewCasePo.getCaseID();
            await viewCasePo.clickEditCaseButton();
            await editCasePo.clickOnAttachLink();
            await attachDocumentBladePo.searchAndAttachDocument(publishDocLibData1.docLibTitle);
            await editCasePo.clickOnAttachLink();
            await attachDocumentBladePo.searchAndAttachDocument(publishDocLibData2.docLibTitle);
            await editCasePo.clickSaveCase();
            await expect(await viewCasePo.isAttachedDocumentPresent('bwfJpg.jpg')).toBeTruthy('FailureMsg: bwfJpg.jpg Attached Document is missing');
            await expect(await utilCommon.deleteAlreadyDownloadedFile('bwfJpg.jpg')).toBeTruthy('FailureMsg: bwfJpg.jpg File is delete sucessfully');
            await viewCasePo.clickOnAttachedDocumentFile('bwfJpg.jpg');
            await expect(await utilCommon.isFileDownloaded('bwfJpg.jpg')).toBeTruthy('FailureMsg: bwfJpg.jpg File is not downloaded.');

            await expect(await viewCasePo.isAttachedDocumentPresent('bwfPdf.pdf')).toBeTruthy('FailureMsg: bwfPdf.pdf Attached Document is missing');
            await expect(await utilCommon.deleteAlreadyDownloadedFile('bwfPdf.pdf')).toBeTruthy('FailureMsg: bwfPdf.pdf File is delete sucessfully');
            await viewCasePo.clickOnAttachedDocumentFile('bwfPdf.pdf');
            await expect(await utilCommon.isFileDownloaded('bwfPdf.pdf')).toBeTruthy('FailureMsg: bwfPdf.pdf File is not downloaded.');

            await navigationPage.signOut();
            await loginPage.login('qstrong');
            await caseConsolePo.searchAndOpenCase(caseId);
            await expect(await viewCasePo.isAttachedDocumentPresent('bwfJpg.jpg')).toBeTruthy('FailureMsg: bwfJpg.jpg Attached Document is missing');
            await expect(await utilCommon.deleteAlreadyDownloadedFile('bwfJpg.jpg')).toBeTruthy('FailureMsg: bwfJpg.jpg File is delete sucessfully');
            await viewCasePo.clickOnAttachedDocumentFile('bwfJpg.jpg');
            await expect(await utilCommon.isFileDownloaded('bwfJpg.jpg')).toBeTruthy('FailureMsg: bwfJpg.jpg File is not downloaded.');
            await expect(await viewCasePo.isAttachedDocumentPresent('bwfPdf.pdf')).toBeFalsy('FailuerMsg: bwfPdf.pdf Attached Document is displayed');
        } catch (e) {
            throw e;
        } finally {
            await navigationPage.signOut();
            await loginPage.login('qkatawazi');
        }
    }, 360 * 1000);

})