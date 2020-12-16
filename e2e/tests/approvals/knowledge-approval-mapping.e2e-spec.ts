import { browser } from "protractor";
import apiHelper from '../../api/api.helper';
import loginPage from "../../pageobject/common/login.po";
import navigationPage from "../../pageobject/common/navigation.po";
import approvalMappingConsoleKnowledgePo from "../../pageobject/settings/knowledge-management/approval-mapping-console.po";
import createApprovalMappingKnowledgePo from "../../pageobject/settings/knowledge-management/create-approval-mapping.po";
import editApprovalMappingKnowledgePo from "../../pageobject/settings/knowledge-management/edit-approval-mapping.po";
import { BWF_BASE_URL } from '../../utils/constants';
import utilCommon from '../../utils/util.common';
import utilityCommon from '../../utils/utility.common';
import utilGrid from '../../utils/util.grid';
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

    describe('[DRDMV-20791]:Define Approval Mapping and check all fields details on UI', async () => {
        const randomStr = [...Array(10)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        let approvalMappingName = 'Approval Mapping' + randomStr;
        it('[DRDMV-20791]:Define Approval Mapping and check all fields details on UI', async () => {
            await navigationPage.signOut();
            await loginPage.login("fritz");
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Knowledge Management--Approvals', 'Configure Knowledge Approval Mapping - Business Workflows');
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
            expect(await utilCommon.isPopUpMessagePresent('Saved successfully.')).toBeTruthy('Record saved successfully confirmation message not displayed.');
        });

        it('[DRDMV-20791]: Verify Knowledge Approval Mapping is accessible to other Line of business Case BA', async () => {
            await navigationPage.signOut();
            await loginPage.login('qkatawazi');
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Knowledge Management--Approvals', 'Configure Knowledge Approval Mapping - Business Workflows');
            expect(await utilGrid.isGridRecordPresent(approvalMappingName)).toBeFalsy('Knowledge Approval Mapping for Facilities LOB are displayed to Human Resource LOB User.');
        });

        it('[DRDMV-20791]: Verify Knowledge Approval Mapping are accessible to Case BA user who has access to multiple (HR,Facilities) LOBs', async () => {
            await navigationPage.signOut();
            await loginPage.login('caseBAMultiLOB@petramco.com','Password_1234');
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Knowledge Management--Approvals', 'Configure Knowledge Approval Mapping - Business Workflows');
            await utilGrid.selectLineOfBusiness('Human Resource');
            expect(await utilGrid.isGridRecordPresent(approvalMappingName)).toBeFalsy('Knowledge Approval Mapping for Facilities LOB are displayed to Human Resource LOB User.');

            await utilGrid.selectLineOfBusiness('Facilities');
            expect(await utilGrid.isGridRecordPresent(approvalMappingName)).toBeTruthy('Knowledge Approval Mapping for Facilities LOB are not displayed to Human Resource LOB User.');
            await utilGrid.searchAndOpenHyperlink(approvalMappingName);
            await editApprovalMappingKnowledgePo.setApprovalMappingName(approvalMappingName+'_update');
            await editApprovalMappingKnowledgePo.selectStatusTrigger('Request Cancelation');
            await editApprovalMappingKnowledgePo.clickSaveApprovalMappingBtn();
            expect(await utilCommon.isPopUpMessagePresent('Saved successfully.')).toBeTruthy('Record saved successfully confirmation message not displayed.');
        });

        it('[DRDMV-20791]: Verify Knowledge Approval Mapping are accessible to Case Manager user who has access to multiple (HR,Facilities) LOBs', async () => {
            await navigationPage.signOut();
            await loginPage.login('caseMngrMultiLOB@petramco.com','Password_1234');
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Knowledge Management--Approvals', 'Configure Knowledge Approval Mapping - Business Workflows');
            await utilGrid.selectLineOfBusiness('Human Resource');
            expect(await utilGrid.isGridRecordPresent(approvalMappingName)).toBeFalsy('Knowledge Approval Mapping for Facilities LOB are displayed to Human Resource LOB User.');

            await utilGrid.selectLineOfBusiness('Facilities');
            expect(await utilGrid.isGridRecordPresent(approvalMappingName)).toBeTruthy('Knowledge Approval Mapping for Facilities LOB are not displayed to Human Resource LOB User.');
        });

        afterAll(async () => {
            await navigationPage.signOut();
            await loginPage.login('qkatawazi');
            await apiHelper.apiLogin('tadmin');
            await apiHelper.deleteApprovalMapping(knowledgeModule);
        });
    });
});
