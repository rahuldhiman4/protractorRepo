import { $, browser, protractor, ProtractorExpectedConditions } from "protractor";
import utilCommon from '../../../utils/util.common';

class GoalTypeCreateConfigPage {
    EC: ProtractorExpectedConditions = protractor.ExpectedConditions;

    selectors = {
        status: '[rx-view-component-id="16be0d06-4165-49f0-ba10-5478ae4ad12e"] .ui-select-toggle',
        addGoalTypeButton: '[rx-view-component-id="8a523556-6549-4250-81d7-fc46b3480afe"] button',
        goalTypeNameInput: 'div[aria-label="Goal Type Name"] input',
        goalType: '[rx-view-component-id="9a13d83a-2ad4-451e-a31d-36c7eda0f709"] .ui-select-container',
        statusDropDown: '[rx-view-component-id="19e691e1-656f-4e4c-8afa-108cdb6093e5"] .ui-select-match',
        saveButton: '[rx-view-component-id="c0d3c6c3-7625-4236-971f-5fc0c0875955"] button',
        closeButton: 'div[rx-view-component-id="0d0a565e-b611-4975-b952-34ff4576172d"] .d-button_secondary',
        lineofbusiness: '[rx-view-component-id="1572778c-0019-4609-a496-4944a98ac738"] .ui-select-container',
        lineofbusinessValue: '[rx-view-component-id="1572778c-0019-4609-a496-4944a98ac738"] .ui-select-container span.ui-select-match-text',
        goalTypeValue: '[rx-view-component-id="9a13d83a-2ad4-451e-a31d-36c7eda0f709"] .ui-select-container  span.ui-select-match-text',


    }

    async isGoalTypeDisabled(): Promise<boolean> {
        return await $(this.selectors.goalType).getAttribute("disabled") == "true";
    }

    async getGoalTypeValue(): Promise<String> {
        return await $(this.selectors.goalTypeValue).getAttribute("value");
    }

    async isLineOfBusinessDisabled(): Promise<boolean> {
        return await $(this.selectors.lineofbusiness).getAttribute("disabled") == "true";
    }

    async getLineOfBusinessValue(): Promise<String> {
        return await $(this.selectors.lineofbusinessValue).getAttribute("value");
    }



    async clickCreateGoalTypeConfigButton(): Promise<void> {
        await $(this.selectors.addGoalTypeButton).click();
    }
    async enterGoalTypeName(goalTypeName: string): Promise<void> {
        await $(this.selectors.goalTypeNameInput).clear();
        await $(this.selectors.goalTypeNameInput).sendKeys(goalTypeName);
    }

    async selectGoalTypeStatus(goalTypeStatus: string): Promise<void> {
        await utilCommon.selectDropDown2($(this.selectors.statusDropDown), goalTypeStatus);
    }

    async clickSaveGoalTypeButton(): Promise<void> {
        await $(this.selectors.saveButton).click();
    }

    async clickCloseGoalTypeButton(): Promise<void> {
        await $(this.selectors.closeButton).click();
    }

}

export default new GoalTypeCreateConfigPage();