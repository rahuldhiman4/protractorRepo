import { $, $$, browser, by, element, protractor, ProtractorExpectedConditions } from 'protractor';
import utilityGrid from "../../../utils/utility.grid";

class CognitiveConsole {

    EC: ProtractorExpectedConditions = protractor.ExpectedConditions;

    selectors = {
        addButton: '.d-icon-left-plus',
        categorizationConsoleGuid: '3c8c8144-6110-4cee-8f30-3e5106c1bc31',
        templateConsoleGuid: '7163990a-b8b8-4b92-a7c6-5aa4d06634f1',
    }

    async clickAddDataSetMapping(): Promise<void> {
        await $(this.selectors.addButton).click();
    }

    async isColumnSortedOnCategorization(value: string, sortType: string): Promise<boolean> {
        return await utilityGrid.isGridColumnSorted(value, sortType, this.selectors.categorizationConsoleGuid)
    }

    async addFilterOnCategorization(header: string, value: string, type: string): Promise<void> {
        await utilityGrid.addFilter(header, value, type, this.selectors.categorizationConsoleGuid)
    }

    async isRecordPresentOnCategorization(value: string): Promise<boolean> {
        return await utilityGrid.isGridRecordPresent(value, this.selectors.categorizationConsoleGuid)
    }

    async addColumnOnCategorization(value: string[]): Promise<void> {
        await utilityGrid.addGridColumn( value, this.selectors.categorizationConsoleGuid);
   }

    async isColumnSortedOnTemplate(value: string, sortType: string): Promise<boolean> {
        return await utilityGrid.isGridColumnSorted(value, sortType, this.selectors.templateConsoleGuid)
    }

    async addFilterOnTemplate(header: string, value: string, type: string): Promise<void> {
        await utilityGrid.addFilter(header, value, type, this.selectors.templateConsoleGuid)
    }

    async isRecordPresentOnTemplate(value: string): Promise<boolean> {
        return await utilityGrid.isGridRecordPresent(value, this.selectors.templateConsoleGuid)
    }

    async addColumnOnTemplate(value: string[]): Promise<void> {
         await utilityGrid.addGridColumn(value, this.selectors.templateConsoleGuid);
    }
}

export default new CognitiveConsole();
