import { resolve } from "path";
import { $, protractor, ProtractorExpectedConditions } from "protractor";
import utilityCommon from '../../../utils/utility.common';
import utilityGrid from '../../../utils/utility.grid';
import { DropDownType } from '../../../utils/constants';



class DocumentLibraryPage {
    EC: ProtractorExpectedConditions = protractor.ExpectedConditions;
    selectors = {
        addDocumentButton: '[rx-view-component-id="c2df3218-8ef7-402c-bdc2-721e891346bb"] button',
        titleField: '[rx-view-component-id="f7b3ab85-7c96-4d90-8c9d-06b4a761b090"] input',
        titleGuid: 'f7b3ab85-7c96-4d90-8c9d-06b4a761b090',
        attachmentLink: '[rx-view-component-id="d9a66a3a-d637-45d7-bb1c-bd60a50c5914"] .bwf-button-link',
        attachmentField: '[rx-view-component-id="d9a66a3a-d637-45d7-bb1c-bd60a50c5914"] input',
        attachmentGuid: 'd9a66a3a-d637-45d7-bb1c-bd60a50c5914',
        companyFieldGuid: 'cc6775d9-040f-4fde-bddf-7ab2334d6881',
        businessUnitFieldGuid: '732fbb60-8861-484e-a233-817231bf510d',
        ownerGroupFieldGuid: 'c44f53f6-3ffc-42f7-b958-1ef65cee75e6',
        deleteButton: '[rx-view-component-id="6e44c878-cc4a-4de1-8626-c786b5d309d7"] button',
        saveButton: '[rx-view-component-id="2ddf1845-1e5a-48f9-b6fd-1497f9be0daf"] button',
        saveButtonGuid: '2ddf1845-1e5a-48f9-b6fd-1497f9be0daf',
        companyField: '[rx-view-component-id="cc6775d9-040f-4fde-bddf-7ab2334d6881"]',
        selectOptionList: 'ul.ui-select-choices',
        ownerGroupField: '[rx-view-component-id="c44f53f6-3ffc-42f7-b958-1ef65cee75e6"]',
        gridRow: '.ui-grid-row',
        gridSearchText: 'input[rx-id="search-text-input"]',
        gridCell: '.ui-grid-cell',
        gridCellLink: '.ui-grid__link',
        alert: '.rx-growl-item__message',
        busyLoading: '.ui-grid .cg-busy__cover',
        category1: 'c1910198-171d-453e-ad8f-b0e5c8c20128',
        category2: '19bc0740-6a6c-4b56-8ff2-cfa0b49c9cd2',
        category3: 'dc6992ff-4013-442b-93fe-6f8aedaa55f5',
        category4: 'e99dc284-de1a-4908-b2d1-40e0b557a1d0',
        region: '0ec41c10-47f1-494e-ac46-43b1b63aa253',
        site: '387f735d-b87f-4935-9bf8-28a04c9ecfda',
        status: '0a8b7179-dd0a-47f9-8515-7c7aceda3118',
        editSaveButton: '[rx-view-component-id="8035353f-acb0-4bb5-a5c5-fe7626c01b3e"] button',
        documentHamburgerGuid: '5d1f94a9-693e-4dbf-896f-3b9689f95a42',
        attachButton: '[rx-view-component-id="d9a66a3a-d637-45d7-bb1c-bd60a50c5914"] button',
        attachmentMaxLimitMsgText: '[class="bwf-attachment-limit-warning my-1 p-1 ng-star-inserted"]',
        descriptionGuid: 'd66ee2b3-fb51-4b16-be2a-80e83d9e6e75',
        departmentGuid: '16c03e64-8767-490e-b32e-d712b8ec4fbe',
        buisnessUnit: '732fbb60-8861-484e-a233-817231bf510d',
        keyWordGuid: 'afdfcbdf-13c4-45ec-8870-f53a0bf32bac',
        cancelGuid: '00107b90-bb31-4776-a855-44fea128a0de',
        cancelButton: '[rx-view-component-id="00107b90-bb31-4776-a855-44fea128a0de"] button',
        lobValue: '[rx-view-component-id="b7ce46f7-92b4-4847-901f-a6d8f4e4fef9"] .pull-left',
        lob: '[rx-view-component-id="af6075c8-2249-4c8a-938d-2cb4e08d48c4"] button div',
        siteGroupGuid: '4f23d28f-846e-4451-ab41-4582dd3c44e1'
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
        return await utilityCommon.isFieldLabelDisplayed(this.selectors.attachmentGuid, textValue);
    }

    async titleTextPresent(textValue: string): Promise<boolean> {
        return await utilityCommon.isFieldLabelDisplayed(this.selectors.titleGuid, textValue);
    }

    async descriptionTextPresent(textValue: string): Promise<boolean> {
        return await utilityCommon.isFieldLabelDisplayed(this.selectors.descriptionGuid, textValue);
    }

    async companyTextPresent(textValue: string): Promise<boolean> {
        return await utilityCommon.isFieldLabelDisplayed(this.selectors.companyFieldGuid, textValue);
    }



    async buisnessUnitTextPresent(textValue: string): Promise<boolean> {
        return await utilityCommon.isFieldLabelDisplayed(this.selectors.buisnessUnit, textValue);
    }

    async OwnerGroupTextPresent(textValue: string): Promise<boolean> {
        return await utilityCommon.isFieldLabelDisplayed(this.selectors.ownerGroupFieldGuid, textValue);
    }

    async keyWordTextPresent(textValue: string): Promise<boolean> {
        return await utilityCommon.isFieldLabelDisplayed(this.selectors.keyWordGuid, textValue);
    }

    async categoryTier1TextPresent(textValue: string): Promise<boolean> {
        return await utilityCommon.isFieldLabelDisplayed(this.selectors.category1, textValue);
    }

    async categoryTier2TextPresent(textValue: string): Promise<boolean> {
        return await utilityCommon.isFieldLabelDisplayed(this.selectors.category2, textValue);
    }

    async categoryTier3TextPresent(textValue: string): Promise<boolean> {
        return await utilityCommon.isFieldLabelDisplayed(this.selectors.category3, textValue);
    }

    async categoryTier4TextPresent(textValue: string): Promise<boolean> {
        return await utilityCommon.isFieldLabelDisplayed(this.selectors.category4, textValue);
    }

    async regionTextPresent(textValue: string): Promise<boolean> {
        return await utilityCommon.isFieldLabelDisplayed(this.selectors.region, textValue);
    }

    async siteTextPresent(textValue: string): Promise<boolean> {
        return await utilityCommon.isFieldLabelDisplayed(this.selectors.site, textValue);
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
        return await utilityCommon.isRequiredTagToField(this.selectors.attachmentGuid);
    }

    async titleRequiredText(): Promise<boolean> {
        return await utilityCommon.isRequiredTagToField(this.selectors.titleGuid);
    }

    async companyRequiredText(): Promise<boolean> {
        return await utilityCommon.isRequiredTagToField(this.selectors.companyFieldGuid);
    }

    async ownerGroupRequiredText(): Promise<boolean> {
        return await utilityCommon.isRequiredTagToField(this.selectors.ownerGroupFieldGuid);
    }

    async openAddNewDocumentBlade(): Promise<void> {
        //        await browser.wait(this.EC.elementToBeClickable($(this.selectors.addDocumentButton)));
        await $(this.selectors.addDocumentButton).click();
        //        await browser.wait(this.EC.visibilityOf($(this.selectors.titleField)));
    }

    async isAddNewDocumentBladeEnabled(): Promise<boolean> {
        //        await browser.wait(this.EC.elementToBeClickable($(this.selectors.addDocumentButton)));
        return await $(this.selectors.addDocumentButton).isEnabled();
        //        await browser.wait(this.EC.visibilityOf($(this.selectors.titleField)));
    }

    async setTitle(title: string): Promise<void> {
        await $(this.selectors.titleField).sendKeys(title);
    }

    async selectCompany(companyName: string): Promise<void> {
        await utilityCommon.selectDropDown(this.selectors.companyFieldGuid, companyName);
    }

    async selectSupportOrg(buisnessUnit: string): Promise<void> {
        await utilityCommon.selectDropDown("Support Organization", buisnessUnit, DropDownType.Label);
    }
    async selectOwnerGroup(ownerGroupName: string): Promise<void> {
        await utilityCommon.selectDropDown("Owner Group", ownerGroupName, DropDownType.Label);
    }

    async clickOnSaveButton(): Promise<void> {
        //        await browser.wait(this.EC.elementToBeClickable($(this.selectors.saveButton)));
        await $(this.selectors.saveButton).click();
    }

    async clickCancelButton(): Promise<void> {
        await $(this.selectors.cancelButton).click();
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
        await utilityCommon.selectDropDown(this.selectors.category1, categValue);
    }

    async selectCategoryTier2(categValue: string): Promise<void> {
        await utilityCommon.selectDropDown(this.selectors.category2, categValue);
    }

    async selectCategoryTier3(categValue: string): Promise<void> {
        await utilityCommon.selectDropDown(this.selectors.category3, categValue);
    }

    async selectCategoryTier4(categValue: string): Promise<void> {
        await utilityCommon.selectDropDown(this.selectors.category4, categValue);
    }

    async selectRegion(regionValue: string): Promise<void> {
        await utilityCommon.selectDropDown(this.selectors.region, regionValue);
    }

    async selectSite(siteValue: string): Promise<void> {
        await utilityCommon.selectDropDown(this.selectors.site, siteValue);
    }

    async selectSiteGroup(siteValue: string): Promise<void> {
        await utilityCommon.selectDropDown(this.selectors.siteGroupGuid, siteValue);
    }

    async selectStatus(statusValue: string): Promise<void> {
        await utilityCommon.selectDropDown(this.selectors.status, statusValue);
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
        await utilityGrid.searchAndOpenHyperlink(this.selectors.documentHamburgerGuid, documentLibraryColumnHeader);
    }

    async isAttachmentButtonEnabled(): Promise<boolean> {
        return await $(this.selectors.attachButton).isEnabled();
    }

    async getMessageText(): Promise<string> {
        return await $(this.selectors.attachmentMaxLimitMsgText).getText();
    }

    async getLobValue(): Promise<string> {
        return await $(this.selectors.lob).getText();
    }
}

export default new DocumentLibraryPage();