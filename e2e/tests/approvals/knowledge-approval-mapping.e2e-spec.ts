import { browser } from "protractor";
import apiHelper from '../../api/api.helper';
import loginPage from "../../pageobject/common/login.po";
import navigationPage from "../../pageobject/common/navigation.po";
import approvalMappingConsoleKnowledgePo from "../../pageobject/settings/knowledge-management/approval-mapping-console.po";
import createApprovalMappingKnowledgePo from "../../pageobject/settings/knowledge-management/create-approval-mapping.po";
import { BWF_BASE_URL } from '../../utils/constants';
import utilCommon from '../../utils/util.common';
import utilityCommon from '../../utils/utility.common';

describe("Knowledge Approval Mapping Tests", () => {

    beforeAll(async () => {
        await browser.get(BWF_BASE_URL);
        await loginPage.login("qkatawazi");
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
            await loginPage.login("elizabeth");
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
        afterAll(async () => {
            await apiHelper.apiLogin('tadmin');
            await apiHelper.deleteKnowledgeApprovalMapping();
        });
    });
});
