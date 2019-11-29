import { ProtractorExpectedConditions, protractor, browser, $ } from "protractor"

class AssignmentsConfigPage {
    EC: ProtractorExpectedConditions = protractor.ExpectedConditions;

    selectors = {
        addAssignmentBtn: '[rx-view-component-id="3d2b6371-d60f-4346-a9c0-7815d2cd4241"] button',
        deleteButton: '[rx-view-component-id="10da8112-39a0-4be3-9388-f526f2fd1bbd"] button',
    }

    async isAddAssignmentsBtnDisabled(): Promise<boolean> {
        await browser.wait(this.EC.visibilityOf($(this.selectors.addAssignmentBtn)));
        return await $(this.selectors.addAssignmentBtn).getAttribute("disabled")=="true";
    }

    async isDeleteAssignmentConfigBtnDisabled(): Promise<boolean> {
        await browser.wait(this.EC.visibilityOf($(this.selectors.deleteButton)));
        return await $(this.selectors.deleteButton).getAttribute("disabled")=="true";
    }
}

export default new AssignmentsConfigPage();