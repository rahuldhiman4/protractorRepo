import { browser } from "protractor";
import apiCoreUtil from '../../api/api.core.util';
import apiHelper from '../../api/api.helper';
import quickCasePo from '../../pageobject/case/quick-case.po';
import loginPage from "../../pageobject/common/login.po";
import navigationPage from "../../pageobject/common/navigation.po";
import resources from '../../pageobject/common/resources-tab.po';
import createKnowlegePo from '../../pageobject/knowledge/create-knowlege.po';
import editKnowledgeMetaDataPo from '../../pageobject/knowledge/edit-knowledge.po';
import consoleKnowledgePo from '../../pageobject/knowledge/knowledge-articles-console.po';
import previewKnowledgePo from '../../pageobject/knowledge/preview-knowledge.po';
import viewKnowledgeArticlePo from '../../pageobject/knowledge/view-knowledge-article.po';
import createDocumentLibraryPo from '../../pageobject/settings/document-management/create-document-library.po';
import documentLibraryConsolePo from '../../pageobject/settings/document-management/document-library-console.po';
import editDocumentLibraryPo from '../../pageobject/settings/document-management/edit-document-library.po';
import { BWF_BASE_URL, BWF_PAGE_TITLES } from '../../utils/constants';
import utilityCommon from '../../utils/utility.common';
import utilityGrid from '../../utils/utility.grid';

describe('Document Library', () => {
    
    beforeAll(async () => {
        await browser.get(BWF_BASE_URL);
        await loginPage.login('qkatawazi');
    });

    afterAll(async () => {
        await utilityCommon.closeAllBlades();
        await navigationPage.signOut();
    });

    //kgaikwad
    describe('[4917,4894]: Verify document can be Deleted And Verify OOB document manager role is added to BA', async () => {
        let filePath = '../../../data/ui/attachment/demo.txt';
        let titleRandVal = [...Array(10)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        it('[4917,4894]: Verify document can be Deleted And Verify OOB document manager role is added to BA', async () => {
        await navigationPage.gotoSettingsPage();
        await navigationPage.gotoSettingsMenuItem('Document Management--Library', BWF_PAGE_TITLES.DOCUMENT_MANAGEMENT.LIBRARY);
        await createDocumentLibraryPo.openAddNewDocumentBlade();
        await createDocumentLibraryPo.addAttachment(filePath);
        await createDocumentLibraryPo.setTitle(titleRandVal);
        await createDocumentLibraryPo.selectCompany('Petramco');
        await createDocumentLibraryPo.selectBusinessUnit('United States Support');
        await createDocumentLibraryPo.selectOwnerGroup('US Support 3');
        await createDocumentLibraryPo.clickOnSaveButton();
        await utilityCommon.closePopUpMessage();
        await documentLibraryConsolePo.searchAndOpenDocumentLibrary(titleRandVal);
        await editDocumentLibraryPo.selectStatus('Published');
        await editDocumentLibraryPo.clickOnSaveButton();
        await utilityCommon.closePopUpMessage();
    });
        it('[4917,4894]: Verify document can be Deleted And Verify OOB document manager role is added to BA', async () => {
        await documentLibraryConsolePo.searchAndOpenDocumentLibrary(titleRandVal);
        expect(await editDocumentLibraryPo.isDeleteButtonEnabled()).toBeFalsy('Delete buttton is not enabled');
        await editDocumentLibraryPo.selectStatus('Draft');
        await editDocumentLibraryPo.clickOnSaveButton();
        await utilityCommon.closePopUpMessage();
        await utilityGrid.clearFilter();
        await documentLibraryConsolePo.searchAndOpenDocumentLibrary(titleRandVal);
        expect(await editDocumentLibraryPo.isDeleteButtonEnabled()).toBeTruthy('Delete buttton is not enabled');
        await editDocumentLibraryPo.clickOnDeleteButton();
        expect(await editDocumentLibraryPo.getDeleteWarningMsgText('Are you sure you want to delete the document?')).toBe('Are you sure you want to delete the document?'), 'Warning Message of Delete button is missing';
        await editDocumentLibraryPo.clickOnYesButtonOfDeleteWarningMsg();
        expect(await utilityCommon.isPopUpMessagePresent('Document deleted successfully.')).toBeTruthy('Document deleted message not valid');
        await utilityCommon.closePopUpMessage();
        expect(await documentLibraryConsolePo.isGridRecordPresent(titleRandVal)).toBeFalsy('Grid Record displayed which should not be');
    });
});

    //kgaikwad
    describe('[4911,4925,4924]: Verify Delete button on document', async () => {
        let filePath = '../../../data/ui/attachment/demo.txt';
        let titleRandVal = [...Array(10)].map(i => (~~(Math.random() * 36)).toString(36)).join('');

        it('[4911,4925,4924]: Verify Delete button on document', async () => {
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Document Management--Library', BWF_PAGE_TITLES.DOCUMENT_MANAGEMENT.LIBRARY);
            await createDocumentLibraryPo.openAddNewDocumentBlade();
            await createDocumentLibraryPo.addAttachment(filePath);
            await createDocumentLibraryPo.setTitle(titleRandVal);
            await createDocumentLibraryPo.selectCompany('Petramco');
            await createDocumentLibraryPo.selectBusinessUnit('United States Support');
            await createDocumentLibraryPo.selectOwnerGroup('US Support 3');
            await createDocumentLibraryPo.clickOnSaveButton();
            await utilityCommon.closePopUpMessage();
            await documentLibraryConsolePo.searchOnGridConsole(titleRandVal);
            expect(await documentLibraryConsolePo.getSelectedGridRecordValue('Status')).toBe('Draft'), 'status is not in draft status';
            await documentLibraryConsolePo.searchAndOpenDocumentLibrary(titleRandVal);
            expect(await editDocumentLibraryPo.isDeleteButtonEnabled).toBeTruthy('Delete Button is not enabled');
            await editDocumentLibraryPo.selectStatus('Published');
            await editDocumentLibraryPo.clickOnSaveButton();
            await utilityCommon.closePopUpMessage();
            await documentLibraryConsolePo.searchOnGridConsole(titleRandVal);
            expect(await documentLibraryConsolePo.getSelectedGridRecordValue('Status')).toBe('Published'), 'status is not in Published status';
            await documentLibraryConsolePo.searchAndOpenDocumentLibrary(titleRandVal);
            expect(await editDocumentLibraryPo.isDeleteButtonEnabled()).toBeFalsy('Delete buttton is enabled');
        });

        it('[4911,4925,4924]: Verify if document library is accessible to same LOB Case Manager', async () => {
            await apiHelper.apiLogin('tadmin');
            await apiHelper.updateFoundationEntity('Person', 'qdu', { functionalRole: "Document Manager" });
            await navigationPage.signOut();
            await loginPage.login('qdu');
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Document Management--Library', BWF_PAGE_TITLES.DOCUMENT_MANAGEMENT.LIBRARY);
            expect(await utilityGrid.isGridRecordPresent(titleRandVal)).toBeTruthy('Human Resources LOB document library is not visible to same LOB case manager');
        });

        it('[4911,4925,4924]: Verify if document library is accessible to different LOB Case BA', async () => {
            await navigationPage.signOut();
            await loginPage.login('fritz');
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Document Management--Library', BWF_PAGE_TITLES.DOCUMENT_MANAGEMENT.LIBRARY);
            expect(await utilityGrid.isGridRecordPresent(titleRandVal)).toBeFalsy('Human Resources LOB case document library is not visible to different LOB case BA');
        });

        it('[4911,4925,4924]: Verify if document library is accessible to different LOB Case Manager', async () => {
            await apiHelper.apiLogin('tadmin');
            await apiHelper.updateFoundationEntity('Person', 'Frieda', { functionalRole: "Document Manager" });
            await navigationPage.signOut();
            await loginPage.login('frieda');
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Document Management--Library', BWF_PAGE_TITLES.DOCUMENT_MANAGEMENT.LIBRARY);
            expect(await utilityGrid.isGridRecordPresent(titleRandVal)).toBeFalsy('Human Resources LOB document library is not visible to different LOB case manager');
        });

        it('[4911,4925,4924]: Verify if document library is accessible to Case BA belonging to different company with same LOB', async () => {
            await navigationPage.signOut();
            await loginPage.login('gwixillian');
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Document Management--Library', BWF_PAGE_TITLES.DOCUMENT_MANAGEMENT.LIBRARY);
            expect(await utilityGrid.isGridRecordPresent(titleRandVal)).toBeTruthy('Human Resources LOB document library is not visible to same LOB with different case BA');
        });

        it('[4911,4925,4924]: Verify if document library is accessible to Case Manager user having access to multiple LOB', async () => {
            await navigationPage.signOut();
            await loginPage.login('qyuan');
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Document Management--Library', BWF_PAGE_TITLES.DOCUMENT_MANAGEMENT.LIBRARY);
            await utilityGrid.selectLineOfBusiness('Human Resource');
            expect(await utilityGrid.isGridRecordPresent(titleRandVal)).toBeTruthy('Human Resources LOB document library is not visible to case manager with multiple LOB access');
            await utilityGrid.selectLineOfBusiness('Facilities');
            expect(await utilityGrid.isGridRecordPresent(titleRandVal)).toBeFalsy('Human Resources LOB document library is visible to case manager with multiple LOB access');

        });

        it('[4911,4925,4924]: Verify if document library is accessible to Case BA user having access to multiple LOB', async () => {
            await navigationPage.signOut();
            await loginPage.login('jbarnes');
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Document Management--Library', BWF_PAGE_TITLES.DOCUMENT_MANAGEMENT.LIBRARY);
            await utilityGrid.selectLineOfBusiness('Facilities');
            expect(await utilityGrid.isGridRecordPresent(titleRandVal)).toBeFalsy('Human Resources LOB document library is visible to case BA with multiple LOB access');

            await utilityGrid.selectLineOfBusiness('Human Resource');
            expect(await utilityGrid.isGridRecordPresent(titleRandVal)).toBeTruthy('Human Resources LOB document libraryssssss is not visible to case BA with multiple LOB access');
            await documentLibraryConsolePo.searchAndOpenDocumentLibrary(titleRandVal);
            await editDocumentLibraryPo.selectStatus('Draft');
            await editDocumentLibraryPo.clickOnSaveButton();
            expect(await utilityCommon.isPopUpMessagePresent('Saved successfully.')).toBeTruthy('Record saved successfully confirmation message not displayed.');
           
        });
    });

    //kgaikwad
    it('[4893]: Verify Document Managment Grid Console', async () => {
        await navigationPage.gotoSettingsPage();
        await navigationPage.gotoSettingsMenuItem('Document Management--Library', BWF_PAGE_TITLES.DOCUMENT_MANAGEMENT.LIBRARY);
        let columns1: string[] = ["Title", "Status", "Owner Group", "Company", "Last Modified"];
        expect(await documentLibraryConsolePo.areGridColumnHeaderMatches(columns1)).toBeTruthy('column headers does not match 1');
        let columns2: string[] = ["Author", "Category Tier 1", "Category Tier 2", "Category Tier 3", "GUID", "Region"];
        let columns3: string[] = ["Title", "Status", "Owner Group", "Company", "Last Modified", "Author", "Category Tier 1", "Category Tier 2", "Category Tier 3", "GUID", "Region"];
        await documentLibraryConsolePo.addColumnOnGrid(columns2);
        expect(await documentLibraryConsolePo.areGridColumnHeaderMatches(columns3)).toBeTruthy('column headers does not match 2');
        await documentLibraryConsolePo.removeColumnOnGrid(columns2);
        expect(await documentLibraryConsolePo.areGridColumnHeaderMatches(columns1)).toBeTruthy('column headers does not match 3');
    });

    //kgaikwad
    describe('[4892,4918]: Verify document can be publish And Verify Search on Document Managment Console ', async () => {
        let filePath = '../../../data/ui/attachment/demo.txt';
        let titleRandVal = [...Array(10)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        it('[4892,4918]: Verify document can be publish And Verify Search on Document Managment Console ', async () => {
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Document Management--Library', BWF_PAGE_TITLES.DOCUMENT_MANAGEMENT.LIBRARY);
            await createDocumentLibraryPo.openAddNewDocumentBlade();
            await createDocumentLibraryPo.addAttachment(filePath);
            await createDocumentLibraryPo.setTitle(titleRandVal);
            await createDocumentLibraryPo.selectCompany('Petramco');
            await createDocumentLibraryPo.selectBusinessUnit('HR Support');
            await createDocumentLibraryPo.selectOwnerGroup('Compensation and Benefits');
            await createDocumentLibraryPo.clickOnSaveButton();
            await utilityCommon.closePopUpMessage();
            await documentLibraryConsolePo.searchOnGridConsole(titleRandVal);
            expect(await documentLibraryConsolePo.getSelectedGridRecordValue('Title')).toBe(titleRandVal), 'Title is missing';
            expect(await documentLibraryConsolePo.getSelectedGridRecordValue('Status')).toBe('Draft'), 'Draft Status is missing';
            expect(await documentLibraryConsolePo.getSelectedGridRecordValue('Owner Group')).toBe('Compensation and Benefits'), 'Owner Group is missing';
            expect(await documentLibraryConsolePo.getSelectedGridRecordValue('Company')).toBe('Petramco'), 'Company is missing';
            await documentLibraryConsolePo.searchAndOpenDocumentLibrary(titleRandVal);
            await editDocumentLibraryPo.selectStatus('Published');
            await editDocumentLibraryPo.clickOnSaveButton();
            await utilityCommon.closePopUpMessage();
        });
        it('[4892,4918]: Verify document can be publish And Verify Search on Document Managment Console ', async () => {
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
            expect(await editDocumentLibraryPo.isKeywordsFieldEnabled()).toBeFalsy('Keywords Field field is enabled');
            expect(await editDocumentLibraryPo.isCategoryTier1Disabled()).toBeTruthy('Category Tire1 field is enabled');
            expect(await editDocumentLibraryPo.isCategoryTier2Disabled()).toBeTruthy('Category Tire2 field is enabled');
            expect(await editDocumentLibraryPo.isCategoryTier3Disabled()).toBeTruthy('Category Tire3 field is enabled');
            expect(await editDocumentLibraryPo.isCategoryTier4Disabled()).toBeTruthy('Category Tire4 field is enabled');
            expect(await editDocumentLibraryPo.isRegionDropDownDisabled()).toBeTruthy('Region Drop Down field is enabled');
            expect(await editDocumentLibraryPo.isSiteDropDownDisabled()).toBeTruthy('Site Drop Down field is enabled');
            await editDocumentLibraryPo.clickOnAdditionalDetailsOrReadAccessTab('Read Access');
            expect(await editDocumentLibraryPo.isSupportGroupAccessButtonDisplayed()).toBeFalsy('Support Group Access Group Button is enabled');
            expect(await editDocumentLibraryPo.isAddCompanyDropDownDisabled()).toBeTruthy('Add Compnay Drop Down is enabled');
            expect(await editDocumentLibraryPo.isAddCompanyAddButtonDisabled()).toBeTruthy('Add Company Add Button is enabled');
            expect(await editDocumentLibraryPo.isAddBussinessUnitDropDownDisabled()).toBeTruthy('Add Bussiness Unit Drop Down is enabled');
            expect(await editDocumentLibraryPo.isAddBussinessUnitAddButtonDisabled()).toBeTruthy('Add Bussiness Unit Add Button is enabled');
            expect(await editDocumentLibraryPo.isAddSupportDepartmentDropDownDisabled()).toBeTruthy('Add Support Department Drop Down is enabled');
            expect(await editDocumentLibraryPo.isAddSupportDepartmentAddButtonDisabled()).toBeTruthy('Add Support Department Add Button button is enabled');
            expect(await editDocumentLibraryPo.isaddSupportGroupDropDownDisabled()).toBeTruthy('add Support Group Drop Down field is enabled');
            expect(await editDocumentLibraryPo.isAddSupportDepartmentAddButtonDisabled()).toBeTruthy('Add Support Department Add Button is enabled');
            expect(await editDocumentLibraryPo.isDeleteButtonEnabled()).toBeFalsy('Delete button is enabled');
            expect(await editDocumentLibraryPo.isSaveButtonEnabled()).toBeFalsy('save button is enabled');  //defect https://jira.bmc.com/browse/DRDMV-21604
        });
    });

    //kgaikwad
    it('[4921]: Verify edit document UI', async () => {
        let filePath = '../../../data/ui/attachment/demo.txt';
        let titleRandVal = [...Array(10)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        await navigationPage.gotoSettingsPage();
        await navigationPage.gotoSettingsMenuItem('Document Management--Library', BWF_PAGE_TITLES.DOCUMENT_MANAGEMENT.LIBRARY);
        await createDocumentLibraryPo.openAddNewDocumentBlade();
        await createDocumentLibraryPo.addAttachment(filePath);
        await createDocumentLibraryPo.setTitle(titleRandVal);
        await createDocumentLibraryPo.selectCompany('Petramco');
        await createDocumentLibraryPo.selectBusinessUnit('HR Support');
        await createDocumentLibraryPo.selectOwnerGroup('Compensation and Benefits');
        await createDocumentLibraryPo.clickOnSaveButton();
        await utilityCommon.closePopUpMessage();
        await documentLibraryConsolePo.searchAndOpenDocumentLibrary(titleRandVal);
        expect(await editDocumentLibraryPo.isDeleteButtonDisplayed()).toBeTruthy('Delete button is not displayed');
        expect(await editDocumentLibraryPo.isSaveButtonDisplayed()).toBeTruthy('Save button is not displayed');
        expect(await editDocumentLibraryPo.isCancelButtonDisplayed()).toBeTruthy('Cancel button is not displayed');

        expect(await editDocumentLibraryPo.isAttachmentFieldDisplayed()).toBeTruthy('Attachment Field is not displayed');
        expect(await editDocumentLibraryPo.isAttachedItemDisplayed()).toBeTruthy('Attached Item is not displayed');
        expect(await editDocumentLibraryPo.isTitleTextBoxDisplayed()).toBeTruthy('Title Text Box is not displayed');
        expect(await editDocumentLibraryPo.isCompanyDropDownDisplayed()).toBeTruthy('Company Drop Down is not displayed');
        expect(await editDocumentLibraryPo.isBussinessUnitDropDownDisplayed()).toBeTruthy('Bussiness Unit Drop Down is not displayed');
        expect(await editDocumentLibraryPo.isDepartmentDropDownDisplayed()).toBeTruthy('Department Drop Down is not displayed');
        expect(await editDocumentLibraryPo.isOwnerGroupDropDownDisplayed()).toBeTruthy('Owner Group Drop Down is not displayed');
        expect(await editDocumentLibraryPo.isStatusDropDownDisplayed()).toBeTruthy('Status Drop Down is not displayed');
        expect(await editDocumentLibraryPo.isShareExternallyToogleButtonDisplayed()).toBeTruthy('Share Externally Toggle Button is not displayed');
        expect(await editDocumentLibraryPo.isKeywordsFieldDisplayed()).toBeTruthy('Keywords Field is not displayed');

        expect(await editDocumentLibraryPo.isCategoryTier1Displayed()).toBeTruthy('CategoryTier1 Drop Down is not displayed');
        expect(await editDocumentLibraryPo.isCategoryTier2Displayed()).toBeTruthy('CategoryTier2 Drop Down is not displayed');
        expect(await editDocumentLibraryPo.isCategoryTier3Displayed()).toBeTruthy('CategoryTier3 Drop Down is not displayed');
        expect(await editDocumentLibraryPo.isCategoryTier4Displayed()).toBeTruthy('CategoryTier4 Drop Down is not displayed');
        expect(await editDocumentLibraryPo.isRegionDropDownDisplayed()).toBeTruthy('Region Drop Down is not displayed');
        expect(await editDocumentLibraryPo.isSiteDropDownDisplayed()).toBeTruthy('Site Drop Down is not displayed');

        await editDocumentLibraryPo.clickOnAdditionalDetailsOrReadAccessTab('Read Access');
        await editDocumentLibraryPo.clickOnSupportGroupAccessButton();
        expect(await editDocumentLibraryPo.isSupportGroupAccessButtonDisplayed()).toBeTruthy('Support Group Access Group Button is not displayed');
        expect(await editDocumentLibraryPo.isAddCompanyDropDownDisplayed()).toBeTruthy('Add Company Drop Down is not displayed');
        expect(await editDocumentLibraryPo.isAddCompanyAddButtonDisplayed()).toBeTruthy('Add Company Add Button is not displayed');
        expect(await editDocumentLibraryPo.isAddBussinessUnitDropDownDisplayed()).toBeTruthy('Add Bussiness Unit Drop Down is not displayed');
        expect(await editDocumentLibraryPo.isAddBussinessUnitAddButtonDisplayed()).toBeTruthy('Add Bussiness Unit Add Button is not displayed');
        expect(await editDocumentLibraryPo.isAddSupportDepartmentDropDownDisplayed()).toBeTruthy('Add Support Department Drop Down is not displayed');
        expect(await editDocumentLibraryPo.isAddSupportDepartmentAddButtonDisplayed()).toBeTruthy('Add Support Department Add Button is not displayed');
        expect(await editDocumentLibraryPo.isAddSupportGroupDropDownDisplayed()).toBeTruthy('Add Support Group Drop Down is not displayed');
        expect(await editDocumentLibraryPo.isAddSupportDepartmentAddButtonDisplayed()).toBeTruthy('Add Support Department Add Button Drop Down is not displayed');
        let dropDownValues: string[] = ["Published", "Draft"];
        expect(await editDocumentLibraryPo.isStatusDropDownvalueMatches(dropDownValues)).toBeTruthy('Values of status drop down is not matches');
        await editDocumentLibraryPo.clickOnCancelButton();
        await utilityCommon.clickOnApplicationWarningYesNoButton('Yes');
        let column: string[] = ["Author"];
        await documentLibraryConsolePo.addColumnOnGrid(column);
        await documentLibraryConsolePo.searchOnGridConsole(titleRandVal);
        expect(await documentLibraryConsolePo.getSelectedGridRecordValue('Author')).toBe('caseBA MultiLOB', 'Author is not displayed');
        await documentLibraryConsolePo.removeColumnOnGrid(column);
    });

    //kgaikwad
    describe('[4884]: Verify document created will not listed in Knowledge articles grid', async () => {
        let filePath = '../../../data/ui/attachment/demo.txt';
        let titleRandVal = [...Array(10)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        it('[4884]: Verify document created will not listed in Knowledge articles grid', async () => {
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Document Management--Library', BWF_PAGE_TITLES.DOCUMENT_MANAGEMENT.LIBRARY);
            await createDocumentLibraryPo.openAddNewDocumentBlade();
            await createDocumentLibraryPo.addAttachment(filePath);
            await createDocumentLibraryPo.setTitle(titleRandVal);
            await createDocumentLibraryPo.selectCompany('Petramco');
            await createDocumentLibraryPo.selectBusinessUnit('HR Support');
            await createDocumentLibraryPo.selectOwnerGroup('Compensation and Benefits');
            await createDocumentLibraryPo.clickOnSaveButton();
            await navigationPage.gotoKnowledgeConsole();
            await utilityGrid.clearFilter();
            expect(await consoleKnowledgePo.isGridRecordPresent(titleRandVal)).toBeFalsy('Record is present on knowledge article grid');
        });
        it('[4884]: create same name record in same LOB', async () => {
            //create same name record in same LOB
            await navigationPage.signOut();
            await loginPage.login('jbarnes');
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Document Management--Library', BWF_PAGE_TITLES.DOCUMENT_MANAGEMENT.LIBRARY);
            await utilityGrid.selectLineOfBusiness('Human Resource');
            await createDocumentLibraryPo.openAddNewDocumentBlade();
            await createDocumentLibraryPo.addAttachment(filePath);
            await createDocumentLibraryPo.setTitle(titleRandVal);
            await createDocumentLibraryPo.selectCompany('Petramco');
            await createDocumentLibraryPo.selectBusinessUnit('HR Support');
            await createDocumentLibraryPo.selectOwnerGroup('Compensation and Benefits');
            await createDocumentLibraryPo.clickOnSaveButton();
            expect(await utilityCommon.isPopUpMessagePresent('Saved successfully.')).toBeTruthy("Success message absent");// there will not be error message
        });
        it('[4884]: create same name record in different LOB', async () => {
            //create same name record in different LOB
            await utilityGrid.selectLineOfBusiness('Facilities');
            await createDocumentLibraryPo.openAddNewDocumentBlade();
            await createDocumentLibraryPo.addAttachment(filePath);
            await createDocumentLibraryPo.setTitle(titleRandVal);
            await utilityCommon.isAllDropDownValuesMatches(createDocumentLibraryPo.selectors.category1, ['Applications', 'Facilities', 'Fixed Assets', 'Phones', 'Projectors', 'Purchasing Card']);
            await createDocumentLibraryPo.selectCompany('Petramco');
            await utilityCommon.isAllDropDownValuesMatches(createDocumentLibraryPo.selectors.businessUnitFieldGuid, ['Facilities', 'Facilities Support']);
            await createDocumentLibraryPo.selectCompany('Petramco');
            await createDocumentLibraryPo.selectBusinessUnit('Facilities Support');
            await utilityCommon.isAllDropDownValuesMatches(createDocumentLibraryPo.selectors.ownerGroupFieldGuid, ['Facilities', 'Pantry Service']);
            await createDocumentLibraryPo.selectBusinessUnit('Facilities Support');
            await createDocumentLibraryPo.selectOwnerGroup('Facilities');
            // verify LOB on create page
            expect(await createDocumentLibraryPo.getLobValue()).toBe("Facilities");
            await createDocumentLibraryPo.clickOnSaveButton();
            expect(await utilityCommon.isPopUpMessagePresent('Saved successfully.')).toBeTruthy("Success message absent");
            // verify LOB on edit page
            await utilityGrid.searchAndOpenHyperlink(titleRandVal);
            expect(await editDocumentLibraryPo.getLobValue()).toBe("Facilities");
            await editDocumentLibraryPo.clickOnCancelButton();
            await utilityCommon.clickOnApplicationWarningYesNoButton('Yes');
            await browser.sleep(2000); // required to see LOB dropdown, else it fails
            await utilityGrid.selectLineOfBusiness('Human Resource');
        });
        afterAll(async () => {
            await utilityCommon.closeAllBlades();
            await navigationPage.signOut();
            await loginPage.login('qkatawazi');
        });
    });

    //kgaikwad
    describe('[4915]: Verify Support Group Level Read access of Document	', async () => {
        let filePath = '../../../data/ui/attachment/demo.txt';
        let titleRandVal = [...Array(10)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        it('[4915]: Verify Support Group Level Read access of Document	', async () => {
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Document Management--Library', BWF_PAGE_TITLES.DOCUMENT_MANAGEMENT.LIBRARY);
            await createDocumentLibraryPo.openAddNewDocumentBlade();
            await createDocumentLibraryPo.addAttachment(filePath);
            await createDocumentLibraryPo.setTitle(titleRandVal);
            await createDocumentLibraryPo.selectCompany('Petramco');
            await createDocumentLibraryPo.selectBusinessUnit('United States Support');
            await createDocumentLibraryPo.selectOwnerGroup('US Support 3');
            await createDocumentLibraryPo.clickOnSaveButton();
            await utilityCommon.closePopUpMessage();
        });
        it('[4915]: Verify Support Group Level Read access of Document	', async () => {
            await documentLibraryConsolePo.searchAndOpenDocumentLibrary(titleRandVal);
            await editDocumentLibraryPo.clickOnAdditionalDetailsOrReadAccessTab('Read Access');
            await editDocumentLibraryPo.clickOnSupportGroupAccessButton();
            await editDocumentLibraryPo.selectAddBusinessUnitDropDownOfReadAccess('Australia Support');
            await editDocumentLibraryPo.selectAddSupportGroupDropDownOfReadAccess('AU Support 3');
            await editDocumentLibraryPo.clickOnReadAccessAddButton('Add Support Group');
            await editDocumentLibraryPo.clickOnSupportGroupAccessButton();
            await editDocumentLibraryPo.selectAddCompanyDropDownOfReadAccess('Petramco');
            await editDocumentLibraryPo.clickOnReadAccessAddButton('Add Company');
            await editDocumentLibraryPo.clickOnCancelButton();
        });
        it('[4915]: Verify Support Group Level Read access of Document	', async () => {
            await navigationPage.signOut();
            await loginPage.login('qliu');
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Document Management--Library', BWF_PAGE_TITLES.DOCUMENT_MANAGEMENT.LIBRARY);
            await documentLibraryConsolePo.searchOnGridConsole(titleRandVal);
            expect(await documentLibraryConsolePo.getSelectedGridRecordValue('Title')).toBe(titleRandVal), 'Title is missing';
            expect(await documentLibraryConsolePo.getSelectedGridRecordValue('Status')).toBe('Draft'), 'Published Status is missing';
            await documentLibraryConsolePo.searchAndOpenDocumentLibrary(titleRandVal);
            expect(await editDocumentLibraryPo.isAttachmentFieldDisabled()).toBeTruthy('Attachment field is enabled');
            expect(await editDocumentLibraryPo.isTitleTextBoxDisabled()).toBeTruthy('TitleTextBox field is enabled');
            expect(await editDocumentLibraryPo.isCompanyDropDownDisabled()).toBeTruthy('Company Drop Down field is enabled');
            expect(await editDocumentLibraryPo.isBussinessUnitDropDownDisabled()).toBeTruthy('Bussiness Unit Drop Down field is enabled');
            expect(await editDocumentLibraryPo.isDepartmentDropDownDisabled()).toBeTruthy('Department Drop Down field is enabled');
            expect(await editDocumentLibraryPo.isOwnerGroupDropDownDisabled()).toBeTruthy('OwnerGroup Drop Down field is enabled');
            expect(await editDocumentLibraryPo.isShareExternallyToogleButtonDisabled()).toBeTruthy('Share Externally Toogle Button field is enabled');
            expect(await editDocumentLibraryPo.isStatusDropDownDisabled()).toBeTruthy('Status Drop Down field is disabled');
            expect(await editDocumentLibraryPo.isCategoryTier1Disabled()).toBeTruthy('Category Tire1 field is enabled');
            expect(await editDocumentLibraryPo.isCategoryTier2Disabled()).toBeTruthy('Category Tire2 field is enabled');
            expect(await editDocumentLibraryPo.isCategoryTier3Disabled()).toBeTruthy('Category Tire3 field is enabled');
            expect(await editDocumentLibraryPo.isCategoryTier4Disabled()).toBeTruthy('Category Tire4 field is enabled');
            expect(await editDocumentLibraryPo.isRegionDropDownDisabled()).toBeTruthy('Region Drop Down field is enabled');
            expect(await editDocumentLibraryPo.isSiteDropDownDisabled()).toBeTruthy('Site Drop Down field is enabled');
            await editDocumentLibraryPo.updateKeywordField(titleRandVal);
            await editDocumentLibraryPo.clickOnAdditionalDetailsOrReadAccessTab('Read Access');
            expect(await editDocumentLibraryPo.isDeleteButtonEnabled()).toBeFalsy('Delete button is enabled');
            expect(await editDocumentLibraryPo.isSaveButtonEnabled()).toBeFalsy('save button is enabled');
        });
        it('[4915]: Verify Support Group Level Read access of Document	', async () => {
            await editDocumentLibraryPo.clickOnAdditionalDetailsOrReadAccessTab('Read Access');
            await editDocumentLibraryPo.closeGroupAccessTag('AU Support 3');
            expect(await editDocumentLibraryPo.isRemoveGroupAccessWarningMessageDisplayed('Are you sure you want to remove access to "AU Support 3"?')).toBeTruthy('Remove Group List Warning Message Missing');
            await editDocumentLibraryPo.clickOnRemoveGroupWarningMsgYesButton();
            expect(await utilityCommon.isPopUpMessagePresent('ERROR (222095): You do not have permission to perform this operation. Please contact your system administrator.')).toBeTruthy('Message of permission denined for group access remove not displayed');
            await editDocumentLibraryPo.clickOnSupportGroupAccessButton();
            await editDocumentLibraryPo.selectAddCompanyDropDownOfReadAccess('Google');
            await editDocumentLibraryPo.clickOnReadAccessAddButton('Add Company');
            expect(await utilityCommon.isPopUpMessagePresent('ERROR (222095): You do not have permission to perform this operation. Please contact your system administrator.')).toBeTruthy('Message of permission denined for group access remove not displayed');
            await editDocumentLibraryPo.clickOnSupportGroupAccessButton();
            await editDocumentLibraryPo.selectAddBusinessUnitDropDownOfReadAccess('Australia Support');
            await editDocumentLibraryPo.clickOnReadAccessAddButton('Add Business Unit');
            expect(await utilityCommon.isPopUpMessagePresent('ERROR (222095): You do not have permission to perform this operation. Please contact your system administrator.')).toBeTruthy('Message of permission denined for group access remove not displayed');
        });
        it('[4915]: Verify Support Group Level Read access of Document	', async () => {
            await editDocumentLibraryPo.clickOnSupportGroupAccessButton();
            await editDocumentLibraryPo.selectAddBusinessUnitDropDownOfReadAccess('UI-BusinessUnit');
            await editDocumentLibraryPo.selectAddSupportDepartmentDropDownOfReadAccess('UI-Department');
            await editDocumentLibraryPo.clickOnReadAccessAddButton('Add Support Department');
            expect(await utilityCommon.isPopUpMessagePresent('ERROR (222095): You do not have permission to perform this operation. Please contact your system administrator.')).toBeTruthy('Message of permission denined for group access remove not displayed');
            await editDocumentLibraryPo.clickOnSupportGroupAccessButton();
            await editDocumentLibraryPo.selectAddBusinessUnitDropDownOfReadAccess('HR Support');
            await editDocumentLibraryPo.selectAddSupportGroupDropDownOfReadAccess('Employee Relations');
            await editDocumentLibraryPo.clickOnReadAccessAddButton('Add Support Group');
            expect(await utilityCommon.isPopUpMessagePresent('ERROR (222095): You do not have permission to perform this operation. Please contact your system administrator.')).toBeTruthy('Message of permission denined for group access remove not displayed');
            await editDocumentLibraryPo.clickOnCancelButton();
            await utilityCommon.clickOnApplicationWarningYesNoButton('Yes');
            await documentLibraryConsolePo.searchOnGridConsole(titleRandVal)
        });
        afterAll(async () => {
            await navigationPage.signOut();
            await loginPage.login('qkatawazi');
        });
    });

    //kgaikwad
    it('[4895]: Verify error should be thrown when write access SG is added in read access', async () => {
        let filePath = '../../../data/ui/attachment/demo.txt';
        let titleRandVal = [...Array(10)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        await navigationPage.gotoSettingsPage();
        await navigationPage.gotoSettingsMenuItem('Document Management--Library', BWF_PAGE_TITLES.DOCUMENT_MANAGEMENT.LIBRARY);
        await createDocumentLibraryPo.openAddNewDocumentBlade();
        await createDocumentLibraryPo.addAttachment(filePath);
        await createDocumentLibraryPo.setTitle(titleRandVal);
        await createDocumentLibraryPo.selectCompany('Petramco');
        await createDocumentLibraryPo.selectBusinessUnit('United States Support');
        await createDocumentLibraryPo.selectOwnerGroup('US Support 3');
        await createDocumentLibraryPo.clickOnSaveButton();
        await documentLibraryConsolePo.searchOnGridConsole(titleRandVal);
        expect(await documentLibraryConsolePo.getSelectedGridRecordValue('Title')).toBe(titleRandVal, 'Title is missing');
        expect(await documentLibraryConsolePo.getSelectedGridRecordValue('Status')).toBe('Draft', 'Draft Status is missing');
        await documentLibraryConsolePo.searchAndOpenDocumentLibrary(titleRandVal);
        await editDocumentLibraryPo.clickOnAdditionalDetailsOrReadAccessTab('Read Access');
        await editDocumentLibraryPo.clickOnSupportGroupAccessButton();
        await editDocumentLibraryPo.selectAddCompanyDropDownOfReadAccess('Petramco');
        await editDocumentLibraryPo.selectAddBusinessUnitDropDownOfReadAccess('United States Support');
        await editDocumentLibraryPo.selectAddSupportGroupDropDownOfReadAccess('US Support 3');
        await editDocumentLibraryPo.clickOnReadAccessAddButton('Add Support Group');
        expect(await editDocumentLibraryPo.sameSupportGroupErrorMessageDisplayed(' The group already exists in the access list. To modify the access permissions, remove the group from the access list and add it again.')).toBeTruthy();
    });

    it('[4890,4928]: Verify Sort on Document Managment Console', async () => {
        let filePath = '../../../data/ui/attachment/demo.txt';
        let titleRandVal = [...Array(10)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        await navigationPage.gotoSettingsPage();
        await navigationPage.gotoSettingsMenuItem('Document Management--Library', BWF_PAGE_TITLES.DOCUMENT_MANAGEMENT.LIBRARY);
        await createDocumentLibraryPo.openAddNewDocumentBlade();
        expect(await createDocumentLibraryPo.attachmentRequiredText()).toBeTruthy();
        expect(await createDocumentLibraryPo.titleRequiredText()).toBeTruthy();
        expect(await createDocumentLibraryPo.companyRequiredText()).toBeTruthy();
        expect(await createDocumentLibraryPo.ownerGroupRequiredText()).toBeTruthy();
        expect(await createDocumentLibraryPo.isSaveButtonEnabled()).toBeFalsy();
        await createDocumentLibraryPo.addAttachment(filePath);
        await createDocumentLibraryPo.setTitle(titleRandVal);
        await createDocumentLibraryPo.selectCompany('Petramco');
        await createDocumentLibraryPo.selectBusinessUnit('HR Support');
        await createDocumentLibraryPo.selectOwnerGroup('Compensation and Benefits');
        await createDocumentLibraryPo.clickOnSaveButton();
        await utilityCommon.closePopUpMessage();
        expect(await documentLibraryConsolePo.isGridColumnSorted('Title', 'descending')).toBeTruthy('Title column not sorted');
        await documentLibraryConsolePo.isGridColumnSorted('Status', 'descending');
        await documentLibraryConsolePo.isGridColumnSorted('Owner Group', 'descending');
        await documentLibraryConsolePo.isGridColumnSorted('Company', 'descending');

    });

    //kgaikwad 
    it('[4886]: Verify OOB Document template will not appear in knowledge console', async () => {
        await navigationPage.gotoCreateKnowledge();
        expect(await createKnowlegePo.isDocumentTemplatePresent('Document')).toBeFalsy('Document heading is not displayed');
    });

    //kgaikwad
    describe('[4916,4889]: Verify document can be Edited in draft status', async () => {
        let filePath = '../../../data/ui/attachment/demo.txt';
        let titleRandVal = [...Array(10)].map(i => (~~(Math.random() * 36)).toString(36)).join('');

        it('[4916,4889]: Verify document can be Edited in draft status', async () => {
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Document Management--Library', BWF_PAGE_TITLES.DOCUMENT_MANAGEMENT.LIBRARY);
            await createDocumentLibraryPo.openAddNewDocumentBlade();
            await createDocumentLibraryPo.addAttachment(filePath);
            await createDocumentLibraryPo.setTitle(titleRandVal);
            await createDocumentLibraryPo.selectCompany('Petramco');
            await createDocumentLibraryPo.selectBusinessUnit('HR Support');
            await createDocumentLibraryPo.selectOwnerGroup('Compensation and Benefits');
            await createDocumentLibraryPo.clickOnSaveButton();
            await utilityCommon.closePopUpMessage();
            await documentLibraryConsolePo.searchOnGridConsole(titleRandVal);
        });
        it('[4916,4889]: Verify document can be Edited in draft status', async () => {
            expect(await documentLibraryConsolePo.getSelectedGridRecordValue('Title')).toBe(titleRandVal), 'Title is missing';
            expect(await documentLibraryConsolePo.getSelectedGridRecordValue('Status')).toBe('Draft'), 'Published Status is missing';
            await documentLibraryConsolePo.searchAndOpenDocumentLibrary(titleRandVal);
            await editDocumentLibraryPo.setTitle("update" + titleRandVal);
            await editDocumentLibraryPo.selectStatus("Published");
            let systemDate: string = await new Date().toLocaleTimeString()
            let systemTime: string[] = systemDate.split(":");
            await editDocumentLibraryPo.clickOnSaveButton();
            let column: string[] = ["Author"];
            await documentLibraryConsolePo.addColumnOnGrid(column);
            await documentLibraryConsolePo.searchOnGridConsole("update" + titleRandVal);
            expect(await documentLibraryConsolePo.getSelectedGridRecordValue('Title')).toBe("update" + titleRandVal), 'Title is missing';
            expect(await documentLibraryConsolePo.getSelectedGridRecordValue('Status')).toBe('Published'), 'Published Status is missing';
            expect(await documentLibraryConsolePo.getSelectedGridRecordValue('Company')).toBe("Petramco"), 'Title is missing';
            expect(await documentLibraryConsolePo.getSelectedGridRecordValue('Author')).toBe("Qadim Katawazi"), 'Title is missing';
            let time: string = await documentLibraryConsolePo.getSelectedGridRecordValue('Last Modified');
            let newtime: string[] = time.split(" ");
            let newTime: string[] = newtime[3].split(":");
            await expect(newTime[0] + ":" + newTime[1]).toBe(systemTime[0] + ":" + systemTime[1]);
            await documentLibraryConsolePo.removeColumnOnGrid(column);
        });
    });

    //kgaikwad
    it('[4882]: Verify read access component UI', async () => {
        let filePath = 'e2e/data/ui/attachment/demo.txt';
        let draftDocLibData = {
            docLibTitle: 'drdmv13088_draft_document',
            company: 'Petramco',
            businessUnit: 'HR Support',
            ownerGroup: 'Compensation and Benefits',
        }
        await apiHelper.apiLogin('tadmin');
        await apiHelper.deleteDocumentLibrary(draftDocLibData.docLibTitle);
        await apiHelper.apiLogin('qkatawazi');
        await apiHelper.createDocumentLibrary(draftDocLibData, filePath);
        await navigationPage.gotoSettingsPage();
        await navigationPage.gotoSettingsMenuItem('Document Management--Library', BWF_PAGE_TITLES.DOCUMENT_MANAGEMENT.LIBRARY);
        await documentLibraryConsolePo.searchAndOpenDocumentLibrary(draftDocLibData.docLibTitle);
        await editDocumentLibraryPo.clickOnAdditionalDetailsOrReadAccessTab('Read Access');
        await editDocumentLibraryPo.clickOnSupportGroupAccessButton();
        await editDocumentLibraryPo.selectAddCompanyDropDownOfReadAccess('Petramco');
        await editDocumentLibraryPo.selectAddBusinessUnitDropDownOfReadAccess('UI-BusinessUnit');
        await editDocumentLibraryPo.selectAddSupportDepartmentDropDownOfReadAccess('UI-Department');
        await editDocumentLibraryPo.selectAddSupportGroupDropDownOfReadAccess('UI-SupportGroup');
        await editDocumentLibraryPo.clickOnSaveButton();
        expect(await utilityCommon.isPopUpMessagePresent('Saved successfully.')).toBeTruthy();
    });

    //apdeshmu
    describe('[4923]: Verify document creation with Nonsupported and Supported attachment types', async () => {
        let filePath = '../../../data/ui/attachment/Test.exe';
        let fileName1: string[] = ['articleStatus.png', 'bwfJpg.jpg', 'bwfJson1.json', 'bwfPdf.pdf', 'bwfWord1.rtf', 'bwfXlsx.xlsx', 'demo.txt'];
        let titleRandVal = [...Array(10)].map(i => (~~(Math.random() * 36)).toString(36)).join('');

        it('[4923]: Verify document creation with Nonsupported and Supported attachment types', async () => {
            //Supported attachment type verification
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Document Management--Library', BWF_PAGE_TITLES.DOCUMENT_MANAGEMENT.LIBRARY);
            await createDocumentLibraryPo.openAddNewDocumentBlade();
            for (let i: number = 0; i < fileName1.length; i++) {
                await createDocumentLibraryPo.setTitle(titleRandVal);
                await createDocumentLibraryPo.selectCompany('Petramco');
                await createDocumentLibraryPo.selectBusinessUnit('HR Support');
                await createDocumentLibraryPo.selectOwnerGroup('Compensation and Benefits');
                await createDocumentLibraryPo.addAttachment(`../../../data/ui/attachment/${fileName1[i]}`);
                await createDocumentLibraryPo.clickOnSaveButton();
                //This validation is alredy covered at 4882 hence commented
                //expect(await utilityCommon.isPopUpMessagePresent('Saved successfully.')).toBeTruthy();
                await createDocumentLibraryPo.openAddNewDocumentBlade();
            }
        });
        it('[4923]: Verify document creation with Nonsupported and Supported attachment types', async () => {
            await createDocumentLibraryPo.setTitle(titleRandVal);
            await createDocumentLibraryPo.selectCompany('Petramco');
            await createDocumentLibraryPo.selectBusinessUnit('HR Support');
            await createDocumentLibraryPo.selectOwnerGroup('Compensation and Benefits');
            await createDocumentLibraryPo.addAttachment(filePath);
            await createDocumentLibraryPo.clickOnSaveButton();
            expect(await utilityCommon.isPopUpMessagePresent("ERROR (525): The file type is not supported. com.bmc.dsm.knowledge:Knowledge Article : Attachment 1 : Test.exe")).toBeTruthy('Error msg not present');
        });
    });

    //apdeshmu
    it('[4926]: Verify that single file can be attach per document', async () => {
        let filePath = '../../../data/ui/attachment/articleStatus.png';
        let titleRandVal = [...Array(10)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        await navigationPage.gotoSettingsPage();
        await navigationPage.gotoSettingsMenuItem('Document Management--Library', BWF_PAGE_TITLES.DOCUMENT_MANAGEMENT.LIBRARY);
        await createDocumentLibraryPo.openAddNewDocumentBlade();
        await createDocumentLibraryPo.setTitle(titleRandVal);
        await createDocumentLibraryPo.selectCompany('Petramco');
        await createDocumentLibraryPo.selectBusinessUnit('HR Support');
        await createDocumentLibraryPo.selectOwnerGroup('Compensation and Benefits');
        await createDocumentLibraryPo.addAttachment(filePath);
        expect(await createDocumentLibraryPo.isAttachmentButtonEnabled()).toBeFalsy('Attachment button is enabled');
        expect(await createDocumentLibraryPo.getMessageText()).toBe('The maximum number of attachments allowed is 1');
    });

    describe('[4912]: Verify that Document access on multiple change in assignments of support group.', async () => {
        let filePath = '../../../data/ui/attachment/demo.txt';
        let titleRandVal = [...Array(10)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        it('[4912]: Verify that Document access on multiple change in assignments of support group.', async () => {
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Document Management--Library', BWF_PAGE_TITLES.DOCUMENT_MANAGEMENT.LIBRARY);
            await createDocumentLibraryPo.openAddNewDocumentBlade();
            await createDocumentLibraryPo.addAttachment(filePath);
            await createDocumentLibraryPo.setTitle(titleRandVal);
            await createDocumentLibraryPo.selectCompany('Petramco');
            await createDocumentLibraryPo.selectBusinessUnit('United States Support');
            await createDocumentLibraryPo.selectOwnerGroup('US Support 3');
            await createDocumentLibraryPo.clickOnSaveButton();
            await documentLibraryConsolePo.searchAndOpenDocumentLibrary(titleRandVal);
            await editDocumentLibraryPo.selectBusinessUnit('HR Support');
            await editDocumentLibraryPo.selectOwnerGroup('Employee Relations');
            await editDocumentLibraryPo.clickOnSaveButton();
            //This validation is alredy covered at 4882 hence commented
            //expect(await utilityCommon.isPopUpMessagePresent('Saved successfully.')).toBeTruthy();
        });
        it('[4912]: Verify that Document access on multiple change in assignments of support group.', async () => {
            await navigationPage.signOut();
            await loginPage.login('elizabeth');
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Document Management--Library', BWF_PAGE_TITLES.DOCUMENT_MANAGEMENT.LIBRARY);
            await documentLibraryConsolePo.searchAndOpenDocumentLibrary(titleRandVal);
            await editDocumentLibraryPo.selectBusinessUnit('Australia Support');
            //await editDocumentLibraryPo.selectStatus('Published');
            await editDocumentLibraryPo.selectOwnerGroup('AU Support 3');
            await editDocumentLibraryPo.clickOnSaveButton();
            // await editDocumentLibraryPo.clickOnCancelButton();
            await navigationPage.signOut();
            await loginPage.login('qliu');
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Document Management--Library', BWF_PAGE_TITLES.DOCUMENT_MANAGEMENT.LIBRARY);
            await documentLibraryConsolePo.searchAndOpenDocumentLibrary(titleRandVal);
            await editDocumentLibraryPo.selectStatus('Published');
            await editDocumentLibraryPo.clickOnSaveButton();
            expect(await utilityCommon.isPopUpMessagePresent('Saved successfully.')).toBeTruthy();
        });
        it('[4912]: Verify that Document access on multiple change in assignments of support group.', async () => {
            await navigationPage.signOut();
            await loginPage.login('elizabeth');
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Document Management--Library', BWF_PAGE_TITLES.DOCUMENT_MANAGEMENT.LIBRARY);
            expect(await documentLibraryConsolePo.searchAndCheckDocumentLibraryListed(titleRandVal)).toBeTruthy("Document is listed");
        });
        it('[4912]: Verify that Document access on multiple change in assignments of support group.', async () => {
            await navigationPage.signOut();
            await loginPage.login('qkatawazi');
            await navigationPage.gotoCaseConsole();
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Document Management--Library', BWF_PAGE_TITLES.DOCUMENT_MANAGEMENT.LIBRARY);
            expect(await documentLibraryConsolePo.searchAndCheckDocumentLibraryListed(titleRandVal)).toBeTruthy("Document not visible");
        });
        afterAll(async () => {
            await navigationPage.signOut();
            await loginPage.login('qkatawazi');
        });
    });

    it('[4927]: Verify Create view of Document library', async () => {
        await navigationPage.gotoSettingsPage();
        await navigationPage.gotoSettingsMenuItem('Document Management--Library', BWF_PAGE_TITLES.DOCUMENT_MANAGEMENT.LIBRARY);
        await createDocumentLibraryPo.openAddNewDocumentBlade();
        expect(await createDocumentLibraryPo.attachmentTextPresent('Attachment')).toBeTruthy("Attachment text not present");
        expect(await createDocumentLibraryPo.titleTextPresent('Title')).toBeTruthy("Title text not present");
        expect(await createDocumentLibraryPo.descriptionTextPresent('Description')).toBeTruthy("Description text not present");
        expect(await createDocumentLibraryPo.companyTextPresent('Company')).toBeTruthy("Company text not present");
        expect(await createDocumentLibraryPo.departmentTextPresent('Department')).toBeTruthy("Department text not present");
        expect(await createDocumentLibraryPo.buisnessUnitTextPresent('Business Unit')).toBeTruthy("Business Unit text not present");
        expect(await createDocumentLibraryPo.OwnerGroupTextPresent('Owner Group')).toBeTruthy("Owner Group text not present");
        expect(await createDocumentLibraryPo.keyWordTextPresent('Keywords')).toBeTruthy("Keywords text not present");
        expect(await createDocumentLibraryPo.categoryTier1TextPresent('Category Tier 1')).toBeTruthy("Category Tier 1 text not present");
        expect(await createDocumentLibraryPo.categoryTier2TextPresent('Category Tier 2')).toBeTruthy("Category Tier 2 text not present");
        expect(await createDocumentLibraryPo.categoryTier3TextPresent('Category Tier 3')).toBeTruthy("Category Tier 3 text not present");
        expect(await createDocumentLibraryPo.categoryTier4TextPresent('Category Tier 4')).toBeTruthy("Category Tier 4 text not present");
        expect(await createDocumentLibraryPo.regionTextPresent('Region')).toBeTruthy("Region text not present");

        expect(await createDocumentLibraryPo.attachmentLinkEnable()).toBeTruthy("Link is not enabled");
        expect(await createDocumentLibraryPo.isSaveButtonDisplayed()).toBeTruthy("Save button is not Displayed");
        expect(await createDocumentLibraryPo.isCancelButtonDisplayed()).toBeTruthy("cancel button is not Displayed");
        expect(await createDocumentLibraryPo.isDeleteButtonDisplayed()).toBeFalsy("delete button is Displayed");

        await createDocumentLibraryPo.selectCompany('Petramco');
        await createDocumentLibraryPo.selectBusinessUnit('HR Support');
        await createDocumentLibraryPo.selectOwnerGroup("Compensation and Benefits");
        await createDocumentLibraryPo.selectCategoryTier1("Applications");
        await createDocumentLibraryPo.selectCategoryTier2('Social');
        await createDocumentLibraryPo.selectCategoryTier3('Chatter');
        await createDocumentLibraryPo.selectRegion('Australia');
        await createDocumentLibraryPo.selectSite('Canberra');
        expect(await createDocumentLibraryPo.siteTextPresent('Site')).toBeTruthy("Site text not present");
    });

    //kgaikwad
    describe('[4888]: Verify document will not appear in knowledge article searches', async () => {
        let filePath = '../../../data/ui/attachment/demo.txt';
        let titleRandVal = [...Array(10)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        it('[4888]: Verify document will not appear in knowledge article searches', async () => {
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Document Management--Library', BWF_PAGE_TITLES.DOCUMENT_MANAGEMENT.LIBRARY);
            await createDocumentLibraryPo.openAddNewDocumentBlade();
            await createDocumentLibraryPo.addAttachment(filePath);
            await createDocumentLibraryPo.setTitle(titleRandVal);
            await createDocumentLibraryPo.selectCompany('Petramco');
            await createDocumentLibraryPo.selectBusinessUnit('HR Support');
            await createDocumentLibraryPo.selectOwnerGroup('Compensation and Benefits');
            await createDocumentLibraryPo.clickOnSaveButton();
            await utilityCommon.closePopUpMessage();
        });
        it('[4888]: Verify document will not appear in knowledge article searches', async () => {
            await navigationPage.gotoQuickCase();
            await quickCasePo.selectRequesterName('Angelina Jolie');
            await quickCasePo.setCaseSummary(titleRandVal);
            expect(await resources.getCountOfHeading('Recommended Knowledge')).toBe(0, 'heading Count is not correct');
            await navigationPage.gotoCreateKnowledge();
            expect(await browser.getTitle()).toBe('Knowledge Article Templates Preview - Business Workflows');
            await createKnowlegePo.clickOnTemplate('Reference');
            await createKnowlegePo.clickOnUseSelectedTemplateButton();
            await createKnowlegePo.addTextInKnowlegeTitleField('test case for 4230');
            await createKnowlegePo.selectKnowledgeSet('HR');
            expect(await createKnowlegePo.isAttachDocumentBladeDisplayed()).toBeFalsy('Attach Document Blade is displayed');
            await createKnowlegePo.clickOnSaveKnowledgeButton();
            await previewKnowledgePo.clickGoToArticleButton();
            await viewKnowledgeArticlePo.clickEditKnowledgeMedataData();
            expect(await editKnowledgeMetaDataPo.isAttachDocumentBladeDisplayed()).toBeFalsy('Attach Document Blade is displayed');
            await utilityCommon.switchToDefaultWindowClosingOtherTabs();
        });
    });
    //kgaikwad
    it('[4885]: Verify Knowledge Users will not be able to view document Managment link', async () => {
        try {
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Document Management--Library', BWF_PAGE_TITLES.DOCUMENT_MANAGEMENT.LIBRARY);
            await navigationPage.signOut();
            await loginPage.login('kayo');
            await navigationPage.gotoSettingsPage();
            expect(await navigationPage.isSettingPanelTextMatches(" No matches found ")).toBeTruthy();
        } catch (e) {
            throw e;
        } finally {
            await navigationPage.signOut();
            await loginPage.login('qkatawazi');
        }
    });
});

