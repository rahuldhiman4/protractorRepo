import { browser } from "protractor";
import quickCasePo from '../../pageobject/case/quick-case.po';
import loginPage from "../../pageobject/common/login.po";
import navigationPage from "../../pageobject/common/navigation.po";
import resources from '../../pageobject/common/resources-tab.po';
import consoleKnowledgePo from '../../pageobject/knowledge/knowledge-articles-console.po';
import createKnowlegePo from '../../pageobject/knowledge/create-knowlege.po';
import informationTabPo from '../../pageobject/knowledge/information-tab.po';
import createDocumentLibraryPo from '../../pageobject/settings/document-management/create-document-library.po';
import documentLibraryConsolePo from '../../pageobject/settings/document-management/document-library-console.po';
import editDocumentLibraryPo from '../../pageobject/settings/document-management/edit-document-library.po';
import utilCommon from '../../utils/util.common';
import utilGrid from '../../utils/util.grid';


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
    });

    //kgaikwad
    it('[DRDMV-13039,DRDMV-13073]: Verify document can be Deleted And Verify OOB document manager role is added to BA', async () => {
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
    }, 120 * 1000);

    //kgaikwad
    it('[DRDMV-13045]: Verify Delete button on document', async () => {
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
    });

    //kgaikwad
    it('[DRDMV-13074]: Verify Document Managment Grid Console', async () => {
        await navigationPage.gotoSettingsPage();
        await navigationPage.gotoSettingsMenuItem('Document Management--Library', 'Document Library Console - Business Workflows');
        await utilCommon.waitUntilSpinnerToHide();
        let columns1: string[] = ["Title", "Status", "Owner Group", "Company", "Last Modified"];
        expect(await documentLibraryConsolePo.areGridColumnHeaderMatches(columns1)).toBeTruthy('column headers does not match 1');
        let columns2: string[] = ["Author", "Category Tier 1", "Category Tier 2", "Category Tier 3", "GUID", "Region"];
        let columns3: string[] = ["Title", "Status", "Owner Group", "Company", "Last Modified","Author", "Category Tier 1", "Category Tier 2", "Category Tier 3", "GUID", "Region"];
        await documentLibraryConsolePo.addColumnOnGrid(columns2);
        expect(await documentLibraryConsolePo.areGridColumnHeaderMatches(columns3)).toBeTruthy('column headers does not match 2');
        await documentLibraryConsolePo.removeColumnOnGrid(columns2);
        expect(await documentLibraryConsolePo.areGridColumnHeaderMatches(columns1)).toBeTruthy('column headers does not match 3');
    });

    //kgaikwad
    it('[DRDMV-13075,DRDMV-13038]: Verify document can be publish And Verify Search on Document Managment Console ', async () => {
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
        expect(await editDocumentLibraryPo.isKeywordsFieldEnabled()).toBeFalsy('Keywords Field field is enabled');
        expect(await editDocumentLibraryPo.isCategoryTier1Disabled()).toBeTruthy('Category Tire1 field is enabled');
        expect(await editDocumentLibraryPo.isCategoryTier2Disabled()).toBeTruthy('Category Tire2 field is enabled');
        expect(await editDocumentLibraryPo.isCategoryTier3Disabled()).toBeTruthy('Category Tire3 field is enabled');
        expect(await editDocumentLibraryPo.isCategoryTier4Disabled()).toBeTruthy('Category Tire4 field is enabled');
        expect(await editDocumentLibraryPo.isRegionDropDownDisabled()).toBeTruthy('Region Drop Down field is enabled');
        expect(await editDocumentLibraryPo.isSiteDropDownDisabled()).toBeTruthy('Site Drop Down field is enabled');
        await editDocumentLibraryPo.clickOnAdditionalDetailsOrReadAccessTab('Read Access');
        expect(await editDocumentLibraryPo.isSupportGroupAccessButtonDisabled()).toBeTruthy('Support Group Access Group Button is enabled');
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
    }, 120 * 1000);

    //kgaikwad
    it('[DRDMV-13021]: Verify edit document UI', async () => {
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
        await utilCommon.waitUntilSpinnerToHide();
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
        let column: string[] = ["Author"];
        await documentLibraryConsolePo.addColumnOnGrid(column);
        await documentLibraryConsolePo.searchOnGridConsole(titleRandVal);
        expect(await documentLibraryConsolePo.getSelectedGridRecordValue('Author')).toBe('Qadim Katawazi', 'Author is not displayed');
        await documentLibraryConsolePo.removeColumnOnGrid(column);
    });

    //kgaikwad
    it('[DRDMV-13085]: Verify document created will not listed in Knowledge articles grid', async () => {
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
        await navigationPage.gotoKnowledgeConsole();
        await utilGrid.clearFilter();
        expect(await consoleKnowledgePo.isGridRecordPresent(titleRandVal)).toBeFalsy('Record is present on knowledge article grid');
    });

    //kgaikwad
    it('[DRDMV-13083]: Verify Knowledge Users will not be able to view document Managment link', async () => {
        try {
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Document Management--Library', 'Document Library Console - Business Workflows');
            await navigationPage.signOut();
            await loginPage.login('kayo');
            await navigationPage.gotoSettingsPage();
            expect(await utilCommon.isConfigurationOptionMessageDisplayed('Configuration options not created for these settings.')).toBeTruthy('Document Management Link text is not displayed setting page');
        } catch (e) {
            throw e;
        } finally {
            await navigationPage.signOut();
            await loginPage.login('qkatawazi');
        }
    });

    //kgaikwad
    it('[DRDMV-13079]: Verify document will not appear in knowledge article searches	', async () => {
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

        await navigationPage.gotoQuickCase();
        await quickCasePo.selectRequesterName('Angelina Jolie');
        await quickCasePo.setCaseSummary(titleRandVal);
        let column: string = await resources.getCountOfHeading('Recommended Knowledge ')
        expect(await resources.getCountOfHeading('Recommended Knowledge ')).toBe('0', 'heading Count is not correct');

        await navigationPage.gotoCreateKnowledge();
        await expect(browser.getTitle()).toBe('Knowledge Article Templates Preview - Business Workflows');
        await createKnowlegePo.clickOnTemplate('Reference');
        await createKnowlegePo.clickOnUseSelectedTemplateButton();
        await createKnowlegePo.addTextInKnowlegeTitleField('test case for DRDMV-16754');
        await createKnowlegePo.selectKnowledgeSet('HR');
        expect(await createKnowlegePo.isAttachDocumentBladeDisplayed()).toBeFalsy('Attach Document Blade is displayed');
        await createKnowlegePo.clickOnSaveKnowledgeButton();
        await createKnowlegePo.clickOnviewArticleLinkButton();

        await utilCommon.switchToNewWidnow(1);
        await informationTabPo.clickOnEditButton();
        expect(await informationTabPo.isAttachDocumentBladeDisplayed()).toBeFalsy('Attach Document Blade is displayed');

    });

    //kgaikwad
    it('[DRDMV-13041]: Verify Support Group Level Read access of Document	', async () => {
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
        await editDocumentLibraryPo.clickOnAdditionalDetailsOrReadAccessTab('Read Access');

        await editDocumentLibraryPo.selectAddSupportGroupDropDownOfReadAccess('Employee Relations');
        await editDocumentLibraryPo.clickOnReadAccessAddButton('Add Support Group');
        await editDocumentLibraryPo.clickOnSupportGroupAccessButton();
        await editDocumentLibraryPo.selectAddCompanyDropDownOfReadAccess('Petramco');
        await editDocumentLibraryPo.clickOnReadAccessAddButton('Add Company');
        await editDocumentLibraryPo.clickOnCancelButton();

        try {
            await navigationPage.signOut();
            await loginPage.login('qliu');
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Document Management--Library', 'Document Library Console - Business Workflows');
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

            await editDocumentLibraryPo.clickOnAdditionalDetailsOrReadAccessTab('Read Access');
            await editDocumentLibraryPo.closeGroupAccessTag('Employee Relations');
            expect(await editDocumentLibraryPo.isRemoveGroupAccessWarningMessageDisplayed('Are you sure you want to remove access to "Employee Relations"?')).toBeTruthy('Remove Group List Warning Message Missing');
            await editDocumentLibraryPo.clickOnRemoveGroupWarningMsgYesButton();
            await utilCommon.waitUntilSpinnerToHide();
            expect(await utilCommon.getPopUpMessage()).toBe('ERROR (222095): You do not have permission to perform this operation. Please contact your system administrator.', 'Message of permission denined for group access remove not displayed');
            await utilCommon.closePopUpMessage();

            await editDocumentLibraryPo.clickOnSupportGroupAccessButton();
            await editDocumentLibraryPo.selectAddCompanyDropDownOfReadAccess('BMC Software');
            await editDocumentLibraryPo.clickOnReadAccessAddButton('Add Company');
            await utilCommon.waitUntilSpinnerToHide();
            expect(await utilCommon.getPopUpMessage()).toBe('ERROR (222095): You do not have permission to perform this operation. Please contact your system administrator.', 'Message of permission denined for group access remove not displayed');
            await utilCommon.closePopUpMessage();

            await editDocumentLibraryPo.clickOnSupportGroupAccessButton();
            await editDocumentLibraryPo.selectAddBusinessUnitDropDownOfReadAccess('ESM');
            await editDocumentLibraryPo.clickOnReadAccessAddButton('Add Business Unit');
            await utilCommon.waitUntilSpinnerToHide();
            expect(await utilCommon.getPopUpMessage()).toBe('ERROR (222095): You do not have permission to perform this operation. Please contact your system administrator.', 'Message of permission denined for group access remove not displayed');
            await utilCommon.closePopUpMessage();

            await editDocumentLibraryPo.clickOnSupportGroupAccessButton();
            await editDocumentLibraryPo.selectAddSupportGroupDropDownOfReadAccess('Engineering');
            await editDocumentLibraryPo.clickOnReadAccessAddButton('Add Support Department');
            await utilCommon.waitUntilSpinnerToHide();
            expect(await utilCommon.getPopUpMessage()).toBe('ERROR (222095): You do not have permission to perform this operation. Please contact your system administrator.', 'Message of permission denined for group access remove not displayed');
            await utilCommon.closePopUpMessage();

            await editDocumentLibraryPo.clickOnSupportGroupAccessButton();
            await editDocumentLibraryPo.selectAddSupportGroupDropDownOfReadAccess('Accounts Payable (AP)');
            await editDocumentLibraryPo.clickOnReadAccessAddButton('Add Support Group');
            await utilCommon.waitUntilSpinnerToHide();
            expect(await utilCommon.getPopUpMessage()).toBe('ERROR (222095): You do not have permission to perform this operation. Please contact your system administrator.', 'Message of permission denined for group access remove not displayed');
            await utilCommon.closePopUpMessage();

            await editDocumentLibraryPo.clickOnCancelButton();
            await utilCommon.clickOnWarningOk();
            await documentLibraryConsolePo.searchOnGridConsole(titleRandVal)

        } catch (e) {
            throw e;
        } finally {
            await navigationPage.signOut();
            await loginPage.login('qkatawazi');
        }
    }, 150 * 1000);

    //kgaikwad
    it('[DRDMV-13072]: Verify error should be thrown when write access SG is added in read access', async () => {
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
        expect(await documentLibraryConsolePo.getSelectedGridRecordValue('Title')).toBe(titleRandVal, 'Title is missing');
        expect(await documentLibraryConsolePo.getSelectedGridRecordValue('Status')).toBe('Draft', 'Draft Status is missing');
        await documentLibraryConsolePo.searchAndOpenDocumentLibrary(titleRandVal);
        await editDocumentLibraryPo.clickOnAdditionalDetailsOrReadAccessTab('Read Access');
        await editDocumentLibraryPo.selectAddCompanyDropDownOfReadAccess('Petramco');
        await editDocumentLibraryPo.clickOnReadAccessAddButton('Add Company');
        await editDocumentLibraryPo.clickOnSupportGroupAccessButton();
        // await editDocumentLibraryPo.selectReadAccessDropDown('Add Support Group', 'Compensation and Benefits');
        await editDocumentLibraryPo.selectAddSupportGroupDropDownOfReadAccess('Compensation and Benefits');
        await editDocumentLibraryPo.clickOnReadAccessAddButton('Add Support Group');
        expect(await editDocumentLibraryPo.sameSupportGroupErrorMessageDisplayed(' The group already exists in the access list. To modify the access permissions, remove the group from the access list and add it again.')).toBeTruthy();
    });

    it('[DRDMV-13077]: Verify Sort on Document Managment Console', async () => {
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
        expect(await documentLibraryConsolePo.isGridColumnSorted('Title', 'descending')).toBeTruthy('Title column not sorted');
        await documentLibraryConsolePo.isGridColumnSorted('Status', 'descending');
        await documentLibraryConsolePo.isGridColumnSorted('Owner Group', 'descending');
        await documentLibraryConsolePo.isGridColumnSorted('Company', 'descending');

    });

    it('[DRDMV-13081]: Verify OOB Document template will not appear in knowledge console', async () => {
        await navigationPage.gotoCreateKnowledge();
        expect(await createKnowlegePo.isDocumentTemplatePresent('Document')).toBeFalsy('Document heading is not displayed');
    });

    fit('[DRDMV-13040,DRDMV-13078]: Verify document can be Edited in draft status', async () => {
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
        expect(await documentLibraryConsolePo.getSelectedGridRecordValue('Status')).toBe('Draft'), 'Published Status is missing';
        await documentLibraryConsolePo.searchAndOpenDocumentLibrary(titleRandVal);
        await editDocumentLibraryPo.setTitle("update"+titleRandVal);
        await editDocumentLibraryPo.selectStatus("Published");
        let systemDate:string=await new Date().toLocaleTimeString()
        let systemTime:string[]=systemDate.split(":");

        await editDocumentLibraryPo.clickOnSaveButton();
        let column:string[]=["Author"];
        await documentLibraryConsolePo.addColumnOnGrid(column);
        await documentLibraryConsolePo.searchOnGridConsole("update"+titleRandVal);
        expect(await documentLibraryConsolePo.getSelectedGridRecordValue('Title')).toBe("update"+titleRandVal), 'Title is missing';
        expect(await documentLibraryConsolePo.getSelectedGridRecordValue('Status')).toBe('Published'), 'Published Status is missing';
        expect(await documentLibraryConsolePo.getSelectedGridRecordValue('Company')).toBe("Petramco"), 'Title is missing';
        expect(await documentLibraryConsolePo.getSelectedGridRecordValue('Author')).toBe("Qadim Katawazi"), 'Title is missing';
        let time:string=await documentLibraryConsolePo.getSelectedGridRecordValue('Last Modified');
        let newtime:string[]=time.split(" ");
        let newTime:string[]=newtime[3].split(":");
        await expect(newTime[0]+":"+newTime[1]).toBe(systemTime[0]+":"+systemTime[1]);
        await documentLibraryConsolePo.removeColumnOnGrid(column);
    });

})