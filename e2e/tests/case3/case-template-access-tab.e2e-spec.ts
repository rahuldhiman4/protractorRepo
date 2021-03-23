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
import relatedTabPage from '../../pageobject/common/related-person-tab.po';
import addRelatedPopupPage from '../../pageobject/case/add-relation-pop.po';
import personProfilePage from '../../pageobject/common/person-profile.po';
import relatedCaseTabPo from '../../pageobject/common/related-case-tab.po';
import activityTabPo from '../../pageobject/social/activity-tab.po';
import updateStatusBladePo from '../..//pageobject/common/update.status.blade.po';
import statusConfigPo from '../../pageobject/settings/common/status-config.po';

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
            expect(await accessTabPo.isAccessTypeOfEntityDisplayed('LA Support 3', 'Write')).toBeTruthy('FailuerMsg2: Support Group is missing');

            await viewCasePo.clickEditCaseButton();
            await editCasePo.clickOnChangeCaseTemplate();
            await selectCasetemplateBladePo.selectCaseTemplate(caseTemplateData2.templateName);
            await editCasePo.clickSaveCase();
            await viewCasePo.clickOnTab('Case Access');
            expect(await accessTabPo.isAccessTypeOfEntityDisplayed('IN Support 1', 'Read')).toBeTruthy('FailuerMsg1: Support Group is missing');
            expect(await accessTabPo.isAccessTypeOfEntityDisplayed('IN Support 2', 'Read')).toBeTruthy('FailuerMsg2: Support Group is missing');
            expect(await accessTabPo.isAccessTypeOfEntityDisplayed('IN Support 3', 'Write')).toBeTruthy('FailuerMsg2: Support Group is missing');
        })
        it('[4138, 4139]: support group should visible in case access tab after copy case template', async () => {
            await navigationPage.signOut();
            await loginPage.login('qkatawazi');
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Case Management--Templates', BWF_PAGE_TITLES.CASE_MANAGEMENT.TEMPLATES);
            await consoleCasetemplatePo.searchAndClickOnCaseTemplate(caseTemplateData1.templateName);
            await viewCaseTemplate.clickCopycaseTemplate();
            await createCasetemplatePo.setTemplateName('CopiedTemplate' + randomStr);
            await createCasetemplatePo.clickSaveCaseTemplate();
            await viewCaseTemplate.clickBackArrowBtn();
            await consoleCasetemplatePo.searchAndClickOnCaseTemplate('CopiedTemplate' + randomStr);
            await viewCaseTemplate.selectTab('Case Access');
            expect(await viewCaseTemplate.getCategoryTier1()).toBe(caseTemplateData1.categoryTier1);
            expect(await accessTabPo.isAccessTypeOfEntityDisplayed('LA Support 1', 'Read')).toBeTruthy('FailuerMsg1: Support Group is missing');
            expect(await accessTabPo.isAccessTypeOfEntityDisplayed('LA Support 2', 'Read')).toBeTruthy('FailuerMsg2: Support Group is missing');
            expect(await accessTabPo.isAccessTypeOfEntityDisplayed('LA Support 3', 'Write')).toBeTruthy('FailuerMsg2: Support Group is missing');
            await viewCaseTemplate.clickBackArrowBtn();
        })
    });

    //ashastra
    describe('[4144]: Person removed from Case then it should be removed from Person Profile', async () => {
        let randomStr = [...Array(8)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        let caseId;
        beforeAll(async () => {
            let caseData = {
                "Requester": "apavlik",
                "Summary": "Test case for 4144" + randomStr,
                "Assigned Company": "Petramco",
                "Business Unit": "United States Support",
                "Support Group": "US Support 3",
                "Assignee": "qkatawazi"
            }
            await apiHelper.apiLogin('qkatawazi');
            let newCase1 = await apiHelper.createCase(caseData);
            caseId = newCase1.displayId;
        });
        it('[4144]: Person removed from Case then it should be removed from Person Profile', async () => {
            await navigationPage.gotoCaseConsole();
            await caseConsolePo.searchAndOpenCase(caseId);
            await viewCasePo.clickOnTab('Related Persons');
            await relatedTabPage.addRelatedPerson();
            await addRelatedPopupPage.addPerson('Qianru Tao', 'Inspector');
            expect(await relatedTabPage.isPersonRelatedHasCorrectRelation('Qianru Tao', 'Inspector')).toBeTruthy();
            try {
                await relatedTabPage.clickRelatedPersonName('Qianru Tao');
                await utilityCommon.switchToNewTab(1);
                await personProfilePage.clickOnTab('Related Cases');
                expect(await relatedCaseTabPo.getRelatedCaseAssignee(caseId)).toBe('Qadim Katawazi');
                expect(await relatedCaseTabPo.getRelatedCaseModDate(caseId)).toContain('Modified');
                expect(await relatedCaseTabPo.getRelatedCasePriority(caseId)).toBe('Medium');
                expect(await relatedCaseTabPo.getRelatedCaseStatus(caseId)).toBe('Assigned');
                expect(await relatedCaseTabPo.getRelatedCaseRelation(caseId)).toBe('Inspector');
            }
            catch (ex) { throw ex }
            finally {
                await utilityCommon.switchToNewTab(0);
                await utilityCommon.switchToDefaultWindowClosingOtherTabs();
            }
            await relatedTabPage.removeRelatedPerson("Qianru Tao");
            expect(await relatedTabPage.isRelatedPersonPresent('Qianru Tao')).toBeFalsy();
            await activityTabPo.clickOnHyperlink('Qianru Tao');
            await personProfilePage.clickOnTab('Related Cases');
            expect(await relatedCaseTabPo.isCasePresent(caseId)).toBeFalsy();
        });
    });

    describe('[4326,4374]: closed case if reoped will follow new case status configuration cycle ', async() => {
        let caseTemplate, caseId;
        let randomStr = [...Array(8)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        beforeAll(async() => {
            await navigationPage.signOut();
            await loginPage.login('jmilano'); // should be case agent
            caseTemplate = {
                "templateName": 'caseTemplate' + randomStr,
                "templateSummary": 'case summary',
                "description": "case description",
                "categoryTier1": "Accounts Payable",
                "casePriority": "High",
                "templateStatus": "Active",
                "caseStatus": "New",
                "company": "Phylum",
                "businessUnit": "Phylum Support Org1",
                "supportGroup": "Phylum Support Group1",
                "ownerBU": "Phylum Support Org1",
                "Assignee": "mcarney",
                "ownerGroup": "Phylum Support Group1",
                "lineOfBusiness": "Finance",
                "allowCaseReopen": "true"
            }
            await apiHelper.apiLogin('jmilano');
            let template = await apiHelper.createCaseTemplate(caseTemplate);
            let caseData = {
                "Requester": "mcarney",
                "Summary": "Test case for 4326,4374 " + randomStr,
                "Assigned Company": "Phylum",
                "Business Unit": "Phylum Support Org1",
                "Support Group": "Phylum Support Group1",
                "Assignee": "jmilano",
                "Case Template ID": template.id,
                "lineOfBusiness": "Finance"
            }
            await apiHelper.apiLogin('jmilano');
            let newCase1 = await apiHelper.createCase(caseData);
            caseId = newCase1.displayId;
        })

        it('[4326,4374]: change case status to closed using case agent', async() => {
            await navigationPage.gotoCaseConsole();
            await caseConsolePo.searchAndOpenCase(caseId);
            await updateStatusBladePo.changeStatus('Resolved');
            await updateStatusBladePo.selectStatusReason('Auto Resolved');
            await updateStatusBladePo.clickSaveStatus();
            await updateStatusBladePo.changeStatus('Closed');
            await updateStatusBladePo.clickSaveStatus();
            expect(await viewCasePo.getTextOfStatus()).toBe('Closed');
        })

        it('[4326,4374]:add custom status in case using case BA', async() => {
            await navigationPage.signOut();
            await loginPage.login('jmilano'); // case BA
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Case Management--Status Configuration', BWF_PAGE_TITLES.CASE_MANAGEMENT.STATUS_CONFIGURATION);
            await statusConfigPo.setCompanyDropdown('Phylum', 'case');
            await statusConfigPo.clickEditLifeCycleLink();
            await statusConfigPo.addCustomStatus("In Progress", "Resolved", "customStatus");
        })

        it('[4326,4374]:Reopen the closed case and follows the case status lifecycle', async() => {
            await navigationPage.gotoCaseConsole();
            await caseConsolePo.searchAndOpenCase(caseId);
            await viewCasePo.clickOnReopenCaseLink();
            await activityTabPo.clickOnRefreshButton();
            expect(await viewCasePo.getTextOfStatus()).toBe('In Progress', 'FailureMsg1: In-Progress status is missing');
            expect(await activityTabPo.isTextPresentInActivityLog('Jeanne Milano reopened the case')).toBeTruthy('FailureMsg2: Text is missing');
            expect(await activityTabPo.isTextPresentInActivityLog('The case was reopened for 1 time')).toBeTruthy('FailureMsg3: Text is missing');
            await updateStatusBladePo.changeStatus('customStatus');
            await updateStatusBladePo.clickSaveStatus();
            await updateStatusBladePo.changeStatus('Resolved');
            await updateStatusBladePo.selectStatusReason('Auto Resolved');
            await updateStatusBladePo.clickSaveStatus();
            await updateStatusBladePo.changeStatus('Closed');
            await updateStatusBladePo.clickSaveStatus();
            expect(await viewCasePo.getTextOfStatus()).toBe('Closed');
        })

        it('[4326,4374]:delete added customStatus from case', async() => {
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Case Management--Status Configuration', BWF_PAGE_TITLES.CASE_MANAGEMENT.STATUS_CONFIGURATION);
            await statusConfigPo.setCompanyDropdown('Phylum', 'case');
            await statusConfigPo.clickEditLifeCycleLink();
            await statusConfigPo.clickEditStatus("customStatus");
            expect(await statusConfigPo.isDeleteButtonDisplayed()).toBeTruthy();
            await statusConfigPo.clickOnDeleteButton();
            await utilityCommon.clickOnApplicationWarningYesNoButton("Yes");
        })
    });
});
