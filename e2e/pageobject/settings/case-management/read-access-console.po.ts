import { $, protractor, ProtractorExpectedConditions } from "protractor";
import utilGrid from '../../../utils/util.grid';

class ReadAccessConsolePage {
    EC: ProtractorExpectedConditions = protractor.ExpectedConditions;

    selectors = {
        addReadAccessBtn: '[rx-view-component-id="12ed5e94-7064-4d46-a4b7-31562f84b28b"] button',
        deleteButton: '[rx-view-component-id="0ff26fc0-a352-46dd-91e9-dffda0f97ef5"] button',
        guid: 'e2eae398-8732-41ea-b245-9d09cfee1dc3'
    }

    async isAddButtonDisplayed(): Promise<boolean> {
//        await browser.wait(this.EC.visibilityOf($(this.selectors.addReadAccessBtn)));
        return await $(this.selectors.addReadAccessBtn).isPresent();
    }

    async isDeleteButtonDisplayed(): Promise<boolean> {
//        await browser.wait(this.EC.visibilityOf($(this.selectors.deleteButton)));
        return await $(this.selectors.deleteButton).isPresent();
    }

    async clickOnReadAccessConfiguration(): Promise<void> {
//        await browser.wait(this.EC.visibilityOf($(this.selectors.addReadAccessBtn)));
        await $(this.selectors.addReadAccessBtn).click();
    }

    async addColumns(columnNames: string[]): Promise<void> {
        await utilGrid.addGridColumn(this.selectors.guid, columnNames);
    }

    async removeColumns(columnNames: string[]): Promise<void> {
        await utilGrid.removeGridColumn(this.selectors.guid, columnNames);
    }

    async getValueOnReadAccessConfigGrid(columnName:string): Promise<string>{
        return await utilGrid.getSelectedGridRecordValue(this.selectors.guid,columnName);
    }

}

export default new ReadAccessConsolePage();