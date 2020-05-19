import { $,$$,by,element, protractor, ProtractorExpectedConditions } from "protractor";
import utilGrid from '../../../utils/util.grid';
import utilCommon from '../../../utils/util.common';

class CreateDynamicFieldLibrary {
    EC: ProtractorExpectedConditions = protractor.ExpectedConditions;

    selectors = {
        title: '.rx-search-option-container .d-textfield__item',
        cancelButton: '[rx-view-component-id="39134e3e-3a8c-40cd-8a20-b4c90ca7fce9"] button',
        fieldName:'[rx-view-component-id="3f126998-430d-4d80-9061-e6bb90ddcef5"] .d-textfield__input',
        localizeButton:'[rx-view-component-id="827cea0b-82d6-4741-8051-1cc52b83b770"] button',
        status:'83773352-ff5c-4143-9b2d-116dc64c03cd',
        fieldValueType:'bfcc7610-2202-45aa-87b7-bc37af6e8954',
        informationSoucre:'b9b14785-4b48-4fde-83ac-dc012eb36858',
        saveButton:'[rx-view-component-id="2f8db2c3-2352-4732-81b9-fdaf46ccbde7"] button',
    }

    async clickOnSaveButton():Promise<void>{
        await $(this.selectors.saveButton).click();
    }
    async setFieldName(value:string):Promise<void>{
        await $(this.selectors.fieldName).sendKeys(value);
    }

    async clickOnLocalizeButton():Promise<void>{
        await $(this.selectors.localizeButton).click();
    }

    async setFieldValueType(value:string){
        await utilCommon.selectDropDown(this.selectors.fieldValueType,value)
    }

    async setInformationSourceValueType(value:string){
        await utilCommon.selectDropDown(this.selectors.informationSoucre,value);
    }

    async setStatusValue(value:string){
        await utilCommon.selectDropDown(this.selectors.status,value)
    }
    
    async isHiddenFieldPresent(value: string): Promise<boolean> {
        return await element(by.cssContainingText(this.selectors.title,value)).isPresent();    
    }

    async cancelButton(): Promise<void> {
        await $(this.selectors.cancelButton).click();
    }
}

export default new CreateDynamicFieldLibrary();