import { browser } from "protractor";
import apiHelper from '../../api/api.helper';
import attachmentBladePo from '../../pageobject/attachment/attachment-blade.po';
import attachmentInformationBladePo from '../../pageobject/attachment/attachment-information-blade.po';
import caseConsolePo from '../../pageobject/case/case-console.po';
import previewCasePo from '../../pageobject/case/case-preview.po';
import createCasePage from '../../pageobject/case/create-case.po';
import viewCasePage from "../../pageobject/case/view-case.po";
import changeAssignmentOldBlade from '../../pageobject/common/change-assignment-old-blade.po';
import loginPage from "../../pageobject/common/login.po";
import navigationPage from "../../pageobject/common/navigation.po";
import updateStatusBladePo from '../../pageobject/common/update.status.blade.po';
import selectTaskTemplate from "../../pageobject/settings/task-management/console-tasktemplate.po";
import taskTemplate from "../../pageobject/settings/task-management/create-tasktemplate.po";
import taskConsole from "../../pageobject/task/console-task.po";
import adhoctaskTemplate from "../../pageobject/task/create-adhoc-task.po";
import editTask from "../../pageobject/task/edit-task.po";
import manageTask from "../../pageobject/task/manage-task-blade.po";
import viewTask from "../../pageobject/task/view-task.po";
import { BWF_BASE_URL } from '../../utils/constants';
import utilCommon from '../../utils/util.common';
import utilityCommon from '../../utils/utility.common';
import utilityGrid from '../../utils/utility.grid';
import changeAssignmentBladePo from '../../pageobject/common/change-assignment-blade.po';
import activityTabPo from '../../pageobject/social/activity-tab.po';

describe('Create Adhoc task', () => {
    beforeAll(async () => {
        await browser.get(BWF_BASE_URL);
        await loginPage.login('qtao');
    });

    afterAll(async () => {
        await navigationPage.signOut();
    });

    afterEach(async () => {
        await utilityCommon.refresh();
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
        await adhoctaskTemplate.clickOnSaveAdhoctask();
        await utilityCommon.waitUntilPopUpDisappear();
        expect(await manageTask.isTaskLinkOnManageTask(summary)).toBeTruthy();
    });

    it('[DRDMV-3821]: Adhoc Task details view (UI verification)', async () => {
        let summary = 'Adhoc task' + Math.floor(Math.random() * 1000000);
        await navigationPage.gotoCreateCase();
        await createCasePage.selectRequester("adam");
        await createCasePage.setSummary('Summary ' + summary);
        await createCasePage.clickAssignToMeButton();
        await createCasePage.clickSaveCaseButton();
        await previewCasePo.clickGoToCaseButton();

        //Adhoc task validation
        await viewCasePage.clickAddTaskButton();
        await manageTask.clickAddAdhocTaskButton();
        await adhoctaskTemplate.setSummary(summary);
        await adhoctaskTemplate.setDescription("Description");
        await adhoctaskTemplate.selectPriority('High');
        await adhoctaskTemplate.selectCategoryTier1('Applications');
        await adhoctaskTemplate.selectCategoryTier2('Social');
        await adhoctaskTemplate.selectCategoryTier3('Chatter');
        //await adhoctaskTemplate.selectLabel('test');
        await adhoctaskTemplate.clickOnSaveAdhoctask();
        await utilityCommon.waitUntilPopUpDisappear();
        await manageTask.clickTaskLinkOnManageTask(summary);
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
    }, 300 * 1000);

    it('[DRDMV-7130]: [Automatic Task] - Create Ad hoc Task', async () => {
        let summary = 'Adhoc task' + Math.floor(Math.random() * 1000000);
        await navigationPage.gotoCreateCase();
        await createCasePage.selectRequester("adam");
        await createCasePage.setSummary('Summary ' + summary);
        await createCasePage.clickAssignToMeButton();
        await createCasePage.clickSaveCaseButton();
        await previewCasePo.clickGoToCaseButton();

        //Adhoc task validation
        await viewCasePage.clickAddTaskButton();
        await manageTask.clickAddAdhocTaskButton();
        await adhoctaskTemplate.setSummary(summary);
        expect(await adhoctaskTemplate.isProcessFieldPresent()).toBeFalsy();
        await adhoctaskTemplate.setDescription("Description")
        await adhoctaskTemplate.clickOnSaveAdhoctask();
        await utilityCommon.waitUntilPopUpDisappear();
        await manageTask.clickTaskLinkOnManageTask(summary);
        expect(await viewTask.getTaskTypeValue()).toBe('Manual');
        expect(await viewTask.isProcessNameValue()).toBeFalsy();
    });

    it('[DRDMV-1580,DRDMV-12243]: Adhoc Task details view (UI verification))', async () => {
        let summary = 'Adhoc task' + Math.floor(Math.random() * 1000000);
        await navigationPage.gotoCreateCase();
        await createCasePage.selectRequester("adam");
        await createCasePage.setSummary('Summary ' + summary);
        await createCasePage.clickAssignToMeButton();
        await createCasePage.clickSaveCaseButton();
        await previewCasePo.clickGoToCaseButton();

        //Adhoc task validation
        await viewCasePage.clickAddTaskButton();
        await manageTask.clickAddAdhocTaskButton();
        expect(await adhoctaskTemplate.isAttachmentButtonDisplayed()).toBeTruthy();
        await adhoctaskTemplate.setSummary(summary);
        await adhoctaskTemplate.setDescription("Description");
        await adhoctaskTemplate.selectPriority('High');
        await adhoctaskTemplate.clickOnSaveAdhoctask();
        await utilityCommon.waitUntilPopUpDisappear();
        await manageTask.clickTaskLinkOnManageTask(summary);
        expect(await viewTask.isCaseSummaryDisplayed()).toBeTruthy("case summary is displayed ");
        expect(await viewTask.isRequesterNameDisplayed()).toBeTruthy("requester name is displayed ");
        expect(await viewTask.isRequesterContactDisplayed()).toBeTruthy("requester contact is displayed ");
        expect(await viewTask.isRequesterMailDisplayed()).toBeTruthy("requester mail is displayed ");
        expect(await viewTask.isEditLinkDisplayed()).toBeTruthy("edit link is displayed ");
        expect(await viewTask.isViewCaseLinkDisplayed()).toBeTruthy("view case link is displayed ");
        await viewTask.clickOnViewCase();
        expect(await viewCasePage.getCaseSummary()).toBe('Summary ' + summary);
    });

    it('[DRDMV-1500]: [Permissions] Navigating to case from the task', async () => {

        await navigationPage.signOut();
        await loginPage.login('qkatawazi');

        //Automation Task template
        let manualTaskTemplate = 'Manual  task' + Math.floor(Math.random() * 1000000);
        let manualTaskSummary = 'Summary' + Math.floor(Math.random() * 1000000);
        //Manual task Template
        await navigationPage.gotoSettingsPage();
        expect(await navigationPage.gotoSettingsMenuItem('Task Management--Templates', 'Task Templates - Business Workflows'))
            .toEqual('Task Templates - Business Workflows');
        await selectTaskTemplate.clickOnManualTaskTemplateButton();
        await taskTemplate.setTemplateName(manualTaskTemplate);
        await taskTemplate.setTaskSummary(manualTaskSummary);
        await taskTemplate.setTaskDescription('Description in manual task');
        await taskTemplate.selectCompanyByName('Petramco');
        await taskTemplate.clickOnAssignment();
        await changeAssignmentOldBlade.selectCompany('Petramco');
        await changeAssignmentBladePo.selectBusinessUnit('HR Support');
        await changeAssignmentOldBlade.selectSupportGroup('Workforce Administration');
        await changeAssignmentOldBlade.selectAssignee('elizabeth');
        await changeAssignmentOldBlade.clickOnAssignButton();
        await taskTemplate.selectTemplateStatus('Active');
        await taskTemplate.selectBuisnessUnit('HR Support');
        await taskTemplate.selectOwnerGroup('Workforce Administration');
        await taskTemplate.clickOnSaveTaskTemplate();
        await utilCommon.waitUntilPopUpDisappear();

        await navigationPage.gotoCreateCase();
        await createCasePage.selectRequester("adam");
        await createCasePage.setSummary('Summary ' + manualTaskSummary);
        await createCasePage.clickAssignToMeButton();
        await createCasePage.clickSaveCaseButton();
        await previewCasePo.clickGoToCaseButton();
        let newCaseID: string = await viewCasePage.getCaseID();
        await viewCasePage.clickAddTaskButton();

        //Add Manual task and Automation Task in Case
        await manageTask.addTaskFromTaskTemplate(manualTaskTemplate);
        await manageTask.clickOnCloseButton();
        await updateStatusBladePo.changeCaseStatus('In Progress');
        await updateStatusBladePo.clickSaveStatus('In Progress');

        //different user
        await navigationPage.signOut();
        await loginPage.login('qliu');
        await navigationPage.gotoTaskConsole();
        await utilityGrid.clearFilter();
        await taskConsole.setTaskSearchBoxValue(manualTaskSummary);
        expect(await utilityGrid.getFirstGridRecordColumnValue('Case ID')).toBe("", " Case Id Displayed in Task console");
        await utilityGrid.searchAndOpenHyperlink(manualTaskSummary);
        expect(await viewTask.isCaseViewLinkDisplayed()).toBeFalsy('Case View Link is displayed');

        await navigationPage.signOut();
        await loginPage.login('qkatawazi');
        await navigationPage.gotoTaskConsole();
        await utilityGrid.clearFilter();
        await taskConsole.setTaskSearchBoxValue(manualTaskSummary);
        expect(await utilityGrid.getFirstGridRecordColumnValue('Case ID')).toBe(newCaseID, " Case Id NOT displayed in Task console");
        await utilityGrid.searchAndOpenHyperlink(manualTaskSummary);
        expect(await viewTask.isCaseViewLinkDisplayed()).toBeTruthy('Case View Link is not displayed');
        await navigationPage.signOut();
        await loginPage.login('qtao');
    }, 570 * 1000);

    it('[DRDMV-12249,DRDMV-12244]: Verify task creation with attachments & Verify attachment grid from case', async () => {
        let filePath = '../../data/ui/attachment/demo.txt';
        let summary = 'Adhoc task' + Math.floor(Math.random() * 1000000);
        let caseData = {
            "Requester": "qkatawazi",
            "Summary": summary
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
        await adhoctaskTemplate.clickOnSaveAdhoctask();
        await manageTask.clickOnCloseButton();
        await viewCasePage.clickOnTaskLink(summary);
        expect(await viewTask.isAttachedFileNamePresent('demo.txt')).toBeTruthy('Attached file name is missing');
        await viewTask.clickOnAttachments('demo.txt');
        expect(await utilCommon.deleteAlreadyDownloadedFile('demo.txt')).toBeTruthy('File is delete sucessfully');
        expect(await utilCommon.isFileDownloaded('demo.txt')).toBeTruthy('File is not downloaded.');

        //Navigated To Case and Verify attachments grid for task attachments
        await viewTask.clickOnViewCase();
        await viewCasePage.clickAttachmentsLink();
        await attachmentBladePo.clickOnFileName('demo');
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
        await attachmentInformationBladePo.clickOnDownloadButton();
        expect(await utilCommon.deleteAlreadyDownloadedFile('demo.txt')).toBeTruthy('File is delete sucessfully');
    });//, 200 * 1000);

    it('[DRDMV-12245]: Verify task attachments deletion', async () => {
        let filePath = '../../data/ui/attachment/demo.txt';
        let summary = 'Adhoc task' + Math.floor(Math.random() * 1000000);
        let caseData = {
            "Requester": "qkatawazi",
            "Summary": summary,
        }
        await apiHelper.apiLogin('qtao');
        let newCaseTemplate = await apiHelper.createCase(caseData);
        console.log("case is created===", newCaseTemplate.id);
        await navigationPage.gotoCaseConsole();
        await caseConsolePo.searchAndOpenCase(newCaseTemplate.displayId);

        //Adhoc task validation
        await viewCasePage.clickAddTaskButton();
        await manageTask.clickAddAdhocTaskButton();
        expect(await adhoctaskTemplate.isAttachmentButtonDisplayed()).toBeTruthy();
        await adhoctaskTemplate.setSummary(summary);
        await adhoctaskTemplate.setDescription("Description");
        await adhoctaskTemplate.addAttachment([filePath]);
        await adhoctaskTemplate.clickOnSaveAdhoctask();
        await manageTask.clickOnCloseButton();
        await viewCasePage.clickOnTaskLink(summary);
        expect(await viewTask.isAttachedFileNamePresent('demo.txt')).toBeTruthy('Attached file name is not available');
        await viewTask.clickOnEditTask();
        await editTask.removeAttachment('demo.txt');
        await viewTask.clickOnSaveViewAdhoctask();
        expect(await viewTask.isAttachedFileNamePresent('demo.txt')).toBeFalsy('Attached file name is available');
    });//, 180 * 1000);

    it('[DRDMV-12246]: Verify attachment addition on edit task mode', async () => {
        let filePath = '../../data/ui/attachment/demo.txt';
        let summary = 'Adhoc task' + Math.floor(Math.random() * 1000000);
        let caseData = {
            "Requester": "qkatawazi",
            "Summary": summary,
        }
        await apiHelper.apiLogin('qtao');
        let newCaseTemplate = await apiHelper.createCase(caseData);
        console.log("case is created===", newCaseTemplate.id);
        await navigationPage.gotoCaseConsole();
        await caseConsolePo.searchAndOpenCase(newCaseTemplate.displayId);

        //Adhoc task validation
        await viewCasePage.clickAddTaskButton();
        await manageTask.clickAddAdhocTaskButton();
        await adhoctaskTemplate.setSummary(summary);
        await adhoctaskTemplate.setDescription("Description");
        await adhoctaskTemplate.clickOnSaveAdhoctask();
        await manageTask.clickOnCloseButton();
        await viewCasePage.clickOnTaskLink(summary);
        await viewTask.clickOnEditTask();
        await editTask.addAttachment([filePath]);
        await viewTask.clickOnSaveViewAdhoctask();
        expect(await viewTask.isAttachedFileNamePresent('demo')).toBeTruthy('Attached file name is not available');
    });//, 180 * 1000);

    it('[DRDMV-12248,DRDMV-12247,DRDMV-12250]: Verify max attachments added to task', async () => {
        let summary = 'Adhoc task' + Math.floor(Math.random() * 1000000);
        let caseData = {
            "Requester": "qkatawazi",
            "Summary": summary
        }
        await apiHelper.apiLogin('qtao');
        let newCaseTemplate = await apiHelper.createCase(caseData);
        console.log("case is created===", newCaseTemplate.id);
        await navigationPage.gotoCaseConsole();
        await caseConsolePo.searchAndOpenCase(newCaseTemplate.displayId);

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
        await adhoctaskTemplate.clickOnSaveAdhoctask();
        await utilCommon.waitUntilPopUpDisappear();
        // hardwait to upload multiple files
        await browser.sleep(10000);
        await manageTask.clickTaskLinkOnManageTask(summary);
        await viewTask.clickShowMoreShowLessLink();
        let fileName2: string[] = ['articleStatus.png', 'bwfJpg.jpg', 'bwfJpg1.jpg', 'bwfJpg2.jpg', 'bwfJpg3.jpg', 'bwfJpg4.jpg', 'bwfJson1.json', 'bwfJson2.json', 'bwfJson3.json', 'bwfJson4.json', 'bwfJson5.json', 'bwfPdf.pdf', 'bwfPdf1.pdf', 'bwfPdf2.pdf', 'bwfPdf3.pdf', 'bwfPdf4.pdf', 'bwfWord1.rtf', 'bwfWord2.rtf', 'bwfXlsx.xlsx', 'demo.txt'];
        for (let j: number = 0; j < fileName2.length; j++) {
            expect(await viewTask.isAttachedFileNamePresent(`${fileName2[j]}`)).toBeTruthy(`${fileName2[j]} Attached file name is missing`);
        }
        await viewTask.clickShowMoreShowLessLink();
        expect(await viewTask.getShowMoreLessAttachmentsLinkText()).toBe('18 more');
    });

    it('[DRDMV-5480]: [Assignment] Changing the Assignment when editing the task by the member of one Support Group', async () => {
        let summary = 'Adhoc task' + Math.floor(Math.random() * 1000000);
        let randomStr = [...Array(4)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        let templateData1 = {
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
        try {
            //Create Case
            await navigationPage.signOut();
            await loginPage.login('franz')
            await navigationPage.gotoCreateCase();
            await createCasePage.selectRequester("adam");
            await createCasePage.setSummary('Summary ' + summary);
            await createCasePage.clickAssignToMeButton();
            await createCasePage.clickSaveCaseButton();
            await previewCasePo.clickGoToCaseButton();

            //Adhoc task validation
            await viewCasePage.clickAddTaskButton();
            await manageTask.clickAddAdhocTaskButton();
            await adhoctaskTemplate.setSummary("test" + summary);
            await adhoctaskTemplate.clickOnAssignButton();
            await adhoctaskTemplate.clickOnSaveAdhoctask();
            await manageTask.addTaskFromTaskTemplate(`manualTaskTemplate1 ${randomStr}`);
            await manageTask.clickTaskLinkOnManageTask("test" + summary);
            await viewTask.clickOnEditTask();
            await editTask.clickOnAssignToMe();
            await editTask.clickOnSaveButton();
            expect((await viewTask.getAssigneeText()).trim()).toBe('Franz Schwarz');
            await viewTask.clickOnEditTask();
            await editTask.clickOnChangeAssignementButton();
            await changeAssignmentBladePo.selectAssignee("Fritz Schulz");
            await changeAssignmentBladePo.clickOnAssignButton();
            await editTask.clickOnSaveButton();
            expect(await viewTask.getAssigneeText()).toBe('Fritz Schulz');
            expect(await activityTabPo.getAllTaskActivity('Fritz Schulz')).toBe('Fritz Schulz');
            await viewTask.clickOnEditTask();
            await editTask.clickOnChangeAssignementButton();
            await changeAssignmentBladePo.clickOnAssignToMeCheckBox();
            await changeAssignmentBladePo.clickOnAssignButton();
            await editTask.clickOnSaveButton();
            expect(await viewTask.getAssigneeText()).toBe('Franz Schwarz');
            await viewTask.clickOnEditTask();
            await editTask.clickOnChangeAssignementButton();
            await changeAssignmentBladePo.selectBusinessUnit('Facilities Support');
            await changeAssignmentBladePo.selectSupportGroup('Facilities');
            await changeAssignmentBladePo.selectAssigneeAsSupportGroup('Facilities');
            await changeAssignmentBladePo.clickOnAssignButton();
            await editTask.clickOnSaveButton();
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
            expect(await activityTabPo.getAllTaskActivity('Qadim Katawazi')).toBe('Qadim Katawazi');
            expect(await viewTask.getAssigneeText()).toBe('Qadim Katawazi');
            await viewTask.clickOnEditTask();
            await editTask.clickOnAssignToMe();
            await editTask.clickOnSaveButton();
            expect(await viewTask.getAssigneeText()).toBe('Franz Schwarz');
            await viewTask.clickOnEditTask();
            await editTask.clickOnChangeAssignementButton();
            await changeAssignmentBladePo.selectBusinessUnit('Facilities Support');
            await changeAssignmentBladePo.selectSupportGroup('Facilities');
            await changeAssignmentBladePo.selectAssigneeAsSupportGroup('Facilities');
            await changeAssignmentBladePo.clickOnAssignButton();
            await editTask.clickOnSaveButton();
            expect(await viewTask.getAssignedGroupText()).toBe('Facilities');
            await viewTask.clickOnEditTask();
            await editTask.clickOnAssignToMe();
            await editTask.clickOnSaveButton();
            expect(await viewTask.getAssigneeText()).toBe('Franz Schwarz');
            await viewTask.clickOnViewCase()

            // second task template
            await viewCasePage.clickAddTaskButton();
            await manageTask.clickTaskLinkOnManageTask(`manualTaskTemplateSummary1 ${randomStr}`);
            await viewTask.clickOnEditTask();
            await editTask.clickOnAssignToMe();
            await editTask.clickOnSaveButton();
            expect((await viewTask.getAssigneeText()).trim()).toBe('Franz Schwarz');
            await viewTask.clickOnEditTask();
            await editTask.clickOnChangeAssignementButton();
            await changeAssignmentBladePo.selectAssignee("Fritz Schulz");
            await changeAssignmentBladePo.clickOnAssignButton();
            await editTask.clickOnSaveButton();
            expect(await viewTask.getAssigneeText()).toBe('Fritz Schulz');
            expect(await activityTabPo.getAllTaskActivity('Fritz Schulz')).toBe('Fritz Schulz');
            await viewTask.clickOnEditTask();
            await editTask.clickOnChangeAssignementButton();
            await changeAssignmentBladePo.clickOnAssignToMeCheckBox();
            await changeAssignmentBladePo.clickOnAssignButton();
            await editTask.clickOnSaveButton();
            expect(await viewTask.getAssigneeText()).toBe('Franz Schwarz');
            await viewTask.clickOnEditTask();
            await editTask.clickOnChangeAssignementButton();
            await changeAssignmentBladePo.selectBusinessUnit('Facilities Support');
            await changeAssignmentBladePo.selectSupportGroup('Facilities');
            await changeAssignmentBladePo.selectAssigneeAsSupportGroup('Facilities');
            await changeAssignmentBladePo.clickOnAssignButton();
            await editTask.clickOnSaveButton();
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
            expect(await activityTabPo.getAllTaskActivity('Qadim Katawazi')).toBe('Qadim Katawazi');
            expect(await viewTask.getAssigneeText()).toBe('Qadim Katawazi');
            await viewTask.clickOnEditTask();
            await editTask.clickOnAssignToMe();
            await editTask.clickOnSaveButton();
            expect(await viewTask.getAssigneeText()).toBe('Franz Schwarz');
            await viewTask.clickOnEditTask();
            await editTask.clickOnChangeAssignementButton();
            await changeAssignmentBladePo.selectBusinessUnit('Facilities Support');
            await changeAssignmentBladePo.selectSupportGroup('Facilities');
            await changeAssignmentBladePo.selectAssigneeAsSupportGroup('Facilities');
            await changeAssignmentBladePo.clickOnAssignButton();
            await editTask.clickOnSaveButton();
            expect(await viewTask.getAssignedGroupText()).toBe('Facilities');
            await viewTask.clickOnEditTask();
            await editTask.clickOnAssignToMe();
            await editTask.clickOnSaveButton();
            expect(await viewTask.getAssigneeText()).toBe('Franz Schwarz');

        } catch (error) {
            throw error;
        } finally {
            await navigationPage.signOut();
            await loginPage.login("qtao");
        }
    }, 280 * 1000);

    it('[DRDMV-3828]: [Task Workspace] Task Workspace verification', async () => {
        await navigationPage.gotoTaskConsole();
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

});