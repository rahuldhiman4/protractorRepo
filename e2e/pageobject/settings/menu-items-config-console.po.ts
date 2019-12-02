import { ProtractorExpectedConditions, protractor, browser, $ } from "protractor"

class MenuItemsConsolePage {
    EC: ProtractorExpectedConditions = protractor.ExpectedConditions;

    selectors = {
        addMenuOptionBtn: '[rx-view-component-id="306a51e0-cb89-45db-9270-c40b4ec3b149"] button'
    }

    async isAddButtonDisabled(): Promise<boolean>{
        await browser.wait(this.EC.visibilityOf($(this.selectors.addMenuOptionBtn)));
        return await $(this.selectors.addMenuOptionBtn).getAttribute("disabled")=="true";
    }

}

export default new MenuItemsConsolePage();