import { browser } from 'protractor';
import apiHelper from '../../api/api.helper';
import attachmentBladePo from '../../pageobject/attachment/attachment-blade.po';
import caseConsolePo from '../../pageobject/case/case-console.po';
import previewCasePo from '../../pageobject/case/case-preview.po';
import createCasePo from '../../pageobject/case/create-case.po';
import editCasePo from '../../pageobject/case/edit-case.po';
import selectCasetemplateBladePo from '../../pageobject/case/select-casetemplate-blade.po';
import viewCasePo from '../../pageobject/case/view-case.po';
import accessTabPo from '../../pageobject/common/access-tab.po';
import attachDocumentBladePo from '../../pageobject/common/attach-document-blade.po';
import loginPage from '../../pageobject/common/login.po';
import navigationPage from "../../pageobject/common/navigation.po";
import composeMailPo from '../../pageobject/email/compose-mail.po';
import documentLibraryConsolePo from '../../pageobject/settings/document-management/document-library-console.po';
import editDocumentLibraryPo from '../../pageobject/settings/document-management/edit-document-library.po';
import viewDocumentLibraryPo from '../../pageobject/settings/document-management/view-document-library.po';
import activityTabPo from '../../pageobject/social/activity-tab.po';
import editTaskPo from '../../pageobject/task/edit-task.po';
import viewTaskPo from '../../pageobject/task/view-task.po';
import { BWF_BASE_URL, BWF_PAGE_TITLES } from '../../utils/constants';
import utilityCommon from '../../utils/utility.common';

describe('Document Library Consume UI', () => {
    let filePath1 = 'e2e/data/ui/attachment/bwfJpg.jpg';
    let filePath2 = 'e2e/data/ui/attachment/bwfPdf.pdf';
    let filePath3 = 'e2e/data/ui/attachment/bwfJpg1.jpg';
    let filePath4 = 'e2e/data/ui/attachment/bwfJpg2.jpg';
    let filePath5 = 'e2e/data/ui/attachment/bwfXlsx.xlsx';

    beforeAll(async () => {
        await browser.get(BWF_BASE_URL);
        await loginPage.login('qkatawazi');
        // Create User and assigned Document Manager Permission to agent
    });

    afterAll(async () => {
        await utilityCommon.closeAllBlades();
        await navigationPage.signOut();
    });

    //kgaikwad
    describe('[4743]: Documents attached on case still accessible when someone deletes them from document library', async () => {
        let caseId, publishDocData, summary = [...Array(10)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        beforeAll(async () => {
            publishDocData = {
                docLibTitle: 'drdmv13539_document',
                company: 'Petramco',
                businessUnit: 'United States Support',
                ownerGroup: 'US Support 3',
            }
            let caseData =
            {
                "Requester": "qtao",
                "Summary": "Test case for 5515RandVal" + summary,
                "Assigned Company": "Petramco",
                "Business Unit": "United States Support",
                "Support Group": "US Support 3",
                "Assignee": "qkatawazi"
            }
            await apiHelper.apiLogin('tadmin');
            await apiHelper.deleteDocumentLibrary(publishDocData.docLibTitle);
            await apiHelper.apiLogin('qkatawazi');
            let docLib = await apiHelper.createDocumentLibrary(publishDocData, filePath1);
            await apiHelper.publishDocumentLibrary(docLib);
            await apiHelper.apiLogin('qkatawazi');
            let newCase = await apiHelper.createCase(caseData);
            caseId = newCase.displayId;
        });
        it('[4743]: Created a case and attach document on it', async () => {
            await navigationPage.gotoCaseConsole();
            await caseConsolePo.searchAndOpenCase(caseId);
            await viewCasePo.clickEditCaseButton();
            await editCasePo.clickOnAttachLink();
            await attachDocumentBladePo.searchAndAttachDocument(publishDocData.docLibTitle);
            await editCasePo.clickSaveCase();
        });
        it('[4743]: Validate above document is present', async () => {
            await viewCasePo.clickAttachmentsLink();
            expect(await utilityCommon.deleteAlreadyDownloadedFile('bwfJpg.jpg')).toBeTruthy('failureMsg: bwfJpg.jpg File is delete sucessfully');
            await attachmentBladePo.searchAndSelectCheckBox('bwfJpg');
            await attachmentBladePo.clickDownloadButton();
            expect(await utilityCommon.isFileDownloaded('bwfJpg.jpg')).toBeTruthy('bwfJpg.jpg File is not downloaded.');
            expect(await utilityCommon.deleteAlreadyDownloadedFile('bwfJpg.jpg')).toBeTruthy('failureMsg: bwfJpg.jpg File is delete sucessfully');
            await attachmentBladePo.clickCloseButton();
        });
        it('[4743]: Change the document staus as draft', async () => {
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Document Management--Library', BWF_PAGE_TITLES.DOCUMENT_MANAGEMENT.LIBRARY);
            await documentLibraryConsolePo.searchAndOpenDocumentLibrary(publishDocData.docLibTitle);
            await viewDocumentLibraryPo.clickOnEditDocument();
            await editDocumentLibraryPo.selectStatus('Draft');
            await editDocumentLibraryPo.clickOnSaveButton();
            await editDocumentLibraryPo.clickOnCancelButton();
            await apiHelper.apiLogin('tadmin');
            await apiHelper.deleteDocumentLibrary(publishDocData.docLibTitle);
        });
        it('[4743]: Download the uploaded document', async () => {
            await navigationPage.gotoCaseConsole();
            await caseConsolePo.searchAndOpenCase(caseId);
            await viewCasePo.clickAttachmentsLink();
            expect(await utilityCommon.deleteAlreadyDownloadedFile('bwfJpg.jpg')).toBeTruthy('failureMsg: Fail to delete bwfJpg.jpg file');
            await attachmentBladePo.searchAndSelectCheckBox('bwfJpg');
            await attachmentBladePo.clickDownloadButton();
            expect(await utilityCommon.isFileDownloaded('bwfJpg.jpg')).toBeTruthy('failureMsg: bwfJpg.jpg File is not downloaded.');
            await attachmentBladePo.clickCloseButton();
        });
        afterAll(async () => {
            await utilityCommon.closeAllBlades();
        });
    });

    //kgaikwad
    // Done
    describe('[4748]: Access to the documents attached on case when agent has read access to the case', async () => {
        let caseId, publishDocLibData1, publishDocLibData2, caseData, summary = [...Array(10)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        beforeAll(async () => {
            publishDocLibData1 = {
                "docLibTitle": "drdmv13533_publish_document1",
                "company": "Petramco",
                "Business Unit": "United States Support",
                "ownerGroup": "US Support 3",
            }
            publishDocLibData2 = {
                "docLibTitle": "drdmv13533_publish_document2",
                "company": "Petramco",
                "Business Unit": "United States Support",
                "ownerGroup": "US Support 3",
            }
            caseData =
                {
                    "Requester": "qtao",
                    "Summary": "Test case for 5515RandVal" + summary,
                    "Assigned Company": "Petramco",
                    "Business Unit": "United States Support",
                    "Support Group": "US Support 3",
                    "Assignee": "qkatawazi"
                }
            await apiHelper.apiLogin('qkatawazi');
            let newCase = await apiHelper.createCase(caseData);
            await apiHelper.apiLogin('tadmin');
            await apiHelper.deleteDocumentLibrary('drdmv13533_publish_document1');
            await apiHelper.apiLogin('qkatawazi');
            let docLib = await apiHelper.createDocumentLibrary(publishDocLibData1, filePath1);
            await apiHelper.giveReadAccessToDocLib(docLib, "GB Support 2");
            await apiHelper.publishDocumentLibrary(docLib);
            await apiHelper.apiLogin('tadmin');
            await apiHelper.deleteDocumentLibrary("drdmv13533_publish_document2");
            await apiHelper.apiLogin('qkatawazi');
            let docLib2 = await apiHelper.createDocumentLibrary(publishDocLibData2, filePath2);
            await apiHelper.publishDocumentLibrary(docLib2);
            caseId = newCase.displayId;
        });
        it('[4748]: Open the case and attach the document', async () => {
            await navigationPage.gotoCaseConsole();
            await caseConsolePo.searchAndOpenCase(caseId);
            await viewCasePo.clickEditCaseButton();
            await editCasePo.clickOnAttachLink();
            await attachDocumentBladePo.searchAndAttachDocument(publishDocLibData1.docLibTitle);
            await editCasePo.clickOnAttachLink();
            await attachDocumentBladePo.searchAndAttachDocument(publishDocLibData2.docLibTitle);
            await editCasePo.clickSaveCase();
            await viewCasePo.clickOnTab('Case Access');
            await accessTabPo.clickToExpandAccessEntitiySearch('Agent Access', 'Case');
            await accessTabPo.selectAgent('qstrong', 'Agent');
            await accessTabPo.clickAccessEntitiyAddButton('Agent');
            expect(await accessTabPo.isAccessTypeOfEntityDisplayed('Quin Strong', 'Read')).toBeTruthy('FailuerMsg1: Quanah George Agent Name is missing');
            await navigationPage.gotoCaseConsole();
        });
        it('[4748]: Verify the case with different user', async () => {
            await navigationPage.signOut();
            await loginPage.login('qstrong');
            await caseConsolePo.searchAndOpenCase(caseId);
            expect(await viewCasePo.getCaseID()).toBe(caseId, 'Case Id is missing');
            expect(await viewCasePo.isAttachedDocumentPresent(' bwfJpg.jpg')).toBeTruthy('FailuerMsg2: Attached Document is missing');
            expect(await viewCasePo.isAttachedDocumentPresent(' bwfPdf.pdf')).toBeTruthy('FailuerMsg3: Attached Document is displyaed');
            expect(await utilityCommon.deleteAlreadyDownloadedFile('bwfJpg.jpg')).toBeTruthy('FailuerMsg4: File is delete sucessfully');
            await viewCasePo.clickOnAttachedDocumentFile('bwfJpg.jpg');
            expect(await utilityCommon.isFileDownloaded('bwfJpg.jpg')).toBeTruthy('FailuerMsg5: File is not downloaded.');
        });
        afterAll(async () => {
            await utilityCommon.closeAllBlades();
            await navigationPage.signOut();
            await loginPage.login('qkatawazi');
        });
    });

    //kgaikwad
    describe('[4753]: Edit Task - Case agent attaches published document from document library where case agent is author of the document', async () => {
        let publishDocLibData, caseTemplateData, taskTemplateDataSet, draftDocLibData, randomStr = [...Array(5)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        let publish: string[] = ['drdmv13524_publish_document1', 'drdmv13524_publish_document2', 'drdmv13524_publish_document5'];
        beforeAll(async () => {
            publishDocLibData = {
                "docLibTitle": "drdmv13524_publish_document3",
                "company": "Petramco",
                "Business Unit": "United States Support",
                "ownerGroup": "US Support 3",
            }

            caseTemplateData = {
                "templateName": 'caseTemplateName' + randomStr,
                "templateSummary": 'CaseSummaryName' + randomStr,
                "templateStatus": "Active",
                "company": "Petramco",
                "resolveCaseonLastTaskCompletion": "1",
                "assignee": "qgeorge",
                "businessUnit": "United States Support",//New
                "supportGroup": "US Support 2"
            }

            taskTemplateDataSet = {
                "templateName": 'taskTemplateWithYesResolve' + randomStr,
                "templateSummary": 'taskSummaryYesResolved' + randomStr,
                "templateStatus": "Active",
                "taskCompany": 'Petramco',
                "assignee": "qgeorge",
                "businessUnit": "United States Support",
                "supportGroup": "US Support 2",
                "ownerCompany": "Petramco",
                "ownerBusinessUnit": "United States Support",
                "ownerGroup": "US Support 2"
            }

            await apiHelper.apiLogin('tadmin');
            await apiHelper.deleteDocumentLibrary(publishDocLibData.docLibTitle);
            await apiHelper.apiLogin('qkatawazi');
            let docLib3 = await apiHelper.createDocumentLibrary(publishDocLibData, filePath1);
            await apiHelper.publishDocumentLibrary(docLib3);

            await apiHelper.apiLogin('qkatawazi');
            let newCaseTemplate = await apiHelper.createCaseTemplate(caseTemplateData);
            let manualTaskTemplate = await apiHelper.createManualTaskTemplate(taskTemplateDataSet);
            await apiHelper.associateCaseTemplateWithOneTaskTemplate(newCaseTemplate.displayId, manualTaskTemplate.displayId);

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
                await apiHelper.apiLogin("qgeorge" );
                let getFilePath1 = files1[i];
                let docLib = await apiHelper.createDocumentLibrary(publishDocLibData1, getFilePath1);
                await apiHelper.publishDocumentLibrary(docLib);
            }
            draftDocLibData = {
                "docLibTitle": "drdmv13524_draft_document",
                "company": "Petramco",
                "Business Unit": "United States Support",
                "ownerGroup": "US Support 3",
            }
            await apiHelper.apiLogin('tadmin');
            await apiHelper.deleteDocumentLibrary(draftDocLibData.docLibTitle);
            await apiHelper.apiLogin("qgeorge");
            await apiHelper.createDocumentLibrary(draftDocLibData, filePath4);
        });
        it('[4753]: Create a case and click task link ', async () => {
            await navigationPage.signOut();
            await loginPage.login("qgeorge" );
            await navigationPage.gotoCreateCase();
            await createCasePo.selectRequester('qtao');
            await createCasePo.setSummary(randomStr);
            await createCasePo.clickSelectCaseTemplateButton();
            await selectCasetemplateBladePo.selectCaseTemplate(caseTemplateData.templateName);
            await createCasePo.clickAssignToMeButton();
            await createCasePo.clickSaveCaseButton();
            await previewCasePo.clickGoToCaseButton();
            await viewCasePo.clickOnTaskLink(taskTemplateDataSet.templateSummary);
            await viewTaskPo.clickOnEditTask();
            await editTaskPo.clickOnAttachButton();
            await attachDocumentBladePo.clickOnAdvanceSearchButton();
            await attachDocumentBladePo.searchRecord(publishDocLibData.docLibTitle);
            expect(await attachDocumentBladePo.isDocumentLibaryPresent(publishDocLibData.docLibTitle)).toBeFalsy('FailuerMsg: drdmv13524_publish_document3 doc is displayed');
        });
        it('[4753]: Add document from document', async () => {
            await attachDocumentBladePo.searchRecord('drdmv13524_publish_document3');
            expect(await attachDocumentBladePo.isDocumentLibaryPresent('drdmv13524_publish_document3')).toBeFalsy('FailuerMsg: drdmv13524_publish_document3 doc is displayed');
            await attachDocumentBladePo.searchRecord(draftDocLibData.docLibTitle);
            expect(await attachDocumentBladePo.isDocumentLibaryPresent(draftDocLibData.docLibTitle)).toBeFalsy('FailuerMsg: drdmv13524_draft_document doc is displayed');
            await attachDocumentBladePo.searchRecord(publish[0]);
            await attachDocumentBladePo.selectDocument(publish[0]);
            await attachDocumentBladePo.clickOnAttachButton();
            await editTaskPo.clickOnSaveButton();
            await utilityCommon.closePopUpMessage();
            expect(await viewTaskPo.isAttachedDocumentPresent('bwfJpg.jpg')).toBeTruthy('FailuerMsg: bwfJpg.jpg Attached Document is missing');
            expect(await utilityCommon.deleteAlreadyDownloadedFile('bwfJpg.jpg')).toBeTruthy('FailuerMsg: bwfJpg.jpg File is delete sucessfully');
            await viewTaskPo.clickOnAttachedDocumentFile('bwfJpg.jpg');
            expect(await utilityCommon.isFileDownloaded('bwfJpg.jpg')).toBeTruthy('FailuerMsg: bwfJpg.jpg File is not downloaded.');
        });
        it('[4753]: Verify the attachment document', async () => {
            await viewTaskPo.clickOnEditTask();
            await editTaskPo.clickOnAttachButton();
            await attachDocumentBladePo.searchAndAttachDocument(publish[1]);
            await editTaskPo.clickOnAttachButton();
            await attachDocumentBladePo.searchAndAttachDocument(publish[2]);
            await editTaskPo.clickOnSaveButton();
            await utilityCommon.closePopUpMessage();
            expect(await viewTaskPo.isAttachedDocumentPresent('bwfPdf.pdf')).toBeTruthy('FailuerMsg: bwfPdf.pdf Attached Document is missing');
            expect(await utilityCommon.deleteAlreadyDownloadedFile('bwfPdf.pdf')).toBeTruthy('FailuerMsg: bwfPdf.pdf File is delete sucessfully');
            await viewTaskPo.clickOnAttachedDocumentFile('bwfPdf.pdf');
            expect(await utilityCommon.isFileDownloaded('bwfPdf.pdf')).toBeTruthy('FailuerMsg: bwfPdf.pdf File is not downloaded.');
        });
        it('[4753]: Verify the attachment document', async () => {
            await viewTaskPo.clickShowMoreShowLessLink();
            expect(await viewTaskPo.isAttachedDocumentPresent('bwfXlsx.xlsx')).toBeTruthy('FailuerMsg:bwfXlsx.xlsx Attached Document is missing');
            expect(await utilityCommon.deleteAlreadyDownloadedFile('bwfXlsx.xlsx')).toBeTruthy('FailuerMsg: bwfXlsx.xlsx File is delete sucessfully');
            await viewTaskPo.clickOnAttachedDocumentFile('bwfXlsx.xlsx');
            expect(await utilityCommon.isFileDownloaded('bwfXlsx.xlsx')).toBeTruthy('FailuerMsg: bwfXlsx.xlsx File is not downloaded.');
        });
        afterAll(async () => {
            await utilityCommon.closeAllBlades();
        });
    });

    //kgaikwad
    describe('[4770]: Compose Email - Case agent attaches published document from document library where case agent is author of the document', async () => {
        let publish: string[] = ['drdmv13507_publish_document1', 'drdmv13507_publish_document2', 'drdmv13507_publish_document5'];
        let publishDocLibData, draftDocLibData, randomStr = [...Array(5)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        beforeAll(async () => {
            publishDocLibData = {
                "docLibTitle": "drdmv13524_publish_document3",
                "company": "Petramco",
                "Business Unit": "United States Support",
                "ownerGroup": "US Support 3",
            }
            await apiHelper.apiLogin('tadmin');
            await apiHelper.deleteDocumentLibrary(publishDocLibData.docLibTitle);
            await apiHelper.apiLogin('qkatawazi');
            let docLib3 = await apiHelper.createDocumentLibrary(publishDocLibData, filePath3);
            await apiHelper.publishDocumentLibrary(docLib3);
            let files1: string[] = [filePath1, filePath2, filePath5];
            for (let i = 0; i < publish.length; i++) {
                let publishDocLibData1 = {
                    "docLibTitle": publish[i],
                    "company": "Petramco",
                    "Business Unit": "United States Support",
                    "ownerGroup": "US Support 3",
                    "shareExternally": true,
                }
                await apiHelper.apiLogin('tadmin');
                await apiHelper.deleteDocumentLibrary(publishDocLibData1.docLibTitle);
                await apiHelper.apiLogin("qgeorge" );
                let getFilePath1 = files1[i];
                let docLib = await apiHelper.createDocumentLibrary(publishDocLibData1, getFilePath1);
                await apiHelper.publishDocumentLibrary(docLib);
            }
            draftDocLibData = {
                docLibTitle: 'drdmv13507_draft_document',
                "company": "Petramco",
                "Business Unit": "United States Support",
                "ownerGroup": "US Support 3",
                "shareExternally": true,
            }
            await apiHelper.apiLogin('tadmin');
            await apiHelper.deleteDocumentLibrary(draftDocLibData.docLibTitle);
            await apiHelper.createEmailBox('outgoing');
            await apiHelper.apiLogin("qgeorge" );
            await apiHelper.createDocumentLibrary(draftDocLibData, filePath4);
        });
        it('[4770]: Create a case and add click on email', async () => {
            await navigationPage.signOut();
            await loginPage.login("qgeorge" );
            await navigationPage.gotoCreateCase();
            await createCasePo.selectRequester('qtao');
            await createCasePo.setSummary(randomStr);
            await createCasePo.clickSaveCaseButton();
            await previewCasePo.clickGoToCaseButton();
            await viewCasePo.clickOnEmailLink();
            await composeMailPo.clickOnAttachmentLink();
        });
        it('[4770]: Attach the document', async () => {
            await attachDocumentBladePo.clickOnAdvanceSearchButton();
            await attachDocumentBladePo.searchRecord(publishDocLibData.docLibTitle);
            expect(await attachDocumentBladePo.isDocumentLibaryPresent(publishDocLibData.docLibTitle)).toBeFalsy('FailuerMsg: drdmv13507_publish_document1 doc is displayed');
            await attachDocumentBladePo.searchRecord(draftDocLibData.docLibTitle);
            expect(await attachDocumentBladePo.isDocumentLibaryPresent(draftDocLibData.docLibTitle)).toBeFalsy('FailuerMsg: publishDocLib3 doc is displayed');
        });
        it('[4770]: Search the document', async () => {
            await attachDocumentBladePo.searchRecord(publish[0]);
            await attachDocumentBladePo.selectDocument(publish[0]);
            await attachDocumentBladePo.clickOnAttachButton();
            await composeMailPo.setToOrCCInputTextbox('To', 'fritz.schulz@petramco.com');
            await composeMailPo.clickOnSendButton();
            expect(await activityTabPo.isAttachedFileNameDisplayed('bwfJpg.jpg')).toBeTruthy('FailuerMsg: bwfJpg.jpg Attached Document is missing');
            expect(await utilityCommon.deleteAlreadyDownloadedFile('bwfJpg.jpg')).toBeTruthy('FailuerMsg: bwfJpg.jpg File is delete sucessfully');
            await activityTabPo.clickAndDownloadAttachmentFile('bwfJpg.jpg');
            expect(await utilityCommon.isFileDownloaded('bwfJpg.jpg')).toBeTruthy('FailuerMsg: bwfJpg.jpg File is not downloaded.');
        });
        it('[4770]: Send the document', async () => {
            await viewCasePo.clickOnEmailLink();
            await composeMailPo.clickOnAttachmentLink();
            await attachDocumentBladePo.searchAndAttachDocument(publish[1]);
            await composeMailPo.clickOnAttachmentLink();
            await attachDocumentBladePo.searchAndAttachDocument(publish[2]);
            await composeMailPo.setToOrCCInputTextbox('To', 'fritz.schulz@petramco.com');
            await composeMailPo.clickOnSendButton();
        });
        it('[4770]: Create a case and add task on it', async () => {
            expect(await activityTabPo.isAttachedFileNameDisplayed('bwfPdf.pdf')).toBeTruthy('FailuerMsg: bwfPdf.pdf Attached Document is missing');
            expect(await utilityCommon.deleteAlreadyDownloadedFile('bwfPdf.pdf')).toBeTruthy('FailuerMsg: bwfPdf.pdf File is delete sucessfully');
            await activityTabPo.clickAndDownloadAttachmentFile('bwfPdf.pdf');
            expect(await utilityCommon.isFileDownloaded('bwfPdf.pdf')).toBeTruthy('FailuerMsg: bwfPdf.pdf File is not downloaded.');
            expect(await activityTabPo.isAttachedFileNameDisplayed('bwfXlsx.xlsx')).toBeTruthy('FailuerMsg: bwfXlsx.xlsx Attached Document is missing');
            expect(await utilityCommon.deleteAlreadyDownloadedFile('bwfXlsx.xlsx')).toBeTruthy('FailuerMsg: bwfXlsx.xlsx File is delete sucessfully');
            await activityTabPo.clickAndDownloadAttachmentFile('bwfXlsx.xlsx');
            expect(await utilityCommon.isFileDownloaded('bwfXlsx.xlsx')).toBeTruthy('FailuerMsg: bwfXlsx.xlsx File is not downloaded.');
        });
        afterAll(async () => {
            await composeMailPo.clickOnDiscardButton();
            await utilityCommon.closeAllBlades();
            await navigationPage.signOut();
            await loginPage.login('qkatawazi');
        });
    });

    describe('[4771]: Compose Email - Case business analyst attaches published document from document library where case business analyst is author of the document', async () => {
        let publishDocLibData1, draftDocLibData, randomStr = [...Array(10)].map(i => (~~(Math.random() * 36)).toString(36)).join('');;
        let publish: string[] = ['drdmv13506_publish_document1', 'drdmv13506_publish_document2', 'drdmv13506_publish_document5'];
        beforeAll(async () => {
            publishDocLibData1 = {
                docLibTitle: 'drdmv13506_publish_document3',
                company: 'Petramco',
                businessUnit: 'HR Support',
                ownerGroup: 'Staffing',
            }
            draftDocLibData = {
                docLibTitle: 'drdmv13506_draft_document',
                company: 'Petramco',
                businessUnit: 'HR Support',
                ownerGroup: 'Compensation and Benefits',
                shareExternally: true
            }
            await apiHelper.apiLogin('tadmin');
            await apiHelper.deleteDocumentLibrary(publishDocLibData1.docLibTitle);
            await apiHelper.apiLogin('elizabeth');
            let docLib3 = await apiHelper.createDocumentLibrary(publishDocLibData1, filePath3);
            await apiHelper.publishDocumentLibrary(docLib3);
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
            await apiHelper.apiLogin('tadmin');
            await apiHelper.deleteDocumentLibrary(draftDocLibData.docLibTitle);
            await apiHelper.createEmailBox('outgoing');
            await apiHelper.apiLogin('qkatawazi');
            await apiHelper.createDocumentLibrary(draftDocLibData, filePath4);
        });
        it('[4771]: Create a case ', async () => {
            await navigationPage.signOut();
            await loginPage.login('qkatawazi');
            await navigationPage.gotoCreateCase();
            await createCasePo.selectRequester('qtao');
            await createCasePo.setSummary(randomStr);
            await createCasePo.clickSaveCaseButton();
            await previewCasePo.clickGoToCaseButton();
            await viewCasePo.clickOnEmailLink();
            await composeMailPo.clickOnAttachmentLink();

        });
        it('[4771]: Add the attachment', async () => {
            await attachDocumentBladePo.clickOnAdvanceSearchButton();
            await attachDocumentBladePo.searchRecord(publishDocLibData1.docLibTitle);
            expect(await attachDocumentBladePo.isDocumentLibaryPresent(publishDocLibData1.docLibTitle)).toBeFalsy('FailuerMsg: drdmv13506_publish_document3 doc is displayed');
            await attachDocumentBladePo.searchRecord(draftDocLibData.docLibTitle);
            expect(await attachDocumentBladePo.isDocumentLibaryPresent(draftDocLibData.docLibTitle)).toBeFalsy('FailuerMsg: drdmv13506_draft_document doc is displayed');
            await attachDocumentBladePo.searchRecord(publish[0]);
            await attachDocumentBladePo.selectDocument(publish[0]);
            await attachDocumentBladePo.clickOnAttachButton();
            await composeMailPo.setToOrCCInputTextbox('To', 'fritz.schulz@petramco.com');
            await composeMailPo.clickOnSendButton();
        });
        it('[4771]: Verify the document', async () => {
            expect(await activityTabPo.isAttachedFileNameDisplayed('bwfJpg.jpg')).toBeTruthy('FailuerMsg: bwfJpg.jpg Attached Document is missing');
            expect(await utilityCommon.deleteAlreadyDownloadedFile('bwfJpg.jpg')).toBeTruthy('FailuerMsg: bwfJpg.jpg File is delete sucessfully');
            await activityTabPo.clickAndDownloadAttachmentFile('bwfJpg.jpg');
            expect(await utilityCommon.isFileDownloaded('bwfJpg.jpg')).toBeTruthy('FailuerMsg: bwfJpg.jpg File is not downloaded.');
            await viewCasePo.clickOnEmailLink();
            await composeMailPo.clickOnAttachmentLink();
            await attachDocumentBladePo.searchAndAttachDocument(publish[1]);
            await composeMailPo.clickOnAttachmentLink();
            await attachDocumentBladePo.searchAndAttachDocument(publish[2]);
            await composeMailPo.setToOrCCInputTextbox('To', 'fritz.schulz@petramco.com');
            await composeMailPo.clickOnSendButton();
        });
        it('[4771]: validate document present in activity', async () => {
            expect(await activityTabPo.isAttachedFileNameDisplayed('bwfPdf.pdf')).toBeTruthy('FailuerMsg: bwfPdf.pdf Attached Document is missing');
            expect(await utilityCommon.deleteAlreadyDownloadedFile('bwfPdf.pdf')).toBeTruthy('FailuerMsg: bwfPdf.pdf File is delete sucessfully');
            await activityTabPo.clickAndDownloadAttachmentFile('bwfPdf.pdf');
            expect(await utilityCommon.isFileDownloaded('bwfPdf.pdf')).toBeTruthy('FailuerMsg: bwfPdf.pdf File is not downloaded.');
            expect(await activityTabPo.isAttachedFileNameDisplayed('bwfXlsx.xlsx')).toBeTruthy('FailuerMsg: bwfXlsx.xlsx Attached Document is missing');
            expect(await utilityCommon.deleteAlreadyDownloadedFile('bwfXlsx.xlsx')).toBeTruthy('FailuerMsg: bwfXlsx.xlsx File is delete sucessfully');
            await activityTabPo.clickAndDownloadAttachmentFile('bwfXlsx.xlsx');
            expect(await utilityCommon.isFileDownloaded('bwfXlsx.xlsx')).toBeTruthy('FailuerMsg: bwfXlsx.xlsx File is not downloaded.');
        });
        afterAll(async () => {
            await composeMailPo.clickOnDiscardButton();
            await utilityCommon.closeAllBlades();
            await navigationPage.signOut();
            await loginPage.login('qkatawazi');
        });
    });

    //kgaikwad
    describe('[4800]: Edit Case - Case agent attaches published document from document library who has write access to that document', async () => {
        let publish: string[] = ['drdmv13449_publish_document1', 'drdmv13449_publish_document2', 'drdmv13449_publish_document5'];
        let files1: string[] = [filePath1, filePath2, filePath5];
        let publishDocLibData2, draftDocLibData, randomStr = [...Array(5)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        beforeAll(async () => {
            publishDocLibData2 = {
                "docLibTitle": "drdmv13449_publish_document3",
                "company": "Petramco",
                "Business Unit": "United States Support",
                "ownerGroup": "US Support 3",
            }
            draftDocLibData = {
                "docLibTitle": "drdmv13449_draft_document",
                "company": "Petramco",
                "Business Unit": "United States Support",
                "ownerGroup": "US Support 3",
            }
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
            await apiHelper.apiLogin('tadmin');
            await apiHelper.deleteDocumentLibrary(publishDocLibData2.docLibTitle);
            await apiHelper.apiLogin('qkatawazi');
            let docLib3 = await apiHelper.createDocumentLibrary(publishDocLibData2, filePath3);
            await apiHelper.publishDocumentLibrary(docLib3);

            await apiHelper.apiLogin('tadmin');
            await apiHelper.deleteDocumentLibrary(draftDocLibData.docLibTitle);
            await apiHelper.apiLogin('qkatawazi');
            await apiHelper.createDocumentLibrary(draftDocLibData, filePath4);
        });
        it('[4800]: Create a case and add task on it', async () => {
            await navigationPage.signOut();
            await loginPage.login("qgeorge" );
            await navigationPage.gotoCreateCase();
            await createCasePo.selectRequester('qtao');
            await createCasePo.setSummary(randomStr);
            await createCasePo.clickSaveCaseButton();
            await previewCasePo.clickGoToCaseButton();
            await viewCasePo.clickEditCaseButton();
            await editCasePo.clickOnAttachLink();
            await attachDocumentBladePo.clickOnAdvanceSearchButton();
        });
        it('[4800]: Attach document on it', async () => {
            await attachDocumentBladePo.searchRecord(publishDocLibData2.docLibTitle);
            expect(await attachDocumentBladePo.isDocumentLibaryPresent(publishDocLibData2.docLibTitle)).toBeFalsy('FailuerMsg: drdmv13449_publish_document3 doc is displayed');
            await attachDocumentBladePo.searchRecord(draftDocLibData.docLibTitle);
            expect(await attachDocumentBladePo.isDocumentLibaryPresent(draftDocLibData.docLibTitle)).toBeFalsy('FailuerMsg: draftDocLib4 doc is displayed');
            await attachDocumentBladePo.searchRecord(publish[0]);
            await attachDocumentBladePo.selectDocument(publish[0]);
            await attachDocumentBladePo.clickOnAttachButton();
            await editCasePo.clickSaveCase();
        });
        it('[4800]: Verify the attach document', async () => {
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
        });
        it('[4800]: Verify the document', async () => {
            expect(await viewCasePo.isAttachedDocumentPresent('bwfPdf.pdf')).toBeTruthy('FailuerMsg: bwfPdf.pdf Attached Document is missing');
            expect(await utilityCommon.deleteAlreadyDownloadedFile('bwfPdf.pdf')).toBeTruthy('FailuerMsg: bwfPdf.pdf File is delete sucessfully');
            await viewCasePo.clickOnAttachedDocumentFile('bwfPdf.pdf');
            expect(await utilityCommon.isFileDownloaded('bwfPdf.pdf')).toBeTruthy('FailuerMsg: bwfPdf.pdf File is not downloaded.');
            await viewCasePo.clickShowMoreShowLessLink();
            expect(await viewCasePo.isAttachedDocumentPresent('bwfXlsx.xlsx')).toBeTruthy('FailuerMsg:bwfXlsx.xlsx Attached Document is missing');
            expect(await utilityCommon.deleteAlreadyDownloadedFile('bwfXlsx.xlsx')).toBeTruthy('FailuerMsg: bwfXlsx.xlsx File is delete sucessfully');
            await viewCasePo.clickOnAttachedDocumentFile('bwfXlsx.xlsx');
            expect(await utilityCommon.isFileDownloaded('bwfXlsx.xlsx')).toBeTruthy('FailuerMsg: bwfXlsx.xlsx File is not downloaded.');
        });
        afterAll(async () => {
            await utilityCommon.closeAllBlades();
        });
    });

    //kgaikwad
    describe('[4783]: Add Activity - Case agent attaches published document from document library who has read access to that document', async () => {
        let randomStr = [...Array(10)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        let publish: string[] = ['drdmv13480_publish_document1', 'drdmv13480_publish_document2', 'drdmv13480_publish_document5'];
        let files1: string[] = [filePath1, filePath2, filePath5];
        let publishDocLibData2, draftDocLibData;
        beforeAll(async () => {
            publishDocLibData2 = {
                docLibTitle: 'drdmv13480_publish_document3',
                company: 'Petramco',
                businessUnit: 'United States Support',
                ownerGroup: 'US Support 3',
            }
            draftDocLibData = {
                docLibTitle: 'drdmv13480_draft_document',
                company: 'Petramco',
                businessUnit: 'United States Support',
                ownerGroup: 'US Support 3',
            }
            for (let i = 0; i < publish.length; i++) {
                let publishDocLibData1 = {
                    docLibTitle: publish[i],
                    company: 'Petramco',
                    businessUnit: 'United States Support',
                    ownerGroup: 'US Support 3',
                }
                await apiHelper.apiLogin('tadmin');
                await apiHelper.deleteDocumentLibrary(publishDocLibData1.docLibTitle);
                await apiHelper.apiLogin('qkatawazi');
                let getFilePath1 = files1[i];
                let docLib = await apiHelper.createDocumentLibrary(publishDocLibData1, getFilePath1);
                // await apiHelper.apiLogin('qheroux');
                await apiHelper.giveReadAccessToDocLib(docLib, "Compensation and Benefits");
                await apiHelper.publishDocumentLibrary(docLib);
            }

            await apiHelper.apiLogin('tadmin');
            await apiHelper.deleteDocumentLibrary(publishDocLibData2.docLibTitle);
            await apiHelper.apiLogin('qkatawazi');
            let docLib3 = await apiHelper.createDocumentLibrary(publishDocLibData2, filePath3);
            await apiHelper.publishDocumentLibrary(docLib3);

            await apiHelper.apiLogin('tadmin');
            await apiHelper.deleteDocumentLibrary(draftDocLibData.docLibTitle);
            await apiHelper.apiLogin('qkatawazi');
            await apiHelper.createDocumentLibrary(draftDocLibData, filePath4);
        });
        it('[4783]: Create a case ', async () => {
            await navigationPage.signOut();
            await loginPage.login("qgeorge" );
            await navigationPage.gotoCreateCase();
            await createCasePo.selectRequester('qtao');
            await createCasePo.setSummary(randomStr);
            await createCasePo.clickSaveCaseButton();
            await previewCasePo.clickGoToCaseButton();
            await activityTabPo.addActivityNote(randomStr);
            await activityTabPo.clickOnAttachLink();
        });
        it('[4783]: Add the document', async () => {
            await attachDocumentBladePo.clickOnAdvanceSearchButton();
            await attachDocumentBladePo.searchRecord(publishDocLibData2.docLibTitle);
            expect(await attachDocumentBladePo.isDocumentLibaryPresent(publishDocLibData2.docLibTitle)).toBeFalsy('FailuerMsg: drdmv13480_publish_document3 doc is displayed');
            await attachDocumentBladePo.searchRecord(draftDocLibData.docLibTitle);
            expect(await attachDocumentBladePo.isDocumentLibaryPresent(draftDocLibData.docLibTitle)).toBeFalsy('FailuerMsg: drdmv13480_draft_document doc is displayed');
            await attachDocumentBladePo.searchRecord(publish[0]);
            await attachDocumentBladePo.selectDocument(publish[0]);
            await attachDocumentBladePo.clickOnAttachButton();
            await activityTabPo.clickOnPostButton();
        });
        it('[4783]: Verify the document', async () => {
            // await utilityCommon.waitUntilSpinnerToHide();
            expect(await activityTabPo.isAttachedFileNameDisplayed('bwfJpg.jpg')).toBeTruthy('FailuerMsg: bwfJpg.jpg Attached Document is missing');
            expect(await utilityCommon.deleteAlreadyDownloadedFile('bwfJpg.jpg')).toBeTruthy('FailuerMsg: bwfJpg.jpg File is delete sucessfully');
            await activityTabPo.clickAndDownloadAttachmentFile('bwfJpg.jpg');
            expect(await utilityCommon.isFileDownloaded('bwfJpg.jpg')).toBeTruthy('FailuerMsg: bwfJpg.jpg File is not downloaded.');

            await activityTabPo.addActivityNote(randomStr);
            await activityTabPo.clickOnAttachLink();
            await attachDocumentBladePo.searchAndAttachDocument(publish[1]);
            await activityTabPo.clickOnAttachLink();
            await attachDocumentBladePo.searchAndAttachDocument(publish[2]);
            await activityTabPo.clickOnPostButton();
        });
        it('[4783]: Verify the attachment', async () => {
            // await utilityCommon.waitUntilSpinnerToHide();
            expect(await activityTabPo.isAttachedFileNameDisplayed('bwfPdf.pdf')).toBeTruthy('FailuerMsg: bwfPdf.pdf Attached Document is missing');
            expect(await utilityCommon.deleteAlreadyDownloadedFile('bwfPdf.pdf')).toBeTruthy('FailuerMsg: bwfPdf.pdf File is delete sucessfully');
            await activityTabPo.clickAndDownloadAttachmentFile('bwfPdf.pdf');
            expect(await utilityCommon.isFileDownloaded('bwfPdf.pdf')).toBeTruthy('FailuerMsg: bwfPdf.pdf File is not downloaded.');
            expect(await activityTabPo.isAttachedFileNameDisplayed('bwfXlsx.xlsx')).toBeTruthy('FailuerMsg:bwfXlsx.xlsx Attached Document is missing');
            expect(await utilityCommon.deleteAlreadyDownloadedFile('bwfXlsx.xlsx')).toBeTruthy('FailuerMsg: bwfXlsx.xlsx File is delete sucessfully');
            await activityTabPo.clickAndDownloadAttachmentFile('bwfXlsx.xlsx');
        });
        afterAll(async () => {
            await utilityCommon.closeAllBlades();
            await navigationPage.signOut();
            await loginPage.login('qkatawazi');
        });
    });

    //kgaikwad
    describe('[4784]: Add Activity - Case business analyst attaches published document from document library who has read access to that document', async () => {
        let randomStr = [...Array(10)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        let publish: string[] = ['drdmv13479_publish_document1', 'drdmv13479_publish_document2', 'drdmv13479_publish_document5'];
        let files1: string[] = [filePath1, filePath2, filePath5];
        let publishDocLibData2, draftDocLibData;
        beforeAll(async () => {
            publishDocLibData2 = {
                docLibTitle: 'drdmv13479_publish_document3',
                company: 'Petramco',
                businessUnit: 'HR Support',
                ownerGroup: 'Staffing',
            }
            draftDocLibData = {
                docLibTitle: 'drdmv13479_draft_document',
                company: 'Petramco',
                businessUnit: 'HR Support',
                ownerGroup: 'Compensation and Benefits',
            }
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
            await apiHelper.apiLogin('tadmin');
            await apiHelper.deleteDocumentLibrary(publishDocLibData2.docLibTitle);
            await apiHelper.apiLogin('fritz');
            let docLib3 = await apiHelper.createDocumentLibrary(publishDocLibData2, filePath3);
            await apiHelper.publishDocumentLibrary(docLib3);

            await apiHelper.apiLogin('tadmin');
            await apiHelper.deleteDocumentLibrary(draftDocLibData.docLibTitle);
            await apiHelper.apiLogin('fritz');
            await apiHelper.createDocumentLibrary(draftDocLibData, filePath4);
        });
        it('[4784]: Create a case and add task on it', async () => {
            await navigationPage.signOut();
            await loginPage.login('qkatawazi');
            await navigationPage.gotoCreateCase();
            await createCasePo.selectRequester('qtao');
            await createCasePo.setSummary(randomStr);
            await createCasePo.clickSaveCaseButton();
            await previewCasePo.clickGoToCaseButton();
            await activityTabPo.addActivityNote(randomStr);
            await activityTabPo.clickOnAttachLink();
        });
        it('[4784]: Add the documnet', async () => {
            await attachDocumentBladePo.clickOnAdvanceSearchButton();
            await attachDocumentBladePo.searchRecord(publishDocLibData2.docLibTitle);
            expect(await attachDocumentBladePo.isDocumentLibaryPresent(publishDocLibData2.docLibTitle)).toBeFalsy('FailuerMsg: drdmv13479_publish_document3 doc is displayed');
            await attachDocumentBladePo.searchRecord(draftDocLibData.docLibTitle);
            expect(await attachDocumentBladePo.isDocumentLibaryPresent(draftDocLibData.docLibTitle)).toBeFalsy('FailuerMsg: draftDocLib4 doc is displayed');
            await attachDocumentBladePo.searchRecord(publish[0]);
            await attachDocumentBladePo.selectDocument(publish[0]);
            await attachDocumentBladePo.clickOnAttachButton();
            await activityTabPo.clickOnPostButton();
        });
        it('[4784]: Verify the document', async () => {
            // await utilityCommon.waitUntilSpinnerToHide();
            expect(await activityTabPo.isAttachedFileNameDisplayed('bwfJpg.jpg')).toBeTruthy('FailuerMsg: bwfJpg.jpg Attached Document is missing');
            expect(await utilityCommon.deleteAlreadyDownloadedFile('bwfJpg.jpg')).toBeTruthy('FailuerMsg: bwfJpg.jpg File is delete sucessfully');
            await activityTabPo.clickAndDownloadAttachmentFile('bwfJpg.jpg');
            expect(await utilityCommon.isFileDownloaded('bwfJpg.jpg')).toBeTruthy('FailuerMsg: bwfJpg.jpg File is not downloaded.');
            await activityTabPo.addActivityNote(randomStr);
            await activityTabPo.clickOnAttachLink();
            await attachDocumentBladePo.searchAndAttachDocument(publish[1]);
            await activityTabPo.clickOnAttachLink();
            await attachDocumentBladePo.searchAndAttachDocument(publish[2]);
            await activityTabPo.clickOnPostButton();
        });
        it('[4784]: Check the document in activity', async () => {
            // await utilityCommon.waitUntilSpinnerToHide();
            expect(await activityTabPo.isAttachedFileNameDisplayed('bwfPdf.pdf')).toBeTruthy('FailuerMsg: bwfPdf.pdf Attached Document is missing');
            expect(await utilityCommon.deleteAlreadyDownloadedFile('bwfPdf.pdf')).toBeTruthy('FailuerMsg: bwfPdf.pdf File is delete sucessfully');
            await activityTabPo.clickAndDownloadAttachmentFile('bwfPdf.pdf');
            expect(await utilityCommon.isFileDownloaded('bwfPdf.pdf')).toBeTruthy('FailuerMsg: bwfPdf.pdf File is not downloaded.');
            expect(await activityTabPo.isAttachedFileNameDisplayed('bwfXlsx.xlsx')).toBeTruthy('FailuerMsg:bwfXlsx.xlsx Attached Document is missing');
            expect(await utilityCommon.deleteAlreadyDownloadedFile('bwfXlsx.xlsx')).toBeTruthy('FailuerMsg: bwfXlsx.xlsx File is delete sucessfully');
            await activityTabPo.clickAndDownloadAttachmentFile('bwfXlsx.xlsx');
            expect(await utilityCommon.isFileDownloaded('bwfXlsx.xlsx')).toBeTruthy('FailuerMsg: bwfXlsx.xlsx File is not downloaded.');
        });
        afterAll(async () => {
            await utilityCommon.closeAllBlades();
            await navigationPage.signOut();
            await loginPage.login('qkatawazi');
        });
    });

    //kgaikwad
    describe('[4795]: Edit Case - Case business analyst attaches published document from document library who has write access to that document', async () => {
        let publish: string[] = ['drdmv13463_publish_document1', 'drdmv13463_publish_document2', 'drdmv13463_publish_document5'];
        let files1: string[] = [filePath1, filePath2, filePath5];
        let publishDocLibData2, draftDocLibData, randomStr = [...Array(10)].map(i => (~~(Math.random() * 36)).toString(36)).join('');;
        beforeAll(async () => {
            publishDocLibData2 = {
                docLibTitle: 'drdmv13463_publish_document3',
                company: 'Petramco',
                businessUnit: 'HR Support',
                ownerGroup: 'Staffing',
            }
            draftDocLibData = {
                docLibTitle: 'drdmv13463_draft_document',
                company: 'Petramco',
                businessUnit: 'HR Support',
                ownerGroup: 'Staffing',
            }
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

            await apiHelper.apiLogin('tadmin');
            await apiHelper.deleteDocumentLibrary(publishDocLibData2.docLibTitle);
            await apiHelper.apiLogin('elizabeth');
            let docLib3 = await apiHelper.createDocumentLibrary(publishDocLibData2, filePath3);
            await apiHelper.publishDocumentLibrary(docLib3);

            await apiHelper.apiLogin('tadmin');
            await apiHelper.deleteDocumentLibrary(draftDocLibData.docLibTitle);
            await apiHelper.apiLogin('elizabeth');
            await apiHelper.createDocumentLibrary(draftDocLibData, filePath4);
        });
        it('[4795]: Create a case and add task on it', async () => {
            await navigationPage.signOut();
            await loginPage.login('qkatawazi');
            await navigationPage.gotoCreateCase();
            await createCasePo.selectRequester('qtao');
            await createCasePo.setSummary(randomStr);
            await createCasePo.clickSaveCaseButton();
            await previewCasePo.clickGoToCaseButton();
            await viewCasePo.clickEditCaseButton();
            await editCasePo.clickOnAttachLink();
            await attachDocumentBladePo.clickOnAdvanceSearchButton();
        });
        it('[4795]: Add the attachment', async () => {
            await attachDocumentBladePo.searchRecord(publishDocLibData2.docLibTitle);
            expect(await attachDocumentBladePo.isDocumentLibaryPresent(publishDocLibData2.docLibTitle)).toBeFalsy('FailuerMsg: drdmv13463_publish_document3 doc is displayed');
            await attachDocumentBladePo.searchRecord(draftDocLibData.docLibTitle);
            expect(await attachDocumentBladePo.isDocumentLibaryPresent(draftDocLibData.docLibTitle)).toBeFalsy('FailuerMsg: drdmv13463_draft_document doc is displayed');
            await attachDocumentBladePo.searchRecord(publish[0]);
            await attachDocumentBladePo.selectDocument(publish[0]);
            await attachDocumentBladePo.clickOnAttachButton();
            await editCasePo.clickSaveCase();
        });
        it('[4795]: Verify the document', async () => {
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
        });
        it('[4795]: check the document in activity', async () => {
            expect(await viewCasePo.isAttachedDocumentPresent('bwfPdf.pdf')).toBeTruthy('FailuerMsg: bwfPdf.pdf Attached Document is missing');
            expect(await utilityCommon.deleteAlreadyDownloadedFile('bwfPdf.pdf')).toBeTruthy('FailuerMsg: bwfPdf.pdf File is delete sucessfully');
            await viewCasePo.clickOnAttachedDocumentFile('bwfPdf.pdf');
            expect(await utilityCommon.isFileDownloaded('bwfPdf.pdf')).toBeTruthy('FailuerMsg: bwfPdf.pdf File is not downloaded.');
            await viewCasePo.clickShowMoreShowLessLink();
            expect(await viewCasePo.isAttachedDocumentPresent('bwfXlsx.xlsx')).toBeTruthy('FailuerMsg:bwfXlsx.xlsx Attached Document is missing');
            expect(await utilityCommon.deleteAlreadyDownloadedFile('bwfXlsx.xlsx')).toBeTruthy('FailuerMsg: bwfXlsx.xlsx File is delete sucessfully');
            await viewCasePo.clickOnAttachedDocumentFile('bwfXlsx.xlsx');
            expect(await utilityCommon.isFileDownloaded('bwfXlsx.xlsx')).toBeTruthy('FailuerMsg: bwfXlsx.xlsx File is not downloaded.');
        });
        afterAll(async () => {
            await utilityCommon.closeAllBlades();
            await navigationPage.signOut();
            await loginPage.login('qkatawazi');
        });
    });

    //kgaikwad
    describe('[4782]: Add Activity - Case manager attaches published document from document library who has read access to that document', async () => {
        let publishDocLibData1, draftDocLibData, publishDocLibData2;
        let randomStr = [...Array(10)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        let publish: string[] = ['drdmv13481_publish_document1', 'drdmv13481_publish_document2', 'drdmv13481_publish_document5'];
        let files1: string[] = [filePath1, filePath2, filePath5];
        beforeAll(async () => {
            draftDocLibData = {
                docLibTitle: 'drdmv13481_draft_document',
                company: 'Petramco',
                businessUnit: 'HR Support',
                ownerGroup: 'Compensation and Benefits',
            }
            publishDocLibData2 = {
                docLibTitle: 'drdmv13481_publish_document3',
                company: 'Petramco',
                businessUnit: 'HR Support',
                ownerGroup: 'Staffing',
            }
            for (let i = 0; i < publish.length; i++) {
                publishDocLibData1 = {
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

            await apiHelper.apiLogin('tadmin');
            await apiHelper.deleteDocumentLibrary(publishDocLibData2.docLibTitle);
            await apiHelper.apiLogin('elizabeth');
            let docLib3 = await apiHelper.createDocumentLibrary(publishDocLibData2, filePath3);
            await apiHelper.publishDocumentLibrary(docLib3);
            await apiHelper.apiLogin('tadmin');
            await apiHelper.deleteDocumentLibrary(draftDocLibData.docLibTitle);
            await apiHelper.apiLogin('elizabeth');
            await apiHelper.createDocumentLibrary(draftDocLibData, filePath4);
        });
        it('[4782]: Create a case', async () => {
            await navigationPage.signOut();
            await loginPage.login('qdu');
            await navigationPage.gotoCreateCase();
            await createCasePo.selectRequester('qtao');
            await createCasePo.setSummary(randomStr);
            await createCasePo.clickSaveCaseButton();
            await previewCasePo.clickGoToCaseButton();
            await activityTabPo.addActivityNote(randomStr);
            await activityTabPo.clickOnAttachLink();
            await attachDocumentBladePo.clickOnAdvanceSearchButton();
        });
        it('[4782]: Add the attachment', async () => {
            await attachDocumentBladePo.searchRecord(publishDocLibData2.docLibTitle);
            expect(await attachDocumentBladePo.isDocumentLibaryPresent(publishDocLibData2.docLibTitle)).toBeFalsy('FailuerMsg: publishDocLib3 doc is displayed');
            await attachDocumentBladePo.searchRecord(draftDocLibData.docLibTitle);
            expect(await attachDocumentBladePo.isDocumentLibaryPresent(draftDocLibData.docLibTitle)).toBeFalsy('FailuerMsg: draftDocLib4 doc is displayed');
            await attachDocumentBladePo.searchRecord(publish[0]);
            await attachDocumentBladePo.selectDocument(publish[0]);
            await attachDocumentBladePo.clickOnAttachButton();
            await activityTabPo.clickOnPostButton();
            // await utilityCommon.waitUntilSpinnerToHide();
        });
        it('[4782]: Verify the attachment', async () => {
            expect(await activityTabPo.isAttachedFileNameDisplayed('bwfJpg.jpg')).toBeTruthy('FailuerMsg: bwfJpg.jpg Attached Document is missing');
            expect(await utilityCommon.deleteAlreadyDownloadedFile('bwfJpg.jpg')).toBeTruthy('FailuerMsg: bwfJpg.jpg File is delete sucessfully');
            await activityTabPo.clickAndDownloadAttachmentFile('bwfJpg.jpg');
            expect(await utilityCommon.isFileDownloaded('bwfJpg.jpg')).toBeTruthy('FailuerMsg: bwfJpg.jpg File is not downloaded.');

            await activityTabPo.addActivityNote(randomStr);
            await activityTabPo.clickOnAttachLink();
            await attachDocumentBladePo.searchAndAttachDocument(publish[1]);
            await activityTabPo.clickOnAttachLink();
            await attachDocumentBladePo.searchAndAttachDocument(publish[2]);
            await activityTabPo.clickOnPostButton();
        });
        it('[4782]: Verify the attachment on activity', async () => {
            // await utilityCommon.waitUntilSpinnerToHide();
            expect(await activityTabPo.isAttachedFileNameDisplayed('bwfPdf.pdf')).toBeTruthy('FailuerMsg: bwfPdf.pdf Attached Document is missing');
            expect(await utilityCommon.deleteAlreadyDownloadedFile('bwfPdf.pdf')).toBeTruthy('FailuerMsg: bwfPdf.pdf File is delete sucessfully');
            await activityTabPo.clickAndDownloadAttachmentFile('bwfPdf.pdf');
            expect(await utilityCommon.isFileDownloaded('bwfPdf.pdf')).toBeTruthy('FailuerMsg: bwfPdf.pdf File is not downloaded.');

            expect(await activityTabPo.isAttachedFileNameDisplayed('bwfXlsx.xlsx')).toBeTruthy('FailuerMsg:bwfXlsx.xlsx Attached Document is missing');
            expect(await utilityCommon.deleteAlreadyDownloadedFile('bwfXlsx.xlsx')).toBeTruthy('FailuerMsg: bwfXlsx.xlsx File is delete sucessfully');
            await activityTabPo.clickAndDownloadAttachmentFile('bwfXlsx.xlsx');
            expect(await utilityCommon.isFileDownloaded('bwfXlsx.xlsx')).toBeTruthy('FailuerMsg: bwfXlsx.xlsx File is not downloaded.');
        });
        afterAll(async () => {
            await utilityCommon.closeAllBlades();
            await navigationPage.signOut();
            await loginPage.login('qkatawazi');
        });
    });
});
