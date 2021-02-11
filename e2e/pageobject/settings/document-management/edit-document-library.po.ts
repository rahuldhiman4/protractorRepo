import { $, $$, browser, by, element, protractor, ProtractorExpectedConditions } from "protractor";
import utilityCommon from '../../../utils/utility.common';

class EditDocumentLibraryPage {
    EC: ProtractorExpectedConditions = protractor.ExpectedConditions;
    selectors = {
        titleTextBox: '[rx-view-component-id="64f47195-458a-43ee-8169-cab57666a856"] input',
        company: '[rx-view-component-id="0484edce-0480-421f-9d7f-105447889a49"] button',
        ownerGroup: '[rx-view-component-id="fba3b3b6-a710-44ba-a65d-bc027aaed776"] button',
        ownerGroupGuid: 'fba3b3b6-a710-44ba-a65d-bc027aaed776',
        statusGuid: '0a8b7179-dd0a-47f9-8515-7c7aceda3118',
        status: '[rx-view-component-id="0a8b7179-dd0a-47f9-8515-7c7aceda3118"] button',
        saveButton: '[rx-view-component-id="8035353f-acb0-4bb5-a5c5-fe7626c01b3e"] button',
        deleteButton: '.bwf-attachment-viewer .d-icon-cross',
        cancelButton: '[rx-view-component-id="61a48596-d3c0-462d-825b-4d6172e351b3"] button',
        deleteDocWarningMsg: '[rx-view-component-id="c652354a-1524-4235-b1db-6b397fc9699a"] span',
        deleteDocWarningMsgYesButton: '[rx-view-component-id="e40ad54c-ad9a-480a-aa63-a8b399caf20e"] button',
        attachmentField: '[rx-view-component-id="8cfc0c35-081a-40cb-ae85-527045bede0c"] button',
        bussinessUnit: '[rx-view-component-id="86e2e239-6f18-416b-b3e4-3a1a60155443"] .btn',
        shareExternallyToggleButton: '[rx-view-component-id="422e33d2-be19-42f7-985b-af73daf4d87f"] button',
        shareExternallyToggleButtonGuid: '422e33d2-be19-42f7-985b-af73daf4d87f',
        keywords: '[rx-view-component-id="3d940c59-00f7-477a-915b-b1e7fc8a91f6"] .adapt-mt-item',
        categoryTier1: '[rx-view-component-id="1152892f-a3af-44e3-807d-abb4c0980aa5"] button',
        categoryTier1Guid: '1152892f-a3af-44e3-807d-abb4c0980aa5',
        categoryTier2: '[rx-view-component-id="28db9a0c-f87e-402a-88fe-35087e0fc777"] button',
        categoryTier3: '[rx-view-component-id="648c0f80-5d82-4430-ae8d-67be4a6cb158"] button',
        categoryTier4: '[rx-view-component-id="4abcb2f3-a730-4e34-8126-52ff2c2888c2"] button',
        categorTier4Guid: '4abcb2f3-a730-4e34-8126-52ff2c2888c2',
        region: '[rx-view-component-id="14f9b86f-8225-44a1-aa29-b6b463244f01"] button',
        regionGuid: '14f9b86f-8225-44a1-aa29-b6b463244f01',
        site: '[rx-view-component-id="34a2bb5b-dff7-4dcb-a873-ee13e02abf85"] button',
        siteGuid: '34a2bb5b-dff7-4dcb-a873-ee13e02abf85',
        businessUnitGuid: '86e2e239-6f18-416b-b3e4-3a1a60155443',
        tabs: 'ul[role="tablist"] li',
        supportGroupAccessButton: '.rx-case-access-block .ac-manage-support',
        addCompany: 'button[id="rx-select-31"]',
        addCompanyAddButton: 'span[class="input-group-btn ng-tns-c606-284"] button',
        addBussinessUnit: '.ac-business-unit-field .dropdown-toggle',
        addBussinessUnitAddButton: '.flex-item .ac-business-unit-add',
        addSupportDepartment: '.ac-support-department-field button',
        addSupportDepartmentAddButton: '.ac-support-department-add',
        addSupportGroup: 'button[id="rx-select-29"]',
        addSupportGroupAddButton: 'span[class="input-group-btn ng-tns-c606-284"] button',
        attachedItem: '[rx-view-component-id="8cfc0c35-081a-40cb-ae85-527045bede0c"] .bwf-attachment-container__thumbnail',
        addCompanyGuid: '3fa92444-5e60-4ac2-9f4e-aab0e2acfc31',
        removeGroupAccessWarningMsg: '.ac-remove-group-access-massage span[ng-bind-html="groupRemoveMessage"]',
        removeGroupWarningMsgYesButton: '.ac-remove-group-yes',
        groupAccessDropDownInput: '.flex-item .search-box [placeholder="Search Organizations"]',
        sameSupportGroupErrorMsg: '.ac-group-not-unique .rx-case-access-remove-text',
        readAcessCrossButton: '[rx-view-component-id="3fa92444-5e60-4ac2-9f4e-aab0e2acfc31"] .d-icon-cross:not([aria-hidden])',
        clickOnReadAccessDropDown: '.ui-select-bootstrap button',
        searchFieldReadAccessDropDown: '.field input',
        readAccessDropDownValue: '.options-box .options li',
        assignmentDropDownList: '.rx-assignment_modal_filters .rx-assignment-select',
        descriptionField: '[rx-view-component-id="407cbfa2-3ee5-457c-913f-53d561e3be8c"] textarea',
        lobValue: '[rx-view-component-id="274abed1-8498-4e92-b83b-bce68788f333"] .pull-left',
    }
    async setCategoryTier1(value: string): Promise<void> {
        await utilityCommon.selectDropDown(this.selectors.categoryTier1Guid, value);
    }

    async setRegion(value: string): Promise<void> {
        await utilityCommon.selectDropDown(this.selectors.regionGuid, value);
    }

    async setSite(value: string): Promise<void> {
        await utilityCommon.selectDropDown(this.selectors.siteGuid, value);
    }

    async setShareExternallyToggleButton(value: boolean): Promise<void> {
        await utilityCommon.selectToggleButton(this.selectors.shareExternallyToggleButtonGuid, value);
    }
    async selectBusinessUnit(bussinessUnit: string): Promise<void> {
        await utilityCommon.selectDropDown(this.selectors.businessUnitGuid, bussinessUnit)
    }
    async selectOwnerGroup(ownerGroup: string): Promise<void> {
        await utilityCommon.selectDropDown(this.selectors.ownerGroupGuid, ownerGroup);
    }

    async selectAddCompanyDropDownOfReadAccess(value: string): Promise<void> {
        await $$('.ui-select-bootstrap button').get(0).click();
        await $$('.field input').get(1).sendKeys(value);
        await element(by.cssContainingText(this.selectors.readAccessDropDownValue, value)).click();
    }

    async selectAddBusinessUnitDropDownOfReadAccess(value: string): Promise<void> {
        await this.selectAddReadAccess(value, 1);
    }

    async selectAddSupportDepartmentDropDownOfReadAccess(value: string): Promise<void> {
        await this.selectAddReadAccess(value, 2);
    }

    async selectAddSupportGroupDropDownOfReadAccess(value: string): Promise<void> {
        await this.selectAddReadAccess(value, 3);
    }

    async selectAddReadAccess(value: string, index: number): Promise<void> {
        await $$('.ui-select-bootstrap button').get(index).click();
        await $$('.field input').get(index+1).sendKeys(value);
        let readAccessDropDownLocator = this.selectors.readAccessDropDownValue;
        await browser.wait(this.EC.elementToBeClickable(await element(by.cssContainingText(readAccessDropDownLocator, value))), 3000).then(async function () {
            await element(by.cssContainingText(readAccessDropDownLocator, value)).click();
        });
    }

    async sameSupportGroupErrorMessageDisplayed(message: string): Promise<boolean> {
        //        await browser.wait(this.EC.elementToBeClickable($(this.selectors.sameSupportGroupErrorMsg)));
        return await (element(by.cssContainingText(this.selectors.sameSupportGroupErrorMsg, message))).isDisplayed();
    }

    async updateKeywordField(value: string): Promise<void> {
        //        await browser.wait(this.EC.elementToBeClickable($(this.selectors.keywords)));
        await $(this.selectors.keywords).sendKeys(value);
        await this.clickOnAdditionalDetailsOrReadAccessTab('Additional Details');
    }

    async clickOnSupportGroupAccessButton(): Promise<void> {
        //        await browser.wait(this.EC.elementToBeClickable($(this.selectors.supportGroupAccessButton)));
        await $(this.selectors.supportGroupAccessButton).click();
    }

    async clickOnRemoveGroupWarningMsgYesButton(): Promise<void> {
        //        await browser.wait(this.EC.elementToBeClickable($(this.selectors.removeGroupWarningMsgYesButton)));
        await $(this.selectors.removeGroupWarningMsgYesButton).click();
    }

    async isRemoveGroupAccessWarningMessageDisplayed(message: string): Promise<boolean> {
        //        await browser.wait(this.EC.visibilityOf($(this.selectors.removeGroupAccessWarningMsg)));
        return await element(by.cssContainingText((this.selectors.removeGroupAccessWarningMsg), message)).isDisplayed();
    }

    async closeGroupAccessTag(accessName: string): Promise<void> {
        let loopingLocator =await $$('.rx-case-access-group-list.ac-access-group-list li').count();
        for (let i = 0; i < loopingLocator; i++) {
            let parentOne= $$('.rx-case-access-group-list.ac-access-group-list li');
            let textName= await parentOne.get(i).$('.rx-case-access-name').getText();
            if (textName == accessName) {
                await parentOne.get(i).$('.d-icon-cross').click();
                break;
            }
        }
    }
    async clearDropDownOfSupportGroupAccessDropDown(dropDownName: string): Promise<void> {
        //        await browser.wait(this.EC.visibilityOf($(this.selectors.addCompany)));
        let customxpath = `(//label[@aria-label="${dropDownName}"]//parent::div//span[@class="cross d-icon-cross"])`;
        await element(by.xpath(customxpath)).click();
    }

    async clickOnReadAccessAddButton(dropdownName: string): Promise<void> {
        //        await browser.wait(this.EC.visibilityOf($(this.selectors.addCompanyAddButton)));
        if (dropdownName == 'Add Company') {
            //            await browser.wait(this.EC.elementToBeClickable($(this.selectors.addCompanyAddButton)));
            await $$(this.selectors.addCompanyAddButton).get(0).click();
            //            await utilityCommon.waitUntilSpinnerToHide();
            //            await browser.wait(this.EC.elementToBeClickable($(this.selectors.readAcessCrossButton)));
        }
        else if (dropdownName == 'Add Business Unit') {
            //            await browser.wait(this.EC.elementToBeClickable($(this.selectors.addBussinessUnitAddButton)));
            await $(this.selectors.addBussinessUnitAddButton).click();
            //            await utilityCommon.waitUntilSpinnerToHide();
            //            await browser.wait(this.EC.elementToBeClickable($(this.selectors.readAcessCrossButton)));
        }

        else if (dropdownName == 'Add Support Department') {
            //            await browser.wait(this.EC.elementToBeClickable($(this.selectors.addSupportDepartmentAddButton)));
            await $(this.selectors.addSupportDepartmentAddButton).click();
            //            await utilityCommon.waitUntilSpinnerToHide();
            //            await browser.wait(this.EC.elementToBeClickable($(this.selectors.readAcessCrossButton)));
        }

        else if (dropdownName == 'Add Support Group') {
            //            await browser.wait(this.EC.elementToBeClickable($(this.selectors.addSupportGroupAddButton)));
            await $$(this.selectors.addSupportGroupAddButton).get(1).click();
            //            await utilityCommon.waitUntilSpinnerToHide();
            //            await browser.wait(this.EC.elementToBeClickable($(this.selectors.readAcessCrossButton)));
        }
        else {
            console.log('Drop down values does not match')
        }
    }

    async selectSupportGroupDropDownValue(value: string): Promise<void> {
        //        await browser.wait(this.EC.visibilityOf($(this.selectors.addSupportGroup)));
        await utilityCommon.selectDropDown(this.selectors.addSupportGroup, value);
    }

    async clickOnSupportGroupAddButton(): Promise<void> {
        //        await browser.wait(this.EC.visibilityOf($(this.selectors.addSupportGroupAddButton)));
        await $$(this.selectors.addSupportGroupAddButton).get(1).click();

    }

    async isStatusDropDownvalueMatches(dropDownValues: string[]): Promise<boolean> {
        //        await browser.wait(this.EC.visibilityOf($(this.selectors.cancelButton)));
        return await utilityCommon.isAllDropDownValuesMatches(this.selectors.statusGuid, dropDownValues)
    }

    async getDeleteWarningMsgText(message: string): Promise<string> {
        //        await browser.wait(this.EC.visibilityOf($(this.selectors.deleteDocWarningMsg)));
        return await element(by.cssContainingText((this.selectors.deleteDocWarningMsg), message)).getText();
    }

    async clickOnYesButtonOfDeleteWarningMsg(): Promise<void> {
        //        await browser.wait(this.EC.elementToBeClickable($(this.selectors.deleteDocWarningMsgYesButton)));
        await $(this.selectors.deleteDocWarningMsgYesButton).click();
    }

    async selectStatus(status: string): Promise<void> {
        await utilityCommon.selectDropDown(this.selectors.statusGuid, status);
    }

    async clickOnSaveButton(): Promise<void> {
        //        await browser.wait(this.EC.elementToBeClickable($(this.selectors.saveButton)));
        await $(this.selectors.saveButton).click();
    }

    async clickOnDeleteButton(): Promise<void> {
        //        await browser.wait(this.EC.elementToBeClickable($(this.selectors.deleteButton)));
        await $(this.selectors.deleteButton).click();
    }

    async clickOnCancelButton(): Promise<void> {
        //        await browser.wait(this.EC.elementToBeClickable($(this.selectors.cancelButton)));
        await $(this.selectors.cancelButton).click();
    }

    async isDeleteButtonEnabled(): Promise<boolean> {
        //        await browser.wait(this.EC.visibilityOf($(this.selectors.deleteButton)));
        return await $(this.selectors.deleteButton).isEnabled();
    }

    async isSaveButtonEnabled(): Promise<boolean> {
        //        await browser.wait(this.EC.visibilityOf($(this.selectors.saveButton)));
        return await $(this.selectors.saveButton).isEnabled();
    }

    async isAttachmentFieldDisabled(): Promise<boolean> {
        //        await browser.wait(this.EC.visibilityOf($(this.selectors.attachmentField)));
        return await $(this.selectors.attachmentField).getAttribute('disabled') == 'true';
    }

    async isTitleTextBoxDisabled(): Promise<boolean> {
        //        await browser.wait(this.EC.visibilityOf($(this.selectors.titleTextBox)));
        return await $(this.selectors.titleTextBox).getAttribute('readonly') == 'true';
    }

    async setTitle(title: string): Promise<void> {
        //        await browser.wait(this.EC.visibilityOf($(this.selectors.titleTextBox)));
        await $(this.selectors.titleTextBox).clear();
        await $(this.selectors.titleTextBox).sendKeys(title);

    }

    async isCompanyDropDownDisabled(): Promise<boolean> {
        //        await browser.wait(this.EC.visibilityOf($(this.selectors.company)));
        return await $(this.selectors.company).getAttribute('aria-disabled') == 'true';
    }

    async isBussinessUnitDropDownDisabled(): Promise<boolean> {
        //        await browser.wait(this.EC.visibilityOf($(this.selectors.bussinessUnit)));
        return await $(this.selectors.bussinessUnit).getAttribute('disabled') == 'true';
    }

    async isOwnerGroupDropDownDisabled(): Promise<boolean> {
        //        await browser.wait(this.EC.visibilityOf($(this.selectors.ownerGroup)));
        return await $(this.selectors.ownerGroup).getAttribute('disabled') == 'true';
    }

    async isStatusDropDownDisabled(): Promise<boolean> {
        //        await browser.wait(this.EC.visibilityOf($(this.selectors.status)));
        return await $(this.selectors.status).getAttribute('aria-disabled') == 'true';
    }

    async isShareExternallyToogleButtonDisabled(): Promise<boolean> {
        //        await browser.wait(this.EC.visibilityOf($(this.selectors.shareExternallyToggleButton)));
        return await $(this.selectors.shareExternallyToggleButton).getAttribute('disabled') == 'true';
    }

    async isKeywordsFieldEnabled(): Promise<boolean> {
        //        await browser.wait(this.EC.visibilityOf($(this.selectors.keywords)));
        return await $(this.selectors.keywords).isEnabled();
    }

    async clickOnAdditionalDetailsOrReadAccessTab(tabName: string): Promise<void> {
        //        await browser.wait(this.EC.elementToBeClickable($(this.selectors.tabs)));
        await element(by.cssContainingText(this.selectors.tabs, tabName)).click();
    }

    async isCategoryTier1Disabled(): Promise<boolean> {
        //        await browser.wait(this.EC.visibilityOf($(this.selectors.categoryTier1)));
        return await $(this.selectors.categoryTier1).getAttribute('disabled') == 'true';
    }

    async isCategoryTier2Disabled(): Promise<boolean> {
        //        await browser.wait(this.EC.visibilityOf($(this.selectors.categoryTier2)));
        return await $(this.selectors.categoryTier2).getAttribute('disabled') == 'true';
    }

    async isCategoryTier3Disabled(): Promise<boolean> {
        //        await browser.wait(this.EC.visibilityOf($(this.selectors.categoryTier3)));
        return await $(this.selectors.categoryTier3).getAttribute('disabled') == 'true';
    }

    async isCategoryTier4Disabled(): Promise<boolean> {
        //        await browser.wait(this.EC.visibilityOf($(this.selectors.categoryTier4)));
        return await $(this.selectors.categoryTier4).getAttribute('disabled') == 'true';
    }

    async isRegionDropDownDisabled(): Promise<boolean> {
        //        await browser.wait(this.EC.visibilityOf($(this.selectors.region)));
        return await $(this.selectors.region).getAttribute('disabled') == 'true';
    }

    async isSiteDropDownDisabled(): Promise<boolean> {
        //        await browser.wait(this.EC.visibilityOf($(this.selectors.site)));
        return await $(this.selectors.site).getAttribute('disabled') == 'true';
    }

    async isAddCompanyDropDownDisabled(): Promise<boolean> {
        //        await browser.wait(this.EC.visibilityOf($(this.selectors.addCompany)));
        return await $(this.selectors.addCompany).getAttribute('disabled') == 'true';
    }

    async isAddCompanyAddButtonDisabled(): Promise<boolean> {
        //        await browser.wait(this.EC.visibilityOf($(this.selectors.addCompanyAddButton)));
        return await $$(this.selectors.addCompanyAddButton).get(0).getAttribute('disabled') == 'true';
    }

    async isAddBussinessUnitDropDownDisabled(): Promise<boolean> {
        //        await browser.wait(this.EC.visibilityOf($(this.selectors.addBussinessUnit)));
        return await $(this.selectors.addBussinessUnit).getAttribute('disabled') == 'true';
    }

    async isAddBussinessUnitAddButtonDisabled(): Promise<boolean> {
        //        await browser.wait(this.EC.visibilityOf($(this.selectors.addBussinessUnitAddButton)));
        return await $(this.selectors.addBussinessUnitAddButton).getAttribute('disabled') == 'true';
    }

    async isAddSupportDepartmentDropDownDisabled(): Promise<boolean> {
        //        await browser.wait(this.EC.visibilityOf($(this.selectors.addSupportDepartment)));
        return await $(this.selectors.addSupportDepartment).getAttribute('disabled') == 'true';
    }

    async isAddSupportDepartmentAddButtonDisabled(): Promise<boolean> {
        //        await browser.wait(this.EC.visibilityOf($(this.selectors.addSupportDepartmentAddButton)));
        return await $(this.selectors.addSupportDepartmentAddButton).getAttribute('disabled') == 'true';
    }

    async isaddSupportGroupDropDownDisabled(): Promise<boolean> {
        //        await browser.wait(this.EC.visibilityOf($(this.selectors.addSupportGroup)));
        return await $(this.selectors.addSupportGroup).getAttribute('disabled') == 'true';
    }

    async isAddSupportGroupAddButtonDisabled(): Promise<boolean> {
        //        await browser.wait(this.EC.visibilityOf($(this.selectors.addSupportGroupAddButton)));
        return await $$(this.selectors.addSupportGroupAddButton).get(1).getAttribute('disabled') == 'true';
    }

    async isDeleteButtonDisplayed(): Promise<boolean> {
        //        await browser.wait(this.EC.elementToBeClickable($(this.selectors.cancelButton)));
        return await $(this.selectors.deleteButton).isDisplayed();
    }

    async isSaveButtonDisplayed(): Promise<boolean> {
        //        await browser.wait(this.EC.visibilityOf($(this.selectors.saveButton)));
        return await $(this.selectors.saveButton).isDisplayed();
    }

    async isCancelButtonDisplayed(): Promise<boolean> {
        //        await browser.wait(this.EC.visibilityOf($(this.selectors.cancelButton)));
        return await $(this.selectors.cancelButton).isDisplayed();
    }

    async isAttachmentFieldDisplayed(): Promise<boolean> {
        //        await browser.wait(this.EC.visibilityOf($(this.selectors.attachmentField)));
        return await $(this.selectors.attachmentField).isDisplayed();
    }

    async isAttachedItemDisplayed(): Promise<boolean> {
        //        await browser.wait(this.EC.visibilityOf($(this.selectors.attachmentField)));
        return await $(this.selectors.attachmentField).isDisplayed();
    }

    async isTitleTextBoxDisplayed(): Promise<boolean> {
        //        await browser.wait(this.EC.visibilityOf($(this.selectors.titleTextBox)));
        return await $(this.selectors.titleTextBox).isDisplayed();
    }

    async isCompanyDropDownDisplayed(): Promise<boolean> {
        //        await browser.wait(this.EC.visibilityOf($(this.selectors.company)));
        return await $(this.selectors.company).isDisplayed();
    }

    async isBussinessUnitDropDownDisplayed(): Promise<boolean> {
        //        await browser.wait(this.EC.visibilityOf($(this.selectors.bussinessUnit)));
        return await $(this.selectors.bussinessUnit).isDisplayed();
    }

    async isOwnerGroupDropDownDisplayed(): Promise<boolean> {
        //        await browser.wait(this.EC.visibilityOf($(this.selectors.ownerGroup)));
        return await $(this.selectors.ownerGroup).isDisplayed();
    }

    async isStatusDropDownDisplayed(): Promise<boolean> {
        //        await browser.wait(this.EC.visibilityOf($(this.selectors.status)));
        return await $(this.selectors.status).isDisplayed();
    }

    async isShareExternallyToogleButtonDisplayed(): Promise<boolean> {
        //        await browser.wait(this.EC.visibilityOf($(this.selectors.shareExternallyToggleButton)));
        return await $(this.selectors.shareExternallyToggleButton).isDisplayed();
    }

    async isKeywordsFieldDisplayed(): Promise<boolean> {
        //        await browser.wait(this.EC.visibilityOf($(this.selectors.keywords)));
        return await $(this.selectors.keywords).isDisplayed();
    }

    async isCategoryTier1Displayed(): Promise<boolean> {
        //        await browser.wait(this.EC.visibilityOf($(this.selectors.categoryTier1)));
        return await $(this.selectors.categoryTier1).isDisplayed();
    }

    async isCategoryTier2Displayed(): Promise<boolean> {
        //        await browser.wait(this.EC.visibilityOf($(this.selectors.categoryTier2)));
        return await $(this.selectors.categoryTier2).isDisplayed();
    }

    async isCategoryTier3Displayed(): Promise<boolean> {
        //        await browser.wait(this.EC.visibilityOf($(this.selectors.categoryTier3)));
        return await $(this.selectors.categoryTier3).isDisplayed();
    }

    async isCategoryTier4Displayed(): Promise<boolean> {
        //        await browser.wait(this.EC.visibilityOf($(this.selectors.categoryTier4)));
        return await $(this.selectors.categoryTier4).isDisplayed();
    }

    async isRegionDropDownDisplayed(): Promise<boolean> {
        //        await browser.wait(this.EC.visibilityOf($(this.selectors.region)));
        return await $(this.selectors.region).isDisplayed();
    }

    async isSiteDropDownDisplayed(): Promise<boolean> {
        //        await browser.wait(this.EC.visibilityOf($(this.selectors.site)));
        return await $(this.selectors.site).isDisplayed();
    }

    async isSupportGroupAccessButtonDisplayed(): Promise<boolean> {
        //        await browser.wait(this.EC.visibilityOf($(this.selectors.supportGroupAccessButton)));
        return await $(this.selectors.supportGroupAccessButton).isDisplayed();
    }

    async isAddCompanyDropDownDisplayed(): Promise<boolean> {
        //        await browser.wait(this.EC.visibilityOf($(this.selectors.addCompany)));
        return await $(this.selectors.addCompany).isDisplayed();
    }

    async isAddCompanyAddButtonDisplayed(): Promise<boolean> {
        //        await browser.wait(this.EC.visibilityOf($(this.selectors.addCompanyAddButton)));
        return await $(this.selectors.addCompanyAddButton).get(0).isDisplayed();
    }

    async isAddBussinessUnitDropDownDisplayed(): Promise<boolean> {
        //        await browser.wait(this.EC.visibilityOf($(this.selectors.addBussinessUnit)));
        return await $(this.selectors.addBussinessUnit).isDisplayed();
    }

    async isAddBussinessUnitAddButtonDisplayed(): Promise<boolean> {
        //        await browser.wait(this.EC.visibilityOf($(this.selectors.addBussinessUnitAddButton)));
        return await $(this.selectors.addBussinessUnitAddButton).isDisplayed();
    }

    async isAddSupportDepartmentDropDownDisplayed(): Promise<boolean> {
        //        await browser.wait(this.EC.visibilityOf($(this.selectors.addSupportDepartment)));
        return await $(this.selectors.addSupportDepartment).isDisplayed();
    }

    async isAddSupportDepartmentAddButtonDisplayed(): Promise<boolean> {
        //        await browser.wait(this.EC.visibilityOf($(this.selectors.addSupportDepartmentAddButton)));
        return await $(this.selectors.addSupportDepartmentAddButton).isDisplayed();
    }

    async isAddSupportGroupDropDownDisplayed(): Promise<boolean> {
        //        await browser.wait(this.EC.visibilityOf($(this.selectors.addSupportGroup)));
        return await $(this.selectors.addSupportGroup).isDisplayed();
    }

    async isAddSupportGroupAddButtonDisplayed(): Promise<boolean> {
        //        await browser.wait(this.EC.visibilityOf($(this.selectors.addSupportGroupAddButton)));
        return await $$(this.selectors.addSupportGroupAddButton).get(1).isDisplayed();
    }

    async getRegionSelectedValue(fieldName: string): Promise<string> {
        return await utilityCommon.getSelectedFieldValue(fieldName);
    }

    async getSiteSelectedValue(fieldName: string): Promise<string> {
        return await utilityCommon.getSelectedFieldValue(fieldName);
    }

    async getCategoryTier4(): Promise<string> {
        return await $(`[rx-view-component-id="${this.selectors.categorTier4Guid}"] .ui-select-toggle`).getText();
    }

    async getLobValue(): Promise<string> {
        return await $(this.selectors.lobValue).getText();
    }
}

export default new EditDocumentLibraryPage();