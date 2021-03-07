import { $, browser, protractor, ProtractorExpectedConditions, ElementFinder, element, by } from "protractor";
import { DropDownType } from '../../../utils/constants';
import utilityCommon from '../../../utils/utility.common';

class GoalTypeCreateConfigPage {
    EC: ProtractorExpectedConditions = protractor.ExpectedConditions;

    selectors = {
        status: '[rx-view-component-id="16be0d06-4165-49f0-ba10-5478ae4ad12e"] button',
        addGoalTypeButton: '[rx-view-component-id="7d2a8db4-6b9d-4cd8-b493-698f7594cacf"] button',
        goalTypeNameInput: '[rx-view-component-id="5d8cbaae-b57a-434d-97de-fd9bab9f687c"] input',
        goalType: '[rx-view-component-id="9a13d83a-2ad4-451e-a31d-36c7eda0f709"] button',
        statusGuid: '19e691e1-656f-4e4c-8afa-108cdb6093e5',
        saveButton: '[rx-view-component-id="c0d3c6c3-7625-4236-971f-5fc0c0875955"] button',
        closeButton: '[rx-view-component-id="0d0a565e-b611-4975-b952-34ff4576172d"] button',
        lineofbusiness: '[rx-view-component-id="1572778c-0019-4609-a496-4944a98ac738"] input',
        //lineofbusinessValue: '[rx-view-component-id="1572778c-0019-4609-a496-4944a98ac738"] .ui-select-container span.ui-select-match-text',
        goalTypeValue: '[rx-view-component-id="9a13d83a-2ad4-451e-a31d-36c7eda0f709"] .rx-select__search-button-title',


    }

    async isGoalTypeDisabled(): Promise<boolean> {
        return await $(this.selectors.goalType).getAttribute("aria-disabled") == "true";
    }

    async getGoalTypeValue(): Promise<String> {
        return await $(this.selectors.goalTypeValue).getAttribute("value");
    }

    async isLineOfBusinessDisabled(): Promise<boolean> {
        return await $(this.selectors.lineofbusiness).getAttribute("disabled") == "true";
    }

    async getLineOfBusinessValue(): Promise<String> {
        return await $(this.selectors.lineofbusiness).getAttribute("value");
    }

    async clickCreateGoalTypeConfigButton(): Promise<void> {
        await $(this.selectors.addGoalTypeButton).click();
    }

    async enterGoalTypeName(goalTypeName: string): Promise<void> {
        await $(this.selectors.goalTypeNameInput).clear();
        await $(this.selectors.goalTypeNameInput).sendKeys(goalTypeName);
    }

    async selectGoalTypeStatus(goalTypeStatus: string): Promise<void> {
        await utilityCommon.selectDropDown(this.selectors.statusGuid, goalTypeStatus);
    }

    async clickSaveGoalTypeButton(): Promise<void> {
        await $(this.selectors.saveButton).click();
    }

    async clickCloseGoalTypeButton(): Promise<void> {
        await $(this.selectors.closeButton).click();
    }

}

export default new GoalTypeCreateConfigPage();