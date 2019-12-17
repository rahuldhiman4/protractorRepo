import {element, by, $, browser, protractor, ProtractorExpectedConditions } from "protractor";
import utilCommon from '../../utils/util.common';
import utilGrid from '../../utils/util.grid';

class ComposeMail {
    EC: ProtractorExpectedConditions = protractor.ExpectedConditions;
    selectors = {
        title: '.modal-title',
        gridId: '[rx-view-component-id="092ad269-6be6-4240-a867-8af4c8c6e2c9"]',
        gridGuid: '092ad269-6be6-4240-a867-8af4c8c6e2c9',
        applyButton: '[rx-view-component-id="05732013-6207-4a3f-864b-be482cdffa6b"] button',
        cancelButton: '[rx-view-component-id="84e2938d-2e78-4b3a-bbe5-7ffba7e7ebfb"] button',
        gridColumnHeaders: ' .ui-grid-header-cell-label'
    }

    async getSelectedGridRecordValue(columnHeader:string): Promise<string> {
        return await utilGrid.getSelectedGridRecordValue(this.selectors.gridGuid,columnHeader);
    }
    
    async getTextOfGridColumnHeader(columnHeader:string): Promise<string> {
        await browser.wait(this.EC.elementToBeClickable($(this.selectors.gridId)));
        return await element(by.cssContainingText((this.selectors.gridId + this.selectors.gridColumnHeaders), columnHeader)).getText();
    }

    async searchAndSelectEmailTemplate(templateName:string): Promise<void> {
        await utilGrid.searchAndSelectFirstCheckBox(this.selectors.gridGuid,templateName);
    } 

    async searchEmailTemplate(templateName:string): Promise<void> {
        await utilGrid.searchRecord(templateName);
    } 

    async getGridRecordValue(columnHeader:string): Promise<string> {
        return await utilGrid.getSelectedGridRecordValue(this.selectors.gridGuid,columnHeader);
    } 

    
}

export default new ComposeMail();