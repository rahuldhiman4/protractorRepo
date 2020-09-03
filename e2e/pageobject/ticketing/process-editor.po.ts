import { $, $$, browser, element, by, ElementFinder, protractor, ProtractorExpectedConditions } from 'protractor';
import utilGrid from '../../utils/util.grid';

class ProcessEditor {
    EC: ProtractorExpectedConditions = protractor.ExpectedConditions;
    selectors = {
        selectTemplateBtn: '[data-field*="taskTemplateId"] .rx-new-expression-link',
        templateSelectionGridCancelBtn: '[rx-view-component-id="ba0bd5fe-391a-4885-8f0c-56cfead43ebd"] button',
        goBackToTemplateBtn: 'a.rx-editor-header__back',
        gridLink: '.ui-grid__link',
        templateSaveBtn: '[rx-view-component-id="b7f9f666-5c22-463a-bc86-4cb66e26fa35"] button',
        processSaveBtn: 'button.rx-editor-header__button_save',
        pallete: 'a.rx-blade-toggle'
    }

    async dragDropCreateTask(): Promise<void> {
        let source = await $('[data-type="rx.CallActivity.com.bmc.dsm.task-lib.Create Task"] .body.inner');
        let destination = await $$('.marker-target').last();
        await browser.actions().dragAndDrop(source, destination).perform();
        await browser.actions().mouseMove($$('.rx-icon-container').last()).click().perform();
    }

    async clickSelectTemplateBtn(): Promise<void> {
        await browser.wait(this.EC.elementToBeClickable($(this.selectors.selectTemplateBtn)), 6000);
        await $(this.selectors.selectTemplateBtn).click();
    }

    async clickCancelOnTemplateSelectBlade(): Promise<void> {
        await $(this.selectors.templateSelectionGridCancelBtn).click();
    }

    async clickGoBackToTemplateBtn(): Promise<void> {
        await $(this.selectors.goBackToTemplateBtn).click();
    }

    async isTemplatePresent(templateName: string): Promise<boolean> {
        await utilGrid.clearGridSearchBox();
        await utilGrid.searchOnGridConsole(templateName);
        let recordLocator: ElementFinder = await element(by.cssContainingText(this.selectors.gridLink, templateName));
        return await recordLocator.isPresent().then(async (result) => {
            if (result) return await recordLocator.isDisplayed();
            else return false;
        })
    }

    async saveTemplateBtn(): Promise<void> {
        await $(this.selectors.templateSaveBtn).click();
    }

    async addAllTaskTypeFromProcessEditor(temp1: string, temp2: string, temp3: string): Promise<void> {
        //Drag and Drop first Create task
        await browser.sleep(5000);
        let source = await $('[data-type="rx.CallActivity.com.bmc.dsm.task-lib.Create Task"] .body.inner');
        let d1 = await $$('.marker-target').last();
        let d2 = await $('svg[id="v-2"] [joint-selector="layers"]');
        let d3 = await $('svg[id="v-23"] [joint-selector="layers"]');
        await browser.actions().dragAndDrop(source, d1).perform();
        await browser.actions().dragAndDrop(source, d2).perform();
        await browser.actions().dragAndDrop(source, d3).perform();

        //Connect start event with first block
        await $$('.rotatable image[data-icon-type="transparent"]').get(2).click();
        await browser.actions().mouseMove(await $$('.tool-remove path').first()).click().perform();
        await browser.actions().mouseMove(await $$('.rotatable image[data-icon-type="transparent"]').get(2)).click().perform();

        let source1 = $('.handle.link.e');
        let destination1 = await $$('[data-type="rx.CallActivity.com.bmc.dsm.task-lib.Create Task"] .body.inner').get(2);
        await browser.actions().dragAndDrop(source1, destination1).perform();

        //Connect first create block to second create block
        await browser.actions().mouseMove(destination1).click().perform();
        await this.clickSelectTemplateBtn();
        await utilGrid.searchAndSelectGridRecord(temp1);
        await this.saveTemplateBtn();
        await browser.actions().dragAndDrop(source1, await $$('[data-type="rx.CallActivity.com.bmc.dsm.task-lib.Create Task"] .body.inner').get(3)).perform();

        //Connect second create block to third create block
        await browser.actions().mouseMove(await $$('[data-type="rx.CallActivity.com.bmc.dsm.task-lib.Create Task"] .body.inner').get(3)).click().perform();
        await this.clickSelectTemplateBtn();
        await utilGrid.searchAndSelectGridRecord(temp2);
        await this.saveTemplateBtn();
        await browser.actions().dragAndDrop(source1, await $$('[data-type="rx.CallActivity.com.bmc.dsm.task-lib.Create Task"] .body.inner').get(1)).perform();

        //Connect third create block to End Event
        await browser.actions().mouseMove(await $$('[data-type="rx.CallActivity.com.bmc.dsm.task-lib.Create Task"] .body.inner').get(1)).click().perform();
        await this.clickSelectTemplateBtn();
        await utilGrid.searchAndSelectGridRecord(temp3);
        await this.saveTemplateBtn();
        await browser.actions().dragAndDrop(source1, await $$('.rotatable image[data-icon-type="transparent"]').get(3)).perform();
        await $(this.selectors.processSaveBtn).click();
    }

    async isTaskEditorOpened(): Promise<boolean> {
        return await element(by.cssContainingText(this.selectors.pallete, 'Palette')).isPresent().then(async (result) => {
            if (result) return await element(by.cssContainingText(this.selectors.pallete, 'Palette')).isDisplayed();
            else return false;
        })
    }
}

export default new ProcessEditor();