import { $, $$, by, element } from 'protractor';
import utilCommon from '../../../utils/util.common';
import utilGrid from '../../../utils/util.grid';

export class EditEmailConfig {
    selectors = {
        selectTab: '[rx-view-component-id="024c3dd3-089e-4b4f-b28c-cf4abca6ebc7"] li a',
        availableExclusionSubjectsCheckbox: '.km-group-list-item__icon-container i',
        newExclusiveSubjects: '[rx-view-component-id="1b6dd9a4-78f9-40c4-8b4b-42d85782cb1c"] button',
        newAvailableGlobalSubjects: '[rx-view-component-id="f9002d64-77ec-4a52-9786-1e1a75dfbe8c"] button',
        editEmailConfigGuid: '777cfc71-16a2-4c51-96a5-92c0f974155e',
        removeExclusiveSubject: '[rx-view-component-id="3e830938-202e-40a3-87f6-647c25ac7f7b"] button',
        editExclusiveSubject: '[rx-view-component-id="22c22bf8-34aa-4c38-aa73-8a14bee53380"] button',
        exclusiveSubjectGuid: '75ef6a19-343a-4387-a1d3-144ef4fdf110',
        searchAvailableEntitiesTextBox: '[class="source-list-spacing col-left"] input[rx-id="search-source-text-input"]',
        listAvailableExclusionsSubjectInAssociatePublicExclusionSubjects: '[class="source-list-spacing col-left"] .km-group-list-item__info',
        searchAssociatedEntitiesToBeRemoveTextBox: '[class="col-left association-list-spacing"] input[rx-id="search-source-text-input"]',
        listAssociatedExclusionsSubjectInAssociatePublicExclusionSubjects: '[class="col-left association-list-spacing"] .km-group-list-item__info',
        cancelEditEmailConfig: '[rx-view-component-id="bf51aff6-d0a3-484a-bed1-e11a78971aee"] button',
        closedAssociatePublicExclusionSubjects: '[rx-view-component-id="71177700-7a94-435f-b594-24ae7bc4e22b"] button',
        acknowledgementTemplateEditButton: '[rx-view-component-id="dd7a7212-432d-4c79-a33b-b7cc8abf787e"] button',
        saveAcknowledgementTemplate: '[rx-view-component-id="3c7ff456-1517-42d4-a770-bf4e641c7303"] button',
        cancelAcknowledgementTemplate: '[rx-view-component-id="e163832a-f819-43f0-af68-87aa1d5c671a"] button',
        selectAcknowledgementTemplate: 'a5437a3a-3a11-4e07-8829-9cee403dca61',
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
        acknowledgementTemplateGridGuid: '2266a74e-eee9-4936-a22b-37c1d2d4e205',
        defaultCaseTemplateGuid: '085b8e93-0e68-41a7-a1ed-77b6ab2c9522',
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
        if (searchvalue)
            return await element(by.cssContainingText(this.selectors.listAvailableExclusionsSubjectInAssociatePublicExclusionSubjects, searchvalue)).isDisplayed();
        else
            return await $$(this.selectors.listAvailableExclusionsSubjectInAssociatePublicExclusionSubjects).count() < 1 ? false : true;
    }

    async searchAssociatedEntitiesToBeRemoveAssociation(searchvalue: string): Promise<void> {
        await $(this.selectors.searchAssociatedEntitiesToBeRemoveTextBox).clear();
        await $(this.selectors.searchAssociatedEntitiesToBeRemoveTextBox).sendKeys(searchvalue);
    }

    async isValueAssociatedExclusionsSubjectInAssociatePublicExclusionSubjectsPresent(searchvalue?: string): Promise<boolean> {
        if (searchvalue)
            return await element(by.cssContainingText(this.selectors.listAssociatedExclusionsSubjectInAssociatePublicExclusionSubjects, searchvalue)).isDisplayed();
        else
            return await $$(this.selectors.listAssociatedExclusionsSubjectInAssociatePublicExclusionSubjects).count() < 1 ? false : true;
    }

    async clickSupportGroup(): Promise<void> {
        await $(this.selectors.selectSupportGroup).click();
    }

    async selectAcknowledgementTemplate(template: string): Promise<void> {
        await utilCommon.selectDropDown(this.selectors.selectAcknowledgementTemplate, template);
    }

    async selectBusinessUnitInAssociatedSupportGroupTab(template: string): Promise<void> {
        await utilCommon.selectDropDown(this.selectors.associatedSupportGroupBuisnessGroupGuid, template);
    }

    async clickAssociatedSupportGroupRightArrow(): Promise<void> {
        await $(this.selectors.associatedSupportGroup).click();
    }

    async clickCancelAcknowledgementTemplate(): Promise<void> {
        await $(this.selectors.cancelAcknowledgementTemplate).click();
    }

    async clickNewExclusiveSubjectsButton(): Promise<void> {
        await $(this.selectors.newExclusiveSubjects).click();
    }

    async clickNewAvailableGlobalSubjects(): Promise<void> {
        await $(this.selectors.newAvailableGlobalSubjects).click();
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

}

export default new EditEmailConfig();