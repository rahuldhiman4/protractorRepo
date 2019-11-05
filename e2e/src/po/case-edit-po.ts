import { ProtractorExpectedConditions, protractor, browser, element, by, $, $$ } from "protractor"

class CaseEditPage {
    EC: ProtractorExpectedConditions = protractor.ExpectedConditions;
    selectors = {
        editLink: '.edit-link',
        changeAssignment: '[rx-view-component-id="459e6f41-abd3-4726-8dc2-25bab758877f"] button',
        assignmentDropDownList: '.rx-assignment_modal_filters .rx-assignment-select',
        selectOptions: '.options-box .options li',
        searchAsignee: '.d-icon-search input',
        assignee: '.rx-assignment-person-fullName',
        assignButton: '.rx-assignment-modal-footer button.d-button_primary',
        saveCaseButton: '[rx-view-component-id="518308c0-34ea-4e75-a3a8-b4b07fc91de9"] button',
    }

    async clickEditCaseButton(): Promise<void> {
        await browser.wait(this.EC.visibilityOf($(this.selectors.editLink)));
        await $(this.selectors.editLink).click();
    }

    async clickChangeAssignmentButton(): Promise<void> {
        await $(this.selectors.changeAssignment).click();
    }

    async selectSupportGroup(supportGroup:string): Promise<void> {
        const lastDropDown = $$(this.selectors.assignmentDropDownList).last();
        await browser.wait(this.EC.elementToBeClickable(lastDropDown.$('button')));
        await lastDropDown.$('button').click();
        await browser.wait(this.EC.visibilityOf(lastDropDown.$('input')));
        await lastDropDown.$('input').sendKeys(supportGroup);
        await browser.wait(this.EC.or(async ()=>{
            let count = await lastDropDown.$$(this.selectors.selectOptions).count();
            return count == 1;
        }))
        expect(lastDropDown.$$(this.selectors.selectOptions).first().getText()).toBe(supportGroup);
        await lastDropDown.$$(this.selectors.selectOptions).first().click();
    }

    async selectAssignee(name:string): Promise<void> {
        await browser.wait(this.EC.visibilityOf($(this.selectors.searchAsignee)));
        await $(this.selectors.searchAsignee).sendKeys(name);
        browser.actions().sendKeys(protractor.Key.ENTER).perform();
        await browser.wait(this.EC.or(async ()=>{
            let count = await $$(this.selectors.assignee).count();
            return count >= 2;
        }))
        await element(by.cssContainingText(this.selectors.assignee, name)).click();
    }

    async clickAssignButton(): Promise<void> {
        await browser.wait(this.EC.elementToBeClickable($(this.selectors.assignButton)));
        await $(this.selectors.assignButton).click();
    }

    async clickSaveCase(): Promise<void> {
        await browser.wait(this.EC.elementToBeClickable($(this.selectors.saveCaseButton)));
        await $(this.selectors.saveCaseButton).click();
    }

    async verifyCaseAssignee(name:string): Promise<void> {
        expect(await browser.wait(this.EC.visibilityOf($(`a[title="${name}"]`))));
    }
}

export default new CaseEditPage();