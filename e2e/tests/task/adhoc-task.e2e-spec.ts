import { browser } from "protractor";
import apiHelper from '../../api/api.helper';
import attachmentBladePo from '../../pageobject/attachment/attachment-blade.po';
import attachmentInformationBladePo from '../../pageobject/attachment/attachment-information-blade.po';
import caseConsolePo from '../../pageobject/case/case-console.po';
import previewCasePo from '../../pageobject/case/case-preview.po';
import createCasePage from '../../pageobject/case/create-case.po';
import viewCasePage from "../../pageobject/case/view-case.po";
import changeAssignmentBladePo from '../../pageobject/common/change-assignment-blade.po';
import loginPage from "../../pageobject/common/login.po";
import navigationPage from "../../pageobject/common/navigation.po";
import updateStatusBladePo from '../../pageobject/common/update.status.blade.po';
import activityTabPo from '../../pageobject/social/activity-tab.po';
import taskConsole from "../../pageobject/task/console-task.po";
import adhoctaskTemplate from "../../pageobject/task/create-adhoc-task.po";
import editTask from "../../pageobject/task/edit-task.po";
import manageTask from "../../pageobject/task/manage-task-blade.po";
import viewTask from "../../pageobject/task/view-task.po";
import { BWF_BASE_URL } from '../../utils/constants';
import utilCommon from '../../utils/util.common';
import utilityCommon from '../../utils/utility.common';
import utilityGrid from '../../utils/utility.grid';

describe('Create Adhoc task', () => {
    beforeAll(async () => {
        await browser.get(BWF_BASE_URL);
        await loginPage.login('qtao');
    });

    afterAll(async () => {
        await utilityCommon.closeAllBlades();
        await navigationPage.signOut();
    });

    it('[DRDMV-3820,DRDMV-1239]: Adhoc Task Create view (UI verification)', async () => {
        let summary = 'Adhoc task' + Math.floor(Math.random() * 1000000);
        //Create Case
        await navigationPage.gotoCreateCase();
        await createCasePage.selectRequester("adam");
        await createCasePage.setSummary('Summary ' + summary);
        await createCasePage.clickAssignToMeButton();
        await createCasePage.clickSaveCaseButton();
        await previewCasePo.clickGoToCaseButton();

        //Adhoc task validation
        await viewCasePage.clickAddTaskButton();
        await manageTask.clickAddAdhocTaskButton();
        expect(await adhoctaskTemplate.isTaskSummaryRequiredTextPresent()).toBeTruthy();
        expect(await adhoctaskTemplate.isPriorityRequiredTextPresent()).toBeTruthy();
        expect(await adhoctaskTemplate.isAssignedCompanyRequiredTextPresent()).toBeTruthy();
        expect(await adhoctaskTemplate.isAssignedGroupRequiredTextPresent()).toBeTruthy();

        expect(await adhoctaskTemplate.getSaveButtonAttribute('disabled')).toBeFalsy();
        expect(await adhoctaskTemplate.getStatusAttribute()).toBeTruthy();
        expect(await adhoctaskTemplate.getAssignCompanyAttribute()).toBeTruthy();
        expect(await adhoctaskTemplate.getBuisnessUnitAttribute()).toBeTruthy();
        expect(await adhoctaskTemplate.getAssigneeAttribute()).toBeTruthy();
        expect(await adhoctaskTemplate.getDepartmentAttribute()).toBeTruthy();
        expect(await adhoctaskTemplate.getAssignedGroupAttribute()).toBeTruthy();
        expect(await adhoctaskTemplate.getchangeAssignmentButtonText()).toBeTruthy();
        expect(await adhoctaskTemplate.isAssignToMeButtonDisplayd()).toBeTruthy();
        expect(await adhoctaskTemplate.ischangeAssignmentButtonDisplayed()).toBeTruthy();
        await adhoctaskTemplate.setSummary(summary);
        await adhoctaskTemplate.setDescription("Description");
        await adhoctaskTemplate.selectPriority('High');
        await adhoctaskTemplate.selectCategoryTier1('Applications');
        await adhoctaskTemplate.selectCategoryTier2('Social');
        await adhoctaskTemplate.selectCategoryTier3('Chatter');
        await adhoctaskTemplate.clickSaveAdhoctask();
        await utilityCommon.closePopUpMessage();
        expect(await manageTask.isTaskLinkPresent(summary)).toBeTruthy();
        await manageTask.clickCloseButton();
    });

    describe('[DRDMV-3821,DRDMV-7130,DRDMV-1580,DRDMV-12243]: Adhoc Task details validation', async () => {
        let summary = 'Adhoc task ' + [...Array(10)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        let newCase, caseData;
        beforeAll(async () => {
            caseData = {
                "Requester": "apavlik",
                "Summary": "DRDMV-3821 " + summary,
            }
            await apiHelper.apiLogin('qtao');
            newCase = await apiHelper.createCase(caseData);
        });
        it('[DRDMV-3821,DRDMV-7130,DRDMV-1580,DRDMV-12243]: Create Adhoc Task', async () => {
            await navigationPage.gotoCaseConsole();
            await caseConsolePo.searchAndOpenCase(newCase.displayId);
            //Adhoc task validation
            await viewCasePage.clickAddTaskButton();
            await manageTask.clickAddAdhocTaskButton();
            expect(await adhoctaskTemplate.isAttachmentButtonDisplayed()).toBeTruthy();
            await adhoctaskTemplate.setSummary(summary);
            await adhoctaskTemplate.setDescription("Description");
            await adhoctaskTemplate.selectPriority('High');
            await adhoctaskTemplate.selectCategoryTier1('Applications');
            await adhoctaskTemplate.selectCategoryTier2('Social');
            await adhoctaskTemplate.selectCategoryTier3('Chatter');
            await adhoctaskTemplate.clickAssignToMeButton();
            await adhoctaskTemplate.clickSaveAdhoctask();
            await utilityCommon.closePopUpMessage();
        });
        it('[DRDMV-3821,DRDMV-7130,DRDMV-1580,DRDMV-12243]: Adhoc Task details view (UI verification)', async () => {
            await manageTask.clickTaskLink(summary);
            expect(await adhoctaskTemplate.isProcessFieldPresent()).toBeFalsy();
            expect(await viewTask.getTaskTypeValue()).toBe('Manual');
            expect(await viewTask.isProcessNameValue()).toBeFalsy();
            expect(await viewTask.isTaskSummaryDisplayed()).toBeTruthy();
            expect(await viewTask.isTaskIdTextDisplayed()).toBeTruthy();
            expect(await viewTask.isTaskIconDisplayed()).toBeTruthy();
            expect(await viewTask.isTaskPriorityDisplayed()).toBeTruthy();
            expect(await viewTask.isTaskTimeDetailsDisplayed()).toBeTruthy();
            expect(await viewTask.isCaseSummaryDisplayed()).toBeTruthy();
            expect(await viewTask.isRequesterNameDisplayed()).toBeTruthy();
            expect(await viewTask.isRequesterContactDisplayed()).toBeTruthy();
            expect(await viewTask.isRequesterMailDisplayed()).toBeTruthy();
            expect(await viewTask.isEditLinkDisplayed()).toBeTruthy();
            expect(await viewTask.isCategoryTier1ValueDisplayed()).toBeTruthy();
            expect(await viewTask.isCategoryTier2ValueDisplayed()).toBeTruthy();
            expect(await viewTask.isCategoryTier3ValueDisplayed()).toBeTruthy();
            expect(await viewTask.isAssigneeNameDisplayed()).toBeTruthy();
            expect(await viewTask.isAssignCompanyDisplayed()).toBeTruthy();
            expect(await viewTask.isAssignGroupTextDisplayed()).toBeTruthy();
            expect(await viewTask.clickOnTab('Activity')); // validation to check activity tab is present
            await viewTask.clickOnViewCase();
            expect(await viewCasePage.getCaseSummary()).toBe(caseData.Summary);
        });
        afterAll(async () => {
            await utilityCommon.closeAllBlades();
        });
    });

    describe('[DRDMV-1500]: [Permissions] Navigating to case from the task', async () => {
        let randomStr = [...Array(10)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        let newCase, taskTemplateData;
        beforeAll(async () => {
            // create manual task template
            taskTemplateData = {
                "templateName": `${randomStr} Manual task`,
                "templateSummary": `${randomStr} Manual task summary`,
                "templateStatus": "Active",
                "taskCompany": "Petramco",
                "buisnessUnit": "HR Support",
                "supportGroup": "Workforce Administration",
                "assignee": "Elizabeth",
                "ownerCompany": "Petramco",
                "ownerBusinessUnit": "HR Support",
                "ownerGroup": "Workforce Administration"
            }
            // create case
            let caseData = {
                "Requester": "apavlik",
                "Summary": 'Summary ' + randomStr,
                "Assigned Company": "Petramco",
                "Business Unit": "United States Support",
                "Support Group": "US Support 1",
                "Assignee": "qtao"
            }
            await apiHelper.apiLogin('qkatawazi');
            await apiHelper.createManualTaskTemplate(taskTemplateData);
            newCase = await apiHelper.createCase(caseData);
        });
        it('[DRDMV-1500]: Add task to Case and set case to In Progress', async () => {
            await navigationPage.gotoCaseConsole();
            await caseConsolePo.searchAndOpenCase(newCase.displayId);
            await viewCasePage.clickAddTaskButton();
            await manageTask.addTaskFromTaskTemplate(taskTemplateData.templateName);
            await manageTask.clickCloseButton();
            await updateStatusBladePo.changeCaseStatus('In Progress');
            await updateStatusBladePo.clickSaveStatus('In Progress');
        });
        it('[DRDMV-1500]: Case View link is not visible', async () => {
            await navigationPage.signOut();
            await loginPage.login('elizabeth');
            await navigationPage.gotoTaskConsole();
            await utilityGrid.clearFilter();
            await taskConsole.setTaskSearchBoxValue(taskTemplateData.templateSummary);
            expect(await utilityGrid.getFirstGridRecordColumnValue('Case ID')).toBe("", " Case Id Displayed in Task console");
            await utilityGrid.searchAndOpenHyperlink(taskTemplateData.templateSummary);
            expect(await viewTask.isCaseViewLinkDisplayed()).toBeFalsy('Case View Link is displayed');
        });
        it('[DRDMV-1500]: [Permissions] Navigating to case from the task', async () => {
            await navigationPage.signOut();
            await loginPage.login('qfeng');
            await navigationPage.gotoTaskConsole();
            await utilityGrid.clearFilter();
            await taskConsole.setTaskSearchBoxValue(taskTemplateData.templateSummary);
            expect(await utilityGrid.getFirstGridRecordColumnValue('Case ID')).toBe(newCase.displayId, " Case Id NOT displayed in Task console");
            await utilityGrid.searchAndOpenHyperlink(taskTemplateData.templateSummary);
            expect(await viewTask.isCaseViewLinkDisplayed()).toBeTruthy('Case View Link is not displayed');
        });
        afterAll(async () => {
            await navigationPage.signOut();
            await loginPage.login("qtao");
        });
    });

    it('[DRDMV-12249,DRDMV-12244]: Verify task creation with attachments & Verify attachment grid from case', async () => {
        let filePath = '../../data/ui/attachment/demo.txt';
        let summary = 'Adhoc task' + Math.floor(Math.random() * 1000000);
        let caseData = {
            "Requester": "qkatawazi",
            "Summary": summary
        }
        await apiHelper.apiLogin('qtao');
        let newCaseTemplate = await apiHelper.createCase(caseData);
        await caseConsolePo.searchAndOpenCase(newCaseTemplate.displayId);

        //Adhoc task validation
        await viewCasePage.clickAddTaskButton();
        await manageTask.clickAddAdhocTaskButton();
        expect(await adhoctaskTemplate.isAttachmentButtonDisplayed()).toBeTruthy();
        await adhoctaskTemplate.setSummary(summary);
        await adhoctaskTemplate.setDescription("Description");
        await adhoctaskTemplate.addAttachment([filePath]);
        await adhoctaskTemplate.clickSaveAdhoctask();
        await manageTask.clickCloseButton();
        await viewCasePage.clickOnTaskLink(summary);
        expect(await viewTask.isAttachedFileNamePresent('demo.txt')).toBeTruthy('Attached file name is missing');
        await viewTask.clickOnAttachments('demo.txt');
        expect(await utilCommon.deleteAlreadyDownloadedFile('demo.txt')).toBeTruthy('File is delete sucessfully');
        expect(await utilCommon.isFileDownloaded('demo.txt')).toBeTruthy('File is not downloaded.');

        //Navigated To Case and Verify attachments grid for task attachments
        await viewTask.clickOnViewCase();
        await viewCasePage.clickAttachmentsLink();
        await attachmentBladePo.clickFileName('demo');
        let finalDate: string = await utilCommon.getCurrentDate();
        expect(await attachmentInformationBladePo.isDownloadButtonDisplayed()).toBeTruthy('download button is missing');
        expect(await attachmentInformationBladePo.isCloseButtonDisplayed()).toBeTruthy('close button is missing');
        expect(await attachmentInformationBladePo.getValuesOfInformation('File Name')).toBe('File Name: demo', 'FileName is missing');
        expect(await attachmentInformationBladePo.getValuesOfInformation('Task')).toBe('Type: Task', 'Type is missing');
        expect(await attachmentInformationBladePo.getValuesOfInformation('text/plain')).toBe('Media type: text/plain', 'Media Type is missing');
        expect(await attachmentInformationBladePo.getValuesOfInformation('Created date')).toContain(finalDate);
        expect(await attachmentInformationBladePo.getValuesOfInformation(' Qianru Tao')).toBe('Created by: Qianru Tao', 'Created by is missing');
        expect(await attachmentInformationBladePo.isTitleNameDisplayed()).toBeTruthy('Title is missing');
        expect(await utilCommon.deleteAlreadyDownloadedFile('demo.txt')).toBeTruthy('File is delete sucessfully');
        await attachmentInformationBladePo.clickDownloadButton();
        expect(await utilCommon.deleteAlreadyDownloadedFile('demo.txt')).toBeTruthy('File is delete sucessfully');
        await attachmentInformationBladePo.clickCloseButton();
        await attachmentBladePo.clickCloseButton();
    });

    it('[DRDMV-12245]: Verify task attachments deletion', async () => {
        let filePath = '../../data/ui/attachment/demo.txt';
        let summary = 'Adhoc task' + Math.floor(Math.random() * 1000000);
        let caseData = {
            "Requester": "qkatawazi",
            "Summary": summary,
        }
        await apiHelper.apiLogin('qtao');
        let newCaseTemplate = await apiHelper.createCase(caseData);
        await navigationPage.gotoCaseConsole();
        await caseConsolePo.searchAndOpenCase(newCaseTemplate.displayId);

        //Adhoc task validation
        await viewCasePage.clickAddTaskButton();
        await manageTask.clickAddAdhocTaskButton();
        expect(await adhoctaskTemplate.isAttachmentButtonDisplayed()).toBeTruthy();
        await adhoctaskTemplate.setSummary(summary);
        await adhoctaskTemplate.setDescription("Description");
        await adhoctaskTemplate.addAttachment([filePath]);
        await adhoctaskTemplate.clickSaveAdhoctask();
        await manageTask.clickCloseButton();
        await viewCasePage.clickOnTaskLink(summary);
        expect(await viewTask.isAttachedFileNamePresent('demo.txt')).toBeTruthy('Attached file name is not available');
        await viewTask.clickOnEditTask();
        await editTask.removeAttachment('demo.txt');
        await viewTask.clickOnSaveViewAdhoctask();
        expect(await viewTask.isAttachedFileNamePresent('demo.txt')).toBeFalsy('Attached file name is available');
    });

    it('[DRDMV-12246]: Verify attachment addition on edit task mode', async () => {
        let filePath = '../../data/ui/attachment/demo.txt';
        let summary = 'Adhoc task' + Math.floor(Math.random() * 1000000);
        let caseData = {
            "Requester": "qkatawazi",
            "Summary": summary,
        }
        await apiHelper.apiLogin('qtao');
        let newCaseTemplate = await apiHelper.createCase(caseData);
        await navigationPage.gotoCaseConsole();
        await caseConsolePo.searchAndOpenCase(newCaseTemplate.displayId);

        //Adhoc task validation
        await viewCasePage.clickAddTaskButton();
        await manageTask.clickAddAdhocTaskButton();
        await adhoctaskTemplate.setSummary(summary);
        await adhoctaskTemplate.setDescription("Description");
        await adhoctaskTemplate.clickSaveAdhoctask();
        await manageTask.clickCloseButton();
        await viewCasePage.clickOnTaskLink(summary);
        await viewTask.clickOnEditTask();
        await editTask.addAttachment([filePath]);
        await viewTask.clickOnSaveViewAdhoctask();
        expect(await viewTask.isAttachedFileNamePresent('demo')).toBeTruthy('Attached file name is not available');
    });

    it('[DRDMV-12248,DRDMV-12247,DRDMV-12250]: Verify max attachments added to task', async () => {
        let summary = 'Adhoc task' + Math.floor(Math.random() * 1000000);
        let caseData = {
            "Requester": "qkatawazi",
            "Summary": summary
        }
        await apiHelper.apiLogin('qtao');
        let newCase = await apiHelper.createCase(caseData);
        await navigationPage.gotoCaseConsole();
        await caseConsolePo.searchAndOpenCase(newCase.displayId);

        //Adhoc task validation
        await viewCasePage.clickAddTaskButton();
        await manageTask.clickAddAdhocTaskButton();
        expect(await adhoctaskTemplate.isAttachmentButtonDisplayed()).toBeTruthy();
        await adhoctaskTemplate.setSummary(summary);
        await adhoctaskTemplate.setDescription("Description");
        expect(await adhoctaskTemplate.isAttachmentButtonEnabled()).toBeTruthy('Attachment button is disabled');
        let fileName1: string[] = ['articleStatus.png', 'bwfJpg.jpg', 'bwfJpg1.jpg', 'bwfJpg2.jpg', 'bwfJpg3.jpg', 'bwfJpg4.jpg', 'bwfJson1.json', 'bwfJson2.json', 'bwfJson3.json', 'bwfJson4.json', 'bwfJson5.json', 'bwfPdf.pdf', 'bwfPdf1.pdf', 'bwfPdf2.pdf', 'bwfPdf3.pdf', 'bwfPdf4.pdf', 'bwfWord1.rtf', 'bwfWord2.rtf', 'bwfXlsx.xlsx', 'demo.txt'];
        const filesToUpload1 = fileName1.map((file) => { return `../../data/ui/attachment/${file}` });
        await adhoctaskTemplate.addAttachmentInDescription(filesToUpload1);
        expect(await adhoctaskTemplate.isAttachmentButtonEnabled()).toBeFalsy('Attachment button is enabled');
        expect(await adhoctaskTemplate.getAttachmentLimitWarningText()).toBe('The maximum number of attachments allowed is 20');
        await adhoctaskTemplate.clickSaveAdhoctask();
        await utilCommon.closePopUpMessage();
        await browser.sleep(10000); // hardwait to upload multiple files
        await manageTask.clickTaskLink(summary);
        await viewTask.clickShowMoreShowLessLink();
        let fileName2: string[] = ['articleStatus.png', 'bwfJpg.jpg', 'bwfJpg1.jpg', 'bwfJpg2.jpg', 'bwfJpg3.jpg', 'bwfJpg4.jpg', 'bwfJson1.json', 'bwfJson2.json', 'bwfJson3.json', 'bwfJson4.json', 'bwfJson5.json', 'bwfPdf.pdf', 'bwfPdf1.pdf', 'bwfPdf2.pdf', 'bwfPdf3.pdf', 'bwfPdf4.pdf', 'bwfWord1.rtf', 'bwfWord2.rtf', 'bwfXlsx.xlsx', 'demo.txt'];
        for (let j: number = 0; j < fileName2.length; j++) {
            expect(await viewTask.isAttachedFileNamePresent(`${fileName2[j]}`)).toBeTruthy(`${fileName2[j]} Attached file name is missing`);
        }
        await viewTask.clickShowMoreShowLessLink();
        expect(await viewTask.getShowMoreLessAttachmentsLinkText()).toBe('18 more');
    });

    describe('[DRDMV-5480]: [Assignment] Changing the Assignment', async () => {
        let summary = 'Adhoc task' + Math.floor(Math.random() * 1000000);
        let randomStr = [...Array(4)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        let templateData1, caseData, newCase;
        beforeAll(async () => {
            //Create Manual Task
            templateData1 = {
                "templateName": `manualTaskTemplate1 ${randomStr}`,
                "templateSummary": `manualTaskTemplateSummary1 ${randomStr}`,
                "templateStatus": "Active",
                "taskCompany": 'Petramco',
                "ownerCompany": "Petramco",
                "ownerBusinessUnit": "Facilities Support",
                "ownerGroup": "Facilities"
            }
            await apiHelper.apiLogin('qkatawazi');
            await apiHelper.createManualTaskTemplate(templateData1);
            //Create Case
            caseData = {
                "Requester": "apavlik",
                "Summary": 'Summary ' + summary,
            }
            await apiHelper.apiLogin('franz');
            newCase = await apiHelper.createCase(caseData);
        });
        it('[DRDMV-5480]: Assignee validation1', async () => {
            await navigationPage.signOut();
            await loginPage.login('franz');
            await caseConsolePo.searchAndOpenCase(newCase.displayId);
            await viewCasePage.clickAddTaskButton();
            await manageTask.clickAddAdhocTaskButton();
            await adhoctaskTemplate.setSummary("test" + summary);
            await adhoctaskTemplate.clickAssignButton();
            await adhoctaskTemplate.clickSaveAdhoctask();
            await manageTask.addTaskFromTaskTemplate(`manualTaskTemplate1 ${randomStr}`);
            await manageTask.clickTaskLink("test" + summary);
            await viewTask.clickOnEditTask();
            await editTask.clickOnAssignToMe();
            await editTask.clickOnSaveButton();
            await utilityCommon.closePopUpMessage();
            expect((await viewTask.getAssigneeText()).trim()).toBe('Franz Schwarz');
        });
        it('[DRDMV-5480]: Assignee validation2', async () => {
            await viewTask.clickOnEditTask();
            await editTask.clickOnChangeAssignementButton();
            await changeAssignmentBladePo.selectAssignee("Fritz Schulz");
            await changeAssignmentBladePo.clickOnAssignButton();
            await editTask.clickOnSaveButton();
            await utilityCommon.closePopUpMessage();
            expect(await viewTask.getAssigneeText()).toBe('Fritz Schulz');
            expect(await activityTabPo.getAllTaskActivity('Fritz Schulz')).toBe('Fritz Schulz');
            await viewTask.clickOnEditTask();
            await editTask.clickOnChangeAssignementButton();
            await changeAssignmentBladePo.clickOnAssignToMeCheckBox();
            await changeAssignmentBladePo.clickOnAssignButton();
            await editTask.clickOnSaveButton();
            await utilityCommon.closePopUpMessage();
            expect(await viewTask.getAssigneeText()).toBe('Franz Schwarz');
        });
        it('[DRDMV-5480]: Assignee validation3', async () => {
            await viewTask.clickOnEditTask();
            await editTask.clickOnChangeAssignementButton();
            await changeAssignmentBladePo.selectBusinessUnit('Facilities Support');
            await changeAssignmentBladePo.selectSupportGroup('Facilities');
            await changeAssignmentBladePo.selectAssignToSupportGroup();
            await changeAssignmentBladePo.clickOnAssignButton();
            await editTask.clickOnSaveButton();
            await utilityCommon.closePopUpMessage();
            expect(await viewTask.getAssignedGroupText()).toBe('Facilities');
            await viewTask.clickOnEditTask();
            await editTask.clickOnChangeAssignementButton();
            await changeAssignmentBladePo.isSupportGroupDrpDwnDisplayed();
            await changeAssignmentBladePo.selectCompany("Petramco");
            await changeAssignmentBladePo.selectBusinessUnit('United States Support');
            await changeAssignmentBladePo.selectSupportGroup('US Support 3');
            await changeAssignmentBladePo.selectAssignee('Qadim Katawazi');
            await changeAssignmentBladePo.clickOnAssignButton();
            await editTask.clickOnSaveButton();
            await utilityCommon.closePopUpMessage();
            expect(await activityTabPo.getAllTaskActivity('Qadim Katawazi')).toBe('Qadim Katawazi');
            expect(await viewTask.getAssigneeText()).toBe('Qadim Katawazi');
        });
        it('[DRDMV-5480]: Assignee validation4', async () => {
            await viewTask.clickOnEditTask();
            await editTask.clickOnAssignToMe(); // Failing due to slow API response, check with dev
            await editTask.clickOnSaveButton();
            await utilityCommon.closePopUpMessage();
            expect(await viewTask.getAssigneeText()).toBe('Franz Schwarz');
            await viewTask.clickOnEditTask();
            await editTask.clickOnChangeAssignementButton();
            await changeAssignmentBladePo.selectBusinessUnit('Facilities Support');
            await changeAssignmentBladePo.selectSupportGroup('Facilities');
            await changeAssignmentBladePo.selectAssignToSupportGroup();
            await changeAssignmentBladePo.clickOnAssignButton();
            await editTask.clickOnSaveButton();
            await utilityCommon.closePopUpMessage();
            expect(await viewTask.getAssignedGroupText()).toBe('Facilities');
            await viewTask.clickOnEditTask();
            await editTask.clickOnAssignToMe();
            await editTask.clickOnSaveButton();
            expect(await viewTask.getAssigneeText()).toBe('Franz Schwarz');
        });
        it('[DRDMV-5480]: Second Task validation1', async () => {
            await viewTask.clickOnViewCase()
            await viewCasePage.clickAddTaskButton();
            await manageTask.clickTaskLink(`manualTaskTemplateSummary1 ${randomStr}`);
            await viewTask.clickOnEditTask();
            await editTask.clickOnAssignToMe();
            await editTask.clickOnSaveButton();
            await utilityCommon.closePopUpMessage();
            expect((await viewTask.getAssigneeText()).trim()).toBe('Franz Schwarz');
            await viewTask.clickOnEditTask();
            await editTask.clickOnChangeAssignementButton();
            await changeAssignmentBladePo.selectAssignee("Fritz Schulz");
            await changeAssignmentBladePo.clickOnAssignButton();
            await editTask.clickOnSaveButton();
            await utilityCommon.closePopUpMessage();
            expect(await viewTask.getAssigneeText()).toBe('Fritz Schulz');
            expect(await activityTabPo.getAllTaskActivity('Fritz Schulz')).toBe('Fritz Schulz');
            await viewTask.clickOnEditTask();
            await editTask.clickOnChangeAssignementButton();
            await changeAssignmentBladePo.clickOnAssignToMeCheckBox();
            await changeAssignmentBladePo.clickOnAssignButton();
            await editTask.clickOnSaveButton();
            await utilityCommon.closePopUpMessage();
            expect(await viewTask.getAssigneeText()).toBe('Franz Schwarz');
        });
        it('[DRDMV-5480]: Second Task validation2', async () => {
            await viewTask.clickOnEditTask();
            await editTask.clickOnChangeAssignementButton();
            await changeAssignmentBladePo.selectBusinessUnit('Facilities Support');
            await changeAssignmentBladePo.selectSupportGroup('Facilities');
            await changeAssignmentBladePo.selectAssignToSupportGroup();
            await changeAssignmentBladePo.clickOnAssignButton();
            await editTask.clickOnSaveButton();
            await utilityCommon.closePopUpMessage();
            expect(await viewTask.getAssignedGroupText()).toBe('Facilities');
            await viewTask.clickOnEditTask();
            await editTask.clickOnChangeAssignementButton();
            await changeAssignmentBladePo.isSupportGroupDrpDwnDisplayed();
            await changeAssignmentBladePo.selectCompany("Petramco");
            await changeAssignmentBladePo.selectBusinessUnit('United States Support');
            await changeAssignmentBladePo.selectSupportGroup('US Support 3');
            await changeAssignmentBladePo.selectAssignee('Qadim Katawazi');
            await changeAssignmentBladePo.clickOnAssignButton();
            await editTask.clickOnSaveButton();
            await utilityCommon.closePopUpMessage();
            expect(await activityTabPo.getAllTaskActivity('Qadim Katawazi')).toBe('Qadim Katawazi');
            expect(await viewTask.getAssigneeText()).toBe('Qadim Katawazi');
        });
        it('[DRDMV-5480]: [Assignment] Changing the Assignment when editing the task by the member of one Support Group', async () => {
            await viewTask.clickOnEditTask();
            await editTask.clickOnAssignToMe();
            await editTask.clickOnSaveButton();
            await utilityCommon.closePopUpMessage();
            expect(await viewTask.getAssigneeText()).toBe('Franz Schwarz');
            await viewTask.clickOnEditTask();
            await editTask.clickOnChangeAssignementButton();
            await changeAssignmentBladePo.selectBusinessUnit('Facilities Support');
            await changeAssignmentBladePo.selectSupportGroup('Facilities');
            await changeAssignmentBladePo.selectAssignToSupportGroup();
            await changeAssignmentBladePo.clickOnAssignButton();
            await editTask.clickOnSaveButton();
            await utilityCommon.closePopUpMessage();
            expect(await viewTask.getAssignedGroupText()).toBe('Facilities');
            await viewTask.clickOnEditTask();
            await editTask.clickOnAssignToMe();
            await editTask.clickOnSaveButton();
            expect(await viewTask.getAssigneeText()).toBe('Franz Schwarz');
        });
        afterAll(async () => {
            await navigationPage.signOut();
            await loginPage.login("qtao");
        });
    });

    it('[DRDMV-3828]: [Task Workspace] Task Workspace verification', async () => {
        await navigationPage.gotoTaskConsole();
        await utilityGrid.clearFilter();
        let allHeaders: string[] = ["Task ID", "Case ID", "Priority", "Task Type", "Status", "Summary", "Assigned Group", "Assignee", "Modified Date", "SLM Status"];
        let remainingHeaders: string[] = ["Task ID", "Case ID", "Priority", "Task Type", "Status", "Summary", "Assigned Group", "Assignee", "Modified Date"]
        let removeHeader: string[] = ["SLM Status"];
        await utilityGrid.areColumnHeaderMatches(allHeaders);
        await utilityGrid.removeGridColumn(removeHeader);
        await utilityGrid.areColumnHeaderMatches(remainingHeaders);
        await utilityGrid.addGridColumn(removeHeader);
        await utilityGrid.areColumnHeaderMatches(allHeaders);
        await utilityGrid.isGridColumnSorted("Task ID", "asc");
        await utilityGrid.isGridColumnSorted("Task ID", "desc");
        await utilityGrid.isGridColumnSorted("Case ID", "asc");
        await utilityGrid.isGridColumnSorted("Case ID", "desc");
        await utilityGrid.isGridColumnSorted("Priority", "asc");
        await utilityGrid.isGridColumnSorted("Priority", "desc");
        await utilityGrid.isGridColumnSorted("Task Type", "asc");
        await utilityGrid.isGridColumnSorted("Task Type", "desc");
        await utilityGrid.isGridColumnSorted("Status", "asc");
        await utilityGrid.isGridColumnSorted("Status", "desc");
        await utilityGrid.isGridColumnSorted("Summary", "asc");
        await utilityGrid.isGridColumnSorted("Summary", "desc");
        await utilityGrid.isGridColumnSorted("Assigned Group", "asc");
        await utilityGrid.isGridColumnSorted("Assigned Group", "desc");
        await utilityGrid.isGridColumnSorted("Assignee", "asc");
        await utilityGrid.isGridColumnSorted("Assignee", "desc");
        await utilityGrid.isGridColumnSorted("Modified Date", "asc");
        await utilityGrid.isGridColumnSorted("Modified Date", "desc");
    });

    it('[DRDMV-22295]: Manual Task status should not be changed to "In Progress" from "Staged" if assignee is empty', async () => {
        await apiHelper.apiLogin('qfeng');
        let caseData = {
            "Description": "Case DRDMV-3828",
            "Requester": "Elizabeth",
            "Summary": "Simple test case summary",
            "Assigned Company": "Petramco",
            "Business Unit": "United States Support",
            "Support Group": "US Support 3"
        }

        let taskData = {
            "taskName": "Task DRDMV-3828",
            "company": "Petramco",
            "businessUnit": "United States Support",
            "supportGroup": "US Support 1"
        }
        await navigationPage.gotoTaskConsole();
        let caseCreationResponse = await apiHelper.createCase(caseData);
        let taskCreationResponse = await apiHelper.createAdhocTask(caseCreationResponse.id, taskData);
        await apiHelper.changeCaseAssignment(caseCreationResponse.id, 'United States Support', 'US Support 1', 'qtao');
        await apiHelper.updateCaseStatus(caseCreationResponse.id, 'InProgress');
        await utilityGrid.searchAndOpenHyperlink(taskCreationResponse.displayId);
        await viewTask.clickOnChangeStatus();
        await updateStatusBladePo.changeStatus("In Progress");
        expect(await updateStatusBladePo.isSaveUpdateStatusButtonEnabled()).toBeFalsy('Save button is enabled');
        expect(await updateStatusBladePo.getValidationMessage()).toBe('Assignee is required for this task status.  Please select an assignee.');
        await utilityCommon.closeAllBlades();
        await utilityCommon.clickOnApplicationWarningYesNoButton("Yes");
    });
});
