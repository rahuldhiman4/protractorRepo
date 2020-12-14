import utilGrid from '../../../utils/util.grid';
import { $, protractor, ProtractorExpectedConditions, $$, browser } from 'protractor';

class ApprovalMappingConsole {

    EC: ProtractorExpectedConditions = protractor.ExpectedConditions;

    selectors = {
        createApprovalMapping: '[rx-view-component-id="b811f637-d94e-4850-8423-25e6f525f319"] button',
        deleteButton: '.d-icon-left-cross',
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
        await utilGrid.addGridColumn(this.selectors.gridGUID, columnName);
    }

    async removeColumnFromGrid(columnName: string[]): Promise<void> {
        await utilGrid.removeGridColumn(this.selectors.gridGUID, columnName)
    }
    async areGridColumnMatches(data: string[]): Promise<boolean>{
        return await utilGrid.areColumnHeaderMatches(this.selectors.gridGUID, data);
    }
    async isColumnSorted(value: string, sortType: string): Promise<boolean> {
        return await utilGrid.isGridColumnSorted(value, sortType, this.selectors.gridGUID)
    }
    async addFilter(fieldName: string, textValue: string,type:string): Promise<void> {
        await utilGrid.addFilter(fieldName,textValue,type);
    }
    async isRecordPresent(value: string): Promise<boolean> {
        return await utilGrid.isGridRecordPresent(value, this.selectors.gridGUID)
    }
    async searchValueOnGrid(value:string): Promise<void> {
        await utilGrid.searchOnGridConsole(value);
    }

}

export default new ApprovalMappingConsole();
