import { browser } from "protractor";
import apiHelper from '../../api/api.helper';
import attachmentBladePo from '../../pageobject/attachment/attachment-blade.po';
import caseConsolePo from '../../pageobject/case/case-console.po';
import editCasePo from '../../pageobject/case/edit-case.po';
import viewCasePo from '../../pageobject/case/view-case.po';
import attachDocumentBladePo from '../../pageobject/common/attach-document-blade.po';
import loginPage from "../../pageobject/common/login.po";
import navigationPage from "../../pageobject/common/navigation.po";
import createDocumentLibraryPo from '../../pageobject/settings/document-management/create-document-library.po';
import documentLibraryConsolePo from '../../pageobject/settings/document-management/document-library-console.po';
import editDocumentLibraryPo from '../../pageobject/settings/document-management/edit-document-library.po';
import utilCommon from '../../utils/util.common';


describe('Document Library Consume UI', () => {
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
    it('[DRDMV-13539]: Documents attached on case still accessible when someone deletes them from document library', async () => {
        let filePath = '../../../data/ui/attachment/demo.txt';
        let docLib1 = [...Array(10)].map(i => (~~(Math.random() * 36)).toString(36)).join('');

        await navigationPage.gotoSettingsPage();
        await navigationPage.gotoSettingsMenuItem('Document Management--Library', 'Document Library Console - Business Workflows');
        await createDocumentLibraryPo.openAddNewDocumentBlade();
        await createDocumentLibraryPo.addAttachment(filePath);
        await createDocumentLibraryPo.setTitle(docLib1);
        await createDocumentLibraryPo.selectCompany('Petramco');
        await createDocumentLibraryPo.selectOwnerGroup('Compensation and Benefits');
        await createDocumentLibraryPo.clickOnSaveButton();
        await documentLibraryConsolePo.searchAndOpenDocumentLibrary(docLib1);
        await editDocumentLibraryPo.selectStatus('Published');
        await editDocumentLibraryPo.clickOnSaveButton();

        await navigationPage.gotoCaseConsole();
        let summary = [...Array(10)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        var caseData =
        {
            "Requester": "qtao",
            "Summary": "Test case for DRDMV-8377RandVal" + summary,
            "Support Group": "Compensation and Benefits",
            "Assignee": "qkatawazi"
        }
        await apiHelper.apiLogin('qkatawazi');
        var newCase = await apiHelper.createCase(caseData);
        var caseId: string = newCase.displayId;
        await caseConsolePo.searchAndOpenCase(caseId);
        await viewCasePo.clickEditCaseButton();
        await editCasePo.clickOnAttachLink();
        await attachDocumentBladePo.searchAndAttachDocument(docLib1);
        await editCasePo.clickSaveCase();
        await viewCasePo.clickAttachmentsLink();
        expect(await utilCommon.deleteAlreadyDownloadedFile('demo.txt')).toBeTruthy('demo.txt File is delete sucessfully');
        await attachmentBladePo.searchAndSelectCheckBox('demo');
        await attachmentBladePo.clickOnDownloadButton();
        // Defect: After File Download from attachment blade file doesn't get downloaded.
        await expect(await utilCommon.isFileDownloaded('demo.txt')).toBeTruthy('demo.txt File is not downloaded.');
        expect(await utilCommon.deleteAlreadyDownloadedFile('demo.txt')).toBeTruthy('demo.txt File is delete sucessfully');
        await attachmentBladePo.clickOnCloseButton();
        await navigationPage.gotoSettingsPage();
        await navigationPage.gotoSettingsMenuItem('Document Management--Library', 'Document Library Console - Business Workflows');
        await documentLibraryConsolePo.searchAndOpenDocumentLibrary(docLib1);
        await editDocumentLibraryPo.selectStatus('Draft');
        await editDocumentLibraryPo.clickOnSaveButton();
        await documentLibraryConsolePo.searchAndOpenDocumentLibrary(docLib1);
        await editDocumentLibraryPo.clickOnDeleteButton();
        await editDocumentLibraryPo.clickOnYesButtonOfDeleteWarningMsg();
        expect(await utilCommon.getPopUpMessage()).toBe('Document deleted successfully.', 'Document deleted pop up is missing');
        await navigationPage.gotoCaseConsole();
        await caseConsolePo.searchAndOpenCase(caseId);
        await viewCasePo.clickAttachmentsLink();
        expect(await utilCommon.deleteAlreadyDownloadedFile('demo.txt')).toBeTruthy('demo.txt File is delete sucessfully');
        await attachmentBladePo.searchAndSelectCheckBox('demo');
        await attachmentBladePo.clickOnDownloadButton();
        // Defect: After File Download from attachment blade file doesn't get downloaded.
        await expect(await utilCommon.isFileDownloaded('demo.txt')).toBeTruthy('demo.txt File is not downloaded.');
        expect(await utilCommon.deleteAlreadyDownloadedFile('demo.txt')).toBeTruthy('demo.txt File is delete sucessfully');
    }, 150 * 1000);

})