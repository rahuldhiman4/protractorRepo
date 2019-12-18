import {element, by, $, browser, protractor, ProtractorExpectedConditions } from "protractor";
import utilCommon from '../../utils/util.common';
import utilGrid from '../../utils/util.grid';

class SelectEmailTemplateBlad {
    EC: ProtractorExpectedConditions = protractor.ExpectedConditions;
    selectors = {
        title: '.modal-title',
        gridId: '[rx-view-component-id="092ad269-6be6-4240-a867-8af4c8c6e2c9"]',
        gridGuid: '092ad269-6be6-4240-a867-8af4c8c6e2c9',
        applyButton: '[rx-view-component-id="05732013-6207-4a3f-864b-be482cdffa6b"] button',
        cancelButton: '[rx-view-component-id="84e2938d-2e78-4b3a-bbe5-7ffba7e7ebfb"] button',
        gridColumnHeaders: ' .ui-grid-header-cell-label',
        addColumnIcon: 'rx-record-grid-menu.rx-record-grid-toolbar__item_visible-columns .d-icon-ellipsis',
    }

    async isApplyButtonDisabled():Promise<boolean>{
        await browser.wait(this.EC.visibilityOf($(this.selectors.applyButton)));
        return await $(this.selectors.applyButton).isEnabled();
    }

    async clickOnColumnListIcon(): Promise<void> {
        await utilGrid.clickOnColumnListIcon();      
    }

    async clickOnAddColumnCheckBox(columnName:string): Promise<void> {
        await utilGrid.clickOnAddColumnCheckBox(this.selectors.gridGuid,columnName);
    }

    async clickOnRemoveColumnCheckBox(columnName:string): Promise<void> {
        await utilGrid.clickOnRemoveColumnCheckBox(this.selectors.gridGuid,columnName);
    }

    async getSelectedGridRecordValue(columnHeader:string): Promise<string> {
        return await utilGrid.getSelectedGridRecordValue(this.selectors.gridGuid,columnHeader);
    }
    
    async getTextOfGridColumnHeader(columnHeader:string): Promise<string> {
        var customxpath = `//rx-record-grid[@rx-view-component-id="092ad269-6be6-4240-a867-8af4c8c6e2c9"]//span[@class="ui-grid-header-cell-label" and text()="${columnHeader}"]`;
        await browser.wait(this.EC.elementToBeClickable(element(by.xpath(customxpath))));
        return await element(by.xpath(customxpath)).getText();        
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

export default new SelectEmailTemplateBlad();