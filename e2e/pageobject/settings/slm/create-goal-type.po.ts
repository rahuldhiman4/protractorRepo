import utilCommon from "e2e/utils/util.common";
import { $, browser, protractor, ProtractorExpectedConditions } from "protractor";
import utilityCommon from '../../../utils/utility.common';

class GoalTypeCreateConfigPage {
    EC: ProtractorExpectedConditions = protractor.ExpectedConditions;

    selectors = {
        status: '[rx-view-component-id="16be0d06-4165-49f0-ba10-5478ae4ad12e"] button',
        addGoalTypeButton: '[rx-view-component-id="4d8a4ec5-1b1c-4679-b3cf-0ad793c56bc5"] button',
        goalTypeNameInput: '[rx-view-component-id="8123c496-7d9e-44a8-87b7-9549bb1ecdde"] input',
        goalType: '[rx-view-component-id="9da4805b-a925-4a66-8ae2-9086621d65ea"] button',
        statusDropDown: '[rx-view-component-id="19e691e1-656f-4e4c-8afa-108cdb6093e5"] .ui-select-match',
        saveButton: '[rx-view-component-id="da0c86c7-26b4-4b29-afeb-180479b85bfd"] button',
        closeButton: '[rx-view-component-id="174fc807-89d8-472b-b3e7-be05fe64b3b1"] button',
        lineofbusiness: '[rx-view-component-id="1572778c-0019-4609-a496-4944a98ac738"] .ui-select-container',
        lineofbusinessValue: '[rx-view-component-id="1572778c-0019-4609-a496-4944a98ac738"] .ui-select-container span.ui-select-match-text',
        goalTypeValue: '[rx-view-component-id="9da4805b-a925-4a66-8ae2-9086621d65ea"] .rx-select__search-button-title',


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