import { ProtractorExpectedConditions, protractor, browser, $, element, by } from "protractor"

class GoalTypeConfigConsolePage {
    EC: ProtractorExpectedConditions = protractor.ExpectedConditions;

    selectors = {
        addGoalType: '[rx-view-component-id="4d8a4ec5-1b1c-4679-b3cf-0ad793c56bc5"] button'
    }

    async isAddGoalTypeBtnDisabled(): Promise<boolean>{
        await browser.wait(this.EC.visibilityOf($(this.selectors.addGoalType)));
        return await $(this.selectors.addGoalType).getAttribute("disabled")=="true";
    }
}

export default new GoalTypeConfigConsolePage();