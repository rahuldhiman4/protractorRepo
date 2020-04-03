import { $, browser, protractor, ProtractorExpectedConditions, element,by, $$ } from "protractor";

class ServiceTargetInfo {
    EC: ProtractorExpectedConditions = protractor.ExpectedConditions;

    selectors = {
        serviceTargetInformationBlade: 'fieldset[role="document"]',
        serviceTargetInformationHeader: 'fieldset[role="document"] .dp-header',
        serviceTargetInformationCloseButton: '.dp-footer > button',
        serviceTargeDetails: '.progress-bar-info__details-label strong',
        serviceTargetStatus: 'adapt-icon[role="img"] + span',
        serviceTargetInformationInProceessIcon: 'svg#triangle_right_circle_o',
        serviceTargetInformationWarningIcon: 'svg#exclamation_circle_o',
        serviceTargetInformationMissedGoalIcon: 'svg#cross_circle_o',
        serviceTargetInformationDualSVTIcon: 'div.status-container .d-icon-right-circle_o',
        serviceTargetInformationPausedIcon: 'svg#pause_circle_o',
        serviceTargetInformationSVTMetIcon: 'svg#check_circle_o',
        serviceTargetDueDate: '.progress-bar-info__details-label',
    }

    async isServiceTargetInformationBladeDisplayed(): Promise<boolean> {
        //        await browser.wait(this.EC.visibilityOf($(this.selectors.serviceTargetInformationBlade)));
        return await $(this.selectors.serviceTargetInformationBlade).isDisplayed();
    }

    async getServiceTargetInformationBladeHeader(): Promise<string> {
        //        await browser.wait(this.EC.elementToBeClickable($(this.selectors.serviceTargetInformationHeader)));
        return await $(this.selectors.serviceTargetInformationHeader).getText();
    }

    async isServiceTargetInformationDetails(fieldOptionValue:string): Promise<boolean> {
        //        await browser.wait(this.EC.elementToBeClickable($(this.selectors.serviceTargetInformationCloseButton)));
       return await element(by.cssContainingText(this.selectors.serviceTargeDetails, fieldOptionValue)).isDisplayed();
    }

    async isServiceTargetDueDateDisplayed(): Promise<boolean> {
        //        await browser.wait(this.EC.elementToBeClickable($(this.selectors.serviceTargetInformationCloseButton)));
        return await $$(this.selectors.serviceTargetDueDate).last().isDisplayed();
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

    async isServiceTargetInformationSVTMetIconDisplayed(): Promise<boolean> {
        //        await browser.wait(this.EC.visibilityOf($(this.selectors.serviceTargetInformationSVTMetIcon)));
        return await $(this.selectors.serviceTargetInformationSVTMetIcon).isDisplayed();
    }

    async getServiceTargetStatus(): Promise<string> {
        //        await browser.wait(this.EC.elementToBeClickable($(this.selectors.serviceTargetInformationHeader)));
        return await $(this.selectors.serviceTargetStatus).getText();
    }

    async clickOnCloseButton(): Promise<void> {
        //        await browser.wait(this.EC.elementToBeClickable($(this.selectors.serviceTargetInformationHeader)));
        await $(this.selectors.serviceTargetInformationCloseButton).click();
    }

}

export default new ServiceTargetInfo();