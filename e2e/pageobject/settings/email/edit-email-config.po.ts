import { $, $$, by, element, browser, ProtractorExpectedConditions } from 'protractor';
import utilCommon from '../../../utils/util.common';
import utilGrid from '../../../utils/util.grid';
import { protractor } from 'protractor/built/ptor';

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
        searchAssociatedEntitiesToBeRemoveTextBox: '[rx-view-component-id="c6983ae5-50e0-4400-bd7b-0e8f590a931f"] [class="adapt-search-icon d-icon-search"]',
        listAssociatedExclusionsSubjectInAssociatePublicExclusionSubjects: '[class="col-5"] li[class="list-group-item ng-star-inserted"]',
        cancelEditEmailConfig: '[rx-view-component-id="bf51aff6-d0a3-484a-bed1-e11a78971aee"] button',
        closedAssociatePublicExclusionSubjects: '[rx-view-component-id="71177700-7a94-435f-b594-24ae7bc4e22b"] button span',
        acknowledgementTemplateEditButton: '[rx-view-component-id="dd7a7212-432d-4c79-a33b-b7cc8abf787e"] button',
        saveAcknowledgementTemplate: '[rx-view-component-id="3c7ff456-1517-42d4-a770-bf4e641c7303"] button',
        cancelAcknowledgementTemplate: '[rx-view-component-id="e163832a-f819-43f0-af68-87aa1d5c671a"] button',
        acknowledgementTemplateGuid: 'a5437a3a-3a11-4e07-8829-9cee403dca61',
        ticketTypeAcknowledgementTemplate: '[rx-view-component-id="5f00dfc8-9dc0-4521-befd-30f4d6d51ac5"] input',
        operationTypeAcknowledgementTemplate: '[rx-view-component-id="2353e82d-57fd-428b-acc6-7080c1561914"] input',
        ticketStatusAcknowledgementTemplate: '[rx-view-component-id="2db28354-0558-454d-b4d7-f781263a72e7"] input',
        associatedSupportGroupBuisnessGroupGuid: '09c5a9d8-2aa6-449c-a041-958432203c3c',
        associatedSupportGroupValueassociatedSupportGroup: '.association-list-spacing .km-group-list-item__info span',
        selectSupportGroup: '.km-group-list-item__icon-container i',
        associatedSupportGroup: '.button-column button',
        supportGroupAssociatedSupportGroup: '.source-list-spacing .bottom-margin',
        associatedSupportGroupAssociatedSupportGroup: '.association-list-spacing .bottom-margin',
        associatedSupportGroupSearchResult: '.km-group-list-item__info span',
        saveEditEmailConfig: '[rx-view-component-id="e36471c2-f950-4df7-bc42-ed2bbf59898b"] button',
        acknowledgementTemplateGridGuid: '4938609e-47bd-460d-b32c-57dfc21958cd',
        defaultCaseTemplateGuid: '085b8e93-0e68-41a7-a1ed-77b6ab2c9522',
        defaultCaseTemplatelist: '[rx-view-component-id="085b8e93-0e68-41a7-a1ed-77b6ab2c9522"] .ui-select-choices-row-inner *',
        defaultCaseTemplateToUse: '[rx-view-component-id="085b8e93-0e68-41a7-a1ed-77b6ab2c9522"] .dropdown',
        clearDefaultCaseTemplateToUse: '[rx-view-component-id="085b8e93-0e68-41a7-a1ed-77b6ab2c9522"] input[type="search"]',
        supportGroupCheckbox: '.record__list i',
        addTrustedEmailBtn: '[rx-view-component-id="0dfbc207-b03e-40ab-8e6b-c74f5609aa89"] button',
        newTrustedEmailId: '[rx-view-component-id="00fb62e7-3e31-4aba-b9b5-a60daec4db46"] input',
        newTrustedEmailIdGuid: '00fb62e7-3e31-4aba-b9b5-a60daec4db46',
        newTrustedEmailSaveBtn: '[rx-view-component-id="c0dcdafe-6d39-4c38-b26c-38ec48b9450f"] button',
        newTrustedEmailCancelBtn: '[rx-view-component-id="c8d38843-d953-4bdd-9913-b6210ee1daa4"] button',
        newTrustedEmailMappedRequesterGuid: '5021ef29-9cae-4538-bf9b-2907936a8c78',
        newTrustedEmailMappedRequesterInputBox: '[rx-view-component-id="5021ef29-9cae-4538-bf9b-2907936a8c78"] button',
        addBlockedEmail: '[rx-view-component-id="d7309e2b-06c2-46a6-85e0-8b8f83159f9a"] button',
        blockedEmailConsoleGuid: '8b8901bb-9678-4a27-80db-61d441aa8f13',
        createEmailTemplateLink: '[rx-view-component-id="010a2bf3-5b2d-4c72-9c33-fa26d3be6b78"] button',
        saveBlockedemail: '[rx-view-component-id="a5da25a9-a60f-4096-8655-9f3c0ed0190c"] button',
        deleteBlockedEmail: '[rx-view-component-id="30acf26f-75dd-4730-93ba-cce285732b54"] button',
        inputFieldAcknowledgementTemplate: '[rx-view-component-id="a5437a3a-3a11-4e07-8829-9cee403dca61"] input[type="search"]',
        acknowledgementTemplateList: '[rx-view-component-id="a5437a3a-3a11-4e07-8829-9cee403dca61"] .ui-select-choices-row-inner *',
        trustedEmailConsoleGuid: '46526dc0-07f0-4dc6-abd3-80651dabd24f',
        editTrustedEmailButtonOnTrustedEmail: '[rx-view-component-id="c9e5d798-e0b2-49b2-89d8-5875209b29a6"] button',
        removeTrustedEmailButtonOnTrustedEmail: '[rx-view-component-id="d406d183-268a-4003-9b11-ceafd30ece44"] button',
        editTrustedEmailSaveButton: '[rx-view-component-id="39083019-c851-43f6-bcab-e6d9d59ac83d"]  button',
        editTrustedEmailCancelButton: '[rx-view-component-id="43790bdf-8e59-47d1-9b11-8577140da637"]  button',
        setEmailidOnEditTrusted: '[rx-view-component-id="ac869aba-620e-42a5-af4d-5ed1bd580a6e"] input',
        dropDownOption: '[rx-view-component-id="5021ef29-9cae-4538-bf9b-2907936a8c78"].ui-select-choices-row-inner *',
        description: '[rx-view-component-id="9d3c4cbf-faa9-4f65-834f-474b7c5c2a12"] input',
        emailIdNewBlockEmailId: '[rx-view-component-id="3b86d9d1-26a0-4fe1-8d36-57993ddeb25c"] input',
        lobValue: '[rx-view-component-id="61e76625-685a-41b7-9c41-fd7698a71570"] .pull-left'
    }

    async clickDefaultMailIdCheckbox(value: string): Promise<void> {
        await $(`.d-button-group_small button[aria-label="${value}"]`).click();
    }

    async clickAvailableExclusionSubjectsCheckbox(): Promise<void> {
        await $(this.selectors.availableExclusionSubjectsCheckbox).click();
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
        return await utilGrid.areColumnHeaderMatches(this.selectors.acknowledgementTemplateGridGuid, header);
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
        await utilCommon.selectDropDown(this.selectors.defaultCaseTemplateGuid, tabValue);
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
        await $(this.selectors.searchAvailableEntitiesTextBox).clear();
        await $(this.selectors.searchAvailableEntitiesTextBox).sendKeys(searchvalue);
    }

    async isValueAvailableExclusionsSubjectInAssociatePublicExclusionSubjectsPresent(searchvalue?: string): Promise<boolean> {
        if (searchvalue) {
            return await element(by.cssContainingText(this.selectors.listAvailableExclusionsSubjectInAssociatePublicExclusionSubjects, searchvalue)).isPresent().then(async (link) => {
                if (link) {
                    return await element(by.cssContainingText(this.selectors.listAvailableExclusionsSubjectInAssociatePublicExclusionSubjects, searchvalue)).isDisplayed();
                } else return false;
            });
        } else
            return await $$(this.selectors.listAvailableExclusionsSubjectInAssociatePublicExclusionSubjects).count() < 1 ? false : true;
    }

    async searchAssociatedEntitiesToBeRemoveAssociation(searchvalue: string): Promise<void> {
        await $(this.selectors.searchAssociatedEntitiesToBeRemoveTextBox).clear();
        await $(this.selectors.searchAssociatedEntitiesToBeRemoveTextBox).sendKeys(searchvalue);
    }

    async isValueAssociatedExclusionsSubjectInAssociatePublicExclusionSubjectsPresent(searchvalue?: string): Promise<boolean> {
        if (searchvalue) {
            return await element(by.cssContainingText(this.selectors.listAssociatedExclusionsSubjectInAssociatePublicExclusionSubjects, searchvalue)).isPresent().then(async (link) => {
                if (link) {
                    return await element(by.cssContainingText(this.selectors.listAssociatedExclusionsSubjectInAssociatePublicExclusionSubjects, searchvalue)).isDisplayed();
                } else return false;
            });
        }
        return await $$(this.selectors.listAssociatedExclusionsSubjectInAssociatePublicExclusionSubjects).count() < 1 ? false : true;
    }

    async clickSupportGroup(): Promise<void> {
        await $(this.selectors.selectSupportGroup).click();
    }

    async selectAcknowledgementTemplate(template: string): Promise<void> {
        await utilCommon.selectDropDown(this.selectors.acknowledgementTemplateGuid, template);
    }

    async selectBusinessUnitInAssociatedSupportGroupTab(template: string): Promise<void> {
        await utilCommon.selectDropDown(this.selectors.associatedSupportGroupBuisnessGroupGuid, template);
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

    async searchOnGrid(gridValue: string): Promise<void> {
        await utilGrid.searchAndSelectGridRecord(gridValue, this.selectors.exclusiveSubjectGuid);
    }

    async searchAndClickOnCheckbox(gridValue: string): Promise<void> {
        await utilGrid.clickCheckBoxOfValueInGrid(gridValue, this.selectors.editEmailConfigGuid);
    }

    async searchAndClickCheckboxOnAcknowledgementTemplateGrid(gridValue: string): Promise<void> {
        await utilGrid.searchAndSelectFirstCheckBox(this.selectors.acknowledgementTemplateGridGuid, gridValue);
    }

    async isRecordPresentInExclusiveGrid(gridValue: string): Promise<boolean> {
        return await utilGrid.isGridRecordPresent(gridValue, this.selectors.exclusiveSubjectGuid);
    }

    async isRecordPresentInAcknowledgementTemplateGrid(gridValue: string): Promise<boolean> {
        return await utilGrid.isGridRecordPresent(gridValue, this.selectors.acknowledgementTemplateGridGuid);
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
        return await $(this.selectors.defaultCaseTemplateToUse).getAttribute('disabled') == 'true';
    }

    async clearDefaultCaseTemplateToUseField(): Promise<void> {
        await $(this.selectors.clearDefaultCaseTemplateToUse).clear();
    }

    async isDefaultCaseTemplatetoUsePresent(template: string): Promise<boolean> {
        return utilCommon.isValuePresentInDropDown(this.selectors.defaultCaseTemplateGuid, template);
    }

    async isAcknowledgementDropDownPresent(template: string): Promise<boolean> {
        return utilCommon.isValuePresentInDropDown(this.selectors.acknowledgementTemplateGuid, template);
    }

    async isDefaultCaseTemplatePresentinDropDown(template: string): Promise<boolean> {
        await $(this.selectors.clearDefaultCaseTemplateToUse).sendKeys(template);
        let count = await $$(this.selectors.defaultCaseTemplatelist).count();
        if (count >= 1) { return true; } else { return false; }
    }

    async isAcknowledgementPresentInDropDown(template: string): Promise<boolean> {
        await $(this.selectors.inputFieldAcknowledgementTemplate).clear();
        await $(this.selectors.inputFieldAcknowledgementTemplate).sendKeys(template);
        let count = await $$(this.selectors.acknowledgementTemplateList).count();
        if (count >= 1) { return true; } else { return false; }
    }
    async isAddNewRuleBtnEnabled(): Promise<boolean> {
        return await $(this.selectors.newExclusiveSubjects).isEnabled();
    }

    async isAddAvailableGlobalSubjectBtnEnabled(): Promise<boolean> {
        return await $(this.selectors.newAvailableGlobalSubjects).isEnabled();
    }

    async isRemoveExlusionSubjectEnabled(): Promise<boolean> {
        return await $(this.selectors.removeExclusiveSubject).isEnabled();
    }

    async isEditExlusiceSubjectEnabled(): Promise<boolean> {
        return await $(this.selectors.editExclusiveSubject).isEnabled();
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
        await utilCommon.selectDropDown(this.selectors.newTrustedEmailMappedRequesterGuid, email);
    }

    async isNewTrustedEmailRequiredTextPresent(): Promise<boolean> {
        return await utilCommon.isRequiredTagToField(this.selectors.newTrustedEmailIdGuid);
    }

    async isColumnPresentIn(header: string[]): Promise<boolean> {
        return await utilGrid.areColumnHeaderMatches(this.selectors.acknowledgementTemplateGridGuid, header);
    }

    async isMappedRequesterRequiredTextPresent(): Promise<boolean> {
        return await utilCommon.isRequiredTagToField(this.selectors.newTrustedEmailMappedRequesterGuid);
    }

    async isMappedRequesterDropDownPresent(email: string): Promise<void> {
        await utilCommon.isValuePresentInDropDown(this.selectors.newTrustedEmailMappedRequesterGuid, email);
    }

    async isValuePresentInDropDown(value: string): Promise<boolean> {
        await $(this.selectors.newTrustedEmailMappedRequesterInputBox).clear();
        await $(this.selectors.newTrustedEmailMappedRequesterInputBox).sendKeys(value);
        let values = await $$(this.selectors.dropDownOption).count();
        if (values >= 1) { return true; } else { return false; }
    }

    async clearNewTrustedEmailMappedRequesterInputBox(): Promise<void> {
        await $(this.selectors.newTrustedEmailMappedRequesterInputBox).clear();
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
        await utilGrid.searchAndSelectFirstCheckBox(this.selectors.blockedEmailConsoleGuid, value);
    }

    async isRecordPresentonBlockedEmail(value: string): Promise<boolean> {
        return await utilGrid.isGridRecordPresent(value, this.selectors.blockedEmailConsoleGuid);
    }


    async selectAndClickCheckboxOnTrustedEmail(value: string): Promise<void> {
        await utilGrid.searchAndSelectFirstCheckBox(this.selectors.trustedEmailConsoleGuid, value);
    }

    async isRecordPresentonTrustedEmail(value: string): Promise<boolean> {
        return await utilGrid.isGridRecordPresent(value, this.selectors.trustedEmailConsoleGuid);
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
        return await $(this.selectors.lobValue).getText();
    }

}

export default new EditEmailConfig();