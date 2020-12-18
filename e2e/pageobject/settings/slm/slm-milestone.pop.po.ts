import { $, $$, browser, by, element, protractor, ProtractorExpectedConditions } from "protractor";
import SlmExpressionBuilder from './slm-expressionbuilder.pop.po';
import utilCommon from '../../../utils/util.common';

class ServiceTargetMilestoneConfig {
    EC: ProtractorExpectedConditions = protractor.ExpectedConditions;
    selectors = {
        fieldNameLabel: 'span.d-textfield__item',
        noMileStonesPresentText: '.slm-group-list-item_empty',
        addNewMileStoneBtn: 'button.d-icon-left-plus_circle',
        mileStoneWindow: '[name="milestoneForm"]',
        mileStoneTitle: '[name="milestoneForm"] input[placeholder="Enter Milestone Title"]',
        mileStoneDescription: '[name="milestoneForm"] input[placeholder="Enter Description"]',
        mileStonePercentage: '[name="milestoneForm"] .d-counter__input',
        mileStoneExpression: '[name="milestoneForm"] .d-button_link',
        mileStoneSaveBtn: '[name="milestoneForm"] button.d-button_primary',
        setMileStoneActionPopUp : '[name="milestoneSelectForm"]',
        selectMileStoneActionSegment: '[name="milestoneForm"] [id^="accordiongroup"][id$="tab"] .glyphicon',
        selectMilestoneAction: 'ul.d-dropdown__list a',
        mileStoneActionTitle: '[name="milestoneSelectForm"] input[placeholder="Enter Action Title"]',
        mileStoneActionField: '.ui-select-match[placeholder="Select Field"]',
        mileStoneActionValue: '[name="milestoneSelectForm"] [placeholder="Enter Value"]',
        mileStoneActionAddFieldBtn: '[name="milestoneSelectForm"] button.d-button_secondary',
        mileStoneActionSaveBtn: '[name="milestoneSelectForm"] button.d-button_primary',
        selectSavedMileStoneAction: '.slm-group-list-item .d-icon-circle_o',
        mileStoneExecuteWhenCondition: '[name="milestoneForm"] .ui-select-match',
        mileStoneActionFieldSelectionDropDown : '.ui-select-choices-row-inner',
        mileStoneActionFieldSelectionSearch : 'input.ui-select-search',
        dropDownOption: '.ui-select-choices-row',

        mileStoneNotificationForm: '[name="emailAlertForm"]',
        mileStoneNotificationFormEnterTitleInput: '[name="emailAlertForm"] input[placeholder="Enter Action Title"]',
        mileStoneNotificationFormEnterDescInput: '[name="emailAlertForm"] div[placeholder="Enter Description"]',
        mileStoneNotificationFormSelectDeliveryMethod:'[name="emailAlertForm"] input[placeholder="Select Delivery Method"]',
        mileStoneNotificationFormEnterToInput: '[name="emailAlertForm"] input[aria-label="To"]',
        mileStoneNotificationFormSelectNotificationTemplate:'[name="emailAlertForm"] div[placeholder="Select Notification Template"]',
        mileStoneNotificationFormSelectNotificationTemplateInput:'[name="emailAlertForm"] input[placeholder="Select Notification Template"]',
        mileStoneActionNotificationFormSaveBtn: '[name="emailAlertForm"] button.d-button_primary',

    }

    async isSLMMileStonePopUpDisplayed(): Promise<boolean> {
        return await $(this.selectors.mileStoneWindow).isPresent().then(async (result) => {
            if (result) return await $(this.selectors.mileStoneWindow).isDisplayed();
            else return false;
        })
    }

    async isServiceTargetMilestonesFieldRequired(fieldName: string): Promise<boolean> {
        let fieldNameRequiredTag = await element(by.cssContainingText(this.selectors.fieldNameLabel, fieldName));
        return await utilCommon.isRequiredTagToFieldElement(fieldNameRequiredTag);
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

    async selectMileStoneExecuteWhenCondition(fieldValue:string):Promise<void>{
        await utilCommon.selectDropDown2($(this.selectors.mileStoneExecuteWhenCondition), fieldValue);
    }

    async clickMileStoneActionsSegment():Promise<void>{
        await $$(this.selectors.selectMileStoneActionSegment).last().click();
    }

    async isSetMileStoneActionPopUpDisplayed(): Promise<boolean> {
        return await $(this.selectors.setMileStoneActionPopUp).isPresent().then(async (result) => {
            if (result) return await $(this.selectors.setMileStoneActionPopUp).isDisplayed();
            else return false;
        })
    }

    async selectMileStoneActionCondition(fieldValue:string):Promise<void>{
        let option = await element(by.cssContainingText(this.selectors.selectMilestoneAction, fieldValue));
        await browser.wait(this.EC.elementToBeClickable(option), 3000).then(async () => {
            await option.click();
        });
    }

    async setMileStoneActionTitle(mileStoneActionTitle:string):Promise<void>{
        await $(this.selectors.mileStoneActionTitle).clear();
        await $(this.selectors.mileStoneActionTitle).sendKeys(mileStoneActionTitle);
    }

    async clickSaveMileStoneAction():Promise<void>{
        await $(this.selectors.mileStoneActionSaveBtn).click();
    }

    async clickAddMileStoneActionBtn():Promise<void>{
        await $(this.selectors.mileStoneActionAddFieldBtn).click();
    }

    async selectMileStoneActionField(fieldValue:string):Promise<void>{
        await $(this.selectors.mileStoneActionField).click();
        await $(this.selectors.mileStoneActionFieldSelectionSearch).sendKeys(fieldValue);
        await element(by.cssContainingText(this.selectors.mileStoneActionFieldSelectionDropDown, fieldValue)).click();
    }

    async setMileStoneActionFieldValue(fieldVal : string):Promise<void>{
        await $(this.selectors.mileStoneActionValue).clear();
        await $(this.selectors.mileStoneActionValue).sendKeys(fieldVal);
    }

    async selectMileStoneAction():Promise<void>{
        await $(this.selectors.selectSavedMileStoneAction).click();
    }

    async clickSaveMileStone():Promise<void>{
        await $(this.selectors.mileStoneSaveBtn).click();
    }

    async clickAddNewMileStoneActionBtn():Promise<void>{
        await $(this.selectors.addNewMileStoneBtn).click();
    }

    //Fields for Milestone Notification Form

    async isSetMileStoneNotificationActionPopUpDisplayed(): Promise<boolean> {
        return await $(this.selectors.mileStoneNotificationForm).isPresent().then(async (result) => {
            if (result) return await $(this.selectors.mileStoneNotificationForm).isDisplayed();
            else return false;
        })
    }

    async setMileStoneNotificationTitle(mileStoneActionTitle:string):Promise<void>{
        await $(this.selectors.mileStoneNotificationFormEnterTitleInput).clear();
        await $(this.selectors.mileStoneNotificationFormEnterTitleInput).sendKeys(mileStoneActionTitle);
    }

    async setMileStoneNotificationDescription(mileStoneActionTitle:string):Promise<void>{
        await $(this.selectors.mileStoneNotificationFormEnterDescInput).clear();
        await $(this.selectors.mileStoneNotificationFormEnterDescInput).sendKeys(mileStoneActionTitle);
    }

    async selectMileStoneNotificationDeliveryMethod(fieldValue:string):Promise<void>{
        await utilCommon.selectDropDown2($(this.selectors.mileStoneNotificationFormSelectDeliveryMethod), fieldValue);
    }

    async setMileStoneNotificationToField(mileStoneActionTitle:string):Promise<void>{
        await $(this.selectors.mileStoneNotificationFormEnterToInput).clear();
        await $(this.selectors.mileStoneNotificationFormEnterToInput).sendKeys(mileStoneActionTitle);
    }

    async selectMileStoneNotificationTemplate(fieldValue:string):Promise<void>{
        await utilCommon.selectDropDown2($(this.selectors.mileStoneNotificationFormSelectNotificationTemplate), fieldValue);
    }

    async clickOnNotificationTemplateDropDown():Promise<void>{
        await $(this.selectors.mileStoneNotificationFormSelectNotificationTemplate).click();
    }

    async isNotificationTemplatePresentInDropDown(fieldValue: string): Promise<boolean> {
        await $(this.selectors.mileStoneNotificationFormSelectNotificationTemplateInput).clear();
        await $(this.selectors.mileStoneNotificationFormSelectNotificationTemplateInput).sendKeys(fieldValue);
        let values= await $$(this.selectors.dropDownOption).count();
        if (values >= 1) { return true; } else { return false; }
    } 

    async selectMileStoneNotificationTemplateValue(fieldValue:string):Promise<void>{
        await $(this.selectors.mileStoneNotificationFormSelectNotificationTemplate).click();
        await $(this.selectors.mileStoneNotificationFormSelectNotificationTemplateInput).sendKeys(fieldValue);
        await element(by.cssContainingText(this.selectors.dropDownOption, fieldValue)).click();
    }

    async clickSaveMileStoneActionNotification():Promise<void>{
        await $(this.selectors.mileStoneActionNotificationFormSaveBtn).click();
    }


}

export default new ServiceTargetMilestoneConfig();