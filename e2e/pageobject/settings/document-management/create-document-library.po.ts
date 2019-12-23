import { resolve } from "path";
import { $$,$, browser, by, element, protractor, ProtractorExpectedConditions } from "protractor";
import utilCommon from '../../../utils/util.common';

class DocumentLibraryPage {
    EC: ProtractorExpectedConditions = protractor.ExpectedConditions;
    selectors = {
        addDocumentButton: '[rx-view-component-id="c2df3218-8ef7-402c-bdc2-721e891346bb"] button',
        titleField: '[rx-view-component-id="f7b3ab85-7c96-4d90-8c9d-06b4a761b090"] input',
        attachmentField: '[rx-view-component-id="d9a66a3a-d637-45d7-bb1c-bd60a50c5914"] input',
        companyFieldGuid: 'cc6775d9-040f-4fde-bddf-7ab2334d6881',
        selectOptionList: 'ul.ui-select-choices',
        ownerGroupFieldGuid: '001ddea2-b59d-49dc-ac5e-628f3a75e9fa',
        saveButton: '[rx-view-component-id="2ddf1845-1e5a-48f9-b6fd-1497f9be0daf"] button',
    }

    async addAttachment(): Promise<void> {
        const fileToUpload = '../../../data/ui/attachment/demo.txt';
        const absolutePath = resolve(__dirname, fileToUpload);
        console.log(absolutePath);
        await $(this.selectors.attachmentField).sendKeys(absolutePath);
    }
    
    async openAddNewDocumentBlade(): Promise<void> {
        await browser.wait(this.EC.elementToBeClickable($(this.selectors.addDocumentButton)));
        await $(this.selectors.addDocumentButton).click();
        await browser.wait(this.EC.visibilityOf($(this.selectors.titleField)));
    }

    async setTitle(title: string): Promise<void> {
        await $(this.selectors.titleField).sendKeys(title);
    }

    async selectCompany(companyName: string): Promise<void> {
        await utilCommon.selectDropDown(this.selectors.companyFieldGuid,companyName);
    }

    async selectOwnerGroup(ownerGroupName: string): Promise<void> {
        await utilCommon.selectDropDown(this.selectors.ownerGroupFieldGuid,ownerGroupName);
    }

    async clickOnSaveButton(): Promise<void> {
        await browser.wait(this.EC.elementToBeClickable($(this.selectors.saveButton)));
        $(this.selectors.saveButton).click();
    }
}

export default new DocumentLibraryPage();