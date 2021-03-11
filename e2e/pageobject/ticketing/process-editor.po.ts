import { $, $$, browser, by, element, ElementFinder, protractor, ProtractorExpectedConditions } from 'protractor';
import utilityGrid from '../../utils/utility.grid';

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
        await browser.waitForAngularEnabled(false);
        await browser.switchTo().frame($('rx-process-designer-frame iframe').getWebElement());
        await browser.sleep(1000); // sleep required for proper frame switch
        let source = await $('[data-type="rx.CallActivity.com.bmc.dsm.task-lib.Create Task"] .body.inner');
        let destination = await $$('.marker-target').last();
        await browser.actions().dragAndDrop(source, destination).perform();
        await browser.actions().mouseMove($$('.rx-icon-container').last()).click().perform();
        await browser.switchTo().defaultContent();
        await browser.waitForAngularEnabled(true);
    }

    async clickSelectTemplateBtn(): Promise<void> {
        await browser.waitForAngularEnabled(false);
        await browser.switchTo().frame($('rx-process-designer-frame iframe').getWebElement());
        await browser.sleep(1000); // sleep required for proper frame switch
        await browser.wait(this.EC.elementToBeClickable($(this.selectors.selectTemplateBtn)), 6000);
        await $(this.selectors.selectTemplateBtn).click();
        await browser.switchTo().defaultContent();
        await browser.waitForAngularEnabled(true);
    }

    async clickCancelOnTemplateSelectBlade(): Promise<void> {
        await browser.waitForAngularEnabled(false);
        await browser.switchTo().frame($('rx-process-designer-frame iframe').getWebElement());
        await browser.sleep(1000); // sleep required for proper frame switch
        await $(this.selectors.templateSelectionGridCancelBtn).click();
        await browser.switchTo().defaultContent();
        await browser.waitForAngularEnabled(true);
    }

    async clickGoBackToTemplateBtn(): Promise<void> {
        await browser.waitForAngularEnabled(false);
        await browser.switchTo().frame($('rx-process-designer-frame iframe').getWebElement());
        await browser.sleep(1000); // sleep required for proper frame switch
        await $(this.selectors.goBackToTemplateBtn).click();
        await browser.switchTo().defaultContent();
        await browser.waitForAngularEnabled(true);
    }

    async isTemplatePresent(templateName: string): Promise<boolean> {
        await browser.waitForAngularEnabled(false);
        await browser.switchTo().frame($('rx-process-designer-frame iframe').getWebElement());
        await browser.sleep(1000); // sleep required for proper frame switch
        await utilityGrid.clearSearchBox();
        await utilityGrid.searchRecord(templateName);
        let recordLocator: ElementFinder = await element(by.cssContainingText(this.selectors.gridLink, templateName));
        let isTemplate = await recordLocator.isPresent().then(async (result) => {
            if (result) return await recordLocator.isDisplayed();
            else return false;
        });
        await browser.switchTo().defaultContent();
        await browser.waitForAngularEnabled(true);
        return isTemplate;
    }

    async saveTemplateBtn(): Promise<void> {
        await browser.waitForAngularEnabled(false);
        await browser.switchTo().frame($('rx-process-designer-frame iframe').getWebElement());
        await browser.sleep(1000); // sleep required for proper frame switch
        await $(this.selectors.templateSaveBtn).click();
        await browser.switchTo().defaultContent();
        await browser.waitForAngularEnabled(true);
    }

    async addAllTaskTypeFromProcessEditor(temp1: string, temp2: string, temp3: string): Promise<void> {
        await browser.waitForAngularEnabled(false);
        await browser.switchTo().frame($('rx-process-designer-frame iframe').getWebElement());
        await browser.sleep(1000); // sleep required for proper frame switch

        //Drag and Drop first Create task
        await browser.sleep(5000); // Required For Drag And Drop Operation
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
        await utilityGrid.searchAndSelectGridRecord(temp1);
        await this.saveTemplateBtn();
        await browser.actions().dragAndDrop(source1, await $$('[data-type="rx.CallActivity.com.bmc.dsm.task-lib.Create Task"] .body.inner').get(3)).perform();

        //Connect second create block to third create block
        await browser.actions().mouseMove(await $$('[data-type="rx.CallActivity.com.bmc.dsm.task-lib.Create Task"] .body.inner').get(3)).click().perform();
        await this.clickSelectTemplateBtn();
        await utilityGrid.searchAndSelectGridRecord(temp2);
        await this.saveTemplateBtn();
        await browser.actions().dragAndDrop(source1, await $$('[data-type="rx.CallActivity.com.bmc.dsm.task-lib.Create Task"] .body.inner').get(1)).perform();

        //Connect third create block to End Event
        await browser.actions().mouseMove(await $$('[data-type="rx.CallActivity.com.bmc.dsm.task-lib.Create Task"] .body.inner').get(1)).click().perform();
        await this.clickSelectTemplateBtn();
        await utilityGrid.searchAndSelectGridRecord(temp3);
        await this.saveTemplateBtn();
        await browser.actions().dragAndDrop(source1, await $$('.rotatable image[data-icon-type="transparent"]').get(3)).perform();
        await $(this.selectors.processSaveBtn).click();
        await browser.switchTo().defaultContent();
        await browser.waitForAngularEnabled(true);
    }

    async isTaskEditorOpened(): Promise<boolean> {
        await browser.waitForAngularEnabled(false);
        await browser.switchTo().frame($('rx-process-designer-frame iframe').getWebElement());
        await browser.sleep(1000); // sleep required for proper frame switch
        let isTaskEditorOpen = await element(by.cssContainingText(this.selectors.pallete, 'Palette')).isPresent().then(async (result) => {
            if (result) return await element(by.cssContainingText(this.selectors.pallete, 'Palette')).isDisplayed();
            else return false;
        });
        await browser.switchTo().defaultContent();
        await browser.waitForAngularEnabled(true);
        return isTaskEditorOpen;
    }

    async searchAndOpenTaskTemplate(searchValue: string, guid?: string) {
        await browser.waitForAngularEnabled(false);
        await browser.switchTo().frame($('rx-process-designer-frame iframe').getWebElement());
        await browser.sleep(1000); // sleep required for proper frame switch
        let searchBoxInput: string = '[rx-id="search-text-input"]';
        let gridRefreshButton: string = 'button.d-icon-refresh';
        let gridSearchIcon: string = '[rx-id="submit-search-button"]';
        if (guid) {
            searchBoxInput = `[rx-view-component-id="${guid}"] ` + searchBoxInput;
            gridRefreshButton = `[rx-view-component-id="${guid}"] ` + gridRefreshButton;
            gridSearchIcon = `[rx-view-component-id="${guid}"] ` + gridSearchIcon;
        }
        for (let i: number = 0; i < 7; i++) {
            console.log(searchValue, "search angularJs grid count: ", i);
            await $(searchBoxInput).clear();
            await $(gridRefreshButton).click();
            await $(searchBoxInput).sendKeys(searchValue);
            await $(gridSearchIcon).click();
            let gridRecordCount: number = await await $$('.ui-grid-render-container-body .ui-grid-row').count();
            if (gridRecordCount == 0) {
                await browser.sleep(5000); // workaround for performance issue, this can be removed when issue fixed
            } else break;
        }
        await element(by.cssContainingText('.ui-grid__link', searchValue)).click();
        await browser.switchTo().defaultContent();
        await browser.waitForAngularEnabled(true);
    }
}

export default new ProcessEditor();