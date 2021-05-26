import { $, protractor, ProtractorExpectedConditions, $$, browser } from 'protractor';

class ApprovalMappingConsole {

    EC: ProtractorExpectedConditions = protractor.ExpectedConditions;

    selectors = {
        createApprovalMapping: '[rx-view-component-id="09c995c2-71dc-4b58-8844-56b3910af357"] button',
        deleteButton: '.d-icon-left-cross',
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
}

export default new ApprovalMappingConsole();