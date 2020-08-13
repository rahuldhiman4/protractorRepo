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

}

export default new ApprovalMappingConsole();
