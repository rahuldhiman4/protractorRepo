import utilityGrid from '../../../utils/utility.grid';
import { $, protractor, ProtractorExpectedConditions, $$, browser } from 'protractor';

class ApprovalMappingConsole {

    EC: ProtractorExpectedConditions = protractor.ExpectedConditions;

    selectors = {
        createApprovalMapping: '[rx-view-component-id="b811f637-d94e-4850-8423-25e6f525f319"] button',
        deleteButton: '.d-icon-left-trash',
        gridGUID:'8f270429-325e-4c59-b100-8d1c269ddc16',
    }

    async clickCreateApprovalMappingBtn(): Promise<void> {
        await $(this.selectors.createApprovalMapping).click();
    }

    async isCreateApprovalMappingBtnEnabled(): Promise<boolean> {
      return  await $(this.selectors.createApprovalMapping).isEnabled();
    }

    async clickDeleteApprovalMapping():Promise<void>{
        await $(this.selectors.deleteButton).click();
    }

    async isAddApprovalMappingBtnDisplayed(): Promise<boolean> {
        return await $(this.selectors.createApprovalMapping).isPresent().then(async (result) => {
            if (result) {
                return await $(this.selectors.createApprovalMapping).isDisplayed();
            } else return false;
        });
    }

    async isDeleteApprovalMappingBtnDisplayed(): Promise<boolean> {
        return await $(this.selectors.deleteButton).isPresent().then(async (result) => {
            if (result) {
                return await $(this.selectors.deleteButton).isDisplayed();
            } else return false;
        });
    }
    async addColumnOnGrid(columnName: string[]): Promise<void> {
        await utilityGrid.addGridColumn(columnName,this.selectors.gridGUID);
    }

    async removeColumnFromGrid(columnName: string[]): Promise<void> {
        await utilityGrid.removeGridColumn(columnName,this.selectors.gridGUID)
    }
    async areGridColumnMatches(data: string[]): Promise<boolean>{
        return await utilityGrid.areColumnHeaderMatches(data,this.selectors.gridGUID);
    }
    async isColumnSorted(value: string, sortType: string): Promise<boolean> {
        return await utilityGrid.isGridColumnSorted(value, sortType, this.selectors.gridGUID)
    }
    async addFilter(fieldName: string, textValue: string,type:string): Promise<void> {
        await utilityGrid.addFilter(fieldName,textValue,type);
    }
    async isRecordPresent(value: string): Promise<boolean> {
        return await utilityGrid.isGridRecordPresent(value, this.selectors.gridGUID)
    }
    async searchValueOnGrid(value:string): Promise<void> {
        await utilityGrid.searchRecord(value);
    }

}

export default new ApprovalMappingConsole();
