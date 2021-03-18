import { browser } from "protractor";
import loginPage from "../../pageobject/common/login.po";
import navigationPage from "../../pageobject/common/navigation.po";
import { BWF_BASE_URL, BWF_PAGE_TITLES } from '../../utils/constants';
import utilityCommon from '../../utils/utility.common';
import viewCaseTemplate from "../../pageobject/settings/case-management/view-casetemplate.po";
import consoleCasetemplatePo from "../../pageobject/settings/case-management/console-casetemplate.po";
import apiHelper from "../../api/api.helper";
import accessTabPo from '../../pageobject/common/access-tab.po';
import caseConsolePo from '../../pageobject/case/case-console.po';
import viewCasePo from '../../pageobject/case/view-case.po';
import editCasePo from '../../pageobject/case/edit-case.po';
import selectCasetemplateBladePo from '../../pageobject/case/select-casetemplate-blade.po';
import editCasetemplatePo from '../../pageobject/settings/case-management/edit-casetemplate.po';
import createCasetemplatePo from '../../pageobject/settings/case-management/create-casetemplate.po';

describe('Case Edit Backlog Test', () => {
    beforeAll(async () => {
        await browser.get(BWF_BASE_URL);
        await loginPage.login('qkatawazi');
    });

    afterAll(async () => {
        await utilityCommon.closeAllBlades();
        await navigationPage.signOut();
    });

    //ashastra
    describe('[4138, 4139]: Change case template which has multiple support groups in case access tab', async () => {
        let caseTemplateData1, caseTemplateData2, template1, template2;
        let randomStr = [...Array(8)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        beforeAll(async () => {
            caseTemplateData1 = {
                "templateName": 'caseTemplate1' + randomStr,
                "templateSummary": 'case summary',
                "description": "case description",
                "categoryTier1": "Total Rewards",
                "casePriority": "High",
                "templateStatus": "Draft",
                "caseStatus": "New",
                "company": "Petramco",
                "businessUnit": "United States Support",
                "supportGroup": "US Support 3",
                "ownerBU": "United States Support",
                "ownerGroup": "US Support 3"
            }

            caseTemplateData2 = {
                "templateName": 'caseTemplate2' + randomStr,
                "templateSummary": 'case summary',
                "description": "case description",
                "categoryTier1": "Applications",
                "casePriority": "High",
                "templateStatus": "Draft",
                "caseStatus": "New",
                "company": "Petramco",
                "businessUnit": "United States Support",
                "supportGroup": "US Support 3",
                "ownerBU": "United States Support",
                "ownerGroup": "US Support 3"
            }
            await apiHelper.apiLogin('qtao');
            template1 = await apiHelper.createCaseTemplate(caseTemplateData1);
            template2 = await apiHelper.createCaseTemplate(caseTemplateData2);

            await navigationPage.signOut();
            await loginPage.login('qtao');
        });
        it('[4138, 4139]: add support group in template1 and template2 in case access tab', async () => {
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Case Management--Templates', BWF_PAGE_TITLES.CASE_MANAGEMENT.TEMPLATES);
            await consoleCasetemplatePo.searchAndClickOnCaseTemplate(caseTemplateData1.templateName);
            await viewCaseTemplate.selectTab('Case Access');

            await accessTabPo.clickToExpandAccessEntitiyByGroup('Confidential Access');
            await accessTabPo.selectAccessEntityDropDown('LA Support 1', 'Select Support Group');
            await accessTabPo.clickAccessEntitiyAddButton('Support Group');
            await accessTabPo.selectAccessEntityDropDown('LA Support 2', 'Select Support Group');
            await accessTabPo.clickAccessEntitiyAddButton('Support Group');
            await accessTabPo.selectAccessEntityDropDown('LA Support 3', 'Select Support Group');
            await accessTabPo.clickAssignWriteAccessCheckbox('Support Group');
            await accessTabPo.clickAccessEntitiyAddButton('Support Group');
            await accessTabPo.clickToExpandAccessEntitiyByGroup('Confidential Access');

            // await accessTabPo.clickToExpandAccessEntitiyByGroup('Case Access');
            // await accessTabPo.selectAccessEntityDropDown('Petramco', 'Select Company');
            // await accessTabPo.selectAccessEntityDropDown('US Support 1', 'Select Support Group');
            // await accessTabPo.clickAccessEntitiyAddButton('Support Group');

            expect(await accessTabPo.isAccessTypeOfEntityDisplayed('LA Support 1', 'Read')).toBeTruthy('FailuerMsg1: Support Group is missing');
            expect(await accessTabPo.isAccessTypeOfEntityDisplayed('LA Support 2', 'Read')).toBeTruthy('FailuerMsg2: Support Group is missing');
            expect(await accessTabPo.isAccessTypeOfEntityDisplayed('LA Support 3', 'Write')).toBeTruthy('FailuerMsg2: Support Group is missing');
            await viewCaseTemplate.clickEditTemplateMetaData();
            await editCasetemplatePo.changeTemplateStatusDropdownValue('Active');
            await editCasetemplatePo.clickOnSaveCaseTemplateMetadata();
            await viewCaseTemplate.clickBackArrowBtn();

            await consoleCasetemplatePo.searchAndClickOnCaseTemplate(caseTemplateData2.templateName);
            await viewCaseTemplate.selectTab('Case Access');

            await accessTabPo.clickToExpandAccessEntitiyByGroup('Confidential Access');
            await accessTabPo.selectAccessEntityDropDown('IN Support 1', 'Select Support Group');
            await accessTabPo.clickAccessEntitiyAddButton('Support Group');
            await accessTabPo.selectAccessEntityDropDown('IN Support 2', 'Select Support Group');
            await accessTabPo.clickAccessEntitiyAddButton('Support Group');
            await accessTabPo.selectAccessEntityDropDown('IN Support 3', 'Select Support Group');
            await accessTabPo.clickAssignWriteAccessCheckbox('Support Group');
            await accessTabPo.clickAccessEntitiyAddButton('Support Group');
            await accessTabPo.clickToExpandAccessEntitiyByGroup('Confidential Access');

            // await accessTabPo.clickToExpandAccessEntitiyByGroup('Case Access');
            // await accessTabPo.selectAccessEntityDropDown('Petramco', 'Select Company');
            // await accessTabPo.selectAccessEntityDropDown('US Support 2', 'Select Support Group');
            // await accessTabPo.clickAccessEntitiyAddButton('Support Group');

            expect(await accessTabPo.isAccessTypeOfEntityDisplayed('IN Support 1', 'Read')).toBeTruthy('FailuerMsg1: Support Group is missing');
            expect(await accessTabPo.isAccessTypeOfEntityDisplayed('IN Support 2', 'Read')).toBeTruthy('FailuerMsg2: Support Group is missing');
            expect(await accessTabPo.isAccessTypeOfEntityDisplayed('IN Support 3', 'Write')).toBeTruthy('FailuerMsg2: Support Group is missing');
            await viewCaseTemplate.clickEditTemplateMetaData();
            await editCasetemplatePo.changeTemplateStatusDropdownValue('Active');
            await editCasetemplatePo.clickOnSaveCaseTemplateMetadata();
            await viewCaseTemplate.clickBackArrowBtn();
        });
        it('[4138, 4139]: create case template using template1 and chagne to template2', async () => {
            let caseData = {
                "Requester": "apavlik",
                "Summary": "Test case for 5981",
                "Origin": "Agent",
                "Case Template ID": template1.id
            }
            await apiHelper.apiLogin('qtao');
            let newCase1 = await apiHelper.createCase(caseData);
            let caseId = newCase1.displayId;
            await navigationPage.gotoCaseConsole();
            await caseConsolePo.searchAndOpenCase(caseId);
            await viewCasePo.clickOnTab('Case Access');
            expect(await accessTabPo.isAccessTypeOfEntityDisplayed('LA Support 1', 'Read')).toBeTruthy('FailuerMsg1: Support Group is missing');
            expect(await accessTabPo.isAccessTypeOfEntityDisplayed('LA Support 2', 'Read')).toBeTruthy('FailuerMsg2: Support Group is missing');

            await viewCasePo.clickEditCaseButton();
            await editCasePo.clickOnChangeCaseTemplate();
            await selectCasetemplateBladePo.selectCaseTemplate(caseTemplateData2.templateName);
            await editCasePo.clickSaveCase();
            await viewCasePo.clickOnTab('Case Access');
            expect(await accessTabPo.isAccessTypeOfEntityDisplayed('IN Support 1', 'Read')).toBeTruthy('FailuerMsg1: Support Group is missing');
            expect(await accessTabPo.isAccessTypeOfEntityDisplayed('IN Support 2', 'Read')).toBeTruthy('FailuerMsg2: Support Group is missing');
        })
        it('[4138, 4139]: support group should visible in case access tab after copy case template', async() => {
            await navigationPage.signOut();
            await loginPage.login('qkatawazi');
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Case Management--Templates', BWF_PAGE_TITLES.CASE_MANAGEMENT.TEMPLATES);
            await consoleCasetemplatePo.searchAndClickOnCaseTemplate(caseTemplateData1.templateName);
            await viewCaseTemplate.clickCopycaseTemplate();
            await createCasetemplatePo.setTemplateName('CopiedTemplate'+randomStr);
            await createCasetemplatePo.clickSaveCaseTemplate();
            await viewCaseTemplate.clickBackArrowBtn();
            await viewCaseTemplate.clickBackArrowBtn();
            await consoleCasetemplatePo.searchAndClickOnCaseTemplate('CopiedTemplate'+randomStr);
            await viewCaseTemplate.selectTab('Case Access');
            expect(await viewCaseTemplate.getCategoryTier1()).toBe(caseTemplateData1.categoryTier1);
            expect(await accessTabPo.isAccessTypeOfEntityDisplayed('LA Support 1', 'Read')).toBeTruthy('FailuerMsg1: Support Group is missing');
            expect(await accessTabPo.isAccessTypeOfEntityDisplayed('LA Support 2', 'Read')).toBeTruthy('FailuerMsg2: Support Group is missing');
            expect(await accessTabPo.isAccessTypeOfEntityDisplayed('LA Support 3', 'Write')).toBeTruthy('FailuerMsg2: Support Group is missing');
        })
    });
});
