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
           await editCasePO.clickSaveCase();  
           await viewCasePO.clickAttachmentsLink();
           expect(await caseConsolePO.getCountAttachedFiles('demo.txt')).toBe(2);           
        });
    });

    // //nipande
    describe('[5397]: Check Description and Summary should not be updated after template change', async () => {
        let caseSummary = [...Array(10)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        beforeAll(async () => {
            await apiHelper.apiLogin('qkatawazi');
        });
        it('[5397]: Check Description and Summary should not be updated after template change', async function () {
            await navigationPO.gotoCreateCase();
            await createCasePO.selectRequester('adam');
            await createCasePO.setSummary(caseSummary);
            await createCasePO.clickSaveCaseButton(); 
            await previewCasePo.clickGoToCaseButton();
            await viewCasePO.clickEditCaseButton();
            expect (await editCasePO.getSelectCaseTemplate()).toBe('Select Case Template');
            await editCasePO.clickOnSelectCaseTemplate();
            await caseTemplatePO.clickOnAllTemplateTab();
            await caseTemplatePO.selectFirstFromAllTemplate();
            await caseTemplatePO.clickOnApplyButton();
            let description = await viewCasePO.getCaseDescriptionText();
            await editCasePO.clickSaveCase();
            expect (await viewCasePO.getCaseSummary()).toBe(caseSummary);
            expect (await viewCasePO.getCaseDescriptionText()).toBe(description);

           await navigationPO.gotoCreateCase();
           await createCasePO.selectRequester('adam');
           await createCasePO.setSummary(caseSummary);
           await createCasePO.clickSelectCaseTemplateButton();
           await caseTemplatePO.clickOnAllTemplateTab();
           await caseTemplatePO.selectFirstFromAllTemplate();
           await caseTemplatePO.clickOnApplyButton();
           description = await viewCasePO.getCaseDescriptionText();
           await createCasePO.clickSaveCaseButton();
           await previewCasePo.clickGoToCaseButton();
           expect (await viewCasePO.getCaseSummary()).toBe(caseSummary);
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
           expect(await createCasePO.isSaveCaseButtonEnabled()).toBeFalsy("Save button is enabled");
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
           expect(await createCasePO.isSaveCaseButtonEnabled()).toBeFalsy();
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
           expect(await accessTabPO.isAccessEntityDisplayed('US Support 3', 'Case')).toBeFalsy();        });
    });   
});
