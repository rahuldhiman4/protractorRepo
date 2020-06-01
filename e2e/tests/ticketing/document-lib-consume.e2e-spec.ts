import { browser } from 'protractor';
import apiHelper from '../../api/api.helper';
import attachmentBladePo from '../../pageobject/attachment/attachment-blade.po';
import caseConsolePo from '../../pageobject/case/case-console.po';
import previewCasePo from '../../pageobject/case/case-preview.po';
import createCasePo from '../../pageobject/case/create-case.po';
import editCasePo from '../../pageobject/case/edit-case.po';
import selectCasetemplateBladePo from '../../pageobject/case/select-casetemplate-blade.po';
import viewCasePo from '../../pageobject/case/view-case.po';
import attachDocumentBladePo from '../../pageobject/common/attach-document-blade.po';
import caseAccessTabPo from '../../pageobject/common/case-access-tab.po';
import loginPage from '../../pageobject/common/login.po';
import navigationPage from "../../pageobject/common/navigation.po";
import composeMailPo from '../../pageobject/email/compose-mail.po';
import documentLibraryConsolePo from '../../pageobject/settings/document-management/document-library-console.po';
import editDocumentLibraryPo from '../../pageobject/settings/document-management/edit-document-library.po';
import activityTabPo from '../../pageobject/social/activity-tab.po';
import editTaskPo from '../../pageobject/task/edit-task.po';
import viewTaskPo from '../../pageobject/task/view-task.po';
import { BWF_BASE_URL } from '../../utils/constants';
import utilityCommon from '../../utils/utility.common';

describe('Document Library Consume UI', () => {
    let filePath1 = 'e2e/data/ui/attachment/bwfJpg.jpg';
    let filePath2 = 'e2e/data/ui/attachment/bwfPdf.pdf';
    let filePath3 = 'e2e/data/ui/attachment/bwfJpg1.jpg';
    let filePath4 = 'e2e/data/ui/attachment/bwfJpg2.jpg';
    let filePath5 = 'e2e/data/ui/attachment/bwfXlsx.xlsx';
    let caseSummary = [...Array(10)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
    let loginId = 'caseagentbwf';
    beforeAll(async () => {
        await browser.get(BWF_BASE_URL);
        await loginPage.login('qkatawazi');
        // Create User and assigned Document Manager Permission to agent
        await apiHelper.apiLogin('tadmin');
        let caseAgentuserData = {
            "firstName": "caseAgent2",
            "lastName": "user2",
            "userId": loginId,
            "userPermission": "AGGAA5V0GE9Z4AOR0BXUOQ3ZT04EJA;AGGADG1AAO0VGAP8SXEGP7VU2U4ZS8",
        }
        await apiHelper.createNewUser(caseAgentuserData);
        await apiHelper.associatePersonToCompany(caseAgentuserData.userId, "Petramco");
        await apiHelper.associatePersonToSupportGroup(loginId, 'US Support 3');
    });

    afterAll(async () => {
        await navigationPage.signOut();
    });

    afterEach(async () => {
        await utilityCommon.refresh();
    });

    //kgaikwad
    it('[DRDMV-13539]: Documents attached on case still accessible when someone deletes them from document library', async () => {
       
        let publishDocData = {
            docLibTitle: 'drdmv13539_document',
            company: 'Petramco',
            businessUnit: 'United States Support',
            ownerGroup: 'US Support 3',
        }
        await apiHelper.apiLogin('tadmin');
        await apiHelper.deleteDocumentLibrary(publishDocData.docLibTitle);
        await apiHelper.apiLogin('qkatawazi');
        let docLib = await apiHelper.createDocumentLibrary(publishDocData, filePath1);
        await apiHelper.publishDocumentLibrary(docLib);

        await navigationPage.gotoCaseConsole();
        let summary = [...Array(10)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        let caseData =
        {
            "Requester": "qtao",
            "Summary": "Test case for DRDMV-8377RandVal" + summary,
            "Assigned Company": "Petramco",
            "Business Unit": "United States Support",
            "Support Group": "US Support 3",
            "Assignee": "qkatawazi"
        }
        await apiHelper.apiLogin('qkatawazi');
        let newCase = await apiHelper.createCase(caseData);
        let caseId: string = newCase.displayId;
        await caseConsolePo.searchAndOpenCase(caseId);
        await viewCasePo.clickEditCaseButton();
        await editCasePo.clickOnAttachLink();
        await attachDocumentBladePo.searchAndAttachDocument(publishDocData.docLibTitle);
        await editCasePo.clickSaveCase();
        await viewCasePo.clickAttachmentsLink();
        expect(await utilityCommon.deleteAlreadyDownloadedFile('bwfJpg.jpg')).toBeTruthy('failureMsg: bwfJpg.jpg File is delete sucessfully');
        await attachmentBladePo.searchAndSelectCheckBox('bwfJpg');
        await attachmentBladePo.clickDownloadButton();
        expect(await utilityCommon.isFileDownloaded('bwfJpg.jpg')).toBeTruthy('bwfJpg.jpg File is not downloaded.');
        expect(await utilityCommon.deleteAlreadyDownloadedFile('bwfJpg.jpg')).toBeTruthy('failureMsg: bwfJpg.jpg File is delete sucessfully');
        await attachmentBladePo.clickCloseButton();
        await navigationPage.gotoSettingsPage();
        await navigationPage.gotoSettingsMenuItem('Document Management--Library', 'Document Library Console - Business Workflows');
        await documentLibraryConsolePo.searchAndOpenDocumentLibrary(publishDocData.docLibTitle);
        await editDocumentLibraryPo.selectStatus('Draft');
        await editDocumentLibraryPo.clickOnSaveButton();
        await navigationPage.gotoCaseConsole();
        await apiHelper.apiLogin('tadmin');
        await apiHelper.deleteDocumentLibrary(publishDocData.docLibTitle);
        await caseConsolePo.searchAndOpenCase(caseId);
        await viewCasePo.clickAttachmentsLink();
        expect(await utilityCommon.deleteAlreadyDownloadedFile('bwfJpg.jpg')).toBeTruthy('failureMsg: Fail to delete bwfJpg.jpg file');
        await attachmentBladePo.searchAndSelectCheckBox('bwfJpg');
        await attachmentBladePo.clickDownloadButton();
        expect(await utilityCommon.isFileDownloaded('bwfJpg.jpg')).toBeTruthy('failureMsg: bwfJpg.jpg File is not downloaded.');
    }, 750 * 1000);

    //kgaikwad
    // Done
    it('[DRDMV-13533]: Access to the documents attached on case when agent has read access to the case', async () => {
        try {
            let publishDocLibData1 = {
                "docLibTitle": "drdmv13533_publish_document1",
                "company": "Petramco",
                "Business Unit": "United States Support",
                "ownerGroup": "US Support 3",
            }

            await apiHelper.apiLogin('tadmin');
            await apiHelper.deleteDocumentLibrary(publishDocLibData1.docLibTitle);
            await apiHelper.apiLogin('qkatawazi');
            let docLib = await apiHelper.createDocumentLibrary(publishDocLibData1, filePath1);
            await apiHelper.giveReadAccessToDocLib(docLib, "GB Support 2");
            await apiHelper.publishDocumentLibrary(docLib);

            let publishDocLibData2 = {
                "docLibTitle": "drdmv13533_publish_document2",
                "company": "Petramco",
                "Business Unit": "United States Support",
                "ownerGroup": "US Support 3",
            }
            await apiHelper.apiLogin('tadmin');
            await apiHelper.deleteDocumentLibrary(publishDocLibData2.docLibTitle);
            await apiHelper.apiLogin('qkatawazi');
            let docLib2 = await apiHelper.createDocumentLibrary(publishDocLibData2, filePath2);
            await apiHelper.publishDocumentLibrary(docLib2);

            await navigationPage.gotoCaseConsole();
            let summary = [...Array(10)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
            let caseData =
            {
                "Requester": "qtao",
                "Summary": "Test case for DRDMV-8377RandVal" + summary,
                "Assigned Company": "Petramco",
                "Business Unit": "United States Support",
                "Support Group": "US Support 3",
                "Assignee": "qkatawazi"
            }
            await apiHelper.apiLogin('qkatawazi');
            let newCase = await apiHelper.createCase(caseData);
            let caseId: string = newCase.displayId;
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
            expect(await caseAccessTabPo.isAgentNameOrSupportGroupNameDisplayed('Quin Strong')).toBeTruthy('FailuerMsg1: Quanah George Agent Name is missing');
            await navigationPage.gotoCaseConsole();
            await navigationPage.signOut();
            await loginPage.login('qstrong');
            await caseConsolePo.searchAndOpenCase(caseId);
            expect(await viewCasePo.getCaseID()).toBe(caseId, 'Case Id is missing');
            expect(await viewCasePo.isAttachedDocumentPresent(' bwfJpg.jpg')).toBeTruthy('FailuerMsg2: Attached Document is missing');
            expect(await viewCasePo.isAttachedDocumentPresent(' bwfPdf.pdf')).toBeFalsy('FailuerMsg3: Attached Document is displyaed');
            expect(await utilityCommon.deleteAlreadyDownloadedFile('bwfJpg.jpg')).toBeTruthy('FailuerMsg4: File is delete sucessfully');
            await viewCasePo.clickOnAttachedDocumentFile('bwfJpg.jpg');
            expect(await utilityCommon.isFileDownloaded('bwfJpg.jpg')).toBeTruthy('FailuerMsg5: File is not downloaded.');
        } catch (e) {
            throw e;
        } finally {
            await navigationPage.signOut();
            await loginPage.login('qkatawazi');
        }
    }, 600 * 1000);

    //kgaikwad
    it('[DRDMV-13524]: Edit Task - Case agent attaches published document from document library where case agent is author of the document', async () => {
        try {
            let randomStr = [...Array(5)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
            let caseTemplateName = 'caseTemplateName' + randomStr;
            let casTemplateSummary = 'CaseSummaryName' + randomStr;

            let publishDocLibData2 = {
                "docLibTitle": "drdmv13524_publish_document3",
                "company": "Petramco",
                "Business Unit": "Facilities Support",
                "ownerGroup": "Facilities",
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
                "businessUnit": "United States Support",//New
                "supportGroup": "US Support 3"
            }
            await apiHelper.apiLogin('qkatawazi');
            let newCaseTemplate = await apiHelper.createCaseTemplate(templateData);

            let taskTemplateNameWithYesValue = 'taskTemplateWithYesResolve' + randomStr;
            let taskTemplateSummaryYesValue = 'taskSummaryYesResolved' + randomStr;
            let taskTemplateDataSet = {
                "templateName": `${taskTemplateNameWithYesValue}`,
                "templateSummary": `${taskTemplateSummaryYesValue}`,
                "templateStatus": "Active",
                "taskCompany": 'Petramco',
                "assignee": loginId,
                "businessUnit": "United States Support",
                "supportGroup": "US Support 3",
                "ownerCompany": "Petramco",
                "ownerBusinessUnit": "Facilities Support",
                "ownerGroup": "Facilities"
            }
            let manualTaskTemplate = await apiHelper.createManualTaskTemplate(taskTemplateDataSet);
            await apiHelper.associateCaseTemplateWithOneTaskTemplate(newCaseTemplate.displayId, manualTaskTemplate.displayId);

            let publish: string[] = ['drdmv13524_publish_document1', 'drdmv13524_publish_document2', 'drdmv13524_publish_document5'];
            let files1: string[] = [filePath1, filePath2, filePath5];
            for (let i = 0; i < publish.length; i++) {
                let publishDocLibData1 = {
                    "docLibTitle": publish[i],
                    "company": "Petramco",
                    "Business Unit": "Facilities Support",
                    "ownerGroup": "Facilities",
                }

                await apiHelper.apiLogin('tadmin');
                await apiHelper.deleteDocumentLibrary(publishDocLibData1.docLibTitle);
                await apiHelper.apiLogin(loginId);
                let getFilePath1 = files1[i];
                let docLib = await apiHelper.createDocumentLibrary(publishDocLibData1, getFilePath1);
                await apiHelper.publishDocumentLibrary(docLib);
            }

            let draftDocLibData = {
                "docLibTitle": "drdmv13524_draft_document",
                "company": "Petramco",
                "Business Unit": "Facilities Support",
                "ownerGroup": "Facilities",
            }

            await apiHelper.apiLogin('tadmin');
            await apiHelper.deleteDocumentLibrary(draftDocLibData.docLibTitle);
            await apiHelper.apiLogin(loginId);
            await apiHelper.createDocumentLibrary(draftDocLibData, filePath4);

            await navigationPage.signOut();
            await loginPage.login(loginId);

            await navigationPage.gotoCreateCase();
            await createCasePo.selectRequester('qtao');
            await createCasePo.setSummary(caseSummary);
            await createCasePo.clickSelectCaseTemplateButton();
            await selectCasetemplateBladePo.selectCaseTemplate(caseTemplateName);
            await createCasePo.clickSaveCaseButton();
            await previewCasePo.clickGoToCaseButton();
            await viewCasePo.clickOnTaskLink(taskTemplateSummaryYesValue);
            await viewTaskPo.clickOnEditTask();
            await editTaskPo.clickOnAttachButton();
            await attachDocumentBladePo.clickOnAdvanceSearchButton();

            await attachDocumentBladePo.searchRecord(publishDocLibData2.docLibTitle);
            expect(await attachDocumentBladePo.isDocumentLibaryPresent(publishDocLibData2.docLibTitle)).toBeFalsy('FailuerMsg: drdmv13524_publish_document3 doc is displayed');
            await attachDocumentBladePo.searchRecord(draftDocLibData.docLibTitle);
            expect(await attachDocumentBladePo.isDocumentLibaryPresent(draftDocLibData.docLibTitle)).toBeFalsy('FailuerMsg: drdmv13524_draft_document doc is displayed');
            await attachDocumentBladePo.searchRecord(publish[0]);
            await attachDocumentBladePo.selectDocument();
            await attachDocumentBladePo.clickOnAttachButton();
            await editTaskPo.clickOnSaveButton();
            await utilityCommon.waitUntilPopUpDisappear();
            expect(await viewTaskPo.isAttachedDocumentPresent('bwfJpg.jpg')).toBeTruthy('FailuerMsg: bwfJpg.jpg Attached Document is missing');
            expect(await utilityCommon.deleteAlreadyDownloadedFile('bwfJpg.jpg')).toBeTruthy('FailuerMsg: bwfJpg.jpg File is delete sucessfully');
            await viewTaskPo.clickOnAttachedDocumentFile('bwfJpg.jpg');
            expect(await utilityCommon.isFileDownloaded('bwfJpg.jpg')).toBeTruthy('FailuerMsg: bwfJpg.jpg File is not downloaded.');
            await viewTaskPo.clickOnEditTask();
            await editTaskPo.clickOnAttachButton();
            await attachDocumentBladePo.searchAndAttachDocument(publish[1]);
            await editTaskPo.clickOnAttachButton();
            await attachDocumentBladePo.searchAndAttachDocument(publish[2]);
            await editTaskPo.clickOnSaveButton();
            await utilityCommon.waitUntilPopUpDisappear();
            expect(await viewTaskPo.isAttachedDocumentPresent('bwfPdf.pdf')).toBeTruthy('FailuerMsg: bwfPdf.pdf Attached Document is missing');
            expect(await utilityCommon.deleteAlreadyDownloadedFile('bwfPdf.pdf')).toBeTruthy('FailuerMsg: bwfPdf.pdf File is delete sucessfully');
            await viewTaskPo.clickOnAttachedDocumentFile('bwfPdf.pdf');
            expect(await utilityCommon.isFileDownloaded('bwfPdf.pdf')).toBeTruthy('FailuerMsg: bwfPdf.pdf File is not downloaded.');
            await viewTaskPo.clickShowMoreShowLessLink();
            expect(await viewTaskPo.isAttachedDocumentPresent('bwfXlsx.xlsx')).toBeTruthy('FailuerMsg:bwfXlsx.xlsx Attached Document is missing');
            expect(await utilityCommon.deleteAlreadyDownloadedFile('bwfXlsx.xlsx')).toBeTruthy('FailuerMsg: bwfXlsx.xlsx File is delete sucessfully');
            await viewTaskPo.clickOnAttachedDocumentFile('bwfXlsx.xlsx');
            expect(await utilityCommon.isFileDownloaded('bwfXlsx.xlsx')).toBeTruthy('FailuerMsg: bwfXlsx.xlsx File is not downloaded.');
        } catch (e) {
            throw e;
        } finally {
            await navigationPage.signOut();
            await loginPage.login('qkatawazi');
        }
    }, 860 * 1000);

    //kgaikwad
    it('[DRDMV-13507]: Compose Email - Case agent attaches published document from document library where case agent is author of the document', async () => {
        try {
            let publishDocLibData1 = {
                "docLibTitle": "drdmv13524_publish_document3",
                "company": "Petramco",
                "Business Unit": "Facilities Support",
                "ownerGroup": "Facilities",
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
                    "docLibTitle": publish[i],
                    "company": "Petramco",
                    "Business Unit": "Facilities Support",
                    "ownerGroup": "Facilities",
                    "shareExternally": true,
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
                "company": "Petramco",
                "Business Unit": "Facilities Support",
                "ownerGroup": "Facilities",
                "shareExternally": true,
            }

            await apiHelper.apiLogin('tadmin');
            await apiHelper.deleteDocumentLibrary(draftDocLibData.docLibTitle);
            await apiHelper.apiLogin(loginId);
            await apiHelper.createDocumentLibrary(draftDocLibData, filePath4);

            await navigationPage.signOut();
            await loginPage.login(loginId);

            await navigationPage.gotoCreateCase();
            await createCasePo.selectRequester('qtao');
            await createCasePo.setSummary(caseSummary);
            await createCasePo.clickSaveCaseButton();
            await previewCasePo.clickGoToCaseButton();
            await viewCasePo.clickOnEmailLink();
            await composeMailPo.clickOnAttachmentLink();

            await attachDocumentBladePo.clickOnAdvanceSearchButton();
            await attachDocumentBladePo.searchRecord(publishDocLibData1.docLibTitle);
            expect(await attachDocumentBladePo.isDocumentLibaryPresent(publishDocLibData1.docLibTitle)).toBeFalsy('FailuerMsg: drdmv13507_publish_document1 doc is displayed');

            await attachDocumentBladePo.searchRecord(draftDocLibData.docLibTitle);
            expect(await attachDocumentBladePo.isDocumentLibaryPresent(draftDocLibData.docLibTitle)).toBeFalsy('FailuerMsg: publishDocLib3 doc is displayed');

            await attachDocumentBladePo.searchRecord(publish[0]);
            await attachDocumentBladePo.selectDocument();
            await attachDocumentBladePo.clickOnAttachButton();
            await composeMailPo.setToOrCCInputTetxbox('To', 'fritz.schulz@petramco.com');
            await composeMailPo.clickOnSendButton();

            expect(await activityTabPo.isAttachedFileNameDisplayed('bwfJpg.jpg')).toBeTruthy('FailuerMsg: bwfJpg.jpg Attached Document is missing');
            expect(await utilityCommon.deleteAlreadyDownloadedFile('bwfJpg.jpg')).toBeTruthy('FailuerMsg: bwfJpg.jpg File is delete sucessfully');
            await activityTabPo.clickAndDownloadAttachmentFile('bwfJpg.jpg');
            expect(await utilityCommon.isFileDownloaded('bwfJpg.jpg')).toBeTruthy('FailuerMsg: bwfJpg.jpg File is not downloaded.');

            await viewCasePo.clickOnEmailLink();
            await composeMailPo.clickOnAttachmentLink();
            await attachDocumentBladePo.searchAndAttachDocument(publish[1]);
            await composeMailPo.clickOnAttachmentLink();
            await attachDocumentBladePo.searchAndAttachDocument(publish[2]);
            await composeMailPo.setToOrCCInputTetxbox('To', 'fritz.schulz@petramco.com');
            await composeMailPo.clickOnSendButton();

            expect(await activityTabPo.isAttachedFileNameDisplayed('bwfPdf.pdf')).toBeTruthy('FailuerMsg: bwfPdf.pdf Attached Document is missing');
            expect(await utilityCommon.deleteAlreadyDownloadedFile('bwfPdf.pdf')).toBeTruthy('FailuerMsg: bwfPdf.pdf File is delete sucessfully');
            await activityTabPo.clickAndDownloadAttachmentFile('bwfPdf.pdf');
            expect(await utilityCommon.isFileDownloaded('bwfPdf.pdf')).toBeTruthy('FailuerMsg: bwfPdf.pdf File is not downloaded.');

            expect(await activityTabPo.isAttachedFileNameDisplayed('bwfXlsx.xlsx')).toBeTruthy('FailuerMsg: bwfXlsx.xlsx Attached Document is missing');
            expect(await utilityCommon.deleteAlreadyDownloadedFile('bwfXlsx.xlsx')).toBeTruthy('FailuerMsg: bwfXlsx.xlsx File is delete sucessfully');
            await activityTabPo.clickAndDownloadAttachmentFile('bwfXlsx.xlsx');
            expect(await utilityCommon.isFileDownloaded('bwfXlsx.xlsx')).toBeTruthy('FailuerMsg: bwfXlsx.xlsx File is not downloaded.');
        } catch (e) {
            throw e;
        } finally {
            await navigationPage.signOut();
            await loginPage.login('qkatawazi');
        }
    }, 810 * 1000);

    //kgaikwad
    it('[DRDMV-13449]: Edit Case - Case agent attaches published document from document library who has write access to that document', async () => {
        try {
            let publish: string[] = ['drdmv13449_publish_document1', 'drdmv13449_publish_document2', 'drdmv13449_publish_document5'];
            let files1: string[] = [filePath1, filePath2, filePath5];
            for (let i = 0; i < publish.length; i++) {

                let publishDocLibData1 = {
                    "docLibTitle": publish[i],
                    "company": "Petramco",
                    "Business Unit": "United States Support",
                    "ownerGroup": "US Support 3",
                }

                await apiHelper.apiLogin('tadmin');
                await apiHelper.deleteDocumentLibrary(publishDocLibData1.docLibTitle);
                await apiHelper.apiLogin('qkatawazi');
                let getFilePath1 = files1[i];
                let docLib = await apiHelper.createDocumentLibrary(publishDocLibData1, getFilePath1);
                await apiHelper.publishDocumentLibrary(docLib);
            }

            let publishDocLibData2 = {
                "docLibTitle": "drdmv13449_publish_document3",
                "company": "Petramco",
                "Business Unit": "Facilities Support",
                "ownerGroup": "Facilities",
            }
            await apiHelper.apiLogin('tadmin');
            await apiHelper.deleteDocumentLibrary(publishDocLibData2.docLibTitle);
            await apiHelper.apiLogin('qkatawazi');
            let docLib3 = await apiHelper.createDocumentLibrary(publishDocLibData2, filePath3);
            await apiHelper.publishDocumentLibrary(docLib3);

            let draftDocLibData = {
                "docLibTitle": "drdmv13449_draft_document",
                "company": "Petramco",
                "Business Unit": "United States Support",
                "ownerGroup": "US Support 3",
            }
            await apiHelper.apiLogin('tadmin');
            await apiHelper.deleteDocumentLibrary(draftDocLibData.docLibTitle);
            await apiHelper.apiLogin('qkatawazi');
            await apiHelper.createDocumentLibrary(draftDocLibData, filePath4);

            await navigationPage.signOut();
            await loginPage.login(loginId);
            await navigationPage.gotoCreateCase();
            await createCasePo.selectRequester('qtao');
            await createCasePo.setSummary(caseSummary);
            await createCasePo.clickSaveCaseButton();
            await previewCasePo.clickGoToCaseButton();
            await viewCasePo.clickEditCaseButton();
            await editCasePo.clickOnAttachLink();
            await attachDocumentBladePo.clickOnAdvanceSearchButton();

            await attachDocumentBladePo.searchRecord(publishDocLibData2.docLibTitle);
            expect(await attachDocumentBladePo.isDocumentLibaryPresent(publishDocLibData2.docLibTitle)).toBeFalsy('FailuerMsg: drdmv13449_publish_document3 doc is displayed');
            await attachDocumentBladePo.searchRecord(draftDocLibData.docLibTitle);
            expect(await attachDocumentBladePo.isDocumentLibaryPresent(draftDocLibData.docLibTitle)).toBeFalsy('FailuerMsg: draftDocLib4 doc is displayed');
            await attachDocumentBladePo.searchRecord(publish[0]);
            await attachDocumentBladePo.selectDocument();
            await attachDocumentBladePo.clickOnAttachButton();
            await editCasePo.clickSaveCase();

            expect(await viewCasePo.isAttachedDocumentPresent('bwfJpg.jpg')).toBeTruthy('FailuerMsg: bwfJpg.jpg Attached Document is missing');
            expect(await utilityCommon.deleteAlreadyDownloadedFile('bwfJpg.jpg')).toBeTruthy('FailuerMsg: bwfJpg.jpg File is delete sucessfully');
            await viewCasePo.clickOnAttachedDocumentFile('bwfJpg.jpg');
            expect(await utilityCommon.isFileDownloaded('bwfJpg.jpg')).toBeTruthy('FailuerMsg: bwfJpg.jpg File is not downloaded.');
            await viewCasePo.clickEditCaseButton();
            await editCasePo.clickOnAttachLink();
            await attachDocumentBladePo.searchAndAttachDocument(publish[1]);
            await editCasePo.clickOnAttachLink();
            await attachDocumentBladePo.searchAndAttachDocument(publish[2]);
            await editCasePo.clickSaveCase();

            expect(await viewCasePo.isAttachedDocumentPresent('bwfPdf.pdf')).toBeTruthy('FailuerMsg: bwfPdf.pdf Attached Document is missing');
            expect(await utilityCommon.deleteAlreadyDownloadedFile('bwfPdf.pdf')).toBeTruthy('FailuerMsg: bwfPdf.pdf File is delete sucessfully');
            await viewCasePo.clickOnAttachedDocumentFile('bwfPdf.pdf');
            expect(await utilityCommon.isFileDownloaded('bwfPdf.pdf')).toBeTruthy('FailuerMsg: bwfPdf.pdf File is not downloaded.');
            await viewCasePo.clickShowMoreShowLessLink();
            expect(await viewCasePo.isAttachedDocumentPresent('bwfXlsx.xlsx')).toBeTruthy('FailuerMsg:bwfXlsx.xlsx Attached Document is missing');
            expect(await utilityCommon.deleteAlreadyDownloadedFile('bwfXlsx.xlsx')).toBeTruthy('FailuerMsg: bwfXlsx.xlsx File is delete sucessfully');
            await viewCasePo.clickOnAttachedDocumentFile('bwfXlsx.xlsx');
            expect(await utilityCommon.isFileDownloaded('bwfXlsx.xlsx')).toBeTruthy('FailuerMsg: bwfXlsx.xlsx File is not downloaded.');
        } catch (e) {
            throw e;
        } finally {
            await navigationPage.signOut();
            await loginPage.login('qkatawazi');
        }
    }, 800 * 1000);

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
                    businessUnit: 'United States Support',
                    ownerGroup: 'US Support 3',
                }
                await apiHelper.apiLogin('tadmin');
                await apiHelper.deleteDocumentLibrary(publishDocLibData1.docLibTitle);
                console.log(publishDocLibData1);
                await apiHelper.apiLogin('qkatawazi');
                let getFilePath1 = files1[i];
                let docLib = await apiHelper.createDocumentLibrary(publishDocLibData1, getFilePath1);
                // await apiHelper.apiLogin('qheroux');
                console.log('onead');
                await apiHelper.giveReadAccessToDocLib(docLib, "Compensation and Benefits");
                console.log('onead');
                await apiHelper.publishDocumentLibrary(docLib);
            }
            let publishDocLibData2 = {
                docLibTitle: 'drdmv13480_publish_document3',
                company: 'Petramco',
                businessUnit: 'United States Support',
                ownerGroup: 'US Support 3',
            }
            await apiHelper.apiLogin('tadmin');
            await apiHelper.deleteDocumentLibrary(publishDocLibData2.docLibTitle);
            await apiHelper.apiLogin('qkatawazi');
            let docLib3 = await apiHelper.createDocumentLibrary(publishDocLibData2, filePath3);
            await apiHelper.publishDocumentLibrary(docLib3);
            let draftDocLibData = {
                docLibTitle: 'drdmv13480_draft_document',
                company: 'Petramco',
                businessUnit: 'United States Support',
                ownerGroup: 'US Support 3',
            }
            await apiHelper.apiLogin('tadmin');
            await apiHelper.deleteDocumentLibrary(draftDocLibData.docLibTitle);
            await apiHelper.apiLogin('qkatawazi');
            await apiHelper.createDocumentLibrary(draftDocLibData, filePath4);

            await navigationPage.signOut();
            await loginPage.login(loginId);

            await navigationPage.gotoCreateCase();
            await createCasePo.selectRequester('qtao');
            await createCasePo.setSummary(caseSummary);
            await createCasePo.clickSaveCaseButton();
            await previewCasePo.clickGoToCaseButton();

            await activityTabPo.addActivityNote(addNoteText);
            await activityTabPo.clickOnAttachLink();
            await attachDocumentBladePo.clickOnAdvanceSearchButton();

            await attachDocumentBladePo.searchRecord(publishDocLibData2.docLibTitle);
            expect(await attachDocumentBladePo.isDocumentLibaryPresent(publishDocLibData2.docLibTitle)).toBeFalsy('FailuerMsg: drdmv13480_publish_document3 doc is displayed');
            await attachDocumentBladePo.searchRecord(draftDocLibData.docLibTitle);
            expect(await attachDocumentBladePo.isDocumentLibaryPresent(draftDocLibData.docLibTitle)).toBeFalsy('FailuerMsg: drdmv13480_draft_document doc is displayed');
            await attachDocumentBladePo.searchRecord(publish[0]);
            await attachDocumentBladePo.selectDocument();
            await attachDocumentBladePo.clickOnAttachButton();
            await activityTabPo.clickOnPostButton();
            // await utilityCommon.waitUntilSpinnerToHide();
            expect(await activityTabPo.isAttachedFileNameDisplayed('bwfJpg.jpg')).toBeTruthy('FailuerMsg: bwfJpg.jpg Attached Document is missing');
            expect(await utilityCommon.deleteAlreadyDownloadedFile('bwfJpg.jpg')).toBeTruthy('FailuerMsg: bwfJpg.jpg File is delete sucessfully');
            await activityTabPo.clickAndDownloadAttachmentFile('bwfJpg.jpg');
            expect(await utilityCommon.isFileDownloaded('bwfJpg.jpg')).toBeTruthy('FailuerMsg: bwfJpg.jpg File is not downloaded.');

            await activityTabPo.addActivityNote(addNoteText);
            await activityTabPo.clickOnAttachLink();
            await attachDocumentBladePo.searchAndAttachDocument(publish[1]);
            await activityTabPo.clickOnAttachLink();
            await attachDocumentBladePo.searchAndAttachDocument(publish[2]);
            await activityTabPo.clickOnPostButton();
            // await utilityCommon.waitUntilSpinnerToHide();
            expect(await activityTabPo.isAttachedFileNameDisplayed('bwfPdf.pdf')).toBeTruthy('FailuerMsg: bwfPdf.pdf Attached Document is missing');
            expect(await utilityCommon.deleteAlreadyDownloadedFile('bwfPdf.pdf')).toBeTruthy('FailuerMsg: bwfPdf.pdf File is delete sucessfully');
            await activityTabPo.clickAndDownloadAttachmentFile('bwfPdf.pdf');
            expect(await utilityCommon.isFileDownloaded('bwfPdf.pdf')).toBeTruthy('FailuerMsg: bwfPdf.pdf File is not downloaded.');

            expect(await activityTabPo.isAttachedFileNameDisplayed('bwfXlsx.xlsx')).toBeTruthy('FailuerMsg:bwfXlsx.xlsx Attached Document is missing');
            expect(await utilityCommon.deleteAlreadyDownloadedFile('bwfXlsx.xlsx')).toBeTruthy('FailuerMsg: bwfXlsx.xlsx File is delete sucessfully');
            await activityTabPo.clickAndDownloadAttachmentFile('bwfXlsx.xlsx');
            expect(await utilityCommon.isFileDownloaded('bwfXlsx.xlsx')).toBeTruthy('FailuerMsg: bwfXlsx.xlsx File is not downloaded.');
        } catch (e) {
            throw e;
        } finally {
            await navigationPage.signOut();
            await loginPage.login('qkatawazi');
        }
    }, 900 * 1000);

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
                    businessUnit: 'Facilities Support',
                    ownerGroup: 'Facilities',
                }
                await apiHelper.apiLogin('tadmin');
                await apiHelper.deleteDocumentLibrary(publishDocLibData1.docLibTitle);
                await apiHelper.apiLogin('fritz');
                let getFilePath1 = files1[i];
                let docLib = await apiHelper.createDocumentLibrary(publishDocLibData1, getFilePath1);
                // await apiHelper.apiLogin('qheroux');
                await apiHelper.giveReadAccessToDocLib(docLib, "US Support 3");
                await apiHelper.publishDocumentLibrary(docLib);
            }

            let publishDocLibData2 = {
                docLibTitle: 'drdmv13479_publish_document3',
                company: 'Petramco',
                businessUnit: 'HR Support',
                ownerGroup: 'Staffing',
            }
            await apiHelper.apiLogin('tadmin');
            await apiHelper.deleteDocumentLibrary(publishDocLibData2.docLibTitle);
            await apiHelper.apiLogin('fritz');
            let docLib3 = await apiHelper.createDocumentLibrary(publishDocLibData2, filePath3);
            await apiHelper.publishDocumentLibrary(docLib3);

            let draftDocLibData = {
                docLibTitle: 'drdmv13479_draft_document',
                company: 'Petramco',
                businessUnit: 'HR Support',
                ownerGroup: 'Compensation and Benefits',
            }
            await apiHelper.apiLogin('tadmin');
            await apiHelper.deleteDocumentLibrary(draftDocLibData.docLibTitle);
            await apiHelper.apiLogin('fritz');
            await apiHelper.createDocumentLibrary(draftDocLibData, filePath4);

            await navigationPage.signOut();
            await loginPage.login('qkatawazi');

            await navigationPage.gotoCreateCase();
            await createCasePo.selectRequester('qtao');
            await createCasePo.setSummary(caseSummary);
            await createCasePo.clickSaveCaseButton();
            await previewCasePo.clickGoToCaseButton();

            await activityTabPo.addActivityNote(addNoteText);
            await activityTabPo.clickOnAttachLink();
            await attachDocumentBladePo.clickOnAdvanceSearchButton();

            await attachDocumentBladePo.searchRecord(publishDocLibData2.docLibTitle);
            expect(await attachDocumentBladePo.isDocumentLibaryPresent(publishDocLibData2.docLibTitle)).toBeFalsy('FailuerMsg: drdmv13479_publish_document3 doc is displayed');
            await attachDocumentBladePo.searchRecord(draftDocLibData.docLibTitle);
            expect(await attachDocumentBladePo.isDocumentLibaryPresent(draftDocLibData.docLibTitle)).toBeFalsy('FailuerMsg: draftDocLib4 doc is displayed');
            await attachDocumentBladePo.searchRecord(publish[0]);
            await attachDocumentBladePo.selectDocument();
            await attachDocumentBladePo.clickOnAttachButton();
            await activityTabPo.clickOnPostButton();
            // await utilityCommon.waitUntilSpinnerToHide();
            expect(await activityTabPo.isAttachedFileNameDisplayed('bwfJpg.jpg')).toBeTruthy('FailuerMsg: bwfJpg.jpg Attached Document is missing');
            expect(await utilityCommon.deleteAlreadyDownloadedFile('bwfJpg.jpg')).toBeTruthy('FailuerMsg: bwfJpg.jpg File is delete sucessfully');
            await activityTabPo.clickAndDownloadAttachmentFile('bwfJpg.jpg');
            expect(await utilityCommon.isFileDownloaded('bwfJpg.jpg')).toBeTruthy('FailuerMsg: bwfJpg.jpg File is not downloaded.');

            await activityTabPo.addActivityNote(addNoteText);
            await activityTabPo.clickOnAttachLink();
            await attachDocumentBladePo.searchAndAttachDocument(publish[1]);
            await activityTabPo.clickOnAttachLink();
            await attachDocumentBladePo.searchAndAttachDocument(publish[2]);
            await activityTabPo.clickOnPostButton();
            // await utilityCommon.waitUntilSpinnerToHide();
            expect(await activityTabPo.isAttachedFileNameDisplayed('bwfPdf.pdf')).toBeTruthy('FailuerMsg: bwfPdf.pdf Attached Document is missing');
            expect(await utilityCommon.deleteAlreadyDownloadedFile('bwfPdf.pdf')).toBeTruthy('FailuerMsg: bwfPdf.pdf File is delete sucessfully');
            await activityTabPo.clickAndDownloadAttachmentFile('bwfPdf.pdf');
            expect(await utilityCommon.isFileDownloaded('bwfPdf.pdf')).toBeTruthy('FailuerMsg: bwfPdf.pdf File is not downloaded.');

            expect(await activityTabPo.isAttachedFileNameDisplayed('bwfXlsx.xlsx')).toBeTruthy('FailuerMsg:bwfXlsx.xlsx Attached Document is missing');
            expect(await utilityCommon.deleteAlreadyDownloadedFile('bwfXlsx.xlsx')).toBeTruthy('FailuerMsg: bwfXlsx.xlsx File is delete sucessfully');
            await activityTabPo.clickAndDownloadAttachmentFile('bwfXlsx.xlsx');
            expect(await utilityCommon.isFileDownloaded('bwfXlsx.xlsx')).toBeTruthy('FailuerMsg: bwfXlsx.xlsx File is not downloaded.');
        } catch (e) {
            throw e;
        } finally {
            await navigationPage.signOut();
            await loginPage.login('qkatawazi');
        }
    }, 830 * 1000);

    //kgaikwad
    it('[DRDMV-13463]: Edit Case - Case business analyst attaches published document from document library who has write access to that document', async () => {
        try {
            let publish: string[] = ['drdmv13463_publish_document1', 'drdmv13463_publish_document2', 'drdmv13463_publish_document5'];
            let files1: string[] = [filePath1, filePath2, filePath5];
            for (let i = 0; i < publish.length; i++) {
                let publishDocLibData1 = {
                    docLibTitle: publish[i],
                    company: 'Petramco',
                    businessUnit: 'United States Support',
                    ownerGroup: 'US Support 3',
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
                businessUnit: 'HR Support',
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
                businessUnit: 'HR Support',
                ownerGroup: 'Staffing',
            }
            await apiHelper.apiLogin('tadmin');
            await apiHelper.deleteDocumentLibrary(draftDocLibData.docLibTitle);
            await apiHelper.apiLogin('elizabeth');
            await apiHelper.createDocumentLibrary(draftDocLibData, filePath4);

            await navigationPage.signOut();
            await loginPage.login('qkatawazi');

            await navigationPage.gotoCreateCase();
            await createCasePo.selectRequester('qtao');
            await createCasePo.setSummary(caseSummary);
            await createCasePo.clickSaveCaseButton();
            await previewCasePo.clickGoToCaseButton();
            await viewCasePo.clickEditCaseButton();
            await editCasePo.clickOnAttachLink();
            await attachDocumentBladePo.clickOnAdvanceSearchButton();

            await attachDocumentBladePo.searchRecord(publishDocLibData2.docLibTitle);
            expect(await attachDocumentBladePo.isDocumentLibaryPresent(publishDocLibData2.docLibTitle)).toBeFalsy('FailuerMsg: drdmv13463_publish_document3 doc is displayed');
            await attachDocumentBladePo.searchRecord(draftDocLibData.docLibTitle);
            expect(await attachDocumentBladePo.isDocumentLibaryPresent(draftDocLibData.docLibTitle)).toBeFalsy('FailuerMsg: drdmv13463_draft_document doc is displayed');
            await attachDocumentBladePo.searchRecord(publish[0]);
            await attachDocumentBladePo.selectDocument();
            await attachDocumentBladePo.clickOnAttachButton();
            await editCasePo.clickSaveCase();

            expect(await viewCasePo.isAttachedDocumentPresent('bwfJpg.jpg')).toBeTruthy('FailuerMsg: bwfJpg.jpg Attached Document is missing');
            expect(await utilityCommon.deleteAlreadyDownloadedFile('bwfJpg.jpg')).toBeTruthy('FailuerMsg: bwfJpg.jpg File is delete sucessfully');
            await viewCasePo.clickOnAttachedDocumentFile('bwfJpg.jpg');
            expect(await utilityCommon.isFileDownloaded('bwfJpg.jpg')).toBeTruthy('FailuerMsg: bwfJpg.jpg File is not downloaded.');
            await viewCasePo.clickEditCaseButton();
            await editCasePo.clickOnAttachLink();
            await attachDocumentBladePo.searchAndAttachDocument(publish[1]);
            await editCasePo.clickOnAttachLink();
            await attachDocumentBladePo.searchAndAttachDocument(publish[2]);
            await editCasePo.clickSaveCase();

            expect(await viewCasePo.isAttachedDocumentPresent('bwfPdf.pdf')).toBeTruthy('FailuerMsg: bwfPdf.pdf Attached Document is missing');
            expect(await utilityCommon.deleteAlreadyDownloadedFile('bwfPdf.pdf')).toBeTruthy('FailuerMsg: bwfPdf.pdf File is delete sucessfully');
            await viewCasePo.clickOnAttachedDocumentFile('bwfPdf.pdf');
            expect(await utilityCommon.isFileDownloaded('bwfPdf.pdf')).toBeTruthy('FailuerMsg: bwfPdf.pdf File is not downloaded.');
            await viewCasePo.clickShowMoreShowLessLink();
            expect(await viewCasePo.isAttachedDocumentPresent('bwfXlsx.xlsx')).toBeTruthy('FailuerMsg:bwfXlsx.xlsx Attached Document is missing');
            expect(await utilityCommon.deleteAlreadyDownloadedFile('bwfXlsx.xlsx')).toBeTruthy('FailuerMsg: bwfXlsx.xlsx File is delete sucessfully');
            await viewCasePo.clickOnAttachedDocumentFile('bwfXlsx.xlsx');
            expect(await utilityCommon.isFileDownloaded('bwfXlsx.xlsx')).toBeTruthy('FailuerMsg: bwfXlsx.xlsx File is not downloaded.');
        } catch (e) {
            throw e;
        } finally {
            await navigationPage.signOut();
            await loginPage.login('qkatawazi');
        }
    }, 860 * 1000);

    //kgaikwad
    it('[DRDMV-13506]: Compose Email - Case business analyst attaches published document from document library where case business analyst is author of the document', async () => {
        try {
            let publishDocLibData1 = {
                docLibTitle: 'drdmv13506_publish_document3',
                company: 'Petramco',
                businessUnit: 'HR Support',
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
                    businessUnit: 'HR Support',
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
                businessUnit: 'HR Support',
                ownerGroup: 'Compensation and Benefits',
                shareExternally: true
            }
            await apiHelper.apiLogin('tadmin');
            await apiHelper.deleteDocumentLibrary(draftDocLibData.docLibTitle);
            await apiHelper.apiLogin('qkatawazi');
            await apiHelper.createDocumentLibrary(draftDocLibData, filePath4);

            await navigationPage.signOut();
            await loginPage.login('qkatawazi');

            await navigationPage.gotoCreateCase();
            await createCasePo.selectRequester('qtao');
            await createCasePo.setSummary(caseSummary);
            await createCasePo.clickSaveCaseButton();
            await previewCasePo.clickGoToCaseButton();
            await viewCasePo.clickOnEmailLink();
            await composeMailPo.clickOnAttachmentLink();

            await attachDocumentBladePo.clickOnAdvanceSearchButton();
            await attachDocumentBladePo.searchRecord(publishDocLibData1.docLibTitle);
            expect(await attachDocumentBladePo.isDocumentLibaryPresent(publishDocLibData1.docLibTitle)).toBeFalsy('FailuerMsg: drdmv13506_publish_document3 doc is displayed');

            await attachDocumentBladePo.searchRecord(draftDocLibData.docLibTitle);
            expect(await attachDocumentBladePo.isDocumentLibaryPresent(draftDocLibData.docLibTitle)).toBeFalsy('FailuerMsg: drdmv13506_draft_document doc is displayed');

            await attachDocumentBladePo.searchRecord(publish[0]);
            await attachDocumentBladePo.selectDocument();
            await attachDocumentBladePo.clickOnAttachButton();
            await composeMailPo.setToOrCCInputTetxbox('To', 'fritz.schulz@petramco.com');
            await composeMailPo.clickOnSendButton();

            expect(await activityTabPo.isAttachedFileNameDisplayed('bwfJpg.jpg')).toBeTruthy('FailuerMsg: bwfJpg.jpg Attached Document is missing');
            expect(await utilityCommon.deleteAlreadyDownloadedFile('bwfJpg.jpg')).toBeTruthy('FailuerMsg: bwfJpg.jpg File is delete sucessfully');
            await activityTabPo.clickAndDownloadAttachmentFile('bwfJpg.jpg');
            expect(await utilityCommon.isFileDownloaded('bwfJpg.jpg')).toBeTruthy('FailuerMsg: bwfJpg.jpg File is not downloaded.');

            await viewCasePo.clickOnEmailLink();
            await composeMailPo.clickOnAttachmentLink();
            await attachDocumentBladePo.searchAndAttachDocument(publish[1]);
            await composeMailPo.clickOnAttachmentLink();
            await attachDocumentBladePo.searchAndAttachDocument(publish[2]);
            await composeMailPo.setToOrCCInputTetxbox('To', 'fritz.schulz@petramco.com');
            await composeMailPo.clickOnSendButton();

            expect(await activityTabPo.isAttachedFileNameDisplayed('bwfPdf.pdf')).toBeTruthy('FailuerMsg: bwfPdf.pdf Attached Document is missing');
            expect(await utilityCommon.deleteAlreadyDownloadedFile('bwfPdf.pdf')).toBeTruthy('FailuerMsg: bwfPdf.pdf File is delete sucessfully');
            await activityTabPo.clickAndDownloadAttachmentFile('bwfPdf.pdf');
            expect(await utilityCommon.isFileDownloaded('bwfPdf.pdf')).toBeTruthy('FailuerMsg: bwfPdf.pdf File is not downloaded.');

            expect(await activityTabPo.isAttachedFileNameDisplayed('bwfXlsx.xlsx')).toBeTruthy('FailuerMsg: bwfXlsx.xlsx Attached Document is missing');
            expect(await utilityCommon.deleteAlreadyDownloadedFile('bwfXlsx.xlsx')).toBeTruthy('FailuerMsg: bwfXlsx.xlsx File is delete sucessfully');
            await activityTabPo.clickAndDownloadAttachmentFile('bwfXlsx.xlsx');
            expect(await utilityCommon.isFileDownloaded('bwfXlsx.xlsx')).toBeTruthy('FailuerMsg: bwfXlsx.xlsx File is not downloaded.');
        } catch (e) {
            throw e;
        } finally {
            await navigationPage.signOut();
            await loginPage.login('qkatawazi');
        }
    }, 800 * 1000);

    //kgaikwad

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
                    businessUnit: 'HR Support',
                    ownerGroup: 'Compensation and Benefits',
                }
                await apiHelper.apiLogin('tadmin');
                await apiHelper.deleteDocumentLibrary(publishDocLibData1.docLibTitle);
                await apiHelper.apiLogin('elizabeth');
                let getFilePath1 = files1[i];
                let docLib = await apiHelper.createDocumentLibrary(publishDocLibData1, getFilePath1);
                await apiHelper.giveReadAccessToDocLib(docLib, "CA Support 1");
                await apiHelper.publishDocumentLibrary(docLib);
            }
            let publishDocLibData2 = {
                docLibTitle: 'drdmv13481_publish_document3',
                company: 'Petramco',
                businessUnit: 'HR Support',
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
                businessUnit: 'HR Support',
                ownerGroup: 'Compensation and Benefits',
            }
            await apiHelper.apiLogin('tadmin');
            await apiHelper.deleteDocumentLibrary(draftDocLibData.docLibTitle);
            await apiHelper.apiLogin('elizabeth');
            await apiHelper.createDocumentLibrary(draftDocLibData, filePath4);

            await navigationPage.signOut();
            await loginPage.login('qdu');

            await navigationPage.gotoCreateCase();
            await createCasePo.selectRequester('qtao');
            await createCasePo.setSummary(caseSummary);
            await createCasePo.clickSaveCaseButton();
            await previewCasePo.clickGoToCaseButton();

            await activityTabPo.addActivityNote(addNoteText);
            await activityTabPo.clickOnAttachLink();
            await attachDocumentBladePo.clickOnAdvanceSearchButton();

            await attachDocumentBladePo.searchRecord(publishDocLibData2.docLibTitle);
            expect(await attachDocumentBladePo.isDocumentLibaryPresent(publishDocLibData2.docLibTitle)).toBeFalsy('FailuerMsg: publishDocLib3 doc is displayed');
            await attachDocumentBladePo.searchRecord(draftDocLibData.docLibTitle);
            expect(await attachDocumentBladePo.isDocumentLibaryPresent(draftDocLibData.docLibTitle)).toBeFalsy('FailuerMsg: draftDocLib4 doc is displayed');
            await attachDocumentBladePo.searchRecord(publish[0]);
            await attachDocumentBladePo.selectDocument();
            await attachDocumentBladePo.clickOnAttachButton();
            await activityTabPo.clickOnPostButton();
            // await utilityCommon.waitUntilSpinnerToHide();
            expect(await activityTabPo.isAttachedFileNameDisplayed('bwfJpg.jpg')).toBeTruthy('FailuerMsg: bwfJpg.jpg Attached Document is missing');
            expect(await utilityCommon.deleteAlreadyDownloadedFile('bwfJpg.jpg')).toBeTruthy('FailuerMsg: bwfJpg.jpg File is delete sucessfully');
            await activityTabPo.clickAndDownloadAttachmentFile('bwfJpg.jpg');
            expect(await utilityCommon.isFileDownloaded('bwfJpg.jpg')).toBeTruthy('FailuerMsg: bwfJpg.jpg File is not downloaded.');

            await activityTabPo.addActivityNote(addNoteText);
            await activityTabPo.clickOnAttachLink();
            await attachDocumentBladePo.searchAndAttachDocument(publish[1]);
            await activityTabPo.clickOnAttachLink();
            await attachDocumentBladePo.searchAndAttachDocument(publish[2]);
            await activityTabPo.clickOnPostButton();
            // await utilityCommon.waitUntilSpinnerToHide();
            expect(await activityTabPo.isAttachedFileNameDisplayed('bwfPdf.pdf')).toBeTruthy('FailuerMsg: bwfPdf.pdf Attached Document is missing');
            expect(await utilityCommon.deleteAlreadyDownloadedFile('bwfPdf.pdf')).toBeTruthy('FailuerMsg: bwfPdf.pdf File is delete sucessfully');
            await activityTabPo.clickAndDownloadAttachmentFile('bwfPdf.pdf');
            expect(await utilityCommon.isFileDownloaded('bwfPdf.pdf')).toBeTruthy('FailuerMsg: bwfPdf.pdf File is not downloaded.');

            expect(await activityTabPo.isAttachedFileNameDisplayed('bwfXlsx.xlsx')).toBeTruthy('FailuerMsg:bwfXlsx.xlsx Attached Document is missing');
            expect(await utilityCommon.deleteAlreadyDownloadedFile('bwfXlsx.xlsx')).toBeTruthy('FailuerMsg: bwfXlsx.xlsx File is delete sucessfully');
            await activityTabPo.clickAndDownloadAttachmentFile('bwfXlsx.xlsx');
            expect(await utilityCommon.isFileDownloaded('bwfXlsx.xlsx')).toBeTruthy('FailuerMsg: bwfXlsx.xlsx File is not downloaded.');
        } catch (e) {
            throw e;
        } finally {
            await navigationPage.signOut();
            await loginPage.login('qkatawazi');
        }
    }, 800 * 1000);

    //kgaikwad
})