import { browser } from "protractor";
import loginPage from "../../pageobject/common/login.po";
import navigationPage from "../../pageobject/common/navigation.po";
import createDocumentLibraryPo from '../../pageobject/settings/document-management/create-document-library.po';
import utilCommon from '../../utils/util.common';
import documentLibraryConsolePo from '../../pageobject/settings/document-management/document-library-console.po';
import editDocumentLibraryPo from '../../pageobject/settings/document-management/edit-document-library.po';

describe('Menu Item', () => {
    beforeAll(async () => {
        await browser.get('/innovationsuite/index.html#/com.bmc.dsm.bwfa');
        await loginPage.login('qkatawazi');
    });

    afterAll(async () => {
        await navigationPage.signOut();
    });

    afterEach(async () => {
        await browser.refresh();
        await utilCommon.waitUntilSpinnerToHide();
    });

    //kgaikwad
    it('DRDMV-13039: Verify document can be Deleted', async () => {
        let titleRandVal = [...Array(10)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        await navigationPage.gotoSettingsPage();
        expect(await navigationPage.gotoSettingsMenuItem('Document Management--Library', 'Document Library Console - Business Workflows'));
        await utilCommon.waitUntilSpinnerToHide();
        await createDocumentLibraryPo.openAddNewDocumentBlade();
        await createDocumentLibraryPo.addAttachment();
        await createDocumentLibraryPo.setTitle(titleRandVal);
        await createDocumentLibraryPo.selectCompany('Petramco');
        await createDocumentLibraryPo.selectOwnerGroup('Compensation and Benefits');
        await createDocumentLibraryPo.clickOnSaveButton();
        
        await documentLibraryConsolePo.searchAndEditDocumentLibrary(titleRandVal);
        await editDocumentLibraryPo.selectStatus('Published');
        await editDocumentLibraryPo.clickOnsaveButton();
        await utilCommon.waitUntilPopUpDisappear();
        await documentLibraryConsolePo.searchAndEditDocumentLibrary(titleRandVal);
        expect(await editDocumentLibraryPo.isDeleteButtonEnabled()).toBeFalsy('Delete buttton is not enabled');
        await editDocumentLibraryPo.selectStatus('Draft');
        await editDocumentLibraryPo.clickOnsaveButton();
        await utilCommon.waitUntilPopUpDisappear();
        await documentLibraryConsolePo.searchAndEditDocumentLibrary(titleRandVal);
        expect(await editDocumentLibraryPo.isDeleteButtonEnabled()).toBeTruthy('Delete buttton is not enabled');
        await editDocumentLibraryPo.clickOnDeleteButton();
        expect(await editDocumentLibraryPo.getTextWarningPopUpMessageForDeleteDocuement('Are you sure you want to delete the document?')).toBe('Are you sure you want to delete the document?'),'Warning Message of Delete button is missing';
        await editDocumentLibraryPo.clickOnYesButtonOfWarningPopUpMessageForDeleteDocument();
        expect (await utilCommon.getPopUpMessage()).toBe('Document deleted successfully.');
        await utilCommon.waitUntilPopUpDisappear();
        expect (await documentLibraryConsolePo.isGridRecordPresent()).toBeFalsy('Grid Record displayed which should not be');
    })
})