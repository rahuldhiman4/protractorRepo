import { $, $$, by, element, browser, ProtractorExpectedConditions, By } from 'protractor';
import utilityCommon from '../../../utils/utility.common';
import utilityGrid from '../../../utils/utility.grid';
import { protractor } from 'protractor/built/ptor';
import { DropDownType } from '../../../utils/constants';

export class EditEmailConfig {
    EC: ProtractorExpectedConditions = protractor.ExpectedConditions;
    selectors = {
        selectTab: '[rx-view-component-id="1839db27-7f7d-4266-af9b-35cab3223382"] li',
        availableExclusionSubjectsCheckbox: '[rx-view-component-id="9429987c-3087-4aef-a68a-0d5738a4928e"] input[type="radio"]',
        newExclusiveSubjects: '[rx-view-component-id="1b6dd9a4-78f9-40c4-8b4b-42d85782cb1c"] button',
        newAvailableGlobalSubjects: '[rx-view-component-id="f9002d64-77ec-4a52-9786-1e1a75dfbe8c"] button',
        editEmailConfigGuid: '777cfc71-16a2-4c51-96a5-92c0f974155e',
        removeExclusiveSubject: '[rx-view-component-id="3e830938-202e-40a3-87f6-647c25ac7f7b"] button',
        editExclusiveSubject: '[rx-view-component-id="22c22bf8-34aa-4c38-aa73-8a14bee53380"] button',
        exclusiveSubjectGuid: '75ef6a19-343a-4387-a1d3-144ef4fdf110',
        searchAvailableEntitiesTextBox: '[class="list-group"] input[type="checkbox"]',
        listAvailableExclusionsSubjectInAssociatePublicExclusionSubjects: '[class="col-5"] li[class="list-group-item ng-star-inserted"]',
        searchAssociatedEntitiesToBeRemoveTextBox: '[rx-view-component-id="c6983ae5-50e0-4400-bd7b-0e8f590a931f"] input',
        listAssociatedExclusionsSubjectInAssociatePublicExclusionSubjects: '[class="col-5"] li[class="list-group-item ng-star-inserted"]',
        cancelEditEmailConfig: '[rx-view-component-id="bf51aff6-d0a3-484a-bed1-e11a78971aee"] button',
        closedAssociatePublicExclusionSubjects: '[rx-view-component-id="71177700-7a94-435f-b594-24ae7bc4e22b"] button',
        acknowledgementTemplateEditButton: '[rx-view-component-id="dd7a7212-432d-4c79-a33b-b7cc8abf787e"] button',
        saveAcknowledgementTemplate: '[rx-view-component-id="ae1f4f53-445e-4d4c-b6b9-13acc691b4b8"] button',
        cancelAcknowledgementTemplate: '[rx-view-component-id="e915b0ae-e0c2-44c8-9ab6-f0977c850d1c"] button',
        acknowledgementTemplateGuid: 'a5437a3a-3a11-4e07-8829-9cee403dca61',
        ticketTypeAcknowledgementTemplate: '[rx-view-component-id="5f00dfc8-9dc0-4521-befd-30f4d6d51ac5"] input',
        operationTypeAcknowledgementTemplate: '[rx-view-component-id="2353e82d-57fd-428b-acc6-7080c1561914"] input',
        ticketStatusAcknowledgementTemplate: '[rx-view-component-id="2db28354-0558-454d-b4d7-f781263a72e7"] input',
        associatedSupportGroupBuisnessGroupGuid: '09c5a9d8-2aa6-449c-a041-958432203c3c',
        associatedSupportGroupValueassociatedSupportGroup: '.association-list-spacing .km-group-list-item__info span',
        selectSupportGroup: '.km-group-list-item__icon-container i',
        associatedSupportGroup: '.bwf-association-actions button',
        supportGroupAssociatedSupportGroup: '.source-list-spacing .bottom-margin',
        associatedSupportGroupAssociatedSupportGroup: '.association-list-spacing .bottom-margin',
        associatedSupportGroupSearchResult: '.km-group-list-item__info span',
        saveEditEmailConfig: '[rx-view-component-id="e36471c2-f950-4df7-bc42-ed2bbf59898b"] button',
        acknowledgementTemplateGridGuid: '4938609e-47bd-460d-b32c-57dfc21958cd',
        defaultCaseTemplateGuid: 'b9089bf5-509d-4e51-a3a7-2fad413f87db',
        defaultCaseTemplatelist: '.rx-select__options button.dropdown-item',
        defaultCaseTemplateToUse: '[rx-view-component-id="b9089bf5-509d-4e51-a3a7-2fad413f87db"] button',
        searchDefaultCaseTemplateToUse: '.rx-select__search-wrapper input',
        clearDefaultCaseTemplateToUse: '[rx-view-component-id="b9089bf5-509d-4e51-a3a7-2fad413f87db"] button div',
        supportGroupCheckbox: '.record__list i',
        addTrustedEmailBtn: '[rx-view-component-id="0dfbc207-b03e-40ab-8e6b-c74f5609aa89"] button',
        newTrustedEmailId: '[rx-view-component-id="00fb62e7-3e31-4aba-b9b5-a60daec4db46"] input',
        newTrustedEmailIdGuid: '00fb62e7-3e31-4aba-b9b5-a60daec4db46',
        newTrustedEmailSaveBtn: '[rx-view-component-id="c0dcdafe-6d39-4c38-b26c-38ec48b9450f"] button',
        newTrustedEmailCancelBtn: '[rx-view-component-id="c8d38843-d953-4bdd-9913-b6210ee1daa4"] button',
        newTrustedEmailMappedRequesterGuid: '5021ef29-9cae-4538-bf9b-2907936a8c78',
        newTrustedEmailMappedRequesterInputBox: '[rx-view-component-id="5021ef29-9cae-4538-bf9b-2907936a8c78"] input',
        addBlockedEmail: '[rx-view-component-id="d7309e2b-06c2-46a6-85e0-8b8f83159f9a"] button',
        blockedEmailConsoleGuid: '8b8901bb-9678-4a27-80db-61d441aa8f13',
        createEmailTemplateLink: '[rx-view-component-id="010a2bf3-5b2d-4c72-9c33-fa26d3be6b78"] button',
        saveBlockedemail: '[rx-view-component-id="a5da25a9-a60f-4096-8655-9f3c0ed0190c"] button',
        deleteBlockedEmail: '[rx-view-component-id="30acf26f-75dd-4730-93ba-cce285732b54"] button',
        inputFieldAcknowledgementTemplate: '[rx-view-component-id="a5437a3a-3a11-4e07-8829-9cee403dca61"] input',
        acknowledgementTemplateList: '[rx-view-component-id="a5437a3a-3a11-4e07-8829-9cee403dca61"] button',
        trustedEmailConsoleGuid: '46526dc0-07f0-4dc6-abd3-80651dabd24f',
        editTrustedEmailButtonOnTrustedEmail: '[rx-view-component-id="c9e5d798-e0b2-49b2-89d8-5875209b29a6"] button',
        removeTrustedEmailButtonOnTrustedEmail: '[rx-view-component-id="d406d183-268a-4003-9b11-ceafd30ece44"] button',
        editTrustedEmailSaveButton: '[rx-view-component-id="39083019-c851-43f6-bcab-e6d9d59ac83d"]  button',
        editTrustedEmailCancelButton: '[rx-view-component-id="43790bdf-8e59-47d1-9b11-8577140da637"]  button',
        setEmailidOnEditTrusted: '[rx-view-component-id="ac869aba-620e-42a5-af4d-5ed1bd580a6e"] input',
        dropDownOption: '[rx-view-component-id="5021ef29-9cae-4538-bf9b-2907936a8c78"] button',
        description: '[rx-view-component-id="9d3c4cbf-faa9-4f65-834f-474b7c5c2a12"] input',
        emailIdNewBlockEmailId: '[rx-view-component-id="3b86d9d1-26a0-4fe1-8d36-57993ddeb25c"] input',
        lobValue: '[rx-view-component-id="61e76625-685a-41b7-9c41-fd7698a71570"] .pull-left',
        lob: '[rx-view-component-id="4c80a9f0-5051-4b85-a0a3-debcda8c7dd0"] button div',
        acknowledgementTemplateUpdate: '[rx-view-component-id="a5437a3a-3a11-4e07-8829-9cee403dca61"] button'
    }

    async clickDefaultMailIdCheckbox(value: string): Promise<void> {
        await $(`.d-button-group_small button[aria-label="${value}"]`).click();
    }

    async clickAvailableExclusionSubjectsCheckbox(): Promise<void> {
        await $(this.selectors.searchAvailableEntitiesTextBox).click();
    }

    async getSupportGroupFromSupportGroupListInAssociatedSupportGroupTab(): Promise<string> {
        return await $(this.selectors.associatedSupportGroupSearchResult).isPresent().then(async (present) => {
            if (present) return await $(this.selectors.associatedSupportGroupSearchResult).getText();
            else return null;
        });
    }

    async getAssociatedSupportGroupFromAssociatedSupportGroupListInAssociatedSupportGroupTab(): Promise<string> {
        return await $(this.selectors.associatedSupportGroupValueassociatedSupportGroup).isPresent().then(async (present) => {
            if (present) return await $(this.selectors.associatedSupportGroupValueassociatedSupportGroup).getText();
            else return null;
        });
    }

    async isSupportGroupListHeaderPresentInAssociatedSupportGroupTab(): Promise<boolean> {
        return await $(this.selectors.supportGroupAssociatedSupportGroup).isPresent();
    }

    async isColumnPresentInAcknowledgementTemplateGrid(header: string[]): Promise<boolean> {
        return await utilityGrid.areColumnHeaderMatches(header, this.selectors.acknowledgementTemplateGridGuid);
    }

    async isAssociatedSupportGroupListHeaderPresentInAssociatedSupportGroupTab(): Promise<boolean> {
        return await $(this.selectors.associatedSupportGroupAssociatedSupportGroup).isPresent();
    }

    async isTicketTypeAcknowledgementTemplateDisabled(): Promise<string> {
        return await $(this.selectors.ticketTypeAcknowledgementTemplate).getAttribute("readOnly");
    }

    async isOperationTypeAcknowledgementTemplateDisabled(): Promise<string> {
        return await $(this.selectors.operationTypeAcknowledgementTemplate).getAttribute("readOnly");
    }

    async isTicketStatusAcknowledgementTemplateDisabled(): Promise<string> {
        return await $(this.selectors.ticketStatusAcknowledgementTemplate).getAttribute("readOnly");
    }

    async selectTab(tabValue: string): Promise<void> {
        await element(by.cssContainingText(this.selectors.selectTab, tabValue)).click();
    }

    async selectDefaultCaseTemplate(tabValue: string): Promise<void> {
        await utilityCommon.selectDropDown(this.selectors.defaultCaseTemplateGuid, tabValue);
        await browser.sleep(500); // case template save takes little time ('save' word appears below the dropdown)
    }

    async clickSaveAcknowledgementTemplate(): Promise<void> {
        await $(this.selectors.saveAcknowledgementTemplate).click();
    }

    async clickSaveButton(): Promise<void> {
        await $(this.selectors.saveEditEmailConfig).click();
    }

    async isSaveButtonEnabled(): Promise<boolean> {
        return await $(this.selectors.saveEditEmailConfig).isEnabled();
    }

    async searchAvailableEntitiesToBeAssociated(searchvalue: string): Promise<void> {
        await $(this.selectors.searchAssociatedEntitiesToBeRemoveTextBox).clear();
        await $(this.selectors.searchAssociatedEntitiesToBeRemoveTextBox).sendKeys(searchvalue);
    }

    async isValueAvailableExclusionsSubjectInAssociatePublicExclusionSubjectsPresent(searchvalue?: string): Promise<boolean> {
        let loc = await $$('[rx-view-component-id="c6983ae5-50e0-4400-bd7b-0e8f590a931f"] .bwf-association-list').get(0);
        if (searchvalue) {
            return await loc.element(by.cssContainingText('.list-item', searchvalue)).isPresent().then(async (link) => {
                if (link) {
                    return await loc.element(by.cssContainingText('.list-item', searchvalue)).isDisplayed();
                } else return false;
            });
        } else
            return await loc.element(by.cssContainingText('.list-item', searchvalue)).count() < 1 ? false : true;
    }

    async isListAvailableExclusionsSubjectInAssociatePublicExclusionSubjectsPresent(): Promise<boolean> {
        let loc = await $$('[rx-view-component-id="c6983ae5-50e0-4400-bd7b-0e8f590a931f"] .bwf-association-list').get(0);
        return await loc.$('.list-item').isPresent().then(async (link) => {
            if (link) {
                return await loc.$('.list-item').isDisplayed();
            } else return false;
        });
    }


    async searchAssociatedEntitiesToBeRemoveAssociation(searchvalue: string): Promise<void> {
        await $$(this.selectors.searchAssociatedEntitiesToBeRemoveTextBox).last().clear();
        await $$(this.selectors.searchAssociatedEntitiesToBeRemoveTextBox).last().sendKeys(searchvalue);
    }

    async isValueAssociatedExclusionsSubjectInAssociatePublicExclusionSubjectsPresent(searchvalue?: string): Promise<boolean> {
        let loc = await $$('[rx-view-component-id="c6983ae5-50e0-4400-bd7b-0e8f590a931f"] .bwf-association-list').get(1);
        if (searchvalue) {
            return await loc.element(by.cssContainingText('.list-item', searchvalue)).isPresent().then(async (link) => {
                if (link) {
                    return await loc.element(by.cssContainingText('.list-item', searchvalue)).isDisplayed();
                } else return false;
            });
        } else
            return await loc.element(by.cssContainingText('.list-item', searchvalue)).count() < 1 ? false : true;
    }

    async isListAssociatedExclusionsSubjectInAssociatePublicExclusionSubjectsPresent(): Promise<boolean> {
        let loc = await $$('[rx-view-component-id="c6983ae5-50e0-4400-bd7b-0e8f590a931f"] .bwf-association-list').get(1);
        return await loc.$('.list-item').isPresent().then(async (link) => {
            if (link) {
                return await loc.$('.list-item').isDisplayed();
            } else return false;
        });
    }

    async clickSupportGroup(): Promise<void> {
        await $(this.selectors.selectSupportGroup).click();
    }

    async selectAcknowledgementTemplate(template: string): Promise<void> {
        await utilityCommon.selectDropDown(await $(this.selectors.acknowledgementTemplateUpdate),template,DropDownType.WebElement);
    }

    async selectBusinessUnitInAssociatedSupportGroupTab(template: string): Promise<void> {
        await utilityCommon.selectDropDown(this.selectors.associatedSupportGroupBuisnessGroupGuid, template);
    }

    async clickAssociatedSupportGroupRightArrow(): Promise<void> {
        await $(this.selectors.associatedSupportGroup).click();
    }

    async clickAssociatedSupportGroupLeftArrow(): Promise<void> {
        await $$(this.selectors.associatedSupportGroup).get(1).click();
    }

    async clickCancelAcknowledgementTemplate(): Promise<void> {
        await $(this.selectors.cancelAcknowledgementTemplate).click();
    }
    

    async clickNewExclusiveSubjectsButton(): Promise<void> {
        await $(this.selectors.newExclusiveSubjects).click();
    }

    async isCreateEmailTemplpateLinkDisplayed(): Promise<boolean> {
        return await $(this.selectors.createEmailTemplateLink).isDisplayed();
    }

    async clickNewAvailableGlobalSubjects(): Promise<void> {
        await $(this.selectors.newAvailableGlobalSubjects).click();
    }

    async isNewAvailableGlobalSubjectsDisplayed(): Promise<boolean> {
        return await $(this.selectors.newAvailableGlobalSubjects).isDisplayed();
    }

    async clickAcknowledgementTemplateEditButton(): Promise<void> {
        await $(this.selectors.acknowledgementTemplateEditButton).click();
    }

    async searchAndClickOnCheckbox(gridValue: string): Promise<void> {
        await utilityGrid.searchAndSelectGridRecord(gridValue, this.selectors.editEmailConfigGuid);
    }

    async searchAndClickCheckboxOnAcknowledgementTemplateGrid(gridValue: string): Promise<void> {
        await utilityGrid.searchAndSelectGridRecord(gridValue, this.selectors.acknowledgementTemplateGridGuid);
    }

    async isRecordPresentInExclusiveGrid(gridValue: string): Promise<boolean> {
        return await utilityGrid.isGridRecordPresent(gridValue, this.selectors.exclusiveSubjectGuid);
    }

    async isRecordPresentInAcknowledgementTemplateGrid(gridValue: string): Promise<boolean> {
        return await utilityGrid.isGridRecordPresent(gridValue, this.selectors.acknowledgementTemplateGridGuid);
    }

    async removeExclusiveSubjectsButton(): Promise<void> {
        await $(this.selectors.removeExclusiveSubject).click();
    }

    async editExclusiveSubjectsButton(): Promise<void> {
        await $(this.selectors.editExclusiveSubject).click();
    }

    async cancelEditEmailConfig(): Promise<void> {
        await $(this.selectors.cancelEditEmailConfig).click();
    }

    async closedAssociatePublicExclusionSubjects(): Promise<void> {
        await $(this.selectors.closedAssociatePublicExclusionSubjects).click();
    }

    async isDefaultCaseTemplateToUseBtnDisabled(): Promise<boolean> {
        return await $(this.selectors.defaultCaseTemplateToUse).getAttribute('aria-disabled') == 'true';
    }

    async clearDefaultCaseTemplateToUseField(): Promise<void> {
        await $(this.selectors.defaultCaseTemplateToUse).click();
    }

    async getDefaultCaseTemplatetoUsePresent(): Promise<string> {
        return await $(this.selectors.clearDefaultCaseTemplateToUse).getText();
    }

    async isAcknowledgementDropDownPresent(template: string): Promise<boolean> {
        return utilityCommon.isValuePresentInDropDown(this.selectors.acknowledgementTemplateGuid, template);
    }

    async isDefaultCaseTemplatePresentinDropDown(template: string): Promise<boolean> {
       return await utilityCommon.isValuePresentInDropDown(this.selectors.defaultCaseTemplateGuid,template);
    }

    async isAcknowledgementPresentInDropDown(template: string): Promise<boolean> {
      return await utilityCommon.isValuePresentInDropDown(this.selectors.acknowledgementTemplateGuid,template);
    }
    async isAddNewRuleBtnDisabled(): Promise<string> {
        return await $(this.selectors.newExclusiveSubjects).getAttribute("disabled");
    }

    async isAddAvailableGlobalSubjectBtnDisabled(): Promise<string> {
        return await $(this.selectors.newAvailableGlobalSubjects).getAttribute("disabled");
    }

    async isDeleteExlusionSubjectDisabled(): Promise<string> {
        return await $(this.selectors.removeExclusiveSubject).getAttribute('disabled');
    }

    async isEditExlusiceSubjectDisabled(): Promise<string> {
        return await $(this.selectors.editExclusiveSubject).getAttribute('disabled');
    }

    async isAcknowledgementTemplateEditBtnEnabled(): Promise<boolean> {
        return await $(this.selectors.acknowledgementTemplateEditButton).isEnabled();
    }

    async isAssociatedGroupSGSelectCheckboxDisabled(): Promise<boolean> {
        return await $(this.selectors.supportGroupCheckbox).getAttribute('disabled') == 'true';
    }

    async isAddTrustedEmailBtnEnabled(): Promise<boolean> {
        return await $(this.selectors.addTrustedEmailBtn).isEnabled();
    }

    async clickAddTrustedEmailBtn(): Promise<void> {
        await $(this.selectors.addTrustedEmailBtn).click();
    }

    async clickNewTrustedEmailSaveBtn(): Promise<void> {
        await $(this.selectors.newTrustedEmailSaveBtn).click();
    }

    async isNewTrustedEmailSaveBtnDisabled(): Promise<string> {
        return await $(this.selectors.newTrustedEmailSaveBtn).getAttribute("disabled");
    }

    async clickNewTrustedEmailCancelBtn(): Promise<void> {
        await $(this.selectors.newTrustedEmailCancelBtn).click();
    }

    async setNewTrustedEmail(email: string): Promise<void> {
        await $(this.selectors.newTrustedEmailId).sendKeys(email);
    }

    async  selectMappedRequesterDropDown(email: string): Promise<void> {
        await utilityCommon.selectDropDown(this.selectors.newTrustedEmailMappedRequesterGuid, email);
    }

    async isNewTrustedEmailRequiredTextPresent(): Promise<boolean> {
        return await utilityCommon.isRequiredTagToField(this.selectors.newTrustedEmailIdGuid);
    }

    async isColumnPresentIn(header: string[]): Promise<boolean> {
        return await utilityGrid.areColumnHeaderMatches(header);
    }

    async isMappedRequesterRequiredTextPresent(): Promise<boolean> {
        return await utilityCommon.isRequiredTagToField(this.selectors.newTrustedEmailMappedRequesterGuid);
    }

    async isMappedRequesterDropDownPresent(email: string): Promise<void> {
        await utilityCommon.isValuePresentInDropDown(this.selectors.newTrustedEmailMappedRequesterGuid, email);
    }

    async isValuePresentInDropDown(value: string): Promise<boolean> {
        await $(this.selectors.dropDownOption).click();
        await $(this.selectors.newTrustedEmailMappedRequesterInputBox).sendKeys(value);
        return await element(by.cssContainingText(this.selectors.dropDownOption,value)).isPresent().then(async (present) => {
            if (present) return await element(by.cssContainingText(this.selectors.dropDownOption,value)).isDisplayed();
            else return false;
        });
    }

    async isBlockedEmailBtnEnabled(): Promise<boolean> {
        return await $(this.selectors.addBlockedEmail).isEnabled();
    }

    async clickOnNewBlockedEmailBtn(): Promise<void> {
        await $(this.selectors.addBlockedEmail).click();
    }

    async clickOnSaveBlockedEmailBtn(): Promise<void> {
        await $(this.selectors.saveBlockedemail).click();
    }

    async clickOnDelteBlockedEmailBtn(): Promise<void> {
        await $(this.selectors.deleteBlockedEmail).click();
    }

    async setEmailOnBlockedNewEmail(block: string): Promise<void> {
        await $(this.selectors.emailIdNewBlockEmailId).clear();
        await $(this.selectors.emailIdNewBlockEmailId).sendKeys(block);
    }

    async selectAndClickCheckboxOnBlockedEmail(value: string): Promise<void> {
        await utilityGrid.searchAndSelectGridRecord(value, this.selectors.blockedEmailConsoleGuid);
    }

    async isRecordPresentonBlockedEmail(value: string): Promise<boolean> {
        return await utilityGrid.isGridRecordPresent(value, this.selectors.blockedEmailConsoleGuid);
    }


    async selectAndClickCheckboxOnTrustedEmail(value: string): Promise<void> {
        await utilityGrid.searchAndSelectGridRecord(value, this.selectors.trustedEmailConsoleGuid);
    }

    async isRecordPresentonTrustedEmail(value: string): Promise<boolean> {
        return await utilityGrid.isGridRecordPresent(value, this.selectors.trustedEmailConsoleGuid);
    }

    async clickEditTrustedEmailButtonOnTrustedEmail(): Promise<void> {
        await $(this.selectors.editTrustedEmailButtonOnTrustedEmail).click();
    }

    async clickRemoveTrustedEmailButtonOnTrustedEmail(): Promise<void> {
        await $(this.selectors.removeTrustedEmailButtonOnTrustedEmail).click();
    }

    async clickEditTrustedEmailSaveButtonOnTrustedEmail(): Promise<void> {
        await $(this.selectors.editTrustedEmailSaveButton).click();
    }

    async clickEditTrustedEmailCancelButtonOnTrustedEmail(): Promise<void> {
        await $(this.selectors.editTrustedEmailCancelButton).click();
    }

    async setEmailOnEditTrustedEmail(email: string): Promise<void> {
        await $(this.selectors.setEmailidOnEditTrusted).clear();
        await $(this.selectors.setEmailidOnEditTrusted).sendKeys(email);
    }

    async setDescription(descri: string): Promise<void> {
        await $(this.selectors.description).clear();
        await $(this.selectors.description).sendKeys(descri);
    }

    async getLobValue(): Promise<string> {
        return await $(this.selectors.lob).getText();
    }
}

export default new EditEmailConfig();