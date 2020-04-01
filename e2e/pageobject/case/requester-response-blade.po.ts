import { $, $$, protractor, ProtractorExpectedConditions } from "protractor";

class RequesterResponseBlade {
    EC: ProtractorExpectedConditions = protractor.ExpectedConditions;
    selectors = {
        bladeHeading: 'h3.modal-title',
        dynamicFieldsName: '[rx-view-component-id="4142c923-6eb9-4cae-9fe4-8ca8bde92702"] .label-wrapper',
        okButton:'[rx-view-component-id="d459dabe-1ccb-4776-b121-874ed4ded902"] button',
    }

    async isDynamicFieldDisplayed(fieldName:string):Promise<boolean>{
        let fieldsNameCount= await $$(this.selectors.dynamicFieldsName).count(); 
        for(let i=0;i<fieldsNameCount;i++){
           let field=await $$(this.selectors.dynamicFieldsName).get(i).getText();
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
        return await $(`[rx-view-component-id="4142c923-6eb9-4cae-9fe4-8ca8bde92702"] .group-container div[title=${groupName}]`).isDisplayed();
    }
}
export default new RequesterResponseBlade();