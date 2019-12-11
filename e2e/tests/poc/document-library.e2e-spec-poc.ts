import { browser, protractor, ProtractorExpectedConditions } from "protractor";
import loginPage from "../../pageobject/common/login.po";
import navigationPage from "../../pageobject/common/navigation.po";
import documentLibraryPage from '../../pageobject/settings/document-management/document-library.po';

describe('document library', () => {
    const EC: ProtractorExpectedConditions = protractor.ExpectedConditions;
    beforeAll(async () => {
        await browser.get('/innovationsuite/index.html#/com.bmc.dsm.bwfa');
    });

    afterAll(async () => {
        await navigationPage.signOut();
    });

    it('should login correctly', async () => {
        await loginPage.login('qkatawazi');
    });

    it('should goto document library settings', async () => {
        await navigationPage.gotoSettingsPage();
        expect(await navigationPage.gotoSettingsMenuItem('Document Management--Library', 'Document Library Console - Business Workflows'))
            .toEqual('Document Library Console - Business Workflows');
    }, 120 * 1000);

    it('should add new document', async () => {
        await documentLibraryPage.openAddNewDocumentBlade();
        await documentLibraryPage.addAttachment();
        let title = `Document-${new Date().valueOf()}`;
        await documentLibraryPage.enterTitle(title);
        await documentLibraryPage.selectCompany('Petramco');
        await documentLibraryPage.selectOwnerGroup('Workforce Administration');
        await documentLibraryPage.saveNewDocument();
        expect(await documentLibraryPage.getAlertText()).toEqual('Saved successfully.');
        await documentLibraryPage.searchGrid(title);
        expect(await documentLibraryPage.getFirstCellText()).toEqual(title);
        await browser.sleep(5000);
    }, 120 * 1000);
})
