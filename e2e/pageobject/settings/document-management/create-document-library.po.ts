import { resolve } from "path";
import { $, browser, protractor, ProtractorExpectedConditions,element,by } from "protractor";
import utilCommon from '../../../utils/util.common';
import utilGrid from '../../../utils/util.grid';

class DocumentLibraryPage {
    EC: ProtractorExpectedConditions = protractor.ExpectedConditions;
    selectors = {
        addDocumentButton: '[rx-view-component-id="c2df3218-8ef7-402c-bdc2-721e891346bb"] button',
        titleField: '[rx-view-component-id="f7b3ab85-7c96-4d90-8c9d-06b4a761b090"] input',
        attachmentField: '[rx-view-component-id="d9a66a3a-d637-45d7-bb1c-bd60a50c5914"] input',
        companyFieldGuid: 'cc6775d9-040f-4fde-bddf-7ab2334d6881',
        ownerGroupFieldGuid: '001ddea2-b59d-49dc-ac5e-628f3a75e9fa',
        saveButton: '[rx-view-component-id="2ddf1845-1e5a-48f9-b6fd-1497f9be0daf"] button',
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
        category1: '[rx-view-component-id="23ea94b1-228c-4910-93f2-2fb23cdf6e31"]',
        category2: '[rx-view-component-id="cfcfaa56-d45a-4216-a26b-5584d4411121"]',
        category3: '[rx-view-component-id="04175b81-40f9-4112-a521-6ab4a9c8160b"]',
        region: '[rx-view-component-id="cec69daa-b696-415b-b2ab-ebec81251d10"]',
        site: '[rx-view-component-id="1a4afa56-0b87-45ea-9456-f251b0848c70"]',
        status: '[rx-view-component-id="0a8b7179-dd0a-47f9-8515-7c7aceda3118"]',
        editSaveButton:'[rx-view-component-id="8035353f-acb0-4bb5-a5c5-fe7626c01b3e"] button',  
        documentHamburgerGuid: '5d1f94a9-693e-4dbf-896f-3b9689f95a42',
  
    }

    async addAttachment(fileToUpload:string): Promise<void> {
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
        await utilCommon.selectDropDown(this.selectors.companyFieldGuid, companyName);
    }

    async selectOwnerGroup(ownerGroupName: string): Promise<void> {
        await utilCommon.selectDropDown(this.selectors.ownerGroupFieldGuid, ownerGroupName);
    }

    async clickOnSaveButton(): Promise<void> {
        await browser.wait(this.EC.elementToBeClickable($(this.selectors.saveButton)));
        await $(this.selectors.saveButton).click();
    }

    async selectCategoryTier1(categValue: string): Promise<void> {
        await utilCommon.selectDropDown(this.selectors.category1,categValue);
    }

    async selectCategoryTier2(categValue: string): Promise<void> {
        await utilCommon.selectDropDown(this.selectors.category2,categValue);
    }

    async selectCategoryTier3(categValue: string): Promise<void> {
        await utilCommon.selectDropDown(this.selectors.category3,categValue);
    }

    async selectRegion(regionValue: string): Promise<void> {
        await  utilCommon.selectDropDown(this.selectors.region,regionValue);
    }

    async selectSite(siteValue: string): Promise<void> {
        await utilCommon.selectDropDown(this.selectors.site,siteValue);
    }

    async selectStatus(statusValue: string): Promise<void> {
        await utilCommon.selectDropDown(this.selectors.status,statusValue);
    }

    async saveNewDocument(): Promise<void> {
        await browser.wait(this.EC.elementToBeClickable($(this.selectors.saveButton)));
        await $(this.selectors.saveButton).click();
	}

    async saveUpdatedDocument(): Promise<void> {
        await browser.wait(this.EC.elementToBeClickable($(this.selectors.editSaveButton)));
        await $(this.selectors.editSaveButton).click();
    }

    async clickOnSelectedGridRecord(documentLibraryColumnHeader:string): Promise<void> {
        await utilGrid.clickOnSelectedGridRecord(this.selectors.documentHamburgerGuid, documentLibraryColumnHeader);
    }


}

export default new DocumentLibraryPage();