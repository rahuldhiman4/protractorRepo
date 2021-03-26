import { browser } from "protractor";
import apiHelper from "../../api/api.helper";
import { BWF_BASE_URL,  } from '../../utils/constants';
import utilityCommon from '../../utils/utility.common';
import loginPO from "../../pageobject/common/login.po";
import navigationPO from "../../pageobject/common/navigation.po";
import createCasePO from "../../pageobject/case/create-case.po";
import caseConsolePO from "../../pageobject/case/case-console.po";
import previewCasePo from '../../pageobject/case/case-preview.po';
import editCasePO from '../../pageobject/case/edit-case.po';
import caseTemplatePO from '../../pageobject/case/select-casetemplate-blade.po';
import viewCasePO from "../../pageobject/case/view-case.po";
import changeAssignmentPO from "../../pageobject/common/change-assignment.po";
import accessTabPO from "../../pageobject/common/access-tab.po";
import activityTabPo from "../../pageobject/social/activity-tab.po";
import manageTaskPo from "../../pageobject/task/manage-task-blade.po";
import adhoctaskTemplate from "../../pageobject/task/create-adhoc-task.po";
import attachmentBladePo from '../../pageobject/attachment/attachment-blade.po';

describe('[4055]: Dynamic Field of Type Attachment Test', () => {
    beforeAll(async () => {
        await browser.get(BWF_BASE_URL);
        await loginPO.login('qkatawazi');
    });

    afterAll(async () => {
        await utilityCommon.closeAllBlades();
        await navigationPO.signOut();
    });

    //nipande
    describe('[4055]: Adding Dynamic Groups', async () => {
        let caseTemplateData;
        let randomStr = [...Array(8)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        beforeAll(async () => {
            caseTemplateData = {
                "templateName": 'case template2 ' + randomStr,
                "templateSummary": 'case summary',
                "description": "case description",
                "categoryTier1": "Applications",
                "casePriority": "High",
                "templateStatus": "Active",
                "caseStatus": "New",
                "company": "Petramco",
                "ownerBU": "United States Support",
                "ownerGroup": "US Support 3"
            }
            await apiHelper.apiLogin('qkatawazi');
            let newCaseTemplate = await apiHelper.createCaseTemplate(caseTemplateData);
            await apiHelper.createDynamicDataOnTemplate(newCaseTemplate.id, 'CASE_TEMPLATE_WITH_ATTACHMENT_FIELDS');
        });
        
        it('[4055]: should create case with existing template with attachments', async function () {
           let prioirtyValue: string[] = ["Critical", "High", "Medium", "Low"];
           let caseSummary = 'Case Summary ' + randomStr;
           await navigationPO.gotoCreateCase();
           expect(await createCasePO.isSaveCaseButtonEnabled()).toBeFalsy("Save button is enabled");
           await createCasePO.selectRequester('adam');
           expect(await createCasePO.isSaveCaseButtonEnabled()).toBeFalsy();
           await createCasePO.setSummary(caseSummary);
           expect(await createCasePO.allPriorityOptionsPresent(prioirtyValue)).toBeTruthy('Priority is not present');
           await createCasePO.clickSelectCaseTemplateButton();
           await caseTemplatePO.clickOnAllTemplateTab();
           await caseTemplatePO.selectCaseTemplate(caseTemplateData.templateName);
           await createCasePO.clickSaveCaseButton();
           await previewCasePo.clickGoToCaseButton();
           await viewCasePO.clickEditCaseButton();
           await editCasePO.addAttachment('Attachment1_4055', ['../../data/ui/attachment/demo.txt']);
           await editCasePO.addAttachment('Attachment2_4055', ['../../data/ui/attachment/demo.txt']);
           expect(await caseConsolePO.getCountAttachedFiles('demo.txt')).toBe(2);           
           await editCasePO.clickSaveCase();  
           await viewCasePO.clickAttachmentsLink();
           expect(await caseConsolePO.getCountAttachedFiles('demo.txt')).toBe(2);           
        });
    });

    //nipande
    describe('[5397]: Check Description and Summary should not be updated after template change', async () => {
        let randomStr = [...Array(8)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        let templateDatawithSG5397; let templateDataWitoutSG5397
        beforeAll(async () => {
            templateDataWitoutSG5397 = {
                "templateName": "templateDatawithSG5396 " + randomStr,
                "templateSummary": "templateDatawithSG5396 summary " + randomStr,
                "templateStatus": "Active",
            }
            templateDatawithSG5397 = {
                "templateName": "templateDataWitoutSG5396 " + randomStr,
                "templateSummary": "templateDataWitoutSG5396 summary " + randomStr,
                "categoryTier1": "Purchasing Card",
                "categoryTier2": "Policies",
                "categoryTier3": "Card Issuance",
                "casePriority": "Low",
                "templateStatus": "Active",
                "company": "Petramco",
                "ownerCompany": "Petramco",
                "ownerBU": "United States Support",
                "ownerGroup": "US Support 1",
                "assigneeCompany": "Petramco",
                "assigneeBU": "United States Support",
                "assigneeSupportGroup": "US Support 1",
                "assignee": "qtao",
            }
            await navigationPO.signOut();
            await loginPO.login('qtao');
            await apiHelper.apiLogin('qkatawazi');
            await apiHelper.createCaseTemplate(templateDatawithSG5397);
            await apiHelper.createCaseTemplate(templateDataWitoutSG5397);
        });
        it('[5397]: Check Description and Summary should not be updated after template change', async function () {
            await navigationPO.gotoCreateCase();
            await createCasePO.selectRequester('adam');
            await createCasePO.setSummary(templateDatawithSG5397.templateSummary);
            await createCasePO.clickSaveCaseButton(); 
            await previewCasePo.clickGoToCaseButton();
            let description = await viewCasePO.getCaseDescriptionText();
            await viewCasePO.clickEditCaseButton();
            expect (await editCasePO.getSelectCaseTemplate()).toBe('Select Case Template');
            await editCasePO.clickOnSelectCaseTemplate();
            await caseTemplatePO.clickOnAllTemplateTab();
            await caseTemplatePO.selectCaseTemplate(templateDatawithSG5397.templateName);
            await editCasePO.clickSaveCase();
            
            expect (await viewCasePO.getCaseSummary()).toBe(templateDatawithSG5397.templateSummary);
            expect (await viewCasePO.getCaseDescriptionText()).toBe(description);

           await navigationPO.gotoCreateCase();
           await createCasePO.selectRequester('adam');
           await createCasePO.setSummary(templateDataWitoutSG5397.templateSummary);
           await createCasePO.clickSelectCaseTemplateButton();
           await caseTemplatePO.clickOnAllTemplateTab();
           await caseTemplatePO.selectFirstFromAllTemplate();
           await caseTemplatePO.clickOnApplyButton();
           await createCasePO.clickSaveCaseButton();
           await previewCasePo.clickGoToCaseButton();
           description = await viewCasePO.getCaseDescriptionText();
           await viewCasePO.clickEditCaseButton();
           await editCasePO.clickOnChangeCaseTemplate();
           await caseTemplatePO.clickOnAllTemplateTab();
           await caseTemplatePO.selectCaseTemplate(templateDataWitoutSG5397.templateName);
           await editCasePO.clickSaveCase();
           await utilityCommon.closeAllBlades();
           expect (await viewCasePO.getCaseSummary()).toBe(templateDataWitoutSG5397.templateSummary);
           expect (await viewCasePO.getCaseDescriptionText()).toBe(description);
        });
    });

    //nipande
    describe('[6224]: [Case visibility] Error messages handling]', async () => {
        let randomStr = [...Array(8)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        beforeAll(async () => {
            await navigationPO.signOut();
            await loginPO.login('qtao');
        });
        it('[6224]: [Case visibility] Error messages handling]', async function () {
           let caseSummary = 'Case Summary ' + randomStr;
           await navigationPO.gotoCreateCase();
           await createCasePO.selectRequester('adam');
           await createCasePO.setSummary(caseSummary);
           await changeAssignmentPO.setAssignee("US Support 3", "");
           await createCasePO.clickSaveCaseButton();
           await previewCasePo.clickGoToCaseButton();
           await viewCasePO.clickOnTab('Case Access');
           await accessTabPO.clickRemoveAccess("US Support 3");
           await accessTabPO.clickAccessRemoveWarningBtn("Yes");
           expect(await utilityCommon.isPopUpMessagePresent('To remove the Assigned Support Group please assign the Case to an Agent first.'))

           await navigationPO.gotoCreateCase();
           await createCasePO.selectRequester('adam');
           await createCasePO.setSummary(caseSummary);
           await changeAssignmentPO.setAssignee("US Support 3", "Ruhi Verma");
           await createCasePO.clickSaveCaseButton();
           await previewCasePo.clickGoToCaseButton();
           await viewCasePO.clickOnTab('Case Access');
           await accessTabPO.selectAgent('Ruhi Verma', 'Agent');
           await accessTabPO.clickRemoveAccess("Ruhi Verma");
           await accessTabPO.clickAccessRemoveWarningBtn("Yes");
           expect(await utilityCommon.isPopUpMessagePresent('The Assignee cannot be removed from the Case Access List.'));
           
           await accessTabPO.clickRemoveAccess("US Support 3");
           await accessTabPO.clickAccessRemoveWarningBtn("Yes");
           expect(await accessTabPO.isAccessEntityDisplayed('US Support 3', 'Case')).toBeFalsy();        
        });
    });     
    //nipande
    describe('[5395]: [Negative Testing]- Checking recommended and all templates based on empty, garbage and valid string in summary.', async () => {
        let randomStr = [...Array(8)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        beforeAll(async () => {
            await navigationPO.signOut();
            await loginPO.login('qtao');
        });
        it('[5395]: [Negative Testing]- Checking recommended and all templates based on empty, garbage and valid string in summary.', async function () {
            let caseSummary = 'Case Summary ' + randomStr;
            await navigationPO.gotoCreateCase();
            await createCasePO.selectRequester('adam');
            await createCasePO.setSummary(caseSummary);
            await createCasePO.clickSaveCaseButton(); 
            await previewCasePo.clickGoToCaseButton();
            await viewCasePO.clickEditCaseButton();
            await editCasePO.setCaseSummary(' ');
            await editCasePO.clickOnSelectCaseTemplate();
            expect(await caseTemplatePO.getCountOfTemplates()).toBe(0);
            await caseTemplatePO.clickRecommendedCancelBtn();
            await editCasePO.setCaseSummary('asd@asd');
            await editCasePO.clickOnSelectCaseTemplate();
            expect(await caseTemplatePO.getCountOfTemplates()).toBe(0);
            await caseTemplatePO.clickRecommendedCancelBtn();
            await editCasePO.setCaseSummary('case summary');
            await editCasePO.clickOnSelectCaseTemplate();
            expect(await caseTemplatePO.isApplyButtonEnabled()).toBeFalsy('Apply button is enabled');
            await caseTemplatePO.selectFirstRecommendedTemplate();
            expect(await caseTemplatePO.isApplyButtonEnabled()).toBeTruthy();
            await caseTemplatePO.clickRecommendedApplyBtn();
            await navigationPO.signOut();
        });
    }); 
    //nipande
    describe('[5402]: Checking Activities Blade to see new activity being updated for new case status', async () => {
        let randomStr = [...Array(8)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        let templateData5402;
        beforeAll(async () => {
            templateData5402 = {
                "templateName": "templateData5402 " + randomStr,
                "templateSummary": "templateData5402 summary " + randomStr,
                "templateStatus": "Active",
            }
            await navigationPO.signOut();
            await loginPO.login('qtao');
            await apiHelper.apiLogin('qtao');
            await apiHelper.createCaseTemplate(templateData5402);
        });
        it('[5402]: Checking Activities Blade to see new activity being updated for new case status', async function () {
            await navigationPO.gotoCreateCase();
            await createCasePO.selectRequester('adam');
            await createCasePO.setSummary(templateData5402.templateSummary);
            await createCasePO.clickSaveCaseButton(); 
            await previewCasePo.clickGoToCaseButton();
            await viewCasePO.clickEditCaseButton();
            expect (await editCasePO.getSelectCaseTemplate()).toBe('Select Case Template');
            await editCasePO.clickOnSelectCaseTemplate();
            await caseTemplatePO.clickOnAllTemplateTab();
            await caseTemplatePO.selectCaseTemplate(templateData5402.templateName);
            await editCasePO.clickSaveCase();
            expect(await activityTabPo.getFirstPostContent()).toContain('Qianru Tao applied the template ' + templateData5402.templateName);
        });
    });
    //nipande
    describe('[5052]: Upload attachment from task console & verify all attachments grid', async () => {
        let randomStr = [...Array(8)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        beforeAll(async () => {
            await navigationPO.signOut();
            await loginPO.login('qtao'); 
        });
        it('[5052]: Upload attachment from task console & verify all attachments grid', async function () {
            let caseSummary = 'Case Summary ' + randomStr;
            let taskName = 'Task5062 ' + randomStr; 
            await navigationPO.gotoCreateCase();
            await createCasePO.selectRequester('adam');
            await createCasePO.setSummary(caseSummary);
            await createCasePO.clickSaveCaseButton(); 
            await previewCasePo.clickGoToCaseButton();
            expect(await viewCasePO.isAddtaskButtonDisplayed()).toBeTruthy();
            await viewCasePO.clickAddTaskButton();
            await manageTaskPo.clickAddAdhocTaskButton();
            await adhoctaskTemplate.setSummary(taskName);
            await adhoctaskTemplate.addAttachment(['../../data/ui/attachment/demo.txt']);
            await adhoctaskTemplate.clickSaveAdhoctask();
            await utilityCommon.closeAllBlades();
            await viewCasePO.clickAttachmentsLink();
            expect(await attachmentBladePo.isColumnHeaderPresent('Attachments')).toBeTruthy('Attachment column header is missing');
            expect(await attachmentBladePo.isColumnHeaderPresent('Attached to')).toBeTruthy('Attached to column header is missing');
            expect(await (await attachmentBladePo.getGridColumnValues('Attached to')).includes('Task')).toBeTruthy();
            await attachmentBladePo.searchAndSelectCheckBox('demo');
            await attachmentBladePo.clickDownloadButton();
            expect(await utilityCommon.isFileDownloaded('demo.txt')).toBeTruthy('File is not downloaded.');
        });
    });
});
