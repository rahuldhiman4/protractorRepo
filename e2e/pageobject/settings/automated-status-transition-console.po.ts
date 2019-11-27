import { ProtractorExpectedConditions, protractor, browser, $ } from "protractor"

class AutomatedStatusTransitionConfigConsolePage {
    EC: ProtractorExpectedConditions = protractor.ExpectedConditions;

    selectors = {
        addAutomatedTransitionButton: '[rx-view-component-id="9fa82257-c4fc-42a6-a652-6878fa70f097"] button',
        deleteButton: '[rx-view-component-id="ada73186-a453-4bbf-8b40-73939b7f2970"] button'
    }

    async isAddAutomatedStatusTransitionBtnDisabled(): Promise<boolean> {
        await browser.wait(this.EC.visibilityOf($(this.selectors.addAutomatedTransitionButton)));
        let readProperty: string = await $(this.selectors.addAutomatedTransitionButton).getAttribute("disabled");
        if (readProperty == "true") {
            return true;
        }
        else {
            return false;
        }
    }

    async isDeleteAutomatedStatusTransitionBtnDisabled(): Promise<boolean> {
        await browser.wait(this.EC.visibilityOf($(this.selectors.deleteButton)));
        let readProperty: string = await $(this.selectors.deleteButton).getAttribute("disabled");
        if (readProperty == "true") {
            return true;
        }
        else {
            return false;
        }
    }

    async clickAddAutomatedStatusTransitionBtn(): Promise<void> {
        await browser.wait(this.EC.visibilityOf($(this.selectors.addAutomatedTransitionButton)));
        await $(this.selectors.addAutomatedTransitionButton).click();
    }


}

export default new AutomatedStatusTransitionConfigConsolePage();