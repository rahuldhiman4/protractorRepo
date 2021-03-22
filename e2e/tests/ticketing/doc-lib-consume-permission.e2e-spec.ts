import { browser } from 'protractor';
import apiHelper from '../../api/api.helper';
import caseConsolePo from '../../pageobject/case/case-console.po';
import previewCasePo from '../../pageobject/case/case-preview.po';
import createCasePo from '../../pageobject/case/create-case.po';
import editCasePo from '../../pageobject/case/edit-case.po';
import quickCasePo from '../../pageobject/case/quick-case.po';
import selectCasetemplateBladePo from '../../pageobject/case/select-casetemplate-blade.po';
import viewCasePo from '../../pageobject/case/view-case.po';
import accessTabPo from '../../pageobject/common/access-tab.po';
import attachDocumentBladePo from '../../pageobject/common/attach-document-blade.po';
import changeAssignmentBladePo from '../../pageobject/common/change-assignment.po';
import loginPage from '../../pageobject/common/login.po';
import navigationPage from "../../pageobject/common/navigation.po";
import resourcesTabPo from '../../pageobject/common/resources-tab.po';
import composeMailPo from '../../pageobject/email/compose-mail.po';
import documentLibraryConsolePo from '../../pageobject/settings/document-management/document-library-console.po';
import editDocumentLibraryPo from '../../pageobject/settings/document-management/edit-document-library.po';
import viewDocumentLibraryPo from '../../pageobject/settings/document-management/view-document-library.po';
import activityTabPo from '../../pageobject/social/activity-tab.po';
import adhoctaskTemplate from '../../pageobject/task/create-adhoc-task.po';
import manageTask from '../../pageobject/task/manage-task-blade.po';
import viewTaskPo from '../../pageobject/task/view-task.po';
import { BWF_BASE_URL, BWF_PAGE_TITLES, DropDownType } from '../../utils/constants';
import utilityCommon from '../../utils/utility.common';

describe('Document Library Consume Permission', () => {
    let filePath1 = 'e2e/data/ui/attachment/bwfJpg.jpg';
    let filePath2 = 'e2e/data/ui/attachment/bwfPdf.pdf';
    let filePath3 = 'e2e/data/ui/attachment/bwfJpg1.jpg';
    let filePath4 = 'e2e/data/ui/attachment/bwfJpg2.jpg';
    let filePath5 = 'e2e/data/ui/attachment/bwfXlsx.xlsx';
    let  caseSummary = [...Array(10)].map(i => (~~(Math.random() * 36)).toString(36)).join('');

    beforeAll(async () => {
        await browser.get(BWF_BASE_URL);
        await loginPage.login('qkatawazi');
        // Create User and assigned Document Manager Permission to agent
    });

    afterAll(async () => {
        await utilityCommon.closeAllBlades();
        await navigationPage.signOut();
    });

    describe('[4797]: Edit Case - Case manager attaches published document from document library who has write access to that document', async () => {
        let publish: string[] = ['drdmv13458_publish_document1', 'drdmv13458_publish_document2', 'drdmv13458_publish_document5'];
        let files1: string[] = [filePath1, filePath2, filePath5];
        let publishDocLibData2, draftDocLibData;
        beforeAll(async () => {
            for (let i = 0; i < publish.length; i++) {
                let publishDocLibData1 = {
                    docLibTitle: publish[i],
                    company: 'Petramco',
                    businessUnit: 'Canada Support',
                    ownerGroup: 'CA Support 2',
                }
                await apiHelper.apiLogin('tadmin');
                await apiHelper.deleteDocumentLibrary(publishDocLibData1.docLibTitle);
                await apiHelper.apiLogin('elizabeth');
                let getFilePath1 = files1[i];
                let docLib = await apiHelper.createDocumentLibrary(publishDocLibData1, getFilePath1);
                await apiHelper.publishDocumentLibrary(docLib);
            }
            publishDocLibData2 = {
                docLibTitle: 'drdmv13458_publish_document3',
                company: 'Petramco',
                businessUnit: 'HR Support',
                ownerGroup: 'Staffing',
            }
            await apiHelper.apiLogin('tadmin');
            await apiHelper.deleteDocumentLibrary(publishDocLibData2.docLibTitle);
            await apiHelper.apiLogin('elizabeth');
            let docLib3 = await apiHelper.createDocumentLibrary(publishDocLibData2, filePath3);
            await apiHelper.publishDocumentLibrary(docLib3);

            draftDocLibData = {
                docLibTitle: 'drdmv13458_draft_document',
                company: 'Petramco',
                businessUnit: 'HR Support',
                ownerGroup: 'Staffing',
            }
            await apiHelper.apiLogin('tadmin');
            await apiHelper.deleteDocumentLibrary(draftDocLibData.docLibTitle);
            await apiHelper.apiLogin('elizabeth');
            await apiHelper.createDocumentLibrary(draftDocLibData, filePath4);
        });
        it('[4797]: Edit Case - Case manager attaches published document from document library who has write access to that document', async () => {
            await navigationPage.signOut();
            await loginPage.login('qdu');
            await navigationPage.gotoCreateCase();
            await createCasePo.selectRequester('qtao');
            await createCasePo.setSummary(caseSummary);
            await createCasePo.clickSaveCaseButton();
            await previewCasePo.clickGoToCaseButton();
            await viewCasePo.clickEditCaseButton();
            await editCasePo.clickOnAttachLink();
            await attachDocumentBladePo.clickOnAdvanceSearchButton();
        });
        it('[4797]: Edit Case - Case manager attaches published document from document library who has write access to that document', async () => {
            await attachDocumentBladePo.searchRecord(publishDocLibData2.docLibTitle);
            expect(await attachDocumentBladePo.isDocumentLibaryPresent(publishDocLibData2.docLibTitle)).toBeFalsy('FailuerMsg: publishDocLib3 doc is displayed');
            await attachDocumentBladePo.searchRecord(draftDocLibData.docLibTitle);
            expect(await attachDocumentBladePo.isDocumentLibaryPresent(draftDocLibData.docLibTitle)).toBeFalsy('FailuerMsg: draftDocLib4 doc is displayed');
            await attachDocumentBladePo.searchRecord(publish[0]);
            await attachDocumentBladePo.selectDocument(publish[0]);
            await attachDocumentBladePo.clickOnAttachButton();
            await editCasePo.clickSaveCase();
        });
        it('[4797]: Edit Case - Case manager attaches published document from document library who has write access to that document', async () => {
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
        it('[4797]: Edit Case - Case manager attaches published document from document library who has write access to that document', async () => {
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
            await navigationPage.signOut();
            await loginPage.login('qkatawazi');
        });
    });

    //kgaikwad
    describe('[4745]: Availability of documents on knowledge search under Quick case, Resources tab', async () => {
        let caseData, publishDocLibData1, docLib1, summary = [...Array(10)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        beforeAll(async () => {
            publishDocLibData1 = {
                docLibTitle: 'drdmv13537_publish_document',
                company: 'Petramco',
                businessUnit: 'HR Support',
                ownerGroup: 'Compensation and Benefits',
            }
            caseData = {
                "Requester": "qtao",
                "Summary": "Test case for 5515RandVal" + summary,
                "Assigned Company": "Petramco",
                "Business Unit": "United States Support",
                "Support Group": "US Support 3",
                "Assignee": "qkatawazi"
            }
            await apiHelper.apiLogin('tadmin');
            await apiHelper.deleteDocumentLibrary(publishDocLibData1.docLibTitle);
            await apiHelper.apiLogin("qgeorge");
            docLib1 = await apiHelper.createDocumentLibrary(publishDocLibData1, filePath1);
            await apiHelper.publishDocumentLibrary(docLib1);
            await navigationPage.signOut();
            await loginPage.login("qgeorge");
        });
        it('[4745]: Availability of documents on knowledge search under Quick case, Resources tab', async () => {
            await navigationPage.gotoQuickCase();
            await quickCasePo.selectRequesterName('qtao');
            await quickCasePo.setCaseSummary(publishDocLibData1.docLibTitle);
            expect(await quickCasePo.isRecommendedKnowledgeEmpty()).toBeTruthy('FailuerMsg: Recommended knowledge is not empty');
            await navigationPage.gotoCaseConsole();
        });
        it('[4745]: Availability of documents on knowledge search under Quick case, Resources tab', async () => {
            await apiHelper.apiLogin("qgeorge");
            let newCase = await apiHelper.createCase(caseData);
            let caseId: string = newCase.displayId;
            await caseConsolePo.searchAndOpenCase(caseId);
            await viewCasePo.clickEditCaseButton();
            await editCasePo.setCaseSummary(publishDocLibData1.docLibTitle);
            await editCasePo.clickSaveCase();
            await utilityCommon.closePopUpMessage();
            await viewCasePo.clickOnTab('Resources');
            expect(await resourcesTabPo.isSearchRecordEmpty(1)).toBeTruthy('Failuer1: Knowledge Article is not empty');
            await resourcesTabPo.clickOnAdvancedSearchOptions();
            await resourcesTabPo.searchTextAndEnter(publishDocLibData1.docLibTitle);
            expect(await resourcesTabPo.isSearchRecordEmpty(1)).toBeTruthy('Failuer2: Knowledge Article is not empty');
        });
    });

    //kgaikwad
    describe('[4760]: Add Task - Case agent attaches published document from document library where case agent is author of the document', async () => {
        let draftDocLibData, templateData, taskTemplateDataSet, publishDocLibData1, publishDocLibData2, randomStr = [...Array(5)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        let adhocTaskSummary1 = [...Array(10)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        let adhocTaskSummary2 = [...Array(10)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        let caseTemplateName = 'caseTemplateName' + randomStr;
        let casTemplateSummary = 'CaseSummaryName' + randomStr;
        let publish: string[];

        beforeAll(async () => {
            publishDocLibData1 = {
                docLibTitle: 'drdmv13517_publish_document3',
                company: 'Petramco',
                businessUnit: 'HR Support',
                ownerGroup: 'Staffing',
            }
            await apiHelper.apiLogin('tadmin');
            await apiHelper.deleteDocumentLibrary(publishDocLibData1.docLibTitle);
            await apiHelper.apiLogin("qgeorge");
            let docLib3 = await apiHelper.createDocumentLibrary(publishDocLibData1, filePath3);
            await apiHelper.publishDocumentLibrary(docLib3);

            await navigationPage.signOut();
            await loginPage.login("qgeorge");

            templateData = {
                "templateName": `${caseTemplateName}`,
                "templateSummary": `${casTemplateSummary}`,
                "templateStatus": "Active",
                "assignee": "qgeorge",
                "company": "Petramco",
                "businessUnit": "United States Support",
                "ownerBU": "United States Support",
                "supportGroup": "US Support 2",
                "ownerGroup": "US Support 2"
            }
            await apiHelper.apiLogin('qkatawazi');
            let newCaseTemplate = await apiHelper.createCaseTemplate(templateData);

            let taskTemplateNameWithYesValue = 'taskTemplateWithYesResolve' + randomStr;
            let taskTemplateSummaryYesValue = 'taskSummaryYesResolved' + randomStr;
            taskTemplateDataSet = {
                "templateName": `${taskTemplateNameWithYesValue}`,
                "templateSummary": `${taskTemplateSummaryYesValue}`,
                "templateStatus": "Active",
                "taskCompany": 'Petramco',
                "assignee": "qgeorge",
                "businessUnit": "United States Support",
                "supportGroup": "US Support 2",
                "ownerCompany": "Petramco",
                "ownerBusinessUnit": "United States Support",
                "ownerGroup": "US Support 2"
            }
            let manualTaskTemplate = await apiHelper.createManualTaskTemplate(taskTemplateDataSet);
            await apiHelper.associateCaseTemplateWithOneTaskTemplate(newCaseTemplate.displayId, manualTaskTemplate.displayId);

            publish = ['drdmv13517_publish_document1', 'drdmv13517_publish_document2', 'drdmv13517_publish_document5'];
            let files1: string[] = [filePath1, filePath2, filePath5];
            for (let i = 0; i < publish.length; i++) {
                publishDocLibData2 = {
                    docLibTitle: publish[i],
                    company: 'Petramco',
                    businessUnit: 'HR Support',
                    ownerGroup: 'Staffing',
                }
                await apiHelper.apiLogin('tadmin');
                await apiHelper.deleteDocumentLibrary(publishDocLibData2.docLibTitle);
                await apiHelper.apiLogin("qgeorge");
                let getFilePath1 = files1[i];
                let docLib = await apiHelper.createDocumentLibrary(publishDocLibData2, getFilePath1);
                await apiHelper.publishDocumentLibrary(docLib);
            }

            draftDocLibData = {
                docLibTitle: 'drdmv13517_draft_document',
                company: 'Petramco',
                businessUnit: 'HR Support',
                ownerGroup: 'Compensation and Benefits',
            }
            await apiHelper.apiLogin('tadmin');
            await apiHelper.deleteDocumentLibrary(draftDocLibData.docLibTitle);
            await apiHelper.apiLogin("qgeorge");
            await apiHelper.createDocumentLibrary(draftDocLibData, filePath4);
        });
        it('[4760]: Add Task - Case agent attaches published document from document library where case agent is author of the document', async () => {
            await navigationPage.gotoCreateCase();
            await createCasePo.selectRequester('qtao');
            await createCasePo.setSummary(caseSummary);
            await createCasePo.clickSelectCaseTemplateButton();
            await selectCasetemplateBladePo.selectCaseTemplate(caseTemplateName);
       
            await createCasePo.clickSaveCaseButton();
            await previewCasePo.clickGoToCaseButton();
            await viewCasePo.clickAddTaskButton();
            await manageTask.clickAddAdhocTaskButton();
            await adhoctaskTemplate.setSummary(adhocTaskSummary1);
            await adhoctaskTemplate.clickAttachButton();
        });
        it('[4760]: Add Task - Case agent attaches published document from document library where case agent is author of the document', async () => {
            await attachDocumentBladePo.clickOnAdvanceSearchButton();
            await attachDocumentBladePo.searchRecord(publishDocLibData1.docLibTitle);
            expect(await attachDocumentBladePo.isDocumentLibaryPresent(publishDocLibData1.docLibTitle)).toBeFalsy('FailuerMsg: drdmv13517_publish_document3 doc is displayed');
            await attachDocumentBladePo.searchRecord(draftDocLibData.docLibTitle);
            expect(await attachDocumentBladePo.isDocumentLibaryPresent(draftDocLibData.docLibTitle)).toBeFalsy('FailuerMsg: draftDocLib4 doc is displayed');
            await attachDocumentBladePo.searchRecord(publish[0]);
            await attachDocumentBladePo.selectDocument(publish[0]);
            await attachDocumentBladePo.clickOnAttachButton();
            await adhoctaskTemplate.clickAssignToMeButton();
            await adhoctaskTemplate.clickSaveAdhoctask();
            await utilityCommon.closePopUpMessage();
            await manageTask.clickTaskLink(adhocTaskSummary1);
            expect(await viewTaskPo.isAttachedDocumentPresent('bwfJpg.jpg')).toBeTruthy('FailuerMsg: bwfJpg.jpg Attached Document is missing');
            expect(await utilityCommon.deleteAlreadyDownloadedFile('bwfJpg.jpg')).toBeTruthy('FailuerMsg: bwfJpg.jpg File is delete sucessfully');
            await viewTaskPo.clickOnAttachedDocumentFile('bwfJpg.jpg');
            expect(await utilityCommon.isFileDownloaded('bwfJpg.jpg')).toBeTruthy('FailuerMsg: bwfJpg.jpg File is not downloaded.');
        });
        it('[4760]: Add Task - Case agent attaches published document from document library where case agent is author of the document', async () => {
            await viewTaskPo.clickOnViewCase();
            await viewCasePo.clickAddTaskButton();
            await manageTask.clickAddAdhocTaskButton();
            await adhoctaskTemplate.setSummary(adhocTaskSummary2);
            await adhoctaskTemplate.clickAttachButton();
            await attachDocumentBladePo.searchAndAttachDocument(publish[1]);
            await adhoctaskTemplate.clickAttachButton();
            await attachDocumentBladePo.searchAndAttachDocument(publish[2]);
            await adhoctaskTemplate.clickSaveAdhoctask();
            await utilityCommon.closePopUpMessage();
            await manageTask.clickTaskLink(adhocTaskSummary2);
        });
        it('[4760]: Add Task - Case agent attaches published document from document library where case agent is author of the document', async () => {
            expect(await viewTaskPo.isAttachedDocumentPresent('bwfPdf.pdf')).toBeTruthy('FailuerMsg: bwfPdf.pdf Attached Document is missing');
            expect(await utilityCommon.deleteAlreadyDownloadedFile('bwfPdf.pdf')).toBeTruthy('FailuerMsg: bwfPdf.pdf File is delete sucessfully');
            await viewTaskPo.clickOnAttachedDocumentFile('bwfPdf.pdf');
            expect(await utilityCommon.isFileDownloaded('bwfPdf.pdf')).toBeTruthy('FailuerMsg: bwfPdf.pdf File is not downloaded.');
            expect(await viewTaskPo.isAttachedDocumentPresent('bwfXlsx.xlsx')).toBeTruthy('FailuerMsg:bwfXlsx.xlsx Attached Document is missing');
            expect(await utilityCommon.deleteAlreadyDownloadedFile('bwfXlsx.xlsx')).toBeTruthy('FailuerMsg: bwfXlsx.xlsx File is delete sucessfully');
            await viewTaskPo.clickOnAttachedDocumentFile('bwfXlsx.xlsx');
            expect(await utilityCommon.isFileDownloaded('bwfXlsx.xlsx')).toBeTruthy('FailuerMsg: bwfXlsx.xlsx File is not downloaded.');
        });
        afterAll(async () => {
            await utilityCommon.closeAllBlades();
            await navigationPage.signOut();
            await loginPage.login('qkatawazi');
        });
    });

    //kgaikwad
    describe('[4747]: Search and UI Validation of document library search view', async () => {
        let addNoteText = [...Array(10)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        // create 11 doc lib to see pagination
        let publish: string[] = ['drdmv13534_publish_document1', 'drdmv13534_publish_document2', 'drdmv13534_publish_document3', 'drdmv13534_publish_document4', 'drdmv13534_publish_document5', 'drdmv13534_publish_document6', 'drdmv13534_publish_document7', 'drdmv13534_publish_document8', 'drdmv13534_publish_document9', 'drdmv13534_publish_document10', 'drdmv13534_publish_document11'];
        let files: string[] = [filePath1, filePath2, filePath3, filePath4, filePath5, filePath1, filePath2, filePath3, filePath4, filePath5, filePath1];
        let documentDate;
        beforeAll(async () => {
            for (let i = 0; i < publish.length; i++) {
                let publishDocLibData1 = {
                    docLibTitle: publish[i],
                    company: 'Petramco',
                    businessUnit: 'United States Support',
                    ownerGroup: 'US Support 3',
                }
                await apiHelper.apiLogin('tadmin');
                await apiHelper.deleteDocumentLibrary(publishDocLibData1.docLibTitle);
                await apiHelper.apiLogin("qkatawazi");
                let getFilePath1 = files[i];
                let docLib = await apiHelper.createDocumentLibrary(publishDocLibData1, getFilePath1);
                await apiHelper.publishDocumentLibrary(docLib);
            }
        });
        it('[4747]: Search and UI Validation of document library search view', async () => {
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Document Management--Library', BWF_PAGE_TITLES.DOCUMENT_MANAGEMENT.LIBRARY);
            await documentLibraryConsolePo.searchAndOpenDocumentLibrary(publish[0]);
            await viewDocumentLibraryPo.clickOnEditDocument();
            await editDocumentLibraryPo.selectStatus('Draft');
            await editDocumentLibraryPo.clickOnSaveButton();
            await editDocumentLibraryPo.clickOnCancelButton();
            await documentLibraryConsolePo.searchAndOpenDocumentLibrary(publish[0]);
            await viewDocumentLibraryPo.clickOnEditDocument();
            await editDocumentLibraryPo.setCategoryTier1('Employee Relations');
            await editDocumentLibraryPo.setRegion('Americas');
            await editDocumentLibraryPo.setSiteGrp("Marketing")
            await editDocumentLibraryPo.setSite('Mexico City');
            await editDocumentLibraryPo.selectStatus('Published');
            await editDocumentLibraryPo.clickOnSaveButton();
            expect(await utilityCommon.isPopUpMessagePresent('Saved successfully.')).toBeTruthy();
            await editDocumentLibraryPo.clickOnCancelButton();
            let objDate: Date = new Date();
            let allMonths = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
            let day = "" + objDate.getDate(); //if (day.length == 1) { day = "0" + day; }
            let month = allMonths[objDate.getMonth()];
            let year = objDate.getFullYear();
            // Create Case
            documentDate = `${month} ${day}, ${year}`; // e.g. June 28, 2020
            await navigationPage.gotoCreateCase();
            await createCasePo.selectRequester('qtao');
            await createCasePo.setSummary(caseSummary);
            await createCasePo.clickAssignToMeButton();
            await createCasePo.clickSaveCaseButton();
            await utilityCommon.closePopUpMessage();
            await previewCasePo.clickGoToCaseButton();
            await activityTabPo.addActivityNote(addNoteText);
        });
        it('[4747]: Search and UI Validation of document library search view', async () => {
            await activityTabPo.addActivityNote(addNoteText);
            await activityTabPo.clickOnAttachLink();
            await attachDocumentBladePo.clickOnAdvanceSearchButton();
            await attachDocumentBladePo.searchRecord(publish[0]);
            expect(await attachDocumentBladePo.isBladeTitleDisplayed()).toBeTruthy(': Attach Document Blade title is missing');
            expect(await attachDocumentBladePo.getTextOfDocumentListHeading()).toContain('Document Library ');
            expect(await attachDocumentBladePo.isAttachFromLocalDriveButtonDisplayed()).toBeTruthy('Failure: Attach from local drive button is missing');
            expect(await attachDocumentBladePo.isAttachButtonDisplayed()).toBeTruthy('Failure: Attach button is missing');
            expect(await attachDocumentBladePo.isCancelButtonDisplayed()).toBeTruthy('Failure: cancel button is missing');
            expect(await attachDocumentBladePo.isDocumentInfoDisplayed(publish[0])).toBeTruthy('Failure: Document name is missing');
            expect(await attachDocumentBladePo.isDocumentInfoDisplayed(documentDate)).toBeTruthy('Failure: Date is missing');
            expect(await attachDocumentBladePo.isDocumentInfoDisplayed('bwfJpg.jpg')).toBeTruthy('Failure: File name is missing');
        });
        it('[4747]: Search and UI Validation of document library search view', async () => {
            await attachDocumentBladePo.searchRecord('%');
            expect(await attachDocumentBladePo.isPaginationPresent()).toBeTruthy('Failure: Pagination is missing');
            await resourcesTabPo.clickOnAdvancedSearchSettingsIconToOpen();
            expect(await resourcesTabPo.isAdvancedSearchFilterDropDownLabelDisplayed('Operational Category 1')).toBeTruthy('Failure: Operational Category 1 is missing2');
            expect(await resourcesTabPo.isAdvancedSearchFilterDropDownLabelDisplayed('Operational Category 2')).toBeFalsy('Failure: Operational Category 2 is missing');
            expect(await resourcesTabPo.isAdvancedSearchFilterDropDownLabelDisplayed('Operational Category 3')).toBeFalsy('Failure: Operational Category 3 is missing');
            expect(await resourcesTabPo.isAdvancedSearchFilterDropDownLabelDisplayed('Operational Category 4')).toBeFalsy('Failure: Operational Category 4 is missing');

            expect(await resourcesTabPo.isValuePresentInDropdown( 'Employee Relations')).toBeTruthy('Failure: Operational Category 1 is missing');
            await resourcesTabPo.clickOnAdvancedSearchSettingsIconToOpen();
            await resourcesTabPo.clickOnAdvancedSearchSettingsIconToOpen();
            expect(await resourcesTabPo.isValuePresentInDropdown('Compensation')).toBeFalsy('Failure: Operational Category 2 is displayed');
            await resourcesTabPo.clickOnAdvancedSearchSettingsIconToOpen();
            await resourcesTabPo.clickOnAdvancedSearchSettingsIconToOpen();
            expect(await resourcesTabPo.isValuePresentInDropdown('Bonus')).toBeFalsy('Failure: Operational Category 3 is displayed');
            await resourcesTabPo.clickOnAdvancedSearchSettingsIconToOpen();
            await resourcesTabPo.clickOnAdvancedSearchSettingsIconToOpen();
            expect(await resourcesTabPo.isValuePresentInDropdown('Retention Bonus')).toBeFalsy('Failure: Operational Category 4 is displayed');
            await resourcesTabPo.clickOnAdvancedSearchSettingsIconToOpen();
            await resourcesTabPo.clickOnAdvancedSearchSettingsIconToOpen();

            await utilityCommon.selectDropDown('Site', 'Mexico City', DropDownType.Label);
            await utilityCommon.selectDropDown('Operational Category Tier 1', 'Employee Relations', DropDownType.Label);
            await utilityCommon.selectDropDown('Region', 'Americas', DropDownType.Label);
            await resourcesTabPo.clickOnAdvancedSearchFiltersButton('Apply');
            await attachDocumentBladePo.selectDocument();
            await attachDocumentBladePo.clickOnAttachButton();
            await activityTabPo.clickOnAttachLink();
            await attachDocumentBladePo.searchAndAttachDocument(publish[1]);
            await activityTabPo.clickOnPostButton();
            expect(await activityTabPo.isAttachedFileNameDisplayed('bwfJpg.jpg')).toBeTruthy('FailureMsg: bwfJpg.jpg Attached Document is missing');
            expect(await utilityCommon.deleteAlreadyDownloadedFile('bwfJpg.jpg')).toBeTruthy('FailureMsg: bwfJpg.jpg File is delete sucessfully');
            await activityTabPo.clickAndDownloadAttachmentFile('bwfJpg.jpg');
            expect(await utilityCommon.isFileDownloaded('bwfJpg.jpg')).toBeTruthy('FailureMsg: bwfJpg.jpg File is not downloaded.');
            expect(await activityTabPo.isAttachedFileNameDisplayed('bwfPdf.pdf')).toBeTruthy('FailureMsg: bwfPdf.pdf Attached Document is missing');
            expect(await utilityCommon.deleteAlreadyDownloadedFile('bwfPdf.pdf')).toBeTruthy('FailureMsg: bwfPdf.pdf File is delete sucessfully');
            await activityTabPo.clickAndDownloadAttachmentFile('bwfPdf.pdf');
            expect(await utilityCommon.isFileDownloaded('bwfPdf.pdf')).toBeTruthy('FailuerMsg: bwfPdf.pdf File is not downloaded.');
        });
        afterAll(async () => {
            await utilityCommon.closeAllBlades();
        });
    });

    //kgaikwad
    describe('[4746]: Attach documents from local drive and document library at the same time', async () => {
        let caseId, excelFile = '../../data/ui/attachment/bwfXlsx.xlsx';
        let addNoteText = [...Array(10)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        let publish: string[] = ['drdmv13536_publish_document1', 'drdmv13536_publish_document2'];
        let files: string[] = [filePath1, filePath2];
        beforeAll(async () => {
            for (let i = 0; i < publish.length; i++) {
                let publishDocLibData1 = {
                    docLibTitle: publish[i],
                    company: 'Petramco',
                    businessUnit: 'United States Support',
                    ownerGroup: 'US Support 3',
                }
                await apiHelper.apiLogin('tadmin');
                await apiHelper.deleteDocumentLibrary(publishDocLibData1.docLibTitle);
                await apiHelper.apiLogin("qgeorge");
                let getFilePath1 = files[i];
                let docLib = await apiHelper.createDocumentLibrary(publishDocLibData1, getFilePath1);
                await apiHelper.apiLogin("qgeorge");
                await apiHelper.giveReadAccessToDocLib(docLib, "GB Support 2");
                await apiHelper.publishDocumentLibrary(docLib);
            }
        });
        it('[4746]: Attach documents from local drive and document library at the same time', async () => {
            await navigationPage.signOut();
            await loginPage.login("qgeorge");
            await navigationPage.gotoCreateCase();
            await createCasePo.selectRequester('qtao');
            await createCasePo.setSummary('drdmv-13536' + caseSummary);
            await createCasePo.clickAssignToMeButton();
            await createCasePo.clickSaveCaseButton();
            await previewCasePo.clickGoToCaseButton();
            caseId = await viewCasePo.getCaseID();
            await activityTabPo.addActivityNote(addNoteText);
            await activityTabPo.addAttachment([excelFile]);
            await activityTabPo.clickOnAttachLink();
            await attachDocumentBladePo.searchAndAttachDocument(publish[0]);
            await activityTabPo.clickOnAttachLink();
            await attachDocumentBladePo.searchAndAttachDocument(publish[1]);
            await activityTabPo.clickOnPostButton();
        });
        it('[4746]: Attach documents from local drive and document library at the same time', async () => {
            await activityTabPo.applyActivityFilter('General Notes');
            expect(await activityTabPo.clickShowMoreLinkInAttachmentActivity(1)).toBeTruthy('show more link is not displayed')
            expect(await activityTabPo.isAttachedFileNameDisplayed('bwfJpg.jpg')).toBeTruthy('FailureMsg: bwfJpg.jpg Attached Document is missing');
            expect(await utilityCommon.deleteAlreadyDownloadedFile('bwfJpg.jpg')).toBeTruthy('FailureMsg: bwfJpg.jpg File is delete sucessfully');
            await activityTabPo.clickAndDownloadAttachmentFile('bwfJpg.jpg');
            expect(await utilityCommon.isFileDownloaded('bwfJpg.jpg')).toBeTruthy('FailureMsg: bwfJpg.jpg File is not downloaded.');
            expect(await activityTabPo.isAttachedFileNameDisplayed('bwfPdf.pdf')).toBeTruthy('FailureMsg: bwfPdf.pdf Attached Document is missing');
            expect(await utilityCommon.deleteAlreadyDownloadedFile('bwfPdf.pdf')).toBeTruthy('FailureMsg: bwfPdf.pdf File is delete sucessfully');
            await activityTabPo.clickAndDownloadAttachmentFile('bwfPdf.pdf');
            expect(await utilityCommon.isFileDownloaded('bwfPdf.pdf')).toBeTruthy('FailureMsg: bwfPdf.pdf File is not downloaded.');
        });
        it('[4746]: Attach documents from local drive and document library at the same time', async () => {
            expect(await activityTabPo.isAttachedFileNameDisplayed('bwfXlsx.xlsx')).toBeTruthy('FailureMsg:bwfXlsx.xlsx Attached Document is missing');
            expect(await utilityCommon.deleteAlreadyDownloadedFile('bwfXlsx.xlsx')).toBeTruthy('FailureMsg: bwfXlsx.xlsx File is delete sucessfully');
            await activityTabPo.clickAndDownloadAttachmentFile('bwfXlsx.xlsx');
            expect(await utilityCommon.isFileDownloaded('bwfXlsx.xlsx')).toBeTruthy('FailureMsg: bwfXlsx.xlsx File is not downloaded.');

            await viewCasePo.clickOnTab('Case Access');
            await accessTabPo.clickToExpandAccessEntitiySearch('Agent Access', 'Case');
            await accessTabPo.selectAgent('qstrong', 'Agent');
            await accessTabPo.clickAccessEntitiyAddButton('Agent');
            expect(await accessTabPo.isAccessTypeOfEntityDisplayed('Quin Strong', 'Read')).toBeTruthy('Failuer: Quin Strong Agent Name is missing');
            await accessTabPo.selectAgent('Quigley Heroux', 'Agent');
            await accessTabPo.clickAccessEntitiyAddButton('Agent');
            expect(await accessTabPo.isAccessTypeOfEntityDisplayed('Quigley Heroux', 'Read')).toBeTruthy('Failuer: Fritz Schulz Name is missing');
        });
        it('[4746]: Attach documents from local drive and document library at the same time', async () => {
            await navigationPage.signOut();
            await loginPage.login('qstrong');
            await caseConsolePo.searchAndOpenCase(caseId);
            await activityTabPo.applyActivityFilter('General Notes');
            expect(await activityTabPo.clickShowMoreLinkInAttachmentActivity(1)).toBeTruthy('show more link is not displayed')
            expect(await activityTabPo.isAttachedFileNameDisplayed('bwfJpg.jpg')).toBeTruthy('FailureMsg:bwfJpg.jpg Attached Document is missing');
            expect(await utilityCommon.deleteAlreadyDownloadedFile('bwfJpg.jpg')).toBeTruthy('FailureMsg: bwfJpg.jpg File is delete sucessfully');
            await activityTabPo.clickAndDownloadAttachmentFile('bwfJpg.jpg');
            expect(await utilityCommon.isFileDownloaded('bwfJpg.jpg')).toBeTruthy('FailureMsg: bwfJpg.jpg File is not downloaded.');
            expect(await activityTabPo.isAttachedFileNameDisplayed('bwfPdf.pdf')).toBeTruthy('FailureMsg:bwfPdf.pdf Attached Document is missing');
            expect(await utilityCommon.deleteAlreadyDownloadedFile('bwfPdf.pdf')).toBeTruthy('FailureMsg: bwfPdf.pdf File is delete sucessfully');
            await activityTabPo.clickAndDownloadAttachmentFile('bwfPdf.pdf');
            expect(await utilityCommon.isFileDownloaded('bwfPdf.pdf')).toBeTruthy('FailureMsg: bwfPdf.pdf File is not downloaded.');
            expect(await activityTabPo.isAttachedFileNameDisplayed('bwfXlsx.xlsx')).toBeTruthy('FailureMsg:bwfXlsx.xlsx Attached Document is missing');
            expect(await utilityCommon.deleteAlreadyDownloadedFile('bwfXlsx.xlsx')).toBeTruthy('FailureMsg: bwfXlsx.xlsx File is delete sucessfully');
            await activityTabPo.clickAndDownloadAttachmentFile('bwfXlsx.xlsx');
            expect(await utilityCommon.isFileDownloaded('bwfXlsx.xlsx')).toBeTruthy('FailureMsg: bwfXlsx.xlsx File is not downloaded.');
        });
        it('[4746]: Attach documents from local drive and document library at the same time', async () => {
            await navigationPage.signOut();
            await loginPage.login('qheroux');
            await caseConsolePo.searchAndOpenCase(caseId);
            await activityTabPo.applyActivityFilter('General Notes');
            expect(await activityTabPo.isAttachedFileNameDisplayed('bwfXlsx.xlsx')).toBeTruthy('FailureMsg:bwfXlsx.xlsx Attached Document is missing');
            expect(await utilityCommon.deleteAlreadyDownloadedFile('bwfXlsx.xlsx')).toBeTruthy('FailureMsg: bwfXlsx.xlsx File is delete sucessfully');
            await activityTabPo.clickAndDownloadAttachmentFile('bwfXlsx.xlsx');
            expect(await utilityCommon.isFileDownloaded('bwfXlsx.xlsx')).toBeTruthy('FailureMsg: bwfXlsx.xlsx File is not downloaded.');
            await activityTabPo.clickPlusIconOnMultipleAttachmentInActivity();
            expect(await activityTabPo.isAttachedFileNameDisplayed('bwfJpg.jpg')).toBeTruthy('FailureMsg:bwfJpg.jpg Attached Document is displayed');
            expect(await activityTabPo.isAttachedFileNameDisplayed('bwfPdf.pdf')).toBeTruthy('FailureMsg:bwfPdf.pdf Attached Document is displayed');
        });
        afterAll(async () => {
            await navigationPage.signOut();
            await loginPage.login('qkatawazi');
        });
    });

    //kgaikwad
    describe('[4769]: Compose Email - Case manager attaches published document from document library where case manager is author of the document', async () => {
        let loginId2 = 'casemanagerwithdocmanager';
        let password = 'Password_1234';
        let caseAgentuserData1, publishDocLibData1, draftDocLibData;
        let publish: string[];
        beforeAll(async () => {
            await apiHelper.apiLogin('tadmin');
            await apiHelper.createEmailBox('outgoing');

            publishDocLibData1 = {
                docLibTitle: 'drdmv13508_publish_document3',
                company: 'Petramco',
                businessUnit: 'HR Support',
                ownerGroup: 'Staffing',
            }
            await apiHelper.apiLogin('tadmin');
            await apiHelper.deleteDocumentLibrary(publishDocLibData1.docLibTitle);
            await apiHelper.apiLogin('elizabeth');
            let docLib3 = await apiHelper.createDocumentLibrary(publishDocLibData1, filePath3);
            await apiHelper.publishDocumentLibrary(docLib3);

            publish = ['drdmv13508_publish_document1', 'drdmv13508_publish_document2', 'drdmv13508_publish_document5'];
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
                await apiHelper.apiLogin('qgeorge');
                let getFilePath1 = files1[i];
                let docLib = await apiHelper.createDocumentLibrary(publishDocLibData2, getFilePath1);
                await apiHelper.publishDocumentLibrary(docLib);
            }
            draftDocLibData = {
                docLibTitle: 'drdmv13508_draft_document',
                company: 'Petramco',
                businessUnit: 'HR Support',
                ownerGroup: 'Compensation and Benefits',
                shareExternally: true
            }
            await apiHelper.apiLogin('tadmin');
            await apiHelper.deleteDocumentLibrary(draftDocLibData.docLibTitle);
            await apiHelper.apiLogin('qdu');
            await apiHelper.createDocumentLibrary(draftDocLibData, filePath4);
        });
        it('[4769]: Compose Email - Case manager attaches published document from document library where case manager is author of the document', async () => {
            await navigationPage.signOut();
            await loginPage.login('qdu');
            await navigationPage.gotoCreateCase();
            await createCasePo.selectRequester('qtao');
            await createCasePo.setSummary(caseSummary);
            await createCasePo.clickSaveCaseButton();
            await previewCasePo.clickGoToCaseButton();
            await viewCasePo.clickOnEmailLink();
            await composeMailPo.clickOnAttachmentLink();

            await attachDocumentBladePo.clickOnAdvanceSearchButton();
            await attachDocumentBladePo.searchRecord(publishDocLibData1.docLibTitle);
            expect(await attachDocumentBladePo.isDocumentLibaryPresent(publishDocLibData1.docLibTitle)).toBeFalsy('FailuerMsg: drdmv13508_publish_document3 doc is displayed');
            await attachDocumentBladePo.searchRecord(draftDocLibData.docLibTitle);
            expect(await attachDocumentBladePo.isDocumentLibaryPresent(draftDocLibData.docLibTitle)).toBeFalsy('FailuerMsg: drdmv13508_draft_document doc is displayed');
        });
        it('[4769]: Compose Email - Case manager attaches published document from document library where case manager is author of the document', async () => {
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
        it('[4769]: Compose Email - Case manager attaches published document from document library where case manager is author of the document', async () => {
            await viewCasePo.clickOnEmailLink();
            await composeMailPo.clickOnAttachmentLink();
            await attachDocumentBladePo.searchAndAttachDocument(publish[1]);
            await composeMailPo.clickOnAttachmentLink();
            await attachDocumentBladePo.searchAndAttachDocument(publish[2]);
            await composeMailPo.setToOrCCInputTextbox('To', 'fritz.schulz@petramco.com');
            await composeMailPo.clickOnSendButton();
        });
        it('[4769]: Compose Email - Case manager attaches published document from document library where case manager is author of the document', async () => {
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
            await utilityCommon.clickOnApplicationWarningYesNoButton("Yes");
            await navigationPage.signOut();
            await loginPage.login('qkatawazi');
        });
    });

    //kgaikwad
    describe('[4750]: Access to the documents attached on case when case is re-assigned to some other support group', async () => {
        let caseId, publishDocLibData1, publishDocLibData2;
        beforeAll(async () => {
            publishDocLibData1 = {
                docLibTitle: 'drdmv13528_publish_document1',
                company: 'Petramco',
                businessUnit: 'United States Support',
                ownerGroup: 'US Support 3',
            }
            await apiHelper.apiLogin('tadmin');
            await apiHelper.deleteDocumentLibrary(publishDocLibData1.docLibTitle);
            await apiHelper.apiLogin("qgeorge");
            let docLib1 = await apiHelper.createDocumentLibrary(publishDocLibData1, filePath1);
            await apiHelper.giveReadAccessToDocLib(docLib1, "GB Support 2");
            await apiHelper.publishDocumentLibrary(docLib1);

            publishDocLibData2 = {
                docLibTitle: 'drdmv13528_publish_document2',
                company: 'Petramco',
                businessUnit: 'HR Support',
                ownerGroup: 'Compensation and Benefits',
            }
            await apiHelper.apiLogin('tadmin');
            await apiHelper.deleteDocumentLibrary(publishDocLibData2.docLibTitle);
            await apiHelper.apiLogin("qgeorge");
            let docLib2 = await apiHelper.createDocumentLibrary(publishDocLibData2, filePath2);
            await apiHelper.publishDocumentLibrary(docLib2);
        });
        it('[4750]: Access to the documents attached on case when case is re-assigned to some other support group', async () => {
            await navigationPage.signOut();
            await loginPage.login("qgeorge");
            await navigationPage.gotoCreateCase();
            await createCasePo.selectRequester('qtao');
            await createCasePo.setSummary(caseSummary);
            await changeAssignmentBladePo.setDropDownValue('AssignedGroup', 'GB Support 2');
            await changeAssignmentBladePo.setDropDownValue('Assignee', 'Quin Strong');
            await createCasePo.clickSaveCaseButton();
            await previewCasePo.clickGoToCaseButton();
            caseId = await viewCasePo.getCaseID();
            await viewCasePo.clickEditCaseButton();
            await editCasePo.clickOnAttachLink();
            await attachDocumentBladePo.searchAndAttachDocument(publishDocLibData1.docLibTitle);
            await editCasePo.clickOnAttachLink();
            await attachDocumentBladePo.searchAndAttachDocument(publishDocLibData2.docLibTitle);
            await editCasePo.clickSaveCase();
        });
        it('[4750]: Access to the documents attached on case when case is re-assigned to some other support group', async () => {
            expect(await viewCasePo.isAttachedDocumentPresent('bwfJpg.jpg')).toBeTruthy('FailureMsg: bwfJpg.jpg Attached Document is missing');
            expect(await utilityCommon.deleteAlreadyDownloadedFile('bwfJpg.jpg')).toBeTruthy('FailureMsg: bwfJpg.jpg File is delete sucessfully');
            await viewCasePo.clickOnAttachedDocumentFile('bwfJpg.jpg');
            expect(await utilityCommon.isFileDownloaded('bwfJpg.jpg')).toBeTruthy('FailureMsg: bwfJpg.jpg File is not downloaded.');

            expect(await viewCasePo.isAttachedDocumentPresent('bwfPdf.pdf')).toBeTruthy('FailureMsg: bwfPdf.pdf Attached Document is missing');
            expect(await utilityCommon.deleteAlreadyDownloadedFile('bwfPdf.pdf')).toBeTruthy('FailureMsg: bwfPdf.pdf File is delete sucessfully');
            await viewCasePo.clickOnAttachedDocumentFile('bwfPdf.pdf');
            expect(await utilityCommon.isFileDownloaded('bwfPdf.pdf')).toBeTruthy('FailureMsg: bwfPdf.pdf File is not downloaded.');
        });
        it('[4750]: Access to the documents attached on case when case is re-assigned to some other support group', async () => {
            await navigationPage.signOut();
            await loginPage.login('qstrong');
            await caseConsolePo.searchAndOpenCase(caseId);
            expect(await viewCasePo.isAttachedDocumentPresent('bwfJpg.jpg')).toBeTruthy('FailureMsg: bwfJpg.jpg Attached Document is missing');
            expect(await utilityCommon.deleteAlreadyDownloadedFile('bwfJpg.jpg')).toBeTruthy('FailureMsg: bwfJpg.jpg File is delete sucessfully');
            await viewCasePo.clickOnAttachedDocumentFile('bwfJpg.jpg');
            expect(await utilityCommon.isFileDownloaded('bwfJpg.jpg')).toBeTruthy('FailureMsg: bwfJpg.jpg File is not downloaded.');
            expect(await viewCasePo.isAttachedDocumentPresent('bwfPdf.pdf')).toBeTruthy('FailuerMsg: bwfPdf.pdf Attached Document is displayed');
        });
        it('[4750]: Access to the documents attached on case when case is re-assigned to some other support group', async () => {
            await navigationPage.signOut();
            await loginPage.login("qgeorge");
            await caseConsolePo.searchAndOpenCase(caseId);
            await viewCasePo.clickEditCaseButton();
            await changeAssignmentBladePo.setDropDownValue('AssignedGroup', 'US Support 2');
            await changeAssignmentBladePo.setDropDownValue('Assignee', 'Quanah George');
            await editCasePo.clickSaveCase();
            expect(await utilityCommon.getAllPopupMsg()).toContain('Saved successfully.');
            expect(await viewCasePo.isAttachedDocumentPresent('bwfJpg.jpg')).toBeFalsy('FailureMsg: bwfJpg.jpg Attached Document is displayed');
            expect(await viewCasePo.isAttachedDocumentPresent('bwfPdf.pdf')).toBeFalsy('FailureMsg: bwfPdf.pdf Attached Document is displayed');
        });
        afterAll(async () => {
            await navigationPage.signOut();
            await loginPage.login('qkatawazi');
        });
    });
});
