import { ProtractorExpectedConditions, protractor, browser, $ } from "protractor"

class CaseTaskTab {
    EC: ProtractorExpectedConditions = protractor.ExpectedConditions;
    selectors = {
        arrowTask: '[rx-view-component-id="0733a05e-2eea-4fe5-90a8-909238dc6389"] [class="icon-angle_right task-list__task-card__preview-icon"]',
    }

    async clickoncasetaskArrowtab(): Promise<void> {
        await browser.wait(this.EC.elementToBeClickable($(this.selectors.arrowTask)));
        await $(this.selectors.arrowTask).click();
    }
}

export default new CaseTaskTab();