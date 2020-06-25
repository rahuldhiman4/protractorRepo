import { browser } from "protractor";
import apiHelper from '../../api/api.helper';
import loginPage from '../../pageobject/common/login.po';
import navigationPage from '../../pageobject/common/navigation.po';
import consoleKnowledgeSetPo from '../../pageobject/settings/knowledge-management/console-knowledge-set.po';
import createKnowledgeSetPo from '../../pageobject/settings/knowledge-management/create-knowledge-set.po';
import editKnowledgeSet from '../../pageobject/settings/knowledge-management/edit-knowledge-set.po';
import { BWF_BASE_URL } from '../../utils/constants';
import utilCommon from '../../utils/util.common';
import utilGrid from '../../utils/util.grid';
import utilityCommon from '../../utils/utility.common';

describe('Knowledge Article Set', () => {

    beforeAll(async () => {
        await browser.get(BWF_BASE_URL);
        await apiHelper.apiLogin('tadmin');
        await apiHelper.deleteKnowledgeSet('DRDMV-1062');
        await loginPage.login('tadmin');
        await navigationPage.switchToAnotherApplication("Knowledge Management");
    });

    afterAll(async () => {
        await utilityCommon.closeAllBlades();
        await navigationPage.signOut();
    });

    it('[DRDMV-1105]: Knowledge set_Tenant Administrator creates knowledge set', async () => {
        let randomStr = [...Array(10)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        await navigationPage.gotoSettingsPage();
        await navigationPage.gotoSettingsMenuItem('Knowledge Management--Knowledge Sets', 'Knowledge Set Console');
        await consoleKnowledgeSetPo.clickOnAddKnowledgeSetBtn();
        expect(await createKnowledgeSetPo.isFieldRequired('Knowledge Set')).toBeTruthy('Knowledge Set field is not tagged as required');
        expect(await createKnowledgeSetPo.isFieldRequired('Description')).toBeTruthy('Description field is not tagged as required');
        expect(await createKnowledgeSetPo.isFieldRequired('Company')).toBeTruthy('Company field is not tagged as required');
        await createKnowledgeSetPo.clickCreateNewButton();
        expect(await createKnowledgeSetPo.getDescriptionLabel()).toBe('Description');
        expect(await createKnowledgeSetPo.getApplicationIDLabel()).toBe('Application ID');
        expect(await createKnowledgeSetPo.getApplicationBundleLabel()).toBe('Application Bundle ID');
        expect(await createKnowledgeSetPo.isFieldRequired('Application Description')).toBeTruthy('Application Description field is not tagged as required');
        expect(await createKnowledgeSetPo.isFieldRequired('Application ID')).toBeTruthy('Application ID field is not tagged as required');
        expect(await createKnowledgeSetPo.isFieldRequired('Application Bundle ID')).toBeTruthy('Application Bundle ID field is not tagged as required');
        await createKnowledgeSetPo.clickCreateNewApplicationCancelBtn();
        await createKnowledgeSetPo.setKnowledgeSetName('DRDMV-1062' + randomStr);
        await createKnowledgeSetPo.setCompanyValue('Petramco');
        await createKnowledgeSetPo.setDescriptionValue('Sample Description' + randomStr);
        await createKnowledgeSetPo.addNewApplication('Approval', 'desc1' + randomStr);
        await createKnowledgeSetPo.addNewApplication('Assignment', 'desc2' + randomStr);
        await createKnowledgeSetPo.addNewApplication('Case Management Service', 'desc3' + randomStr);
        await createKnowledgeSetPo.clickAssociateBtn();
        expect(await createKnowledgeSetPo.isApplicationAvaialableForAssociation('com.bmc.arsys.rx.approval')).toBeTruthy('Approval Application is not present');
        expect(await createKnowledgeSetPo.isApplicationAvaialableForAssociation('com.bmc.arsys.rx.assignment')).toBeTruthy('Assignment Application is not present');
        expect(await createKnowledgeSetPo.isApplicationAvaialableForAssociation('com.bmc.dsm.case-lib')).toBeTruthy('Case Management Application is not present');
        await createKnowledgeSetPo.checkApplicationCheckboxes(['com.bmc.arsys.rx.approval', 'com.bmc.arsys.rx.assignment', 'com.bmc.dsm.case-lib']);
        await createKnowledgeSetPo.clickSelectBtn();
        await createKnowledgeSetPo.clickSaveBtn();
        await utilCommon.closeBladeOnSettings();
        expect(await utilGrid.isGridRecordPresent('DRDMV-1062' + randomStr)).toBeTruthy('Record is not Present');
        await utilGrid.searchAndOpenHyperlink('DRDMV-1062' + randomStr);
        expect(await editKnowledgeSet.isApplicationNameListed('com.bmc.arsys.rx.approval')).toBeTruthy('Approval Application is not present');
        expect(await editKnowledgeSet.isApplicationNameListed('com.bmc.arsys.rx.assignment')).toBeTruthy('Assignment Application is not present');
        expect(await editKnowledgeSet.isApplicationNameListed('com.bmc.dsm.case-lib')).toBeTruthy('Case Management Application is not present');
        await utilCommon.closeBladeOnSettings();
        await consoleKnowledgeSetPo.clickOnAddKnowledgeSetBtn();
        await createKnowledgeSetPo.setKnowledgeSetName('DRDMV-1062_1' + randomStr);
        await createKnowledgeSetPo.setCompanyValue('Petramco');
        await createKnowledgeSetPo.setDescriptionValue('Sample Description1' + randomStr);
        await createKnowledgeSetPo.clickAssociateBtn();
        await createKnowledgeSetPo.checkApplicationCheckboxes(['com.bmc.dsm.bwfa']);
        await createKnowledgeSetPo.clickSelectBtn();
        await createKnowledgeSetPo.clickSaveBtn();
        await utilCommon.closeBladeOnSettings();
        expect(await utilGrid.isGridRecordPresent('DRDMV-1062_1' + randomStr)).toBeTruthy('Record is not Present');
    });
});
