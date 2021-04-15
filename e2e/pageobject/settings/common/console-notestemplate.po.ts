import { $, browser, by, element, protractor, ProtractorExpectedConditions } from "protractor";
import utilityGrid from "../../../utils/utility.grid";
class ConsoleNotesTemplate {

    EC: ProtractorExpectedConditions = protractor.ExpectedConditions;
    selectors = {
        notesTemplate: '.rx-runtime-view-canvas-item-margin .d-icon-left-plus',
        gridGuid: '25aff7c5-2405-4d61-8a4f-8db53b033c31',
        deleteButton: '.d-icon-left-cross',
        searchTextBox: '.adapt-search-triggerable input',
        searchButton: '.adapt-search-triggerable .input-group-append',
        refreshButton: '.d-icon-refresh',
        templateName: '[rx-view-component-id="438e2c9d-b937-4ab5-8718-7ddb98073ee6"] input',
    }

    async isCreateNotesTemplateEnabled(): Promise<boolean> {
        //        await browser.wait(this.EC.elementToBeClickable($(this.selectors.notesTemplate)));
      return  await $(this.selectors.notesTemplate).isEnabled();
    }

    async clickOnCreateNotesTemplate(): Promise<void> {
        await $(this.selectors.notesTemplate).isPresent().then(async (present) => {
            if(present) {
                await $(this.selectors.notesTemplate).isDisplayed().then(async (displayed) => {
                    if(displayed) await $(this.selectors.notesTemplate).click();
                });
            }
            else{
                await browser.sleep(2000);
                await $(this.selectors.notesTemplate).click();
            }
        });
    }

    async clickOnTemplateName(temmplateName: string): Promise<void> {
        await utilityGrid.searchAndOpenHyperlink(temmplateName, this.selectors.gridGuid);
    }

    async searchAndClickNotesTemplateCheckBox(temmplateNameValue: string): Promise<void> {
        //        await browser.wait(this.EC.invisibilityOf($(this.selectors.body)));
        await utilityGrid.searchAndSelectGridRecord(temmplateNameValue);
    }

    async searchAndClickOnNotesTemplate(templateName: string): Promise<void> {
        await utilityGrid.searchAndOpenHyperlink(templateName);
    }

    async isTemplatePresentOnGrid(templateNameValue): Promise<boolean> {
        return await utilityGrid.isGridRecordPresent(templateNameValue, this.selectors.gridGuid)
    }

    async isNotesTemplateUIConsolePresent(): Promise<boolean> {
        //        await browser.wait(this.EC.visibilityOf($(this.selectors.searchTextBox)));
        let a: boolean = await $(this.selectors.searchTextBox).isDisplayed();
        //        await browser.wait(this.EC.visibilityOf($(this.selectors.searchButton)));
        let b: boolean = await $(this.selectors.searchButton).isDisplayed();
        //        await browser.wait(this.EC.visibilityOf($(this.selectors.refreshButton)));
        let c: boolean = await $(this.selectors.refreshButton).isDisplayed();
        //        await browser.wait(this.EC.visibilityOf($(this.selectors.notesTemplate)));
        let d: boolean = await $(this.selectors.notesTemplate).isDisplayed();
        return (a == b == c == d == true);
    }

    async isAddNotesTemplateBtnDisplayed(): Promise<boolean> {
        //        await browser.wait(this.EC.visibilityOf($(this.selectors.notesTemplate)));
        return await $(this.selectors.notesTemplate).isPresent();
    }

    async isDeleteNotesTemplateBtnDisplayed(): Promise<boolean> {
        //        await browser.wait(this.EC.visibilityOf($(this.selectors.deleteButton)));
        return await $(this.selectors.deleteButton).isPresent();
    }
    
    async getSelectedGridRecordValue(columnHeader: string): Promise<string> {
        return await utilityGrid.getFirstGridRecordColumnValue(this.selectors.gridGuid, columnHeader);
    }

    async isGridColumnSorted(columnName: string ): Promise<boolean> {
        return await utilityGrid.isGridColumnSorted(columnName, 'ascending', this.selectors.gridGuid);
    }

    async getGuidValue(): Promise<string> {
        return await utilityGrid.getFirstGridRecordColumnValue('ID', this.selectors.gridGuid);
    }

    async addColumns(columnNames: string[]): Promise<void> {
        await utilityGrid.addGridColumn(columnNames,this.selectors.gridGuid);
    } 

    async removeColumns(columnNames: string[]): Promise<void> {
        await utilityGrid.removeGridColumn(columnNames,this.selectors.gridGuid);
    } 

}

export default new ConsoleNotesTemplate();