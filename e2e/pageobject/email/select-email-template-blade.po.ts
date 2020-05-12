import { $, protractor, ProtractorExpectedConditions } from "protractor";
import utilCommon from '../../utils/util.common';
import utilGrid from '../../utils/util.grid';
import utilityGrid from '../../utils/utility.grid';

class SelectEmailTemplateBlad {
    EC: ProtractorExpectedConditions = protractor.ExpectedConditions;
    selectors = {
        emptyGridNoCheckBox: '[rx-view-component-id="092ad269-6be6-4240-a867-8af4c8c6e2c9"] .radio__label input',
        title: '.modal-title',
        gridId: '[rx-view-component-id="092ad269-6be6-4240-a867-8af4c8c6e2c9"]',
        gridGuid: '092ad269-6be6-4240-a867-8af4c8c6e2c9',
        applyButton: '[rx-view-component-id="05732013-6207-4a3f-864b-be482cdffa6b"] button',
        cancelButton: '[rx-view-component-id="84e2938d-2e78-4b3a-bbe5-7ffba7e7ebfb"] button',
        gridColumnHeaders: '[rx-view-component-id="092ad269-6be6-4240-a867-8af4c8c6e2c9"] .c-header-name'
    }

    async clickOnApplyButton(): Promise<void> {
        //        await browser.wait(this.EC.elementToBeClickable($(this.selectors.applyButton)));
        await $(this.selectors.applyButton).click();
        await utilCommon.waitUntilSpinnerToHide(); // wait required to populate email template text in compose email
    }

    async clickOnCancelButton(): Promise<void> {
        //        await browser.wait(this.EC.elementToBeClickable($(this.selectors.cancelButton)));
        await $(this.selectors.cancelButton).click();
    }

    async isEmailTemplateGridEmpty(templateName: string): Promise<boolean> {
        let value = await utilGrid.getSelectedGridRecordValue(this.selectors.gridGuid, 'Title');
        return value == templateName ? true : false;
    }

    async isApplyButtonEnabled(): Promise<boolean> {
        //        await browser.wait(this.EC.visibilityOf($(this.selectors.applyButton)));
        return await $(this.selectors.applyButton).isEnabled();
    }

    async addGridColumn(columnName: string[]): Promise<void> {
        await utilityGrid.addGridColumn(columnName,this.selectors.gridGuid);
    }

    async removeGridColumn(columnName: string[]): Promise<void> {
        await utilityGrid.removeGridColumn(columnName,this.selectors.gridGuid);
    }

    async getSelectedGridRecordValue(columnHeader: string): Promise<string> {
        return await utilGrid.getSelectedGridRecordValue(this.selectors.gridGuid, columnHeader);
    }

    async areColumnHeaderMatches(columnHeader: string[]): Promise<boolean> {
        return await utilityGrid.areColumnHeaderMatches(columnHeader,this.selectors.gridGuid);
    }

    async searchAndSelectEmailTemplate(templateName: string): Promise<void> {
        await utilityGrid.searchAndSelectGridRecord(templateName, this.selectors.gridGuid);
    }

    async searchEmailTemplate(templateName: string): Promise<void> {
        await utilityGrid.searchRecord(templateName, this.selectors.gridGuid);
    }

    async getGridRecordValue(columnHeader: string): Promise<string> {
        return await utilityGrid.getFirstGridRecordColumnValue(columnHeader, this.selectors.gridGuid);
    }
}

export default new SelectEmailTemplateBlad();