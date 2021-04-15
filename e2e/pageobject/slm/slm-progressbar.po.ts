import { $, $$, browser, protractor, ProtractorExpectedConditions } from "protractor";

class SlmProgressBar {
    EC: ProtractorExpectedConditions = protractor.ExpectedConditions;

    selectors = {
        slaProgressBar: '.progress-container__bar .progress-sla',
        slaProgressBarInProceess: 'div.progress-sla div.sla-icon-triangle_right',
        slaProgressBarWarning: 'div.progress-sla div.sla-icon-exclamation',
        slaProgressBarMissedGoal: 'div.progress-sla .sla-icon-cross',
        slaProgressBarDualSVT: 'div.progress-sla div.sla-icon-circle_o',
        slaProgressBarPaused: 'div.progress-sla div.sla-icon-pause',
        slaProgressBarComplete: 'div.progress-sla div.sla-icon-check',
        slaDueTime: '.progress-due-time span',
        slaIcons: 'div.progress-sla div.sla-icon',
        svtToolTipText: '.adapt-tooltip-inner',
    }

    async isSLAProgressBarDisplayed(): Promise<boolean> {
        return await $(this.selectors.slaProgressBar).isPresent();
    }

    async isSLAProgressBarInProcessIconDisplayed(): Promise<boolean> {
        return await $(this.selectors.slaProgressBarInProceess).isPresent();
    }

    async clickOnSLAProgressBarInProcessIcon() {
        await $(this.selectors.slaProgressBarInProceess).click();
    }

    async isSLAProgressBarWarningIconDisplayed(): Promise<boolean> {
        return await $(this.selectors.slaProgressBarWarning).isPresent();
    }

    async clickOnSLAProgressBarWarningIcon() {
        await $(this.selectors.slaProgressBarWarning).click();
    }

    async isSLAProgressBarMissedGoalIconDisplayed(): Promise<boolean> {
        return await $(this.selectors.slaProgressBarMissedGoal).isDisplayed();
    }

    async clickOnSLAProgressBarMissedGoalIcon() {
        await $(this.selectors.slaProgressBarMissedGoal).click();
    }

    async isSLAProgressBarPausedIconDisplayed(): Promise<boolean> {
        return await $(this.selectors.slaProgressBarPaused).isDisplayed();
    }

    async clickOnSLAProgressBarPausedIcon() {
        await $(this.selectors.slaProgressBarPaused).click();
    }

    async isSLAProgressBarDualSVTIconDisplayed(): Promise<boolean> {
        return await $(this.selectors.slaProgressBarDualSVT).isDisplayed();
    }

    async clickOnSLAProgressBarDualSVTIcon() {
        await $(this.selectors.slaProgressBarDualSVT).click();
    }

    async isDueInTimeDisplayed(): Promise<boolean> {
        return await $(this.selectors.slaDueTime).isEnabled();
    }

    async getDueInTime(): Promise<string> {
        return await $(this.selectors.slaDueTime).getText();
    }

    async getServiceTargetToolTipText(): Promise<string> {
        await browser.actions().mouseMove($$(this.selectors.slaIcons).first()).perform();
        return await $(this.selectors.svtToolTipText).getText();
    }

    async isMultipleSVTAttached(): Promise<boolean> {
        let svtRecords: number = await $$(this.selectors.slaProgressBarInProceess).count();
        let isMultiple: boolean = false;
        if (svtRecords > 1) {
            isMultiple = true;
        } else {
            isMultiple = false;
        }
        return isMultiple;
    }

    async isSVTToolTipTextDisplayed():Promise<boolean> {
        await browser.actions().mouseMove($$(this.selectors.slaIcons).first()).perform();
        return await $(this.selectors.svtToolTipText).isDisplayed();
    }

    async isSLAProgressBarSVTMetIconDisplayed(): Promise<boolean> {
        return await $(this.selectors.slaProgressBarComplete).isPresent();
    }

    async clickOnSLAProgressBarSVTMetIcon() {
        await $(this.selectors.slaProgressBarComplete).click();
    }

}

export default new SlmProgressBar();