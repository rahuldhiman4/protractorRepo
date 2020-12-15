import { $, protractor, ProtractorExpectedConditions } from "protractor";
import utilGrid from '../../../utils/util.grid';

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
        await utilGrid.searchOnGridConsole(valueName);
        return await utilGrid.getSelectedGridRecordValue(this.selectors.consoleGuid, columnName);
    }

}

export default new ConsoleDefineLOB();