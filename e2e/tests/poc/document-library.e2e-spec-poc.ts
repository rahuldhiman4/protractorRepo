import { browser, protractor, ProtractorExpectedConditions } from "protractor";
import loginPage from "../../pageobject/common/login.po";
import navigationPage from "../../pageobject/common/navigation.po";
import documentLibraryPage from '../../pageobject/settings/document-management/create-document-library.po';

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
    });

    it('should add new document', async () => {
        let filePath = '../../../data/ui/attachment/demo.txt';
        let titleRandVal = [...Array(10)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        await navigationPage.gotoSettingsPage();
        await navigationPage.gotoSettingsMenuItem('Document Management--Library', 'Document Library Console - Business Workflows');
        await browser.sleep(2000);
        await documentLibraryPage.openAddNewDocumentBlade();
        await documentLibraryPage.addAttachment(filePath);
        await documentLibraryPage.setTitle(titleRandVal);
        await documentLibraryPage.selectCompany('Petramco');
        await documentLibraryPage.selectOwnerGroup('Compensation and Benefits');
        await documentLibraryPage.clickOnSaveButton();
        await browser.sleep(5000);
    });
})
