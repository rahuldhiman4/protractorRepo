import { $, $$, by, element, browser, protractor, ProtractorExpectedConditions } from "protractor";
import utilCommon from '../../utils/util.common';

class EditKnowledgeAccess {
    EC: ProtractorExpectedConditions = protractor.ExpectedConditions;
    selectors = {
        knowledgeAccessSupportGroup: '[rx-view-component-id="a99704e0-5441-4ddc-8357-bd4fc7d078d4"] span.rx-case-access-name',
        knowledeAccessSupportGroupCrossIcon: '[rx-view-component-id="a99704e0-5441-4ddc-8357-bd4fc7d078d4"] span.rx-case-access-name ~ span.d-icon-cross',
        removeKnowledgeAccessOptionYes: 'button.ac-remove-group-yes',
        removeKnowledgeAccessOptionNo: 'button.ac-remove-group-no',
        closeKnowledgeAccessBlade: '[rx-view-component-id="0d8d9c7d-7e85-4277-9452-64fbba8df10d"] button',
    }

    async clickKnowledgeAccessYesOption(): Promise<void> {
        await browser.wait(this.EC.elementToBeClickable($(this.selectors.removeKnowledgeAccessOptionYes)), 2000);
        await $(this.selectors.removeKnowledgeAccessOptionYes).click();
    }

    async clickKnowledgeAccessNoOption(): Promise<void> {
        await browser.wait(this.EC.elementToBeClickable($(this.selectors.removeKnowledgeAccessOptionNo)), 2000);
        await $(this.selectors.removeKnowledgeAccessOptionNo).click();
    }

    async clickRemoveKnowledgeAccess(knowledgeAccessGroup: string): Promise<void> {
        await browser.wait(this.EC.elementToBeClickable($(this.selectors.knowledgeAccessSupportGroup)), 2000);
        await $(this.selectors.knowledgeAccessSupportGroup).click();
        let options = await $$(this.selectors.knowledgeAccessSupportGroup).count();
        for (let i = 0; i < options; i++) {
            let knowledgeAccess = await $$(this.selectors.knowledgeAccessSupportGroup).get(i).getText();
            if (knowledgeAccess.includes(knowledgeAccessGroup)) {
                await $$(this.selectors.knowledeAccessSupportGroupCrossIcon).get(i).click();
            }
        }
    }
   
    async clickCloseKnowledgeAccessBlade():Promise<void>{
        await browser.wait(this.EC.elementToBeClickable($(this.selectors.closeKnowledgeAccessBlade)), 3000);
        await $(this.selectors.closeKnowledgeAccessBlade).click();
    }

}

export default new EditKnowledgeAccess();