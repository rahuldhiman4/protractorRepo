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
}

export default new ApprovalMappingConsole();
