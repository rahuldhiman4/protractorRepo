import { $, browser, by, element, protractor, ProtractorExpectedConditions } from "protractor";
import utilCommon from '../../../utils/util.common';

class EditDocumentLibraryPage {
    EC: ProtractorExpectedConditions = protractor.ExpectedConditions;
    selectors = {
        titleTextBox: '[rx-view-component-id="64f47195-458a-43ee-8169-cab57666a856"] .rx-character-field__input',
        company: '[rx-view-component-id="0484edce-0480-421f-9d7f-105447889a49"] .ui-select-toggle',
        ownerGroup: '[rx-view-component-id="048757f9-8d97-4bcc-8cd9-ad236b093157"] .btn-default',
        statusGuid: '0a8b7179-dd0a-47f9-8515-7c7aceda3118',
        status: '[rx-view-component-id="0a8b7179-dd0a-47f9-8515-7c7aceda3118"] .btn-default',
        saveButton: '[rx-view-component-id="8035353f-acb0-4bb5-a5c5-fe7626c01b3e"] button',
        deleteButton: '[rx-view-component-id="6e44c878-cc4a-4de1-8626-c786b5d309d7"] button',
        cancelButton: '[rx-view-component-id="61a48596-d3c0-462d-825b-4d6172e351b3"] button',
        deleteDocWarningMsg: '[rx-view-component-id="c652354a-1524-4235-b1db-6b397fc9699a"] span',
        deleteDocWarningMsgYesButton: '[rx-view-component-id="e40ad54c-ad9a-480a-aa63-a8b399caf20e"] button',
        attachmentField: '[rx-view-component-id="8cfc0c35-081a-40cb-ae85-527045bede0c"] button',
        bussinessUnit: '[rx-view-component-id="43f01d2a-f8cc-450d-9209-5ac53426f3bb"] .btn-default',
        department: '[rx-view-component-id="04c57da2-5942-407c-9f87-5670a08ab18e"] .btn-default',
        shareExternallyToggleButton: '[rx-view-component-id="422e33d2-be19-42f7-985b-af73daf4d87f"] .ng-valid-required',
        keywords: '[rx-view-component-id="3d940c59-00f7-477a-915b-b1e7fc8a91f6"] .ng-valid-max-tags',
        categoryTier1: '[rx-view-component-id="6d7ee978-79a7-4460-90d6-e0c9841fd0f0"] .ui-select-toggle',
        categoryTier2: '[rx-view-component-id="400ac801-1c40-43c7-87c3-a21e1d5531e9"] .ui-select-toggle',
        categoryTier3: '[rx-view-component-id="6d35f3df-e3eb-4e6c-8ba8-ff0c683a9bb7"] .ui-select-toggle',
        categoryTier4: '[rx-view-component-id="a82103c1-077b-4bae-8ef5-69093da58be8"] .ui-select-toggle',
        region: '[rx-view-component-id="836aa6d7-1d77-46b4-b270-50d7d25424ba"] .ui-select-toggle',
        site: '[rx-view-component-id="b22d4dc1-83b5-4b06-a2c0-10e3865fb46e"] .ui-select-toggle',
        tabs: '.rx-tab',
        supportGroupAccessGroupButton: '.rx-case-access-block .ac-manage-support',
        addCompany: '.flex-item .ac-company-field .dropdown-toggle',
        addCompanyAddButton: '.flex-item .ac-add-company',
        addBussinessUnit: '.ac-business-unit-field .dropdown-toggle',
        addBussinessUnitAddButton: '.flex-item .ac-business-unit-add',
        addSupportDepartment: '.ac-support-department-field button',
        addSupportDepartmentAddButton: '.ac-support-department-add',
        addSupportGroup: '.ac-support-group-field button',
        addSupportGroupAddButton: '.flex-item .ac-support-group-add',

    }

    async isStatusDropDownvalueMatches(dropDownValues: string[]): Promise<boolean> {
        await browser.wait(this.EC.visibilityOf($(this.selectors.cancelButton)));
        return await utilCommon.isDrpDownvalueDisplayed(this.selectors.statusGuid, dropDownValues)
    }

    async getDeleteWarningMsgText(message: string): Promise<string> {
        await browser.wait(this.EC.visibilityOf($(this.selectors.deleteDocWarningMsg)));
        return await element(by.cssContainingText((this.selectors.deleteDocWarningMsg), message)).getText();
    }

    async clickOnYesButtonOfDeleteWarningMsg(): Promise<void> {
        await browser.wait(this.EC.elementToBeClickable($(this.selectors.deleteDocWarningMsgYesButton)));
        await $(this.selectors.deleteDocWarningMsgYesButton).click();
    }

    async selectStatus(status: string): Promise<void> {
        await utilCommon.selectDropDown(this.selectors.statusGuid, status);
    }

    async clickOnSaveButton(): Promise<void> {
        await browser.wait(this.EC.elementToBeClickable($(this.selectors.saveButton)));
        await $(this.selectors.saveButton).click();
    }

    async clickOnDeleteButton(): Promise<void> {
        await browser.wait(this.EC.elementToBeClickable($(this.selectors.deleteButton)));
        await $(this.selectors.deleteButton).click();
    }

    async clickOnCancelButton(): Promise<void> {
        await browser.wait(this.EC.elementToBeClickable($(this.selectors.cancelButton)));
        await $(this.selectors.cancelButton).click();
    }

    async isDeleteButtonEnabled(): Promise<boolean> {
        await browser.wait(this.EC.visibilityOf($(this.selectors.deleteButton)));
        return await $(this.selectors.deleteButton).isEnabled();
    }

    async isSaveButtonEnabled(): Promise<boolean> {
        await browser.wait(this.EC.visibilityOf($(this.selectors.saveButton)));
        return await $(this.selectors.saveButton).isEnabled();
    }

    async isAttachmentFieldDisabled(): Promise<boolean> {
        await browser.wait(this.EC.visibilityOf($(this.selectors.attachmentField)));
        return await $(this.selectors.attachmentField).getAttribute('disabled') == 'true';
    }

    async isTitleTextBoxDisabled(): Promise<boolean> {
        await browser.wait(this.EC.visibilityOf($(this.selectors.titleTextBox)));
        return await $(this.selectors.titleTextBox).getAttribute('readonly') == 'true';
    }

    async isCompanyDropDownDisabled(): Promise<boolean> {
        await browser.wait(this.EC.visibilityOf($(this.selectors.company)));
        return await $(this.selectors.company).getAttribute('aria-disabled') == 'true';
    }

    async isBussinessUnitDropDownDisabled(): Promise<boolean> {
        await browser.wait(this.EC.visibilityOf($(this.selectors.bussinessUnit)));
        return await $(this.selectors.bussinessUnit).getAttribute('disabled') == 'true';
    }

    async isDepartmentDropDownDisabled(): Promise<boolean> {
        await browser.wait(this.EC.visibilityOf($(this.selectors.department)));
        return await $(this.selectors.department).getAttribute('disabled') == 'true';
    }

    async isOwnerGroupDropDownDisabled(): Promise<boolean> {
        await browser.wait(this.EC.visibilityOf($(this.selectors.ownerGroup)));
        return await $(this.selectors.ownerGroup).getAttribute('disabled') == 'true';
    }

    async isStatusDropDownDisabled(): Promise<boolean> {
        await browser.wait(this.EC.visibilityOf($(this.selectors.status)));
        // return await $(this.selectors.status).getAttribute('aria-disabled') == 'true';
        return await $(this.selectors.status).isEnabled();
    }

    async isShareExternallyToogleButtonDisabled(): Promise<boolean> {
        await browser.wait(this.EC.visibilityOf($(this.selectors.shareExternallyToggleButton)));
        return await $(this.selectors.shareExternallyToggleButton).getAttribute('disabled') == 'true';
    }

    async isKeywordsFieldDisabled(): Promise<boolean> {
        await browser.wait(this.EC.visibilityOf($(this.selectors.keywords)));
        return await $(this.selectors.keywords).getAttribute('disabled') == 'true';
    }

    async clickOnAdditionalDetailsOrReadAccessTab(tabName: string): Promise<void> {
        await browser.wait(this.EC.elementToBeClickable($(this.selectors.tabs)));
        await element(by.cssContainingText(this.selectors.tabs, tabName)).click();
    }

    async isCategoryTier1Disabled(): Promise<boolean> {
        await browser.wait(this.EC.visibilityOf($(this.selectors.categoryTier1)));
        return await $(this.selectors.categoryTier1).getAttribute('disabled') == 'true';
    }

    async isCategoryTier2Disabled(): Promise<boolean> {
        await browser.wait(this.EC.visibilityOf($(this.selectors.categoryTier2)));
        return await $(this.selectors.categoryTier2).getAttribute('disabled') == 'true';
    }

    async isCategoryTier3Disabled(): Promise<boolean> {
        await browser.wait(this.EC.visibilityOf($(this.selectors.categoryTier3)));
        return await $(this.selectors.categoryTier3).getAttribute('disabled') == 'true';
    }

    async isCategoryTier4Disabled(): Promise<boolean> {
        await browser.wait(this.EC.visibilityOf($(this.selectors.categoryTier4)));
        return await $(this.selectors.categoryTier4).getAttribute('disabled') == 'true';
    }

    async isRegionDropDownDisabled(): Promise<boolean> {
        await browser.wait(this.EC.visibilityOf($(this.selectors.region)));
        return await $(this.selectors.region).getAttribute('disabled') == 'true';
    }

    async isSiteDropDownDisabled(): Promise<boolean> {
        await browser.wait(this.EC.visibilityOf($(this.selectors.site)));
        return await $(this.selectors.site).getAttribute('disabled') == 'true';
    }

    async isSupportGroupAccessGroupButtonDisabled(): Promise<boolean> {
        await browser.wait(this.EC.visibilityOf($(this.selectors.supportGroupAccessGroupButton)));
        return await $(this.selectors.supportGroupAccessGroupButton).getAttribute('disabled') == 'true';
    }

    async isAddCompanyDropDownDisabled(): Promise<boolean> {
        await browser.wait(this.EC.visibilityOf($(this.selectors.addCompany)));
        return await $(this.selectors.addCompany).getAttribute('disabled') == 'true';
    }

    async isAddCompanyAddButtonDisabled(): Promise<boolean> {
        await browser.wait(this.EC.visibilityOf($(this.selectors.addCompanyAddButton)));
        return await $(this.selectors.addCompanyAddButton).getAttribute('disabled') == 'true';
    }

    async isAddBussinessUnitDropDownDisabled(): Promise<boolean> {
        await browser.wait(this.EC.visibilityOf($(this.selectors.addBussinessUnit)));
        return await $(this.selectors.addBussinessUnit).getAttribute('disabled') == 'true';
    }

    async isAddBussinessUnitAddButtonDisabled(): Promise<boolean> {
        await browser.wait(this.EC.visibilityOf($(this.selectors.addBussinessUnitAddButton)));
        return await $(this.selectors.addBussinessUnitAddButton).getAttribute('disabled') == 'true';
    }

    async isAddSupportDepartmentDropDownDisabled(): Promise<boolean> {
        await browser.wait(this.EC.visibilityOf($(this.selectors.addSupportDepartment)));
        return await $(this.selectors.addSupportDepartment).getAttribute('disabled') == 'true';
    }

    async isAddSupportDepartmentAddButtonDisabled(): Promise<boolean> {
        await browser.wait(this.EC.visibilityOf($(this.selectors.addSupportDepartmentAddButton)));
        return await $(this.selectors.addSupportDepartmentAddButton).getAttribute('disabled') == 'true';
    }

    async isaddSupportGroupDropDownDisabled(): Promise<boolean> {
        await browser.wait(this.EC.visibilityOf($(this.selectors.addSupportGroup)));
        return await $(this.selectors.addSupportGroup).getAttribute('disabled') == 'true';
    }

    async isAddSupportGroupAddButtonDisabled(): Promise<boolean> {
        await browser.wait(this.EC.visibilityOf($(this.selectors.addSupportGroupAddButton)));
        return await $(this.selectors.addSupportGroupAddButton).getAttribute('disabled') == 'true';
    }

    async isDeleteButtonDisplayed(): Promise<boolean> {
        await browser.wait(this.EC.elementToBeClickable($(this.selectors.cancelButton)));
        return await $(this.selectors.deleteButton).isDisplayed();
    }

    async isSaveButtonDisplayed(): Promise<boolean> {
        await browser.wait(this.EC.visibilityOf($(this.selectors.saveButton)));
        return await $(this.selectors.saveButton).isDisplayed();
    }

    async isCancelButtonDisplayed(): Promise<boolean> {
        await browser.wait(this.EC.visibilityOf($(this.selectors.cancelButton)));
        return await $(this.selectors.cancelButton).isDisplayed();
    }

    async isAttachmentFieldDisplayed(): Promise<boolean> {
        await browser.wait(this.EC.visibilityOf($(this.selectors.attachmentField)));
        return await $(this.selectors.attachmentField).isDisplayed();
    }

    async isTitleTextBoxDisplayed(): Promise<boolean> {
        await browser.wait(this.EC.visibilityOf($(this.selectors.titleTextBox)));
        return await $(this.selectors.titleTextBox).isDisplayed();
    }

    async isCompanyDropDownDisplayed(): Promise<boolean> {
        await browser.wait(this.EC.visibilityOf($(this.selectors.company)));
        return await $(this.selectors.company).isDisplayed();
    }

    async isBussinessUnitDropDownDisplayed(): Promise<boolean> {
        await browser.wait(this.EC.visibilityOf($(this.selectors.bussinessUnit)));
        return await $(this.selectors.bussinessUnit).isDisplayed();
    }

    async isDepartmentDropDownDisplayed(): Promise<boolean> {
        await browser.wait(this.EC.visibilityOf($(this.selectors.department)));
        return await $(this.selectors.department).isDisplayed();
    }

    async isOwnerGroupDropDownDisplayed(): Promise<boolean> {
        await browser.wait(this.EC.visibilityOf($(this.selectors.ownerGroup)));
        return await $(this.selectors.ownerGroup).isDisplayed();
    }

    async isStatusDropDownDisplayed(): Promise<boolean> {
        await browser.wait(this.EC.visibilityOf($(this.selectors.status)));
        return await $(this.selectors.status).isDisplayed();
    }

    async isShareExternallyToogleButtonDisplayed(): Promise<boolean> {
        await browser.wait(this.EC.visibilityOf($(this.selectors.shareExternallyToggleButton)));
        return await $(this.selectors.shareExternallyToggleButton).isDisplayed();
    }

    async isKeywordsFieldDisplayed(): Promise<boolean> {
        await browser.wait(this.EC.visibilityOf($(this.selectors.keywords)));
        return await $(this.selectors.keywords).isDisplayed();
    }

    async isCategoryTier1Displayed(): Promise<boolean> {
        await browser.wait(this.EC.visibilityOf($(this.selectors.categoryTier1)));
        return await $(this.selectors.categoryTier1).isDisplayed();
    }

    async isCategoryTier2Displayed(): Promise<boolean> {
        await browser.wait(this.EC.visibilityOf($(this.selectors.categoryTier2)));
        return await $(this.selectors.categoryTier2).isDisplayed();
    }

    async isCategoryTier3Displayed(): Promise<boolean> {
        await browser.wait(this.EC.visibilityOf($(this.selectors.categoryTier3)));
        return await $(this.selectors.categoryTier3).isDisplayed();
    }

    async isCategoryTier4Displayed(): Promise<boolean> {
        await browser.wait(this.EC.visibilityOf($(this.selectors.categoryTier4)));
        return await $(this.selectors.categoryTier4).isDisplayed();
    }

    async isRegionDropDownDisplayed(): Promise<boolean> {
        await browser.wait(this.EC.visibilityOf($(this.selectors.region)));
        return await $(this.selectors.region).isDisplayed();
    }

    async isSiteDropDownDisplayed(): Promise<boolean> {
        await browser.wait(this.EC.visibilityOf($(this.selectors.site)));
        return await $(this.selectors.site).isDisplayed();
    }

    async isSupportGroupAccessGroupButtonDisplayed(): Promise<boolean> {
        await browser.wait(this.EC.visibilityOf($(this.selectors.supportGroupAccessGroupButton)));
        return await $(this.selectors.supportGroupAccessGroupButton).isDisplayed();
    }

    async isAddCompanyDropDownDisplayed(): Promise<boolean> {
        await browser.wait(this.EC.visibilityOf($(this.selectors.addCompany)));
        return await $(this.selectors.addCompany).isDisplayed();
    }

    async isAddCompanyAddButtonDisplayed(): Promise<boolean> {
        await browser.wait(this.EC.visibilityOf($(this.selectors.addCompanyAddButton)));
        return await $(this.selectors.addCompanyAddButton).isDisplayed();
    }

    async isAddBussinessUnitDropDownDisplayed(): Promise<boolean> {
        await browser.wait(this.EC.visibilityOf($(this.selectors.addBussinessUnit)));
        return await $(this.selectors.addBussinessUnit).isDisplayed();
    }

    async isAddBussinessUnitAddButtonDisplayed(): Promise<boolean> {
        await browser.wait(this.EC.visibilityOf($(this.selectors.addBussinessUnitAddButton)));
        return await $(this.selectors.addBussinessUnitAddButton).isDisplayed();
    }

    async isAddSupportDepartmentDropDownDisplayed(): Promise<boolean> {
        await browser.wait(this.EC.visibilityOf($(this.selectors.addSupportDepartment)));
        return await $(this.selectors.addSupportDepartment).isDisplayed();
    }

    async isAddSupportDepartmentAddButtonDisplayed(): Promise<boolean> {
        await browser.wait(this.EC.visibilityOf($(this.selectors.addSupportDepartmentAddButton)));
        return await $(this.selectors.addSupportDepartmentAddButton).isDisplayed();
    }

    async isAddSupportGroupDropDownDisplayed(): Promise<boolean> {
        await browser.wait(this.EC.visibilityOf($(this.selectors.addSupportGroup)));
        return await $(this.selectors.addSupportGroup).isDisplayed();
    }

    async isAddSupportGroupAddButtonDisplayed(): Promise<boolean> {
        await browser.wait(this.EC.visibilityOf($(this.selectors.addSupportGroupAddButton)));
        return await $(this.selectors.addSupportGroupAddButton).isDisplayed();
    }
}

export default new EditDocumentLibraryPage();