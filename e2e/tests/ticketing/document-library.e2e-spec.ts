import { browser } from "protractor";
import loginPage from "../../pageobject/common/login.po";
import navigationPage from "../../pageobject/common/navigation.po";
import createDocumentLibraryPo from '../../pageobject/settings/document-management/create-document-library.po';
import documentLibraryConsolePo from '../../pageobject/settings/document-management/document-library-console.po';
import editDocumentLibraryPo from '../../pageobject/settings/document-management/edit-document-library.po';
import utilCommon from '../../utils/util.common';

describe('Document Library', () => {
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
        let filePath = '../../../data/ui/attachment/demo.txt';
        let titleRandVal = [...Array(10)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        await navigationPage.gotoSettingsPage();
        await navigationPage.gotoSettingsMenuItem('Document Management--Library', 'Document Library Console - Business Workflows');
        await utilCommon.waitUntilSpinnerToHide();
        await createDocumentLibraryPo.openAddNewDocumentBlade();
        await createDocumentLibraryPo.addAttachment(filePath);
        await createDocumentLibraryPo.setTitle(titleRandVal);
        await createDocumentLibraryPo.selectCompany('Petramco');
        await createDocumentLibraryPo.selectOwnerGroup('Compensation and Benefits');
        await createDocumentLibraryPo.clickOnSaveButton();
        await utilCommon.waitUntilPopUpDisappear();
        await documentLibraryConsolePo.searchAndOpenDocumentLibrary(titleRandVal);
        await editDocumentLibraryPo.selectStatus('Published');
        await editDocumentLibraryPo.clickOnSaveButton();
        await utilCommon.waitUntilPopUpDisappear();
        await documentLibraryConsolePo.searchAndOpenDocumentLibrary(titleRandVal);
        expect(await editDocumentLibraryPo.isDeleteButtonEnabled()).toBeFalsy('Delete buttton is not enabled');
        await editDocumentLibraryPo.selectStatus('Draft');
        await editDocumentLibraryPo.clickOnSaveButton();
        await utilCommon.waitUntilPopUpDisappear();
        await documentLibraryConsolePo.searchAndOpenDocumentLibrary(titleRandVal);
        expect(await editDocumentLibraryPo.isDeleteButtonEnabled()).toBeTruthy('Delete buttton is not enabled');
        await editDocumentLibraryPo.clickOnDeleteButton();
        expect(await editDocumentLibraryPo.getDeleteWarningMsgText('Are you sure you want to delete the document?')).toBe('Are you sure you want to delete the document?'), 'Warning Message of Delete button is missing';
        await editDocumentLibraryPo.clickOnYesButtonOfDeleteWarningMsg();
        expect(await utilCommon.getPopUpMessage()).toBe('Document deleted successfully.');
        await utilCommon.waitUntilPopUpDisappear();
        expect(await documentLibraryConsolePo.isGridRecordPresent(titleRandVal)).toBeFalsy('Grid Record displayed which should not be');
    }, 120 * 1000)

    //kgaikwad
    it('DRDMV-13045: Verify Delete button on document', async () => {
        let filePath = '../../../data/ui/attachment/demo.txt';
        let titleRandVal = [...Array(10)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        await navigationPage.gotoSettingsPage();
        await navigationPage.gotoSettingsMenuItem('Document Management--Library', 'Document Library Console - Business Workflows');
        await utilCommon.waitUntilSpinnerToHide();
        await createDocumentLibraryPo.openAddNewDocumentBlade();
        await createDocumentLibraryPo.addAttachment(filePath);
        await createDocumentLibraryPo.setTitle(titleRandVal);
        await createDocumentLibraryPo.selectCompany('Petramco');
        await createDocumentLibraryPo.selectOwnerGroup('Compensation and Benefits');
        await createDocumentLibraryPo.clickOnSaveButton();
        await utilCommon.waitUntilPopUpDisappear();
        await documentLibraryConsolePo.searchOnGridConsole(titleRandVal);
        expect(await documentLibraryConsolePo.getSelectedGridRecordValue('Status')).toBe('Draft'), 'status is not in draft status';
        await documentLibraryConsolePo.searchAndOpenDocumentLibrary(titleRandVal);
        expect(await editDocumentLibraryPo.isDeleteButtonEnabled).toBeTruthy('Delete Button is not enabled');
        await editDocumentLibraryPo.selectStatus('Published');
        await editDocumentLibraryPo.clickOnSaveButton();
        await utilCommon.waitUntilPopUpDisappear();
        await documentLibraryConsolePo.searchOnGridConsole(titleRandVal);
        expect(await documentLibraryConsolePo.getSelectedGridRecordValue('Status')).toBe('Published'), 'status is not in Published status';
        await documentLibraryConsolePo.searchAndOpenDocumentLibrary(titleRandVal);
        expect(await editDocumentLibraryPo.isDeleteButtonEnabled()).toBeFalsy('Delete buttton is enabled');
    })

    //kgaikwad
    it('DRDMV-13074: Verify Document Managment Grid Console', async () => {
        await navigationPage.gotoSettingsPage();
        await navigationPage.gotoSettingsMenuItem('Document Management--Library', 'Document Library Console - Business Workflows');
        await utilCommon.waitUntilSpinnerToHide();
        let columns1: string[] = ["Title", "Status", "Owner Group", "Company", "Last Modified"];
        expect(await documentLibraryConsolePo.areGridColumnHeaderMatches(columns1)).toBeTruthy('column headers does not match');
        let columns2: string[] = ["Author", "Category Tier 1", "Category Tier 2", "Category Tier 3", "GUID", "Region"];
        await documentLibraryConsolePo.addColumnOnGrid(columns2);
        expect(await documentLibraryConsolePo.areGridColumnHeaderMatches(columns2)).toBeTruthy('column headers does not match');
        await documentLibraryConsolePo.removeColumnOnGrid(columns2);
    })

    it('DRDMV-13075 And DRDMV-13038 : Verify document can be publish And Verify Search on Document Managment Console ', async () => {
        let filePath = '../../../data/ui/attachment/demo.txt';
        let titleRandVal = [...Array(10)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        await navigationPage.gotoSettingsPage();
        await navigationPage.gotoSettingsMenuItem('Document Management--Library', 'Document Library Console - Business Workflows');
        await utilCommon.waitUntilSpinnerToHide();
        await createDocumentLibraryPo.openAddNewDocumentBlade();
        await createDocumentLibraryPo.addAttachment(filePath);
        await createDocumentLibraryPo.setTitle(titleRandVal);
        await createDocumentLibraryPo.selectCompany('Petramco');
        await createDocumentLibraryPo.selectOwnerGroup('Compensation and Benefits');
        await createDocumentLibraryPo.clickOnSaveButton();
        await utilCommon.waitUntilPopUpDisappear();
        await documentLibraryConsolePo.searchOnGridConsole(titleRandVal);
        expect(await documentLibraryConsolePo.getSelectedGridRecordValue('Title')).toBe(titleRandVal), 'Title is missing';
        expect(await documentLibraryConsolePo.getSelectedGridRecordValue('Status')).toBe('Draft'), 'Draft Status is missing';
        expect(await documentLibraryConsolePo.getSelectedGridRecordValue('Owner Group')).toBe('Compensation and Benefits'), 'Owner Group is missing';
        expect(await documentLibraryConsolePo.getSelectedGridRecordValue('Company')).toBe('Petramco'), 'Company is missing';
        await documentLibraryConsolePo.searchAndOpenDocumentLibrary(titleRandVal);
        await editDocumentLibraryPo.selectStatus('Published');
        await editDocumentLibraryPo.clickOnSaveButton();
        await utilCommon.waitUntilPopUpDisappear();
        await documentLibraryConsolePo.searchOnGridConsole(titleRandVal);
        expect(await documentLibraryConsolePo.getSelectedGridRecordValue('Title')).toBe(titleRandVal), 'Title is missing';
        expect(await documentLibraryConsolePo.getSelectedGridRecordValue('Status')).toBe('Published'), 'Published Status is missing';
        await documentLibraryConsolePo.searchAndOpenDocumentLibrary(titleRandVal);
        expect(await editDocumentLibraryPo.isAttachmentFieldDisabled()).toBeTruthy('Attachment field is enabled');
        expect(await editDocumentLibraryPo.isTitleTextBoxDisabled()).toBeTruthy('TitleTextBox field is enabled');
        expect(await editDocumentLibraryPo.isCompanyDropDownDisabled()).toBeTruthy('Company Drop Down field is enabled');
        expect(await editDocumentLibraryPo.isBussinessUnitDropDownDisabled()).toBeTruthy('Bussiness Unit Drop Down field is enabled');
        expect(await editDocumentLibraryPo.isDepartmentDropDownDisabled()).toBeTruthy('Department Drop Down field is enabled');
        expect(await editDocumentLibraryPo.isOwnerGroupDropDownDisabled()).toBeTruthy('OwnerGroup Drop Down field is enabled');
        expect(await editDocumentLibraryPo.isShareExternallyToogleButtonDisabled()).toBeTruthy('Share Externally Toogle Button field is enabled');
        expect(await editDocumentLibraryPo.isStatusDropDownDisabled()).toBeFalsy('Status Drop Down field is disabled');
        expect(await editDocumentLibraryPo.isKeywordsFieldDisabled()).toBeTruthy('Keywords Field field is enabled');
        expect(await editDocumentLibraryPo.isCategoryTire1Disabled()).toBeTruthy('Category Tire1 field is enabled');
        expect(await editDocumentLibraryPo.isCategoryTire2Disabled()).toBeTruthy('Category Tire2 field is enabled');
        expect(await editDocumentLibraryPo.isCategoryTire3Disabled()).toBeTruthy('Category Tire3 field is enabled');
        expect(await editDocumentLibraryPo.isCategoryTire4Disabled()).toBeTruthy('Category Tire4 field is enabled');
        expect(await editDocumentLibraryPo.isRegionDropDownDisabled()).toBeTruthy('Region Drop Down field is enabled');
        expect(await editDocumentLibraryPo.isSiteDropDownDisabled()).toBeTruthy('Site Drop Down field is enabled');
        await editDocumentLibraryPo.clickOnAdditionalDetailsOrReadAccessTab('Read Access');
        expect(await editDocumentLibraryPo.isSupportGroupAccessGroupButtonDisabled()).toBeTruthy('Support Group Access Group Button is enabled');
        expect(await editDocumentLibraryPo.isAddCompanyDropDownDisabled()).toBeTruthy('Add Compnay Drop Down is enabled');
        expect(await editDocumentLibraryPo.isAddCompanyAddButtonDisabled()).toBeTruthy('Add Company Add Button is enabled');
        expect(await editDocumentLibraryPo.isAddBussinessUnitDropDownDisabled()).toBeTruthy('Add Bussiness Unit Drop Down is enabled');
        expect(await editDocumentLibraryPo.isAddBussinessUnitAddButtonDisabled()).toBeTruthy('Add Bussiness Unit Add Button is enabled');
        expect(await editDocumentLibraryPo.isAddSupportDepartmentDropDownDisabled()).toBeTruthy('Add Support Department Drop Down is enabled');
        expect(await editDocumentLibraryPo.isAddSupportDepartmentAddButtonDisabled()).toBeTruthy('Add Support Department Add Button button is enabled');
        expect(await editDocumentLibraryPo.isaddSupportGroupDropDownDisabled()).toBeTruthy('add Support Group Drop Down field is enabled');
        expect(await editDocumentLibraryPo.isAddSupportDepartmentAddButtonDisabled()).toBeTruthy('Add Support Department Add Button is enabled');
        expect(await editDocumentLibraryPo.isDeleteButtonEnabled()).toBeFalsy('Delete button is enabled');
        expect(await editDocumentLibraryPo.isSaveButtonEnabled()).toBeFalsy('save button is enabled');
    },120*1000)
})
