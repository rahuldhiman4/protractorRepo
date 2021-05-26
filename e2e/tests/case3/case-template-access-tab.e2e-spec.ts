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
import viewCasetemplatePo from '../../pageobject/settings/case-management/view-casetemplate.po';
import { ICaseTemplate } from '../../data/interface/template.interface';
import casePreviewPo from '../../pageobject/case/case-preview.po';
import createCasePo from '../../pageobject/case/create-case.po';
import quickCasePo from '../../pageobject/case/quick-case.po';
import assignmentsConfigConsolePo from '../../pageobject/settings/case-management/assignments-config-console.po';
import consoleNotificationTemplatePo from '../../pageobject/settings/notification-config/console-notification-template.po';
import utilityGrid from '../../utils/utility.grid';
import editNotificationTemplatePo from '../../pageobject/settings/notification-config/edit-notification-template.po';

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

    //ashastra
    describe('[4326,4374,4391]: closed case if reoped will follow new case status configuration cycle ', async () => {
        let caseTemplate, caseId;
        let randomStr = [...Array(8)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        beforeAll(async () => {
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
                "Summary": "Test case for 4326,4374,4391 " + randomStr,
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

        it('[4326,4374,4391]: change case status to closed using case agent', async () => {
            await navigationPage.gotoCaseConsole();
            await caseConsolePo.searchAndOpenCase(caseId);
            expect(await viewCasePo.isCaseReopenLinkPresent()).toBeFalsy();
            await updateStatusBladePo.changeStatus('Resolved');
            await updateStatusBladePo.selectStatusReason('Auto Resolved');
            await updateStatusBladePo.clickSaveStatus();
            await updateStatusBladePo.changeStatus('Closed');
            await updateStatusBladePo.clickSaveStatus();
            expect(await viewCasePo.getTextOfStatus()).toBe('Closed');
            expect(await viewCasePo.isCaseReopenLinkPresent()).toBeTruthy();
        })

        it('[4326,4374,4391]:add custom status in case using case BA', async () => {
            await navigationPage.signOut();
            await loginPage.login('jmilano'); // case BA
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Case Management--Status Configuration', BWF_PAGE_TITLES.CASE_MANAGEMENT.STATUS_CONFIGURATION);
            await statusConfigPo.setCompanyDropdown('Phylum', 'case');
            await statusConfigPo.clickEditLifeCycleLink();
            await statusConfigPo.addCustomStatus("In Progress", "Resolved", "customStatus");
        })

        it('[4326,4374,4391]:Reopen the closed case and follows the case status lifecycle', async () => {
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

        it('[4326,4374,4391]:delete added customStatus from case', async () => {
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

    //ashastra
    describe('[3992]: case is remained in new status, if after case asignee is empty', async () => {
        let caseTemplate1: ICaseTemplate, caseTemplate2: ICaseTemplate, flowset1, flowset2;
        let randomStr = [...Array(8)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        beforeAll(async () => {

            await navigationPage.signOut();
            await loginPage.login('qkatawazi');

            flowset1 = {
                "flowsetName": "Flowset1" + randomStr,
                "flowsetStatus": 10,
                "company": "Petramco",
                "description": "Test Flowset name description",
                "lineOfBusiness": "Human Resource"
            }
            flowset2 = {
                "flowsetName": "Flowset2" + randomStr,
                "flowsetStatus": 10,
                "company": "Petramco",
                "description": "Test Flowset name description",
                "lineOfBusiness": "Human Resource"
            }
            await apiHelper.apiLogin('qkatawazi');
            await apiHelper.createNewFlowset(flowset1);
            await apiHelper.createNewFlowset(flowset2);

            caseTemplate1 = {
                "templateName": 'caseTemplateForFlowset1' + randomStr,
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
                "ownerGroup": "US Support 3",
                "lineOfBusiness": "Human Resource"
            }

            caseTemplate2 = {
                "templateName": 'caseTemplateForFlowset2' + randomStr,
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
                "ownerGroup": "US Support 3",
                "lineOfBusiness": "Human Resource"
            }
            await apiHelper.apiLogin('qkatawazi');
            await apiHelper.createCaseTemplate(caseTemplate1);
            await apiHelper.createCaseTemplate(caseTemplate2);
        })

        it('[3992]: add custom status for flowset1 in case', async () => {
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Case Management--Assignments', BWF_PAGE_TITLES.CASE_MANAGEMENT.ASSIGNMENTS);
            await assignmentsConfigConsolePo.clearFilter();
            await assignmentsConfigConsolePo.addFilter('Company', '- Global -', 'text')
            await assignmentsConfigConsolePo.deleteFilteredAssignmentConfig();

            await navigationPage.gotoSettingsMenuItem('Case Management--Status Configuration', BWF_PAGE_TITLES.CASE_MANAGEMENT.STATUS_CONFIGURATION);
            await statusConfigPo.setCompanyDropdown('Petramco', 'case');
            await statusConfigPo.selectFlowset(flowset1.flowsetName)
            await statusConfigPo.clickEditLifeCycleLink();
            await statusConfigPo.addCustomStatus("New", "Assigned", "Ready");
        })

        it('[3992]: modify case template ready status for flowset1 and new status for flowset2', async () => {
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Case Management--Templates', BWF_PAGE_TITLES.CASE_MANAGEMENT.TEMPLATES);
            await consoleCasetemplatePo.searchAndClickOnCaseTemplate(caseTemplate1.templateName);
            await viewCasetemplatePo.clickOnEditCaseTemplateButton();
            await editCasetemplatePo.changeFlowsetValue(flowset1.flowsetName);
            await editCasetemplatePo.changeCaseStatusValue('Ready');
            await editCasetemplatePo.clickSaveCaseTemplate();
            await utilityCommon.closePopUpMessage();
            await editCasetemplatePo.clickOnEditCaseTemplateMetadata();
            await editCasetemplatePo.changeTemplateStatusDropdownValue('Active');
            await editCasetemplatePo.clickOnSaveCaseTemplateMetadata();
            await viewCasetemplatePo.clickBackArrowBtn();

            await consoleCasetemplatePo.searchAndClickOnCaseTemplate(caseTemplate2.templateName);
            await viewCasetemplatePo.clickOnEditCaseTemplateButton();
            await editCasetemplatePo.changeFlowsetValue(flowset2.flowsetName);
            await editCasetemplatePo.clickSaveCaseTemplate();
            await utilityCommon.closePopUpMessage();
            await editCasetemplatePo.clickOnEditCaseTemplateMetadata();
            await editCasetemplatePo.changeTemplateStatusDropdownValue('Active');
            await editCasetemplatePo.clickOnSaveCaseTemplateMetadata();
            await viewCasetemplatePo.clickBackArrowBtn();
        })

        it('[3992]: login with case agent and create case from create case and quick case without assignee and without template', async () => {
            await navigationPage.signOut();
            await loginPage.login('qtao');
            await navigationPage.gotoCreateCase();
            await createCasePo.selectRequester('qfeng');
            await createCasePo.setSummary('Summary for case 3');
            await createCasePo.clickSaveCaseButton();
            await casePreviewPo.clickGoToCaseButton();
            expect(await viewCasePo.getAssigneeText()).toBe('None');
            await viewCasePo.clickEditCaseButton();
            await editCasePo.updateCasePriority('High');
            await editCasePo.updateDescription('Test1')
            await editCasePo.clickSaveCase();
            expect(await viewCasePo.getTextOfStatus()).toBe('New');

            await navigationPage.gotoQuickCase();
            await quickCasePo.selectRequesterName('hhaas');
            await quickCasePo.setCaseSummary('Summary for case 2');
            await quickCasePo.createCaseButton();
            await casePreviewPo.clickGoToCaseButton();
            expect(await viewCasePo.getAssigneeText()).toBe('None');
            await viewCasePo.clickEditCaseButton();
            await editCasePo.updateCasePriority('Medium');
            await editCasePo.updateDescription('Test2')
            await editCasePo.clickSaveCase();
            expect(await viewCasePo.getTextOfStatus()).toBe('New');
        })

        it('[3992]: create case using template1 with flowset1 and update some fields and check case stautus', async () => {
            await navigationPage.gotoCreateCase();
            await createCasePo.selectRequester('apavlik');
            await createCasePo.setSummary('Summary for case template with flowset1');
            await createCasePo.clickSelectCaseTemplateButton();
            await selectCasetemplateBladePo.selectCaseTemplate(caseTemplate1.templateName);
            await createCasePo.clickSaveCaseButton();
            await casePreviewPo.clickGoToCaseButton();
            expect(await viewCasePo.getAssigneeText()).toBe('None');
            expect(await viewCasePo.getTextOfStatus()).toBe('Ready');
            await viewCasePo.clickEditCaseButton();
            await editCasePo.updateCasePriority('Low');
            await editCasePo.updateDescription('Test3')
            await editCasePo.clickSaveCase();
            expect(await viewCasePo.getTextOfStatus()).toBe('Ready');
        })

        it('[3992]: create case using template2 with flowset2 and update some fields and check case stautus', async () => {
            await navigationPage.gotoCreateCase();
            await createCasePo.selectRequester('apavlik');
            await createCasePo.setSummary('Summary for case template with flowset2');
            await createCasePo.clickSelectCaseTemplateButton();
            await selectCasetemplateBladePo.selectCaseTemplate(caseTemplate2.templateName);
            await createCasePo.clickSaveCaseButton();
            await casePreviewPo.clickGoToCaseButton();
            expect(await viewCasePo.getAssigneeText()).toBe('None');
            expect(await viewCasePo.getTextOfStatus()).toBe('New');
            await viewCasePo.clickEditCaseButton();
            await editCasePo.updateCasePriority('High');
            await editCasePo.updateDescription('Test4')
            await editCasePo.clickSaveCase();
            expect(await viewCasePo.getTextOfStatus()).toBe('New');
        })
    });

    //ashastra
    describe('[4407]: case site is editable on create/edit case view', async () => {
        let randomStr = [...Array(8)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        beforeAll(async () => {
            await navigationPage.signOut();
            await loginPage.login('qkatawazi');
        })

        it('[4407]: case site is editable on create/edit case view', async () => {
            await navigationPage.gotoCreateCase();
            await createCasePo.selectRequester('apavlik');
            await createCasePo.setSummary('Test for case site');
            await createCasePo.selectSite('Austin');
            await createCasePo.clickSaveCaseButton();
            await casePreviewPo.clickGoToCaseButton();
            expect(await viewCasePo.getCaseSite()).toBe('Austin');
            await viewCasePo.clickEditCaseButton();
            await editCasePo.updateCaseSite('Aichi');
            await editCasePo.updateSiteChangeReason('site change for test');
            await editCasePo.clickSaveCase();
            expect(await viewCasePo.getCaseSite()).toBe('Aichi');
        })
    });


});
