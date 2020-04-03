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
        //        await browser.wait(this.EC.visibilityOf($(this.selectors.slaProgressBar)));
        return await $(this.selectors.slaProgressBar).isDisplayed();
    }

    async isSLAProgressBarInProcessIconDisplayed(): Promise<boolean> {
        //        await browser.wait(this.EC.elementToBeClickable($(this.selectors.slaProgressBarInProceess)));
        return await $(this.selectors.slaProgressBarInProceess).isDisplayed();
    }

    async clickOnSLAProgressBarInProcessIcon() {
        //        await browser.wait(this.EC.elementToBeClickable($(this.selectors.slaProgressBarInProceess)));
        await $(this.selectors.slaProgressBarInProceess).click();
    }

    async isSLAProgressBarWarningIconDisplayed(): Promise<boolean> {
        await browser.wait(this.EC.elementToBeClickable($(this.selectors.slaProgressBarWarning)),40000);
        return await $(this.selectors.slaProgressBarWarning).isDisplayed();
    }

    async clickOnSLAProgressBarWarningIcon() {
        //        await browser.wait(this.EC.elementToBeClickable($(this.selectors.slaProgressBarWarning)));
        await $(this.selectors.slaProgressBarWarning).click();
    }

    async isSLAProgressBarMissedGoalIconDisplayed(): Promise<boolean> {
        //        await browser.wait(this.EC.elementToBeClickable($(this.selectors.slaProgressBarMissedGoal)),60000);
        return await $(this.selectors.slaProgressBarMissedGoal).isDisplayed();
    }

    async clickOnSLAProgressBarMissedGoalIcon() {
        //        await browser.wait(this.EC.elementToBeClickable($(this.selectors.slaProgressBarMissedGoal)));
        await $(this.selectors.slaProgressBarMissedGoal).click();
    }

    async isSLAProgressBarPausedIconDisplayed(): Promise<boolean> {
        //        await browser.wait(this.EC.elementToBeClickable($(this.selectors.slaProgressBarPaused)));
        return await $(this.selectors.slaProgressBarPaused).isDisplayed();
    }

    async clickOnSLAProgressBarPausedIcon() {
        //        await browser.wait(this.EC.elementToBeClickable($(this.selectors.slaProgressBarPaused)));
        await $(this.selectors.slaProgressBarPaused).click();
    }

    async isSLAProgressBarDualSVTIconDisplayed(): Promise<boolean> {
        //        await browser.wait(this.EC.elementToBeClickable($(this.selectors.slaProgressBarDualSVT)));
        return await $(this.selectors.slaProgressBarDualSVT).isDisplayed();
    }

    async clickOnSLAProgressBarDualSVTIcon() {
        //        await browser.wait(this.EC.elementToBeClickable($(this.selectors.slaProgressBarDualSVT)));
        await $(this.selectors.slaProgressBarDualSVT).click();
    }

    async isDueInTimeDisplayed(): Promise<boolean> {
        //        await browser.wait(this.EC.elementToBeClickable($(this.selectors.slaDueTime)));
        return await $(this.selectors.slaDueTime).isEnabled();
    }

    async getDueInTime(): Promise<string> {
        //        await browser.wait(this.EC.elementToBeClickable($(this.selectors.slaDueTime)));
        return await $(this.selectors.slaDueTime).getText();
    }

    async getServiceTargetToolTipText(): Promise<string> {
        //        await browser.wait(this.EC.elementToBeClickable($(this.selectors.svtToolTipText)));
        await browser.actions().mouseMove($$(this.selectors.slaIcons).first()).perform();
        return await $(this.selectors.svtToolTipText).getText();
    }

    async isMultipleSVTAttached(): Promise<boolean> {
        //        await browser.wait(this.EC.elementToBeClickable($(this.selectors.slaProgressBarInProceess)));
        var svtRecords: number = await $$(this.selectors.slaProgressBarInProceess).count();
        var isMultiple: boolean = false;
        if (svtRecords > 1) {
            isMultiple = true;
        } else {
            isMultiple = false;
        }
        return isMultiple;
    }

    async isSVTToolTipTextDisplayed():Promise<boolean> {
        //        await browser.wait(this.EC.elementToBeClickable($(this.selectors.slaProgressBarInProceess)));
        await browser.actions().mouseMove($$(this.selectors.slaIcons).first()).perform();
        return await $(this.selectors.svtToolTipText).isDisplayed();
    }

    async isSLAProgressBarSVTMetIconDisplayed(): Promise<boolean> {
        await browser.wait(this.EC.elementToBeClickable($(this.selectors.slaProgressBarComplete)),40000);
        return await $(this.selectors.slaProgressBarComplete).isDisplayed();
    }

    async clickOnSLAProgressBarSVTMetIcon() {
        //        await browser.wait(this.EC.elementToBeClickable($(this.selectors.slaProgressBarComplete)));
        await $(this.selectors.slaProgressBarComplete).click();
    }



}

export default new SlmProgressBar();