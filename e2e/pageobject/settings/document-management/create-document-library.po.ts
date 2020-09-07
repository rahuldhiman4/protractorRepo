import { resolve } from "path";
import { $, browser, protractor, ProtractorExpectedConditions, element, by } from "protractor";
import utilCommon from '../../../utils/util.common';
import utilGrid from '../../../utils/util.grid';


class DocumentLibraryPage {
    EC: ProtractorExpectedConditions = protractor.ExpectedConditions;
    selectors = {
        addDocumentButton: '[rx-view-component-id="c2df3218-8ef7-402c-bdc2-721e891346bb"] button',
        titleField: '[rx-view-component-id="f7b3ab85-7c96-4d90-8c9d-06b4a761b090"] input',
        titleGuid: 'f7b3ab85-7c96-4d90-8c9d-06b4a761b090',
        attachmentLink: '.rx-attachment-attach-icon',
        attachmentField: '[rx-view-component-id="d9a66a3a-d637-45d7-bb1c-bd60a50c5914"] input',
        attachmentGuid: 'd9a66a3a-d637-45d7-bb1c-bd60a50c5914',
        companyFieldGuid: 'cc6775d9-040f-4fde-bddf-7ab2334d6881',
        businessUnitFieldGuid: '3b6ebf9c-13f1-4924-8740-3f720ae8335a',
        ownerGroupFieldGuid: '001ddea2-b59d-49dc-ac5e-628f3a75e9fa',
        deleteButton: '[rx-view-component-id="6e44c878-cc4a-4de1-8626-c786b5d309d7"] button',
        saveButton: '[rx-view-component-id="2ddf1845-1e5a-48f9-b6fd-1497f9be0daf"] button',
        saveButtonGuid: '2ddf1845-1e5a-48f9-b6fd-1497f9be0daf',
        companyField: '[rx-view-component-id="cc6775d9-040f-4fde-bddf-7ab2334d6881"]',
        selectOptionList: 'ul.ui-select-choices',
        ownerGroupField: '[rx-view-component-id="001ddea2-b59d-49dc-ac5e-628f3a75e9fa"]',
        documentGrid: '[rx-view-component-id="5d1f94a9-693e-4dbf-896f-3b9689f95a42"]',
        gridRow: '.ui-grid-row',
        gridSearchText: 'input[rx-id="search-text-input"]',
        gridCell: '.ui-grid-cell',
        gridCellLink: '.ui-grid__link',
        alert: '.rx-growl-item__message',
        busyLoading: '.ui-grid .cg-busy__cover',
        category1: '23ea94b1-228c-4910-93f2-2fb23cdf6e31',
        category2: 'cfcfaa56-d45a-4216-a26b-5584d4411121',
        category3: '04175b81-40f9-4112-a521-6ab4a9c8160b',
        category4: 'b74fd509-d489-4ccb-bf89-41307f794df7',
        region: 'cec69daa-b696-415b-b2ab-ebec81251d10',
        site: '904078f1-17f1-4ac6-ab8a-a2f6e661f01d',
        status: '0a8b7179-dd0a-47f9-8515-7c7aceda3118',
        editSaveButton: '[rx-view-component-id="8035353f-acb0-4bb5-a5c5-fe7626c01b3e"] button',
        documentHamburgerGuid: '5d1f94a9-693e-4dbf-896f-3b9689f95a42',
        attachButton: '[rx-view-component-id="9e3b3bb5-8a95-45d9-bbd1-deb35af4bc37"] button',
        attachmentMaxLimitMsgText: '.ux-attachment-maxlimit-warning',
        descriptionGuid: 'd66ee2b3-fb51-4b16-be2a-80e83d9e6e75',
        departmentGuid: '16c03e64-8767-490e-b32e-d712b8ec4fbe',
        buisnessUnit: '3b6ebf9c-13f1-4924-8740-3f720ae8335a',
        keyWordGuid: 'afdfcbdf-13c4-45ec-8870-f53a0bf32bac',
        cancelGuid: '00107b90-bb31-4776-a855-44fea128a0de',
        cancelButton: '[rx-view-component-id="00107b90-bb31-4776-a855-44fea128a0de"] button'
    }

    async addAttachment(fileToUpload: string): Promise<void> {
        const absolutePath = resolve(__dirname, fileToUpload);
        console.log(absolutePath);
        await $(this.selectors.attachmentField).sendKeys(absolutePath);
    }

    async attachmentLinkEnable(): Promise<boolean> {
        return await $(this.selectors.attachmentLink).isEnabled();
    }

    async attachmentTextPresent(textValue: string): Promise<boolean> {
        return await utilCommon.isFieldLabelDisplayed(this.selectors.attachmentGuid, textValue);
    }

    async titleTextPresent(textValue: string): Promise<boolean> {
        return await utilCommon.isFieldLabelDisplayed(this.selectors.titleGuid, textValue);
    }

    async descriptionTextPresent(textValue: string): Promise<boolean> {
        return await utilCommon.isFieldLabelDisplayed(this.selectors.descriptionGuid, textValue);
    }

    async companyTextPresent(textValue: string): Promise<boolean> {
        return await utilCommon.isFieldLabelDisplayed(this.selectors.companyFieldGuid, textValue);
    }

    async departmentTextPresent(textValue: string): Promise<boolean> {
        return await utilCommon.isFieldLabelDisplayed(this.selectors.departmentGuid, textValue);
    }

    async buisnessUnitTextPresent(textValue: string): Promise<boolean> {
        return await utilCommon.isFieldLabelDisplayed(this.selectors.buisnessUnit, textValue);
    }

    async OwnerGroupTextPresent(textValue: string): Promise<boolean> {
        return await utilCommon.isFieldLabelDisplayed(this.selectors.ownerGroupFieldGuid, textValue);
    }

    async keyWordTextPresent(textValue: string): Promise<boolean> {
        return await utilCommon.isFieldLabelDisplayed(this.selectors.keyWordGuid, textValue);
    }

    async categoryTier1TextPresent(textValue: string): Promise<boolean> {
        return await utilCommon.isFieldLabelDisplayed(this.selectors.category1, textValue);
    }

    async categoryTier2TextPresent(textValue: string): Promise<boolean> {
        return await utilCommon.isFieldLabelDisplayed(this.selectors.category2, textValue);
    }

    async categoryTier3TextPresent(textValue: string): Promise<boolean> {
        return await utilCommon.isFieldLabelDisplayed(this.selectors.category3, textValue);
    }

    async categoryTier4TextPresent(textValue: string): Promise<boolean> {
        return await utilCommon.isFieldLabelDisplayed(this.selectors.category4, textValue);
    }

    async regionTextPresent(textValue: string): Promise<boolean> {
        return await utilCommon.isFieldLabelDisplayed(this.selectors.region, textValue);
    }

    async siteTextPresent(textValue: string): Promise<boolean> {
        return await utilCommon.isFieldLabelDisplayed(this.selectors.site, textValue);
    }

    async saveTextPresent(textValue: string): Promise<boolean> {
        return await $(this.selectors.saveButton).then(async (result) => {
            if (result) {
                return await $(this.selectors.saveButton).getText() == textValue ? true : false;
            } else {
                console.log("save text not present");
                return false;
            }
        });
    }

    async cancelTextPresent(textValue: string): Promise<boolean> {
        return await $(this.selectors.cancelButton).getText().then(async (result) => {
            if (result) {
                return await $(this.selectors.cancelButton).getText() == textValue ? true : false;
            } else {
                console.log("cancel text not present");
                return false;
            }
        });
    }


    async attachmentRequiredText(): Promise<boolean> {
        return await utilCommon.isRequiredTagToField(this.selectors.attachmentGuid);
    }

    async titleRequiredText(): Promise<boolean> {
        return await utilCommon.isRequiredTagToField(this.selectors.titleGuid);
    }

    async companyRequiredText(): Promise<boolean> {
        return await utilCommon.isRequiredTagToField(this.selectors.companyFieldGuid);
    }

    async ownerGroupRequiredText(): Promise<boolean> {
        return await utilCommon.isRequiredTagToField(this.selectors.ownerGroupFieldGuid);
    }

    async openAddNewDocumentBlade(): Promise<void> {
        //        await browser.wait(this.EC.elementToBeClickable($(this.selectors.addDocumentButton)));
        await $(this.selectors.addDocumentButton).click();
        //        await browser.wait(this.EC.visibilityOf($(this.selectors.titleField)));
    }

    async setTitle(title: string): Promise<void> {
        await $(this.selectors.titleField).sendKeys(title);
    }

    async selectCompany(companyName: string): Promise<void> {
        await utilCommon.selectDropDown(this.selectors.companyFieldGuid, companyName);
    }

    async selectBusinessUnit(buisnessUnit: string): Promise<void> {
        await utilCommon.selectDropDown(this.selectors.buisnessUnit, buisnessUnit);
    }
    async selectOwnerGroup(ownerGroupName: string): Promise<void> {
        await utilCommon.selectDropDown(this.selectors.ownerGroupFieldGuid, ownerGroupName);
    }

    async clickOnSaveButton(): Promise<void> {
        //        await browser.wait(this.EC.elementToBeClickable($(this.selectors.saveButton)));
        await $(this.selectors.saveButton).click();
    }

    async isSaveButtonEnabled(): Promise<boolean> {
        //        await browser.wait(this.EC.elementToBeClickable($(this.selectors.saveButton)));
        return await $(this.selectors.saveButton).isEnabled();
    }

    async isSaveButtonDisplayed(): Promise<boolean> {
        //        await browser.wait(this.EC.elementToBeClickable($(this.selectors.saveButton)));
        return await $(this.selectors.saveButton).isDisplayed();
    }

    async isDeleteButtonDisplayed(): Promise<boolean> {
        //        await browser.wait(this.EC.elementToBeClickable($(this.selectors.saveButton)));
        return await $(this.selectors.deleteButton).isPresent().then(async (result) => {
            if (result) return await $(this.selectors.deleteButton).isDisplayed();
            else return false;
        });
    }

    async isCancelButtonDisplayed(): Promise<boolean> {
        //        await browser.wait(this.EC.elementToBeClickable($(this.selectors.saveButton)));
        return await $(this.selectors.cancelButton).isDisplayed();
    }

    async selectCategoryTier1(categValue: string): Promise<void> {
        await utilCommon.selectDropDown(this.selectors.category1, categValue);
    }

    async selectCategoryTier2(categValue: string): Promise<void> {
        await utilCommon.selectDropDown(this.selectors.category2, categValue);
    }

    async selectCategoryTier3(categValue: string): Promise<void> {
        await utilCommon.selectDropDown(this.selectors.category3, categValue);
    }

    async selectCategoryTier4(categValue: string): Promise<void> {
        await utilCommon.selectDropDown(this.selectors.category4, categValue);
    }

    async selectRegion(regionValue: string): Promise<void> {
        await utilCommon.selectDropDown(this.selectors.region, regionValue);
    }

    async selectSite(siteValue: string): Promise<void> {
        await utilCommon.selectDropDown(this.selectors.site, siteValue);
    }

    async selectStatus(statusValue: string): Promise<void> {
        await utilCommon.selectDropDown(this.selectors.status, statusValue);
    }

    async saveNewDocument(): Promise<void> {
        //        await browser.wait(this.EC.elementToBeClickable($(this.selectors.saveButton)));
        await $(this.selectors.saveButton).click();
    }

    async saveUpdatedDocument(): Promise<void> {
        //        await browser.wait(this.EC.elementToBeClickable($(this.selectors.editSaveButton)));
        await $(this.selectors.editSaveButton).click();
    }

    async clickOnSelectedGridRecord(documentLibraryColumnHeader: string): Promise<void> {
        await utilGrid.clickOnSelectedGridRecord(this.selectors.documentHamburgerGuid, documentLibraryColumnHeader);
    }

    async isAttachmentButtonEnabled(): Promise<boolean> {
        return await $(this.selectors.attachButton).isEnabled();
    }

    async getMessageText(): Promise<string> {
        return await $(this.selectors.attachmentMaxLimitMsgText).getText();
    }

}

export default new DocumentLibraryPage();