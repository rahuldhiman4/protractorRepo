import { $, browser, protractor, ProtractorExpectedConditions } from "protractor";
import utilGrid from '../../utils/util.grid';
import utilCommon from 'e2e/utils/util.common';

class SelectEmailTemplateBlad {
    EC: ProtractorExpectedConditions = protractor.ExpectedConditions;
    selectors = {
        emptyGridNoCheckBox: '.ui-grid-icon-ok',
        title: '.modal-title',
        gridId: '[rx-view-component-id="092ad269-6be6-4240-a867-8af4c8c6e2c9"]',
        gridGuid: '092ad269-6be6-4240-a867-8af4c8c6e2c9',
        applyButton: '[rx-view-component-id="05732013-6207-4a3f-864b-be482cdffa6b"] button',
        cancelButton: '[rx-view-component-id="84e2938d-2e78-4b3a-bbe5-7ffba7e7ebfb"] button',
        gridColumnHeaders: ' .ui-grid-header-cell-label',
        addColumnIcon: 'rx-record-grid-menu.rx-record-grid-toolbar__item_visible-columns .d-icon-ellipsis',
    }

    async clickOnApplyButton(): Promise<void> {
        await browser.wait(this.EC.elementToBeClickable($(this.selectors.applyButton)));
        await $(this.selectors.applyButton).click();
    }

    async clickOnCancelButton(): Promise<void> {
        await browser.wait(this.EC.elementToBeClickable($(this.selectors.cancelButton)));
        await $(this.selectors.cancelButton).click();
    }

    async isEmailTemplateGridEmpty(templateName:string):Promise<boolean>{
        let value= await utilGrid.getSelectedGridRecordValue(this.selectors.gridGuid,'Title');
        return value==templateName ? true : false;
    }

    async isApplyButtonEnabled(): Promise<boolean> {
        await browser.wait(this.EC.visibilityOf($(this.selectors.applyButton)));
        return await $(this.selectors.applyButton).isEnabled();
    }

    async addGridColumn(columnName: string[]): Promise<void> {
        await utilGrid.addGridColumn(this.selectors.gridGuid, columnName);
    }

    async removeGridColumn(columnName: string[]): Promise<void> {
        await utilGrid.removeGridColumn(this.selectors.gridGuid, columnName);
    }

    async getSelectedGridRecordValue(columnHeader: string): Promise<string> {
        return await utilGrid.getSelectedGridRecordValue(this.selectors.gridGuid, columnHeader);
    }

    async areColumnHeaderMatches(columnHeader: string[]): Promise<boolean> {
        return await utilGrid.areColumnHeaderMatches(this.selectors.gridGuid, columnHeader);
    }

    async searchAndSelectEmailTemplate(templateName: string): Promise<void> {
        await utilGrid.searchAndSelectFirstCheckBox(this.selectors.gridGuid, templateName);
    }

    async searchEmailTemplate(templateName: string): Promise<void> {
        await utilGrid.searchOnGridConsole(templateName);
    }

    async getGridRecordValue(columnHeader: string): Promise<string> {
        return await utilGrid.getSelectedGridRecordValue(this.selectors.gridGuid, columnHeader);
    }
}

export default new SelectEmailTemplateBlad();