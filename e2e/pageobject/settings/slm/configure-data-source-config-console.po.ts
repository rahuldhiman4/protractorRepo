import { $$, $, browser, protractor, ProtractorExpectedConditions, element, by } from "protractor";
import utilCommon from '../../../utils/util.common';

class ConfigureDataSourceConfigConsolePage {
    EC: ProtractorExpectedConditions = protractor.ExpectedConditions;

    selectors = {
        dataSourceConsoleHeading: '.datasource__heading p.slm_heading',
        addConfigDataSource: '.slm-record-registration button',
        dataSourceConfigurationConsoleDesc: '.datasource__heading p.bwf-page-details-description',
        refreshIcon : '.d-icon-refresh',
        clearSearchIcon : 'button.d-icon-cross',
    }

    async isConfigDataSourceBtnDisabled(): Promise<boolean> {
        let addBtnLocator = await $$(this.selectors.addConfigDataSource).get(0);
        return await addBtnLocator.getAttribute("disabled") == "true";
    }

    async getDataSourceConfigurationConsoleHeading(): Promise<string> {
        return await $(this.selectors.dataSourceConsoleHeading).getText();
    }
    async getDataSourceConfigurationConsoleDescription(): Promise<string> {
        return await $(this.selectors.dataSourceConfigurationConsoleDesc).getText();
    }

    async clickConfigDataSourceBtn(): Promise<void> {
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