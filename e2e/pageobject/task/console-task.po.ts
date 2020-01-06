import { $, $$, browser, by, element, Key, protractor, ProtractorExpectedConditions } from "protractor";
import utilGrid from '../../utils/util.grid'


class TaskGridPage {

    EC: ProtractorExpectedConditions = protractor.ExpectedConditions;
    selectors = {
        searchTemplate: '[rx-id="search-text-input"]',
        recommendedTemplateLink: '.ui-grid__link',
        recommendedTemplateCheckBox: '.ui-grid-icon-ok',
        filter: '.rx-search-filter__trigger',
        availableFilterDrpDown: '.d-accordion__title',
        applyFilter: '.rx-search-filter-heading__apply',
        removeFilter: '..d-tag-remove-button',
        tableValue: '.ui-grid-cell-contents',
        taskTitle: '[rx-view-component-id="3ebf9e95-a77a-47f7-a531-c4c549e42333"] span',
        taskGuid: '9e02c1c1-6544-4d92-9114-823a9ff9fdcd',
        columnHeaders: '.ui-grid-header-cell-label',
    }

    async getSortedValueFromColumn(columnHeader: string): Promise<string> {
        columnHeader = "'" + columnHeader + "'";
        let guid:string = "'" + this.selectors.taskGuid + "'";
        let gridColumnHeaderPosition = `//*[@rx-view-component-id=${guid}]//span[@class="ui-grid-header-cell-label"][text()=${columnHeader}]/parent::div/parent::div[@role='columnheader']/parent::div/preceding-sibling::*`;
        let columnPosition: number = await element.all(by.xpath(gridColumnHeaderPosition)).count();
        columnPosition = columnPosition + 1;
        let sortedValue:string =await browser.element(by.xpath("(//*[@class='ui-grid-cell-contents'])"+"["+columnPosition+"]")).getText()
        return sortedValue;
      }

      async clickOnColumnAndisColumnSortedAsending(colounm:string): Promise<boolean> {
         return await utilGrid.isGridColumnSorted(colounm,'ascending',this.selectors.taskGuid);
      }

      async clickOnColumnAndisColumnSortedDescending(colounm:string): Promise<boolean> {
      return  await utilGrid.isGridColumnSorted(colounm,'descending',this.selectors.taskGuid);
    }

      async clickonColumnHeader(value:string): Promise<void> {
        await browser.wait(this.EC.elementToBeClickable($(this.selectors.columnHeaders)));
        await element(by.cssContainingText(this.selectors.columnHeaders,value)).click();
    }

    async getFilterValue(copy: string): Promise<boolean> {
        let arr: string[] = await this.getAllValuesFromColumn();
        return arr.length === copy.length && arr.every(
                        (value, index) => (value === copy[index])
                    );
    }

    async getAllValuesFromColumn(): Promise<string[]> {
        let gridRecord: string[]= [];
        let gridColumnHeaderPosition = `//*[@rx-view-component-id='9e02c1c1-6544-4d92-9114-823a9ff9fdcd']//span[@class="ui-grid-header-cell-label"][text()='Task Type']/parent::div/parent::div[@role='columnheader']/parent::div/preceding-sibling::*`;
        let gridAllColumnHeaderPosition = `//*[@rx-view-component-id='9e02c1c1-6544-4d92-9114-823a9ff9fdcd']//span[@class="ui-grid-header-cell-label"]/parent::div/parent::div[@role='columnheader']/parent::div/preceding-sibling::*`;
        let allElement = "[role='gridcell']";
        let allElementSize: number = await element.all(by.css(allElement)).count();
        let columnPosition: number = await element.all(by.xpath(gridColumnHeaderPosition)).count();
        let coloumnSize:number = await element.all(by.xpath(gridAllColumnHeaderPosition)).count()+1;
        columnPosition = columnPosition + 1;
        console.log('Count:' +allElementSize+","+columnPosition+','+coloumnSize);
        for(columnPosition;columnPosition<allElementSize; columnPosition=columnPosition+coloumnSize){
            gridRecord[columnPosition]= await browser.element(by.xpath("(//*[@class='ui-grid-cell-contents'])"+"["+columnPosition+"]")).getText()
        }
        let returnedvalue =gridRecord.filter(function (el) {
                        return el != null;
                      });
        return returnedvalue ;
    }

    async setTaskSearchBoxValue(input: string): Promise<void> {
        await browser.wait(this.EC.visibilityOf($(this.selectors.searchTemplate)));
        await $(this.selectors.searchTemplate).clear();
        await $(this.selectors.searchTemplate).sendKeys(input, Key.ENTER);
    }

    async getTaskTitle(): Promise<string> {
        await browser.wait(this.EC.visibilityOf($(this.selectors.taskTitle)));
        return await $(this.selectors.taskTitle).getText();
    }

    async clickFirstLinkInTaskTemplateSearchGrid(): Promise<void> {
        await browser.wait(this.EC.elementToBeClickable($(this.selectors.recommendedTemplateLink)));
        await browser.sleep(3000);
        await $$(this.selectors.recommendedTemplateLink).first().click();
    }

    async isCaseIdLinkIsPresent(): Promise<boolean> {
        await browser.wait(this.EC.visibilityOf(element(by.xpath("(//*[@role='gridcell'])[2]//a"))));
        var caseId: string = await element(by.xpath("(//*[@role='gridcell'])[2]//a")).getText();
        return caseId.includes('CASE');
    }
    async clickFirstCheckBoxInTaskTemplateSearchGrid(): Promise<void> {
        await browser.wait(this.EC.elementToBeClickable($(this.selectors.recommendedTemplateCheckBox)));
        await browser.sleep(3000);
        await $(this.selectors.recommendedTemplateCheckBox).click();
    }
    async getFilteredValue(filterName: string): Promise<string> {
        await browser.wait(this.EC.visibilityOf($(this.selectors.tableValue)));
        await browser.sleep(3000);
        return await element(by.cssContainingText(this.selectors.tableValue, filterName)).getText();
    }

}
export default new TaskGridPage();