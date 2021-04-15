import utilityGrid from '../../../utils/utility.grid';
import { $, protractor, ProtractorExpectedConditions, $$, browser } from 'protractor';

class ApprovalMappingConsole {

    EC: ProtractorExpectedConditions = protractor.ExpectedConditions;

    selectors = {
        createApprovalMapping: '[rx-view-component-id="59ccc726-2512-43ae-9806-c838be2665c3"] button',
        deleteButton: '.d-icon-left-cross',
    }

    async clickCreateApprovalMappingBtn(): Promise<void> {
        await $(this.selectors.createApprovalMapping).click();
    }

    async clickDeleteApprovalMapping():Promise<void>{
        await $(this.selectors.deleteButton).click();
    }

    async isCreateApprovalMappingButtonDisplayed(): Promise<boolean> {
        return await $(this.selectors.createApprovalMapping).isPresent().then(async (result) => {
            if (result) return await $(this.selectors.createApprovalMapping).isDisplayed();
            else return false;
        });
    }

    async searchAndOpenApproval(value : string):Promise<void>{
        await utilityGrid.searchAndOpenHyperlink(value);
    }
}

export default new ApprovalMappingConsole();
