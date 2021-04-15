import utilityGrid from '../../../utils/utility.grid';
import { $, protractor, ProtractorExpectedConditions } from "protractor";

class DynamicGroupLibraryConsole {
    EC: ProtractorExpectedConditions = protractor.ExpectedConditions;

    selectors = {
        addDynamicGroupBtn: '[rx-view-component-id="593813ce-db57-4071-b1c5-f18391c9077f"] button',
        gridGuid: '0313da0e-be86-472e-a0c7-3f71fea29bb5',
    }

    async addColumnOnGrid(columnHeader: string[]): Promise<void> {
        await utilityGrid.addGridColumn(columnHeader, this.selectors.gridGuid);
    }
    async removeColumnOnGrid(columnHeader: string[]): Promise<void> {
        await utilityGrid.removeGridColumn(columnHeader, this.selectors.gridGuid);
    }

    async clickAddDynamicGroupButton(): Promise<void> {
        await $(this.selectors.addDynamicGroupBtn).click();
    }

    async isAddDynamicGroupButtonEnabled(): Promise<boolean> {
      return await $(this.selectors.addDynamicGroupBtn).isEnabled();
    }
}

export default new DynamicGroupLibraryConsole();