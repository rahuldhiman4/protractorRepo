import { $, $$, browser, by, element, protractor, ProtractorExpectedConditions } from "protractor";
import { DropDownType } from '../../../utils/constants';
import utilityCommon from '../../../utils/utility.common';

class ServiceTargetMilestoneConfig {
    EC: ProtractorExpectedConditions = protractor.ExpectedConditions;
    selectors = {
        fieldNameLabel: `//*[@rx-view-definition-guid="fe904a56-e68a-439b-b754-a38ff078b3d0"]//*[contains(@class,'form-control-label')]//span`,
        noMileStonesPresentText: '.adapt-accordion .card .no-record-found',
        addNewMileStoneBtn: '.adapt-accordion .card button.bwf-button-link span.d-icon-left-plus_circle',
        mileStoneWindow: 'fieldset[role="document"] .dp-title',
        mileStoneTitle: 'fieldset[role="document"] input[placeholder="Enter Milestone Title"]',
        mileStoneDescription: 'fieldset[role="document"] input[placeholder="Enter Description"]',
        mileStonePercentage: 'fieldset[role="document"] input.adapt-counter-input',
        mileStoneExpression: 'fieldset[role="document"] button.bwf-button-link',
        mileStoneSaveBtn: 'fieldset[role="document"] button.btn-primary',
        setMileStoneActionPopUp: 'fieldset[role="document"] .dp-title',
        selectMileStoneActionSegment: '.milestone-details-modal-wrapper .adapt-accordion .card .tab-caret',
        selectMilestoneAction: '.dropdown-menu button',
        addNewMileStoneActionBtn: `.adapt-accordion button.dropdown-toggle[aria-label='Add a milestone action']`,
        mileStoneActionTitle: 'fieldset[role="document"] input[placeholder="Enter Action Title"]',
        mileStoneActionField: `fieldset[role="document"] button.dropdown-toggle[aria-label='Field']`,
        mileStoneActionValue: 'fieldset[role="document"] input[placeholder="Enter Value"]',
        mileStoneActionAddFieldBtn: 'fieldset[role="document"] button.btn-primary',
        mileStoneActionSaveBtn: 'fieldset[role="document"] .modal-footer button.btn-primary',
        selectSavedMileStoneAction: 'fieldset[role="document"] .associations-list__item__un-check-icon',
        mileStoneExecuteWhenCondition: 'fieldset[role="document"] button.dropdown-toggle',
        mileStoneActionFieldSelectionDropDown: 'fieldset[role="document"] button.dropdown-item',
        mileStoneActionFieldSelectionSearch: 'fieldset[role="document"] input[placeholder="Filter options"]',
        dropDownOption: 'fieldset[role="document"] button.dropdown-item',

        mileStoneNotificationForm: 'fieldset[role="document"] .dp-title',
        mileStoneNotificationFormEnterTitleInput: 'fieldset[role="document"] input[placeholder="Enter Action Title"]',
        mileStoneNotificationFormEnterDescInput: 'fieldset[role="document"] input[placeholder="Enter Description"]',
        mileStoneNotificationFormSelectDeliveryMethod: 'fieldset[role="document"] button[aria-label="Delivery Method"]',
        mileStoneNotificationFormEnterToInput: 'fieldset[role="document"] input[role="combobox"]',
        mileStoneNotificationFormSelectNotificationTemplate: `fieldset[role="document"] button[aria-label="Notification Template"]`,
        mileStoneNotificationFormSelectNotificationTemplateInput: `fieldset[role="document"] input[placeholder="Filter options"]`,
        mileStoneActionNotificationFormSaveBtn: 'fieldset[role="document"] .modal-footer button.btn-primary',
        mileStoneActionNotificationFormCancelBtn: 'fieldset[role="document"] .modal-footer button.btn-secondary',
        mileStoneNotificationToFieldSelection: '.rx-typeahead-popup-content button',
    }

    async isSLMMileStonePopUpDisplayed(): Promise<boolean> {
        return await $(this.selectors.mileStoneWindow).isPresent().then(async (result) => {
            if (result) return await $(this.selectors.mileStoneWindow).isDisplayed();
            else return false;
        })
    }

    async isServiceTargetMilestonesFieldRequired(fieldName: string): Promise<boolean> {
        let fieldNameRequiredTag = await element(by.cssContainingText(this.selectors.fieldNameLabel, fieldName));
        return await utilityCommon.isRequiredAttributePresent(fieldNameRequiredTag);
    }

    async setMileStoneTitle(milestoneTitle: string): Promise<void> {
        await $(this.selectors.mileStoneTitle).clear();
        await $(this.selectors.mileStoneTitle).sendKeys(milestoneTitle);
    }

    async setMileStoneDescription(mileStoneDescription: string): Promise<void> {
        await $(this.selectors.mileStoneDescription).clear();
        await $(this.selectors.mileStoneDescription).sendKeys(mileStoneDescription);
    }

    async setMileStonePercentage(mileStonePercentage: string): Promise<void> {
        await $(this.selectors.mileStonePercentage).clear();
        await $(this.selectors.mileStonePercentage).sendKeys(mileStonePercentage);
    }

    async clickMileStoneExpression(): Promise<void> {
        await $(this.selectors.mileStoneExpression).click();
    }

    async selectMileStoneExecuteWhenCondition(fieldValue: string): Promise<void> {
        await utilityCommon.selectDropDown($(this.selectors.mileStoneExecuteWhenCondition), fieldValue, DropDownType.Label);
    }

    async clickMileStoneActionsSegment(): Promise<void> {
        await $$(this.selectors.selectMileStoneActionSegment).last().click();
    }

    async isSetMileStoneActionPopUpDisplayed(): Promise<boolean> {
        return await $(this.selectors.setMileStoneActionPopUp).isPresent().then(async (result) => {
            if (result) return await $(this.selectors.setMileStoneActionPopUp).isDisplayed();
            else return false;
        })
    }

    async selectMileStoneActionCondition(fieldValue: string): Promise<void> {
        let option = await element(by.cssContainingText(this.selectors.selectMilestoneAction, fieldValue));
        await browser.wait(this.EC.elementToBeClickable(option), 3000).then(async () => {
            await option.click();
        });
    }

    async setMileStoneActionTitle(mileStoneActionTitle: string): Promise<void> {
        await $(this.selectors.mileStoneActionTitle).clear();
        await $(this.selectors.mileStoneActionTitle).sendKeys(mileStoneActionTitle);
    }

    async clickSaveMileStoneAction(): Promise<void> {
        await $(this.selectors.mileStoneActionSaveBtn).click();
    }

    async clickAddMileStoneActionBtn(): Promise<void> {
        await $(this.selectors.mileStoneActionAddFieldBtn).click();
    }

    async selectMileStoneActionField(fieldValue: string): Promise<void> {
        await $(this.selectors.mileStoneActionField).click();
        await $(this.selectors.mileStoneActionFieldSelectionSearch).sendKeys(fieldValue);
        await element(by.cssContainingText(this.selectors.mileStoneActionFieldSelectionDropDown, fieldValue)).click();
    }

    async setMileStoneActionFieldValue(fieldVal: string): Promise<void> {
        await $(this.selectors.mileStoneActionValue).clear();
        await $(this.selectors.mileStoneActionValue).sendKeys(fieldVal);
    }

    async selectMileStoneAction(): Promise<void> {
        await $(this.selectors.selectSavedMileStoneAction).click();
    }

    async clickSaveMileStone(): Promise<void> {
        await $(this.selectors.mileStoneSaveBtn).click();
    }

    async clickAddNewMileStoneActionBtn(): Promise<void> {
        await $(this.selectors.addNewMileStoneActionBtn).click();
    }

    //Fields for Milestone Notification Form

    async isSetMileStoneNotificationActionPopUpDisplayed(): Promise<boolean> {
        return await $(this.selectors.mileStoneNotificationForm).isPresent().then(async (result) => {
            if (result) return await $(this.selectors.mileStoneNotificationForm).isDisplayed();
            else return false;
        })
    }

    async setMileStoneNotificationTitle(mileStoneActionTitle: string): Promise<void> {
        await $(this.selectors.mileStoneNotificationFormEnterTitleInput).clear();
        await $(this.selectors.mileStoneNotificationFormEnterTitleInput).sendKeys(mileStoneActionTitle);
    }

    async setMileStoneNotificationDescription(mileStoneActionTitle: string): Promise<void> {
        await $(this.selectors.mileStoneNotificationFormEnterDescInput).clear();
        await $(this.selectors.mileStoneNotificationFormEnterDescInput).sendKeys(mileStoneActionTitle);
    }

    async selectMileStoneNotificationDeliveryMethod(fieldValue: string): Promise<void> {
        await $(this.selectors.mileStoneNotificationFormSelectDeliveryMethod).click();
        await $(this.selectors.mileStoneActionFieldSelectionSearch).sendKeys(fieldValue);
        await element(by.cssContainingText(this.selectors.mileStoneActionFieldSelectionDropDown, fieldValue)).click();
    }

    async setMileStoneNotificationToField(mileStoneActionTitle: string): Promise<void> {
        await $(this.selectors.mileStoneNotificationFormEnterToInput).clear();
        await $(this.selectors.mileStoneNotificationFormEnterToInput).sendKeys(mileStoneActionTitle);
        await element(by.cssContainingText(this.selectors.mileStoneNotificationToFieldSelection, mileStoneActionTitle)).click();
    }

    async selectMileStoneNotificationTemplate(fieldValue: string): Promise<void> {
        await $(this.selectors.mileStoneNotificationFormSelectNotificationTemplate).click();
        await $(this.selectors.mileStoneActionFieldSelectionSearch).sendKeys(fieldValue);
        await element(by.cssContainingText(this.selectors.mileStoneActionFieldSelectionDropDown, fieldValue)).click();
    }

    async clickOnNotificationTemplateDropDown(): Promise<void> {
        await $(this.selectors.mileStoneNotificationFormSelectNotificationTemplate).click();
    }

    async clearNotificationTemplateSelectionFromMilestone(): Promise<void> {
        await $(this.selectors.mileStoneNotificationFormSelectNotificationTemplateInput).clear();
    }

    async isNotificationTemplatePresentInDropDown(fieldValue: string): Promise<boolean> {
        await $(this.selectors.mileStoneNotificationFormSelectNotificationTemplateInput).clear();
        await $(this.selectors.mileStoneNotificationFormSelectNotificationTemplateInput).sendKeys(fieldValue);
        let values = await $$(this.selectors.dropDownOption).count();
        if (values >= 1) { return true; } else { return false; }
    }

    async selectMileStoneNotificationTemplateValue(fieldValue: string): Promise<void> {
        await $(this.selectors.mileStoneNotificationFormSelectNotificationTemplate).click();
        await $(this.selectors.mileStoneNotificationFormSelectNotificationTemplateInput).sendKeys(fieldValue);
        await element(by.cssContainingText(this.selectors.dropDownOption, fieldValue)).click();
    }

    async clickSaveMileStoneActionNotification(): Promise<void> {
        await $(this.selectors.mileStoneActionNotificationFormSaveBtn).click();
    }

    async clickCancelMileStoneActionNotification(): Promise<void> {
        await $(this.selectors.mileStoneActionNotificationFormCancelBtn).click();
    }


}

export default new ServiceTargetMilestoneConfig();