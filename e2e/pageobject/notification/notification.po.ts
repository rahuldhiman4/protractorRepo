import { $, browser, protractor, ProtractorExpectedConditions, element, by, $$, Key, WebElement, ElementArrayFinder, ElementFinder } from "protractor";

class NotificationAlerts {
    EC: ProtractorExpectedConditions = protractor.ExpectedConditions;
    selectors = {
        notificationIcon: 'button.d-icon-bell_o[title="Messages"]',
        alerts: '.active-messages .item-content-section'
    }

    async clickOnNotificationIcon(): Promise<void> {
        //        await browser.wait(this.EC.elementToBeClickable($(this.selectors.notificationIcon)));
        await $(this.selectors.notificationIcon).click();
    }

    async isAlertPresent(msg: string): Promise<boolean> {
        //        await browser.wait(this.EC.elementToBeClickable($$(this.selectors.notificationButtons).get(0)));
        let cnt: number = await $$(this.selectors.alerts).count();
        for (let i = 0; i < cnt; i++) {
            let notification: string = await $$(this.selectors.alerts).get(i).$('.item-content-text').getText();
            if (notification.replace(/\s/g, "").includes(msg.replace(/\s/g, ""))) return true
        }
        return false;
    }

    async clickActionableLink(msg: string): Promise<void> {
        let cnt: number = await $$(this.selectors.alerts).count();
        for (let i = 0; i < cnt; i++) {
            let notification: string = await $$(this.selectors.alerts).get(i).$('.item-content-text').getText();
            let trimmedNotification = notification.replace(/\s/g, "");
            if (trimmedNotification.includes(msg.replace(/\s/g, ""))) {
                await $$(this.selectors.alerts).get(i).$('.item-content-text p a').click();
                break;
            }
        }
    }
}

export default new NotificationAlerts();