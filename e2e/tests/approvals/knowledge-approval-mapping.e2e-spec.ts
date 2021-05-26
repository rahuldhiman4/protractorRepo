import { browser } from "protractor";
import apiHelper from '../../api/api.helper';
import accessTabPo from "../../pageobject/common/access-tab.po";
import loginPage from "../../pageobject/common/login.po";
import navigationPage from "../../pageobject/common/navigation.po";
import editKnowledgePage from '../../pageobject/knowledge/edit-knowledge.po';
import knowledgeArticlesConsolePo from "../../pageobject/knowledge/knowledge-articles-console.po";
import viewKnowledgeArticlePo from "../../pageobject/knowledge/view-knowledge-article.po";
import approvalMappingConsoleKnowledgePo from "../../pageobject/settings/knowledge-management/approval-mapping-console.po";
import createApprovalMappingKnowledgePo from "../../pageobject/settings/knowledge-management/create-approval-mapping.po";
import editApprovalMappingKnowledgePo from "../../pageobject/settings/knowledge-management/edit-approval-mapping.po";
import { BWF_BASE_URL, BWF_PAGE_TITLES } from '../../utils/constants';
import utilityCommon from '../../utils/utility.common';
import utilityGrid from '../../utils/utility.grid';

describe("Knowledge Approval Mapping Tests", () => {
    const randomStr = [...Array(10)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
    let knowledgeModule = 'Knowledge';
    let knowledgeManagementApp = "Knowledge Management";
    let knowledgePublisherUser = 'kmills';
    let knowledgeArticlesTitleStr = "Knowledge Articles";

    beforeAll(async () => {
        await browser.get(BWF_BASE_URL);
        await loginPage.login("qkatawazi");
        await apiHelper.apiLogin('tadmin');
        await apiHelper.deleteApprovalMapping(knowledgeModule);
    });

    afterAll(async () => {
        await utilityCommon.closeAllBlades();
        await navigationPage.signOut();
    });

    describe('[3693]:Define Approval Mapping and check all fields details on UI', async () => {
        const randomStr = [...Array(10)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        let approvalMappingName = 'Approval Mapping' + randomStr;
        it('[3693]:Define Approval Mapping and check all fields details on UI', async () => {
            await navigationPage.signOut();
            await loginPage.login("fritz");
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Knowledge Management--Approval Mappings', BWF_PAGE_TITLES.KNOWLEDGE_MANAGEMENT.APPROVALS);
            await approvalMappingConsoleKnowledgePo.clickCreateApprovalMappingBtn();
            expect(await createApprovalMappingKnowledgePo.getCreateApprovalMappingHeaderText()).toBe('Create Approval Mapping');
            expect(await createApprovalMappingKnowledgePo.isApprovalMappingNameFieldMandatory()).toBeTruthy();
            expect(await createApprovalMappingKnowledgePo.isCompanyFieldMandatory()).toBeTruthy();
            expect(await createApprovalMappingKnowledgePo.isStatusTriggerFieldMandatory()).toBeTruthy();
            expect(await createApprovalMappingKnowledgePo.getApprovalMappingStatusMappingMessage()).toContain('If an approval is rejected, canceled or has an error, it will be moved to the previous status.');
            await createApprovalMappingKnowledgePo.setApprovalMappingName(approvalMappingName);
            await createApprovalMappingKnowledgePo.selectCompany('Petramco');
            await createApprovalMappingKnowledgePo.selectStatusTrigger('Publish Approval');
            await createApprovalMappingKnowledgePo.clickSaveApprovalMappingBtn();
            expect(await utilityCommon.isPopUpMessagePresent('Saved successfully.')).toBeTruthy('Record saved successfully confirmation message not displayed.');
        });

        it('[3693]: Verify Knowledge Approval Mapping is accessible to other Line of business Case BA', async () => {
            await navigationPage.signOut();
            await loginPage.login('qkatawazi');
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Knowledge Management--Approval Mappings', BWF_PAGE_TITLES.KNOWLEDGE_MANAGEMENT.APPROVALS);
            expect(await utilityGrid.isGridRecordPresent(approvalMappingName)).toBeFalsy('Knowledge Approval Mapping for Facilities LOB are displayed to Human Resource LOB User.');
        });

        it('[3693]: Verify Knowledge Approval Mapping are accessible to Case BA user who has access to multiple (HR,Facilities) LOBs', async () => {
            await navigationPage.signOut();
            await loginPage.login('jbarnes');
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Knowledge Management--Approval Mappings', BWF_PAGE_TITLES.KNOWLEDGE_MANAGEMENT.APPROVALS);
            await utilityGrid.selectLineOfBusiness('Human Resource');
            expect(await utilityGrid.isGridRecordPresent(approvalMappingName)).toBeFalsy('Knowledge Approval Mapping for Facilities LOB are displayed to Human Resource LOB User.');

            await utilityGrid.selectLineOfBusiness('Facilities');
            expect(await utilityGrid.isGridRecordPresent(approvalMappingName)).toBeTruthy('Knowledge Approval Mapping for Facilities LOB are not displayed to Human Resource LOB User.');
            await utilityGrid.searchAndOpenHyperlink(approvalMappingName);
            await editApprovalMappingKnowledgePo.setApprovalMappingName(approvalMappingName + '_update');
            await editApprovalMappingKnowledgePo.selectStatusTrigger('Request Cancelation');
            await editApprovalMappingKnowledgePo.clickSaveApprovalMappingBtn();
            expect(await utilityCommon.isPopUpMessagePresent('Saved successfully.')).toBeTruthy('Record saved successfully confirmation message not displayed.');
        });

        it('[3693]: Verify Knowledge Approval Mapping are accessible to Case Manager user who has access to multiple (HR,Facilities) LOBs', async () => {
            await navigationPage.signOut();
            // HR and Facilities CaseManager
            await loginPage.login('qyuan');
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Knowledge Management--Approval Mappings', BWF_PAGE_TITLES.KNOWLEDGE_MANAGEMENT.APPROVALS);
            await utilityGrid.selectLineOfBusiness('Human Resource');
            expect(await utilityGrid.isGridRecordPresent(approvalMappingName)).toBeFalsy('Knowledge Approval Mapping for Facilities LOB are displayed to Human Resource LOB User.');
            await utilityGrid.selectLineOfBusiness('Facilities');
            expect(await utilityGrid.isGridRecordPresent(approvalMappingName)).toBeTruthy('Knowledge Approval Mapping for Facilities LOB are not displayed to Human Resource LOB User.');
        });

        it('[3693]: create same name record in same LOB', async () => {
            //create same name record in same LOB
            await navigationPage.signOut();
            await loginPage.login('jbarnes');
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Knowledge Management--Approval Mappings', BWF_PAGE_TITLES.KNOWLEDGE_MANAGEMENT.APPROVALS);
            await utilityGrid.selectLineOfBusiness('Facilities');
            await approvalMappingConsoleKnowledgePo.clickCreateApprovalMappingBtn();
            await createApprovalMappingKnowledgePo.setApprovalMappingName(approvalMappingName + '_update');
            await createApprovalMappingKnowledgePo.selectCompany('Petramco');
            await createApprovalMappingKnowledgePo.selectStatusTrigger('Retire Approval');
            await createApprovalMappingKnowledgePo.clickSaveApprovalMappingBtn();
            expect(await utilityCommon.isPopUpMessagePresent('The Approval Mapping Name already exists. Please select a different name.')).toBeTruthy("Error message absent");
            await createApprovalMappingKnowledgePo.clickCancelApprovalMappingBtn();
            await utilityCommon.clickOnApplicationWarningYesNoButton("Yes");
            await utilityCommon.closePopUpMessage();
        });
        it('[3693]: create same name record in different LOB', async () => {
            //create same name record in different LOB
            await utilityGrid.selectLineOfBusiness('Human Resource');
            await approvalMappingConsoleKnowledgePo.clickCreateApprovalMappingBtn();
            await createApprovalMappingKnowledgePo.setApprovalMappingName(approvalMappingName + '_update');
            await createApprovalMappingKnowledgePo.selectCompany('- Global -');
            await createApprovalMappingKnowledgePo.selectStatusTrigger('Retire Approval');
            // verify LOB is there
            expect(await createApprovalMappingKnowledgePo.getLobValue()).toContain("Human Resource");
            await createApprovalMappingKnowledgePo.clickSaveApprovalMappingBtn();
            expect(await utilityCommon.isPopUpMessagePresent('Saved successfully.')).toBeTruthy("Success message absent");
            // open the record and verify LOB is on edit screen
            await utilityGrid.searchAndOpenHyperlink(approvalMappingName + '_update');
            expect(await editApprovalMappingKnowledgePo.getLobValue()).toContain("Human Resource");
            await editApprovalMappingKnowledgePo.clickCancelApprovalMappingBtn();
            await utilityCommon.clickOnApplicationWarningYesNoButton("Yes");
        });
        afterAll(async () => {
            await utilityCommon.closeAllBlades();
            await navigationPage.signOut();
            await loginPage.login('qkatawazi');
            await apiHelper.apiLogin('tadmin');
            await apiHelper.deleteApprovalMapping(knowledgeModule);
        });
    });

    describe('[3576,3575]:Tiggered the Approval on Article and check KA screen by Approver should show Approval component', async () => {
        let knowledgeSetTitle = undefined, title = "3576 KnowledgeArticle", knowledgeArticleGUID, knowledgeArticleData;
        beforeAll(async () => {
            await apiHelper.apiLogin('elizabeth');
            let knowledgeSetData = {
                "knowledgeSetTitle": "Knowledge Set Petramco",
                "knowledgeSetDesc": "Knowledge Description Petramco",
                "company": "Petramco"
            }
            let knowledgeApprovalFlowData = {
                "flowName": "Preset Filter",
                "approver": "KMills",
                "qualification": "'Operational Category Tier 1' = \"Applications\""
            }
            let knowledgeApprovalMappingData = {
                "mappingName": "Approval Config Name",
                "company": "Petramco",
                "publishApproval": "PublishApproval",
                "requestCancelation": "CancelApproval",
                "retireApproval": "RetireApproval"
            }
            //Create Knowledge Configuraton
            const randomStr = [...Array(2)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
            knowledgeSetTitle = knowledgeSetData.knowledgeSetTitle + randomStr;
            knowledgeSetData.knowledgeSetTitle = knowledgeSetTitle;
            await apiHelper.createKnowledgeSet(knowledgeSetData);
            let approvalConfigGlobalTitle = knowledgeApprovalFlowData.flowName + randomStr;
            knowledgeApprovalFlowData.flowName = approvalConfigGlobalTitle;
            await apiHelper.createApprovalFlow(knowledgeApprovalFlowData, knowledgeModule);
            await apiHelper.createApprovalMapping(knowledgeModule, knowledgeApprovalMappingData);
            let articleData = {
                "knowledgeSet": "HR",
                "title": "KnowledgeArticle",
                "templateId": "AGGAA5V0HGVMIAOK2JE7O965BK1BJW",
                "categoryTier1": "Applications",
                "categoryTier2": "Help Desk",
                "categoryTier3": "Incident",
                "region": "Australia",
                "site": "Canberra",
                "assignedCompany": "Petramco",
                "assigneeBusinessUnit": "United Kingdom Support",
                "assigneeSupportGroup": "GB Support 2",
                "assignee": "KMills"
            }
            // Create article in in progress status
            articleData.title = title + "_" + "In Progress";
            knowledgeArticleData = await apiHelper.createKnowledgeArticle(articleData);
            //Create article in Published status
            articleData.title = title + "_" + "Published";
            knowledgeArticleData = await apiHelper.createKnowledgeArticle(articleData);
            knowledgeArticleGUID = knowledgeArticleData.id;
        });
        it('[3576,3575]:Tiggered the Approval on Article and check KA screen by Approver should show Approval component', async () => {
            await navigationPage.signOut();
            await loginPage.login('elizabeth');
            await navigationPage.switchToApplication(knowledgeManagementApp);
            expect(await knowledgeArticlesConsolePo.getKnowledgeArticleConsoleTitle()).toEqual(knowledgeArticlesTitleStr, 'title not correct');
            await utilityGrid.searchAndOpenHyperlink(knowledgeArticleData.displayId);
            expect(await viewKnowledgeArticlePo.isApprovalButtonsPresent("Approve")).toBeFalsy();
            expect(await viewKnowledgeArticlePo.isApprovalButtonsPresent("Reject")).toBeFalsy();
            await viewKnowledgeArticlePo.clickEditKnowledgeAccess();
            await accessTabPo.clickToExpandAccessEntitiySearch('Agent Access', 'Knowledge');
            await accessTabPo.selectAgent('kayo', 'Agent');
            await accessTabPo.clickAccessEntitiyAddButton('Agent');
            await accessTabPo.clickCloseKnowledgeAccessBlade();
        });
        it('[3576,3575]:Tiggered the Approval on Article and check KA screen by Approver should show Approval component', async () => {
            await apiHelper.apiLogin('elizabeth');
            expect(await apiHelper.updateKnowledgeArticleStatus(knowledgeArticleGUID, "Draft")).toBeTruthy("Article with Draft status not updated.");
            expect(await apiHelper.updateKnowledgeArticleStatus(knowledgeArticleGUID, 'PublishApproval', "KMills", 'GB Support 2', 'Petramco')).toBeTruthy("Article with Published status not updated.");
            await navigationPage.signOut();
            await loginPage.login(knowledgePublisherUser);
            await navigationPage.switchToApplication(knowledgeManagementApp);
            expect(await knowledgeArticlesConsolePo.getKnowledgeArticleConsoleTitle()).toEqual(knowledgeArticlesTitleStr, 'title not correct');
            await utilityGrid.searchAndOpenHyperlink(knowledgeArticleData.displayId);
            expect(await viewKnowledgeArticlePo.isApprovalButtonsPresent("Approve")).toBeTruthy();
            expect(await viewKnowledgeArticlePo.isApprovalButtonsPresent("Reject")).toBeTruthy();
        });
        it('[3576,3575]:Tiggered the Approval on Article and check KA screen by Approver should show Approval component', async () => {
            await navigationPage.signOut();
            await loginPage.login('kayo');
            await navigationPage.switchToApplication(knowledgeManagementApp);
            expect(await knowledgeArticlesConsolePo.getKnowledgeArticleConsoleTitle()).toEqual(knowledgeArticlesTitleStr, 'title not correct');
            await utilityGrid.searchAndOpenHyperlink(knowledgeArticleData.displayId);
            expect(await viewKnowledgeArticlePo.isApprovalButtonsPresent("Approve")).toBeFalsy();
            expect(await viewKnowledgeArticlePo.isApprovalButtonsPresent("Reject")).toBeFalsy();
        });
        afterAll(async () => {
            await apiHelper.apiLogin('elizabeth');
            await apiHelper.deleteApprovalMapping(knowledgeModule);
            await navigationPage.signOut();
            await loginPage.login('qkatawazi');
        });
    });

    describe('[3627]:UI- Knowledge Article functioning for  Approval phases such as Publish, Retire and Cancel', async () => {
        let articleData, knowledgeSetTitle = undefined, title = "3627 KnowledgeArticle" + randomStr, knowledgeArticleGUID, knowledgeArticleData;
        beforeAll(async () => {
            await apiHelper.apiLogin('elizabeth');
            let knowledgeSetData = {
                "knowledgeSetTitle": "Knowledge Set Petramco",
                "knowledgeSetDesc": "Knowledge Description Petramco",
                "company": "Petramco"
            }
            let knowledgeApprovalFlowData = {
                "flowName": "Preset Filter",
                "approver": "KMills",
                "qualification": "('Operational Category Tier 1' = \"Applications\") AND ('Operational Category Tier 2' = \"Help Desk\")"
            }
            let knowledgeApprovalMappingData = {
                "mappingName": "Approval Config Name",
                "company": "Petramco",
                "publishApproval": "PublishApproval",
                "requestCancelation": "CancelApproval",
                "retireApproval": "RetireApproval"
            }
            //Create Knowledge Configuraton
            const randomStr = [...Array(2)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
            knowledgeSetTitle = knowledgeSetData.knowledgeSetTitle + randomStr;
            knowledgeSetData.knowledgeSetTitle = knowledgeSetTitle;
            await apiHelper.createKnowledgeSet(knowledgeSetData);
            let approvalConfigGlobalTitle = knowledgeApprovalFlowData.flowName + randomStr;
            knowledgeApprovalFlowData.flowName = approvalConfigGlobalTitle;
            await apiHelper.createApprovalFlow(knowledgeApprovalFlowData, knowledgeModule);
            await apiHelper.createApprovalMapping(knowledgeModule, knowledgeApprovalMappingData);
            articleData = {
                "knowledgeSet": "HR",
                "title": "3627KnowledgeArticle_" + randomStr,
                "templateId": "AGGAA5V0HGVMIAOK2JE7O965BK1BJW",
                "categoryTier1": "Applications",
                "categoryTier2": "Help Desk",
                "categoryTier3": "Incident",
                "region": "Australia",
                "site": "Canberra",
                "assignedCompany": "Petramco",
                "assigneeBusinessUnit": "United Kingdom Support",
                "assigneeSupportGroup": "GB Support 2",
                "assignee": "KMills"
            }
            // Create article in in progress status
            articleData.title = title + "_" + "In Progress";
            knowledgeArticleData = await apiHelper.createKnowledgeArticle(articleData);
            knowledgeArticleGUID = knowledgeArticleData.id;
        });
        it('[3627]:UI- Knowledge Article functioning for  Approval phases such as Publish, Retire and Cancel', async () => {
            await apiHelper.apiLogin('elizabeth');
            expect(await apiHelper.updateKnowledgeArticleStatus(knowledgeArticleGUID, "Draft")).toBeTruthy("Article with Draft status not updated.");
            expect(await apiHelper.updateKnowledgeArticleStatus(knowledgeArticleGUID, 'PublishApproval', "KMills", 'GB Support 2', 'Petramco')).toBeTruthy("Article with Published status not updated.");
            await navigationPage.signOut();
            await loginPage.login(knowledgePublisherUser);
            await navigationPage.switchToApplication(knowledgeManagementApp);
            expect(await knowledgeArticlesConsolePo.getKnowledgeArticleConsoleTitle()).toEqual(knowledgeArticlesTitleStr, 'title not correct');
            await utilityGrid.searchAndOpenHyperlink(knowledgeArticleData.displayId);
            expect(await viewKnowledgeArticlePo.isApprovalButtonsPresent("Reject")).toBeTruthy();
            await viewKnowledgeArticlePo.clickOnRejectLink();
            await utilityCommon.switchToDefaultWindowClosingOtherTabs();
            await navigationPage.signOut();
            await loginPage.login('elizabeth');
            await navigationPage.switchToApplication(knowledgeManagementApp);
            expect(await knowledgeArticlesConsolePo.getKnowledgeArticleConsoleTitle()).toEqual(knowledgeArticlesTitleStr, 'title not correct');
            await utilityGrid.searchAndOpenHyperlink(knowledgeArticleData.displayId);
            expect(await viewKnowledgeArticlePo.getStatusValue()).toBe("Draft", 'Status is not updated');
            await editKnowledgePage.setKnowledgeStatus('Request Cancelation');
            expect(await editKnowledgePage.getStatusValue()).toContain('Request Cancelation', 'Status Not set');
        });
        it('[3627]:UI- Knowledge Article functioning for  Approval phases such as Publish, Retire and Cancel', async () => {
            await utilityCommon.switchToDefaultWindowClosingOtherTabs();
            await navigationPage.signOut();
            await loginPage.login(knowledgePublisherUser);
            await navigationPage.switchToApplication(knowledgeManagementApp);
            expect(await knowledgeArticlesConsolePo.getKnowledgeArticleConsoleTitle()).toEqual(knowledgeArticlesTitleStr, 'title not correct');
            await utilityGrid.searchAndOpenHyperlink(knowledgeArticleData.displayId);
            expect(await viewKnowledgeArticlePo.isApprovalButtonsPresent("Reject")).toBeTruthy();
            await viewKnowledgeArticlePo.clickOnRejectLink();
            await navigationPage.signOut();
            await utilityCommon.switchToDefaultWindowClosingOtherTabs();
            await loginPage.login('elizabeth');
            await navigationPage.switchToApplication(knowledgeManagementApp);
            expect(await knowledgeArticlesConsolePo.getKnowledgeArticleConsoleTitle()).toEqual(knowledgeArticlesTitleStr, 'title not correct');
            await utilityGrid.searchAndOpenHyperlink(knowledgeArticleData.displayId);
            expect(await viewKnowledgeArticlePo.getStatusValue()).toBe("Draft", 'Status is not updated');
            await editKnowledgePage.setKnowledgeStatus('Publish Approval');
            expect(await editKnowledgePage.getStatusValue()).toContain('Publish Approval', 'Status Not set');
        });
        it('[3627]:UI- Knowledge Article functioning for  Approval phases such as Publish, Retire and Cancel', async () => {
            await utilityCommon.switchToDefaultWindowClosingOtherTabs();
            await navigationPage.signOut();
            await loginPage.login(knowledgePublisherUser);
            await navigationPage.switchToApplication(knowledgeManagementApp);
            expect(await knowledgeArticlesConsolePo.getKnowledgeArticleConsoleTitle()).toEqual(knowledgeArticlesTitleStr, 'title not correct');
            await utilityGrid.searchAndOpenHyperlink(knowledgeArticleData.displayId);
            expect(await viewKnowledgeArticlePo.isApprovalButtonsPresent("Approve")).toBeTruthy();
            await viewKnowledgeArticlePo.clickOnApproveLink();
            await utilityCommon.switchToDefaultWindowClosingOtherTabs();
            await navigationPage.signOut();
            await loginPage.login('elizabeth');
            await navigationPage.switchToApplication(knowledgeManagementApp);
            expect(await knowledgeArticlesConsolePo.getKnowledgeArticleConsoleTitle()).toEqual(knowledgeArticlesTitleStr, 'title not correct');
            await utilityGrid.searchAndOpenHyperlink(knowledgeArticleData.displayId);
            expect(await viewKnowledgeArticlePo.getStatusValue()).toBe("Published", 'Status is not updated');
            await editKnowledgePage.setKnowledgeStatus('Retire Approval');
            expect(await editKnowledgePage.getStatusValue()).toContain('Retire Approval', 'Status Not set');
        });
        it('[3627]:UI- Knowledge Article functioning for  Approval phases such as Publish, Retire and Cancel', async () => {
            await utilityCommon.switchToDefaultWindowClosingOtherTabs();
            await navigationPage.signOut();
            await loginPage.login(knowledgePublisherUser);
            await navigationPage.switchToApplication(knowledgeManagementApp);
            expect(await knowledgeArticlesConsolePo.getKnowledgeArticleConsoleTitle()).toEqual(knowledgeArticlesTitleStr, 'title not correct');
            await utilityGrid.searchAndOpenHyperlink(knowledgeArticleData.displayId);
            expect(await viewKnowledgeArticlePo.isApprovalButtonsPresent("Approve")).toBeTruthy();
            await viewKnowledgeArticlePo.clickOnApproveLink();
            await utilityCommon.switchToDefaultWindowClosingOtherTabs();
            await navigationPage.signOut();
            await loginPage.login('elizabeth');
            await navigationPage.switchToApplication(knowledgeManagementApp);
            expect(await knowledgeArticlesConsolePo.getKnowledgeArticleConsoleTitle()).toEqual(knowledgeArticlesTitleStr, 'title not correct');
            await utilityGrid.searchAndOpenHyperlink(knowledgeArticleData.displayId);
            expect(await viewKnowledgeArticlePo.getStatusValue()).toBe("Retired", 'Status is not updated');
        });
        afterAll(async () => {
            await apiHelper.apiLogin('elizabeth');
            await apiHelper.deleteApprovalMapping(knowledgeModule);
            await utilityCommon.closeAllBlades();
            await utilityCommon.switchToDefaultWindowClosingOtherTabs();
        });
    });
});
