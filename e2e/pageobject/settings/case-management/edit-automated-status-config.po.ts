import { $, browser, protractor, ProtractorExpectedConditions, ElementFinder } from "protractor";

class AutomatedStatusTransitionConfigEditPage {
    EC: ProtractorExpectedConditions = protractor.ExpectedConditions;

    selectors = {
        editName: '[rx-view-component-id="268f80d9-bafd-4eb0-af14-6f840f15fa17"] input',
        saveButton: '[rx-view-component-id="ad37ab48-7323-4dd3-b878-2a848311fa57"] button',
        cancelButton: '[rx-view-component-id="4a9c6994-7143-4cb9-9d77-e0382cc01491"] button',
    }

    async isAutomatedStatusTransitionNameEnabled(): Promise<boolean> {
        let nameElement: ElementFinder = await $(this.selectors.editName);
//        await browser.wait(this.EC.visibilityOf(nameElement));
        return await nameElement.getAttribute('readonly') == 'true' ? false : true;
    }

    async isAutomatedStatusTransitionSaveBtnEnabled(): Promise<boolean> {
        let saveButton = await $(this.selectors.saveButton);
//        await browser.wait(this.EC.visibilityOf(saveButton));
        return await saveButton.isEnabled();
    }

    async clickCancel(): Promise<void> {
//        await browser.wait(this.EC.elementToBeClickable($(this.selectors.cancelButton)))
        await $(this.selectors.cancelButton);
    }
}

export default new AutomatedStatusTransitionConfigEditPage();