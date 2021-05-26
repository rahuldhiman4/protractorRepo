import { $, $$ } from "protractor";
import { DropDownType } from '../../../utils/constants';
import utilityCommon from '../../../utils/utility.common';

class DocLibReadAccessTab {
    selectors = {
        supportGroupAccessButton: '.collapsible-group button',
        addCompanyAddButton: '.support-group-form span.input-group-btn button',
        addSupportGroupAddButton: '.support-group-form span.input-group-btn button',
        addCompany: '.support-group-form button[class="dropdown-toggle btn btn-secondary btn-block align-start text-secondary"]',
        addSupportGroup: '.support-group-form button[class="dropdown-toggle btn btn-secondary btn-block align-start text-secondary"]',
        readAccessCancelButton: '[rx-view-component-id="be1ecd02-7d93-4d3b-8c4e-add1dfb2c924"] button',
    }

    async isSupportGroupAccessButtonDisplayed(): Promise<boolean> {
        return await $(this.selectors.supportGroupAccessButton).isPresent().then(async (result) => {
            if (result) return await $(this.selectors.supportGroupAccessButton).isDisplayed();
            else return false;
        });
    }

    async clickOnReadAccessAddButton(dropdownName: string): Promise<void> {
        if (dropdownName == 'Add Company') await $$(this.selectors.addCompanyAddButton).get(0).click();
        else if (dropdownName == 'Add Support Group') await $$(this.selectors.addSupportGroupAddButton).get(1).click();
        else console.log('Drop down values does not match')
    }

    async clickOnSupportGroupAccessButton(): Promise<void> {
        await $(this.selectors.supportGroupAccessButton).click();
    }

    async isAddCompanyDropDownDisplayed(): Promise<boolean> {
        return await $(this.selectors.addCompany).isDisplayed();
    }

    async isAddCompanyAddButtonDisplayed(): Promise<boolean> {
        return await $(this.selectors.addCompanyAddButton).get(0).isDisplayed();
    }

    async selectAddCompanyDropDownOfReadAccess(value: string): Promise<void> {
        await utilityCommon.selectDropDown(await $(this.selectors.addCompany), value, DropDownType.WebElement);
    }

    async isAddSupportGroupDropDownDisplayed(): Promise<boolean> {
        return await $(this.selectors.addSupportGroup).isDisplayed();
    }

    async isAddSupportGroupAddButtonDisplayed(): Promise<boolean> {
        return await $$(this.selectors.addSupportGroupAddButton).get(1).isDisplayed();
    }

    async selectAddSupportGroupDropDownOfReadAccess(value: string): Promise<void> {
        await utilityCommon.selectDropDown(await $(this.selectors.addSupportGroup), value, DropDownType.WebElement);
    }

    async clickReadAccessCancelButton(): Promise<void> {
        await $(this.selectors.readAccessCancelButton).click();
    }

}

export default new DocLibReadAccessTab();