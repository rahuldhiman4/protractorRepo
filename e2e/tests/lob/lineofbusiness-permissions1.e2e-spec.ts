import { cloneDeep } from 'lodash';
import { browser } from "protractor";
import coreApi from '../../api/api.core.util';
import apiHelper from '../../api/api.helper';
import { AUTO_STATUS_TRANSITION_MANDATORY_FIELDS } from '../../data/ui/case/automated-status-transition.data.ui';
import { ALL_FIELD } from '../../data/ui/case/casetemplate.data.ui';
import { flowsetGlobalFields, flowsetGlobalInActiveFields } from '../../data/ui/flowset/flowset.ui';
import caseConsolePo from '../../pageobject/case/case-console.po';
import casePreviewPo from '../../pageobject/case/case-preview.po';
import createCasePo from '../../pageobject/case/create-case.po';
import editCasePo from '../../pageobject/case/edit-case.po';
import quickCasePo from '../../pageobject/case/quick-case.po';
import selectCasetemplateBladePo from '../../pageobject/case/select-casetemplate-blade.po';
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
import automatedStatusTransitionCreatePage from "../../pageobject/settings/case-management/create-automated-status-config.po";
import createCasetemplatePo from '../../pageobject/settings/case-management/create-casetemplate.po';
import automatedStatusTransitionEditPage from "../../pageobject/settings/case-management/edit-automated-status-config.po";
import readAccessConsolePo from '../../pageobject/settings/case-management/read-access-console.po';
import viewCasetemplatePo from '../../pageobject/settings/case-management/view-casetemplate.po';
import consoleNotestemplatePo from '../../pageobject/settings/common/console-notestemplate.po';
import statusConfigPo from '../../pageobject/settings/common/status-config.po';
import createDocumentLibraryPo from '../../pageobject/settings/document-management/create-document-library.po';
import createDocumentTemplatePo from '../../pageobject/settings/document-management/create-document-template.po';
import consoleAcknowledgmentTemplatePo from '../../pageobject/settings/email/console-acknowledgment-template.po';
import consoleEmailConfigurationPo from '../../pageobject/settings/email/console-email-configuration.po';
import consoleEmailTemplatePo from '../../pageobject/settings/email/console-email-template.po';
import createAcknowledgmentTemplatesPo from '../../pageobject/settings/email/create-acknowledgment-template.po';
import createEmailTemplatePo from '../../pageobject/settings/email/create-email-template.po';
import editEmailConfigPo from '../../pageobject/settings/email/edit-email-config.po';
import approvalMappingConsoleKnowledgePo from "../../pageobject/settings/knowledge-management/approval-mapping-console.po";
import consoleKnowledgeSetPo from '../../pageobject/settings/knowledge-management/console-knowledge-set.po';
import consoleKnowledgeTemplatePo from '../../pageobject/settings/knowledge-management/console-knowledge-template.po';
import defineLobCreate from '../../pageobject/settings/lob/create-lob-config.po';
import consoleDefineLob from '../../pageobject/settings/lob/define-lob-config.po';
import editLobConfig from '../../pageobject/settings/lob/edit-lob-config.po';
import consoleFlowsetConfigPo from '../../pageobject/settings/manage-flowset/console-flowset-config.po';
import editFlowsetConfigPo from '../../pageobject/settings/manage-flowset/edit-flowset-config.po';
import consoleNotificationEventPo from '../../pageobject/settings/notification-config/console-notification-event.po';
import notificationTempGridPage from "../../pageobject/settings/notification-config/console-notification-template.po";
import createServiceTargetGroupPo from '../../pageobject/settings/slm/create-service-target-group.po';
import editServiceTargetGroupConfigPo from '../../pageobject/settings/slm/edit-service-target-group-config.po';
import serviceTargetGroupConsolePo from '../../pageobject/settings/slm/service-target-group-console.po';
import selectTaskTemplate from "../../pageobject/settings/task-management/console-tasktemplate.po";
import createAdhocTaskPo from '../../pageobject/task/create-adhoc-task.po';
import manageTaskBladePo from '../../pageobject/task/manage-task-blade.po';
import viewTaskPo from '../../pageobject/task/view-task.po';
import { BWF_BASE_URL, BWF_PAGE_TITLES } from '../../utils/constants';
import utilityCommon from '../../utils/utility.common';
import utilityGrid from '../../utils/utility.grid';

xdescribe('Line of Business Permission Tests', () => {
    let userData1;
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
        await createNewUsers();

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
        await utilityCommon.closeAllBlades();
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
            "templateName": '12028' + randomStr,
            "templateSummary": '12028' + randomStr,
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
        businessData.relatedOrgId = company;
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

    async function createNewUsers() {
        await apiHelper.apiLogin('tadmin');
        userData1 = {
            "firstName": "Petramco",
            "lastName": "SGUser1",
            "userId": "13550User1",
            "userPermission": ["Case Business Analyst", "Human Resource"]
        }
        await apiHelper.createNewUser(userData1);
        await apiHelper.associatePersonToCompany(userData1.userId, "Petramco");
        await apiHelper.associatePersonToCompany(userData1.userId, "- Global -");
        await apiHelper.associatePersonToCompany(userData1.userId, "Psilon");
        await apiHelper.associatePersonToSupportGroup(userData1.userId, "Psilon Support Group1");
        await browser.sleep(3000); // timeout requried to reflect data on UI
        let personData1 = personDataFile['PhylumCaseAgent1'];
        await apiHelper.createNewUser(personData1);
        await apiHelper.associatePersonToSupportGroup(personData1.userId, 'Phylum Support Group1');
        await apiHelper.associatePersonToCompany(personData1.userId, 'Phylum');
    }

    //asahitya
    describe('[60219]: Validate that tenant admin is able to create the LOB and upon LOB creation Domain Tag is created of LOB name in the Domain Tag registry', () => {
        let randomString: string = [...Array(4)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        let lobName = undefined;
        beforeAll(async () => {
            lobName = `q1W Name ${randomString}`;
            await apiHelper.apiLogin('tadmin');
            await apiHelper.createEmailBox('outgoing');
        });
        it('[60219]: Validate that tenant admin is able to create the LOB and upon LOB creation Domain Tag is created of LOB name in the Domain Tag registry', async () => {
            let lobConfigPageList = ['Define Line of Business', 'Manage Line of Business', 'Line of Business'];
            await navigationPage.signOut();
            await loginPage.login('tadmin');

            //Create LOB
            await navigationPage.gotoSettingsPage();
            expect(await navigationPage.isSettingSubMenusMatches("Line of Business", lobConfigPageList)).toBeTruthy("LOB config does not match");
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Line of Business--Define Line of Business', 'LOB Management Console - Business Workflows');
            await consoleDefineLob.clickAddLobBtn();
            expect(await defineLobCreate.isFieldPresent('Name')).toBeTruthy('Name is not Present');
            expect(await defineLobCreate.isFieldPresent('Outgoing Email Profile')).toBeTruthy('Outgoing Email Profile is not Present');
            expect(await defineLobCreate.isFieldPresent('Description')).toBeTruthy('Description is not Present');
            expect(await defineLobCreate.isFieldPresent('Status')).toBeTruthy('Status is not Present');
            expect(await defineLobCreate.isFieldPresent('Use as Default')).toBeTruthy('Use as Default is not Present');
            await defineLobCreate.setName(lobName);
            await defineLobCreate.setDescription(`q1@$W Description ${randomString}`);
            await defineLobCreate.setUseAsDefaultValue(false);
            await defineLobCreate.selectEmailOutgoingProfile('Email Profile for Outgoing');
            await defineLobCreate.saveLob();

            //View created LOB and Verify
            await utilityGrid.clickRefreshIcon();
            await browser.sleep(5000); //Waiting for Group Id to be reflected
            await utilityGrid.searchAndOpenHyperlink(lobName);
            expect(await editLobConfig.getDescription()).toBe(`q1@$W Description ${randomString}`);
            expect(await editLobConfig.getName()).toBe(lobName);
            expect(await editLobConfig.getBundleName()).toContain(`com.petramco.`);
            await editLobConfig.clickOnCancelButton();
            expect((await consoleDefineLob.getColumnValueOfRecord('Group ID', lobName)).length).toBeGreaterThan(0);
        });
        it('[60219]: Validate that tenant admin is able to create the LOB and upon LOB creation Domain Tag is created of LOB name in the Domain Tag registry', async () => {
            await apiHelper.apiLogin('tadmin');
            expect((await coreApi.getDomainTagGuid(lobName)).length).toBeGreaterThan(0);
            expect((await coreApi.getFunctionalRoleGuid(lobName)).length).toBeGreaterThan(0);
            let domainTagData = {
                "domainTagName": `AccountsDomain123 ${randomString}`
            }
            await apiHelper.createDomainTag(domainTagData);
            await utilityGrid.clickRefreshIcon();
            await utilityGrid.isGridRecordPresent(`AccountsDomain123 ${randomString}`);

            await consoleDefineLob.clickAddLobBtn();
            await defineLobCreate.setName(lobName);
            await defineLobCreate.setDescription(`q1@$W Description ${randomString}`);
            await defineLobCreate.setUseAsDefaultValue(false);
            await defineLobCreate.selectEmailOutgoingProfile('Email Profile for Outgoing');
            await defineLobCreate.saveLob();
            expect(await utilityCommon.isPopUpMessagePresent('Line of Business with the given name already exists. Select a different name.')).toBeTruthy('Error message is not matching');
            await utilityCommon.closeAllBlades();

            let guid = await consoleDefineLob.getColumnValueOfRecord('Domain ID', lobName);
            expect(await coreApi.getDomainTagGuid(lobName)).toBe(guid);
        });
        afterAll(async () => {
            await navigationPage.signOut();
            await loginPage.login('qkatawazi');
        });
    });

    //ankagraw
    describe('[12027,12026]: Validate that LOB specific Functional Role available for the foundation users', async () => {
        it('[12027,12026]: Validate that LOB specific Functional Role available for the foundation users', async () => {
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
        it('[12027,12026]: Validate that LOB specific Functional Role available for the foundation users', async () => {
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
            await navigationPage.gotoSettingsMenuItem('Application Configuration--Menu Items', BWF_PAGE_TITLES.APPLICATION_CONFIGURATIONS.MENU_ITEMS);
            expect(await createMenuItemsBladePo.isMenuOptionLinkPresent()).toBeFalsy();

            await navigationPage.gotoSettingsMenuItem('Application Configuration--Dynamic Field Library', BWF_PAGE_TITLES.APPLICATION_CONFIGURATIONS.DYNAMIC_FILED_LIBRARY);
            expect(await dynamicFieldLibraryConfigConsolePo.isAddDynamicFieldButtonEnabled()).toBeFalsy();

            await navigationPage.gotoSettingsMenuItem('Application Configuration--Dynamic Group Library', BWF_PAGE_TITLES.APPLICATION_CONFIGURATIONS.DYNAMIC_GROUP_LIBRARY);
            expect(await dynamicGroupLibraryConfigConsolePo.isAddDynamicGroupButtonEnabled()).toBeFalsy();

            await navigationPage.gotoSettingsMenuItem('Case Management--Templates', BWF_PAGE_TITLES.CASE_MANAGEMENT.TEMPLATES);
            expect(await consoleCasetemplatePo.isCreateCaseTemplateEnabled()).toBeFalsy();
            expect(await utilityGrid.isGridRecordPresent(caseID)).toBeFalsy();

            await navigationPage.gotoSettingsMenuItem('Case Management--Approvals', BWF_PAGE_TITLES.CASE_MANAGEMENT.APPROVALS);
            expect(await approvalMappingConsolePo.isCreateApprovalMappingBtnEnabled()).toBeFalsy();

            await navigationPage.gotoSettingsMenuItem('Case Management--Assignments', BWF_PAGE_TITLES.CASE_MANAGEMENT.ASSIGNMENTS);
            expect(await assignmentsConfigConsolePo.isCreateAssignmentConfigurationEnabled()).toBeFalsy();

            await navigationPage.gotoSettingsMenuItem('Case Management--Automated Status Transition', BWF_PAGE_TITLES.CASE_MANAGEMENT.AUTOMATED_STATUS_TRANSITION);
            expect(await automatedStatusTransitionConsolePo.isAddAutomatedStatusTransitionBtnEnabled()).toBeFalsy();

            await navigationPage.gotoSettingsMenuItem('Case Management--Notes Template', BWF_PAGE_TITLES.CASE_MANAGEMENT.NOTES_TEMPLATES);
            expect(await consoleNotestemplatePo.isCreateNotesTemplateEnabled()).toBeFalsy();

            await navigationPage.gotoSettingsMenuItem('Case Management--Read Access', BWF_PAGE_TITLES.CASE_MANAGEMENT.READ_ACCESS);
            expect(await readAccessConsolePo.isAddButtonEnabled()).toBeFalsy();

            await navigationPage.gotoSettingsMenuItem('Case Management--Status Configuration', BWF_PAGE_TITLES.CASE_MANAGEMENT.STATUS_CONFIGURATION);
            await statusConfigPo.setCompanyDropdown('Petramco', 'case');
            expect(await statusConfigPo.isEditLifeCycleBtnDisabled()).toBeTruthy();

            await navigationPage.gotoSettingsMenuItem('Document Management--Library', BWF_PAGE_TITLES.DOCUMENT_MANAGEMENT.LIBRARY);
            expect(await createDocumentLibraryPo.isAddNewDocumentBladeEnabled()).toBeFalsy();

            await navigationPage.gotoSettingsMenuItem('Document Management--Templates', BWF_PAGE_TITLES.DOCUMENT_MANAGEMENT.TEMPLATES);
            expect(await createDocumentTemplatePo.isAddTemplateEnabled()).toBeFalsy();

        });
        it('[12027,12026]: Validate that LOB specific Functional Role available for the foundation users', async () => {
            await navigationPage.gotoSettingsMenuItem('Email--Acknowledgment Templates', BWF_PAGE_TITLES.EMAIL.ACKNOWLEDGMENT_TEMPLATES);
            expect(await consoleAcknowledgmentTemplatePo.isAddAcknowledgeTemplateButtonEnabled()).toBeFalsy();

            await navigationPage.gotoSettingsMenuItem('Email--Configuration', BWF_PAGE_TITLES.EMAIL.CONFIGURATION);
            expect(await consoleEmailConfigurationPo.isNewEmailConfigurationEnabled()).toBeFalsy();

            await navigationPage.gotoSettingsMenuItem('Email--Templates', BWF_PAGE_TITLES.EMAIL.TEMPLATES);
            expect(await consoleEmailTemplatePo.isAddEmailTemplateButtonEnabled()).toBeFalsy();

            await navigationPage.gotoSettingsMenuItem('Knowledge Management--Approvals', BWF_PAGE_TITLES.KNOWLEDGE_MANAGEMENT.APPROVALS);
            expect(await approvalMappingConsoleKnowledgePo.isCreateApprovalMappingBtnEnabled()).toBeFalsy();

            await navigationPage.gotoSettingsMenuItem('Knowledge Management--Article Templates', BWF_PAGE_TITLES.KNOWLEDGE_MANAGEMENT.ARTICLE_TEMPLATES);
            expect(await consoleKnowledgeTemplatePo.isCreateNewKATemplateEnabled()).toBeFalsy();

            await navigationPage.gotoSettingsMenuItem('Knowledge Management--Knowledge Sets', BWF_PAGE_TITLES.KNOWLEDGE_MANAGEMENT.KNOWLEDGE_SETS);
            expect(await consoleKnowledgeSetPo.isAddKnowledgeSetBtnEnabled()).toBeFalsy();

            await navigationPage.gotoSettingsMenuItem('Knowledge Management--Notes Template', BWF_PAGE_TITLES.KNOWLEDGE_MANAGEMENT.NOTES_TEMPLATES);
            expect(await consoleNotestemplatePo.isCreateNotesTemplateEnabled()).toBeFalsy();

            await navigationPage.gotoSettingsMenuItem('Manage Flowsets--Define Flowsets', BWF_PAGE_TITLES.MANAGE_FLOWSETS.DEFINE_FLOWSETS);
            expect(consoleFlowsetConfigPo.isAddFlowsetButtonEnabled()).toBeFalsy();

            await navigationPage.gotoSettingsMenuItem('Notification Configuration--Manage Templates', BWF_PAGE_TITLES.NOTIFICATION_CONFIGURATION.MANAGE_TEMPLATES);
            expect(await notificationTempGridPage.isAddNotificationTemplateBtnEnabled()).toBeFalsy();

            await navigationPage.gotoSettingsMenuItem('Notification Configuration--Manage Events', BWF_PAGE_TITLES.NOTIFICATION_CONFIGURATION.MANAGE_EVENTS);
            expect(await consoleNotificationEventPo.isAddNotificationEventBtnEnabled()).toBeFalsy();

            await navigationPage.gotoSettingsMenuItem('People--Notes Template', BWF_PAGE_TITLES.PEOPLE.NOTES_TEMPLATES);
            expect(await consoleNotestemplatePo.isCreateNotesTemplateEnabled()).toBeFalsy();

            await navigationPage.gotoSettingsMenuItem('Task Management--Templates', BWF_PAGE_TITLES.TASK_MANAGEMENT.TEMPLATES);
            expect(await selectTaskTemplate.isManualTaskTemplateButtonEnabled()).toBeFalsy();
            expect(await selectTaskTemplate.isAutomationTaskTemplateButtonEnabled()).toBeFalsy();
            expect(await selectTaskTemplate.isExtrnalTaskTemplateButtonEnabled()).toBeFalsy();
        });
        it('[12027,12026]: Validate that LOB specific Functional Role available for the foundation users', async () => {
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
            await navigationPage.gotoSettingsMenuItem('Application Configuration--Menu Items', BWF_PAGE_TITLES.APPLICATION_CONFIGURATIONS.MENU_ITEMS);
            expect(await createMenuItemsBladePo.isMenuOptionLinkEnabled()).toBeTruthy();

            await navigationPage.gotoSettingsMenuItem('Application Configuration--Dynamic Field Library', BWF_PAGE_TITLES.APPLICATION_CONFIGURATIONS.DYNAMIC_FILED_LIBRARY);
            expect(await dynamicFieldLibraryConfigConsolePo.isAddDynamicFieldButtonEnabled()).toBeTruthy();

            await navigationPage.gotoSettingsMenuItem('Application Configuration--Dynamic Group Library', BWF_PAGE_TITLES.APPLICATION_CONFIGURATIONS.DYNAMIC_GROUP_LIBRARY);
            expect(await dynamicGroupLibraryConfigConsolePo.isAddDynamicGroupButtonEnabled()).toBeFalsy();

            await navigationPage.gotoSettingsMenuItem('Case Management--Templates', BWF_PAGE_TITLES.CASE_MANAGEMENT.TEMPLATES);
            expect(await consoleCasetemplatePo.isCreateCaseTemplateEnabled()).toBeTruthy();
            expect(await utilityGrid.isGridRecordPresent(caseID)).toBeFalsy();

            await navigationPage.gotoSettingsMenuItem('Case Management--Approvals', BWF_PAGE_TITLES.CASE_MANAGEMENT.APPROVALS);
            expect(await approvalMappingConsolePo.isCreateApprovalMappingBtnEnabled()).toBeTruthy();

            await navigationPage.gotoSettingsMenuItem('Case Management--Assignments', BWF_PAGE_TITLES.CASE_MANAGEMENT.ASSIGNMENTS);
            expect(await assignmentsConfigConsolePo.isCreateAssignmentConfigurationEnabled()).toBeTruthy();

            await navigationPage.gotoSettingsMenuItem('Case Management--Automated Status Transition', BWF_PAGE_TITLES.CASE_MANAGEMENT.AUTOMATED_STATUS_TRANSITION);
            expect(await automatedStatusTransitionConsolePo.isAddAutomatedStatusTransitionBtnEnabled()).toBeTruthy();

            await navigationPage.gotoSettingsMenuItem('Case Management--Notes Template', BWF_PAGE_TITLES.CASE_MANAGEMENT.NOTES_TEMPLATES);
            expect(await consoleNotestemplatePo.isCreateNotesTemplateEnabled()).toBeTruthy();

            await navigationPage.gotoSettingsMenuItem('Case Management--Read Access', BWF_PAGE_TITLES.CASE_MANAGEMENT.READ_ACCESS);
            expect(await readAccessConsolePo.isAddButtonEnabled()).toBeTruthy();

            await navigationPage.gotoSettingsMenuItem('Case Management--Status Configuration', BWF_PAGE_TITLES.CASE_MANAGEMENT.STATUS_CONFIGURATION);
            await statusConfigPo.setCompanyDropdown('Petramco', 'case');
            expect(await statusConfigPo.isEditLifeCycleBtnDisabled()).toBeFalsy();

            await navigationPage.gotoSettingsMenuItem('Document Management--Library', BWF_PAGE_TITLES.DOCUMENT_MANAGEMENT.LIBRARY);
            expect(await createDocumentLibraryPo.isAddNewDocumentBladeEnabled()).toBeTruthy();

            await navigationPage.gotoSettingsMenuItem('Document Management--Templates', BWF_PAGE_TITLES.DOCUMENT_MANAGEMENT.TEMPLATES);
            expect(await createDocumentTemplatePo.isAddTemplateEnabled()).toBeTruthy();

        });
        it('[12027,12026]: Validate that LOB specific Functional Role available for the foundation users', async () => {
            await navigationPage.gotoSettingsMenuItem('Email--Acknowledgment Templates', BWF_PAGE_TITLES.EMAIL.ACKNOWLEDGMENT_TEMPLATES);
            expect(await consoleAcknowledgmentTemplatePo.isAddAcknowledgeTemplateButtonEnabled()).toBeTruthy();

            await navigationPage.gotoSettingsMenuItem('Email--Configuration', BWF_PAGE_TITLES.EMAIL.CONFIGURATION);
            expect(await consoleEmailConfigurationPo.isNewEmailConfigurationEnabled()).toBeTruthy();

            await navigationPage.gotoSettingsMenuItem('Email--Templates', BWF_PAGE_TITLES.EMAIL.TEMPLATES);
            expect(await consoleEmailTemplatePo.isAddEmailTemplateButtonEnabled()).toBeTruthy();

            await navigationPage.gotoSettingsMenuItem('Knowledge Management--Approvals', BWF_PAGE_TITLES.KNOWLEDGE_MANAGEMENT.APPROVALS);
            expect(await approvalMappingConsoleKnowledgePo.isCreateApprovalMappingBtnEnabled()).toBeTruthy();

            await navigationPage.gotoSettingsMenuItem('Knowledge Management--Article Templates', BWF_PAGE_TITLES.KNOWLEDGE_MANAGEMENT.ARTICLE_TEMPLATES);
            expect(await consoleKnowledgeTemplatePo.isCreateNewKATemplateEnabled()).toBeTruthy();

            await navigationPage.gotoSettingsMenuItem('Knowledge Management--Knowledge Sets', BWF_PAGE_TITLES.KNOWLEDGE_MANAGEMENT.KNOWLEDGE_SETS);
            expect(await consoleKnowledgeSetPo.isAddKnowledgeSetBtnEnabled()).toBeTruthy();

            await navigationPage.gotoSettingsMenuItem('Knowledge Management--Notes Template', BWF_PAGE_TITLES.KNOWLEDGE_MANAGEMENT.NOTES_TEMPLATES);
            expect(await consoleNotestemplatePo.isCreateNotesTemplateEnabled()).toBeTruthy();

            await navigationPage.gotoSettingsMenuItem('Manage Flowsets--Define Flowsets', BWF_PAGE_TITLES.MANAGE_FLOWSETS.DEFINE_FLOWSETS);
            expect(consoleFlowsetConfigPo.isAddFlowsetButtonEnabled()).toBeTruthy("Add flowset is disabled");

            await navigationPage.gotoSettingsMenuItem('Notification Configuration--Manage Templates', BWF_PAGE_TITLES.NOTIFICATION_CONFIGURATION.MANAGE_TEMPLATES);
            expect(await notificationTempGridPage.isAddNotificationTemplateBtnEnabled()).toBeTruthy();

            await navigationPage.gotoSettingsMenuItem('Notification Configuration--Manage Events', BWF_PAGE_TITLES.NOTIFICATION_CONFIGURATION.MANAGE_EVENTS);
            expect(await consoleNotificationEventPo.isAddNotificationEventBtnEnabled()).toBeTruthy();

            await navigationPage.gotoSettingsMenuItem('People--Notes Template', BWF_PAGE_TITLES.PEOPLE.NOTES_TEMPLATES);
            expect(await consoleNotestemplatePo.isCreateNotesTemplateEnabled()).toBeTruthy();

            await navigationPage.gotoSettingsMenuItem('Task Management--Templates', BWF_PAGE_TITLES.TASK_MANAGEMENT.TEMPLATES);
            expect(await selectTaskTemplate.isManualTaskTemplateButtonEnabled()).toBeTruthy();
            expect(await selectTaskTemplate.isAutomationTaskTemplateButtonEnabled()).toBeTruthy();
            expect(await selectTaskTemplate.isExtrnalTaskTemplateButtonEnabled()).toBeTruthy();
        });
        afterAll(async () => {
            await utilityCommon.closedWarningTextOfLineOfBuisness();
        });
    });

    //ankagraw
    //this test case failed due to defect DRDMV-24208 
    it('[12011]: Adobe, DocuSign and White configuration should visible to Tadmin only', async () => {
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
    describe('[12028]: Validate that tenant admin/case BA change the LOB status to Inactive - observe the impact of this action', async () => {
        let LineOfBuisness = {
            "lobName": "HR",
            "description": "Update description",
            "status": "InActive",
        }
        beforeAll(async () => {
            await apiHelper.apiLogin("tadmin");
            await apiHelper.updateLineOfBuisness(LineOfBuisness);
        });

        it('[12028]: Validate that tenant admin/case BA change the LOB status to Inactive - observe the impact of this action', async () => {
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
            await navigationPage.gotoSettingsMenuItem('Case Management--Templates', BWF_PAGE_TITLES.CASE_MANAGEMENT.TEMPLATES);
            await utilityCommon.closedWarningTextOfLineOfBuisness();
            expect(await consoleCasetemplatePo.isCreateCaseTemplateEnabled()).toBeFalsy();
            expect(await utilityGrid.isGridRecordPresent(templateData.templateName)).toBeTruthy();

        });
        it('[12028]: Validate that tenant admin/case BA change the LOB status to Inactive - observe the impact of this action', async () => {
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
        it('[12028]: Validate that tenant admin/case BA change the LOB status to Inactive - observe the impact of this action', async () => {
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
    describe('[5380]: [Email Configuration] Verify Email configuration Grid view', async () => {
        let casetemplatePsilon, incomingEmail, templateData, emailID = "test@gmail.com";
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
                "templateName": "GlobalTemplate" + randomStr,
                "templateSummary": "GlobalTemplate" + randomStr,
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
        it('[5380]: Verify Email configuration header', async () => {
            await navigationPage.signOut();
            await loginPage.login('fritz');
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Case Management--Templates', BWF_PAGE_TITLES.CASE_MANAGEMENT.TEMPLATES);
            await consoleCasetemplatePo.clickOnCreateCaseTemplateButton();
            await createCasetemplatePo.setTemplateName(randomStr + 'templateName');
            await createCasetemplatePo.setCompanyName('Petramco');
            await createCasetemplatePo.setCaseSummary(randomStr + 'templateSummary');
            await createCasetemplatePo.clickSaveCaseTemplate();
            expect(await viewCasetemplatePo.getCaseTemplateNameValue()).toBe(randomStr + 'templateName');
        });
        it('[5380]: Verify Email configuration header', async () => {
            await navigationPage.signOut();
            await loginPage.login('qkatawazi');
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Case Management--Templates', BWF_PAGE_TITLES.CASE_MANAGEMENT.TEMPLATES);
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
            await navigationPage.gotoSettingsMenuItem('Email--Configuration', BWF_PAGE_TITLES.EMAIL.CONFIGURATION);
            await utilityGrid.searchAndOpenHyperlink(emailID);
            expect(await editEmailConfigPo.getDefaultCaseTemplatetoUsePresent()).toBe(randomStr + 'templateName');
            await editEmailConfigPo.clearDefaultCaseTemplateToUseField();
            expect(await editEmailConfigPo.isDefaultCaseTemplatePresentinDropDown('templateName123' + randomStr)).toBeTruthy();
            await editEmailConfigPo.clearDefaultCaseTemplateToUseField();
            expect(await editEmailConfigPo.isDefaultCaseTemplatePresentinDropDown(casetemplatePsilon.templateName)).toBeFalsy();
            await editEmailConfigPo.clearDefaultCaseTemplateToUseField();
            expect(await editEmailConfigPo.isDefaultCaseTemplatePresentinDropDown(templateData.templateName)).toBeTruthy();
            await editEmailConfigPo.clickSaveButton();
        });
        afterAll(async () => {
            await utilityCommon.closeAllBlades(); // escape is working on these settings pages
        });
    });

    //ankagraw
    describe('[5866]: Create new SVT Group for Line of Business', async () => {
        let userData, svtData, randomStr = Math.floor(Math.random() * 100000);
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
                "svtName": "5866"
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
        });
        it('[5866]: Create new SVT Group for Line of Business', async () => {
            await apiHelper.apiLogin('qkatawazi');
            await apiHelper.createSVT(svtData);
            await navigationPage.signOut();
            await loginPage.login(userData1.userId + "@petramco.com", 'Password_1234');
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Service Level Management--Service Target Group', BWF_PAGE_TITLES.SERVICE_LEVEL_MANAGEMENT.SERVICE_TARGET_GROUP);
            await utilityGrid.selectLineOfBusiness("Human Resource");
            await serviceTargetGroupConsolePo.clickAddServiceTargetGroupBtn();
            await createServiceTargetGroupPo.setGroupName(randomStr + "Group");
            expect(await createServiceTargetGroupPo.isLobEnabled('disabled')).toBeTruthy();
            await createServiceTargetGroupPo.selectCompany('Petramco');
            await createServiceTargetGroupPo.selectDataSource('Case Management');
            await createServiceTargetGroupPo.searchServiceTarget('5866');
            expect(await createServiceTargetGroupPo.isServiceTargetPresent('5866')).toBeTruthy();
            await editServiceTargetGroupConfigPo.selectAvailableServiceTarget('5866');
            await createServiceTargetGroupPo.clickSaveButton();
        });
        it('[5866]: Create new SVT Group for Line of Business', async () => {
            await navigationPage.signOut();
            await loginPage.login('qkatawazi');
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Service Level Management--Service Target Group', BWF_PAGE_TITLES.SERVICE_LEVEL_MANAGEMENT.SERVICE_TARGET_GROUP);
            await utilityGrid.searchAndOpenHyperlink(randomStr + "Group");
            expect(await editServiceTargetGroupConfigPo.getServiceTargetInGroup()).toBe('5866');
            await editServiceTargetGroupConfigPo.clickcancel();

            await navigationPage.signOut();
            await loginPage.login('gwixillian');
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Service Level Management--Service Target Group', BWF_PAGE_TITLES.SERVICE_LEVEL_MANAGEMENT.SERVICE_TARGET_GROUP);
            expect(await utilityGrid.isGridRecordPresent(randomStr + "Group")).toBeTruthy();

        });
        it('[5866]: Create new SVT Group for Line of Business', async () => {
            await navigationPage.signOut();
            await loginPage.login('fritz');
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Service Level Management--Service Target Group', BWF_PAGE_TITLES.SERVICE_LEVEL_MANAGEMENT.SERVICE_TARGET_GROUP);
            expect(await utilityGrid.isGridRecordPresent(randomStr + "Group")).toBeFalsy();

            await navigationPage.signOut();
            await loginPage.login('frieda');
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Service Level Management--Service Target Group', BWF_PAGE_TITLES.SERVICE_LEVEL_MANAGEMENT.SERVICE_TARGET_GROUP);
            expect(await utilityGrid.isGridRecordPresent(randomStr + "Group")).toBeFalsy();
        });
        it('[5866]: Create new SVT Group for Line of Business', async () => {
            await navigationPage.signOut();
            await loginPage.login('qliu');
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Service Level Management--Service Target Group', BWF_PAGE_TITLES.SERVICE_LEVEL_MANAGEMENT.SERVICE_TARGET_GROUP);
            await utilityGrid.searchAndOpenHyperlink(randomStr + "Group");
            expect(await editServiceTargetGroupConfigPo.getServiceTargetInGroup()).toBe('5866');
            await editServiceTargetGroupConfigPo.clickcancel();
        });
        afterAll(async () => {
            await navigationPage.signOut();
            await loginPage.login('qkatawazi');
        });
    });

    //ankagraw
    describe('[4086]: Configure Resolution Code on Menu Items using Case BA', async () => {
        let caseId, caseData, randomStr = Math.floor(Math.random() * 100000);
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
            caseId = await apiHelper.createCase(caseData)
        });
        it('[4086]: Configure Resolution Code on Menu Items using Case BA', async () => {
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Application Configuration--Menu Items', BWF_PAGE_TITLES.APPLICATION_CONFIGURATIONS.MENU_ITEMS);
            await createMenuItemsBladePo.clickOnMenuOptionLink();
            expect(await createMenuItemsBladePo.isLineOfBusinessEnabled()).toBeFalsy();
            await createMenuItemsBladePo.selectMenuNameDropDown('Resolution Code');
            await createMenuItemsBladePo.clickOnLocalizeLink();
            await localizeValuePopPo.setLocalizeValue(label);
            await localizeValuePopPo.clickOnSaveButton();
            await createMenuItemsBladePo.selectStatusDropDown('Active');
            await createMenuItemsBladePo.selectAvailableOnUiToggleButton(true);
            await createMenuItemsBladePo.clickOnSaveButton();
            await utilityCommon.closePopUpMessage();
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
        it('[4086]: Configure Resolution Code on Menu Items using Case BA', async () => {
            await navigationPage.signOut();
            await loginPage.login('qdu');
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Application Configuration--Menu Items', BWF_PAGE_TITLES.APPLICATION_CONFIGURATIONS.MENU_ITEMS);
            expect(await createMenuItemsBladePo.isMenuOptionLinkPresent()).toBeFalsy();
            await navigationPage.gotoCaseConsole();
            await utilityGrid.searchAndOpenHyperlink(caseId.displayId);
            await viewCasePo.clickEditCaseButton();
            expect(await editCasePo.isResolutionCodePresent(label)).toBeTruthy();

        });
        it('[4086]: Configure Resolution Code on Menu Items using Case BA', async () => {
            await navigationPage.signOut();
            await loginPage.login('gwixillian');
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Application Configuration--Menu Items', BWF_PAGE_TITLES.APPLICATION_CONFIGURATIONS.MENU_ITEMS);
            expect(await menuItemsConfigConsolePo.isMenuItemRecordPresentOnGridConsole(label)).toBeFalsy();

            await navigationPage.signOut();
            await loginPage.login('peter');
            await navigationPage.gotoSettingsPage();
            expect(await navigationPage.isSettingMenuPresent('Application Configuration')).toBeFalsy();
        });
    });

    //apurva
    describe('[4109]: Create new automatic case status transition rule for one line of Business', async () => {
        let tempData, configName1, randomStr = [...Array(7)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        it('[4109]: Create record', async () => {
            await apiHelper.apiLogin('qkatawazi');
            await apiHelper.deleteAutomatedCaseStatusTransition();
            await navigationPage.signOut();
            await loginPage.login('qkatawazi');
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Case Management--Automated Status Transition', BWF_PAGE_TITLES.CASE_MANAGEMENT.AUTOMATED_STATUS_TRANSITION);
            //Create first Record
            configName1 = AUTO_STATUS_TRANSITION_MANDATORY_FIELDS.name = 'ConfigName1' + randomStr;
            AUTO_STATUS_TRANSITION_MANDATORY_FIELDS.changeStatusAfter = Math.floor(Math.random() * 180) + 1;
            await automatedStatusTransitionConsolePo.clickAddAutomatedStatusTransitionBtn();
            await automatedStatusTransitionCreatePage.createAutomatedStatusTransition(AUTO_STATUS_TRANSITION_MANDATORY_FIELDS);
        });
        it('[4109]: Create new automatic case status transition rule for one line of Business', async () => {
            await utilityGrid.clearSearchBox();
            expect(await utilityGrid.isGridRecordPresent(configName1)).toBeTruthy();
            await navigationPage.signOut();
            await loginPage.login('qliu');
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Case Management--Automated Status Transition', BWF_PAGE_TITLES.CASE_MANAGEMENT.AUTOMATED_STATUS_TRANSITION);
            await utilityGrid.clearFilter();
            await utilityGrid.searchAndOpenHyperlink(configName1);
            await automatedStatusTransitionEditPage.updateConfigurationName('UpdatedConfigName1' + randomStr);
            await automatedStatusTransitionEditPage.saveConfiguration();
            await utilityGrid.clearSearchBox();
            expect(await utilityGrid.isGridRecordPresent('UpdatedConfigName1' + randomStr)).toBeTruthy();
        });
        it('[4109]: Create new automatic case status transition rule for one line of Business', async () => {
            await navigationPage.signOut();
            await loginPage.login('frieda');
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Case Management--Automated Status Transition', BWF_PAGE_TITLES.CASE_MANAGEMENT.AUTOMATED_STATUS_TRANSITION);
            await utilityGrid.clearFilter();
            expect(await utilityGrid.isGridRecordPresent('UpdatedConfigName1' + randomStr)).toBeFalsy();
        });
        it('[4109]: Create new automatic case status transition rule for one line of Business', async () => {
            await navigationPage.signOut();
            await loginPage.login('jbarnes');
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Case Management--Automated Status Transition', BWF_PAGE_TITLES.CASE_MANAGEMENT.AUTOMATED_STATUS_TRANSITION);
            await utilityGrid.selectLineOfBusiness("Human Resource");
            await utilityGrid.clearFilter();
            expect(await utilityGrid.isGridRecordPresent('UpdatedConfigName1' + randomStr)).toBeTruthy();
            await utilityGrid.selectLineOfBusiness("Facilities");
            await utilityGrid.clearFilter();
            expect(await utilityGrid.isGridRecordPresent('UpdatedConfigName1' + randomStr)).toBeFalsy();
        });
        it('[4109]: create same name record in same LOB', async () => {
            //create same name record in same LOB
            tempData = cloneDeep(AUTO_STATUS_TRANSITION_MANDATORY_FIELDS);
            tempData.name = 'UpdatedConfigName1' + randomStr;
            tempData.changeStatusAfter = 3;
            tempData.fromStatus = "In Progress";
            tempData.toStatus = "Pending";
            await utilityGrid.selectLineOfBusiness('Human Resource');
            await automatedStatusTransitionConsolePo.clickAddAutomatedStatusTransitionBtn();
            await utilityCommon.isAllDropDownValuesMatches(automatedStatusTransitionCreatePage.selectors.categoryTier1, ['Applications', 'Facilities', 'Fixed Assets', 'Phones', 'Projectors', 'Purchasing Card']);
            await automatedStatusTransitionCreatePage.createAutomatedStatusTransition(tempData);
            expect(await utilityCommon.isPopUpMessagePresent('Automated Status Configuration with same name already exists. Please select a different name.')).toBeTruthy("Error message absent");
            await automatedStatusTransitionCreatePage.clickCancelBtn();
            await utilityCommon.clickOnApplicationWarningYesNoButton('Yes');
        });
        it('[4109]: create same name record in different LOB', async () => {
            //create same name record in different LOB
            await utilityGrid.selectLineOfBusiness('Facilities');
            await automatedStatusTransitionConsolePo.clickAddAutomatedStatusTransitionBtn();
            await automatedStatusTransitionCreatePage.setName(tempData.name);
            await automatedStatusTransitionCreatePage.setCompany(tempData.company);
            await automatedStatusTransitionCreatePage.setFromStatus(tempData.toStatus);
            await automatedStatusTransitionCreatePage.setToStatus(tempData.fromStatus);
            await automatedStatusTransitionCreatePage.setChangeStatusAfter(tempData.changeStatusAfter.toString());
            // verify LOB on create page
            expect(await automatedStatusTransitionCreatePage.getLobValue()).toBe("Facilities");
            await automatedStatusTransitionCreatePage.saveConfig();
            expect(await utilityCommon.isPopUpMessagePresent('Saved successfully.')).toBeTruthy("Success message absent");
            // verify LOB on edit page
            await automatedStatusTransitionConsolePo.openAutomatedTransitionConfig(tempData.name);
            expect(await automatedStatusTransitionEditPage.getLobValue()).toBe("Facilities");
            await automatedStatusTransitionEditPage.clickCancel();
            await utilityGrid.selectLineOfBusiness('Human Resource');
        });
        afterAll(async () => {
            await utilityCommon.closeAllBlades();
            await navigationPage.signOut();
            await loginPage.login('qkatawazi');
        });
    });

    //apurva
    describe('[6230]: [Flowsets] Case Template creation with Flowset', () => {
        let randomStr = [...Array(4)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        let flowsetName1: string, flowsetName2: string, flowsetName3: string;
        beforeAll(async () => {
            await apiHelper.apiLogin('tadmin');
            let processName = `Agent Origin Global ${randomStr}`
            await apiHelper.createProcess(processName, 'AGENT_ORIGIN');

            //Register the Process
            await apiHelper.apiLogin('jbarnes');
            const registerProcessData = {
                applicationServicesLib: 'com.bmc.dsm.case-lib',
                processName: `com.bmc.dsm.case-lib:${processName}`,
                processAliasName: processName,
                company: '- Global -',
                lineOfBusiness: "Facilities",
                description: 'Desc ' + randomStr,
                status: 'Active'
            }
            let registeredProcessResponse = await apiHelper.createProcessLibConfig(registerProcessData);

            //Create new flowset
            flowsetName1 = `6230 ${randomStr} Active`;
            let flowsetMandatoryFieldsData1 = cloneDeep(flowsetGlobalFields);
            flowsetMandatoryFieldsData1.flowsetName = flowsetName1;
            flowsetMandatoryFieldsData1["lineOfBusiness"] = "Facilities";
            let flowsetResponse1 = await apiHelper.createNewFlowset(flowsetMandatoryFieldsData1);

            //Create new flowset
            flowsetName2 = `6230 ${randomStr} InActive`;
            let flowsetMandatoryFieldsData2 = cloneDeep(flowsetGlobalInActiveFields);
            flowsetMandatoryFieldsData2.flowsetName = flowsetName2;
            flowsetMandatoryFieldsData2["lineOfBusiness"] = "Facilities";
            await apiHelper.createNewFlowset(flowsetMandatoryFieldsData2);

            //Create new flowset
            flowsetName3 = `6230 ${randomStr} Draft`;
            let flowsetMandatoryFieldsData3 = cloneDeep(flowsetGlobalFields);
            flowsetMandatoryFieldsData3.flowsetName = flowsetName3;
            flowsetMandatoryFieldsData3["lineOfBusiness"] = "Facilities";
            await apiHelper.createNewFlowset(flowsetMandatoryFieldsData3);

            //Map Process to Flowset
            let flowsetProcessMappingData = {
                function: 'Initialization',
                processNameFull: registerProcessData.processName,
                processName: processName,
                status: 'Active',
                flowsetId: flowsetResponse1.id,
                company: 'Petramco'
            }
            await apiHelper.mapProcessToFlowset(flowsetProcessMappingData);
        });

        it('[6230]: [Flowsets] Case Template creation with Flowset', async () => {
            await navigationPage.signOut();
            await loginPage.login('jbarnes');
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Manage Flowsets--Define Flowsets', BWF_PAGE_TITLES.MANAGE_FLOWSETS.DEFINE_FLOWSETS);
            await utilityGrid.selectLineOfBusiness('Facilities');
            await consoleFlowsetConfigPo.searchAndSelectFlowset(flowsetName3);
            await editFlowsetConfigPo.setFlowset("edit Flowset" + randomStr);
            await editFlowsetConfigPo.setDescription("edit description" + randomStr);
            await expect(editFlowsetConfigPo.getStatusvalue()).toBe("Active");
            await editFlowsetConfigPo.selectFlowsetConfigStatus("Draft");
            await editFlowsetConfigPo.clickSaveBtn();
        });
        it('[6230]: [Flowsets] Case Template creation with Flowset', async () => {
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Case Management--Templates', BWF_PAGE_TITLES.CASE_MANAGEMENT.TEMPLATES);
            await utilityGrid.selectLineOfBusiness('Facilities');
            ALL_FIELD.templateName = ALL_FIELD.templateName + Math.floor(Math.random() * 100000);
            await consoleCasetemplatePo.clickOnCreateCaseTemplateButton();
            await createCasetemplatePo.setTemplateName(ALL_FIELD.templateName);
            await createCasetemplatePo.setCompanyName(ALL_FIELD.company);
            await createCasetemplatePo.setCaseSummary(ALL_FIELD.templateSummary);
            await createCasetemplatePo.setPriorityValue(ALL_FIELD.casePriority);
            await createCasetemplatePo.setOwnerCompanyValue('Petramco');
            await createCasetemplatePo.setOwnerOrgDropdownValue('Facilities Support');
            await createCasetemplatePo.setOwnerGroupDropdownValue('Facilities');
            await createCasetemplatePo.setTemplateStatusDropdownValue(ALL_FIELD.templateStatus);
            let flowsetValues: string[] = [flowsetName2, flowsetName3];
            expect(await createCasetemplatePo.flowsetOptionsPresent(flowsetValues)).toBeFalsy('Status in dropdown does not match');
            await createCasetemplatePo.setCompanyName(ALL_FIELD.company);
            await createCasetemplatePo.setFlowsetValue(flowsetName1);
            await createCasetemplatePo.clickSaveCaseTemplate();
        });
        it('[6230]: [Flowsets] Case Template creation with Flowset', async () => {
            //Create a case using above casetemplate
            await navigationPage.gotoCreateCase();
            await createCasePo.selectRequester('fritz');
            await createCasePo.clickSelectCaseTemplateButton();
            await selectCasetemplateBladePo.selectCaseTemplate(ALL_FIELD.templateName);
            await createCasePo.clickSaveCaseButton();
            await casePreviewPo.clickGoToCaseButton();
            expect(await viewCasePo.getFlowsetValue()).toBe(flowsetName1);
        });
        it('[6230]: [Flowsets] Case Template creation with Flowset', async () => {
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Manage Flowsets--Define Flowsets', BWF_PAGE_TITLES.MANAGE_FLOWSETS.DEFINE_FLOWSETS);
            await utilityGrid.selectLineOfBusiness('Human Resource');
            expect(await utilityGrid.isGridRecordPresent(flowsetName1)).toBeFalsy();
            expect(await utilityGrid.isGridRecordPresent(flowsetName2)).toBeFalsy();
            expect(await utilityGrid.isGridRecordPresent(flowsetName3)).toBeFalsy();
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Case Management--Templates', BWF_PAGE_TITLES.CASE_MANAGEMENT.TEMPLATES);
            await utilityGrid.selectLineOfBusiness('Human Resource');
            await consoleCasetemplatePo.clickOnCreateCaseTemplateButton();
            let flowsetValues: string[] = [flowsetName1, flowsetName2, flowsetName3];
            expect(await createCasetemplatePo.flowsetOptionsPresent(flowsetValues)).toBeFalsy('Status in dropdown does not match');
        });
    });

    //apurva
    describe('[12063]: LOB updates for agent must reflect permissions on Email Configurations.', async () => {
        let randomStr = [...Array(10)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        let templateName = 'Private' + randomStr;
        let templateName1 = 'TemplateName1' + randomStr;
        let emailID = "bmctemptestemail@gmail.com";
        beforeAll(async () => {
            let incomingEmail = {
                'mailBoxName': 'testEmail@gmail.com'
            }
            let emailConfigFacilities = {
                email: emailID,
                incomingMailBoxName: incomingEmail.mailBoxName,
                lineOfBusiness: "Facilities"
            }
            await navigationPage.signOut();
            await loginPage.login('jbarnes');
            await apiHelper.apiLogin('tadmin');
            await apiHelper.deleteAllEmailConfiguration();
            await apiHelper.createEmailBox('incoming', incomingEmail);
            await apiHelper.apiLogin('jbarnes');
            await apiHelper.createEmailConfiguration(emailConfigFacilities);
        });
        it('[12063]: LOB updates for agent must reflect permissions on Email Configurations.', async () => {
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Email--Configuration', BWF_PAGE_TITLES.EMAIL.CONFIGURATION);
            await utilityGrid.selectLineOfBusiness('Facilities');
            expect(await utilityGrid.isGridRecordPresent(emailID)).toBeTruthy();
            await utilityGrid.selectLineOfBusiness('Human Resource');
            expect(await utilityGrid.isGridRecordPresent(emailID)).toBeFalsy();
        });
        it('[12063]: LOB updates for agent must reflect permissions on Email Configurations.', async () => {
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Email--Acknowledgment Templates', BWF_PAGE_TITLES.EMAIL.ACKNOWLEDGMENT_TEMPLATES);
            await utilityGrid.selectLineOfBusiness('Facilities');
            await consoleAcknowledgmentTemplatePo.clickOnAddAcknowlegeTemplateButton();
            await createAcknowledgmentTemplatesPo.setTemplateName(templateName);
            await createAcknowledgmentTemplatesPo.selectCompanyDropDown('Petramco');
            await createAcknowledgmentTemplatesPo.selectStatusDropDown('Active');
            await createAcknowledgmentTemplatesPo.setDescription(templateName);
            await createAcknowledgmentTemplatesPo.setSubject(templateName);
            await createAcknowledgmentTemplatesPo.setBody(templateName);
            await createAcknowledgmentTemplatesPo.clickOnSaveButton();
            await utilityCommon.closePopUpMessage();
            await utilityGrid.selectLineOfBusiness('Human Resource');
            expect(await utilityGrid.isGridRecordPresent(templateName)).toBeFalsy();
        });
        it('[12063]: LOB updates for agent must reflect permissions on Email Configurations.', async () => {
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Email--Templates', BWF_PAGE_TITLES.EMAIL.TEMPLATES);
            await utilityGrid.selectLineOfBusiness('Facilities');
            await consoleEmailTemplatePo.clickOnAddEmailTemplateButton();
            await createEmailTemplatePo.setTemplateName(templateName1);
            await createEmailTemplatePo.selectCompany('Petramco');
            await createEmailTemplatePo.selectStatusDropDown('Active');
            await createEmailTemplatePo.setDescription(templateName1);
            await createEmailTemplatePo.setSubject(templateName1);
            await createEmailTemplatePo.setBody(templateName1);
            await createEmailTemplatePo.clickOnSaveButton();
            await utilityCommon.closePopUpMessage();
            await utilityGrid.selectLineOfBusiness('Human Resource');
            expect(await utilityGrid.isGridRecordPresent(templateName1)).toBeFalsy();
        });
        it('[12063]: LOB updates for agent must reflect permissions on Email Configurations.', async () => {
            await navigationPage.signOut();
            await loginPage.login('fritz');
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Email--Templates', BWF_PAGE_TITLES.EMAIL.TEMPLATES);
            expect(await utilityGrid.isGridRecordPresent(templateName1)).toBeTruthy();
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Email--Acknowledgment Templates', BWF_PAGE_TITLES.EMAIL.ACKNOWLEDGMENT_TEMPLATES);
            expect(await utilityGrid.isGridRecordPresent(templateName)).toBeTruthy();
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Email--Configuration', BWF_PAGE_TITLES.EMAIL.CONFIGURATION);
            expect(await utilityGrid.isGridRecordPresent(emailID)).toBeTruthy();
            await apiHelper.apiLogin('tadmin');
            await apiHelper.updateFoundationEntity('Person', 'Fritz', { functionalRole: "Facilities" });
            await navigationPage.signOut();
            await loginPage.login('fritz');
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Email--Templates', BWF_PAGE_TITLES.EMAIL.TEMPLATES);
            expect(await utilityGrid.isGridRecordPresent(templateName1)).toBeFalsy();
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Email--Acknowledgment Templates', BWF_PAGE_TITLES.EMAIL.ACKNOWLEDGMENT_TEMPLATES);
            expect(await utilityGrid.isGridRecordPresent(templateName)).toBeFalsy();
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Email--Configuration', BWF_PAGE_TITLES.EMAIL.CONFIGURATION);
            expect(await utilityGrid.isGridRecordPresent(emailID)).toBeFalsy();
            await apiHelper.apiLogin('tadmin');
            await apiHelper.updateFoundationEntity('Person', 'Fritz', { functionalRole: "Facilities" });
        });
    });
});
