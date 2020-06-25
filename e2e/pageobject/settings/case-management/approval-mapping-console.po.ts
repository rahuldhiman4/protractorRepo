import { $, protractor, ProtractorExpectedConditions, $$, browser } from 'protractor';

class ApprovalMappingConsole {

    EC: ProtractorExpectedConditions = protractor.ExpectedConditions;

    selectors = {
        createApprovalMapping: '[rx-view-component-id="b811f637-d94e-4850-8423-25e6f525f319"] button',
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
