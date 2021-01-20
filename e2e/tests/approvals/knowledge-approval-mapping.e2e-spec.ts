import { browser } from "protractor";
import apiHelper from '../../api/api.helper';
import loginPage from "../../pageobject/common/login.po";
import navigationPage from "../../pageobject/common/navigation.po";
import approvalMappingConsoleKnowledgePo from "../../pageobject/settings/knowledge-management/approval-mapping-console.po";
import createApprovalMappingKnowledgePo from "../../pageobject/settings/knowledge-management/create-approval-mapping.po";
import editApprovalMappingKnowledgePo from "../../pageobject/settings/knowledge-management/edit-approval-mapping.po";
import { BWF_BASE_URL, BWF_PAGE_TITLES } from '../../utils/constants';
import utilCommon from '../../utils/util.common';
import utilityCommon from '../../utils/utility.common';
import utilGrid from '../../utils/util.grid';
import utilityGrid from '../../utils/utility.grid';
let userData, userData1, userData2 = undefined;

describe("Knowledge Approval Mapping Tests", () => {
    let knowledgeModule = 'Knowledge';

    beforeAll(async () => {
        await browser.get(BWF_BASE_URL);
        await loginPage.login("qkatawazi");
        await apiHelper.apiLogin('tadmin');
        await apiHelper.deleteApprovalMapping(knowledgeModule);

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
            await navigationPage.gotoSettingsMenuItem('Knowledge Management--Approvals', BWF_PAGE_TITLES.KNOWLEDGE_MANAGEMENT.APPROVALS);
            await approvalMappingConsoleKnowledgePo.clickCreateApprovalMappingBtn();
            expect(await createApprovalMappingKnowledgePo.getCreateApprovalMappingHeaderText()).toBe('Add Approval Mapping');
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
            await navigationPage.gotoSettingsMenuItem('Knowledge Management--Approvals', BWF_PAGE_TITLES.KNOWLEDGE_MANAGEMENT.APPROVALS);
            expect(await utilityGrid.isGridRecordPresent(approvalMappingName)).toBeFalsy('Knowledge Approval Mapping for Facilities LOB are displayed to Human Resource LOB User.');
        });

        it('[3693]: Verify Knowledge Approval Mapping are accessible to Case BA user who has access to multiple (HR,Facilities) LOBs', async () => {
            await navigationPage.signOut();
            await loginPage.login('caseBAMultiLOB@petramco.com','Password_1234');
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Knowledge Management--Approvals', BWF_PAGE_TITLES.KNOWLEDGE_MANAGEMENT.APPROVALS);
            await utilityGrid.selectLineOfBusiness('Human Resource');
            expect(await utilityGrid.isGridRecordPresent(approvalMappingName)).toBeFalsy('Knowledge Approval Mapping for Facilities LOB are displayed to Human Resource LOB User.');

            await utilityGrid.selectLineOfBusiness('Facilities');
            expect(await utilityGrid.isGridRecordPresent(approvalMappingName)).toBeTruthy('Knowledge Approval Mapping for Facilities LOB are not displayed to Human Resource LOB User.');
            await utilityGrid.searchAndOpenHyperlink(approvalMappingName);
            await editApprovalMappingKnowledgePo.setApprovalMappingName(approvalMappingName+'_update');
            await editApprovalMappingKnowledgePo.selectStatusTrigger('Request Cancelation');
            await editApprovalMappingKnowledgePo.clickSaveApprovalMappingBtn();
            expect(await utilityCommon.isPopUpMessagePresent('Saved successfully.')).toBeTruthy('Record saved successfully confirmation message not displayed.');
        });

        it('[3693]: Verify Knowledge Approval Mapping are accessible to Case Manager user who has access to multiple (HR,Facilities) LOBs', async () => {
            await navigationPage.signOut();
            await loginPage.login('caseMngrMultiLOB@petramco.com','Password_1234');
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Knowledge Management--Approvals', BWF_PAGE_TITLES.KNOWLEDGE_MANAGEMENT.APPROVALS);
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
            await navigationPage.gotoSettingsMenuItem('Knowledge Management--Approvals', BWF_PAGE_TITLES.KNOWLEDGE_MANAGEMENT.APPROVALS);
            await utilityGrid.selectLineOfBusiness('Facilities');
            await approvalMappingConsoleKnowledgePo.clickCreateApprovalMappingBtn();
            await createApprovalMappingKnowledgePo.setApprovalMappingName(approvalMappingName+'_update');
            await createApprovalMappingKnowledgePo.selectCompany('Petramco');
            await createApprovalMappingKnowledgePo.selectStatusTrigger('Retire Approval');
            await createApprovalMappingKnowledgePo.clickSaveApprovalMappingBtn();
            expect(await utilityCommon.isPopUpMessagePresent('ERROR (222099): The Approval Mapping Name already exists. Please select a different name.')).toBeTruthy("Error message absent");
            await createApprovalMappingKnowledgePo.clickCancelApprovalMappingBtn();
            await utilityCommon.clickOnApplicationWarningYesNoButton("Yes");
        });
        it('[3693]: create same name record in different LOB', async () => {
            //create same name record in different LOB
            await utilityGrid.selectLineOfBusiness('Human Resource');
            await approvalMappingConsoleKnowledgePo.clickCreateApprovalMappingBtn();
            await createApprovalMappingKnowledgePo.setApprovalMappingName(approvalMappingName+'_update');
            await createApprovalMappingKnowledgePo.selectCompany('Petramco');
            await createApprovalMappingKnowledgePo.selectStatusTrigger('Retire Approval');            
            // verify LOB is there
            expect(await createApprovalMappingKnowledgePo.getLobValue()).toBe("Human Resource");
            await createApprovalMappingKnowledgePo.clickSaveApprovalMappingBtn();
            expect(await utilityCommon.isPopUpMessagePresent('Saved successfully.')).toBeTruthy("Success message absent");
            // open the record and verify LOB is on edit screen
            await utilityGrid.searchAndOpenHyperlink(approvalMappingName+'_update');
            expect(await editApprovalMappingKnowledgePo.getLobValue()).toBe("Human Resource");
            await editApprovalMappingKnowledgePo.clickCancelApprovalMappingBtn();
        });
        afterAll(async () => {
            await navigationPage.signOut();
            await loginPage.login('qkatawazi');
            await apiHelper.apiLogin('tadmin');
            await apiHelper.deleteApprovalMapping(knowledgeModule);
        });
    });
});
