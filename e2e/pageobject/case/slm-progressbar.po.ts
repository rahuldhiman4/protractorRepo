import { ProtractorExpectedConditions, protractor, browser, $ } from "protractor"

class SlmProgressBar {
    EC: ProtractorExpectedConditions = protractor.ExpectedConditions;

    selectors = {
        slaProgressBar: '[rx-view-component-id="55cb7986-e724-40f3-9f92-5744c6c9514d"]  .slm_sla_position',
        slaProgressBarInProceess: '[rx-view-component-id="55cb7986-e724-40f3-9f92-5744c6c9514d"] .d-icon-right-triangle_right_circle_o',
        slaProgressBarWarning: '[rx-view-component-id="55cb7986-e724-40f3-9f92-5744c6c9514d"] .d-icon-right-exclamation_circle',
        slaProgressBarMissedGoal: '[rx-view-component-id="55cb7986-e724-40f3-9f92-5744c6c9514d"] .d-icon-right-cross_circle_o',
        slaProgressBarDualSVT: '[rx-view-component-id="55cb7986-e724-40f3-9f92-5744c6c9514d"] .d-icon-right-circle_o',
        slaProgressBarPaused: '[rx-view-component-id="55cb7986-e724-40f3-9f92-5744c6c9514d"] .d-icon-right-check_circle_o',
        slaDueTime: 'div.d-sla__item',
        svtToolTipText: 'div.tooltip-inner',
    }

    async isSLAProgressBarDisplayed(): Promise<boolean> {
        await browser.wait(this.EC.visibilityOf($(this.selectors.slaProgressBar)));
        return await $(this.selectors.slaProgressBar).isDisplayed();
    }

    async isSLAProgressBarInProessIconDisplayed(): Promise<boolean> {
        await browser.wait(this.EC.elementToBeClickable($(this.selectors.slaProgressBarInProceess)));
        return await $(this.selectors.slaProgressBarInProceess).isDisplayed();
    }

    async clickOnSLAProgressBarInProcessIcon() {
        await browser.wait(this.EC.elementToBeClickable($(this.selectors.slaProgressBarInProceess)));
        await $(this.selectors.slaProgressBarInProceess).click();
    }

    async isSLAProgressBarWarningIconDisplayed(): Promise<boolean> {
        await browser.wait(this.EC.elementToBeClickable($(this.selectors.slaProgressBarWarning)));
        return await $(this.selectors.slaProgressBarWarning).isDisplayed();
    }

    async clickOnSLAProgressBarWarningIcon() {
        await browser.wait(this.EC.elementToBeClickable($(this.selectors.slaProgressBarWarning)));
        await $(this.selectors.slaProgressBarWarning).click();
    }

    async isSLAProgressBarMissedGoalIconDisplayed(): Promise<boolean> {
        await browser.wait(this.EC.elementToBeClickable($(this.selectors.slaProgressBarMissedGoal)));
        return await $(this.selectors.slaProgressBarMissedGoal).isDisplayed();
    }

    async clickOnSLAProgressBarMissedGoalIcon() {
        await browser.wait(this.EC.elementToBeClickable($(this.selectors.slaProgressBarMissedGoal)));
        await $(this.selectors.slaProgressBarMissedGoal).click();
    }

    async isSLAProgressBarPausedIconDisplayed(): Promise<boolean> {
        await browser.wait(this.EC.elementToBeClickable($(this.selectors.slaProgressBarPaused)));
        return await $(this.selectors.slaProgressBarPaused).isDisplayed();
    }

    async clickOnSLAProgressBarPausedIcon() {
        await browser.wait(this.EC.elementToBeClickable($(this.selectors.slaProgressBarPaused)));
        await $(this.selectors.slaProgressBarPaused).click();
    }

    async isSLAProgressBarDualSVTIconDisplayed(): Promise<boolean> {
        await browser.wait(this.EC.elementToBeClickable($(this.selectors.slaProgressBarDualSVT)));
        return await $(this.selectors.slaProgressBarDualSVT).isDisplayed();
    }

    async clickOnSLAProgressBarDualSVTIcon() {
        await browser.wait(this.EC.elementToBeClickable($(this.selectors.slaProgressBarDualSVT)));
        await $(this.selectors.slaProgressBarDualSVT).click();
    }

    async isDueInTimeDisplayed(): Promise<boolean> {
        await browser.wait(this.EC.elementToBeClickable($(this.selectors.slaDueTime)));
        return await $(this.selectors.slaDueTime).isDisplayed();
    }

    async getDueInTime(): Promise<string> {
        await browser.wait(this.EC.elementToBeClickable($(this.selectors.slaDueTime)));
        return await $(this.selectors.slaDueTime).getText();
    }

    async getServiceTargetToolTipText(): Promise<string> {
        await browser.wait(this.EC.elementToBeClickable($(this.selectors.svtToolTipText)));
        return await $(this.selectors.svtToolTipText).getText();
    }
}

export default new SlmProgressBar();