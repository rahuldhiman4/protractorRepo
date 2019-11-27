import { ProtractorExpectedConditions, protractor, browser, $ } from "protractor"

class AutomatedStatusTransitionConfigEditPage {
    EC: ProtractorExpectedConditions = protractor.ExpectedConditions;

    selectors = {
        editName: '[rx-view-component-id="268f80d9-bafd-4eb0-af14-6f840f15fa17"] input',
        saveButton: '[rx-view-component-id="ad37ab48-7323-4dd3-b878-2a848311fa57"] button',
        cancelButton: '[rx-view-component-id="4a9c6994-7143-4cb9-9d77-e0382cc01491"] button'
    }

    async isAutomatedStatusTransitionNameDisabled(): Promise<boolean> {
        await browser.wait(this.EC.visibilityOf($(this.selectors.editName)));
        let readProperty: string = await $(this.selectors.editName).getAttribute("readonly");
        if (readProperty == "true") {
            return true;
        }
        else {
            return false;
        }
    }

    async isAutomatedStatusTransitionSaveBtnDisabled(): Promise<boolean> {
        await browser.wait(this.EC.visibilityOf($(this.selectors.saveButton)));
        let readProperty: string = await $(this.selectors.saveButton).getAttribute("disabled");
        if (readProperty == "true") {
            return true;
        }
        else {
            return false;
        }
    }

    async clickCancel(): Promise<void> {
        await browser.wait(this.EC.elementToBeClickable($(this.selectors.cancelButton)))
        await $(this.selectors.cancelButton);
    }

}

export default new AutomatedStatusTransitionConfigEditPage();