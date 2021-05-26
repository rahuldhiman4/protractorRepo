import { $, $$, by, element, protractor, ProtractorExpectedConditions } from "protractor";
import { DropDownType } from '../../../utils/constants';
import utilityCommon from '../../../utils/utility.common';

class CreateServiceTargetGroup {
    EC: ProtractorExpectedConditions = protractor.ExpectedConditions;

    selectors = {
        groupName: '[rx-view-component-id="23caca62-4511-4a51-a0c6-88ea5be3a6b2"] input',
        company: '[rx-view-component-id="80b2493a-9ce6-4747-94ed-c7c5cb6b647b"] button',
        dataSource: '[rx-view-component-id="49c7ca46-d55b-4e21-b5ae-4c5be52b5f7f"] button',
        goalType: '[rx-view-component-id="4f165e40-fb17-40f6-ba89-f3734c707d3a"] button',
        saveButton: '[rx-view-component-id="ff2837ae-4867-472a-b1a9-374ff7d2ac1a"] button',
        lob: '[class="bwf-lob-selection d-textfield"] [class="btn btn-default form-control ui-select-toggle"]',
        serviceTarget: '[rx-view-component-id="b9684beb-e1d2-4f96-8ed0-b23f196a698c"] input',
        serviceTargetdrpdwn: '[rx-view-component-id="b9684beb-e1d2-4f96-8ed0-b23f196a698c"] button',
        selectServiceTarget: '[rx-view-component-id="b9684beb-e1d2-4f96-8ed0-b23f196a698c"] .checkbox__item',
        cancelButton: '[rx-view-component-id="755703fa-57ef-46e6-884d-811677098b76"] button',
        goalTypeDropDownInput: '[rx-view-component-id="4f165e40-fb17-40f6-ba89-f3734c707d3a"] input',
        dropDownOption: 'button.dropdown-item',
        goalTypeDropDown: '[rx-view-component-id="4f165e40-fb17-40f6-ba89-f3734c707d3a"] button',
        dataSourceDropDownInput: '[rx-view-component-id="49c7ca46-d55b-4e21-b5ae-4c5be52b5f7f"] input',
        dataSourceDropDown: '[rx-view-component-id="49c7ca46-d55b-4e21-b5ae-4c5be52b5f7f"] button'

    }

    async setGroupName(groupName: string): Promise<void> {
        await $(this.selectors.groupName).sendKeys(groupName);
    }

    async searchServiceTarget(servicetarget: string): Promise<void> {
        await $(this.selectors.serviceTarget).sendKeys(servicetarget);
    }

    async isLobEnabled(attribute: string): Promise<string> {
        return await $(this.selectors.lob).getAttribute(attribute);
    }

    async isServiceTargetPresent(serviceTarget: string): Promise<boolean> {
        return await element(by.cssContainingText(this.selectors.serviceTargetdrpdwn, serviceTarget)).isPresent().then(async (present) => {
            if (present) return await element(by.cssContainingText(this.selectors.serviceTargetdrpdwn, serviceTarget)).isDisplayed();
            else return null;
        });
    }

    async getLobValue(): Promise<string> {
        return await $(this.selectors.lob).getText();
    }

    async selectCompany(company: string): Promise<void> {
        await utilityCommon.selectDropDown($(this.selectors.company), company, DropDownType.Label);
    }

    async selectDataSource(dataSource: string): Promise<void> {
        await utilityCommon.selectDropDown($(this.selectors.dataSource), dataSource, DropDownType.Label);
    }

    async selectGoalType(goalType: string): Promise<void> {
        await utilityCommon.selectDropDown($(this.selectors.goalType), goalType, DropDownType.Label);
    }

    async clickSaveButton(): Promise<void> {
        await $(this.selectors.saveButton).click();
    }

    async isSVTOptionsPresentInDropDown(svtTitle: string): Promise<boolean> {
        await $(this.selectors.serviceTarget).clear();
        await $(this.selectors.serviceTarget).sendKeys(svtTitle);
        let values = await $$(this.selectors.serviceTargetdrpdwn).count();
        if (values >= 1) { return true; } else { return false; }
    }

    async selectServiceTarget(svtTitle: string): Promise<void> {
        await $(this.selectors.serviceTarget).clear();
        await $(this.selectors.serviceTarget).sendKeys(svtTitle);
        await $(this.selectors.selectServiceTarget).click();
    }

    async clickCancelButton(): Promise<void> {
        await $(this.selectors.cancelButton).click();
    }

    async clickOnGoalTypeDropDown(): Promise<void> {
        await $(this.selectors.goalTypeDropDown).click();
    }

    async isGoalTypeOptionPresentInDropDown(goalType: string): Promise<boolean> {
        await $(this.selectors.goalTypeDropDownInput).clear();
        await $(this.selectors.goalTypeDropDownInput).sendKeys(goalType);
        let values = await $$(this.selectors.dropDownOption).count();
        if (values >= 1) { return true; } else { return false; }
    }

    async clickOnDataSourceDropDown(): Promise<void> {
        await $(this.selectors.dataSourceDropDown).click();
    }

    async clearDataSourceOptionFromDropDown(): Promise<void> {
        await $(this.selectors.dataSourceDropDownInput).clear();
    }

    async clearGoalTypeOptionFromDropDown(): Promise<void> {
        await $(this.selectors.goalTypeDropDownInput).clear();
    }

    async isDataSourceOptionPresentInDropDown(dataSource: string): Promise<boolean> {
        await $(this.selectors.dataSourceDropDownInput).clear();
        await $(this.selectors.dataSourceDropDownInput).sendKeys(dataSource);
        let values = await $$(this.selectors.dropDownOption).count();
        if (values >= 1) { return true; } else { return false; }
    }



}

export default new CreateServiceTargetGroup();