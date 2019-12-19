import { $, browser, protractor, ProtractorExpectedConditions } from "protractor";
import utilGrid from '../../../utils/util.grid';

class AutomatedStatusTransitionConfigConsolePage {
    EC: ProtractorExpectedConditions = protractor.ExpectedConditions;

    selectors = {
        addAutomatedTransitionButton: '[rx-view-component-id="9fa82257-c4fc-42a6-a652-6878fa70f097"] button',
        deleteButton: '[rx-view-component-id="ada73186-a453-4bbf-8b40-73939b7f2970"] button',
        editAutomatedStatusConfigBlade: '.modal-content',
    }

    async isAddAutomatedStatusTransitionBtnEnabled(): Promise<boolean> {
        let buttonElement = await $(this.selectors.addAutomatedTransitionButton);
        await browser.wait(this.EC.visibilityOf(buttonElement));
        browser.sleep(1000);
        return await buttonElement.isEnabled();
    }

    async isDeleteAutomatedStatusTransitionBtnEnabled(): Promise<boolean> {
        await browser.wait(this.EC.visibilityOf($(this.selectors.deleteButton)));
        return await $(this.selectors.deleteButton).isEnabled();
    }

    async clickAddAutomatedStatusTransitionBtn(): Promise<void> {
        await browser.wait(this.EC.visibilityOf($(this.selectors.addAutomatedTransitionButton)));
        await $(this.selectors.addAutomatedTransitionButton).click();
    }

    async openAutomatedTransitionConfig(configName: string): Promise<void> {
        await utilGrid.searchAndOpenHyperlink(configName);
        await browser.wait(this.EC.visibilityOf($(this.selectors.editAutomatedStatusConfigBlade)));
    }
}

export default new AutomatedStatusTransitionConfigConsolePage();