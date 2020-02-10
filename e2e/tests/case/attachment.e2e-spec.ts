import { browser, protractor, ProtractorExpectedConditions } from "protractor";
import attachmentBladePo from '../../pageobject/attachment/attachment-blade.po';
import createCasePo from '../../pageobject/case/create-case.po';
import viewCasePo from '../../pageobject/case/view-case.po';
import loginPage from "../../pageobject/common/login.po";
import navigationPage from "../../pageobject/common/navigation.po";

describe("Attachment", () => {
    const EC: ProtractorExpectedConditions = protractor.ExpectedConditions;

    beforeAll(async () => {
        await browser.get('/innovationsuite/index.html#/com.bmc.dsm.bwfa');
        await loginPage.login("qtao");
    });

    afterEach(async () => {
        await browser.refresh();
    });

    afterAll(async () => {
        await navigationPage.signOut();
    });

    it('[DRDMV-11697]: All attachments grid verification', async () => {
        let caseSummary = [...Array(10)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        await navigationPage.gotCreateCase();
        await createCasePo.selectRequester('Elizabeth Peters');
        await createCasePo.setSummary(caseSummary);
        await createCasePo.clickSaveCaseButton();
        await createCasePo.clickGoToCaseButton();
        await viewCasePo.clickAttachmentsLink();
        await expect(await attachmentBladePo.isColumnHeaderMatche('Attachments ')).toBe('Attachments','Attachment column header is missing');
        expect(await attachmentBladePo.isColumnHeaderMatche('Attached to ')).toBe('Attached to','Attached to column header is missing');
        expect(await attachmentBladePo.isColumnHeaderMatche('Media type ')).toBe('Media type','Media type  column header is missing');
        expect(await attachmentBladePo.isColumnHeaderMatche('Created date ')).toBe('Created date','Created date column header is missing');
        expect(await attachmentBladePo.isDownloadButtonDisplayed()).toBeTruthy('Download button is missing');
        expect(await attachmentBladePo.isCloseButtonDisplayed()).toBeTruthy('Close button is missing');
    })

})