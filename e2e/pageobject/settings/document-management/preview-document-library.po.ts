import { $, by, element, ElementFinder } from "protractor";

class TaskTemplatePreview {

    selectors = {
        fieldLabels: '.clearfix label',
        docName: '[rx-view-component-id="fda41cb5-e7b0-4ff5-830e-ffc177110036"] span',
        attachment: '.bwf-attachment-viewer .bwf-attachment-container__file-name',
        docStatus: '[rx-view-component-id="bef89c7c-b2f7-47a0-b06f-e61a8753c9fd"] span',
        company: '[rx-view-component-id="be45ce22-9f2d-407b-b2a8-a694f9594a6a"] .read-only-content',
        shareExternally: '[rx-view-component-id="4fbaab2c-551d-4768-85c6-597b0626fffb"] .read-only-content',
        bussinessUnit: '[rx-view-component-id="99db67d8-24d4-4627-ae49-c5143a442917"] .read-only-content',
        ownerGroup: '[rx-view-component-id="245a88c2-bf08-49c3-8b7d-df1594a17fd1"] .read-only-content',
        keyword: '[rx-view-component-id="696edd09-c171-4913-993c-a43c00350ca0"] .bwf-item-text',
        operationalCategory: '[rx-view-component-id="0c703f2c-73f7-432c-94fd-f464cf6a2c70"] p',
        location: '[rx-view-component-id="54f83c0c-81cb-4997-b520-4d768e2d826c"] p'

    }

    async isElementDisplayed(element: ElementFinder): Promise<boolean> {
        return await element.isPresent().then(async (link) => {
            if (link) {
                return await element.isDisplayed();
            } else return false;
        });
    }

    async isFieldLabelDisplayed(labelName: string): Promise<boolean> {
        let labelElement = await element(by.cssContainingText(this.selectors.fieldLabels, labelName));
        return await this.isElementDisplayed(labelElement);
    }

    async isOperationalCategoryDisplayed(operationalCategory: string): Promise<boolean> {
        let operationalCategoryElement = await element(by.cssContainingText(this.selectors.operationalCategory, operationalCategory));
        return await this.isElementDisplayed(operationalCategoryElement);
    }

    async isLocationDisplayed(location: string): Promise<boolean> {
        let locationElement = await element(by.cssContainingText(this.selectors.location, location));
        return await this.isElementDisplayed(locationElement);
    }


    async istdocNameDisplayed(docName: string): Promise<boolean> {
        let docNameElement = await element(by.cssContainingText(this.selectors.docName, docName));
        return await this.isElementDisplayed(docNameElement);
    }

    async isattachmentDisplayed(attachmentName: string): Promise<boolean> {
        let attachmentElement = await element(by.cssContainingText(this.selectors.attachment, attachmentName));
        return await this.isElementDisplayed(attachmentElement);
    }

    async isdocStatusDisplayed(docStatus: string): Promise<boolean> {
        let docStatusElement = await element(by.cssContainingText(this.selectors.docStatus, docStatus));
        return await this.isElementDisplayed(docStatusElement);
    }

    async isShareExternallyDisplayed(shareExternally: string): Promise<boolean> {
        let shareExternallyElement = await element(by.cssContainingText(this.selectors.shareExternally, shareExternally));
        return await this.isElementDisplayed(shareExternallyElement);
    }

    async isCompanyValueDisplayed(company: string): Promise<boolean> {
        let companyValueElement = await element(by.cssContainingText(this.selectors.company, company));
        return await this.isElementDisplayed(companyValueElement);
    }

    async isBussinessUnitValueDisplayed(bussinessUnitValue: string): Promise<boolean> {
        let bussinessUnitElement = await element(by.cssContainingText(this.selectors.bussinessUnit, bussinessUnitValue));
        return await this.isElementDisplayed(bussinessUnitElement);
    }

    async isOwnerGroupValueDisplayed(ownerGroupVal: string): Promise<boolean> {
        let ownerGroupElement = await element(by.cssContainingText(this.selectors.ownerGroup, ownerGroupVal));
        return await this.isElementDisplayed(ownerGroupElement);
    }

    async isKeywordsDisplayed(keyword: string): Promise<boolean> {
        let keywordElement = await element(by.cssContainingText(this.selectors.keyword, keyword));
        return await this.isElementDisplayed(keywordElement);
    }
}
export default new TaskTemplatePreview();