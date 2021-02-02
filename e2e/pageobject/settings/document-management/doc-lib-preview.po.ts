import { $, by, element, ElementFinder } from "protractor";
import utilityCommon from '../../../utils/utility.common';

class DocumentLibraryPreview {

    selectors = {
        fieldLabels: '.clearfix label',
        docName: '[rx-view-component-id="fda41cb5-e7b0-4ff5-830e-ffc177110036"] span',
        attachment: '.bwf-attachment-viewer .bwf-attachment-container__file-name',
        docStatus: '[rx-view-component-id="bef89c7c-b2f7-47a0-b06f-e61a8753c9fd"] span',
        company: '[rx-view-component-id="be45ce22-9f2d-407b-b2a8-a694f9594a6a"] .read-only-content',
        shareExternally: '[rx-view-component-id="4fbaab2c-551d-4768-85c6-597b0626fffb"] .read-only-content',
        SupportOrganization: '[rx-view-component-id="3a6db173-b1dd-43c5-a93b-a0452dda157b"] .read-only-content',
        ownerGroup: '[rx-view-component-id="af638726-22f4-4bd9-add3-a214b55ef75a"] .read-only-content',
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
        let guid: string = undefined;
        switch (labelName) {
            case "Company": {
                guid = 'be45ce22-9f2d-407b-b2a8-a694f9594a6a';
                break;
            }
            case "Support Organization": {
                guid = '3a6db173-b1dd-43c5-a93b-a0452dda157b';
                break;
            }
            case "Owner Group": {
                guid = '245a88c2-bf08-49c3-8b7d-df1594a17fd1';
                break;
            }
            case "Share Externally": {
                guid = '4fbaab2c-551d-4768-85c6-597b0626fffb';
                break;
            }
            case "Keywords": {
                guid = '696edd09-c171-4913-993c-a43c00350ca0';
                break;
            }
            case "Tier 1": {
                guid = '31f430d9-4733-4d05-9f95-f764a6368e06';
                break;
            }
            case "Tier 2": {
                guid = '3adf47b7-6238-4193-a195-1639b8b56c3a';
                break;
            }
            case "Tier 3": {
                guid = '1ad4eaba-1e29-47a9-8ceb-4925e2d5e6ae';
                break;
            }
            case "Tier 4": {
                guid = 'a3605766-1656-4e91-8e67-2f39d10a0827';
                break;
            }
            case "Region": {
                guid = '3d98fdea-64d8-43f3-b9bd-c5ce30d6e88f';
                break;
            }
            case "Site": {
                guid = '614496f1-c688-45c2-a123-84452dfd5665';
                break;
            }

            default: {
                console.log(labelName, ' is not a valid parameter');
                break;
            }
        }
        return await utilityCommon.isFieldLabelDisplayed(guid, labelName);
    }

    async isDataDisplayed(fieldName: string, dataName: string): Promise<boolean> {
        let getElements: string = undefined;
        switch (fieldName) {
            case "OperationalCategory": {
                getElements = this.selectors.operationalCategory;
                break;
            }

            case "Location": {
                getElements = this.selectors.location;
                break;
            }

            case "DocumentName": {
                getElements = this.selectors.docName;
                break;
            }

            case "Attachment": {
                getElements = this.selectors.attachment;
                break;
            }

            case "DocumentStatus": {
                getElements = this.selectors.docStatus;
                break;
            }

            case "ShareExternally": {
                getElements = this.selectors.shareExternally;
                break;
            }
            case "Company": {
                getElements = this.selectors.company;
                break;
            }
            case "SupportOrganization": {
                getElements = this.selectors.SupportOrganization;
                break;
            }
            case "OwnerGroup": {
                getElements = this.selectors.ownerGroup;
                break;
            }

            case "Keyword": {
                getElements = this.selectors.keyword;
                break;
            }

            default: {
                console.log(dataName, ' is not a valid parameter');
                break;
            }
        }
        let dataElement = await element(by.cssContainingText(getElements, dataName));
        return await this.isElementDisplayed(dataElement);
    }
}
export default new DocumentLibraryPreview();