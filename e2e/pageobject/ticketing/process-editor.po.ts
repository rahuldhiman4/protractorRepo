import { $, $$, browser, by, element, ElementFinder, protractor, ProtractorExpectedConditions } from 'protractor';
import utilityGrid from '../../utils/utility.grid';

class ProcessEditor {
    EC: ProtractorExpectedConditions = protractor.ExpectedConditions;
    selectors = {
        selectTemplateBtn: '[data-field*="taskTemplateId"] .rx-new-expression-link',
        templateSelectionGridCancelBtn: '[rx-view-component-id="ba0bd5fe-391a-4885-8f0c-56cfead43ebd"] button',
        goBackToTemplateBtn: 'a.rx-editor-header__back',
        gridLink: 'div.ui-grid-row',
        gridRowLocator: '.at-data-cell div',
        searchTextBox: '.adapt-search-triggerable input',
        templateSaveBtn: '[rx-view-component-id="b7f9f666-5c22-463a-bc86-4cb66e26fa35"] button',
        processSaveBtn: 'button.rx-editor-header__button_save',
        pallete: 'a.rx-blade-toggle',
        taskTemplateName: '[rx-view-component-id="227ba62e-b3ee-4f84-958c-7d2c7f2d2be3"]  div.text-container span',
        taskSummaryValue: '[rx-view-component-id="a790b9d4-46d5-408c-8f86-4e04a683bc3d"] .read-only-content',
        taskCompanyValue: '[rx-view-component-id="44e56c5d-b8d5-4f23-b4b6-da4d8baa43e9"] .read-only-content',
        taskTypeValue: '[rx-view-component-id="d7598602-1dce-4cf8-af9b-b0083df0e721"] label ~ *',
        taskPriorityValue: '[rx-view-component-id="f4a0b2ba-433c-471f-89b1-e94d0c0f3b43"] .read-only-content',
        fieldParentLocator: '[rx-configuration="configuration"] .d-textfield',
        assigneeFieldValue: '.person-main a',
        backButton: '[rx-view-component-id="cbb794a3-d696-4fff-81df-27e73e1438d8"] button',
        supportGroupGuid: '1f5a6ff8-d488-4f3d-9de3-5da1512b9438',
        getTaskCategoryTier1: '[rx-view-component-id="b3c01a87-de23-409d-bbd8-2893ae57594f"] .read-only-content',
        getTaskCategoryTier2: '[rx-view-component-id="3555d678-bd9f-486a-9f87-d1847478eac1"] .read-only-content',
        getTaskCategoryTier3: '[rx-view-component-id="b4e25583-320c-4e46-84db-9adf9cf8701a"] .read-only-content',
        getTaskCategoryTier4: '[rx-view-component-id="fee46083-3316-45b8-8600-190e851bee3b"] .read-only-content',
        warningOk: '.modal-footer button[class*="d-button d-button_primary"], .d-modal__footer button[class*="d-button d-button_primary"]'
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
        await browser.switchTo().frame(await $('rx-process-designer-frame iframe').getWebElement());
        await browser.switchTo().frame(0);
        await browser.sleep(1000); // sleep required for proper frame switch
        await $(this.selectors.templateSelectionGridCancelBtn).click();
        await browser.switchTo().defaultContent();
        await browser.waitForAngularEnabled(true);
    }

    async clickGoBackToTemplateBtn(): Promise<void> {
        await browser.waitForAngularEnabled(false);
        await browser.switchTo().frame(await $('rx-process-designer-frame iframe').getWebElement());
        await browser.sleep(1000); // sleep required for proper frame switch
        await $(this.selectors.goBackToTemplateBtn).click();
        await browser.switchTo().defaultContent();
        await browser.waitForAngularEnabled(true);
    }

    async isTemplatePresent(templateName: string, guid?: string): Promise<boolean> {
        await browser.waitForAngularEnabled(false);
        await browser.switchTo().frame(await $('rx-process-designer-frame iframe').getWebElement());
        await browser.switchTo().frame(0);
        await browser.sleep(1000); // sleep required for proper frame switch
        let searchBoxInput: string = 'input[type="search"]';
        let gridRefreshButton: string = 'button.d-icon-refresh';
        let gridSearchIcon: string = 'button.adapt-search-button';
        let gridRowLocator: string = '.at-data-cell div';
        if (guid) {
            searchBoxInput = `[rx-view-component-id="${guid}"] ` + searchBoxInput;
            gridRefreshButton = `[rx-view-component-id="${guid}"] ` + gridRefreshButton;
            gridSearchIcon = `[rx-view-component-id="${guid}"] ` + gridSearchIcon;
            gridRowLocator = `[rx-view-component-id="${guid}"] ` + gridRowLocator;
        }
        for (let i: number = 0; i < 3; i++) {
            console.log(templateName, "search angularJs grid count: ", i);
            await $(searchBoxInput).clear();
            await $(gridRefreshButton).click();
            await $(searchBoxInput).sendKeys(templateName);
            await browser.sleep(2000);
            await $(gridSearchIcon).click();
            await browser.sleep(2000);
            let gridRecordCount: number = await $$('[rx-view-component-id="da1ffbb0-567a-4199-b94f-413bee7f149b"] table .at-data-row').count();
            if (gridRecordCount == 0) {
                await browser.sleep(3000); // workaround for performance issue, this can be removed when issue fixed
            } else break;
        }
        let recordLocator = await element(by.cssContainingText(this.selectors.gridRowLocator, templateName));
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

    async addAllTaskTypeFromProcessEditor(temp1: string, temp2: string, temp3: string, guid?: string): Promise<void> {
        await browser.waitForAngularEnabled(false);
        await browser.switchTo().frame($('rx-process-designer-frame iframe').getWebElement());
        await browser.sleep(1000); // sleep required for proper frame switch
        let searchBoxInput: string = 'input[type="search"]';
        let gridRefreshButton: string = 'button.d-icon-refresh';
        let gridSearchIcon: string = 'button.adapt-search-button';
        let selectCheckbox = '.ui-chkbox-box';
        let selectRadioButton = '.radio__label input';
        if (guid) {
            searchBoxInput = `[rx-view-component-id="${guid}"] ` + searchBoxInput;
            gridRefreshButton = `[rx-view-component-id="${guid}"] ` + gridRefreshButton;
            gridSearchIcon = `[rx-view-component-id="${guid}"] ` + gridSearchIcon;
            selectCheckbox = `[rx-view-component-id="${guid}"] ` + selectCheckbox;
            selectRadioButton = `[rx-view-component-id="${guid}"] ` + selectRadioButton;
        }
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
        //await this.clickSelectTemplateBtn();
        await browser.wait(this.EC.elementToBeClickable($(this.selectors.selectTemplateBtn)), 6000);
        await $(this.selectors.selectTemplateBtn).click();

        //await utilityGrid.searchAndSelectGridRecord(temp1);
        await browser.switchTo().frame(0);
        for (let i: number = 0; i < 7; i++) {
            console.log(temp1, "search angularJs grid count: ", i);
            await $(searchBoxInput).clear();
            await $(gridRefreshButton).click();
            await $(searchBoxInput).sendKeys(temp1);
            await browser.sleep(3000);
            await $(gridSearchIcon).click();
            let gridRecordCount: number = await $$('[rx-view-component-id="da1ffbb0-567a-4199-b94f-413bee7f149b"] table .at-data-row').count();
            if (gridRecordCount == 0) {
                await browser.sleep(5000); // workaround for performance issue, this can be removed when issue fixed
            } else break;
        }
        let checkboxLocator = await $(selectCheckbox);
        let radioButtonLocator = await $(selectRadioButton);
        if (await checkboxLocator.isPresent()) await checkboxLocator.click();
        else await radioButtonLocator.click();

        //await this.saveTemplateBtn();
        await $(this.selectors.templateSaveBtn).click();
        await browser.switchTo().defaultContent();
        await browser.waitForAngularEnabled(true); await browser.waitForAngularEnabled(false);
        await browser.switchTo().frame($('rx-process-designer-frame iframe').getWebElement());
        await browser.sleep(1000); // sleep required for proper frame switch
        await browser.actions().dragAndDrop(source1, await $$('[data-type="rx.CallActivity.com.bmc.dsm.task-lib.Create Task"] .body.inner').get(3)).perform();

        //Connect second create block to third create block
        await browser.actions().mouseMove(await $$('[data-type="rx.CallActivity.com.bmc.dsm.task-lib.Create Task"] .body.inner').get(3)).click().perform();
        await this.clickSelectTemplateBtn();
        await browser.sleep(3000);
        //await utilityGrid.searchAndSelectGridRecord(temp2);
        await browser.switchTo().frame(0);
        for (let i: number = 0; i < 7; i++) {
            console.log(temp1, "search angularJs grid count: ", i);
            await $(searchBoxInput).clear();
            await $(gridRefreshButton).click();
            await $(searchBoxInput).sendKeys(temp1 + protractor.Key.ENTER);
            //await $(gridSearchIcon).click();
            let gridRecordCount: number = await $$('[rx-view-component-id="da1ffbb0-567a-4199-b94f-413bee7f149b"] table .at-data-row').count();
            if (gridRecordCount == 0) {
                await browser.sleep(5000); // workaround for performance issue, this can be removed when issue fixed
            } else break;
        }
        if (await checkboxLocator.isPresent()) await checkboxLocator.click();
        else await radioButtonLocator.click();

        //await this.saveTemplateBtn();
        await $(this.selectors.templateSaveBtn).click();
        await browser.switchTo().defaultContent();
        await browser.waitForAngularEnabled(true); await browser.waitForAngularEnabled(false);
        await browser.switchTo().frame($('rx-process-designer-frame iframe').getWebElement());
        await browser.sleep(1000); // sleep required for proper frame switch
        await browser.actions().dragAndDrop(source1, await $$('[data-type="rx.CallActivity.com.bmc.dsm.task-lib.Create Task"] .body.inner').get(1)).perform();

        //Connect third create block to End Event
        await browser.actions().mouseMove(await $$('[data-type="rx.CallActivity.com.bmc.dsm.task-lib.Create Task"] .body.inner').get(1)).click().perform();
        await this.clickSelectTemplateBtn();
        await browser.sleep(3000);
        // await utilityGrid.searchAndSelectGridRecord(temp3);
        // await this.saveTemplateBtn();
        await browser.switchTo().frame(0);
        for (let i: number = 0; i < 7; i++) {
            console.log(temp1, "search angularJs grid count: ", i);
            await $(searchBoxInput).clear();
            await $(gridRefreshButton).click();
            await $(searchBoxInput).sendKeys(temp1, + protractor.Key.ENTER);
            // await $(gridSearchIcon).click();
            let gridRecordCount: number = await $$('[rx-view-component-id="da1ffbb0-567a-4199-b94f-413bee7f149b"] table .at-data-row').count();
            if (gridRecordCount == 0) {
                await browser.sleep(5000); // workaround for performance issue, this can be removed when issue fixed
            } else break;
        }
        if (await checkboxLocator.isPresent()) await checkboxLocator.click();
        else await radioButtonLocator.click();

        await $(this.selectors.templateSaveBtn).click();
        await browser.switchTo().defaultContent();
        await browser.waitForAngularEnabled(true); await browser.waitForAngularEnabled(false);
        await browser.switchTo().frame($('rx-process-designer-frame iframe').getWebElement());
        await browser.sleep(1000); // sleep required for proper frame switch
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
        await browser.switchTo().frame(await $('rx-process-designer-frame iframe').getWebElement());
        await browser.switchTo().frame(0);
        await browser.sleep(1000); // sleep required for proper frame switch
        let searchBoxInput: string = 'input[type="search"]';
        let gridRefreshButton: string = 'button.d-icon-refresh';
        let gridSearchIcon: string = 'button.adapt-search-button';
        if (guid) {
            searchBoxInput = `[rx-view-component-id="${guid}"] ` + searchBoxInput;
            gridRefreshButton = `[rx-view-component-id="${guid}"] ` + gridRefreshButton;
            gridSearchIcon = `[rx-view-component-id="${guid}"] ` + gridSearchIcon;
        }
        for (let i: number = 0; i < 7; i++) {
            console.log(searchValue, "search angularJs grid count: ", i);
            await $(searchBoxInput).clear();
            await $(gridRefreshButton).click();
            await browser.sleep(5000); // for Template console grid to load
            await $(searchBoxInput).sendKeys(searchValue);
            await browser.sleep(3000);
            await $(gridSearchIcon).click();
            let gridRecordCount: number = await $$('[rx-view-component-id="da1ffbb0-567a-4199-b94f-413bee7f149b"] table .at-data-row').count();
            if (gridRecordCount == 0) {
                await browser.sleep(5000); // workaround for performance issue, this can be removed when issue fixed
            } else break;
        }
        await element(by.linkText(searchValue)).click();
        await browser.switchTo().defaultContent();
        await browser.waitForAngularEnabled(true);
    }

    async isFieldLabelDisplayed(guid: string, fieldName: string): Promise<boolean> {
        await browser.waitForAngularEnabled(false);
        await browser.switchTo().frame(await $('rx-process-designer-frame iframe').getWebElement());
        await browser.switchTo().frame(0);
        await browser.sleep(1000); // sleep required for proper frame switch
        let fieldLabel = `[rx-view-component-id='${guid}'] rx-read-only-field label, [rx-view-component-id='${guid}'] label.d-textfield__label span,[rx-view-component-id='${guid}'] bwf-read-only-field label, [rx-view-component-id='${guid}'] .form-control-label span`;
        let isFieldLabel = await element(by.cssContainingText(fieldLabel, fieldName)).isPresent().then(async (result) => {
            if (result) {
                return await element(by.cssContainingText(fieldLabel, fieldName)).getText() == fieldName ? true : false;
            } else {
                let fieldLabel2 = `.clearfix label, [rx-view-component-id='${guid}'] label, .saved-advanced-filters-header, .form-control-label, [rx-view-component-id='${guid}'] span span, [rx-view-component-id='${guid}'] label span`;
                return await element(by.cssContainingText(fieldLabel2, fieldName)).getText() == fieldName ? true : false;
            }
        });
        await browser.switchTo().defaultContent();
        await browser.waitForAngularEnabled(true);
        return isFieldLabel;
    }
    async getTaskTemplateName(): Promise<string> {
        await browser.waitForAngularEnabled(false);
        await browser.switchTo().frame(await $('rx-process-designer-frame iframe').getWebElement());
        await browser.switchTo().frame(0);
        await browser.sleep(1000); // sleep required for proper frame switch
        let taskTemplateNameValue = await $(this.selectors.taskTemplateName).getText();
        await browser.switchTo().defaultContent();
        await browser.waitForAngularEnabled(true);
        return taskTemplateNameValue;
    }
    
    async getTaskSummary(): Promise<string> {
        await browser.waitForAngularEnabled(false);
        await browser.switchTo().frame(await $('rx-process-designer-frame iframe').getWebElement());
        await browser.switchTo().frame(0);
        await browser.sleep(1000); // sleep required for proper frame switch
        let taskSummaryvalue = await $(this.selectors.taskSummaryValue).getText();
        await browser.switchTo().defaultContent();
        await browser.waitForAngularEnabled(true);
        return taskSummaryvalue;
    }

    async getTaskCompany(): Promise<string> {
        await browser.waitForAngularEnabled(false);
        await browser.switchTo().frame(await $('rx-process-designer-frame iframe').getWebElement());
        await browser.switchTo().frame(0);
        await browser.sleep(1000); // sleep required for proper frame switch
        let taskCompanyvalue = await $(this.selectors.taskCompanyValue).isPresent().then(async (present) => {
            if (present) {
                return await $(this.selectors.taskCompanyValue).getText();
            }else{ 
                return "no company";
            }
        });
        await browser.switchTo().defaultContent();
        await browser.waitForAngularEnabled(true);
        return taskCompanyvalue;
    }
    async getTaskType(): Promise<string> {
        await browser.waitForAngularEnabled(false);
        await browser.switchTo().frame(await $('rx-process-designer-frame iframe').getWebElement());
        await browser.switchTo().frame(0);
        await browser.sleep(1000); // sleep required for proper frame switch
        let taskTypevalue = await $(this.selectors.taskTypeValue).getText();
        await browser.switchTo().defaultContent();
        await browser.waitForAngularEnabled(true);
        return taskTypevalue;
    }

    async getTaskPriority(): Promise<string> {
        await browser.waitForAngularEnabled(false);
        await browser.switchTo().frame(await $('rx-process-designer-frame iframe').getWebElement());
        await browser.switchTo().frame(0);
        await browser.sleep(1000); // sleep required for proper frame switch
        let taskPriorityvalue = await $(this.selectors.taskPriorityValue).getText();
        await browser.switchTo().defaultContent();
        await browser.waitForAngularEnabled(true);
        return taskPriorityvalue;
    }
    async getAssigneeFieldValue(): Promise<string> {
        await browser.waitForAngularEnabled(false);
        await browser.switchTo().frame(await $('rx-process-designer-frame iframe').getWebElement());
        await browser.switchTo().frame(0);
        await browser.sleep(1000); // sleep required for proper frame switch
        let assigneeValue =  (await $$(this.selectors.assigneeFieldValue).first().getText()).trim();
        await browser.switchTo().defaultContent();
        await browser.waitForAngularEnabled(true);
        return assigneeValue;
    }
    async clickOnBackButton(): Promise<void> {
        await browser.waitForAngularEnabled(false);
        await browser.switchTo().frame(await $('rx-process-designer-frame iframe').getWebElement());
        await browser.switchTo().frame(0);
        await browser.sleep(1000); // sleep required for proper frame switch
        await $(this.selectors.backButton).click();
        await browser.switchTo().defaultContent();
        await browser.waitForAngularEnabled(true);
    }
    async clickOnWarningOk(): Promise<void> {
        await browser.waitForAngularEnabled(false);
        await browser.switchTo().frame(await $('rx-process-designer-frame iframe').getWebElement());
        await browser.sleep(1000); // sleep required for proper frame switch
        await $(this.selectors.warningOk).isPresent().then(async (result) => {
            if (result) {
                await $(this.selectors.warningOk).click();
                await browser.switchTo().defaultContent();
                await browser.waitForAngularEnabled(true);
            }
        });
    }
    async getTaskCategoryTier1(): Promise<string> {
        await browser.waitForAngularEnabled(false);
        await browser.switchTo().frame(await $('rx-process-designer-frame iframe').getWebElement());
        await browser.switchTo().frame(0);
        await browser.sleep(1000); // sleep required for proper frame switch
        let taskCat1= await $(this.selectors.getTaskCategoryTier1).getText();
        await browser.switchTo().defaultContent();
        await browser.waitForAngularEnabled(true);
        return taskCat1;
    }
    async getTaskCategoryTier2(): Promise<string> {
        await browser.waitForAngularEnabled(false);
        await browser.switchTo().frame(await $('rx-process-designer-frame iframe').getWebElement());
        await browser.switchTo().frame(0);
        await browser.sleep(1000); // sleep required for proper frame switch
        let taskCat2 =  await $(this.selectors.getTaskCategoryTier2).getText();
        await browser.switchTo().defaultContent();
        await browser.waitForAngularEnabled(true);
        return taskCat2;
    }
    async getTaskCategoryTier3(): Promise<string> {
        await browser.waitForAngularEnabled(false);
        await browser.switchTo().frame(await $('rx-process-designer-frame iframe').getWebElement());
        await browser.switchTo().frame(0);
        await browser.sleep(1000); // sleep required for proper frame switch
        let taskCat3 = await $(this.selectors.getTaskCategoryTier3).getText();
        await browser.switchTo().defaultContent();
        await browser.waitForAngularEnabled(true);
        return taskCat3;
    }
    async getTaskCategoryTier4(): Promise<string> {
        await browser.waitForAngularEnabled(false);
        await browser.switchTo().frame(await $('rx-process-designer-frame iframe').getWebElement());
        await browser.switchTo().frame(0);
        await browser.sleep(1000); // sleep required for proper frame switch
        let taskCat4 = await $(this.selectors.getTaskCategoryTier4).getText();
        await browser.switchTo().defaultContent();
        await browser.waitForAngularEnabled(true);
        return taskCat4;
    }
    async getSupportGroup(): Promise<string> {
        await browser.waitForAngularEnabled(false);
        await browser.switchTo().frame(await $('rx-process-designer-frame iframe').getWebElement());
        await browser.switchTo().frame(0);
        await browser.sleep(1000); // sleep required for proper frame switch
        let supportGroupVal = await $(`[rx-view-component-id="${this.selectors.supportGroupGuid}"] .read-only-content`).getText();
        await browser.switchTo().defaultContent();
        await browser.waitForAngularEnabled(true);
        return supportGroupVal;
    }

}

export default new ProcessEditor();