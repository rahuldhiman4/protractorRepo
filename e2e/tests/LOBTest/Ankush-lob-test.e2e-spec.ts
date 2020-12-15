import { browser } from "protractor";
import apiCoreUtil from '../../api/api.core.util';
import apiHelper from '../../api/api.helper';
import caseConsolePo from '../../pageobject/case/case-console.po';
import casePreviewPo from '../../pageobject/case/case-preview.po';
import createCasePo from '../../pageobject/case/create-case.po';
import editCasePo from '../../pageobject/case/edit-case.po';
import quickCasePo from '../../pageobject/case/quick-case.po';
import viewCasePo from '../../pageobject/case/view-case.po';
import localizeValuePopPo from '../../pageobject/common/localize-value-pop.po';
import loginPage from "../../pageobject/common/login.po";
import navigationPage from "../../pageobject/common/navigation.po";
import createKnowledgePage from "../../pageobject/knowledge/create-knowlege.po";
import knowledgeArticlesConsolePo from '../../pageobject/knowledge/knowledge-articles-console.po';
import previewKnowledgePo from '../../pageobject/knowledge/preview-knowledge.po';
import createMenuItemsBladePo from '../../pageobject/settings/application-config/create-menu-items-blade.po';
import dynamicFieldLibraryConfigConsolePo from '../../pageobject/settings/application-config/dynamic-field-library-config-console.po';
import dynamicGroupLibraryConfigConsolePo from '../../pageobject/settings/application-config/dynamic-group-library-config-console.po';
import menuItemsConfigConsolePo from '../../pageobject/settings/application-config/menu-items-config-console.po';
import approvalMappingConsolePo from '../../pageobject/settings/case-management/approval-mapping-console.po';
import assignmentsConfigConsolePo from '../../pageobject/settings/case-management/assignments-config-console.po';
import automatedStatusTransitionConsolePo from '../../pageobject/settings/case-management/automated-status-transition-console.po';
import consoleCasetemplatePo from '../../pageobject/settings/case-management/console-casetemplate.po';
import createCasetemplatePo from '../../pageobject/settings/case-management/create-casetemplate.po';
import readAccessConsolePo from '../../pageobject/settings/case-management/read-access-console.po';
import viewCasetemplatePo from '../../pageobject/settings/case-management/view-casetemplate.po';
import consoleNotestemplatePo from '../../pageobject/settings/common/console-notestemplate.po';
import statusConfigPo from '../../pageobject/settings/common/status-config.po';
import createDocumentLibraryPo from '../../pageobject/settings/document-management/create-document-library.po';
import createDocumentTemplatePo from '../../pageobject/settings/document-management/create-document-template.po';
import consoleAcknowledgmentTemplatePo from '../../pageobject/settings/email/console-acknowledgment-template.po';
import consoleEmailConfigurationPo from '../../pageobject/settings/email/console-email-configuration.po';
import consoleEmailTemplatePo from '../../pageobject/settings/email/console-email-template.po';
import editEmailConfigPo from '../../pageobject/settings/email/edit-email-config.po';
import approvalMappingConsoleKnowledgePo from "../../pageobject/settings/knowledge-management/approval-mapping-console.po";
import consoleKnowledgeSetPo from '../../pageobject/settings/knowledge-management/console-knowledge-set.po';
import consoleKnowledgeTemplatePo from '../../pageobject/settings/knowledge-management/console-knowledge-template.po';
import consoleFlowsetConfigPo from '../../pageobject/settings/manage-flowset/console-flowset-config.po';
import consoleNotificationEventPo from '../../pageobject/settings/notification-config/console-notification-event.po';
import notificationTempGridPage from "../../pageobject/settings/notification-config/console-notification-template.po";
import createServiceTargetGroupPo from '../../pageobject/settings/slm/create-service-target-group.po';
import editServiceTargetGroupConfigPo from '../../pageobject/settings/slm/edit-service-target-group-config.po';
import serviceTargetGroupConsolePo from '../../pageobject/settings/slm/service-target-group-console.po';
import selectTaskTemplate from "../../pageobject/settings/task-management/console-tasktemplate.po";
import createAdhocTaskPo from '../../pageobject/task/create-adhoc-task.po';
import manageTaskBladePo from '../../pageobject/task/manage-task-blade.po';
import viewTaskPo from '../../pageobject/task/view-task.po';
import { BWF_BASE_URL } from '../../utils/constants';
import utilCommon from '../../utils/util.common';
import utilGrid from '../../utils/util.grid';
import utilityCommon from '../../utils/utility.common';
import utilityGrid from '../../utils/utility.grid';

describe('test file', () => {
    const businessDataFile = require('../../data/ui/foundation/businessUnit.ui.json');
    const departmentDataFile = require('../../data/ui/foundation/department.ui.json');
    const supportGrpDataFile = require('../../data/ui/foundation/supportGroup.ui.json');
    const personDataFile = require('../../data/ui/foundation/person.ui.json');
    let businessData = businessDataFile['PsilonBusinessUnitHRLOB'];
    let departmentData = departmentDataFile['PsilonDepartmentHRLOB'];
    let suppGrpData = supportGrpDataFile['PsilonSuppGrpHRLOB'];
    let personData = personDataFile['HRCBALOBCBA'];
    let personData1 = personDataFile['HRCALOBCBA'];
    let personData2 = personDataFile['HRCMLOBCBA'];
    let caseID, TaskID, KnowledgeArticleID, templateData, templateData1, randomStr = Math.floor(Math.random() * 1000000);

    beforeAll(async () => {
        await browser.get(BWF_BASE_URL);
        await loginPage.login('qkatawazi');

        templateData = {
            "templateName": randomStr + "CaseTemplateDraft DRDMV23738",
            "templateSummary": randomStr + "SummaryDraft DRDMV23738",
            "categoryTier1": "Purchasing Card",
            "categoryTier2": "Policies",
            "categoryTier3": "Card Issuance",
            "casePriority": "Low",
            "templateStatus": "Draft",
            "company": "Petramco",
            "businessUnit": "United States Support",
            "supportGroup": "US Support 3"
        }
        templateData1 = {
            "templateName": randomStr + "CaseTemplatePsilon DRDMV23738",
            "templateSummary": randomStr + "SummaryPsilon DRDMV23738",
            "templateStatus": "Active",
            "company": 'Psilon',
            "businessUnit": "Psilon Support Org1",
            "supportGroup": "Psilon Support Group1",
            "assignee": "rrovnitov",
            "ownerBU": 'Psilon Support Org1',
            "ownerGroup": "Psilon Support Group1"
        }
        await apiHelper.apiLogin('qkatawazi');
        await apiHelper.createCaseTemplate(templateData);
        await apiHelper.apiLogin('gwixillian');
        await apiHelper.createCaseTemplate(templateData1);
    });

    afterAll(async () => {
        await navigationPage.signOut();
    });
    async function foundationData(company: string) {
        let LineOfBuisness = {
            "lobName": "HR",
            "description": "HR description",
            "status": "Active",
        }

        let knowledgeSetData = {
            knowledgeSetTitle: "test knowledge" + randomStr,
            knowledgeSetDesc: "test description",
            company: 'Psilon'
        }

        let templateData = {
            "templateName": 'DRDMV-23738' + randomStr,
            "templateSummary": 'DRDMV-23738' + randomStr,
            "caseStatus": "InProgress",
            "templateStatus": "Active",
            "company": "Petramco",
            "businessUnit": "United States Support",
            "supportGroup": "US Support 3",
            "assignee": "qkatawazi",
            "ownerBU": 'United States Support',
            "ownerGroup": "US Support 3",
        }
        await apiHelper.apiLogin('qkatawazi');
        await apiHelper.createCaseTemplate(templateData);
        await apiHelper.apiLogin('tadmin');
        personData.userPermission = ["Case Business Analyst", "HR"]
        let orgId = await apiCoreUtil.getOrganizationGuid(company);
        businessData.relatedOrgId = orgId;
        apiHelper.createLineOfBuisness(LineOfBuisness)
        let businessUnitId = await apiHelper.createBusinessUnit(businessData);
        await browser.sleep(5000); // timeout requried to reflect data on UI
        departmentData.relatedOrgId = businessUnitId;
        let depId = await apiHelper.createDepartment(departmentData);
        await browser.sleep(7000); // timeout requried to reflect data on UI
        suppGrpData.relatedOrgId = depId;
        await apiHelper.createSupportGroup(suppGrpData);
        await browser.sleep(5000); // timeout requried to reflect data on UI
        await apiHelper.createNewUser(personData);
        await apiHelper.associatePersonToSupportGroup(personData.userId, suppGrpData.orgName);
        await apiHelper.associatePersonToCompany(personData.userId, company);
        await browser.sleep(5000); // timeout requried to reflect data on UI
        await apiHelper.createNewUser(personData1);
        await apiHelper.associatePersonToSupportGroup(personData1.userId, suppGrpData.orgName);
        await apiHelper.associatePersonToCompany(personData1.userId, company);
        await browser.sleep(5000); // timeout requried to reflect data on UI
        await apiHelper.createNewUser(personData2);
        await apiHelper.associatePersonToSupportGroup(personData2.userId, suppGrpData.orgName);
        await apiHelper.associatePersonToCompany(personData2.userId, company);
        await browser.sleep(5000); // timeout requried to reflect data on UI
        await apiHelper.apiLogin(personData.userId + "@petramco.com", 'Password_1234');
        await apiHelper.createKnowledgeSet(knowledgeSetData);
    }

    //ankagraw
    describe('[DRDMV-23739,DRDMV-23740]: Validate that LOB specific Functional Role available for the foundation users', async () => {
        it('[DRDMV-23739,DRDMV-23740]: Validate that LOB specific Functional Role available for the foundation users', async () => {
            await foundationData("Psilon");
            await navigationPage.signOut();
            await loginPage.login(personData1.userId + "@petramco.com", 'Password_1234')
            await navigationPage.gotoCaseConsole();
            expect(await caseConsolePo.getLineOfBuisnessText()).toBe('HR');
            expect(await caseConsolePo.isLineOfBuisnessEnable()).toBeFalsy();
            await navigationPage.gotoCreateCase();
            await createCasePo.selectRequester(personData.userId);
            await createCasePo.setSummary("test 123");
            await createCasePo.clickAssignToMeButton();
            await createCasePo.clickSaveCaseButton();
            await casePreviewPo.clickGoToCaseButton();
            caseID = viewCasePo.getCaseID();
            await viewCasePo.clickAddTaskButton();
            await manageTaskBladePo.clickAddAdhocTaskButton();
            await createAdhocTaskPo.setSummary('summary' + randomStr);
            await createAdhocTaskPo.setDescription("Description");
            await createAdhocTaskPo.clickSaveAdhoctask();
            await utilityCommon.closePopUpMessage();
            await manageTaskBladePo.clickCloseButton();
            await viewCasePo.clickOnRefreshTaskList();
            await viewCasePo.clickOnTaskLink('summary' + randomStr);
            TaskID = await viewTaskPo.getTaskID();
            await navigationPage.gotoKnowledgeConsole();
            expect(await knowledgeArticlesConsolePo.getLineOfBuisnessText()).toBe('HR');
            expect(await knowledgeArticlesConsolePo.isLineOfBuisnessEnable()).toBeFalsy();
            await navigationPage.gotoCreateKnowledge();
            await createKnowledgePage.clickOnTemplate("Reference");
            await createKnowledgePage.clickOnUseSelectedTemplateButton();
            await createKnowledgePage.addTextInKnowlegeTitleField('test');
            await createKnowledgePage.selectKnowledgeSet("test knowledge" + randomStr);
            await createKnowledgePage.clickAssignToMeButton();
            await createKnowledgePage.clickOnSaveKnowledgeButton();
            KnowledgeArticleID = await previewKnowledgePo.getKnowledgeArticleID();

            await navigationPage.gotoSettingsPage();
            expect(await navigationPage.isSettingMenuPresent('Case Management')).toBeFalsy();
            expect(await navigationPage.isSettingMenuPresent('Document Management')).toBeFalsy();
            expect(await navigationPage.isSettingMenuPresent('Manage Flowsets')).toBeFalsy();
            expect(await navigationPage.isSettingMenuPresent('People')).toBeFalsy();
            expect(await navigationPage.isSettingMenuPresent('Service Level Management')).toBeFalsy();
            expect(await navigationPage.isSettingMenuPresent('Relationships')).toBeFalsy();
            expect(await navigationPage.isSettingMenuPresent('Email')).toBeFalsy();
            expect(await navigationPage.isSettingMenuPresent('Task Management')).toBeFalsy();

        });

        it('[DRDMV-23739,DRDMV-23740]: Validate that LOB specific Functional Role available for the foundation users', async () => {
            await navigationPage.signOut();
            await loginPage.login(personData2.userId + "@petramco.com", 'Password_1234')
            await navigationPage.gotoCaseConsole();
            expect(await caseConsolePo.getLineOfBuisnessText()).toBe('HR');
            expect(await caseConsolePo.isLineOfBuisnessEnable()).toBeFalsy();
            await navigationPage.gotoCreateCase();
            await createCasePo.selectRequester(personData.userId);
            await createCasePo.setSummary("test 123");
            await createCasePo.clickAssignToMeButton();
            await createCasePo.clickSaveCaseButton();
            await casePreviewPo.clickGoToCaseButton();
            await navigationPage.gotoKnowledgeConsole();
            expect(await knowledgeArticlesConsolePo.getLineOfBuisnessText()).toBe('HR');
            expect(await knowledgeArticlesConsolePo.isLineOfBuisnessEnable()).toBeFalsy();
            await navigationPage.gotoCreateKnowledge();
            await createKnowledgePage.clickOnTemplate("Reference");
            await createKnowledgePage.clickOnUseSelectedTemplateButton();
            await createKnowledgePage.addTextInKnowlegeTitleField('test');
            await createKnowledgePage.selectKnowledgeSet("test knowledge" + randomStr);
            await createKnowledgePage.clickAssignToMeButton();
            await createKnowledgePage.clickOnSaveKnowledgeButton();

            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Application Configuration--Menu Items', 'Menu Items - Business Workflows');
            expect(await createMenuItemsBladePo.isMenuOptionLinkEnabled()).toBeFalsy();

            await navigationPage.gotoSettingsMenuItem('Application Configuration--Dynamic Field Library', 'Field Management Console - Business Workflows');
            expect(await dynamicFieldLibraryConfigConsolePo.isAddDynamicFieldButtonEnabled()).toBeFalsy();

            await navigationPage.gotoSettingsMenuItem('Application Configuration--Dynamic Group Library', 'Group Management Console - Business Workflows');
            expect(await dynamicGroupLibraryConfigConsolePo.isAddDynamicGroupButtonEnabled()).toBeFalsy();

            await navigationPage.gotoSettingsMenuItem('Case Management--Templates', 'Case Templates - Business Workflows');
            expect(await consoleCasetemplatePo.isCreateCaseTemplateEnabled()).toBeFalsy();
            expect(await utilityGrid.isGridRecordPresent(caseID)).toBeFalsy();

            await navigationPage.gotoSettingsMenuItem('Case Management--Approvals', 'Configure Case Approvals - Business Workflows');
            expect(await approvalMappingConsolePo.isCreateApprovalMappingBtnEnabled()).toBeFalsy();

            await navigationPage.gotoSettingsMenuItem('Case Management--Assignments', 'Configure Case Assignments - Business Workflows');
            expect(await assignmentsConfigConsolePo.isCreateAssignmentConfigurationEnabled()).toBeFalsy();

            await navigationPage.gotoSettingsMenuItem('Case Management--Automated Status Transition', 'Configure Automated Status Transitions - Business Workflows');
            expect(await automatedStatusTransitionConsolePo.isAddAutomatedStatusTransitionBtnEnabled()).toBeFalsy();

            await navigationPage.gotoSettingsMenuItem('Case Management--Notes Template', 'Activity Notes Template Console - Case - Business Workflows');
            expect(await consoleNotestemplatePo.isCreateNotesTemplateEnabled()).toBeFalsy();

            await navigationPage.gotoSettingsMenuItem('Case Management--Read Access', 'Case Read Access Configuration - Business Workflows');
            expect(await readAccessConsolePo.isAddButtonEnabled()).toBeFalsy();

            await navigationPage.gotoSettingsMenuItem('Case Management--Status Configuration', 'Configure Case Status Transition - Business Workflows');
            await statusConfigPo.setCompanyDropdown('Petramco', 'case');
            expect(await statusConfigPo.isEditLifeCycleBtnDisabled()).toBeTruthy();

            await navigationPage.gotoSettingsMenuItem('Document Management--Library', 'Document Library Console - Business Workflows');
            expect(await createDocumentLibraryPo.isAddNewDocumentBladeEnabled()).toBeFalsy();

            await navigationPage.gotoSettingsMenuItem('Document Management--Templates', 'Document Templates - Business Workflows');
            expect(await createDocumentTemplatePo.isAddTemplateEnabled()).toBeFalsy();

        });

        it('[DRDMV-23739,DRDMV-23740]: Validate that LOB specific Functional Role available for the foundation users', async () => {
            await navigationPage.gotoSettingsMenuItem('Email--Acknowledgment Templates', 'Email Ack Template Console - Business Workflows');
            expect(await consoleAcknowledgmentTemplatePo.isAddAcknowledgeTemplateButtonEnabled()).toBeFalsy();

            await navigationPage.gotoSettingsMenuItem('Email--Configuration', 'Email Box Console - Business Workflows');
            expect(await consoleEmailConfigurationPo.isNewEmailConfigurationEnabled()).toBeFalsy();

            await navigationPage.gotoSettingsMenuItem('Email--Templates', 'Email Template Console - Business Workflows');
            expect(await consoleEmailTemplatePo.isAddEmailTemplateButtonEnabled()).toBeFalsy();

            await navigationPage.gotoSettingsMenuItem('Knowledge Management--Approvals', 'Configure Knowledge Approval Mapping - Business Workflows');
            expect(await approvalMappingConsoleKnowledgePo.isCreateApprovalMappingBtnEnabled()).toBeFalsy();

            await navigationPage.gotoSettingsMenuItem('Knowledge Management--Article Templates', 'Knowledge Article Templates');
            expect(await consoleKnowledgeTemplatePo.isCreateNewKATemplateEnabled()).toBeFalsy();

            await navigationPage.gotoSettingsMenuItem('Knowledge Management--Knowledge Sets', 'Knowledge Set Console');
            expect(await consoleKnowledgeSetPo.isAddKnowledgeSetBtnEnabled()).toBeFalsy();

            await navigationPage.gotoSettingsMenuItem('Knowledge Management--Notes Template', 'Activity Notes Template Console - Knowledge - Business Workflows');
            expect(await consoleNotestemplatePo.isCreateNotesTemplateEnabled()).toBeFalsy();

            await navigationPage.gotoSettingsMenuItem('Manage Flowsets--Define Flowsets', 'Flowsets - Console - Business Workflows');
            expect(consoleFlowsetConfigPo.isAddFlowsetButtonEnabled()).toBeFalsy();

            await navigationPage.gotoSettingsMenuItem('Manage Flowsets--Process Library', 'Process Library - Console - Business Workflows');
            expect(consoleFlowsetConfigPo.isAddFlowsetButtonEnabled()).toBeFalsy();

            await navigationPage.gotoSettingsMenuItem('Notification Configuration--Manage Templates', 'Manage Notification Template - Business Workflows');
            expect(await notificationTempGridPage.isAddNotificationTemplateBtnEnabled()).toBeFalsy();

            await navigationPage.gotoSettingsMenuItem('Notification Configuration--Manage Events', 'Manage Notification Event - Business Workflows');
            expect(await consoleNotificationEventPo.isAddNotificationEventBtnEnabled()).toBeFalsy();

            await navigationPage.gotoSettingsMenuItem('People--Notes Template', 'Activity Notes Template Console - Person - Business Workflows');
            expect(await consoleNotestemplatePo.isCreateNotesTemplateEnabled()).toBeFalsy();

            await navigationPage.gotoSettingsMenuItem('Task Management--Templates', 'Task Templates - Business Workflows');
            expect(await selectTaskTemplate.isManualTaskTemplateButtonEnabled()).toBeFalsy();
            expect(await selectTaskTemplate.isAutomationTaskTemplateButtonEnabled()).toBeFalsy();
            expect(await selectTaskTemplate.isExtrnalTaskTemplateButtonEnabled()).toBeFalsy();
        });

        it('[DRDMV-23739,DRDMV-23740]: Validate that LOB specific Functional Role available for the foundation users', async () => {
            await navigationPage.signOut();
            await loginPage.login(personData.userId + "@petramco.com", 'Password_1234');
            await navigationPage.gotoCaseConsole();
            expect(await caseConsolePo.getLineOfBuisnessText()).toBe('HR');
            expect(await caseConsolePo.isLineOfBuisnessEnable()).toBeFalsy();
            await navigationPage.gotoCreateCase();
            await createCasePo.selectRequester(personData1.userId);
            await createCasePo.setSummary("test 123");
            await createCasePo.clickAssignToMeButton();
            await createCasePo.clickSaveCaseButton();
            await casePreviewPo.clickGoToCaseButton();
            await navigationPage.gotoQuickCase();
            expect(await quickCasePo.isCaseSummaryPresentInRecommendedCases('templateData.templateName')).toBeFalsy();
            await navigationPage.gotoKnowledgeConsole();
            expect(await knowledgeArticlesConsolePo.getLineOfBuisnessText()).toBe('HR');
            expect(await knowledgeArticlesConsolePo.isLineOfBuisnessEnable()).toBeFalsy();
            await navigationPage.gotoCreateKnowledge();
            await createKnowledgePage.clickOnTemplate("Reference");
            await createKnowledgePage.clickOnUseSelectedTemplateButton();
            await createKnowledgePage.addTextInKnowlegeTitleField('test');
            await createKnowledgePage.selectKnowledgeSet("test knowledge" + randomStr);
            await createKnowledgePage.clickAssignToMeButton();
            await createKnowledgePage.clickOnSaveKnowledgeButton();


            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Application Configuration--Menu Items', 'Menu Items - Business Workflows');
            expect(await createMenuItemsBladePo.isMenuOptionLinkEnabled()).toBeTruthy();

            await navigationPage.gotoSettingsMenuItem('Application Configuration--Dynamic Field Library', 'Field Management Console - Business Workflows');
            expect(await dynamicFieldLibraryConfigConsolePo.isAddDynamicFieldButtonEnabled()).toBeTruthy();

            await navigationPage.gotoSettingsMenuItem('Application Configuration--Dynamic Group Library', 'Group Management Console - Business Workflows');
            expect(await dynamicGroupLibraryConfigConsolePo.isAddDynamicGroupButtonEnabled()).toBeFalsy();

            await navigationPage.gotoSettingsMenuItem('Case Management--Templates', 'Case Templates - Business Workflows');
            expect(await consoleCasetemplatePo.isCreateCaseTemplateEnabled()).toBeTruthy();
            expect(await utilityGrid.isGridRecordPresent(caseID)).toBeFalsy();

            await navigationPage.gotoSettingsMenuItem('Case Management--Approvals', 'Configure Case Approvals - Business Workflows');
            expect(await approvalMappingConsolePo.isCreateApprovalMappingBtnEnabled()).toBeTruthy();

            await navigationPage.gotoSettingsMenuItem('Case Management--Assignments', 'Configure Case Assignments - Business Workflows');
            expect(await assignmentsConfigConsolePo.isCreateAssignmentConfigurationEnabled()).toBeTruthy();

            await navigationPage.gotoSettingsMenuItem('Case Management--Automated Status Transition', 'Configure Automated Status Transitions - Business Workflows');
            expect(await automatedStatusTransitionConsolePo.isAddAutomatedStatusTransitionBtnEnabled()).toBeTruthy();

            await navigationPage.gotoSettingsMenuItem('Case Management--Notes Template', 'Activity Notes Template Console - Case - Business Workflows');
            expect(await consoleNotestemplatePo.isCreateNotesTemplateEnabled()).toBeTruthy();

            await navigationPage.gotoSettingsMenuItem('Case Management--Read Access', 'Case Read Access Configuration - Business Workflows');
            expect(await readAccessConsolePo.isAddButtonEnabled()).toBeTruthy();

            await navigationPage.gotoSettingsMenuItem('Case Management--Status Configuration', 'Configure Case Status Transition - Business Workflows');
            await statusConfigPo.setCompanyDropdown('Petramco', 'case');
            expect(await statusConfigPo.isEditLifeCycleBtnDisabled()).toBeFalsy();

            await navigationPage.gotoSettingsMenuItem('Document Management--Library', 'Document Library Console - Business Workflows');
            expect(await createDocumentLibraryPo.isAddNewDocumentBladeEnabled()).toBeTruthy();

            await navigationPage.gotoSettingsMenuItem('Document Management--Templates', 'Document Templates - Business Workflows');
            expect(await createDocumentTemplatePo.isAddTemplateEnabled()).toBeTruthy();

        });

        it('[DRDMV-23739,DRDMV-23740]: Validate that LOB specific Functional Role available for the foundation users', async () => {
            await navigationPage.gotoSettingsMenuItem('Email--Acknowledgment Templates', 'Email Ack Template Console - Business Workflows');
            expect(await consoleAcknowledgmentTemplatePo.isAddAcknowledgeTemplateButtonEnabled()).toBeTruthy();

            await navigationPage.gotoSettingsMenuItem('Email--Configuration', 'Email Box Console - Business Workflows');
            expect(await consoleEmailConfigurationPo.isNewEmailConfigurationEnabled()).toBeTruthy();

            await navigationPage.gotoSettingsMenuItem('Email--Templates', 'Email Template Console - Business Workflows');
            expect(await consoleEmailTemplatePo.isAddEmailTemplateButtonEnabled()).toBeTruthy();

            await navigationPage.gotoSettingsMenuItem('Knowledge Management--Approvals', 'Configure Knowledge Approval Mapping - Business Workflows');
            expect(await approvalMappingConsoleKnowledgePo.isCreateApprovalMappingBtnEnabled()).toBeTruthy();

            await navigationPage.gotoSettingsMenuItem('Knowledge Management--Article Templates', 'Knowledge Article Templates');
            expect(await consoleKnowledgeTemplatePo.isCreateNewKATemplateEnabled()).toBeTruthy();

            await navigationPage.gotoSettingsMenuItem('Knowledge Management--Knowledge Sets', 'Knowledge Set Console');
            expect(await consoleKnowledgeSetPo.isAddKnowledgeSetBtnEnabled()).toBeTruthy();

            await navigationPage.gotoSettingsMenuItem('Knowledge Management--Notes Template', 'Activity Notes Template Console - Knowledge - Business Workflows');
            expect(await consoleNotestemplatePo.isCreateNotesTemplateEnabled()).toBeTruthy();

            await navigationPage.gotoSettingsMenuItem('Manage Flowsets--Define Flowsets', 'Flowsets - Console - Business Workflows');
            expect(consoleFlowsetConfigPo.isAddFlowsetButtonEnabled()).toBeTruthy("Add flowset is disabled");

            await navigationPage.gotoSettingsMenuItem('Manage Flowsets--Process Library', 'Process Library - Console - Business Workflows');
            expect(consoleFlowsetConfigPo.isAddFlowsetButtonEnabled()).toBeTruthy();

            await navigationPage.gotoSettingsMenuItem('Notification Configuration--Manage Templates', 'Manage Notification Template - Business Workflows');
            expect(await notificationTempGridPage.isAddNotificationTemplateBtnEnabled()).toBeTruthy();

            await navigationPage.gotoSettingsMenuItem('Notification Configuration--Manage Events', 'Manage Notification Event - Business Workflows');
            expect(await consoleNotificationEventPo.isAddNotificationEventBtnEnabled()).toBeTruthy();

            await navigationPage.gotoSettingsMenuItem('People--Notes Template', 'Activity Notes Template Console - Person - Business Workflows');
            expect(await consoleNotestemplatePo.isCreateNotesTemplateEnabled()).toBeTruthy();

            await navigationPage.gotoSettingsMenuItem('Task Management--Templates', 'Task Templates - Business Workflows');
            expect(await selectTaskTemplate.isManualTaskTemplateButtonEnabled()).toBeTruthy();
            expect(await selectTaskTemplate.isAutomationTaskTemplateButtonEnabled()).toBeTruthy();
            expect(await selectTaskTemplate.isExtrnalTaskTemplateButtonEnabled()).toBeTruthy();
        });
    });


    //ankagraw
    //this test case failed due to defect DRDMV-24208 
    it('[DRDMV-24248]: Adobe, DocuSign and White configuration should visible to Tadmin only', async () => {
        let tadminApplicationConfigurationList: string[] = ['Application Configuration', 'Adobe Sign Configuration', 'Common Configurations', 'DocuSign Configuration', 'Dynamic Field Library', 'Dynamic Group Library', 'Field Associations', 'Menu Items', 'Shared Menu Items', 'Whitelist Configuration'];
        let qkatawaziApplicationConfigurationList: string[] = ['Application Configuration', 'Common Configurations', 'Dynamic Field Library', 'Dynamic Group Library', 'Menu Items'];
        await navigationPage.signOut();
        await loginPage.login('tadmin');
        await navigationPage.gotoSettingsPage();
        expect(await navigationPage.isSettingSubMenusMatches("Application Configuration", tadminApplicationConfigurationList)).toBeTruthy("Application Configuration");
        await navigationPage.signOut();
        await loginPage.login('qkatawazi');
        await navigationPage.gotoSettingsPage();
        expect(await navigationPage.isSettingSubMenusMatches("Application Configuration", qkatawaziApplicationConfigurationList)).toBeTruthy("Application Configuration");
    });

    //ankagraw
    describe('[DRDMV-23738]: Validate that tenant admin/case BA change the LOB status to Inactive - observe the impact of this action', async () => {
        let LineOfBuisness = {
            "lobName": "HR",
            "description": "Update description",
            "status": "InActive",
        }
        beforeAll(async () => {
            await apiHelper.apiLogin("tadmin");
            await apiHelper.updateLineOfBuisness(LineOfBuisness);
        });

        it('[DRDMV-23738]: Validate that tenant admin/case BA change the LOB status to Inactive - observe the impact of this action', async () => {
            await navigationPage.signOut();
            await loginPage.login(personData.userId + "@petramco.com", 'Password_1234');
            // closed message
            expect(await utilityCommon.getWarningTextOfLineOfBuisness()).toBe('You do not have access to the line of business, or the line of business is not configured. Contact your administrator.');
            await utilityCommon.closedWarningTextOfLineOfBuisness();
            expect(await utilityGrid.isGridRecordPresent(caseID)).toBeTruthy();
            await navigationPage.gotoTaskConsole();
            await utilityCommon.closedWarningTextOfLineOfBuisness();
            expect(await utilityGrid.isGridRecordPresent(TaskID)).toBeTruthy();
            await navigationPage.gotoKnowledgeConsole();
            await utilityCommon.closedWarningTextOfLineOfBuisness();
            expect(await utilityGrid.isGridRecordPresent(KnowledgeArticleID)).toBeTruthy();
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Case Management--Templates', 'Case Templates - Business Workflows');
            await utilityCommon.closedWarningTextOfLineOfBuisness();
            expect(await consoleCasetemplatePo.isCreateCaseTemplateEnabled()).toBeFalsy();
            expect(await utilGrid.isGridRecordPresent(templateData.templateName)).toBeTruthy();

        });
        it('[DRDMV-23738]: Validate that tenant admin/case BA change the LOB status to Inactive - observe the impact of this action', async () => {
            await navigationPage.signOut();
            await loginPage.login(personData1.userId + "@petramco.com", 'Password_1234');
            await utilityCommon.closedWarningTextOfLineOfBuisness();
            expect(await utilityGrid.isGridRecordPresent(caseID)).toBeTruthy();
            await navigationPage.gotoTaskConsole();
            await utilityCommon.closedWarningTextOfLineOfBuisness();
            expect(await utilityGrid.isGridRecordPresent(TaskID)).toBeTruthy();
            await navigationPage.gotoKnowledgeConsole();
            await utilityCommon.closedWarningTextOfLineOfBuisness();
            expect(await utilityGrid.isGridRecordPresent(KnowledgeArticleID)).toBeTruthy();
        });
        it('[DRDMV-23738]: Validate that tenant admin/case BA change the LOB status to Inactive - observe the impact of this action', async () => {
            await navigationPage.signOut();
            await loginPage.login('qkatawazi');
            expect(await utilityGrid.isGridRecordPresent(caseID)).toBeFalsy();
            await navigationPage.gotoTaskConsole();
            expect(await utilityGrid.isGridRecordPresent(TaskID)).toBeFalsy();
            await navigationPage.gotoKnowledgeConsole();
            expect(await utilityGrid.isGridRecordPresent(KnowledgeArticleID)).toBeFalsy();
        });
    });

    //ankagraw
    describe('[DRDMV-9040]: [Email Configuration] Verify Email configuration Grid view', async () => {
        let casetemplatePsilon, incomingEmail,templateData, emailID = "test@gmail.com";
        let randomStr = Math.floor(Math.random() * 100000);
        beforeAll(async () => {
            incomingEmail = {
                'mailBoxName': 'testEmail@gmail.com'
            }
            casetemplatePsilon = {
                "templateName": randomStr + 'caseTemplatePsilonDRDMV773',
                "templateSummary": randomStr + 'caseTemplateSummaryPsilonDRDMV773',
                "caseStatus": "InProgress",
                "templateStatus": "Active",
                "company": "Psilon",
                "businessUnit": "Psilon Support Org1",
                "supportGroup": "Psilon Support Group1",
                "assignee": "gderuno",
                "description": 'description' + randomStr,
                "ownerBU": "Psilon Support Org1",
                "ownerGroup": "Psilon Support Group1",
            }
             templateData = {
                "templateName":"GlobalTemplate" + randomStr ,
                "templateSummary":"GlobalTemplate" + randomStr,
                "caseStatus": "InProgress",
                "templateStatus": "Active",
                "company": "- Global -",
                "businessUnit": "United States Support",
                "supportGroup": "US Support 3",
                "assignee": "qkatawazi",
                "ownerBU": 'United States Support',
                "ownerGroup": "US Support 3",
            }
            await apiHelper.apiLogin('gderuno');
            await apiHelper.createCaseTemplate(casetemplatePsilon);
            await apiHelper.apiLogin('qkatawazi');
            await apiHelper.createCaseTemplate(templateData);
        });
        it('[DRDMV-9040]: Verify Email configuration header', async () => {
            await navigationPage.signOut();
            await loginPage.login('fritz');
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Case Management--Templates', 'Case Templates - Business Workflows');
            await consoleCasetemplatePo.clickOnCreateCaseTemplateButton();
            await createCasetemplatePo.setTemplateName(randomStr + 'templateName');
            await createCasetemplatePo.setCompanyName('Petramco');
            await createCasetemplatePo.setCaseSummary(randomStr + 'templateSummary');
            await createCasetemplatePo.clickSaveCaseTemplate();
            expect(await viewCasetemplatePo.getCaseTemplateNameValue()).toBe(randomStr + 'templateName');
        });
        it('[DRDMV-9040]: Verify Email configuration header', async () => {
            await navigationPage.signOut();
            await loginPage.login('qkatawazi');
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Case Management--Templates', 'Case Templates - Business Workflows');
            await consoleCasetemplatePo.clickOnCreateCaseTemplateButton();
            await createCasetemplatePo.setTemplateName('templateName123' + randomStr);
            await createCasetemplatePo.setCompanyName('Petramco');
            await createCasetemplatePo.setCaseSummary('templateName' + randomStr);
            await createCasetemplatePo.setTemplateStatusDropdownValue('Active');
            await createCasetemplatePo.clickSaveCaseTemplate();
            expect(await viewCasetemplatePo.getCaseTemplateNameValue()).toBe('templateName123' + randomStr);

            await apiHelper.apiLogin('tadmin');
            await apiHelper.deleteAllEmailConfiguration();
            await apiHelper.createEmailBox('incoming', incomingEmail);
            await apiHelper.apiLogin('qkatawazi');
            await apiHelper.createEmailConfiguration();

            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Email--Configuration', 'Email Box Console - Business Workflows');
            await utilGrid.searchAndOpenHyperlink(emailID);
            expect(await editEmailConfigPo.isDefaultCaseTemplatetoUsePresent(randomStr + 'templateName')).toBeFalsy();
            await editEmailConfigPo.clearDefaultCaseTemplateToUseField();
            expect(await editEmailConfigPo.isDefaultCaseTemplatePresentinDropDown('templateName123' + randomStr)).toBeTruthy();
            await editEmailConfigPo.clearDefaultCaseTemplateToUseField();
            expect(await editEmailConfigPo.isDefaultCaseTemplatePresentinDropDown(casetemplatePsilon.templateName)).toBeTruthy();
            await editEmailConfigPo.clearDefaultCaseTemplateToUseField();
            expect(await editEmailConfigPo.isDefaultCaseTemplatePresentinDropDown(templateData.templateName)).toBeTruthy();
            await editEmailConfigPo.clickSaveButton();
        });
        afterAll(async () => {
            await utilityCommon.closeAllBlades(); // escape is working on these settings pages
        });
    });

    //ankagraw
    describe('[DRDMV-3230]: Create new SVT Group for Line of Business', async () => {
        let userData, svtData, userData1, userData2, randomStr = Math.floor(Math.random() * 100000);
        beforeAll(async () => {
            svtData = {
                "terms": "'1000000063'=\"cb500f4763edeb302d4644e2d5cf22372543dedda74717135ffc927758066570c1a59648f541d5392790876c312fcf2a0501a76d13290562cce65a69c48e7356\"",
                "readableTerms": "'Company'=\"Petramco\"",
                "startWhen": "'450000021'=\"5000\"",
                "readableStartWhen": "'Status'=\"Resolved\"",
                "stopWhen": "'450000021'=\"7000\"",
                "readableStopWhen": "'Status'=\"Closed\"",
                "goalTimeMinutes": "4",
                "dataSource": "Case Management",
                "company": "Petramco",
                "svtName": "DRDMV-3230"
            }
            await apiHelper.apiLogin('tadmin');
            userData = {
                "firstName": "Petramco",
                "lastName": "SGUser1",
                "userId": "22653User",
                "userPermission": ["Case Business Analyst", "Foundation Read", "Knowledge Coach", "Knowledge Publisher", "Knowledge Contributor", "Knowledge Candidate", "Case Catalog Administrator", "Person Activity Read", "Human Resource"]
            }
            await apiHelper.createNewUser(userData);
            await apiHelper.associatePersonToCompany(userData.userId, "Petramco");
            await apiHelper.associatePersonToSupportGroup(userData.userId, "US Support 3");

            userData1 = {
                "firstName": "caseBA",
                "lastName": "MultiLOB",
                "userId": "caseBAMultiLOB",
                "userPermission": ["Case Business Analyst", "Foundation Read", "Knowledge Coach", "Knowledge Publisher", "Knowledge Contributor", "Knowledge Candidate", "Case Catalog Administrator", "Person Activity Read", "Human Resource", "Facilities"]
            }
            await apiHelper.createNewUser(userData1);
            await apiHelper.associatePersonToCompany(userData1.userId, "Petramco");
            await apiHelper.associatePersonToSupportGroup(userData1.userId, "US Support 3");

            userData2 = {
                "firstName": "caseMngr",
                "lastName": "MultiLOB",
                "userId": "caseMngrMultiLOB",
                "userPermission": ["Case Manager", "Foundation Read", "Knowledge Coach", "Knowledge Publisher", "Knowledge Contributor", "Knowledge Candidate", "Case Catalog Administrator", "Person Activity Read", "Human Resource", "Facilities"]
            }
            await apiHelper.createNewUser(userData2);
            await apiHelper.associatePersonToCompany(userData2.userId, "Petramco");
            await apiHelper.associatePersonToSupportGroup(userData2.userId, "US Support 3");
        });
        it('[DRDMV-3230]: Create new SVT Group for Line of Business', async () => {
            await apiHelper.apiLogin('qkatawazi');
            await apiHelper.createSVT(svtData);
            await navigationPage.signOut();
            await loginPage.login(userData1.userId + "@petramco.com", 'Password_1234');
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Service Level Management--Service Target Group', 'Service Target Group - Administration - Business Workflows');
            await serviceTargetGroupConsolePo.clickAddServiceTargetGroupBtn();
            await createServiceTargetGroupPo.setGroupName(randomStr + "Group");
            expect(await createServiceTargetGroupPo.isLobEnabled()).toBeFalsy();
            await createServiceTargetGroupPo.selectCompany('Petramco');
            await createServiceTargetGroupPo.selectDataSource('Case Management');
            await createServiceTargetGroupPo.searchServiceTarget('DRDMV-3230');
            expect(await createServiceTargetGroupPo.isServiceTargetPresent('DRDMV-3230')).toBeTruthy();
            await editServiceTargetGroupConfigPo.selectAvailableServiceTarget('DRDMV-3230');
            await createServiceTargetGroupPo.clickSaveButton();
        });
        it('[DRDMV-3230]: Create new SVT Group for Line of Business', async () => {
            await navigationPage.signOut();
            await loginPage.login('qkatawazi');
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Service Level Management--Service Target Group', 'Service Target Group - Administration - Business Workflows');
            await utilGrid.searchAndOpenHyperlink(randomStr + "Group");
            await editServiceTargetGroupConfigPo.selectAvailableServiceTarget('Low Case Response Time');
            await editServiceTargetGroupConfigPo.clickSaveButton();

            await navigationPage.signOut();
            await loginPage.login('gwixillian');
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Service Level Management--Service Target Group', 'Service Target Group - Administration - Business Workflows');
            expect(await utilGrid.isGridRecordPresent(randomStr + "Group")).toBeTruthy();
            
        });
        it('[DRDMV-3230]: Create new SVT Group for Line of Business', async () => {
            await navigationPage.signOut();
            await loginPage.login('fritz');
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Service Level Management--Service Target Group', 'Service Target Group - Administration - Business Workflows');
            expect(await utilGrid.isGridRecordPresent(randomStr + "Group")).toBeFalsy();

            await navigationPage.signOut();
            await loginPage.login('frieda');
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Service Level Management--Service Target Group', 'Service Target Group - Administration - Business Workflows');
            expect(await utilGrid.isGridRecordPresent(randomStr + "Group")).toBeFalsy();
        });
        it('[DRDMV-3230]: Create new SVT Group for Line of Business', async () => {
            await navigationPage.signOut();
            await loginPage.login('qliu');
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Service Level Management--Service Target Group', 'Service Target Group - Administration - Business Workflows');
            await utilGrid.searchAndOpenHyperlink(randomStr + "Group");
            await editServiceTargetGroupConfigPo.selectAvailableServiceTarget('DRDMV-3230');
            await editServiceTargetGroupConfigPo.clickSaveButton();
        });
        afterAll(async () => {
            await navigationPage.signOut();
            await loginPage.login('qkatawazi');
        });
    });

    //ankagraw
    describe('[DRDMV-17649]: Configure Resolution Code on Menu Items using Case BA', async () => {
        let caseId,caseData,randomStr = Math.floor(Math.random() * 100000);
        let label = 'ResolutionCode' + randomStr;
        beforeAll(async () => {
        caseData = {
            "Requester": "apavlik",
            "Summary": "Summary" + randomStr,
            "Assigned Company": "Petramco",
            "Business Unit": "Canada Support ",
            "Support Group": "CA Support 1",
            "Assignee": "qdu",
        }
       await apiHelper.apiLogin("qdu")
       caseId =  await apiHelper.createCase(caseData)
    });
        it('[DRDMV-17649]: Configure Resolution Code on Menu Items using Case BA', async () => {
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Application Configuration--Menu Items', 'Menu Items - Business Workflows');
            await createMenuItemsBladePo.clickOnMenuOptionLink();
            expect(await createMenuItemsBladePo.isLineOfBusinessEnabled()).toBeFalsy();
            await createMenuItemsBladePo.selectMenuNameDropDown('Resolution Code');
            await createMenuItemsBladePo.clickOnLocalizeLink();
            await localizeValuePopPo.setLocalizeValue(label);
            await localizeValuePopPo.clickOnSaveButton();
            await createMenuItemsBladePo.selectStatusDropDown('Active');
            await createMenuItemsBladePo.selectAvailableOnUiToggleButton(true);
            await createMenuItemsBladePo.clickOnSaveButton();
            await utilCommon.closePopUpMessage();
            await navigationPage.gotoCreateCase();
            await createCasePo.selectRequester('adam');
            await createCasePo.setSummary(randomStr + 'DRDMV17649');
            await createCasePo.clickAssignToMeButton();
            await createCasePo.clickSaveCaseButton();
            await casePreviewPo.clickGoToCaseButton();
            await viewCasePo.clickEditCaseButton();
            await editCasePo.updateResolutionCode(label);
            await editCasePo.clickSaveCase();
            expect(await viewCasePo.getResolutionCodeValue()).toBe(label);
        });
        it('[DRDMV-17649]: Configure Resolution Code on Menu Items using Case BA', async () => {
            await navigationPage.signOut();
            await loginPage.login('qdu');
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Application Configuration--Menu Items', 'Menu Items - Business Workflows');
            expect(await createMenuItemsBladePo.isMenuOptionLinkEnabled()).toBeFalsy();
            await navigationPage.gotoCaseConsole();
            await utilityGrid.searchAndOpenHyperlink(caseId);
            await viewCasePo.clickEditCaseButton(); 
            expect(await editCasePo.isResolutionCodePresent(label)).toBeTruthy();

        });
        it('[DRDMV-17649]: Configure Resolution Code on Menu Items using Case BA', async () => {
            await navigationPage.signOut();
            await loginPage.login('gwixillian');
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Application Configuration--Menu Items', 'Menu Items - Business Workflows');
            expect(await menuItemsConfigConsolePo.isMenuItemRecordPresentOnGridConsole(label)).toBeFalsy();

            await navigationPage.signOut();
            await loginPage.login('peter');
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Application Configuration--Menu Items', 'Menu Items - Business Workflows');
            expect(await navigationPage.isSettingMenuPresent('Application Configuration')).toBeFalsy();
        });

    });
    
});