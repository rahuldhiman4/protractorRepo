import { $, browser, protractor, ProtractorExpectedConditions, element, by, $$, Key, WebElement, ElementArrayFinder, ElementFinder } from "protractor";

class NotificationAlerts {
    EC: ProtractorExpectedConditions = protractor.ExpectedConditions;
    selectors = {
        notificationIcon: '.d-icon-left-bell_o',
        alerts: '.rx-shell-notification__item-content-text',
        clearAllBtn: '[rx-id="dismiss-all-notifications-button"]',
        notificationButtons: '.rx-shell-notification__buttons-wrapper .d-button_action-clear'
    }

    async clickOnNotificationIcon(): Promise<void> {
//        await browser.wait(this.EC.elementToBeClickable($(this.selectors.notificationIcon)));
        await $(this.selectors.notificationIcon).click();
    }

    async isAlertPresent(msg: string): Promise<boolean> {
//        await browser.wait(this.EC.elementToBeClickable($$(this.selectors.notificationButtons).get(0)));
        let cnt: number = await $$(this.selectors.alerts).count();
        let status = false;
        for (let i = 0; i < cnt; i++) {
            let notification: string = await $$(this.selectors.alerts).get(i).getText();
            if (await notification === msg) {
                status = true;
                break;
            }
        }
        return status;
    }

}

export default new NotificationAlerts();