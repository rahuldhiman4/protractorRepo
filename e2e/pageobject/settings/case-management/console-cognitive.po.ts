import { $, $$, browser, by, element, protractor, ProtractorExpectedConditions } from 'protractor';
import utilCommon from "../../../utils/util.common";
import utilGrid from "../../../utils/util.grid";

class CognitiveConsole {

    EC: ProtractorExpectedConditions = protractor.ExpectedConditions;

    selectors = {
        addButton: '[class="d-button d-icon-left-plus d-button_link"]',
        categorizationConsoleGuid: '3c8c8144-6110-4cee-8f30-3e5106c1bc31',
        templateConsoleGuid: '7163990a-b8b8-4b92-a7c6-5aa4d06634f1',
    }

    async clickAddDataSetMapping(): Promise<void> {
        await $(this.selectors.addButton).click();
    }

    async isColumnSortedOnCategorization(value: string, sortType: string): Promise<boolean> {
        return await utilGrid.isGridColumnSorted(value, sortType, this.selectors.categorizationConsoleGuid)
    }

    async addFilterOnCategorization(header: string, value: string, type: string): Promise<void> {
        await utilGrid.addFilter(header, value, type, this.selectors.categorizationConsoleGuid)
    }

    async isRecordPresentOnCategorization(value: string): Promise<boolean> {
        return await utilGrid.isGridRecordPresent(value, this.selectors.categorizationConsoleGuid)
    }

    async addColumnOnCategorization(value: string[]): Promise<void> {
        await utilGrid.addGridColumn( this.selectors.categorizationConsoleGuid,value);
   }

    async isColumnSortedOnTemplate(value: string, sortType: string): Promise<boolean> {
        return await utilGrid.isGridColumnSorted(value, sortType, this.selectors.templateConsoleGuid)
    }

    async addFilterOnTemplate(header: string, value: string, type: string): Promise<void> {
        await utilGrid.addFilter(header, value, type, this.selectors.templateConsoleGuid)
    }

    async isRecordPresentOnTemplate(value: string): Promise<boolean> {
        return await utilGrid.isGridRecordPresent(value, this.selectors.templateConsoleGuid)
    }

    async addColumnOnTemplate(value: string[]): Promise<void> {
         await utilGrid.addGridColumn( this.selectors.templateConsoleGuid,value);
    }

}

export default new CognitiveConsole();
