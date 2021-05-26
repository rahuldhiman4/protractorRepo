import { $, protractor, ProtractorExpectedConditions } from "protractor";
import utilityGrid from '../../../utils/utility.grid';

class ConsoleDefineLOB {

    EC: ProtractorExpectedConditions = protractor.ExpectedConditions;
    selectors = {
        addLobButton: '.d-icon-left-plus',
        consoleGuid: 'f18f6a1a-7319-4735-b934-1a883df99eee'
    }

    async clickAddLobBtn(): Promise<void> {
        return await $(this.selectors.addLobButton).click();
    }

    async getColumnValueOfRecord(columnName: string, valueName: string): Promise<string> {
        await utilityGrid.searchRecord(valueName);
        return await utilityGrid.getFirstGridRecordColumnValue(this.selectors.consoleGuid, columnName);
    }

    async searchAndOpenLob(lob: string): Promise<void> {
        await utilityGrid.searchAndOpenHyperlink(lob, this.selectors.consoleGuid)
    }

    async isLobPresent(lob: string): Promise<void> {
        await utilityGrid.isGridRecordPresent(lob, this.selectors.consoleGuid)
    }

}

export default new ConsoleDefineLOB();