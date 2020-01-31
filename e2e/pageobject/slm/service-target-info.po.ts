import { $, browser, protractor, ProtractorExpectedConditions } from "protractor";

class ServiceTargetInfo {
    EC: ProtractorExpectedConditions = protractor.ExpectedConditions;

    selectors = {
        serviceTargetInformationBlade: 'form[name="svtInfo"]',
        serviceTargetInformationHeader: 'div.modal-header',
        serviceTargetInformationCloseButton: 'div.action-blade__button-container button',
        serviceTargetitle: 'div.modal-body .row .d-textfield__label',
        serviceTargetStatus: 'div.status-container .marginleft5',
        serviceTargetInformationInProceessIcon: 'div.status-container .d-icon-right-triangle_right_circle_o',
        serviceTargetInformationWarningIcon: 'div.status-container .d-icon-right-exclamation_circle',
        serviceTargetInformationMissedGoalIcon: 'div.status-container .d-icon-right-cross_circle_o',
        serviceTargetInformationDualSVTIcon: 'div.status-container .d-icon-right-circle_o',
        serviceTargetInformationPausedIcon: 'div.status-container .d-icon-right-check_circle_o'
    }

    async isServiceTargetInformationBladeDisplayed(): Promise<boolean> {
//        await browser.wait(this.EC.visibilityOf($(this.selectors.serviceTargetInformationBlade)));
        return await $(this.selectors.serviceTargetInformationBlade).isDisplayed();
    }

    async getServiceTargetInformationBladeHeader(): Promise<string> {
//        await browser.wait(this.EC.elementToBeClickable($(this.selectors.serviceTargetInformationHeader)));
        return await $(this.selectors.serviceTargetInformationHeader).getText();
    }

    async getServiceTargetInformationDetails() {
//        await browser.wait(this.EC.elementToBeClickable($(this.selectors.serviceTargetInformationCloseButton)));
    }

    async isServiceTargetInformationInProcessIconDisplayed(): Promise<boolean> {
//        await browser.wait(this.EC.visibilityOf($(this.selectors.serviceTargetInformationInProceessIcon)));
        return await $(this.selectors.serviceTargetInformationInProceessIcon).isDisplayed();
    }

    async isServiceTargetInformationWarningIconDisplayed(): Promise<boolean> {
//        await browser.wait(this.EC.visibilityOf($(this.selectors.serviceTargetInformationWarningIcon)));
        return await $(this.selectors.serviceTargetInformationWarningIcon).isDisplayed();
    }

    async isServiceTargetInformationPausedIconDisplayed(): Promise<boolean> {
//        await browser.wait(this.EC.visibilityOf($(this.selectors.serviceTargetInformationPausedIcon)));
        return await $(this.selectors.serviceTargetInformationPausedIcon).isDisplayed();
    }

    async isServiceTargetInformationDualSVTIconDisplayed(): Promise<boolean> {
//        await browser.wait(this.EC.visibilityOf($(this.selectors.serviceTargetInformationDualSVTIcon)));
        return await $(this.selectors.serviceTargetInformationDualSVTIcon).isDisplayed();
    }

    async isServiceTargetInformationMissedGoalIconDisplayed(): Promise<boolean> {
//        await browser.wait(this.EC.visibilityOf($(this.selectors.serviceTargetInformationMissedGoalIcon)));
        return await $(this.selectors.serviceTargetInformationMissedGoalIcon).isDisplayed();
    }
}

export default new ServiceTargetInfo();