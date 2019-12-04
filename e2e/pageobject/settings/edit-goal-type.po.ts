import { ProtractorExpectedConditions, protractor, browser, $ } from "protractor"

class GoalTypeConfigEditPage {
    EC: ProtractorExpectedConditions = protractor.ExpectedConditions;

    selectors = {
        status: '[rx-view-component-id="16be0d06-4165-49f0-ba10-5478ae4ad12e"] .ui-select-toggle',
        saveButton: '[rx-view-component-id="4b12ddce-1f8a-45fa-904c-e1a472254492"] button',
        closeButton: '[rx-view-component-id="496593b2-24b6-4a4d-bcc1-5a4899992582"] button'
    }

    async isStatusFieldDisabled(): Promise<boolean>{
        await browser.wait(this.EC.elementToBeClickable($(this.selectors.closeButton)));
        return await $(this.selectors.status).getAttribute("disabled")=="true";
    }

    async isSaveButtonDisabled(): Promise<boolean>{
        await browser.wait(this.EC.elementToBeClickable($(this.selectors.closeButton)));
        return await $(this.selectors.status).getAttribute("disabled")=="true";
    }
}

export default new GoalTypeConfigEditPage();