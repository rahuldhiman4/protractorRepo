import { $, $$, protractor, ProtractorExpectedConditions } from "protractor";

class RequesterResponseBlade {
    EC: ProtractorExpectedConditions = protractor.ExpectedConditions;
    selectors = {
        bladeHeading: '.dp-title',
        dynamicFieldsName: '.simple-field .form-control-label',
        okButton:'[rx-view-component-id="d459dabe-1ccb-4776-b121-874ed4ded902"] button', 
    }

    async isDynamicFieldDisplayed(fieldName:string):Promise<boolean>{
        let fieldsNameCount= await $$(this.selectors.dynamicFieldsName).count(); 
        for(let i=0;i<fieldsNameCount;i++){
           let field = await (await $$(this.selectors.dynamicFieldsName).get(i).getText()).trim();
           if(field==fieldName) return true;
        }  
        return false;
    }

    async getBladeHeading(): Promise<string> {
        return await $(this.selectors.bladeHeading).getText();
    }
    async isRequesterBladePresent():Promise<boolean>{
        return await $(this.selectors.okButton).isPresent();
    }
    async clickOkButton():Promise<void>{    
        await $(this.selectors.okButton).click();
    }
    async isDynamicGroupDisplayed(groupName:string):Promise<boolean>{
        return await $(`[rx-view-component-id="11234e45-37d9-45a5-b77e-11217a3133d0"] .group-container__name__title[title=${groupName}]`).isDisplayed();
    }
}
export default new RequesterResponseBlade();