import { ProtractorExpectedConditions, protractor, browser, $, element, by, $$, WebElement } from "protractor"

class ConfigureDataSourceConfigConsolePage {
    EC: ProtractorExpectedConditions = protractor.ExpectedConditions;

    selectors = {
        addConfigDataSource: '.slm-record-registration button'
    }

    async isConfigDataSourceBtnDisabled(): Promise<boolean>{
        let addBtnLocator = await $$(this.selectors.addConfigDataSource).get(0);
        await browser.wait(this.EC.visibilityOf(addBtnLocator));
        return await addBtnLocator.getAttribute("disabled")=="true";
    }
}

export default new ConfigureDataSourceConfigConsolePage();