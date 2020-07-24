import { $, browser, protractor, ProtractorExpectedConditions } from "protractor";
import utilCommon from '../../../utils/util.common';

class GoalTypeCreateConfigPage {
    EC: ProtractorExpectedConditions = protractor.ExpectedConditions;

    selectors = {
        status: '[rx-view-component-id="16be0d06-4165-49f0-ba10-5478ae4ad12e"] .ui-select-toggle',
        addGoalTypeButton: '[rx-view-component-id="4d8a4ec5-1b1c-4679-b3cf-0ad793c56bc5"] button',
        goalTypeNameInput: 'div[aria-label="Goal Type Name"] input',
        goalType: '[rx-view-component-id="9da4805b-a925-4a66-8ae2-9086621d65ea"] .ui-select-container',
        statusDropDown: '[rx-view-component-id="267b5a81-e7e8-48ba-bb3c-25f39624ab59"] .ui-select-match',
        saveButton: '[rx-view-component-id="da0c86c7-26b4-4b29-afeb-180479b85bfd"] button',
        closeButton: 'div[rx-view-component-id="c195a2d9-9e49-42c5-994f-7f6896c3d295"] .d-button_secondary'

    }

    async isGoalTypeDisabled(): Promise<boolean> {
        //        await browser.wait(this.EC.elementToBeClickable($(this.selectors.closeButton)));
        return await $(this.selectors.goalType).getAttribute("disabled") == "true";
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