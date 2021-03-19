import { browser } from "protractor";
import apiHelper from "../../api/api.helper";
import loginPage from "../../pageobject/common/login.po";
import navigationPage from "../../pageobject/common/navigation.po";
import { BWF_BASE_URL,  } from '../../utils/constants';
import utilityCommon from '../../utils/utility.common';
import createCasePage from "../../pageobject/case/create-case.po";
import previewCasePo from '../../pageobject/case/case-preview.po';
import editCasePO from '../../pageobject/case/edit-case.po';
import caseTemplatePage from '../../pageobject/case/select-casetemplate-blade.po';
import viewCasePage from "../../pageobject/case/view-case.po";
import activityTabPo from "../../pageobject/social/activity-tab.po";

describe('[4055]: Dynamic Field of Type Attachment Test', () => {
    beforeAll(async () => {
        await browser.get(BWF_BASE_URL);
        await loginPage.login('qkatawazi');
    });

    afterAll(async () => {
        await utilityCommon.closeAllBlades();
        await navigationPage.signOut();
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
           await navigationPage.gotoCreateCase();
           expect(await createCasePage.isSaveCaseButtonEnabled()).toBeFalsy("Save button is enabled");
           await createCasePage.selectRequester('adam');
           expect(await createCasePage.isSaveCaseButtonEnabled()).toBeFalsy();
           await createCasePage.setSummary(caseSummary);
           expect(await createCasePage.allPriorityOptionsPresent(prioirtyValue)).toBeTruthy('Priority is not present');
           await createCasePage.clickAssignToMeButton();
           await createCasePage.clickSaveCaseButton();
           await previewCasePo.clickGoToCaseButton();
           await viewCasePage.clickEditCaseButton();
           expect (await editCasePO.getSelectCaseTemplate()).toBe('Select Case Template');
           await editCasePO.clickOnSelectCaseTemplate();
           await caseTemplatePage.selectCaseTemplate(caseTemplateData.templateName);
           await editCasePO.clickSaveCase();
           await viewCasePage.clickEditCaseButton();
           await editCasePO.addAttachment('Attachment1_4055', ['../../data/ui/attachment/demo.txt']);
           await editCasePO.addAttachment('Attachment2_4055', ['../../data/ui/attachment/demo.txt']);
           await editCasePO.clickSaveCase();          
           expect(await activityTabPo.getAllTaskActivity("demo.txt(+)")).toBe("demo.txt(+)");
        });
    });
});
