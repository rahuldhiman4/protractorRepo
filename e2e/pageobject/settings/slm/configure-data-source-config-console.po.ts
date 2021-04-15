import { $$, $, browser, protractor, ProtractorExpectedConditions, element, by } from "protractor";

class ConfigureDataSourceConfigConsolePage {
    EC: ProtractorExpectedConditions = protractor.ExpectedConditions;

    selectors = {
        dataSourceConsoleHeading: '[rx-view-component-id="33c2bfd0-9ab2-423e-a6a1-98c1068632ae"] p span',
        addConfigDataSource: '[rx-view-component-id="14789fc2-1c75-4659-9159-930a2f4241c3"] button',
        refreshIcon : '[rx-view-component-id="39686460-fa7b-4e61-9562-302ca8c88378"] button.d-icon-refresh',
        clearSearchIcon : '[rx-view-component-id="39686460-fa7b-4e61-9562-302ca8c88378"] button.d-icon-cross_adapt',
    }

    async isConfigDataSourceBtnVisible(): Promise<boolean> {
        return await $(this.selectors.addConfigDataSource).isPresent().then(async (result) => {
            if(result) await $(this.selectors.addConfigDataSource).isDisplayed();
            else return false;
        });
        
    }

    async getDataSourceConfigurationConsoleHeading(): Promise<string> {
        return await $(this.selectors.dataSourceConsoleHeading).getText();
    }
    
    async clickConfigDataSourceBtn(): Promise<void> {
        await browser.wait(this.EC.elementToBeClickable($(this.selectors.addConfigDataSource)), 5000);
        await $(this.selectors.addConfigDataSource).click();
    }

    async clearSearchText():Promise<void>{
        await $(this.selectors.clearSearchIcon).click();
    }

    async clickRefreshGrid():Promise<void>{
        await $(this.selectors.refreshIcon).click();        
    }
}

export default new ConfigureDataSourceConfigConsolePage();