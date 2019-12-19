import { $, browser, protractor, ProtractorExpectedConditions } from "protractor";
import utilCommon from '../../../utils/util.common';
import utilGrid from '../../../utils/util.grid';

class MenuItemsConsolePage {
    EC: ProtractorExpectedConditions = protractor.ExpectedConditions;

    selectors = {
        addMenuOptionBtn: '[rx-view-component-id="306a51e0-cb89-45db-9270-c40b4ec3b149"] button',
        gridGuid: 'b09e033f-cd38-4a33-92ae-0832c9de8dcb',
    }

    async searchOnGridConsole(value: string): Promise<void> {
        await utilGrid.searchOnGridConsole(value);
        await utilCommon.waitUntilSpinnerToHide();
    }

    async getSelectedGridRecordValue(columnHeader: string): Promise<string> {
        return await utilGrid.getSelectedGridRecordValue(this.selectors.gridGuid, columnHeader);
    }

    async searchAndEditMenuOption(menuOption: string): Promise<void> {
        await utilGrid.searchAndOpenHyperlink(menuOption);
        await utilCommon.waitUntilSpinnerToHide();
    }

    async isAddButtonDisabled(): Promise<boolean> {
        await browser.wait(this.EC.visibilityOf($(this.selectors.addMenuOptionBtn)));
        return await $(this.selectors.addMenuOptionBtn).getAttribute("disabled") == "true";
    }

}

export default new MenuItemsConsolePage();