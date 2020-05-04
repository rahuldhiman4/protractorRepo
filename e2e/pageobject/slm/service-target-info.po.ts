import { $, browser, protractor, ProtractorExpectedConditions, element,by, $$ } from "protractor";

let serviceTargetInformationInProceessIcon = 'triangle_right_circle_o';
let serviceTargetInformationWarningIcon = 'exclamation_circle_o';
let serviceTargetInformationMissedGoalIcon = 'cross_circle_o';
let serviceTargetInformationPausedIcon = 'pause_circle_o';
let serviceTargetInformationSVTMetIcon = 'check_circle_o';


class ServiceTargetInfo {
    EC: ProtractorExpectedConditions = protractor.ExpectedConditions;

    selectors = {
        serviceTargetInformationBlade: 'fieldset[role="document"]',
        serviceTargetInformationHeader: 'fieldset[role="document"] .dp-header',
        serviceTargetInformationCloseButton: '.dp-footer > button',
        serviceTargeDetails: '.progress-bar-info__details-label strong',
        serviceTargetStatus: 'adapt-icon[role="img"] + span',
        serviceTargetInformationIcons: 'svg use',
        serviceTargetInformationDualSVTIcon: 'div.status-container .d-icon-right-circle_o',
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

    async isServiceTargetInformationFieldValues(fieldOptionValue:string): Promise<boolean> {
        //        await browser.wait(this.EC.elementToBeClickable($(this.selectors.serviceTargetInformationCloseButton)));
       return await element(by.cssContainingText('.dp-body div div', fieldOptionValue)).isDisplayed();
    }

    async isServiceTargetDueDateDisplayed(): Promise<boolean> {
        //        await browser.wait(this.EC.elementToBeClickable($(this.selectors.serviceTargetInformationCloseButton)));
        return await $$(this.selectors.serviceTargetDueDate).last().isDisplayed();
    }

    async isServiceTargetInformationInProcessIconDisplayed(): Promise<boolean> {
        return await (await $(this.selectors.serviceTargetInformationIcons).getAttribute('xlink:href')).includes(serviceTargetInformationInProceessIcon);
    }

    async isServiceTargetInformationWarningIconDisplayed(): Promise<boolean> {
        //        await browser.wait(this.EC.visibilityOf($(this.selectors.serviceTargetInformationWarningIcon)));
        return await (await $(this.selectors.serviceTargetInformationIcons).getAttribute('xlink:href')).includes(serviceTargetInformationWarningIcon);
    }

    async isServiceTargetInformationPausedIconDisplayed(): Promise<boolean> {
        //        await browser.wait(this.EC.visibilityOf($(this.selectors.serviceTargetInformationPausedIcon)));
        return await (await $(this.selectors.serviceTargetInformationIcons).getAttribute('xlink:href')).includes(serviceTargetInformationPausedIcon);
    }

    async isServiceTargetInformationDualSVTIconDisplayed(): Promise<boolean> {
        //        await browser.wait(this.EC.visibilityOf($(this.selectors.serviceTargetInformationDualSVTIcon)));
        return await $(this.selectors.serviceTargetInformationDualSVTIcon).isPresent();
    }

    async isServiceTargetInformationMissedGoalIconDisplayed(): Promise<boolean> {
        //        await browser.wait(this.EC.visibilityOf($(this.selectors.serviceTargetInformationMissedGoalIcon)));
        return await (await $(this.selectors.serviceTargetInformationIcons).getAttribute('xlink:href')).includes(serviceTargetInformationMissedGoalIcon);
    }

    async isServiceTargetInformationSVTMetIconDisplayed(): Promise<boolean> {
        //        await browser.wait(this.EC.visibilityOf($(this.selectors.serviceTargetInformationSVTMetIcon)));
        return await (await $(this.selectors.serviceTargetInformationIcons).getAttribute('xlink:href')).includes(serviceTargetInformationSVTMetIcon);
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